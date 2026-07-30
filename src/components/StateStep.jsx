import React from 'react';
import { STATES } from '../utils/data';
import { MapPin, ArrowRight, AlertTriangle } from 'lucide-react';

const StateStep = ({ selectedState, setSelectedState, onNext }) => {
  return (
    <div className="card glass animate-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <MapPin size={28} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Patient Residency</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Select the primary residence for eligibility screening</p>
      </div>
      
      <div className="form-group">
        <label style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>REGULATORY STATE</label>
        <select 
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)}
          style={{ padding: '1.25rem', fontSize: '1.125rem' }}
        >
          <option value="">Select a state</option>
          {STATES.map(s => <option key={s.abv} value={s.abv}>{s.name}</option>)}
        </select>
      </div>

      <button 
        className="btn btn-primary" 
        disabled={!selectedState}
        style={{ padding: '1.25rem', fontSize: '1.125rem', marginTop: '2.5rem', width: '100%', borderRadius: '20px' }}
        onClick={onNext}
      >
        Continue to Biometrics <ArrowRight size={18} style={{ marginLeft: '4px' }} />
      </button>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <AlertTriangle size={14} /> Product availability depends on state medical regulations.
      </div>
    </div>
  );
};

export default StateStep;
