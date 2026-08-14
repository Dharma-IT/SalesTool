/**
 * Data and Utilities for Sales Tool
 * Complete product catalog with type-based categorization
 *
 * Type Rules:
 *   - Supplements → supplement
 *   - Standalone medical items (no bundle) → standalone
 *   - Everything else → nutrition_noplan (One-Time)
 */

export const STATES = [
  { name: 'Alabama', abv: 'AL' }, { name: 'Alaska', abv: 'AK' }, { name: 'Arizona', abv: 'AZ' },
  { name: 'Arkansas', abv: 'AR' }, { name: 'California', abv: 'CA' }, { name: 'Colorado', abv: 'CO' },
  { name: 'Connecticut', abv: 'CT' }, { name: 'Delaware', abv: 'DE' }, { name: 'District of Columbia', abv: 'DC' },
  { name: 'Florida', abv: 'FL' }, { name: 'Georgia', abv: 'GA' }, { name: 'Hawaii', abv: 'HI' },
  { name: 'Idaho', abv: 'ID' }, { name: 'Illinois', abv: 'IL' }, { name: 'Indiana', abv: 'IN' },
  { name: 'Iowa', abv: 'IA' }, { name: 'Kansas', abv: 'KS' }, { name: 'Kentucky', abv: 'KY' },
  { name: 'Louisiana', abv: 'LA' }, { name: 'Maine', abv: 'ME' }, { name: 'Maryland', abv: 'MD' },
  { name: 'Massachusetts', abv: 'MA' }, { name: 'Michigan', abv: 'MI' }, { name: 'Minnesota', abv: 'MN' },
  { name: 'Mississippi', abv: 'MS' }, { name: 'Missouri', abv: 'MO' }, { name: 'Montana', abv: 'MT' },
  { name: 'Nebraska', abv: 'NE' }, { name: 'Nevada', abv: 'NV' }, { name: 'New Hampshire', abv: 'NH' },
  { name: 'New Jersey', abv: 'NJ' }, { name: 'New Mexico', abv: 'NM' }, { name: 'New York', abv: 'NY' },
  { name: 'North Carolina', abv: 'NC' }, { name: 'North Dakota', abv: 'ND' }, { name: 'Ohio', abv: 'OH' },
  { name: 'Oklahoma', abv: 'OK' }, { name: 'Oregon', abv: 'OR' }, { name: 'Pennsylvania', abv: 'PA' },
  { name: 'Rhode Island', abv: 'RI' }, { name: 'South Carolina', abv: 'SC' }, { name: 'South Dakota', abv: 'SD' },
  { name: 'Tennessee', abv: 'TN' }, { name: 'Texas', abv: 'TX' }, { name: 'Utah', abv: 'UT' },
  { name: 'Vermont', abv: 'VT' }, { name: 'Virginia', abv: 'VA' }, { name: 'Washington', abv: 'WA' },
  { name: 'West Virginia', abv: 'WV' }, { name: 'Wisconsin', abv: 'WI' }, { name: 'Wyoming', abv: 'WY' }
];

// Allowed states for GLP-1 / prescription medications
const GLP1_STATES = 'AZ, CA, CO, CT, DE, FL, GA, HI, IL, IA, MA, ME, MD, MI, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SD, TN, TX, UT, VT, VA, WA, WI, WY';

// Semaglutide specific states (includes Indiana, Minnesota, South Carolina)
const SEMAGLUTIDE_STATES = 'AZ, CA, CO, CT, DE, FL, GA, HI, IL, IA, MA, ME, MD, MI, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SD, TN, TX, UT, VT, VA, WA, WI, WY, IN, MN, SC';

const GLP1_NO_TIRZ = 'AZ, CO, CT, DE, FL, GA, HI, IL, IA, MA, ME, MD, MI, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SD, TN, TX, UT, VT, VA, WA, WI, WY';
// Tirzepatide is also available in Indiana, Minnesota, and South Carolina.
const TIRZEPATIDE_STATES = 'AZ, CA, CO, CT, DE, FL, GA, HI, IL, IA, MA, ME, MD, MI, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SD, TN, TX, UT, VT, VA, WA, WI, WY, IN, MN, SC';

