import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/components/editor/PersonalInfoForm.tsx', 'utf-8');

// Replace labels
content = content.replace(/text-xs font-semibold text-slate-700 uppercase tracking-wider block/g, 'text-[11px] font-semibold text-slate-500 block mb-1');

// Replace inputs class
content = content.replace(/className=\{`block w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500\/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium \$\{/g, 
  "className={`block w-full ps-9 pe-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 font-medium ${"
);

content = content.replace(/border-slate-200 hover:border-slate-300/g, "border-slate-200/80 hover:border-slate-300");

content = content.replace(/className=\{`block w-full p-5 md:p-6 border rounded-xl focus:ring-4 focus:ring-brand-500\/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium resize-y \$\{/g,
  "className={`block w-full p-3 md:p-4 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 font-medium resize-y ${"
);

fs.writeFileSync('src/components/editor/PersonalInfoForm.tsx', content);

let skills = fs.readFileSync('src/components/editor/SkillsForm.tsx', 'utf-8');
skills = skills.replace(/text-xs font-semibold text-slate-700 uppercase tracking-wider block/g, 'text-[11px] font-semibold text-slate-500 block mb-1');
skills = skills.replace(/block w-full pe-4 ps-11 py-3\.5 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500\/15 transition-all text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-400 shadow-sm outline-none/g, 
  'block w-full pe-3 ps-9 py-2 rounded-lg border border-slate-200/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 outline-none');

skills = skills.replace(/bg-white border text-xs sm:text-sm shadow-xs rounded-xl/g, "bg-white border text-xs rounded-lg");
fs.writeFileSync('src/components/editor/SkillsForm.tsx', skills);

console.log("Done");
