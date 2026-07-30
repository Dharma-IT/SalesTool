import React from 'react';
import { getPaymentPlan } from '../utils/data';
import { Check, Leaf, Pill, Package, Plus, Minus, Truck } from 'lucide-react';

const ProductCard = ({ product, quantity = 0, onIncrement, onDecrement }) => {
  const isSelected = quantity > 0;
  const paymentPlan = getPaymentPlan([product]);
  const isSupplement = product.category === 'supplement';
  const isService = product.category === 'service';
  const isMedicine = product.category === 'medicine';
  const isShipping = product.id === 'shipping';

  const getIcon = () => {
    if (isShipping) return <Truck size={14} color="#6b7280" />;
    if (isSupplement) return <Leaf size={14} color="#14532d" />;
    if (isService) return <Package size={14} color="#0d9488" />;
    if (isMedicine) return <Pill size={14} color="var(--primary)" />;
    return <Pill size={14} color="var(--primary)" />;
  };

  const getCategoryLabel = () => {
    if (isShipping) return 'Shipping';
    if (isSupplement) return 'Supplement';
    if (isService) return 'Service';
    if (isMedicine) return 'Medicine';
    return 'Product';
  };

  const getCategoryColor = () => {
    if (isShipping) return { bg: '#f3f4f6', text: '#6b7280' };
    if (isSupplement) return { bg: '#dcfce7', text: '#14532d' };
    if (isService) return { bg: '#ccfbf1', text: '#0d9488' };
    if (isMedicine) return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fef3c7', text: '#92400e' };
  };

  const categoryColor = getCategoryColor();

  return (
    <div
      className={`card product-card ${isSelected ? 'selected' : ''} animate-in`}
      style={{
        padding: '1.75rem',
        borderRadius: '24px',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
        transform: isSelected ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: isSelected
          ? '0 30px 60px -15px rgba(212, 175, 55, 0.25), 0 0 0 1px var(--primary)'
          : '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.55)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '24px',
          background: 'var(--primary)',
          color: 'white',
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 4px 15px var(--primary-glow)',
          animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <Check size={16} strokeWidth={3} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
          {getIcon()}
          <span style={{
            fontSize: '0.625rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: categoryColor.text,
            background: categoryColor.bg,
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            {getCategoryLabel()}
          </span>
        </div>

        <h3 style={{
          fontSize: '1rem',
          fontWeight: '700',
          lineHeight: '1.35',
          marginBottom: product.usage ? '0.75rem' : '1.5rem',
          minHeight: '2.8rem',
          color: 'var(--text-main)',
          letterSpacing: '-0.01em'
        }}>
          {product.name}
        </h3>

        {product.usage && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 0.875rem',
            borderRadius: '12px',
            background: 'rgba(20, 83, 45, 0.08)',
            border: '1px solid rgba(20, 83, 45, 0.14)',
            color: '#14532d',
            fontSize: '0.8125rem',
            fontWeight: '700',
            lineHeight: 1.35
          }}>
            {product.usage}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            ${product.price ? product.price.toLocaleString() : '0.00'}
          </div>

          {paymentPlan && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(4px)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biweekly</span>
                <span style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-main)' }}>${paymentPlan.biweekly}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>6 Months</span>
                <span style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-main)' }}>${paymentPlan.sixMonth}</span>
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={onDecrement}
              disabled={quantity === 0}
              onMouseEnter={(e) => {
                if (quantity > 0) {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = quantity > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)';
                e.currentTarget.style.color = quantity > 0 ? 'var(--text-main)' : 'var(--text-muted)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: quantity > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                color: quantity > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: quantity > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Minus size={18} />
            </button>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', minWidth: '30px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.8)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes popIn {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(5deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ProductCard;