// Qualifying comorbidities — unlock GLP-1 eligibility for BMI 25–29.9
export const QUALIFYING_CONDITIONS = [
  'High Blood Pressure (Hypertension)',
  'High Cholesterol (Dyslipidemia)',
  'Type 2 Diabetes or Prediabetes',
  'PCOS (Polycystic Ovarian Syndrome)',
  'Fatty Liver (NAFLD)',
  'Obstructive Sleep Apnea (OSA)',
  'GERD (Gastroesophageal Reflux Disease)',
  'Osteoarthritis',
  'COPD or Exercise-induced Asthma',
  'Increased Risk of Heart Attack or Stroke',
];

// Absolute contraindications — auto-disqualify from ALL GLP-1 products
export const CONTRAINDICATIONS = [
  'MEN 2 (Multiple Endocrine Neoplasia Type 2)',
  'Medullary Thyroid Cancer (personal or family history)',
  'Any Active Cancer',
  'Symptomatic / Unstable Heart Failure',
  'Unstable Arrhythmias (Tachycardia / AFib)',
  'Chronic Kidney Disease (Stage 3+)',
  'Cirrhosis',
  'Pancreatitis',
  'Active Gallbladder Disease',
  'Gallstones',
  'Kidney Stones',
  'Gastroparesis',
  "Barrett's Esophagus",
  'Gastric Bypass / Sleeve Surgery (within 12 months)',
  'History of Eating Disorders (Anorexia / Bulimia)',
  'History of Suicide / Homicide Attempts or Active Ideation',
  'Type 1 Diabetes',
  'Hypoglycemia',
  'Hypothyroidism (any)',
  'Hyperthyroidism (any)',
  'Organ Transplant (on anti-rejection meds)',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Recently Pregnant (past 9 months) without OB Clearance',
];

// Disqualifying medications — patients taking these cannot receive GLP-1
export const DISQUALIFYING_MEDICATIONS = [
  'Insulin',
  'Sulfonylureas (e.g., Glyburide, Glipizide)',
  'Meglitinides',
  "St. John's Wort",
];

// ── NEW CONDITIONS FOR NON-GLP PRODUCTS ──

// NAD+ Contraindications
export const NAD_CONTRAINDICATIONS = [
  'Uncontrolled Hypertension (High Blood Pressure) or Heart Disease',
  'History of Stroke or Heart Attack',
  'History of Thromboembolism (Blood Clots)',
  'Cirrhosis (Liver scarring)',
  'Severe Kidney or Liver Disease',
  'Seizure Disorders',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Active Cancer',
  'Active Infection',
  'Behçet Syndrome (unless cleared by a rheumatologist)',
];

// Lipo-Mino Disqualifying Conditions
export const LIPOMINO_DISQUALIFYING_CONDITIONS = [
  'Schizophrenia or Bipolar Disorder',
  'Liver Disease or Kidney Disease',
  'Seizure disorder',
  "Parkinson's disease",
  "Leber's Hereditary Optic Neuropathy (LHON)",
  'Current/History of Metabolic Acidosis',
  'Trimethylaminuria',
  'Homocystinuria',
  'Hypothyroidism (any)',
  'Hyperthyroidism (any)',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Allergy to Methionine, Inositol, Choline, B Vitamins, or L-Carnitine',
  'Active Cancer',
  'History of Cancer (without physician clearance)'
];

// Lipo-Mino Allowed Conditions (Green Light)
export const LIPOMINO_ALLOWED_CONDITIONS = [
  'Fatty Liver (Hepatic Steatosis)',
  'Insulin Resistance',
  'Metabolic Syndrome',
  'Chronic Fatigue',
  'Low Exercise Performance / Athletes seeking longevity'
];

// Lipo-Mino Disqualifying Medications
export const DISQUALIFYING_MEDICATIONS_LIPOMINO = [
  "Levodopa (Parkinson's)",
  'MAO Inhibitors (e.g., phenelzine, tranylcypromine)',
  'Mood Stabilizers (e.g., Lithium)',
  'Anticoagulants (e.g., Warfarin)',
  'Thyroid Medication (e.g., Levothyroxine)',
  'Insulin',
  'Sulfonylureas (e.g., glyburide, glipizide)',
  'Anticholinergics (e.g., benztropine)',
  'Nitroprusside'
];

