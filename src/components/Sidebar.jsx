import React from 'react';
import { MapPin, User, Target, ShoppingCart, ClipboardList, Check, UserCircle, CreditCard, X } from 'lucide-react';
const logo1 = '/logo1.png';

const stepIcons = {
  1: MapPin,
  2: User,
  3: Target,
  4: ShoppingCart,
  5: ClipboardList,
};

const Sidebar = ({ activeStep, maxStep, isOpen, onClose, onStepClick, onSupplementsFaqOpen, onStripeDashboardOpen }) => {
  const steps = [
    { num: 1, label: 'State Selection', active: activeStep === 1, done: activeStep > 1 },
    { num: 2, label: 'Biometrics', active: activeStep === 2, done: activeStep > 2 },
    { num: 3, label: 'Goals & Eligibility', active: activeStep === 3, done: activeStep > 3 },
    { num: 4, label: 'Product Selection', active: activeStep === 4, done: activeStep > 4 },
    { num: 5, label: 'Order Review', active: activeStep === 5, done: activeStep > 5 },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo" style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <button
          onClick={onClose}
          className="menu-toggle"
          style={{
            display: 'none',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <X size={24} color="#14532d" />
        </button>
        <img src={logo1} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
        <span>Sales Tool</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step) => {
          const Icon = stepIcons[step.num];
          const isClickable = step.num <= (maxStep || activeStep);
          return (
            <div
              key={step.num}
              onClick={() => {
                if (isClickable && onStepClick) onStepClick(step.num);
                onClose();
              }}
              onMouseEnter={(e) => {
                if (isClickable && !step.active) {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!step.active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.border = '1px solid transparent';
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1rem',
                borderRadius: '20px',
                border: '1px solid ' + (step.active ? 'rgba(20, 83, 45, 0.4)' : 'transparent'),
                background: step.active ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                transition: 'all 0.25s ease',
                transform: step.active ? 'scale(1.02)' : 'scale(1)',
                backdropFilter: step.active ? 'blur(4px)' : 'none',
                cursor: isClickable ? 'pointer' : 'default',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done ? 'var(--primary)' : step.active ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                color: step.done || step.active ? 'white' : 'var(--text-muted)',
                boxShadow: step.active ? '0 4px 12px var(--primary-glow)' : 'none',
                transition: 'all 0.3s'
              }}>
                {step.done ? <Check size={16} strokeWidth={3} /> : <Icon size={16} strokeWidth={2.5} />}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: step.active ? 'var(--primary)' : 'var(--text-main)', opacity: step.active || step.done ? 1 : 0.5 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#14532d', fontWeight: '600' }}>
                  {step.active ? 'In Progress' : step.done ? '✓ Click to revisit' : 'Upcoming'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          border: '1px solid rgba(20, 83, 45, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
        <button
          type="button"
          onClick={onSupplementsFaqOpen}
          aria-label="Open supplements FAQ"
          title="Open supplements FAQ"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px var(--primary-glow)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 18px var(--primary-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--primary-glow)';
          }}
        >
          <UserCircle size={22} />
        </button>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>Sales Agent</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>Sales Discovery</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onStripeDashboardOpen?.();
            onClose();
          }}
          className="stripe-dashboard-button"
        >
          <span className="stripe-dashboard-icon"><CreditCard size={22} /></span>
          <span>
            <span className="stripe-dashboard-title">Stripe Dashboard</span>
            <span className="stripe-dashboard-subtitle">Payments Overview</span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
