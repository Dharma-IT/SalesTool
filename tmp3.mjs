import { readFileSync, writeFileSync } from 'fs';

try {
  const dataFile = 'src/utils/data.js';
  let content = readFileSync(dataFile, 'utf8');

  // Fix string literals inside data.js that got mangled by the previous replace_file_content step
  content = content.replace(/'St\. John\\\\'s Wort/g, '"St. John\\'s Wort');
  content = content.replace(/'Levodopa \\(Parkinson\\\\'s\\)'/g, '"Levodopa (Parkinson\\'s)"');
  // Just blanket replace St. John's Wort
  content = content.replace(/'St. John\\\\'s Wort, Grapefruit Seed Extract, Quercetin, or Ginseng'/g, '"St. John\\'s Wort, Grapefruit Seed Extract, Quercetin, or Ginseng"');
  
  // Actually simplest is just to replace any remaining poorly escaped strings manually
  content = content.replace(/St\. John\\\\'s/g, "St. John's");
  content = content.replace(/'St\. John's Wort/g, '"St. John\\'s Wort');

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
      // Fix string termination immediately
      let fixedLine = line;
      if (fixedLine.includes("St. John\\\\'s")) fixedLine = fixedLine.replace("St. John\\\\'s", "St. John's");
      if (fixedLine.includes("'St. John's")) fixedLine = fixedLine.replace("'St. John's", "\\"St. John's");
      if (fixedLine.endsWith("Ginseng'")) fixedLine = fixedLine.replace("Ginseng'", "Ginseng\\"");
      
      if (fixedLine.includes("id: '") && fixedLine.includes("type: '")) {
        const match = fixedLine.match(/name: \\'([^\\']+)\\'/);
        const dblMatch = fixedLine.match(/name: "([^"]+)"/);
        const name = match ? match[1] : (dblMatch ? dblMatch[1] : null);
        
        if (name) {
          let newType = 'supplement';
          for (const mapping of categoryMappings) {
            if (mapping.test(name)) {
              newType = mapping.type;
              break;
            }
          }
          return fixedLine.replace(/type: \\'[a-zA-Z0-9_]+\\'/, "type: '" + newType + "'");
        }
      }
      return fixedLine;
    } catch(e) {
      console.log('Error at line ' + i, e);
      return line;
    }
  });

  writeFileSync(dataFile, newLines.join('\\n'), 'utf8');
  console.log('REFACTORED SUCCESSFULLY');
} catch (e) {
  console.error(e);
}
