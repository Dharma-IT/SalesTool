import fs from 'fs';

const dataFile = 'src/utils/data.js';
let content = fs.readFileSync(dataFile, 'utf8');

const lines = content.split('\\n');
const newLines = lines.map(line => {
  if (line.includes("id: '") && line.includes("type: '")) {
    let name = '';
    const nameMatch1 = line.match(/name: '([^']+)'/);
    if (nameMatch1) name = nameMatch1[1];
    else {
      const nameMatch2 = line.match(/name: "([^"]+)"/);
      if (nameMatch2) name = nameMatch2[1];
    }
    
    if (name) {
      let newType = 'supplement';
      if (name.includes('Nutrition Consultation')) newType = 'nutrition';
      else if (name.includes('Tirzepatide') || name.includes('Semaglutide') || name.includes('Zepbound')) newType = 'glp';
      else if (name.includes('NAD')) newType = 'nad';
      else if (name.includes('GHK')) newType = 'ghk';
      else if (name.includes('Lipo-Mino') || name.includes('Combo Lipo')) newType = 'lipomino';
      else if (name.includes('Glutathione')) newType = 'glutathione';
      else if (name.includes('Sermorelin')) newType = 'sermorelin';

      return line.replace(/type: '[a-zA-Z0-9_]+'/, "type: '" + newType + "'");
    }
  }
  return line;
});

fs.writeFileSync(dataFile, newLines.join('\\n'), 'utf8');
console.log('TYPES UPDATED SUCCESSFULLY');
