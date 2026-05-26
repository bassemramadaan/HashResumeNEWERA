const fs = require('fs');
const codeBlocks = [
  { name: 'Medical', expRange: [1670, 1696], eduRange: [1698, 1717] },
  { name: 'Legal', expRange: [1762, 1790], eduRange: [1792, 1812] },
  { name: 'Elegant', expRange: [2155, 2187], eduRange: [2189, 2212] },
  { name: 'Engineering', expRange: [2498, 2530], eduRange: [2532, 2555] },
  { name: 'Finance', expRange: [2685, 2715], eduRange: [2717, 2740] }
];

// Read lines
const lines = fs.readFileSync('src/components/preview/ResumePreview.tsx', 'utf8').split('\n');

for (const block of codeBlocks.reverse()) {
   // check if ranges are roughly correct by checking for "experience.length" and "education.length"
   const expLineStr = lines[block.expRange[0] - 1] || "";
   const eduLineStr = lines[block.eduRange[0] - 1] || "";
   
   console.log(`Checking ${block.name}: Exp -> ${expLineStr}, Edu -> ${eduLineStr}`);
}
