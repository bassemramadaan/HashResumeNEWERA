const fs = require('fs');

let indexCss = fs.readFileSync('src/index.css', 'utf8');

// Replace the DESIGN TOKENS block
const tokensStart = indexCss.indexOf('/* ============================================================');
const themeStart = indexCss.indexOf('@theme {');
const themeEnd = indexCss.indexOf('}', themeStart);

// We'll replace everything from tokensStart to the end of @theme block.
// Wait, there might be other things in @theme. Let's just do a regex replace for the colors.
// I will just redefine the tokens in a new file or rewrite them.

const newTokens = `/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --brand-50:  #EFF6FF;
  --brand-100: #DBEAFE;
  --brand-200: #BFDBFE;
  --brand-300: #93C5FD;
  --brand-400: #60A5FA;
  --brand-500: #2563FF;
  --brand-600: #1D4ED8;
  --brand-700: #1E40AF;
  
  --neutral-0:   #FFFFFF;
  --neutral-50:  #FAFAF7;
  --neutral-100: #F3F4F3;
  --neutral-200: #E5E7EB;
  --neutral-300: #D1D5DB;
  --neutral-400: #9CA3AF;
  --neutral-500: #6B7280;
  --neutral-600: #4B5563;
  --neutral-700: #374151;
  --neutral-800: #1F2937;
  --neutral-900: #151515;

  --slate-50:  #FAFAF7;
  --slate-100: #F3F4F3;
  --slate-200: #E5E7EB;
  --slate-300: #D1D5DB;
  --slate-400: #9CA3AF;
  --slate-500: #6B7280;
  --slate-600: #4B5563;
  --slate-700: #374151;
  --slate-800: #1F2937;
  --slate-900: #151515;
  --slate-950: #0F0F0F;

  --gray-50:  #FAFAF7;
  --gray-100: #F3F4F3;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #151515;
}

@theme {
  --color-brand-50:  var(--brand-50);
  --color-brand-100: var(--brand-100);
  --color-brand-200: var(--brand-200);
  --color-brand-300: var(--brand-300);
  --color-brand-400: var(--brand-400);
  --color-brand-500: var(--brand-500);
  --color-brand-600: var(--brand-600);
  --color-brand-700: var(--brand-700);

  --color-neutral-0:   var(--neutral-0);
  --color-neutral-50:  var(--neutral-50);
  --color-neutral-100: var(--neutral-100);
  --color-neutral-200: var(--neutral-200);
  --color-neutral-300: var(--neutral-300);
  --color-neutral-400: var(--neutral-400);
  --color-neutral-500: var(--neutral-500);
  --color-neutral-600: var(--neutral-600);
  --color-neutral-700: var(--neutral-700);
  --color-neutral-800: var(--neutral-800);
  --color-neutral-900: var(--neutral-900);

  --color-slate-50:    var(--slate-50);
  --color-slate-100:   var(--slate-100);
  --color-slate-200:   var(--slate-200);
  --color-slate-300:   var(--slate-300);
  --color-slate-400:   var(--slate-400);
  --color-slate-500:   var(--slate-500);
  --color-slate-600:   var(--slate-600);
  --color-slate-700:   var(--slate-700);
  --color-slate-800:   var(--slate-800);
  --color-slate-900:   var(--slate-900);
  --color-slate-950:   var(--slate-950);

  --color-gray-50:    var(--gray-50);
  --color-gray-100:   var(--gray-100);
  --color-gray-200:   var(--gray-200);
  --color-gray-300:   var(--gray-300);
  --color-gray-400:   var(--gray-400);
  --color-gray-500:   var(--gray-500);
  --color-gray-600:   var(--gray-600);
  --color-gray-700:   var(--gray-700);
  --color-gray-800:   var(--gray-800);
  --color-gray-900:   var(--gray-900);
}
`;

// Replace the root and theme blocks
const rootStart = indexCss.indexOf(':root {');
const rootEnd = indexCss.indexOf('}', rootStart) + 1;
const themeBlockStart = indexCss.indexOf('@theme {');
const themeBlockEnd = indexCss.indexOf('}', themeBlockStart) + 1;

let newCss = indexCss;
if (rootStart !== -1 && themeBlockEnd !== -1) {
  // Wait, there might be other things inside @theme like fonts.
  // Let's just use string replace for the whole section up to the end of @theme, 
  // but first let's see what's in @theme.
}
