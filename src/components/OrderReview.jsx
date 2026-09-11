import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Leaf, Pill, Link, Check, Copy, Package, ShoppingCart, ExternalLink, ChevronDown, ChevronUp, Loader, Clock } from 'lucide-react';
import {
  STATES,
  PRODUCTS,
  getProductEmoji,
  PRODUCT_EMOJIS
} from '../utils/data';

const COUPONS = [
  { code: 'SNDN34CX', discount: 20 },
  { code: 'GVK44L33', discount: 30 },
  { code: 'ZM4L5732', discount: 40 },
  { code: 'FZ3FPG7G', discount: 50 },
  { code: 'FFZX3667', discount: 60 },
  { code: '5ZTEZXUR', discount: 70 },
  { code: 'YHKK29YD', discount: 80 },
  { code: 'WWRQXUG9', discount: 90 },
];

const PAYLATER_TRANSLATIONS = {
  en: {
    customerSupport: "Complete and dedicated accompaniment throughout the entire treatment.",
    validUntil: "Valid until today 11:59pm:",
  },
  es: {
    customerSupport: "Acompañamiento completo y dedicado durante todo el tratamiento.",
    validUntil: "Válido hasta hoy 11:59pm:",
  },
  pt: {
    customerSupport: "Suporte ao cliente completo e dedicado durante todo o tratamento.",
    validUntil: "Válido até hoje 23:59:",
  }
};

const DURATION_TRANSLATIONS = {
  es: {
    "One time": "Una vez",
    "One month": "Un mes",
    "Two Months": "Dos Meses",
    "Three Months": "3 Meses",
    "Four Months": "4 Meses",
    "Six Months": "6 Meses",
    "12 months": "12 meses",
  },
  pt: {
    "One time": "Uma vez",
    "One month": "Um mês",
    "Two Months": "Dois meses",
    "Three Months": "Três meses",
    "Four Months": "Quatro meses",
    "Six Months": "Seis meses",
    "12 months": "12 meses",
  }
};

