const fs = require('fs');
const file = 'src/components/editor/PersonalInfoForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// The basic pattern to replace is:
// <div className="relative">
//   <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
//     <IconComponent className={`h-4 w-4 ${errors.foo ? "text-rose-450" : "text-slate-400"}`} />
//   </div>
//   <input className="... ps-9 ..." />

// Let's just do a simpler replacement if we can, or just use string replacements.
content = content.replace(/<div className="relative">[\s\S]*?<div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">/g, '<div className="relative input-with-icon">\n            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">');

fs.writeFileSync(file, content);
