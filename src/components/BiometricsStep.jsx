import React from 'react';
import { Activity, ArrowLeft, ArrowRight } from 'lucide-react';

const BiometricsStep = ({
  weight, setWeight, weightUnit, setWeightUnit,
  height, setHeight, heightUnit, setHeightUnit,
  feet, setFeet, inches, setInches,
  onBack, onNext, onWeightUnitChange, onHeightUnitChange
}) => {
  return (
    <div className="card glass animate-in" style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Activity size={28} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Patient Biometrics</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Essential data for BMI and goal tracking</p>
      </div>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {/* Weight Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ margin: 0, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT WEIGHT</label>
            <div className="glass" style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', padding: '4px', background: 'rgba(255,255,255,0.4)' }}>
              <button
                className={`btn ${weightUnit === 'lbs' ? 'btn-primary' : ''}`}
                style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '8px', background: weightUnit === 'lbs' ? 'var(--primary)' : 'transparent', color: weightUnit === 'lbs' ? 'white' : 'var(--text-main)' }}
                onClick={() => onWeightUnitChange('lbs')}
              >
                LBS
              </button>
              <button
                className={`btn ${weightUnit === 'kg' ? 'btn-primary' : ''}`}
                style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '8px', background: weightUnit === 'kg' ? 'var(--primary)' : 'transparent', color: weightUnit === 'kg' ? 'white' : 'var(--text-main)' }}
                onClick={() => onWeightUnitChange('kg')}
              >
                KG
              </button>
            </div>
          </div>
          <input
            type="number"
            placeholder={`0.0 ${weightUnit}`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ fontSize: '1.5rem', padding: '1.25rem', borderRadius: '20px', fontWeight: '800' }}
          />
        </section>

        {/* Height Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ margin: 0, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PATIENT HEIGHT</label>
            <div className="glass" style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', padding: '4px', background: 'rgba(255,255,255,0.4)' }}>
              <button
                className={`btn ${heightUnit === 'ftin' ? 'btn-primary' : ''}`}
                style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '8px', background: heightUnit === 'ftin' ? 'var(--primary)' : 'transparent', color: heightUnit === 'ftin' ? 'white' : 'var(--text-main)' }}
                onClick={() => onHeightUnitChange('ftin')}
              >
                FT/IN
              </button>
              <button
                className={`btn ${heightUnit === 'cm' ? 'btn-primary' : ''}`}
                style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '8px', background: heightUnit === 'cm' ? 'var(--primary)' : 'transparent', color: heightUnit === 'cm' ? 'white' : 'var(--text-main)' }}
                onClick={() => onHeightUnitChange('cm')}
              >
                CM
              </button>
            </div>
          </div>

          {heightUnit === 'ftin' ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="number" placeholder="Feet" value={feet}
                onChange={(e) => setFeet(e.target.value)}
                style={{ fontSize: '1.5rem', padding: '1.25rem', borderRadius: '20px', fontWeight: '800' }}
              />
              <input
                type="number" placeholder="Inches" value={inches}
                onChange={(e) => setInches(e.target.value)}
                style={{ fontSize: '1.5rem', padding: '1.25rem', borderRadius: '20px', fontWeight: '800' }}
              />
            </div>
          ) : (
            <input
              type="number" placeholder="170 CM" value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{ fontSize: '1.5rem', padding: '1.25rem', borderRadius: '20px', fontWeight: '800' }}
            />
          )}
        </section>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '16px' }}>
          <button className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.4)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.25rem' }} onClick={onBack}>
            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
          </button>
          <button
            className="btn btn-primary"
            disabled={!weight || (heightUnit === 'cm' ? !height : (!feet && !inches))}
            style={{ flex: 2, borderRadius: '20px', padding: '1.25rem', fontSize: '1.125rem' }}
            onClick={onNext}
          >
            Analyze Biometrics <ArrowRight size={18} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricsStep;
