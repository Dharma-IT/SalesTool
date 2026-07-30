import React from 'react';

const BMICalculator = ({ height, setHeight, weight, setWeight, bmi }) => {
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#64748b' };
    if (bmi < 25) return { label: 'Healthy', color: '#10b981' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const category = getBMICategory(bmi);

  return (
    <div className="card glass">
      <h2>BMI Calculator</h2>
      <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '0' }}>
        <div className="form-group">
          <label>Height (cm)</label>
          <input
            type="number"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Weight (lbs)</label>
          <input
            type="number"
            placeholder="160"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Your BMI</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: category.color }}>{bmi || '0.0'}</div>
        </div>
        <div className="badge" style={{ backgroundColor: `${category.color}15`, color: category.color, border: `1px solid ${category.color}30` }}>
          {category.label}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