const PRODUCT_NAME_TRANSLATIONS = {
  es: {
    sema_micro_2mo: 'Microdosis de Semaglutida - 2 Meses',
    sema_starter_3mo: 'Paquete Inicial: Semaglutida 3 Meses',
    sema_starter_6mo: 'Paquete Inicial: Semaglutida 6 Meses',
    sema_starter_12mo: 'Paquete Inicial: Semaglutida 12 Semanas',
    sema10_1mo: 'Compra Única: Semaglutida 10 mg - 1 Mes',
    tirz_micro_2mo: 'Microdosis de Tirzepatida - 2 Meses',
    tirz_starter_3mo: 'Paquete Inicial: Tirzepatida 3 Meses',
    tirz_starter_6mo: 'Paquete Inicial: Tirzepatida 6 Meses',
    tirz_starter_12mo: 'Paquete Inicial: Tirzepatida 12 Semanas',
    tirz60_1mo: 'Compra Única: Tirzepatida 60 mg - 1 Mes',
    lipo: 'Lipo-Mino Un Mes',
    lipo_3mo: 'Lipo-Mino 3 Meses',
    nad: 'NAD+ Un Mes',
    nad_3mo: 'NAD+ 3 Meses',
    ghkcu_3mo: 'GHK-Cu 3 Meses',
    ghkcu_1mo: 'GHK-Cu Un Mes',
    sermorelin_2mo: 'Sermorelina Dos Meses',
    sermorelin_1mo: 'Sermorelina Un Mes',
    glutathione_4mo: 'Glutatión Cuatro Meses',
    glutathione_2mo: 'Glutatión Dos Meses',
    nc12: 'Consulta de Nutrición 12 Meses',
    nc6: 'Consulta de Nutrición 6 Meses',
    nc3: 'Consulta de Nutrición 3 Meses',
    nc_not_client: 'Consulta de Nutrición 1 Mes - Clientes sin GLP-1',
    nc: 'Consulta de Nutrición 1 Mes',
    beauty_boost: 'Impulso de Belleza - Esenciales para Cabello, Piel y Uñas',
    bloat_away: 'Adiós Hinchazón - Probiótico de 40 Mil Millones con Prebióticos',
    bone_heart: 'Apoyo para Huesos y Corazón',
    brain_focus: 'Fórmula para Cerebro y Concentración',
    multivitamin: 'Multivitamínico Completo',
    detox_now: 'Desintoxícate Ahora - Refresca, Limpia y Brilla',
    diet_drops: 'Gotas Dietéticas Ultra',
    gut_boost: 'Refuerzo Intestinal Pro y Digestión Suave',
    maca_plus: 'Ámame Ahora - Maca Plus',
    omega3: 'Omega-3 EPA 180 mg + DHA 120 mg',
    vitamin_d3: 'Vitamina D3 2,000 UI',
    magnesium: 'Glicinato de Magnesio',
    energy_strips: 'Tiras de Energía',
    glutamine: 'L-Glutamina en Polvo',
    sleep_strips: 'Tiras para Dormir',
    hydraglow_peach_mango: 'Hydraglow en Polvo (Durazno y Mango)',
    hydraglow_lychee: 'Hydraglow en Polvo (Lichi)',
    hydraglow_lemonade: 'Hydraglow en Polvo (Limonada)',
    apple_cider_vinegar: 'Cápsulas de Vinagre de Sidra de Manzana',
    berberine: 'Berberina+ y Pierde Peso',
    glp1_support: 'Apoyo GLP-1 | Fórmula Diaria Metabólica, Intestinal y de Micronutrientes',
    colon_cleanse: 'Limpieza Suave de Colon',
    colostrum: 'Cápsulas de Calostro',
    creatine: 'Monohidrato de Creatina',
    fat_burner: 'Quemador de Grasa y Control del Apetito',
    collagen_choc: 'Chocolate - Péptidos de Colágeno en Polvo de Ganado Alimentado con Pasto',
    nad_antiaging: 'NAD+ Energía Celular y Antienvejecimiento',
    collagen_peptides: 'Sin Sabor - Péptidos de Colágeno Hidrolizado de Ganado Alimentado con Pasto',
    collagen_vanilla: 'Vainilla - Crema en Polvo con Péptidos de Colágeno de Ganado Alimentado con Pasto',
    whey_choc: 'Chocolate - Aislado Avanzado de Proteína de Suero 100%',
    whey_vanilla: 'Vainilla - Aislado Avanzado de Proteína de Suero 100%',
    shipping: 'Envío',
    slimboost: 'Impulso Adelgazante',
    detox_tea: 'Té Desintoxicante',
  },
  pt: {
    sema_micro_2mo: 'Microdose de Semaglutida - 2 Meses',
    sema_starter_3mo: 'Pacote Inicial: Semaglutida 3 Meses',
    sema_starter_6mo: 'Pacote Inicial: Semaglutida 6 Meses',
    sema_starter_12mo: 'Pacote Inicial: Semaglutida 12 Semanas',
    sema10_1mo: 'Compra Única: Semaglutida 10 mg - 1 Mês',
    tirz_micro_2mo: 'Microdose de Tirzepatida - 2 Meses',
    tirz_starter_3mo: 'Pacote Inicial: Tirzepatida 3 Meses',
    tirz_starter_6mo: 'Pacote Inicial: Tirzepatida 6 Meses',
    tirz_starter_12mo: 'Pacote Inicial: Tirzepatida 12 Semanas',
    tirz60_1mo: 'Compra Única: Tirzepatida 60 mg - 1 Mês',
    lipo: 'Lipo-Mino Um Mês',
    lipo_3mo: 'Lipo-Mino 3 Meses',
    nad: 'NAD+ Um Mês',
    nad_3mo: 'NAD+ 3 Meses',
    ghkcu_3mo: 'GHK-Cu 3 Meses',
    ghkcu_1mo: 'GHK-Cu Um Mês',
    sermorelin_2mo: 'Sermorelina Dois Meses',
    sermorelin_1mo: 'Sermorelina Um Mês',
    glutathione_4mo: 'Glutationa Quatro Meses',
    glutathione_2mo: 'Glutationa Dois Meses',
    nc12: 'Consulta Nutricional 12 Meses',
    nc6: 'Consulta Nutricional 6 Meses',
    nc3: 'Consulta Nutricional 3 Meses',
    nc_not_client: 'Consulta Nutricional 1 Mês - Clientes sem GLP-1',
    nc: 'Consulta Nutricional 1 Mês',
    beauty_boost: 'Impulso de Beleza - Essenciais para Cabelo, Pele e Unhas',
    bloat_away: 'Livre do Inchaço - Probiótico de 40 Bilhões com Prebióticos',
    bone_heart: 'Suporte para Ossos e Coração',
    brain_focus: 'Fórmula para Cérebro e Foco',
    multivitamin: 'Multivitamínico Completo',
    detox_now: 'Desintoxique Agora - Refresque, Limpe e Brilhe',
    diet_drops: 'Gotas Dietéticas Ultra',
    gut_boost: 'Reforço Intestinal Pro e Digestão Suave',
    maca_plus: 'Ame-me Agora - Maca Plus',
    omega3: 'Ômega-3 EPA 180 mg + DHA 120 mg',
    vitamin_d3: 'Vitamina D3 2.000 UI',
    magnesium: 'Glicinato de Magnésio',
    energy_strips: 'Tiras de Energia',
    glutamine: 'L-Glutamina em Pó',
    sleep_strips: 'Tiras para Dormir',
    hydraglow_peach_mango: 'Hydraglow em Pó (Pêssego e Manga)',
    hydraglow_lychee: 'Hydraglow em Pó (Lichia)',
    hydraglow_lemonade: 'Hydraglow em Pó (Limonada)',
    apple_cider_vinegar: 'Cápsulas de Vinagre de Maçã',
    berberine: 'Berberina+ e Perda de Peso',
    glp1_support: 'Suporte GLP-1 | Fórmula Diária Metabólica, Intestinal e de Micronutrientes',
    colon_cleanse: 'Limpeza Suave do Cólon',
    colostrum: 'Cápsulas de Colostro',
    creatine: 'Monohidrato de Creatina',
    fat_burner: 'Queimador de Gordura e Controle do Apetite',
    collagen_choc: 'Chocolate - Peptídeos de Colágeno em Pó de Gado Alimentado com Capim',
    nad_antiaging: 'NAD+ Energia Celular e Antienvelhecimento',
    collagen_peptides: 'Sem Sabor - Peptídeos de Colágeno Hidrolisado de Gado Alimentado com Capim',
    collagen_vanilla: 'Baunilha - Creme em Pó com Peptídeos de Colágeno de Gado Alimentado com Capim',
    whey_choc: 'Chocolate - Isolado Avançado de Proteína do Soro 100%',
    whey_vanilla: 'Baunilha - Isolado Avançado de Proteína do Soro 100%',
    shipping: 'Frete',
    slimboost: 'Impulso Emagrecedor',
    detox_tea: 'Chá Detox',
  },
};

