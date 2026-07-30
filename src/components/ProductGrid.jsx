import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { ArrowLeft, ArrowRight, Pill, Leaf, Search, Package, Zap, Shield, Droplets, ChevronDown } from 'lucide-react';

const ProductGrid = ({ products, selectedProducts, updateProductQuantity, selectedState, bmi, onBack, onNext }) => {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [priceSort, setPriceSort] = useState('lowToHigh');
  
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.type === activeTab);
    return filtered.sort((a, b) => {
      if (priceSort === 'lowToHigh') return a.price - b.price;
      if (priceSort === 'highToLow') return b.price - a.price;
      return 0;
    });
  }, [products, activeTab, priceSort]);

  const selectedCount = Object.values(selectedProducts).reduce((a, b) => a + b, 0);
  const totalPrice = useMemo(() => {
    return products
      .filter(p => selectedProducts[p.id])
      .reduce((sum, p) => sum + (p.price * selectedProducts[p.id]), 0);
  }, [products, selectedProducts]);

  const tabs = [
    { key: 'nutrition', label: 'Nutrition Services', Icon: Leaf },
    { key: 'glp', label: 'GLP Products', Icon: Pill },
    { key: 'nad', label: 'NAD Products', Icon: Zap },
    { key: 'ghk', label: 'GHK Products', Icon: Shield },
    { key: 'lipomino', label: 'Lipomino Products', Icon: Droplets },
    { key: 'glutathione', label: 'Glutathione', Icon: Pill },
    { key: 'sermorelin', label: 'Sermorelin', Icon: Pill },
    { key: 'supplement', label: 'Supplements', Icon: Package },
  ];

  return (
    <div className="animate-in" style={{ position: 'relative', paddingBottom: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STEP 4 OF 5</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Product Selection</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Build a customized bundle — select any combination of consultations & supplements</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)', 
            borderRadius: '12px', padding: '10px 16px'
          }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>STATE</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedState}</div>
          </div>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)', 
            borderRadius: '12px', padding: '10px 16px'
          }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>BMI</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>{bmi}</div>
          </div>
          <button 
            className="btn"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '0.875rem 1.5rem' }}
            onClick={onBack}
          >
            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.875rem 1.75rem',
              borderRadius: '20px',
              border: '1px solid ' + (activeTab === tab.key ? 'rgba(20, 83, 45, 0.4)' : 'var(--glass-border)'),
              background: activeTab === tab.key ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.4)',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? '800' : '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <tab.Icon size={16} /> {tab.label}
            {selectedCount > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'var(--primary)' : 'rgba(20, 83, 45, 0.2)',
                color: activeTab === tab.key ? 'white' : 'var(--primary)',
                borderRadius: '8px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                {products.filter(p => p.type === tab.key && selectedProducts[p.id]).reduce((sum, p) => sum + selectedProducts[p.id], 0) || ''}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Price Filter */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            style={{
              padding: '0.75rem 2.5rem 0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.6)',
              color: 'var(--text)',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              appearance: 'none',
              fontFamily: 'inherit',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              quantity={selectedProducts[product.id] || 0}
              onIncrement={() => updateProductQuantity(product.id, 1)}
              onDecrement={() => updateProductQuantity(product.id, -1)}
            />
          ))
        ) : (
          <div className="card glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 3rem' }}>
            <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>No products available</h3>
            <p style={{ color: 'var(--text-muted)' }}>Adjust the state or eligibility criteria to see options.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductGrid;