export const GLUTATHIONE_CONTRAINDICATIONS = [
  'Under 18 years old',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Active Cancer or History of Cancer',
  'Symptomatic heart failure (unstable/untreated)',
  'Dysrhythmia, tachycardia, or atrial fibrillation (unstable/untreated)',
  'Liver cirrhosis or end-stage liver disease',
  'Chronic kidney disease stage 3 or greater',
  'Blood clotting disorder',
  'Recent surgery or hospitalization',
  'Nitroglycerine/Nitrates or Steroids',
  'Blood thinners (Warfarin, Coumadin, etc.)',
  "St. John's Wort, Grapefruit Seed Extract, Quercetin, or Ginseng"
];

export const GHKCU_CONTRAINDICATIONS = [
  'Under 18 years old',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Active Cancer or History of Cancer',
  'Symptomatic heart failure (unstable/untreated)',
  'Dysrhythmia, tachycardia, or atrial fibrillation (unstable/untreated)',
  'Liver cirrhosis or end-stage liver disease',
  'Chronic kidney disease stage 3 or greater',
  'Blood clotting disorder',
  'Recent surgery or hospitalization',
  'Nitroglycerine/Nitrates or Steroids',
  'Blood thinners (Warfarin, Coumadin, etc.)',
  "St. John's Wort, Grapefruit Seed Extract, Quercetin, or Ginseng"
];

export const SERMORELIN_CONTRAINDICATIONS = [
  'Under 18 years old',
  'Currently Pregnant',
  'Breastfeeding',
  'Planning Pregnancy',
  'Active malignancy or a history of cancer',
  'Known allergy to Sermorelin or its components',
  'Unstable/untreated heart failure, tachycardia, atrial fibrillation, or dysrhythmia',
  'Liver cirrhosis or end-stage liver disease',
  'Chronic Kidney Disease (CKD) Stage 3 or greater',
  'Diagnosed blood clotting or coagulation disorders',
  'Recent surgery or hospitalization',
  'Nitroglycerine/Nitrates or Steroids',
  'Blood thinners (Warfarin, Coumadin, etc.)',
  "St. John's Wort, Grapefruit Seed Extract, Quercetin, or Ginseng"
];

// ── UNIFIED MEDICAL SCREENING ──
// All medical conditions (GLP + NAD + Lipo-Mino + GHK + Glutathione + Sermorelin) - deduplicated

