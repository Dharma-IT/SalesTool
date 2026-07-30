import React from 'react';
import { STATES } from '../utils/data';

const StateSelector = ({ selectedState, setSelectedState, hasCondition, setHasCondition }) => {
  return (
    <div className="card">
      <div className="form-group">
        <label>Current State</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select a state</option>
          {STATES.map((state) => (
            <option key={state.abv} value={state.abv}>
              {state.name} ({state.abv})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>Medical Condition?</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${hasCondition ? 'btn-primary' : ''}`}
            style={{ flex: 1, border: '1px solid var(--border)', background: hasCondition ? 'var(--primary)' : 'white', color: hasCondition ? 'white' : 'var(--text-main)' }}
            onClick={() => setHasCondition(true)}
          >
            Yes
          </button>
          <button
            className={`btn ${!hasCondition ? 'btn-primary' : ''}`}
            style={{ flex: 1, border: '1px solid var(--border)', background: !hasCondition ? 'var(--primary)' : 'white', color: !hasCondition ? 'white' : 'var(--text-main)' }}
            onClick={() => setHasCondition(false)}
          >
            No
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>
          Conditions include: High BP, Cholesterol, Sleep Apnea, PCOS, etc.
        </p>
      </div>
    </div>
  );
};

export default StateSelector;
