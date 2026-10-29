/* global process */
let cachedToken;
let pendingToken;

export function shopifyDomain() {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) throw new Error('SHOPIFY_STORE_DOMAIN must be a valid *.myshopify.com domain.');
  return domain;
}

export async function getShopifyToken() {
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;
  if (pendingToken) return pendingToken;
  pendingToken = (async () => {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error('Shopify client credentials are not configured.');
    const response = await fetch(`https://${shopifyDomain()}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
      signal: AbortSignal.timeout(20000),
    });
    const payload = await response.json();
    if (!response.ok || !payload.access_token) throw new Error(`Shopify token exchange failed (${response.status}). Check that the app is installed on this store and its credentials are correct.`);
    cachedToken = { value: payload.access_token, expiresAt: Date.now() + Math.max(0, Number(payload.expires_in || 86400) - 60) * 1000 };
    return cachedToken.value;
  })();
  try { return await pendingToken; } finally { pendingToken = null; }
}

export async function searchShopifyOrders(term, after) {
  if (typeof term !== 'string' || !term.trim() || term.length > 150 || (after && (typeof after !== 'string' || after.length > 1000))) {
    throw Object.assign(new Error('Enter an order number, customer name, or email (up to 150 characters).'), { statusCode: 400 });
  }
  const value = term.trim().replace(/^#/, '').replace(/[\\"]/g, '\\$&');
  const query = term.includes('@') ? `email:"${value}"` : `name:"${value}" OR customer:"${value}"`;
  const token = await getShopifyToken();
  const response = await fetch(`https://${shopifyDomain()}/admin/api/${process.env.SHOPIFY_API_VERSION || '2026-07'}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({ query: `query SearchOrders($query: String!, $after: String) {
      orders(first: 25, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
        nodes { id name createdAt email displayFinancialStatus displayFulfillmentStatus
          customer { displayName }
          totalPriceSet { shopMoney { amount currencyCode } }
        }
        pageInfo { hasNextPage endCursor }
      }
    }`, variables: { query, after: after || null } }),
  });
  if (response.status === 401) cachedToken = null;
  if (!response.ok) throw new Error(`Shopify order request failed (${response.status}).`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join('; '));
  if (!payload.data?.orders) throw new Error('Shopify returned an invalid orders response.');
  return { orders: payload.data.orders.nodes, pageInfo: payload.data.orders.pageInfo };
}