export const UNIFIED_CONTRAINDICATIONS = {
  AGE: [
    { condition: 'Under 18 years old', products: ['ghk', 'sermorelin', 'glutathione'] }
  ],
  REPRODUCTIVE: [
    { condition: 'Currently Pregnant', products: ['glp', 'nad', 'lipomino', 'ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Breastfeeding', products: ['glp', 'nad', 'lipomino', 'ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Planning Pregnancy', products: ['glp', 'nad', 'lipomino', 'ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Recently Pregnant (past 9 months) without OB Clearance', products: ['glp'] }
  ],
  ONCOLOGY: [
    { condition: 'Active Cancer', products: ['glp', 'nad', 'lipomino', 'ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Active Cancer or History of Cancer', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: 'History of Cancer (without physician clearance)', products: ['lipomino'] },
    { condition: 'MEN 2 (Multiple Endocrine Neoplasia Type 2)', products: ['glp'] },
    { condition: 'Medullary Thyroid Cancer (personal or family history)', products: ['glp'] },
    { condition: 'Any Active Cancer', products: ['glp'] }
  ],
  CARDIAC: [
    { condition: 'Uncontrolled Hypertension (High Blood Pressure) or Heart Disease', products: ['nad'] },
    { condition: 'History of Stroke or Heart Attack', products: ['nad'] },
    { condition: 'History of Thromboembolism (Blood Clots)', products: ['nad'] },
    { condition: 'Symptomatic heart failure (unstable/untreated)', products: ['glp', 'ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Dysrhythmia, tachycardia, or atrial fibrillation (unstable/untreated)', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Symptomatic / Unstable Heart Failure', products: ['glp'] },
    { condition: 'Unstable Arrhythmias (Tachycardia / AFib)', products: ['glp'] }
  ],
  ENDOCRINE: [
    { condition: 'Type 1 Diabetes', products: ['glp'] },
    { condition: 'Hypoglycemia', products: ['glp'] },
    { condition: 'Hypothyroidism (any)', products: ['glp', 'lipomino'] },
    { condition: 'Hyperthyroidism (any)', products: ['glp', 'lipomino'] }
  ],
  GASTROINTESTINAL: [
    { condition: 'Pancreatitis', products: ['glp'] },
    { condition: 'Active Gallbladder Disease', products: ['glp'] },
    { condition: 'Gallstones', products: ['glp'] },
    { condition: 'Gastroparesis', products: ['glp'] },
    { condition: "Barrett's Esophagus", products: ['glp'] }
  ],
  METABOLIC: [
    { condition: 'Seizure Disorders', products: ['nad'] },
    { condition: 'Seizure disorder', products: ['lipomino'] },
    { condition: 'Parkinsons disease', products: ['lipomino'] },
    { condition: 'Lebers Hereditary Optic Neuropathy LHON', products: ['lipomino'] },
    { condition: 'CurrentHistory of Metabolic Acidosis', products: ['lipomino'] },
    { condition: 'Trimethylaminuria', products: ['lipomino'] },
    { condition: 'Homocystinuria', products: ['lipomino'] }
  ],
  LIVER: [
    { condition: 'Cirrhosis (Liver scarring)', products: ['nad'] },
    { condition: 'Severe Kidney or Liver Disease', products: ['nad'] },
    { condition: 'Liver cirrhosis or end-stage liver disease', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Liver Disease or Kidney Disease', products: ['lipomino'] },
    { condition: 'Cirrhosis', products: ['glp'] }
  ],
  KIDNEY: [
    { condition: 'Chronic kidney disease stage 3 or greater', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: 'Kidney Stones', products: ['glp'] },
    { condition: 'Severe Kidney or Liver Disease', products: ['nad'] },
    { condition: 'Liver Disease or Kidney Disease', products: ['lipomino'] },
    { condition: 'Chronic Kidney Disease (Stage 3+)', products: ['glp'] }
  ],
  BLOOD: [
    { condition: 'Blood clotting disorder', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: 'History of Thromboembolism (Blood Clots)', products: ['nad'] },
    { condition: 'Diagnosed blood clotting or coagulation disorders', products: ['sermorelin'] }
  ],
  SURGICAL: [
    { condition: 'Gastric Bypass / Sleeve Surgery (within 12 months)', products: ['glp'] },
    { condition: 'Organ Transplant (on anti-rejection meds)', products: ['glp'] }
  ],
  PSYCHIATRIC: [
    { condition: 'History of Eating Disorders (Anorexia / Bulimia)', products: ['glp'] },
    { condition: 'History of Suicide / Homicide Attempts or Active Ideation', products: ['glp'] }
  ],
  RECOVERY: [
    { condition: 'Recent surgery or hospitalization', products: ['glp', 'nad', 'lipomino', 'ghk', 'sermorelin', 'glutathione'] }
  ],
  OTHER: [
    { condition: 'Behçet Syndrome (unless cleared by a rheumatologist)', products: ['nad'] },
    { condition: "Known allergy to Sermorelin or its components", products: ['sermorelin'] },
    { condition: 'Allergy to Methionine, Inositol, Choline, B Vitamins, or L-Carnitine', products: ['lipomino'] },
    { condition: 'Schizophrenia or Bipolar Disorder', products: ['lipomino'] }
  ]
};

export const UNIFIED_MEDICATIONS = {
  GLP_MEDICATIONS: [
    { condition: 'Insulin', products: ['glp'] },
    { condition: 'Sulfonylureas (e.g., Glyburide, Glipizide)', products: ['glp'] },
    { condition: 'Meglitinides', products: ['glp'] }
  ],
  LIPO_MEDICATIONS: [
    { condition: "Levodopa (Parkinson's)", products: ['lipomino'] },
    { condition: 'MAO Inhibitors (e.g., phenelzine, tranylcypromine)', products: ['lipomino'] },
    { condition: 'Mood Stabilizers (e.g., Lithium)', products: ['lipomino'] },
    { condition: 'Thyroid Medication (e.g., Levothyroxine)', products: ['lipomino'] },
    { condition: 'Anticholinergics (e.g., benztropine)', products: ['lipomino'] },
    { condition: 'Nitroprusside', products: ['lipomino'] },
    { condition: 'Anticoagulants (e.g., Warfarin)', products: ['lipomino'] }
  ],
  SHARED_MEDICATIONS: [
    { condition: 'Blood thinners (Warfarin, Coumadin, etc.)', products: ['ghk', 'sermorelin', 'glutathione'] },
    { condition: "St. John's Wort", products: ['glp'] }
  ]
};

export const PRODUCTS = [
  // ============================================================
  // SEMAGLUTIDE (GLP-1, state + BMI restricted)
  // ============================================================
  { id: 'sema_micro_2mo', type: 'glp', group: 'Semaglutide', category: 'medicine', name: 'Microdose Semaglutide - 2 Months', price: 298.00, usage: 'Up Front', allowedStates: SEMAGLUTIDE_STATES, requirement: 'MICRODOSE' },
  { id: 'sema_starter_3mo', type: 'glp', group: 'Semaglutide', category: 'medicine', name: 'Starter Package: Semaglutide 3 Months', price: 597.00, usage: 'Up Front', allowedStates: SEMAGLUTIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'sema_starter_6mo', type: 'glp', group: 'Semaglutide', category: 'medicine', name: 'Starter Package: Semaglutide 6 Months', price: 1014.00, usage: 'Up Front', allowedStates: SEMAGLUTIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'sema_starter_12mo', type: 'glp', group: 'Semaglutide', category: 'medicine', name: 'Starter Package: Semaglutide 12 Months', price: 1788.00, usage: 'Up Front', allowedStates: SEMAGLUTIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'sema10_1mo', type: 'glp', group: 'Semaglutide', category: 'medicine', name: 'Single Purchase: Semaglutide 10mg - 1 Month', price: 399.00, usage: 'Up Front', allowedStates: SEMAGLUTIDE_STATES, requirement: 'BMI25TO29_MED' },

  // ============================================================
  // TIRZEPATIDE (GLP-1, state + BMI restricted)
  // ============================================================
  { id: 'tirz_micro_2mo', type: 'glp', group: 'Tirzepatide', category: 'medicine', name: 'Microdose Tirzepatide - 2 Months', price: 470.00, usage: 'Up Front', allowedStates: TIRZEPATIDE_STATES, requirement: 'MICRODOSE' },
  { id: 'tirz_starter_3mo', type: 'glp', group: 'Tirzepatide', category: 'medicine', name: 'Starter Package: Tirzepatide 3 Months', price: 897.00, usage: 'Up Front', allowedStates: TIRZEPATIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'tirz_starter_6mo', type: 'glp', group: 'Tirzepatide', category: 'medicine', name: 'Starter Package: Tirzepatide 6 Months', price: 1494.00, usage: 'Up Front', allowedStates: TIRZEPATIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'tirz_starter_12mo', type: 'glp', group: 'Tirzepatide', category: 'medicine', name: 'Starter Package: Tirzepatide 12 Months', price: 2820.00, usage: 'Up Front', allowedStates: TIRZEPATIDE_STATES, requirement: 'BMI25TO29_MED' },
  { id: 'tirz60_1mo', type: 'glp', group: 'Tirzepatide', category: 'medicine', name: 'Single Purchase: Tirzepatide 60mg - 1 Month', price: 599.00, usage: 'Up Front', allowedStates: TIRZEPATIDE_STATES, requirement: 'BMI25TO29_MED' },

  // ============================================================
  // STANDALONE MEDICAL / INJECTABLES (state restricted, NO BMI req)
  // ============================================================

  // ============================================================
  // LIPO-MINO (state restricted, NO BMI req)
  // ============================================================
  { id: 'lipo', type: 'lipomino', category: 'medicine', name: 'Lipo-Mino One Month', price: 374.00, allowedStates: GLP1_NO_TIRZ },
  { id: 'lipo_3mo', type: 'lipomino', category: 'medicine', name: 'Lipo-Mino 3 Months', price: 889.00, allowedStates: GLP1_NO_TIRZ },

  // ============================================================
  // NAD+ (state restricted, NO BMI req)
  // ============================================================
  { id: 'nad', type: 'nad', category: 'medicine', name: 'NAD+ One Month', price: 374.00, allowedStates: GLP1_NO_TIRZ },
  { id: 'nad_3mo', type: 'nad', category: 'medicine', name: 'NAD+ 3 Months', price: 889.00, allowedStates: GLP1_NO_TIRZ },

  // --- GHK-Cu ---
  { id: 'ghkcu_3mo', type: 'ghk', category: 'medicine', name: 'GHK-Cu 3 Months', price: 748.00, allowedStates: GLP1_STATES },
  { id: 'ghkcu_1mo', type: 'ghk', category: 'medicine', name: 'GHK-Cu One Month', price: 374.00, allowedStates: GLP1_STATES },

  // --- Sermorelin ---
  { id: 'sermorelin_2mo', type: 'sermorelin', category: 'medicine', name: 'Sermorelin Two Months', price: 599.00, allowedStates: GLP1_STATES },
  { id: 'sermorelin_1mo', type: 'sermorelin', category: 'medicine', name: 'Sermorelin One Month', price: 374.00, allowedStates: GLP1_STATES },

  // --- Glutathione ---
  { id: 'glutathione_4mo', type: 'glutathione', category: 'medicine', name: 'Glutathione Four Months', price: 549.00, allowedStates: GLP1_NO_TIRZ },
  { id: 'glutathione_2mo', type: 'glutathione', category: 'medicine', name: 'Glutathione Two Months', price: 374.00, allowedStates: GLP1_NO_TIRZ },


  // ============================================================
  // NUTRITION CONSULTATIONS (ALL states, no restrictions)
  // ============================================================
  { id: 'nc12', type: 'nutrition', category: 'service', name: 'Nutrition Consultation 12 months', price: 1379.16, allowedStates: 'ALL' },
  { id: 'nc6', type: 'nutrition', category: 'service', name: 'Nutrition Consultation 6 months', price: 799.86, allowedStates: 'ALL' },
  { id: 'nc3', type: 'nutrition', category: 'service', name: 'Nutrition Consultation 3 months', price: 449.01, allowedStates: 'ALL' },
  { id: 'nc_not_client', type: 'nutrition', category: 'service', name: 'Nutrition Consultation 1 month - Non GLP-1 Clients', price: 250.00, allowedStates: 'ALL' },
  { id: 'nc', type: 'nutrition', category: 'service', name: 'Nutrition Consultation 1 month', price: 199.00, allowedStates: 'ALL' },

  // ============================================================
  // SUPPLEMENTS (ALL states, always eligible)
  // ============================================================
  // $24.90
  { id: 'beauty_boost', type: 'supplement', category: 'supplement', name: 'Beauty Boost - Hair, Skin and Nails Essentials', price: 24.90, allowedStates: 'ALL', usage: 'How to use: 3 times a day' },
  { id: 'bloat_away', type: 'supplement', category: 'supplement', name: 'Bloat Away - Probiotic 40 Billion with Prebiotics', price: 24.90, allowedStates: 'ALL' },
  { id: 'bone_heart', type: 'supplement', category: 'supplement', name: 'Bone & Heart Support', price: 24.90, allowedStates: 'ALL' },
  { id: 'brain_focus', type: 'supplement', category: 'supplement', name: 'Brain & Focus Formula', price: 24.90, allowedStates: 'ALL' },
  { id: 'multivitamin', type: 'supplement', category: 'supplement', name: 'Complete Multivitamin', price: 24.90, allowedStates: 'ALL' },
  { id: 'detox_now', type: 'supplement', category: 'supplement', name: 'Detox Now - Refresh, Cleanse & Glow', price: 24.90, allowedStates: 'ALL' },
  { id: 'diet_drops', type: 'supplement', category: 'supplement', name: 'Diet Drops Ultra', price: 24.90, allowedStates: 'ALL' },
  { id: 'gut_boost', type: 'supplement', category: 'supplement', name: 'Gut Boost Pro & Smooth Digestion', price: 24.90, allowedStates: 'ALL' },
  { id: 'maca_plus', type: 'supplement', category: 'supplement', name: 'Love Me Now - Maca Plus', price: 24.90, allowedStates: 'ALL' },
  { id: 'omega3', type: 'supplement', category: 'supplement', name: 'Omega-3 EPA 180mg + DHA 120mg', price: 24.90, allowedStates: 'ALL' },
  { id: 'vitamin_d3', type: 'supplement', category: 'supplement', name: 'Vitamin D3 2,000 IU', price: 24.90, allowedStates: 'ALL' },
  { id: 'magnesium', type: 'supplement', category: 'supplement', name: 'Magnesium Glycinate', price: 24.90, allowedStates: 'ALL' },

  // $29.90
  { id: 'energy_strips', type: 'supplement', category: 'supplement', name: 'Energy Strips', price: 29.90, allowedStates: 'ALL' },
  { id: 'glutamine', type: 'supplement', category: 'supplement', name: 'L-Glutamine Powder', price: 29.90, allowedStates: 'ALL' },
  { id: 'sleep_strips', type: 'supplement', category: 'supplement', name: 'Sleep Strips', price: 29.90, allowedStates: 'ALL' },

  // $34.99
  { id: 'hydraglow_peach_mango', type: 'supplement', category: 'supplement', name: 'Hydraglow Powder (Peach Mango)', price: 34.99, allowedStates: 'ALL' },
  { id: 'hydraglow_lychee', type: 'supplement', category: 'supplement', name: 'Hydraglow Powder (Lychee)', price: 34.99, allowedStates: 'ALL' },
  { id: 'hydraglow_lemonade', type: 'supplement', category: 'supplement', name: 'Hydraglow Powder (Lemonade)', price: 34.99, allowedStates: 'ALL' },
  { id: 'apple_cider_vinegar', type: 'supplement', category: 'supplement', name: 'Apple Cider Vinegar Capsules', price: 39.00, allowedStates: 'ALL' },

  // $45.00-$45.90
  { id: 'berberine', type: 'supplement', category: 'supplement', name: 'Berberine+ & Pierde Peso', price: 45.00, allowedStates: 'ALL', usage: 'How to use: 2 times a day' },
  { id: 'glp1_support', type: 'supplement', category: 'supplement', name: 'GLP-1 Support | Daily Metabolic, Gut & Micronutrient Formula', price: 45.00, allowedStates: 'ALL' },
  { id: 'colon_cleanse', type: 'supplement', category: 'supplement', name: 'Colon Gentle Cleanse', price: 33.90, allowedStates: 'ALL' },
  { id: 'colostrum', type: 'supplement', category: 'supplement', name: 'Colostrum Capsules', price: 33.90, allowedStates: 'ALL' },
  { id: 'creatine', type: 'supplement', category: 'supplement', name: 'Creatine Monohydrate', price: 33.90, allowedStates: 'ALL' },
  { id: 'fat_burner', type: 'supplement', category: 'supplement', name: 'Fat Burner & Appetite Control', price: 33.90, allowedStates: 'ALL' },

  // $39.90
  { id: 'collagen_choc', type: 'supplement', category: 'supplement', name: 'Chocolate - Collagen Peptides Grass-Fed Powder', price: 39.90, allowedStates: 'ALL' },
  { id: 'nad_antiaging', type: 'supplement', category: 'supplement', name: 'NAD+ Cellular Energy & Anti-Aging', price: 39.90, allowedStates: 'ALL' },
  { id: 'collagen_peptides', type: 'supplement', category: 'supplement', name: 'Unflavored - Collagen Peptides Hydrolyzed Grass-Fed', price: 39.90, allowedStates: 'ALL' },
  { id: 'collagen_vanilla', type: 'supplement', category: 'supplement', name: 'Vanilla - Collagen Peptides Creamer Grass-Fed Powder', price: 39.90, allowedStates: 'ALL' },

  // $49.90
  { id: 'whey_choc', type: 'supplement', category: 'supplement', name: 'Chocolate - Whey Protein Isolate Advanced 100%', price: 49.90, allowedStates: 'ALL' },
  { id: 'whey_vanilla', type: 'supplement', category: 'supplement', name: 'Vanilla - Whey Protein Isolate Advanced 100%', price: 49.90, allowedStates: 'ALL' },

  // Shipping
  { id: 'shipping', type: 'supplement', category: 'supplement', name: 'Shipping', price: 5.00, allowedStates: 'ALL' },

  // New Supplements
  { id: 'slimboost', type: 'supplement', category: 'supplement', name: 'SlimBoost', price: 89.00, allowedStates: 'ALL' },
  { id: 'detox_tea', type: 'supplement', category: 'supplement', name: 'Detox Tea', price: 15.99, allowedStates: 'ALL' },
];

export const PRODUCT_EMOJIS = {
  semaglutide: '💉',
  tirzepatide: '💉',
  nad: '🧬',
  lipomino: '🔥',
  glutathione: '✨',
  ghk: '💎',
  sermorelin: '⚡',
  nutrition: '🥗',
  supplement: '💊',
  shipping: '🚚'
};

export const getProductEmoji = (product) => {
  const name = (product.name || '').toLowerCase();
  
  if (name.includes('semaglutide')) return PRODUCT_EMOJIS.semaglutide;
  if (name.includes('tirzepatide')) return PRODUCT_EMOJIS.tirzepatide;
  if (name.includes('nad+')) return PRODUCT_EMOJIS.nad;
  if (name.includes('lipo-mino')) return PRODUCT_EMOJIS.lipomino;
  if (name.includes('glutathione')) return PRODUCT_EMOJIS.glutathione;
  if (name.includes('ghk-cu')) return PRODUCT_EMOJIS.ghk;
  if (name.includes('sermorelin')) return PRODUCT_EMOJIS.sermorelin;
  if (name.includes('nutrition')) return PRODUCT_EMOJIS.nutrition;
  if (product.type === 'supplement') return PRODUCT_EMOJIS.supplement;
  if (name.includes('shipping')) return PRODUCT_EMOJIS.shipping;
  
  return '💊';
};

export const calculateBMI = (weight, wUnit, height, hUnit, ft, inch) => {
  let wKg = parseFloat(weight);
  if (wUnit === 'lbs') wKg = wKg * 0.453592;

  let hM;
  if (hUnit === 'cm') {
    hM = parseFloat(height) / 100;
  } else {
    const totalInches = (parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0);
    hM = totalInches * 0.0254;
  }

  if (!wKg || !hM) return '0.0';
  return (wKg / (hM * hM)).toFixed(1);
};

export const getIdealMetrics = (height, hUnit, ft, inch) => {
  let hM;
  if (hUnit === 'cm') {
    hM = parseFloat(height) / 100;
  } else {
    const totalInches = (parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0);
    hM = totalInches * 0.0254;
  }

  if (!hM) return null;

  const getWeights = (bmi) => {
    const kg = (bmi * hM * hM).toFixed(1);
    const lbs = (kg * 2.20462).toFixed(1);
    return { kg, lbs };
  };

  return {
    min: getWeights(18.5),
    ideal: getWeights(21.7),
    max: getWeights(24.9)
  };
};

export const getPaymentPlan = (products) => {
  if (!products || !Array.isArray(products) || products.length === 0) return null;
  const paymentPlanTotal = products
    .filter(p => p.type === 'nutrition_withplan')
    .reduce((sum, p) => sum + p.price, 0);
    
  if (paymentPlanTotal === 0) return null;
  
  return {
    biweekly: (paymentPlanTotal / 4).toFixed(2),
    sixMonth: (paymentPlanTotal / 6).toFixed(2)
  };
};
