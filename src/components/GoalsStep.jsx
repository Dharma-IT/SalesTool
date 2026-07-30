import React, { useState } from 'react';
import { getIdealMetrics, QUALIFYING_CONDITIONS, UNIFIED_CONTRAINDICATIONS, UNIFIED_MEDICATIONS } from '../utils/data';
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldAlert, ShieldCheck, Pill, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

const GoalsStep = ({
  bmi, height, heightUnit, feet, inches,
  weight, weightUnit,
  hasCondition, setHasCondition,
  selectedConditions, setSelectedConditions,
  selectedDisqualifyingMeds, setSelectedDisqualifyingMeds,
  selectedMedicalConditions, setSelectedMedicalConditions,
  isAsianDescent, setIsAsianDescent,
  onBack, onNext
}) => {
  // All sections start as closed (null = closed)
  const [expandedSections, setExpandedSections] = useState({});
  const metrics = getIdealMetrics(height, heightUnit, feet, inches);
  const currentWeightFixed = parseFloat(weight);
  const idealWeightFixed = metrics ? parseFloat(metrics.ideal[weightUnit]) : 0;
  const weightLossGoal = metrics ? (currentWeightFixed - idealWeightFixed).toFixed(1) : 0;

  const bmiValue = parseFloat(bmi);
  const bmiThreshold = isAsianDescent ? 23 : 25;
  
  // Use unified medical conditions
  const hasMedConditions = selectedMedicalConditions.length > 0;
  const hasDisqMed = selectedDisqualifyingMeds.length > 0;
  const isDisqualified = hasMedConditions || hasDisqMed;

  // Helper to check if a specific product type is disqualified
  const checkProductDisqualified = (productType) => {
    // Check unified contraindications
    for (const category of Object.values(UNIFIED_CONTRAINDICATIONS)) {
      for (const item of category) {
        if (selectedMedicalConditions.includes(item.condition) && item.products.includes(productType)) {
          return true;
        }
      }
    }
    // Check unified medications
    for (const medCategory of Object.values(UNIFIED_MEDICATIONS)) {
      for (const item of medCategory) {
        if (selectedDisqualifyingMeds.includes(item.condition) && item.products.includes(productType)) {
          return true;
        }
      }
    }
    return false;
  };

  const isNadDisqualified = checkProductDisqualified('nad');
  const isLipominoDisqualified = checkProductDisqualified('lipomino');
  const isGlutaDisqualified = checkProductDisqualified('glutathione');
  const isSermorelinDisqualified = checkProductDisqualified('sermorelin');
  const isGhkuDisqualified = checkProductDisqualified('ghk');

  // Determine if the BMI is in the "needs comorbidity" range
  const needsComorbidity = bmiValue >= bmiThreshold && bmiValue < 30;
  const bmiAutoEligible = bmiValue >= 30;
  const bmiBelowThreshold = bmiValue < bmiThreshold;

  const glp1Eligible = !isDisqualified && (bmiAutoEligible || (needsComorbidity && hasCondition && selectedConditions.length > 0));

  const toggleCondition = (condition) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const toggleDisqualifyingMed = (item) => {
    if (selectedDisqualifyingMeds.includes(item)) {
      setSelectedDisqualifyingMeds(selectedDisqualifyingMeds.filter(c => c !== item));
    } else {
      setSelectedDisqualifyingMeds([...selectedDisqualifyingMeds, item]);
    }
  };

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter(c => c !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  const renderChecklist = (title, items, selectedArray, setter, color = '#dc2626') => {
    const isGreen = color !== '#dc2626';
    const bgOpacityStr = isGreen ? '20, 83, 45' : '239, 68, 68';
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: '800', letterSpacing: '0.08em', color, textTransform: 'uppercase', margin: '0 0 0.75rem 0' }}>{title}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item) => {
            const isSelected = selectedArray.includes(item);
            return (
              <label key={item} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8125rem', cursor: 'pointer',
                padding: '10px 14px', borderRadius: '14px',
                backgroundColor: isSelected ? `rgba(${bgOpacityStr}, 0.08)` : 'rgba(255, 255, 255, 0.5)',
                border: '1px solid ' + (isSelected ? `rgba(${bgOpacityStr}, 0.35)` : 'var(--glass-border)'),
                transition: 'all 0.2s', fontWeight: isSelected ? '700' : '500'
              }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: color }}
                  checked={isSelected} onChange={() => toggleSelection(item, selectedArray, setter)} />
                <span style={{ color: isSelected ? color : 'var(--text-main)', lineHeight: '1.4' }}>{item}</span>
              </label>
            )
          })}
        </div>
      </div>
    );
  };


  return (
    <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2.5rem' }}>
      {/* ── LEFT COLUMN ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* BMI Analytics Card */}
        <div className="card glass">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Goal Analytics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>CURRENT BMI</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>{bmi}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>WEIGHT LOSS GOAL</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: weightLossGoal > 0 ? '#ef4444' : '#14532d', letterSpacing: '-0.02em' }}>
                {weightLossGoal > 0 ? `-${weightLossGoal}` : `+${Math.abs(weightLossGoal)}`}
                <span style={{ fontSize: '0.875rem', marginLeft: '6px', fontWeight: '600' }}>{weightUnit}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.4)', borderRadius: '24px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.25rem', fontWeight: '700' }}>Target Weight Benchmarks</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MIN (18.5)</div>
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>{metrics?.min[weightUnit]} <span style={{ fontSize: '0.75rem' }}>{weightUnit}</span></div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>IDEAL (21.7)</div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>{metrics?.ideal[weightUnit]} <span style={{ fontSize: '0.75rem' }}>{weightUnit}</span></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MAX (24.9)</div>
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>{metrics?.max[weightUnit]} <span style={{ fontSize: '0.75rem' }}>{weightUnit}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* GLP-1 Eligibility Status */}
        <div className="card glass" style={{
          padding: '1.5rem 2rem',
          background: isDisqualified ? 'rgba(239, 68, 68, 0.06)' : glp1Eligible ? 'rgba(20, 83, 45, 0.06)' : 'rgba(234, 179, 8, 0.06)',
          border: `1px solid ${isDisqualified ? 'rgba(239, 68, 68, 0.25)' : glp1Eligible ? 'rgba(20, 83, 45, 0.25)' : 'rgba(234, 179, 8, 0.25)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {isDisqualified ? <XCircle size={22} color="#dc2626" /> : glp1Eligible ? <CheckCircle size={22} color="#14532d" /> : <AlertTriangle size={22} color="#ca8a04" />}
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: isDisqualified ? '#dc2626' : glp1Eligible ? '#14532d' : '#ca8a04' }}>
              GLP-1: {isDisqualified ? 'BLOCKED' : glp1Eligible ? 'ELIGIBLE' : 'NOT YET ELIGIBLE'}
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            {isDisqualified
              ? 'A safety red flag was selected below. All GLP-1 weight loss medications will be hidden. Non-GLP-1 products remain available.'
              : glp1Eligible
                ? 'Patient meets all clinical criteria. GLP-1 medications will appear in recommendations.'
                : bmiBelowThreshold
                  ? `BMI is below ${bmiThreshold}. Patient does not meet the minimum BMI threshold for GLP-1 medications.`
                  : needsComorbidity && (!hasCondition || selectedConditions.length === 0)
                    ? 'BMI is 25–29.9. A qualifying medical condition must be selected on the right to unlock GLP-1 eligibility.'
                    : 'Complete the screening on the right to determine eligibility.'
            }
          </p>
        </div>

        {/* Additional Categories Eligibility Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: 'NAD+', active: !isNadDisqualified },
            { label: 'Lipo-Mino', active: !isLipominoDisqualified },
            { label: 'GHK-Cu', active: !isGhkuDisqualified },
            { label: 'Glutathione', active: !isGlutaDisqualified },
            { label: 'Sermorelin', active: !isSermorelinDisqualified }
          ].map(cat => (
            <div key={cat.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '12px',
              background: cat.active ? 'rgba(20, 83, 45, 0.06)' : 'rgba(239, 68, 68, 0.06)',
              border: `1px solid ${cat.active ? 'rgba(20, 83, 45, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
            }}>
              {cat.active ? <CheckCircle size={16} color="#14532d" /> : <XCircle size={16} color="#dc2626" />}
              <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: cat.active ? '#14532d' : '#dc2626' }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Asian Descent Toggle */}
        <label className="card glass" style={{
          display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
          padding: '1.25rem 1.75rem',
          background: isAsianDescent ? 'rgba(212, 175, 55, 0.08)' : undefined,
          border: isAsianDescent ? '1px solid rgba(20, 83, 45, 0.3)' : undefined
        }}>
          <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }} checked={isAsianDescent} onChange={() => setIsAsianDescent(!isAsianDescent)} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>Patient is of Asian Descent</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Lowers BMI threshold from 25 to 23</div>
          </div>
        </label>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.4)', border: '1px solid var(--glass-border)', padding: '1.25rem' }} onClick={onBack}>
            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
          </button>
          <button className="btn btn-primary" style={{ flex: 2, padding: '1.25rem', borderRadius: '20px', fontSize: '1.125rem' }} onClick={onNext}>
            Review Recommendations <ArrowRight size={18} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Medical Screening ── */}
      <div className="card glass" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Medical Screening</h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          Complete all sections below. This determines which products the patient can and cannot receive.
        </p>

        {/* ─── Medical Screening: Unified (all conditions merged) ─── */}
        <div style={{
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)',
          background: 'rgba(255, 255, 255, 0.4)',
          marginTop: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} color="var(--text-muted)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Medical Conditions & Medications</h3>
          </div>
          
          {Object.entries(UNIFIED_CONTRAINDICATIONS).map(([category, items]) => {
            const sectionKey = `contra_${category}`;
            const isExpanded = expandedSections[sectionKey] === true;
            const hasAnySelected = items.some(item => selectedMedicalConditions.includes(item.condition));
            return (
              <div key={category} style={{ marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: !isExpanded }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '12px 14px', borderRadius: '12px',
                    background: hasAnySelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(20, 83, 45, 0.08)',
                    border: '1px solid ' + (hasAnySelected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(20, 83, 45, 0.2)'),
                    cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', color: hasAnySelected ? '#dc2626' : '#14532d',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{category}</span>
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', paddingLeft: '8px' }}>
                    {items.map(({ condition, products }) => (
                      <label key={condition} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8125rem', cursor: 'pointer',
                        padding: '10px 14px', borderRadius: '14px',
                        backgroundColor: selectedMedicalConditions.includes(condition) ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                        border: '1px solid ' + (selectedMedicalConditions.includes(condition) ? 'rgba(239, 68, 68, 0.35)' : 'var(--glass-border)'),
                        transition: 'all 0.2s', fontWeight: selectedMedicalConditions.includes(condition) ? '700' : '500'
                      }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#dc2626' }}
                          checked={selectedMedicalConditions.includes(condition)}
                          onChange={() => {
                            if (selectedMedicalConditions.includes(condition)) {
                              setSelectedMedicalConditions(selectedMedicalConditions.filter(c => c !== condition));
                            } else {
                              setSelectedMedicalConditions([...selectedMedicalConditions, condition]);
                            }
                          }} />
                        <span style={{ color: selectedMedicalConditions.includes(condition) ? '#dc2626' : 'var(--text-main)', lineHeight: '1.4', flex: 1 }}>{condition}</span>
                        <span style={{ fontSize: '0.6875rem', color: selectedMedicalConditions.includes(condition) ? '#dc2626' : 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>{products.join(', ')}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Medications Section */}
          <div style={{ marginTop: '16px' }}>
            {Object.entries(UNIFIED_MEDICATIONS).map(([medCategory, items]) => {
              const sectionKey = `meds_${medCategory}`;
              const isExpanded = expandedSections[sectionKey] === true;
              const hasAnySelected = items.some(item => selectedDisqualifyingMeds.includes(item.condition));
              return (
                <div key={medCategory} style={{ marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: !isExpanded }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      background: hasAnySelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(20, 83, 45, 0.08)',
                      border: '1px solid ' + (hasAnySelected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(20, 83, 45, 0.2)'),
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', color: hasAnySelected ? '#dc2626' : '#14532d',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{medCategory.replace('_', ' ')}</span>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', paddingLeft: '8px' }}>
                      {items.map(({ condition, products }) => (
                        <label key={condition} style={{
                          display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8125rem', cursor: 'pointer',
                          padding: '10px 14px', borderRadius: '14px',
                          backgroundColor: selectedDisqualifyingMeds.includes(condition) ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid ' + (selectedDisqualifyingMeds.includes(condition) ? 'rgba(239, 68, 68, 0.35)' : 'var(--glass-border)'),
                          transition: 'all 0.2s', fontWeight: selectedDisqualifyingMeds.includes(condition) ? '700' : '500'
                        }}>
                          <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#dc2626' }}
                            checked={selectedDisqualifyingMeds.includes(condition)}
                            onChange={() => toggleDisqualifyingMed(condition)} />
                          <span style={{ color: selectedDisqualifyingMeds.includes(condition) ? '#dc2626' : 'var(--text-main)', lineHeight: '1.4', flex: 1 }}>{condition}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#991b1b', fontWeight: '600', whiteSpace: 'nowrap' }}>{products.join(', ')}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── SECTION 2: Qualifying Conditions (only show if BMI 25–29.9) ─── */}
        {needsComorbidity && !isDisqualified && (
          <div style={{
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.4)',
            marginTop: '1.5rem',
            animation: 'fadeIn 0.4s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <ShieldCheck size={18} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Qualifying Conditions</h3>
            </div>
            
            <button
              type="button"
              onClick={() => setExpandedSections(prev => ({ ...prev, 'qualifying': !expandedSections['qualifying'] }))}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                background: selectedConditions.length > 0 ? 'rgba(20, 83, 45, 0.12)' : 'rgba(20, 83, 45, 0.08)',
                border: '1px solid ' + (selectedConditions.length > 0 ? 'rgba(20, 83, 45, 0.3)' : 'rgba(20, 83, 45, 0.2)'),
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', color: selectedConditions.length > 0 ? '#14532d' : '#14532d',
                transition: 'all 0.2s'
              }}
            >
              <span>Select conditions (BMI {bmiThreshold}-29.9)</span>
              {expandedSections['qualifying'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            
            {expandedSections['qualifying'] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', paddingLeft: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Select at least <strong>one</strong> condition below to unlock GLP-1 eligibility.
                </p>
                {QUALIFYING_CONDITIONS.map((condition) => (
                  <label key={condition} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8125rem', cursor: 'pointer',
                    padding: '10px 14px', borderRadius: '14px',
                    backgroundColor: selectedConditions.includes(condition) ? 'rgba(20, 83, 45, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid ' + (selectedConditions.includes(condition) ? 'rgba(20, 83, 45, 0.3)' : 'var(--glass-border)'),
                    transition: 'all 0.2s', fontWeight: selectedConditions.includes(condition) ? '700' : '500'
                  }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#14532d' }}
                      checked={selectedConditions.includes(condition)}
                      onChange={() => {
                        toggleCondition(condition);
                        if (!hasCondition) setHasCondition(true);
                      }} />
                    <span style={{ color: selectedConditions.includes(condition) ? '#14532d' : 'var(--text-main)', lineHeight: '1.4' }}>{condition}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status messages for other BMI cases */}
        {bmiAutoEligible && !isDisqualified && (
          <div style={{
            padding: '1.5rem', borderRadius: '20px',
            border: '1px solid rgba(20, 83, 45, 0.2)', background: 'rgba(20, 83, 45, 0.04)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <CheckCircle size={20} color="#14532d" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9375rem', color: '#14532d' }}>BMI is {bmi} — Auto-Eligible</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>BMI ≥ 30 automatically qualifies for GLP-1 medications. No additional conditions needed.</div>
            </div>
          </div>
        )}

        {bmiBelowThreshold && !isDisqualified && (
          <div style={{
            padding: '1.5rem', borderRadius: '20px',
            border: '1px solid rgba(234, 179, 8, 0.2)', background: 'rgba(234, 179, 8, 0.04)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <AlertTriangle size={20} color="#ca8a04" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9375rem', color: '#ca8a04' }}>BMI is {bmi} — Below Threshold</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>BMI must be at least {bmiThreshold} to qualify. GLP-1 medications will not appear in recommendations.</div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
};

export default GoalsStep;
