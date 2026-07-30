import React from 'react';
import { CreditCard, Copy, Check } from 'lucide-react';
import { getProductEmoji } from '../utils/data';

const InvoiceView = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!data || !data.amount) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <p>Invalid invoice link.</p>
      </div>
    );
  }

  const paymentMethods = [
    { name: 'Zelle', lines: [{ label: 'Name', value: 'Dharma Nutrition Clinic' }, { label: 'Email', value: 'admin@dharmanutritionclinic.com' }, { label: 'Phone', value: '9546680123' }] },
    { name: 'Venmo', lines: [{ label: 'Name', value: 'Dharma Nutrition Clinic' }, { label: 'User', value: '@dharmanutritionclinic' }] },
    { name: 'CashApp', lines: [{ label: 'Name', value: 'Dharma Nutrition Clinic' }, { label: 'User', value: '$dharmanutrition' }] }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="card glass animate-in" style={{ width: '100%', maxWidth: '500px', background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
        <div style={{ background: 'var(--primary)', padding: '2.5rem 2rem', color: '#fff', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>$</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.9 }}>Dharma Nutrition Clinic</h1>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>${Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount Due</div>
        </div>

        <div style={{ padding: '2rem' }}>

          {/* Items Breakdown */}
          {data.items && data.items.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.875rem' }}>
                Order Summary
              </h2>
              <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {data.items.map((item, idx) => {
                  const lineTotal = item.unitPrice * item.quantity;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.875rem 1.25rem',
                        borderBottom: idx < data.items.length - 1 ? '1px solid #e2e8f0' : 'none',
                        background: '#ffffff',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9375rem' }}>{item.name}</div>
                        {item.quantity > 1 && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            ${Number(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })} × {item.quantity}
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9375rem', flexShrink: 0, marginLeft: '1rem' }}>
                        ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })}

                {/* Subtotal row (only if there's a discount) */}
                {data.zelleDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '600' }}>Subtotal</span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '600' }}>
                      ${(Number(data.amount) + Number(data.zelleDiscount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Zelle 2% discount row */}
                {data.zelleDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#f0fdf4', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: '700' }}>Zelle/Venmo/CashApp 2% Discount</span>
                    <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: '700' }}>
                      -${Number(data.zelleDiscount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Total row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', background: 'rgba(212,175,55,0.08)', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9375rem', color: '#0f172a', fontWeight: '800' }}>Total Due</span>
                  <span style={{ fontSize: '1.0625rem', color: 'var(--primary)', fontWeight: '800' }}>
                    ${Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {data.type !== 'paylater' ? (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>Select a Payment Method</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {paymentMethods.map((method, methodIdx) => (
                  <div key={method.name} style={{ background: '#f1f5f9', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CreditCard size={20} color="var(--primary)" />
                      {method.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {method.lines.map((line, lineIdx) => {
                        const uniqueIndex = `${methodIdx}-${lineIdx}`;
                        return (
                          <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>{line.label}</div>
                              <div style={{ fontSize: '1.0625rem', color: '#0f172a', fontWeight: '600' }}>{line.value}</div>
                            </div>
                            {line.value.includes('@') || line.value.includes('$') || line.label === 'Email' || line.label === 'Phone' || line.label === 'User' ? (
                              <button
                                onClick={() => handleCopy(line.value, uniqueIndex)}
                                style={{ background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '0.75rem', fontWeight: '700', color: '#334155', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', transition: 'background 0.2s' }}
                              >
                                {copiedIndex === uniqueIndex ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                {copiedIndex === uniqueIndex ? 'Copied' : 'Copy'}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '1rem 0' }}>
              <div style={{
                background: '#0f172a',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.9375rem',
                lineHeight: '1.8',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                <div style={{ marginBottom: '1rem' }}>💊 Compounded Semaglutide</div>
                <div style={{ marginBottom: '1rem' }}>📸 Instagram: @dharma.clinic</div>

                {data.items && data.items.map((item, idx) => (
                  <div key={idx}> {getProductEmoji(item)} {item.name}</div>
                ))}

                <div style={{ marginTop: '1.5rem' }}>🤝 Complete and dedicated accompaniment throughout the entire treatment.</div>
                <div style={{ marginBottom: '1.5rem' }}>💰 ${Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                <div style={{ color: '#94a3b8' }}>⏰ Valid until today 11:59pm:</div>
                <div style={{ color: '#818cf8', textDecoration: 'underline' }}>{data.stripeLink}</div>

                <div style={{ marginTop: '2.5rem' }}>
                  <a
                    href={data.stripeLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '1.125rem',
                      fontSize: '1rem',
                      fontWeight: '800',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      borderRadius: '16px',
                      color: '#fff',
                      fontFamily: 'sans-serif'
                    }}
                  >
                    Pay with Credit Card
                  </a>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <p style={{ fontSize: '0.9375rem', color: '#9a7b21', fontWeight: '700', margin: 0, textAlign: 'center', lineHeight: '1.4' }}>
              Important: Please include your name in the payment memo so we can match your order!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
