const fs = require('fs');

try {
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
    content = content.replace('export const PRODUCTS = [', additionalConstants + '\\nexport const PRODUCTS = [');
  }

  const categoryMappings = [
    { test: (n) => n.includes('Nutrition Consultation'), type: 'nutrition' },
    { test: (n) => n.includes('Tirzepatide') || n.includes('Semaglutide') || n.includes('Zepbound'), type: 'glp' },
    { test: (n) => n.includes('NAD'), type: 'nad' },
    { test: (n) => n.includes('GHK'), type: 'ghk' },
    { test: (n) => n.includes('Lipo-Mino') || n.includes('Combo Lipo'), type: 'lipomino' },
    { test: (n) => n.includes('Glutathione'), type: 'glutathione' },
    { test: (n) => n.includes('Sermorelin'), type: 'sermorelin' }
  ];

  const lines = content.split('\\n');
  const newLines = lines.map((line, i) => {
    try {
      if (line.includes("id: '") && line.includes("type: '")) {
        const match = line.match(/name: \\'([^\\']+)\\'/);
        const dblMatch = line.match(/name: "([^"]+)"/);
        const name = match ? match[1] : (dblMatch ? dblMatch[1] : null);
        
        if (name) {
          let newType = 'supplement';
          for (const mapping of categoryMappings) {
            if (mapping.test(name)) {
              newType = mapping.type;
              break;
            }
          }
          return line.replace(/type: \\'[a-zA-Z0-9_]+\\'/, "type: '" + newType + "'");
        }
      }
      return line;
    } catch(e) {
      console.log('Error at line ' + i, e);
      return line;
    }
  });

  fs.writeFileSync(dataFile, newLines.join('\\n'), 'utf8');
  console.log('REFACTORED SUCCESSFULLY');
} catch (e) {
  console.error(e);
}
