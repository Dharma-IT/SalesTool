import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Loader2, DollarSign, Activity } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data?.session) {
      onAuthSuccess(data.session);
    } else if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Column: Login Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              {/* Spinning Coin Logo */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fde68a 0%, #d4af37 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)',
                border: '2px solid #ffffff'
              }}>
                <div style={{ animation: 'spinCoin 4s linear infinite', display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={24} color="#ffffff" strokeWidth={3} />
                </div>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#166534', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#166534' }}>Dharma</span>
                <span style={{ color: '#d4af37' }}>Sales Tool</span>
              </h1>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
              Secure Clinical Gateway
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#b91c1c',
              padding: '0.875rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* User Layer */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                User / Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  color: '#1f2937'
                }}
                onFocus={(e) => e.target.style.borderColor = '#166534'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password Layer */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', margin: 0 }}>
                  Password
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#166534', cursor: 'pointer' }}>
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  color: '#1f2937'
                }}
                onFocus={(e) => e.target.style.borderColor = '#166534'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.875rem',
                borderRadius: '6px',
                background: '#14532d',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#166534')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#14532d')}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <div style={{ width: '12px', height: '12px', background: '#d4af37', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534', letterSpacing: '0.05em' }}>dharma</span>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#9ca3af', fontWeight: '600' }}>
              &copy; Copyright Dharma Nutritional Clinic @ IT
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Decorative Panel */}
      <div style={{
        flex: '1',
        padding: '1.5rem',
      }} className="right-auth-panel">
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 900px) {
            .right-auth-panel { display: none !important; }
          }
          @keyframes spinCoin {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          @keyframes bounceCoin {
            0% { transform: translateX(-50%) translateY(0); }
            100% { transform: translateX(-50%) translateY(-20px); }
          }
          @keyframes growGraph {
            0% { transform: scaleY(0.7); }
            100% { transform: scaleY(1.1); }
          }
        `}} />
        <div style={{
          background: 'linear-gradient(135deg, #fdf6e3, #d4af37)',
          borderRadius: '2rem',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '6rem 4rem',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 0 80px rgba(22, 101, 52, 0.15)' /* Hint of greenery in the inner shadow */
        }}>
          {/* Hint of greenery glowing orb in background */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(22, 101, 52, 0.2) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%'
          }}></div>

          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(22, 101, 52, 0.15) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%'
          }}></div>

          {/* Typographic Header */}
          <div style={{ marginBottom: '5rem', textAlign: 'center', zIndex: 2 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif, 'Times New Roman'",
              fontSize: '4rem',
              color: '#166534',
              margin: '0 0 0.5rem 0',
              fontWeight: '400',
              fontStyle: 'italic',
              letterSpacing: '1px'
            }}>
              Master
            </h2>
            <h2 style={{
              fontSize: '4rem',
              color: '#ffffff',
              margin: 0,
              fontWeight: '800',
              letterSpacing: '-1px',
              textShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              Your Sales
            </h2>
          </div>

          {/* Animated Graphics Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '180px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 2,
            borderBottom: '2px solid rgba(255,255,255,0.4)',
            paddingBottom: '0.5rem'
          }}>
            {/* Spinning Coin */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
              border: '3px solid #ffffff',
              animation: 'bounceCoin 2.5s ease-in-out infinite alternate',
              zIndex: 10
            }}>
               <div style={{ animation: 'spinCoin 3s linear infinite', display: 'flex', alignItems: 'center' }}>
                 <DollarSign size={36} color="#ffffff" strokeWidth={2.5} />
               </div>
            </div>

            {/* Animated Graph Bars */}
            {[25, 40, 20, 55, 45, 80, 100, 65, 85].map((h, i) => (
              <div key={i} style={{ 
                width: '24px', 
                height: `${h}%`, 
                background: i % 2 === 0 ? '#166534' : '#ffffff', 
                borderRadius: '6px 6px 0 0',
                opacity: 0.9,
                animation: `growGraph ${1.5 + (i * 0.3)}s ease-in-out infinite alternate`,
                transformOrigin: 'bottom',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
