import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StateStep from './components/StateStep';
import BiometricsStep from './components/BiometricsStep';
import GoalsStep from './components/GoalsStep';
import ProductGrid from './components/ProductGrid';
import OrderReview from './components/OrderReview';
import InvoiceView from './components/InvoiceView';
import RecommendationAgent from './components/RecommendationAgent';
import Auth from './components/Auth';
import SupplementsFaqModal from './components/SupplementsFaqModal';
import { supabase } from './utils/supabaseClient';
import { ArrowRight, ShoppingCart, Menu, LogOut, X, CalendarDays, Search, CheckCircle2, CreditCard } from 'lucide-react';
import { PRODUCTS, calculateBMI, UNIFIED_CONTRAINDICATIONS, UNIFIED_MEDICATIONS } from './utils/data';

const getEasternDate = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
  return `${value.year}-${value.month}-${value.day}`;
};

function Dashboard({ session }) {
  const [activeStep, setActiveStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSupplementsFaq, setShowSupplementsFaq] = useState(false);
  const [showStripeDashboard, setShowStripeDashboard] = useState(false);
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

  // Unit conversion functions
  const convertWeight = (value, fromUnit, toUnit) => {
              const num = parseFloat(value);
              if (isNaN(num)) return '';
              if (fromUnit === toUnit) return value;
              if (fromUnit === 'kg' && toUnit === 'lbs') return (num * 2.20462).toFixed(1);
              if (fromUnit === 'lbs' && toUnit === 'kg') return (num / 2.20462).toFixed(1);
              return value;
            };

            const handleWeightUnitChange = (newUnit) => {
              const convertedWeight = convertWeight(weight, weightUnit, newUnit);
              setWeight(convertedWeight);
              setWeightUnit(newUnit);
            };

            const convertHeightToCm = (feet, inches) => {
              const ft = parseFloat(feet) || 0;
              const in_ = parseFloat(inches) || 0;
              if (ft === 0 && in_ === 0) return '';
              return Math.round((ft * 12 + in_) * 2.54);
            };

            const convertCmToFeetInches = (cm) => {
              const cmNum = parseFloat(cm);
              if (isNaN(cmNum) || cmNum === 0) return { feet: '', inches: '' };
              const totalInches = cmNum / 2.54;
              const ft = Math.floor(totalInches / 12);
              const in_ = Math.round(totalInches % 12);
              return { feet: ft.toString(), inches: in_.toString() };
            };

            const handleHeightUnitChange = (newUnit) => {
              if (heightUnit === 'ftin' && newUnit === 'cm') {
                const cmValue = convertHeightToCm(feet, inches);
                setHeight(cmValue.toString());
                setHeightUnit('cm');
              } else if (heightUnit === 'cm' && newUnit === 'ftin') {
                const { feet: ft, inches: in_ } = convertCmToFeetInches(height);
                setFeet(ft);
                setInches(in_);
                setHeight('');
                setHeightUnit('ftin');
              } else {
                setHeightUnit(newUnit);
              }
            };

            // Biometrics State
            const [weight, setWeight] = useState('');
            const [weightUnit, setWeightUnit] = useState('lbs');
            const [height, setHeight] = useState('');
            const [heightUnit, setHeightUnit] = useState('ftin');
            const [feet, setFeet] = useState('');
            const [inches, setInches] = useState('');

            // Eligibility State
            const [hasCondition, setHasCondition] = useState(false);
            const [selectedConditions, setSelectedConditions] = useState([]);
            const [selectedMedicalConditions, setSelectedMedicalConditions] = useState([]);
            const [selectedDisqualifyingMeds, setSelectedDisqualifyingMeds] = useState([]);
            const [isAsianDescent, setIsAsianDescent] = useState(false);

            // Product Selection State - Map of productId -> quantity
            const [selectedProducts, setSelectedProducts] = useState({});
            const [catalogProducts, setCatalogProducts] = useState(PRODUCTS);

            useEffect(() => {
              const controller = new AbortController();
              fetch('/api/shopify-prices', { signal: controller.signal })
                .then(response => {
                  if (!response.ok) throw new Error(`Shopify price sync failed (${response.status})`);
                  return response.json();
                })
                .then(({ prices = {} }) => {
                  setCatalogProducts(PRODUCTS.map(product =>
                    product.type !== 'glp' && Object.prototype.hasOwnProperty.call(prices, product.id)
                      ? { ...product, price: prices[product.id] }
                      : product
                  ));
                })
                .catch(error => {
                  if (error.name !== 'AbortError') {
                    console.warn('Using local fallback prices:', error.message);
                  }
                });
              return () => controller.abort();
            }, []);

            // Calculations
            const bmi = useMemo(() => 
              calculateBMI(weight, weightUnit, height, heightUnit, feet, inches), 
              [weight, weightUnit, height, heightUnit, feet, inches]
            );

            const updateProductQuantity = (productId, delta) => {
              setSelectedProducts(prev => {
                const currentQty = prev[productId] || 0;
                const newQty = Math.max(0, currentQty + delta);
                const newSelection = { ...prev };
                if (newQty === 0) {
                  delete newSelection[productId];
                } else {
                  newSelection[productId] = newQty;
                }
                return newSelection;
              });
            };

            const selectedProductsList = useMemo(() => {
              const result = [];
              Object.entries(selectedProducts).forEach(([id, qty]) => {
                const product = catalogProducts.find(p => p.id === id);
                if (product) {
                  result.push({ ...product, quantity: qty });
                }
              });
              return result;
            }, [selectedProducts, catalogProducts]);

            const selectedCount = Object.values(selectedProducts).reduce((a, b) => a + b, 0);
            const totalPrice = useMemo(() => {
              return selectedProductsList.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            }, [selectedProductsList]);

            // Helper function to check if any selected condition disqualifies a product type
            const isProductDisqualified = (productType) => {
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

            // Derived disqualification flags
            const hasMedConditions = selectedMedicalConditions.length > 0;
            const hasDisqMed = selectedDisqualifyingMeds.length > 0;
            const isDisqualified = hasMedConditions || hasDisqMed;

            const eligibleProducts = useMemo(() => {
              const bmiValue = parseFloat(bmi);
              const bmiThreshold = isAsianDescent ? 23 : 25;

              return catalogProducts.filter((product) => {
                // 1. Check State Eligibility
                if (selectedState !== '') {
                  if (product.allowedStates && product.allowedStates !== 'ALL') {
                    const allowedArr = product.allowedStates.split(',').map(s => s.trim());
                    if (!allowedArr.includes(selectedState)) return false;
                  }
                }

                // 2. Check Unified Product-Specific Contraindications
                if (isProductDisqualified(product.type)) return false;

                // 3. Check Microdose products first - allow if no contraindications
                if (product.requirement === 'MICRODOSE') {
                  if (hasMedConditions || hasDisqMed) return false;
                  // Allow microdose when BMI < threshold, regardless of comorbidity
                  return true;
                }

                // 4. Check GLP-1 specific requirements (BMI + contraindications)
                if (product.type === 'glp') {
                  // BMI >= 30: auto-eligible
                  if (bmiValue >= 30) return true;

                  // BMI between threshold and 30: eligible only with qualifying comorbidity
                  if (bmiValue >= bmiThreshold && bmiValue < 30) {
                    return hasCondition && selectedConditions.length > 0;
                  }

                  // BMI below threshold: not eligible
                  return false;
                }

                // Supplements and nutrition services are generally available to all (if state allows)
                return true;
              });
            }, [
              selectedState, selectedConditions, bmi, isAsianDescent,
              isDisqualified, selectedMedicalConditions,
              selectedDisqualifyingMeds, hasCondition, catalogProducts,
              hasMedConditions, hasDisqMed, isProductDisqualified
            ]);

            const handleNext = () => setActiveStep(prev => {
              const next = prev + 1;
              setMaxStep(m => Math.max(m, next));
              return next;
            });
            const handleBack = () => setActiveStep(prev => prev - 1);
            const handleStepClick = (stepNum) => {
              if (stepNum <= maxStep) setActiveStep(stepNum);
            };

            return (
              <div className="app-container">
                <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
                <Sidebar
                  activeStep={activeStep}
                  maxStep={maxStep}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  onStepClick={handleStepClick}
                  onSupplementsFaqOpen={() => {
                    setShowSupplementsFaq(true);
                    setSidebarOpen(false);
                  }}
                  onStripeDashboardOpen={() => setShowStripeDashboard(true)}
                />
                <main className="main-content">
                  <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: '0.75rem' }}>SALES TOOL</div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
                            marginTop: '8px',
                            animation: 'spin 3s linear infinite',
                            transformStyle: 'preserve-3d'
                          }}>
                            <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>$</span>
                          </div>
                          <h1 style={{ fontSize: '2.75rem', lineHeight: 1 }}>Sales Discovery</h1>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem', fontWeight: '500' }}>Guided clinical workflow for patient onboarding</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={() => supabase.auth.signOut()}
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                          }}
                        >
                          <LogOut size={16} /> <span className="hide-on-mobile">Sign Out</span>
                        </button>
                        <button 
                          className="menu-toggle"
                          onClick={() => setSidebarOpen(true)}
                          style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          <Menu size={24} color="#14532d" />
                        </button>
                      </div>
                    </div>
                  </header>

                  {activeStep === 1 && (
                    <StateStep 
                      selectedState={selectedState} 
                      setSelectedState={setSelectedState} 
                      onNext={handleNext} 
                    />
                  )}

                  {activeStep === 2 && (
                    <BiometricsStep 
                      weight={weight} setWeight={setWeight} weightUnit={weightUnit} setWeightUnit={setWeightUnit}
                      height={height} setHeight={setHeight} heightUnit={heightUnit} setHeightUnit={setHeightUnit}
                      feet={feet} setFeet={setFeet} inches={inches} setInches={setInches}
                      onBack={handleBack}
                      onNext={handleNext}
                      onWeightUnitChange={handleWeightUnitChange}
                      onHeightUnitChange={handleHeightUnitChange}
                    />
                  )}

                  {activeStep === 3 && (
                    <GoalsStep 
                      bmi={bmi}
                      weight={weight} weightUnit={weightUnit}
                      height={height} heightUnit={heightUnit} feet={feet} inches={inches}
                      hasCondition={hasCondition} setHasCondition={setHasCondition}
                      selectedConditions={selectedConditions} setSelectedConditions={setSelectedConditions}
                      selectedDisqualifyingMeds={selectedDisqualifyingMeds} setSelectedDisqualifyingMeds={setSelectedDisqualifyingMeds}
                      selectedMedicalConditions={selectedMedicalConditions} setSelectedMedicalConditions={setSelectedMedicalConditions}
                      isAsianDescent={isAsianDescent} setIsAsianDescent={setIsAsianDescent}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {activeStep === 4 && (
                    <ProductGrid 
                      products={eligibleProducts}
                      selectedState={selectedState}
                      bmi={bmi}
                      selectedProducts={selectedProducts}
                      updateProductQuantity={updateProductQuantity}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {activeStep === 5 && (
                    <OrderReview 
                      selectedProducts={selectedProductsList}
                      selectedState={selectedState}
                      bmi={bmi}
                      onBack={handleBack}
                    />
                  )}
                </main>

                {activeStep === 4 && (
                  <div 
                    className="sticky-summary-bar"
                    style={{ 
                      position: 'fixed', 
                      bottom: '2rem', 
                      right: '3rem',
                      left: 'calc(var(--sidebar-w) + 3rem)',
                      padding: '1.5rem 2.5rem',
                      borderRadius: '28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 2000,
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ 
                        background: 'rgba(212, 175, 55, 0.15)', 
                        border: '1px solid rgba(212, 175, 55, 0.3)', 
                        borderRadius: '16px', 
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <ShoppingCart size={20} color="#d4af37" />
                        <div>
                          <div style={{ fontSize: '0.5625rem', fontWeight: '800', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>SELECTED</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1f2937' }}>
                            {selectedCount} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'rgba(0,0,0,0.5)' }}>items</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        background: 'rgba(20, 83, 45, 0.1)', 
                        border: '1px solid rgba(20, 83, 45, 0.2)', 
                        borderRadius: '16px', 
                        padding: '0.75rem 1.5rem'
                      }}>
                        <div style={{ fontSize: '0.5625rem', fontWeight: '800', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>ORDER TOTAL</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532d' }}>
                          ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-primary" 
                      disabled={selectedCount === 0}
                      style={{ 
                        padding: '0.75rem 2rem', 
                        fontSize: '0.9375rem', 
                        borderRadius: '16px', 
                        flexShrink: 0,
                        opacity: selectedCount === 0 ? 0.6 : 1,
                        cursor: selectedCount === 0 ? 'not-allowed' : 'pointer'
                      }}
                      onClick={handleNext}
                    >
                      {selectedCount === 0 ? 'Select a Product' : 'Review Order'} 
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                )}
                <RecommendationAgent 
                    eligibleProducts={eligibleProducts}
                    userState={selectedState}
                    bmi={bmi}
                    isAsianDescent={isAsianDescent}
                    selectedConditions={selectedConditions}
                    userId={session?.user?.email || 'guest'}
                    activeStep={activeStep}
                  />
                {showSupplementsFaq && (
                  <SupplementsFaqModal onClose={() => setShowSupplementsFaq(false)} />
                )}
                {showStripeDashboard && (
                  <div className="stripe-dashboard-overlay" role="dialog" aria-modal="true" aria-labelledby="stripe-dashboard-title">
                    <section className="stripe-dashboard-panel">
                      <header className="stripe-dashboard-header">
                        <div>
                          <div className="stripe-dashboard-eyebrow">PAYMENTS</div>
                          <h2 id="stripe-dashboard-title">Stripe Dashboard</h2>
                        </div>
                        <button
                          type="button"
                          className="stripe-dashboard-close"
                          onClick={() => setShowStripeDashboard(false)}
                          aria-label="Close Stripe Dashboard"
                        >
                          <X size={22} />
                        </button>
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
                )}
        </div>
    );
}

function App() {
  // ✅ ALL hooks must be called unconditionally at the top — before any early returns
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Invoice early-return is now AFTER hooks (safe)
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceDataStr = urlParams.get('invoice');
  if (invoiceDataStr) {
    try {
      const data = JSON.parse(atob(invoiceDataStr));
      return <InvoiceView data={data} />;
    } catch (e) {
      console.error("Invalid invoice data", e);
    }
  }

  if (loadingSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  if (!session && location.pathname !== '/login') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={session ? <Navigate to="/" replace /> : <Auth onAuthSuccess={(sess) => {
          setSession(sess);
          navigate('/', { replace: true });
        }} />} 
      />
      <Route path="/*" element={<Dashboard session={session} />} />
    </Routes>
  );
}

export default App;
