import { useState } from 'react';
import { X, LogOut, CalendarDays, Search, CheckCircle2, CreditCard } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const getEasternDate = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
  return `${value.year}-${value.month}-${value.day}`;
};

export default function StripeDashboard({ session, onClose, locked = false }) {
  const [stripeDate, setStripeDate] = useState(getEasternDate);
  const [stripeFetchedDate, setStripeFetchedDate] = useState('');
  const [stripePayments, setStripePayments] = useState([]);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const fetchStripePayments = async (event) => {
    event.preventDefault();
    setStripeLoading(true);
    setStripeError('');
    try {
      const response = await fetch(`/api/stripe-payments?date=${encodeURIComponent(stripeDate)}`, {
        headers: { Authorization: `Bearer ${session?.access_token || ''}` },
      });
      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        const contentType = response.headers.get('content-type') || '';
        const detail = response.status ? ` (HTTP ${response.status})` : '';
        throw new Error(
          contentType.includes('text/html')
            ? `The payments API route returned the website instead of API data${detail}. Check the deployment's API routing.`
            : `The payments API returned an invalid response${detail}.`
        );
      }
      if (!responseText) {
        throw new Error(`The payments API returned an empty response (HTTP ${response.status}).`);
      }
      if (!response.ok) throw new Error(data.error || 'Unable to fetch Stripe payments.');
      setStripePayments(data.payments || []);
      setStripeFetchedDate(stripeDate);
    } catch (error) {
      setStripePayments([]);
      setStripeError(error.message);
    } finally {
      setStripeLoading(false);
    }
  };

  return (
                  <div className="stripe-dashboard-overlay" role="dialog" aria-modal="true" aria-labelledby="stripe-dashboard-title">
                    <section className="stripe-dashboard-panel">
                      <header className="stripe-dashboard-header">
                        <div>
                          <div className="stripe-dashboard-eyebrow">PAYMENTS</div>
                          <h2 id="stripe-dashboard-title">Stripe Dashboard</h2>
                        </div>
                        {locked ? (
                          <button type="button" className="stripe-dashboard-close" onClick={() => supabase.auth.signOut()} aria-label="Sign out" title="Sign out">
                            <LogOut size={22} />
                          </button>
                        ) : (
                          <button type="button" className="stripe-dashboard-close" onClick={onClose} aria-label="Close Stripe Dashboard">
                            <X size={22} />
                          </button>
                        )}
                      </header>
                      <div className="stripe-dashboard-content">
                        <form
                          className="stripe-dashboard-toolbar"
                          onSubmit={fetchStripePayments}
                        >
                          <label className="stripe-date-field">
                            <span>Date to fetch</span>
                            <span className="stripe-date-input-wrap">
                              <CalendarDays size={18} />
                              <input
                                type="date"
                                value={stripeDate}
                                onChange={(event) => setStripeDate(event.target.value)}
                                required
                              />
                            </span>
                          </label>

                          <div className="stripe-status-field">
                            <span>Status</span>
                            <div className="stripe-status-value">
                              <CheckCircle2 size={17} />
                              Succeeded
                            </div>
                          </div>

                          <button className="stripe-fetch-button" type="submit" disabled={stripeLoading}>
                            <Search size={17} />
                            {stripeLoading ? 'Fetching…' : 'Fetch payments'}
                          </button>
                        </form>

                        {stripeError && <div className="stripe-fetch-error" role="alert">{stripeError}</div>}

                        <div className="stripe-results-meta">
                          <div>
                            <h3>Succeeded payments</h3>
                            <p>
                              {stripeFetchedDate
                                ? `Transactions for ${new Date(`${stripeFetchedDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`
                                : 'Choose a date to view transactions'}
                            </p>
                          </div>
                          <span className="stripe-result-count">{stripePayments.length} {stripePayments.length === 1 ? 'payment' : 'payments'}</span>
                        </div>

                        <div className="stripe-table-wrap">
                          <table className="stripe-payments-table">
                            <thead>
                              <tr>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Phone number</th>
                                <th>Amount paid</th>
                                <th>Payment method</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stripePayments.map((payment) => (
                                <tr key={payment.id}>
                                  <td>{payment.customer}</td>
                                  <td>{payment.email}</td>
                                  <td>{payment.phone}</td>
                                  <td className="stripe-payment-amount">
                                    {new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: payment.currency?.toUpperCase() || 'USD',
                                    }).format((payment.amountPaid || 0) / 100)}
                                  </td>
                                  <td>{payment.paymentMethod}</td>
                                </tr>
                              ))}
                              {stripePayments.length === 0 && (
                                <tr>
                                  <td className="stripe-table-empty" colSpan="5">
                                    <div className="stripe-empty-icon"><CreditCard size={24} /></div>
                                    <strong>{stripeFetchedDate ? 'No succeeded payments found' : 'No date selected yet'}</strong>
                                    <span>{stripeFetchedDate ? 'There are no payments to display for this Eastern Time date.' : 'Select a date above, then fetch payments.'}</span>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  </div>
  );
}
