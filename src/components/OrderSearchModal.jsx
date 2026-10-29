import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const statusLabel = value => (value || 'Unknown').toLowerCase().replaceAll('_', ' ');

export default function OrderSearchModal({ session, onClose }) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const panel = useRef(null);
  const controller = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('input')?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = [...panel.current.querySelectorAll('button:not(:disabled), input, a[href]')];
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      controller.current?.abort();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [onClose]);

  async function search(after) {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError('');
    const term = after ? searched : query.trim();
    if (!after) { setOrders([]); setPageInfo(null); setSearched(term); }
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const params = new URLSearchParams({ q: term });
      if (after) params.set('after', after);
      const response = await fetch(`/api/shopify-orders?${params}`, {
        headers: { Authorization: `Bearer ${currentSession?.access_token || session?.access_token || ''}` }, signal: request.signal,
      });
      let data;
      try { data = await response.json(); } catch { throw new Error('The order search API returned an invalid response. Check that the API server is running.'); }
      if (!response.ok) throw new Error(data.error || 'Unable to search orders.');
      setOrders(previous => after ? [...previous, ...data.orders] : data.orders);
      setPageInfo(data.pageInfo);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (controller.current === request) setLoading(false);
    }
  }

  return (
    <div className="stripe-dashboard-overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panel} className="stripe-dashboard-panel" role="dialog" aria-modal="true" aria-labelledby="order-search-title">
        <header className="stripe-dashboard-header">
          <div><div className="stripe-dashboard-eyebrow">SHOPIFY</div><h2 id="order-search-title">Order Search</h2></div>
          <button type="button" className="stripe-dashboard-close" onClick={onClose} aria-label="Close Order Search"><X size={22} /></button>
        </header>
        <div className="stripe-dashboard-content">
          <form className="stripe-dashboard-toolbar order-search-toolbar" onSubmit={event => { event.preventDefault(); search(); }}>
            <label className="stripe-date-field" htmlFor="order-search-query">Find an order
              <span className="stripe-date-input-wrap"><Search size={18} /><input id="order-search-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Order number, customer name, or email" maxLength={150} required disabled={loading} /></span>
            </label>
            <button type="submit" className="stripe-fetch-button" disabled={loading || !query.trim()}><Search size={18} />{loading ? 'Searching…' : 'Search orders'}</button>
          </form>
          {error && <div className="stripe-fetch-error" role="alert">{error}</div>}
          <div className="stripe-results-meta" aria-live="polite"><div><h3>Shopify orders</h3><p>{searched ? `Results for “${searched}”` : 'Search for an order to view its details.'}</p></div><span className="stripe-result-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
          <div className="stripe-table-wrap" aria-busy={loading}>
            <table className="stripe-payments-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Fulfillment</th></tr></thead>
              <tbody>{orders.map(order => <tr key={order.id}>
                <td><strong>{order.name}</strong></td><td>{order.customer?.displayName || 'Guest'}<br /><small>{order.email || 'No email available'}</small></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="stripe-payment-amount">{new Intl.NumberFormat(undefined, { style: 'currency', currency: order.totalPriceSet.shopMoney.currencyCode }).format(Number(order.totalPriceSet.shopMoney.amount))}</td>
                <td className="order-search-status">{statusLabel(order.displayFinancialStatus)}</td><td className="order-search-status">{statusLabel(order.displayFulfillmentStatus)}</td>
              </tr>)}{orders.length === 0 && <tr><td colSpan="6" className="stripe-table-empty"><div className="stripe-empty-icon"><Search size={24} /></div><strong>{loading ? 'Searching Shopify…' : error ? 'Search unavailable' : searched ? 'No orders found' : 'Find a Shopify order'}</strong><span>{error ? 'Review the message above and try again.' : 'Enter an order number, customer name, or email above.'}</span></td></tr>}</tbody>
            </table>
          </div>
          {pageInfo?.hasNextPage && <button type="button" className="stripe-fetch-button" disabled={loading} onClick={() => search(pageInfo.endCursor)}>{loading ? 'Loading…' : 'Load more orders'}</button>}
        </div>
      </section>
    </div>
  );
}
