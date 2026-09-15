import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { getShopifyPriceSync } from '../api/_shopify-prices.js';
import { getSucceededStripePayments } from '../api/_stripe-payments.js';
import { requireAuthenticatedUser } from '../api/_auth.js';

// Load .env.local explicitly (dotenv only loads .env by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const app = express();

// Validate Stripe key is available
const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌ ERROR: No Stripe secret key found! Make sure .env.local contains STRIPE_SECRET_KEY.');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);
console.log('✅ Stripe initialized with key:', stripeKey.substring(0, 12) + '...');

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripeConfigured: !!stripeKey,
    shopifyConfigured: !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN)
  });
});

app.get('/api/shopify-prices', async (req, res) => {
  try {
    const result = await getShopifyPriceSync({ force: req.query.refresh === 'true' });
    res.set('Cache-Control', 'private, max-age=300');
    if (req.query.details === 'true') return res.json(result);
    res.json({ prices: result.prices, syncedAt: result.syncedAt });
  } catch (error) {
    console.error('Shopify price sync error:', error.message);
    res.status(502).json({ error: error.message });
  }
});

app.get('/api/stripe-payments', async (req, res) => {
  try {
    await requireAuthenticatedUser(req);
    const result = await getSucceededStripePayments(stripe, req.query.date);
    res.set('Cache-Control', 'private, no-store');
    res.json(result);
  } catch (error) {
    console.error('Stripe payment fetch error:', error.message);
    res.status(error.statusCode || 502).json({ error: error.message });
  }
});

app.post('/api/create-payment-link', async (req, res) => {
  try {
    const { products, paymentType, totalWithFee, feeAmount, splitPayment, splitPart, splitCount, firstPaymentAmount, splitGroup } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'No products provided' });
    }

    // Determine if this is an installment order (case-insensitive check)
    const isInstallment = paymentType && paymentType.toLowerCase() === 'installment';

    if (splitPayment) {
      const totalCents = Math.round(Number(totalWithFee) * 100);
      if (!Number.isSafeInteger(totalCents) || totalCents < 2) {
        return res.status(400).json({ error: 'The payment total must be at least $0.02 to split.' });
      }

      const count = Number(splitCount);
      const part = Number(splitPart);
      if (!Number.isInteger(count) || count < 2 || count > 5 || !Number.isInteger(part) || part < 1 || part > count) return res.status(400).json({ error: 'Invalid split payment configuration.' });
      const customFirstCents = firstPaymentAmount === null || firstPaymentAmount === undefined ? null : Math.round(Number(firstPaymentAmount) * 100);
      const remainingCents = customFirstCents === null ? totalCents : totalCents - customFirstCents;
      const remainingLinks = customFirstCents === null ? count : count - 1;
      if ((customFirstCents !== null && (!Number.isSafeInteger(customFirstCents) || customFirstCents < 1)) || remainingCents < remainingLinks) return res.status(400).json({ error: 'Invalid first payment amount.' });
      const baseAmount = Math.floor(remainingCents / remainingLinks);
      const extraCents = remainingCents % remainingLinks;
      const remainderAmounts = Array.from({ length: remainingLinks }, (_, index) => baseAmount + (index < extraCents ? 1 : 0));
      const amounts = customFirstCents === null ? remainderAmounts : [customFirstCents, ...remainderAmounts];
      const amount = amounts[part - 1];
      const config = {
        line_items: [{ price_data: { currency: 'usd', unit_amount: amount, product_data: { name: `Dharma order - Part ${part} of ${count}`, metadata: { category: 'split_payment', split_part: String(part) } } }, quantity: 1 }],
        phone_number_collection: { enabled: true },
        after_completion: { type: 'redirect', redirect: { url: 'https://dharmanutritionclinic.com' } },
        metadata: { order_type: isInstallment ? 'installment' : 'onetime', split_payment: 'true', split_group: String(splitGroup || ''), split_part: String(part), split_total: String(count) },
      };
      if (isInstallment) config.payment_method_types = ['card', 'afterpay_clearpay', 'klarna', 'affirm'];
      const link = await stripe.paymentLinks.create(config);
      return res.json({ url: link.url, amount: amount / 100, part });
    }

    console.log(`--- Creating Payment Link ---`);
    console.log(`Products: ${products.length}`);
    console.log(`Items: ${products.map(p => p.name).join(', ')}`);
    console.log(`Type: ${paymentType}${isInstallment ? ' (Triggering Fee Logic)' : ''}`);
    console.log(`Total Sent: ${totalWithFee}, Fee Sent: ${feeAmount}`);

    const lineItems = [];
    
    // 1. Add individual products as line items
    console.log(`Processing ${products.length} products...`);
    for (const product of products) {
      const unitPrice = product.price || 0;
      const qty = product.quantity || 1;
      
      console.log(`- Adding item: ${product.name} @ $${unitPrice} x${qty}`);
      
      const stripeProduct = await stripe.products.create({
        name: product.name,
        metadata: {
          category: product.category || 'general',
          local_id: product.id || '',
        },
      });

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(unitPrice * 100),
        currency: 'usd',
      });

      lineItems.push({ price: price.id, quantity: qty });
    }

    // 2. Add installment fee as a separate line item if applicable
    if (isInstallment) {
      console.log(`Adding installment fee line item: $${feeAmount}`);
      
      const feeProduct = await stripe.products.create({
        name: 'Processing & Handling (6%)',
        metadata: {
          category: 'fee',
          payment_type: 'installment'
        },
      });

      const feePrice = await stripe.prices.create({
        product: feeProduct.id,
        unit_amount: Math.round((feeAmount || 0) * 100),
        currency: 'usd',
      });

      lineItems.push({ price: feePrice.id, quantity: 1 });
    }

    // Create the Payment Link
    const paymentLinkConfig = {
      line_items: lineItems,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['US']
      },
      tax_id_collection: { enabled: true },
      after_completion: {
        type: 'redirect',
        redirect: { url: 'https://dharmanutritionclinic.com' },
      },
      metadata: {
        order_type: isInstallment ? 'installment' : 'onetime'
      }
    };

    if (isInstallment) {
      paymentLinkConfig.payment_method_types = ['card', 'afterpay_clearpay', 'klarna', 'affirm'];
    }

    const paymentLink = await stripe.paymentLinks.create(paymentLinkConfig);

    console.log('✅ Payment link created:', paymentLink.id);
    res.json({ url: paymentLink.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
