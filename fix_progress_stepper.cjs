const fs = require('fs');

let code = fs.readFileSync('src/components/editor/ProgressStepper.tsx', 'utf8');
code = code.replace(/size=\{12\}/g, 'size={20}');
code = code.replace(/size=\{13\}/g, 'size={20}');
code = code.replace(/size=\{14\}/g, 'size={20}');
code = code.replace(/size=\{16\}/g, 'size={20}');
fs.writeFileSync('src/components/editor/ProgressStepper.tsx', code, 'utf8');
console.log('done');
