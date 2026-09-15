/* global process */
import { PRODUCTS } from '../src/utils/data.js';

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = null;

const normalize = (value = '') => value.toLowerCase()
  .replace(/\bnad\s*\+\b/g, 'nad')
  .replace(/\b(one|1)\s+month\b/g, '1mo')
  .replace(/\b(two|2)\s+months?\b/g, '2mo')
  .replace(/\b(three|3)\s+months?\b/g, '3mo')
  .replace(/\b(four|4)\s+months?\b/g, '4mo')
  .replace(/\b(six|6)\s+months?\b/g, '6mo')
  .replace(/\b(twelve|12)\s+months?\b/g, '12mo')
  .replace(/\bconsultations?\b/g, 'consultation')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const tokens = value => new Set(normalize(value).split(' ').filter(token => token.length > 1));

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  return (2 * [...a].filter(token => b.has(token)).length) / (a.size + b.size);
}

const dosageTokens = value => normalize(value).match(/\b\d+(?:\.\d+)?(?:mg|mo)\b/g) || [];
function dosageCompatible(left, right) {
  const a = dosageTokens(left);
  const b = dosageTokens(right);
  return !a.length || !b.length || a.every(token => b.includes(token));
}

function makeCandidates(products) {
  return products.flatMap(product => product.variants.nodes.map(variant => ({
    shopifyProductId: product.id,
    shopifyVariantId: variant.id,
    handle: product.handle,
    productTitle: product.title,
    variantTitle: variant.title,
    name: variant.title === 'Default Title' ? product.title : `${product.title} ${variant.title}`,
    price: Number(variant.price),
  }))).filter(candidate => Number.isFinite(candidate.price));
}

function matchProduct(localProduct, candidates) {
  const exact = candidates.filter(candidate =>
    dosageCompatible(localProduct.name, candidate.name) &&
    [candidate.name, candidate.productTitle].some(name => normalize(name) === normalize(localProduct.name))
  );
  if (exact.length === 1) return { candidate: exact[0], confidence: 1 };

  const ranked = candidates
    .filter(candidate => dosageCompatible(localProduct.name, candidate.name))
    .map(candidate => ({
      candidate,
      confidence: Math.max(
        similarity(localProduct.name, candidate.name),
        similarity(localProduct.name, candidate.productTitle)
      ),
    }))
    .sort((a, b) => b.confidence - a.confidence);

  if (!ranked[0] || ranked[0].confidence < 0.72) return null;
  if (ranked[1] && ranked[0].confidence - ranked[1].confidence < 0.08) return null;
  return ranked[0];
}

async function fetchActiveShopifyProducts() {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2026-07';
  if (!token || !domain) throw new Error('Shopify is not configured.');
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) {
    throw new Error('SHOPIFY_STORE_DOMAIN must be a valid *.myshopify.com domain.');
  }

  const allProducts = [];
  let cursor = null;
  do {
    const response = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `query ActiveProducts($after: String) {
          products(first: 100, after: $after, query: "status:active") {
            nodes {
              id title handle
              variants(first: 100) { nodes { id title price } }
            }
            pageInfo { hasNextPage endCursor }
          }
        }`,
        variables: { after: cursor },
      }),
    });
    if (!response.ok) throw new Error(`Shopify request failed (${response.status}).`);
    const payload = await response.json();
    if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join('; '));
    const connection = payload.data?.products;
    if (!connection) throw new Error('Shopify returned an invalid products response.');
    allProducts.push(...connection.nodes);
    cursor = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (cursor);
  return allProducts;
}

export async function getShopifyPriceSync({ force = false } = {}) {
  if (!force && cache && Date.now() - cache.createdAt < CACHE_TTL_MS) return cache.value;

  const shopifyProducts = await fetchActiveShopifyProducts();
  const candidates = makeCandidates(shopifyProducts);
  const matches = [];
  const unmatched = [];
  for (const product of PRODUCTS) {
    if (product.id === 'shipping') continue;
    const result = matchProduct(product, candidates);
    if (!result) {
      unmatched.push({ id: product.id, name: product.name, currentPrice: product.price });
      continue;
    }
    matches.push({
      id: product.id,
      name: product.name,
      oldPrice: product.price,
      price: result.candidate.price,
      shopifyTitle: result.candidate.name,
      shopifyHandle: result.candidate.handle,
      confidence: Number(result.confidence.toFixed(3)),
    });
  }

  const value = {
    prices: Object.fromEntries(matches.map(match => [match.id, match.price])),
    matches,
    unmatched,
    shopifyProductCount: shopifyProducts.length,
    syncedAt: new Date().toISOString(),
  };
  cache = { createdAt: Date.now(), value };
  return value;
}
