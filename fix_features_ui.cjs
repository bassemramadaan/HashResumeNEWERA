const fs = require('fs');

let code = fs.readFileSync('src/pages/Landing/FeaturesSection.tsx', 'utf8');

// Replace the icon wrapper with just the icon directly
code = code.replace(
  /<div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-brand-50 group-hover:border-brand-100 transition-all duration-500">([\s\S]*?)<\/div>/g,
  '$1'
);

// Optional: remove hover scale if it doesn't make sense without the wrapper, but let's keep it simple.
code = code.replace(
  /className="w-5 h-5 text-slate-700 group-hover:text-brand-500 transition-colors duration-500"/g,
  'className="w-6 h-6 text-slate-900 group-hover:text-brand-500 transition-all duration-300 group-hover:scale-110 shrink-0"'
);

fs.writeFileSync('src/pages/Landing/FeaturesSection.tsx', code, 'utf8');
console.log('done');
