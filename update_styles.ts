import fs from 'fs';

let content = fs.readFileSync('/src/components/editor/PersonalInfoForm.tsx', 'utf-8');

// Replace labels
content = content.replace(/text-xs font-semibold text-slate-700 uppercase tracking-wider block/g, 'text-[11px] font-semibold text-slate-500 block mb-1');

// Replace inputs 
content = content.replace(/block w-full ps-10 pe-4 py-3/g, 'block w-full ps-9 pe-3 py-2.5');
content = content.replace(/rounded-xl/g, 'rounded-lg');
content = content.replace(/focus:ring-4 focus:ring-brand-500\/10/g, 'focus:ring-2 focus:ring-brand-500/20');
content = content.replace(/text-xs sm:text-sm/g, 'text-xs');
content = content.replace(/bg-white text-slate-900 placeholder-slate-450/g, 'bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400');
content = content.replace(/border-slate-200 hover:border-slate-300/"/g, 'border-slate-200/80 hover:border-slate-300 bg-slate-50 border-slate-200/80 hover:bg-slate-50 focus:bg-white"');

// Wait let's just do a simpler replace for the classname of inputs
content = content.replace(/className={`block w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500\/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium \${[^\}]+\}`}/g, 
function(match) {
  return match
    .replace('ps-10 pe-4 py-3', 'ps-9 pe-3 py-2')
    .replace('rounded-xl', 'rounded-lg')
    .replace('focus:ring-4 focus:ring-brand-500/10', 'focus:ring-2 focus:ring-brand-500/20')
    .replace('text-xs sm:text-sm', 'text-xs')
    .replace('bg-white text-slate-900 placeholder-slate-450', 'bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400')
    .replace('border-slate-200 hover:border-slate-300', 'border-slate-200/80 hover:border-slate-300');
});

// For textareas block w-full p-5 md:p-6 -> p-3 md:p-4
content = content.replace(/block w-full p-5 md:p-6 border rounded-xl focus:ring-4 focus:ring-brand-500\/10/g, 'block w-full p-3 md:p-4 border rounded-lg focus:ring-2 focus:ring-brand-500/20');

// Fix summary container logic if any

fs.writeFileSync('/src/components/editor/PersonalInfoForm.tsx', content);

// Also skills form
let skillsContent = fs.readFileSync('/src/components/editor/SkillsForm.tsx', 'utf-8');
skillsContent = skillsContent.replace(/text-xs font-semibold text-slate-700 uppercase tracking-wider block/g, 'text-[11px] font-semibold text-slate-500 block mb-1');
skillsContent = skillsContent.replace(/block w-full pe-4 ps-11 py-3\.5/g, 'block w-full pe-3 ps-9 py-2');
skillsContent = skillsContent.replace(/rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500\/15 transition-all text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-400 shadow-sm outline-none/g, 
  'rounded-lg border border-slate-200/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 outline-none');

fs.writeFileSync('/src/components/editor/SkillsForm.tsx', skillsContent);

console.log("Done modifying forms");
