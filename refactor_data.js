const fs = require('fs');

const dataFile = 'src/utils/data.js';
let content = fs.readFileSync(dataFile, 'utf8');

const additionalConstants = `
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
  'Parkinson’s disease',
  'Leber’s Hereditary Optic Neuropathy (LHON)',
  'Current/History of Metabolic Acidosis',
  'Trimethylaminuria',
  'Homocystinuria',
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
  'Levodopa (Parkinson\\'s)',
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
  'St. John\\'s Wort, Grapefruit Seed Extract, Quercetin, or Ginseng'
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
  'St. John\\'s Wort, Grapefruit Seed Extract, Quercetin, or Ginseng'
];
`;

if (!content.includes('NAD_CONTRAINDICATIONS')) {
  // Insert before PRODUCTS export
  content = content.replace('export const PRODUCTS = [', additionalConstants + '\\nexport const PRODUCTS = [');
}

// Map everything to the new 8 categories
const categoryMappings = [
  { test: (n) => n.includes('Nutrition Consultation'), type: 'nutrition' },
  { test: (n) => n.includes('Tirzepatide') || n.includes('Semaglutide') || n.includes('Zepbound'), type: 'glp' },
  { test: (n) => n.includes('NAD'), type: 'nad' },
  { test: (n) => n.includes('GHK'), type: 'ghk' },
  { test: (n) => n.includes('Lipo-Mino'), type: 'lipomino' },
  { test: (n) => n.includes('Glutathione'), type: 'glutathione' },
  { test: (n) => n.includes('Sermorelin'), type: 'sermorelin' }
];

const lines = content.split('\\n');
const newLines = lines.map(line => {
  if (line.includes("id: '") && line.includes("type: '")) {
    // Extract the name to determine type
    const nameMatch = line.match(/name: \\'([^\\']+)\\'/);
    if (!nameMatch) {
       const dblQuoteMatch = line.match(/name: "([^"]+)"/);
       if (!dblQuoteMatch) return line;
    }
    const name = nameMatch ? nameMatch[1] : line.match(/name: "([^"]+)"/)[1];
    
    let newType = 'supplement'; // Default to supplement
    for (const mapping of categoryMappings) {
      if (mapping.test(name)) {
        newType = mapping.type;
        break;
      }
    }
    
    // Some exceptions: Hair Loss, Metformin, Tadalafil -> supplement for now, or maybe generic medical?
    // Let's just put them in supplement per user's earlier OK.

    // Replace type property
    return line.replace(/type: \\'[a-zA-Z0-9_]+\\'/, \`type: '\${newType}'\`);
  }
  return line;
});

content = newLines.join('\\n');

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Successfully refactored data.js!');
