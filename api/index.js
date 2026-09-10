import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { getShopifyPriceSync } from './shopify-prices.js';

// Load .env only in local development
// Note: In Vercel, use Environment Variables in the dashboard instead
if (process.env.NODE_ENV !== 'production') {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    dotenv.config({ path: resolve(__dirname, '..', '.env.local') });
  } catch (e) {
    console.log('Skipping dotenv loading in production or non-file environment');
  }
}

const app = express();

// Initialize Stripe with key from environment variables
const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripeConfigured: !!stripeKey,
    shopifyConfigured: !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN),
    environment: process.env.NODE_ENV || 'development'
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

// Simple CSV row parser that handles quoted fields
function parseCSVRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

// Fetch and parse the Google Sheet links
app.get('/api/sheet-links', async (req, res) => {
  try {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1JoLZ8Z98ZJHS0PNFk2IsBGelBwo9uCwkjW2ICbJtwaQ/export?format=csv&gid=1703012138';
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`);
    const csv = await response.text();

    // Split into rows (handle both \r\n and \n)
    const rows = csv.split(/\r?\n/).map(r => parseCSVRow(r));

    // Left table (PRX Pharmacy): col2 = LINK NAME, col3 = CREATED LINKS
    // Right table (Absolute): col7 = LINK TAGS, col8 = CREATED LINKS
    // Row 0 = domain header, Row 1 = column headers, Rows 2+ = data
    const links = {};

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 4) continue;

      // Skip legacy/current provider separator rows.
      if (row[0] === 'STRIVE' || row[0] === 'PRX') continue;

      // Left (PRX Pharmacy) table
      const prxName = row[2];
      const prxLink = row[3];
      const prxTag = row[0];
      if (prxName && prxLink && prxLink.startsWith('http')) {
        if (!links[prxName]) links[prxName] = { displayName: prxTag };
        links[prxName].prxLink = prxLink;
      }

      // Right (Absolute) table
      const absRawTag = row[7];
      const absLink = row[8];
      if (absRawTag && absLink && absLink.startsWith('http')) {
        // Normalize: "Absolute + Sema1mg" → "Sema1mg", "Absolute + Sema Microdose" → "SemaMicro"
        let baseTag = absRawTag
          .replace(/^Absolute \+ /i, '')
          .replace(/^Sema Microdose$/i, 'SemaMicro')
          .trim();
        if (!links[baseTag]) links[baseTag] = { displayName: row[5] || baseTag };
        links[baseTag].absoluteLink = absLink;
      }
    }

    res.json(links);
  } catch (error) {
    console.error('Error fetching sheet links:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// Create Stripe Payment Link endpoint
app.post('/api/create-payment-link', async (req, res) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
    }

    const { products, paymentType, totalWithFee, feeAmount, splitPayment } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'No products provided' });
    }

    const isInstallment = paymentType && paymentType.toLowerCase() === 'installment';

    if (splitPayment) {
      const totalCents = Math.round(Number(totalWithFee) * 100);
      if (!Number.isSafeInteger(totalCents) || totalCents < 2) {
        return res.status(400).json({ error: 'The payment total must be at least $0.02 to split.' });
      }

      const amounts = [Math.floor(totalCents / 2), Math.ceil(totalCents / 2)];
      const splitGroup = `split_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const links = await Promise.all(amounts.map((amount, index) => {
        const config = {
          line_items: [{
            price_data: {
              currency: 'usd',
              unit_amount: amount,
              product_data: {
                name: `Dharma order - Part ${index + 1} of 2`,
                metadata: { category: 'split_payment', split_part: String(index + 1) },
              },
            },
            quantity: 1,
          }],
          phone_number_collection: { enabled: true },
          after_completion: { type: 'redirect', redirect: { url: 'https://dharmanutritionclinic.com' } },
          metadata: { order_type: isInstallment ? 'installment' : 'onetime', split_payment: 'true', split_group: splitGroup, split_part: String(index + 1), split_total: '2' },
        };
        if (isInstallment) config.payment_method_types = ['card', 'afterpay_clearpay', 'klarna', 'affirm'];
        return stripe.paymentLinks.create(config);
      }));
      const urls = links.map(link => link.url);
      return res.json({ urls, amounts: amounts.map(amount => amount / 100) });
    }

    const lineItems = [];

    // 1. Add individual products as line items
    for (const product of products) {
      const unitPrice = product.price || 0;
      const qty = product.quantity || 1;

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

    // 3. Create the Payment Link with Automatic Tax and Phone Number Collection enabled
    const paymentLinkConfig = {
      line_items: lineItems,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      phone_number_collection: { enabled: true },
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

    res.json({ url: paymentLink.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Export the Express app for Vercel
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production' && process.env.RUN_LOCAL === 'true') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Local API server running on http://localhost:${PORT}`));
}
