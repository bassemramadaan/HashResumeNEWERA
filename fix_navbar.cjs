const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
code = code.replace(/w-4 h-4/g, 'w-[18px] h-[18px]');
code = code.replace(/w-3\.5 h-3\.5/g, 'w-[18px] h-[18px]');
code = code.replace(/h-6 w-6/g, 'w-[18px] h-[18px]');
fs.writeFileSync('src/components/layout/Navbar.tsx', code, 'utf8');
console.log('done');
