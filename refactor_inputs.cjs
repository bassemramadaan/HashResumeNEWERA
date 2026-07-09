const fs = require('fs');
const file = 'src/components/editor/PersonalInfoForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement caused //>. Let's replace //> with />
content = content.replace(/\/\/>/g, '/>');

fs.writeFileSync(file, content);