const translateDuration = (productName, lang) => {
  if (lang === 'en') return productName;

  const translations = DURATION_TRANSLATIONS[lang];
  if (!translations) return productName;

  let translated = productName;
  Object.keys(translations).forEach(en => {
    const regex = new RegExp(en, 'gi');
    translated = translated.replace(regex, translations[en]);
  });

  return translated;
};

const translateProductName = (product, lang) => {
  if (lang === 'en') return product.name;
  return PRODUCT_NAME_TRANSLATIONS[lang]?.[product.id] || translateDuration(product.name, lang);
};

const calculateSplitAmounts = (totalCents, count, firstAmountCents = null) => {
  const remainingCents = firstAmountCents === null ? totalCents : totalCents - firstAmountCents;
  const remainingLinks = firstAmountCents === null ? count : count - 1;
  if (remainingLinks < 1 || remainingCents < remainingLinks) return [];
  const base = Math.floor(remainingCents / remainingLinks);
  const extra = remainingCents % remainingLinks;
  const amounts = Array.from({ length: remainingLinks }, (_, index) => base + (index < extra ? 1 : 0));
  return firstAmountCents === null ? amounts : [firstAmountCents, ...amounts];
};

const OrderReview = ({ selectedProducts, selectedState, bmi, onBack }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [splitPayment, setSplitPayment] = useState(false);
  const [splitPaymentLinks, setSplitPaymentLinks] = useState([]);
  const [splitCreatingPart, setSplitCreatingPart] = useState(null);
  const [splitCount, setSplitCount] = useState(2);
  const [customFirstPayment, setCustomFirstPayment] = useState(false);
  const [firstPaymentAmount, setFirstPaymentAmount] = useState('');
  const [manualPaymentConfirm, setManualPaymentConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [error, setError] = useState(null);
  const [paymentType, setPaymentType] = useState('onetime');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponCopied, setCouponCopied] = useState(false);

  // Pay Later state
  const [showPayLaterModal, setShowPayLaterModal] = useState(false);
  const [payLaterLink, setPayLaterLink] = useState(null);
  const [payLaterLoading, setPayLaterLoading] = useState(false);
  const [payLaterError, setPayLaterError] = useState(null);
  const [copiedPayLater, setCopiedPayLater] = useState(false);
  const [copiedViewable, setCopiedViewable] = useState(false);
  const [payLaterLang, setPayLaterLang] = useState('en');

  // Sheet links state
  const [sheetLinks, setSheetLinks] = useState(null);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksOpen, setLinksOpen] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);

  // Map catalog product IDs to the current product identifiers in the link sheet.
  const PRODUCT_LINK_KEYS = {
    sema_micro_2mo: { product: 'SemaMicro', absolute: 'SemaMicro' },
    sema_starter_3mo: { product: 'Sema1mg' },
    sema_starter_6mo: { product: 'Sema3mg' },
    sema_starter_12mo: { product: 'Sema7mg' },
    sema10_1mo: { product: 'Sema10mg' },
    tirz_micro_2mo: { product: 'TirzeMicro' },
    tirz_starter_3mo: { product: 'Tirze8mg' },
    tirz_starter_6mo: { product: 'Tirze24mg' },
    tirz_starter_12mo: { product: 'Tirze52mg' },
    tirz60_1mo: { product: 'Tirze60mg' },
    nad: { product: 'NAD' },
    nad_3mo: { product: 'NAD + 3Months' },
    lipo: { product: 'LipoMino - One Time 30-day Purchase' },
    lipo_3mo: { product: 'LipoMino - One Time 90-day Purchase' },
    ghkcu_1mo: { product: 'GHK-Cu Troches - One month' },
    ghkcu_3mo: { product: 'GHK-Cu Troches - 3 Months' },
    sermorelin_1mo: { product: 'Sermorelin (One Time / 30-Day Supply)' },
    sermorelin_2mo: { product: 'Sermorelin (One Time / 60-Day Supply)' },
    glutathione_2mo: { product: 'Glutathione 2 Months' },
    glutathione_4mo: { product: 'Glutathione 4 Months' },
  };

  const getProductTreatmentLinks = (productId) => {
    const keys = PRODUCT_LINK_KEYS[productId];
    if (!keys || !sheetLinks) return null;

    const entry = {
      productLink: keys.product ? sheetLinks[keys.product]?.productLink : undefined,
      absoluteLink: keys.absolute ? sheetLinks[keys.absolute]?.absoluteLink : undefined,
    };

    return entry.productLink || entry.absoluteLink ? entry : null;
  };

  useEffect(() => {
    setLinksLoading(true);
    fetch('/api/sheet-links')
      .then(r => r.json())
      .then(data => { setSheetLinks(data); setLinksLoading(false); })
      .catch(() => setLinksLoading(false));
  }, []);

  const handleCopySheetLink = (url, key) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const baseTotal = selectedProducts.reduce((sum, p) => {
    const qty = p.quantity || 1;
    return sum + (p.price * qty);
  }, 0);

  const feeAmount = (paymentType === 'installment' || paymentType === 'paylater') ? baseTotal * 0.06 : 0;
  // Calculate Zelle discount on the base total.
  const zelleDiscount = paymentType === 'zelle_venmo_cashapp' ? baseTotal * 0.02 : 0;
  const totalWithFee = baseTotal + feeAmount - zelleDiscount;

  const biweekly = paymentType === 'installment' ? (totalWithFee / 4).toFixed(2) : null;
  const sixMonth = paymentType === 'installment' ? (totalWithFee / 6).toFixed(2) : null;
  const totalCents = Math.round(totalWithFee * 100);
  const firstAmountCents = customFirstPayment && firstPaymentAmount !== '' ? Math.round(Number(firstPaymentAmount) * 100) : null;
  const splitAmountCents = calculateSplitAmounts(totalCents, splitCount, firstAmountCents);
  const splitAmounts = splitAmountCents.map(amount => amount / 100);
  const splitConfigurationValid = !customFirstPayment || (
    Number.isSafeInteger(firstAmountCents) && firstAmountCents > 0 && firstAmountCents <= totalCents - (splitCount - 1)
  );

  const handleConfirm = async () => {
    if (paymentType === 'zelle_venmo_cashapp') {
      setManualPaymentConfirm(true);
      return;
    }

    if (paymentType === 'paylater') {
      setShowPayLaterModal(true);
      setPayLaterLoading(true);
      setPayLaterError(null);
      setPayLaterLink(null);
      try {
        const response = await fetch('/api/create-payment-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: selectedProducts.map(p => ({
              ...p,
              price: p.price
            })),
            paymentType: 'installment', // sends 6% fee included
            totalWithFee,
            feeAmount
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Server error (${response.status})`);
        if (data.url) setPayLaterLink(data.url);
        else throw new Error('No payment URL returned from server');
      } catch (err) {
        setPayLaterError(err.message || 'Failed to create link. Please try again.');
      } finally {
        setPayLaterLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSplitPaymentLinks([]);
    try {
      // For single product with an existing Stripe link, use it directly
      if (!splitPayment && selectedProducts.length === 1 && selectedProducts[0].link) {
        setPaymentLink(selectedProducts[0].link);
        setLoading(false);
        return;
      }

      const createLink = async (extraBody = {}) => {
        const response = await fetch('/api/create-payment-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: selectedProducts, paymentType, totalWithFee, feeAmount, ...extraBody })
        });
        const responseText = await response.text();
        let data;
        try { data = responseText ? JSON.parse(responseText) : {}; } catch { data = {}; }
        if (!response.ok) throw new Error(data.error || `Payment server error (${response.status}). Please try again.`);
        if (!data.url) throw new Error('The payment server returned no link. Please try again.');
        return data.url;
      };

      if (splitPayment) {
        if (!splitConfigurationValid) throw new Error('Enter a valid first payment that leaves at least $0.01 for every remaining link.');
        const splitGroup = `split_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        const urls = [];
        for (let part = 1; part <= splitCount; part += 1) {
          setSplitCreatingPart(part);
          const url = await createLink({ splitPayment: true, splitPart: part, splitCount, firstPaymentAmount: customFirstPayment ? firstPaymentAmount : null, splitGroup });
          urls.push(url);
          setSplitPaymentLinks([...urls]);
        }
        setPaymentLink(urls[0]);
      } else {
        setPaymentLink(await createLink());
      }
    } catch (err) {
      console.error('Error creating payment link:', err);
      setError(err.message || 'Failed to create payment link. Please try again.');
    } finally {
      setLoading(false);
      setSplitCreatingPart(null);
    }
  };

  const buildPayLaterMessage = (link) => {
    const t = PAYLATER_TRANSLATIONS[payLaterLang];
    const lines = [];
    lines.push('📸 Instagram: @dharma.clinic');
    lines.push('');
    selectedProducts.forEach(p => {
      const emoji = getProductEmoji(p);
      lines.push(`${emoji} ${translateProductName(p, payLaterLang)}`);
    });
    lines.push('');
    lines.push(`🤝 ${t.customerSupport}`);
    lines.push(`💰 $${totalWithFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    lines.push('');
    lines.push(`⏰ ${t.validUntil}`);
    lines.push(link);
    return lines.join('\n');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySplitLink = (link, index) => {
    navigator.clipboard.writeText(link);
    setCopied(index);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in" style={{ position: 'relative', paddingBottom: '180px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STEP 5 OF 5</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)',
            borderRadius: '10px', padding: '8px 14px'
          }}>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>State</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedState}</div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)',
            borderRadius: '10px', padding: '8px 14px'
          }}>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>BMI</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary)' }}>{bmi}</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Order Summary</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '1.0625rem' }}>Finalized patient plan ready for confirmation</p>
      </div>

      {/* Items List */}
      <div className="card glass" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          SELECTED ITEMS ({selectedProducts.reduce((sum, p) => sum + (p.quantity || 1), 0)})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {selectedProducts.map((product) => {
            const qty = product.quantity || 1;
            return (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.55)',
                  borderRadius: '20px',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: product.type === 'supplement' ? 'rgba(20, 83, 45, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {product.type === 'supplement' ? <Leaf size={18} color="#14532d" /> : product.type === 'standalone' ? <Package size={18} color="var(--primary)" /> : <Pill size={18} color="var(--primary)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: '800', color: product.type === 'supplement' ? '#14532d' : 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                      {product.type === 'nutrition_withplan' ? 'Payment Plan' : product.type === 'nutrition_noplan' ? 'One-Time' : product.type}
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                      {product.name}
                      {qty > 1 && <span style={{ color: 'var(--text-muted)', fontWeight: '500', marginLeft: '8px' }}>x{qty}</span>}
                    </div>
                    {product.usage && (
                      <div style={{ fontSize: '0.75rem', color: '#14532d', fontWeight: '700', marginTop: '4px' }}>
                        {product.usage}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.125rem', color: 'var(--text-main)', flexShrink: 0, marginLeft: '1rem', textAlign: 'right' }}>
                  ${(product.price * qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Treatment Links (collapsible) */}
      <div className="card glass" style={{ marginBottom: '2rem', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <button
          onClick={() => setLinksOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 2rem', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: linksOpen ? '1px solid var(--glass-border)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Treatment Links
            </span>
            {linksLoading && <Loader size={13} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />}
            {!linksLoading && sheetLinks && (
              <span style={{ fontSize: '0.65rem', fontWeight: '700', background: 'rgba(212,175,55,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '20px' }}>
                LIVE
              </span>
            )}
          </div>
          {linksOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </button>

        {linksOpen && (
          <div style={{ padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {linksLoading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>Fetching live links…</p>
            )}
            {!linksLoading && (!sheetLinks || Object.keys(sheetLinks).length === 0) && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>Could not load links — API server may not be running.</p>
            )}
            {!linksLoading && sheetLinks && selectedProducts.map(product => {
              const entry = getProductTreatmentLinks(product.id);
              if (!entry) return null;
              return (
                <div key={product.id} style={{ background: 'rgba(255,255,255,0.55)', borderRadius: '16px', padding: '1rem 1.25rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    {product.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {entry.productLink && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', background: '#f1f5f9', borderRadius: '6px', padding: '2px 8px', flexShrink: 0 }}>PRODUCT</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.productLink}</span>
                        <button onClick={() => handleCopySheetLink(entry.productLink, `${product.id}-product`)} style={{ flexShrink: 0, background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {copiedLink === `${product.id}-product` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          {copiedLink === `${product.id}-product` ? 'Copied' : 'Copy'}
                        </button>
                        <a href={entry.productLink} target="_blank" rel="noreferrer" style={{ flexShrink: 0, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700' }}>
                          <ExternalLink size={12} /> Open
                        </a>
                      </div>
                    )}
                    {entry.absoluteLink && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#0d9488', background: '#ccfbf1', borderRadius: '6px', padding: '2px 8px', flexShrink: 0 }}>ABSOLUTE</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.absoluteLink}</span>
                        <button onClick={() => handleCopySheetLink(entry.absoluteLink, `${product.id}-absolute`)} style={{ flexShrink: 0, background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {copiedLink === `${product.id}-absolute` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          {copiedLink === `${product.id}-absolute` ? 'Copied' : 'Copy'}
                        </button>
                        <a href={entry.absoluteLink} target="_blank" rel="noreferrer" style={{ flexShrink: 0, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700' }}>
                          <ExternalLink size={12} /> Open
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!linksLoading && sheetLinks && selectedProducts.every(p => !getProductTreatmentLinks(p.id)) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem' }}>No treatment links available for the selected products.</p>
            )}
          </div>
        )}
      </div>

      {/* Coupon Dropdown */}
      <div className="card glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          COUPON
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={selectedCoupon || ''}
            onChange={(e) => setSelectedCoupon(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
              fontWeight: '500',
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '18px'
            }}
          >
            <option value="">Select a coupon...</option>
            {COUPONS.map(coupon => (
              <option key={coupon.code} value={coupon.code}>
                {coupon.discount}% - {coupon.code}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selectedCoupon) {
                navigator.clipboard.writeText(selectedCoupon);
                setCouponCopied(true);
                setTimeout(() => setCouponCopied(false), 2000);
              }
            }}
            disabled={!selectedCoupon}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: selectedCoupon ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.5)',
              color: selectedCoupon ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: selectedCoupon ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {couponCopied ? <Check size={14} /> : <Copy size={14} />}
            {couponCopied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Payment Type Selection */}
      <div className="card glass" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          PAYMENT TYPE
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPaymentType('onetime')}
            style={{
              flex: '1 1 120px',
              padding: '1rem',
              borderRadius: '16px',
              border: paymentType === 'onetime' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              background: paymentType === 'onetime' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: paymentType === 'onetime' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            One-Time Payment
          </button>
          <button
            onClick={() => setPaymentType('installment')}
            style={{
              flex: '1 1 120px',
              padding: '1rem',
              borderRadius: '16px',
              border: paymentType === 'installment' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              background: paymentType === 'installment' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: paymentType === 'installment' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Installment = Processing & Handling (6% fee)
          </button>
          <button
            onClick={() => { setPaymentType('zelle_venmo_cashapp'); setSplitPayment(false); }}
            style={{
              flex: '1 1 120px',
              padding: '1rem',
              borderRadius: '16px',
              border: paymentType === 'zelle_venmo_cashapp' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              background: paymentType === 'zelle_venmo_cashapp' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: paymentType === 'zelle_venmo_cashapp' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            ZELLE/VENMO/CASHAPP<br /><span style={{ fontSize: '0.75rem', fontWeight: '800', color: paymentType === 'zelle_venmo_cashapp' ? 'var(--primary)' : '#16a34a' }}>(2% Off)</span>
          </button>
          <button
            onClick={() => { setPaymentType('paylater'); setSplitPayment(false); }}
            style={{
              flex: '1 1 120px',
              padding: '1rem',
              borderRadius: '16px',
              border: paymentType === 'paylater' ? '2px solid #7c3aed' : '1px solid var(--glass-border)',
              background: paymentType === 'paylater' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: paymentType === 'paylater' ? '#7c3aed' : 'var(--text-muted)',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> Pay Later
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: paymentType === 'paylater' ? '#7c3aed' : '#94a3b8' }}>Send Template</span>
          </button>
        </div>
        {(paymentType === 'onetime' || paymentType === 'installment') && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '14px', border: splitPayment ? '2px solid var(--primary)' : '1px solid var(--glass-border)', background: splitPayment ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={splitPayment} onChange={(event) => setSplitPayment(event.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <strong style={{ fontSize: '0.9rem' }}>Create multiple payment links</strong>
            </label>
            {splitPayment && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'grid', gap: '0.85rem' }}>
                <label style={{ display: 'grid', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                  Number of payment links
                  <select value={splitCount} onChange={(event) => setSplitCount(Number(event.target.value))} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '0.85rem' }}>
                    {[2, 3, 4, 5].map(count => <option key={count} value={count}>Split into {count} links</option>)}
                  </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700' }}>
                  <input type="checkbox" checked={customFirstPayment} onChange={(event) => setCustomFirstPayment(event.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Set a custom amount for the first link
                </label>
                {customFirstPayment && (
                  <label style={{ display: 'grid', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                    First payment amount
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: `1px solid ${splitConfigurationValid ? 'var(--glass-border)' : '#dc2626'}`, borderRadius: '10px', paddingLeft: '0.75rem' }}>
                      <span>$</span>
                      <input type="number" min="0.01" step="0.01" value={firstPaymentAmount} onChange={(event) => setFirstPaymentAmount(event.target.value)} placeholder="350.00" style={{ width: '100%', padding: '0.7rem', border: 'none', outline: 'none', background: 'transparent' }} />
                    </div>
                  </label>
                )}
                {splitConfigurationValid && splitAmounts.length === splitCount ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                    {splitAmounts.map((amount, index) => <span key={index} style={{ display: 'inline-block', marginRight: '12px' }}>Link {index + 1}: <b>${amount.toFixed(2)}</b></span>)}
                  </div>
                ) : customFirstPayment && <div style={{ color: '#dc2626', fontSize: '0.78rem' }}>Enter a first amount below the total and leave at least $0.01 for each remaining link.</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 320px)',
        maxWidth: '900px',
        padding: '1.5rem 2rem',
        borderRadius: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 200,
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(20, 83, 45, 0.1)',
            border: '1px solid rgba(20, 83, 45, 0.25)',
            borderRadius: '16px',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <ShoppingCart size={22} color="#14532d" />
            <div>
              <div style={{ fontSize: '0.5625rem', fontWeight: '800', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                {paymentType === 'installment' ? 'TOTAL WITH 6% FEE' : 'GRAND TOTAL'}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#14532d' }}>
                ${totalWithFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              {zelleDiscount > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {zelleDiscount > 0 && <span>Zelle/Venmo 2% Discount: -${zelleDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>}
                </div>
              )}
              {paymentType === 'installment' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px', fontSize: '0.875rem', fontWeight: '700', color: '#d4af37' }}>
                  <span>${biweekly}/biweekly</span>
                  <span style={{ color: 'rgba(212, 175, 55, 0.3)' }}>|</span>
                  <span>${sixMonth}/6mo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn"
            style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', fontWeight: '600', color: '#1f2937' }}
            onClick={onBack}
          >
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '16px' }}
            onClick={() => setShowConfirm(true)}
          >
            Confirm <ArrowRight size={18} style={{ marginLeft: '6px' }} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card glass animate-in" style={{ maxWidth: '400px', width: '90%', padding: '2.5rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(255,255,255,1)' }}>
            {!paymentLink && !manualPaymentConfirm ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <CreditCard size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Confirm Payment</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.0625rem', lineHeight: '1.4' }}>Are you sure you want to proceed and finalize this patient's order?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className="btn"
                    style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    onClick={() => { setShowConfirm(false); setPaymentLink(null); setError(null); setManualPaymentConfirm(false); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? (splitCreatingPart ? `Creating link ${splitCreatingPart} of ${splitCount}...` : 'Creating...') : 'Yes, Proceed'}
                  </button>
                </div>
                {error && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', color: '#dc2626', fontSize: '0.875rem', fontWeight: '500' }}>
                    ⚠️ {error}
                  </div>
                )}
              </>

            ) : manualPaymentConfirm ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(20, 83, 45, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <CreditCard size={32} color="#14532d" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Awaiting Manual Payment</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: '1.4' }}>Instruct the patient to send <b>${totalWithFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b> based on these details:</p>

                <div style={{
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.8125rem',
                  textAlign: 'left',
                  border: '1px solid rgba(0,0,0,0.05)',
                  maxHeight: '180px',
                  overflowY: 'auto'
                }}>
                  <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <strong style={{ fontSize: '0.9375rem' }}>Zelle</strong><br />
                    <span style={{ color: 'var(--text-muted)' }}>Name:</span> Dharma Nutrition Clinic<br />
                    <span style={{ color: 'var(--text-muted)' }}>Email:</span> admin@dharmanutritionclinic.com<br />
                    <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span> 9546680123
                  </div>
                  <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <strong style={{ fontSize: '0.9375rem' }}>Venmo</strong><br />
                    <span style={{ color: 'var(--text-muted)' }}>Name:</span> Dharma Nutrition Clinic<br />
                    <span style={{ color: 'var(--text-muted)' }}>User:</span> @dharmanutritionclinic
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9375rem' }}>CashApp</strong><br />
                    <span style={{ color: 'var(--text-muted)' }}>Name:</span> Dharma Nutrition Clinic<br />
                    <span style={{ color: 'var(--text-muted)' }}>User:</span> $dharmanutrition
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem' }}>Make sure they include their name in the payment memo!</p>

                <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                  <button
                    className="btn"
                    style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    onClick={() => {
                      const data = {
                        amount: totalWithFee,
                        zelleDiscount: zelleDiscount > 0 ? zelleDiscount : undefined,
                        items: selectedProducts.map(p => ({
                          name: p.name,
                          quantity: p.quantity || 1,
                          unitPrice: p.price,
                        })),
                      };
                      const encoded = btoa(JSON.stringify(data));
                      const link = `${window.location.origin}/?invoice=${encoded}`;
                      navigator.clipboard.writeText(link);
                      setCopiedInvoice(true);
                      setTimeout(() => setCopiedInvoice(false), 2000);
                    }}
                  >
                    {copiedInvoice ? <Check size={16} /> : <Copy size={16} />}
                    {copiedInvoice ? 'Invoice Link Copied!' : 'Copy Patient Invoice Link'}
                  </button>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => { setShowConfirm(false); setManualPaymentConfirm(false); }}
                  >
                    Close & Finish
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(20, 83, 45, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <Link size={32} color="#14532d" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{splitPaymentLinks.length ? 'Split Payment Links Created!' : 'Payment Link Created!'}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.4' }}>{splitPaymentLinks.length ? `All ${splitPaymentLinks.length} links must be paid to complete the order.` : 'Share this link with your patient to complete their payment'}</p>
                {splitPaymentLinks.length ? splitPaymentLinks.map((link, index) => (
                  <div key={link} style={{ marginBottom: '1rem', textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>PART {index + 1} — ${splitAmounts[index].toFixed(2)}</div>
                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.04)', borderRadius: '12px', marginBottom: '0.5rem', wordBreak: 'break-all', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{link}</div>
                    <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleCopySplitLink(link, index)}>
                      {copied === index ? <Check size={18} /> : <Copy size={18} />}
                      {copied === index ? 'Link Copied!' : `Copy Part ${index + 1} Link`}
                    </button>
                  </div>
                )) : <><div style={{
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.04)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  wordBreak: 'break-all',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)'
                }}>
                  {paymentLink}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={handleCopyLink}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
                </>}
                <button
                  className="btn"
                  style={{ width: '100%', marginTop: '0.75rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}
                  onClick={() => { setShowConfirm(false); setPaymentLink(null); setSplitPaymentLinks([]); }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pay Later Modal */}
      {showPayLaterModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card glass animate-in" style={{
            maxWidth: '480px', width: '92%', padding: '2.5rem',
            background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(255,255,255,1)',
            borderRadius: '24px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                background: 'rgba(124, 58, 237, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Clock size={24} color="#7c3aed" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '2px', color: '#1e1b4b' }}>Pay Later Template</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>Copy & send to patient via WhatsApp or DM</p>
              </div>
            </div>

            {/* Template Box */}
            {payLaterLoading && (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Creating Stripe link…</p>
              </div>
            )}

            {payLaterError && (
              <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                ⚠️ {payLaterError}
              </div>
            )}

            {!payLaterLoading && payLaterLink && (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '4px' }}>
                  <button
                    onClick={() => setPayLaterLang('en')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px 0 0 8px',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRight: 'none',
                      background: payLaterLang === 'en' ? '#d4af37' : 'transparent',
                      color: payLaterLang === 'en' ? '#0f172a' : '#d4af37',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setPayLaterLang('es')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '0',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRight: 'none',
                      background: payLaterLang === 'es' ? '#d4af37' : 'transparent',
                      color: payLaterLang === 'es' ? '#0f172a' : '#d4af37',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => setPayLaterLang('pt')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '0 8px 8px 0',
                      border: '1px solid rgba(212,175,55,0.3)',
                      background: payLaterLang === 'pt' ? '#d4af37' : 'transparent',
                      color: payLaterLang === 'pt' ? '#0f172a' : '#d4af37',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    PT
                  </button>
                </div>

                <div style={{
                  background: '#0f172a',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.25rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  {buildPayLaterMessage(payLaterLink)}
                </div>

                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginBottom: '0.625rem',
                    background: copiedPayLater ? '#16a34a' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'background 0.3s'
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(buildPayLaterMessage(payLaterLink));
                    setCopiedPayLater(true);
                    setTimeout(() => setCopiedPayLater(false), 2500);
                  }}
                >
                  {copiedPayLater ? <Check size={16} /> : <Copy size={16} />}
                  {copiedPayLater ? 'Message Copied! ✓' : 'Copy Message'}
                </button>

                <button
                  className="btn"
                  style={{
                    width: '100%',
                    marginBottom: '0.75rem',
                    background: 'rgba(124, 58, 237, 0.08)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: '700'
                  }}
                  onClick={() => {
                    const data = {
                      type: 'paylater',
                      amount: totalWithFee,
                      stripeLink: payLaterLink,
                      items: selectedProducts.map(p => ({
                        name: p.name,
                        quantity: p.quantity || 1,
                        unitPrice: p.price,
                      })),
                    };
                    const encoded = btoa(JSON.stringify(data));
                    const link = `${window.location.origin}/?invoice=${encoded}`;
                    navigator.clipboard.writeText(link);
                    setCopiedViewable(true);
                    setTimeout(() => setCopiedViewable(false), 2500);
                  }}
                >
                  {copiedViewable ? <Check size={16} /> : <ExternalLink size={16} />}
                  {copiedViewable ? 'Link Copied! ✓' : 'Copy Viewable Link'}
                </button>
              </>
            )}

            <button
              className="btn"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)'
              }}
              onClick={() => {
                setShowPayLaterModal(false);
                setPayLaterLink(null);
                setPayLaterError(null);
                setCopiedPayLater(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes popIn {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(5deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default OrderReview;
