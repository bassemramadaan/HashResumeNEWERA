import * as fs from "fs";

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Progress bar background
  content = content.replace(/bg-brand-100 h-1\.5 sm:h-2/g, "bg-slate-200 h-1.5 sm:h-2");
  content = content.replace(/className="h-full bg-brand-500 rounded-full transition-all duration-500"/g, "className=\"h-full bg-slate-800 rounded-full transition-all duration-500\"");
  content = content.replace(/text-brand-600 uppercase tracking-wider/g, "text-slate-800 uppercase tracking-wider");

  // Icon container for progress
  content = content.replace(/bg-brand-500 flex items-center justify-center shrink-0 shadow-brand-500\/25 relative z-10 ring-4 ring-brand-50/g, "bg-slate-900 flex items-center justify-center shrink-0 shadow-slate-900/10 relative z-10 ring-4 ring-slate-50");

  // Pulse in steps map
  content = content.replace(/bg-brand-500 animate-pulse/g, "bg-brand-500 animate-pulse"); // keep

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

replaceInFile("src/pages/EditorPage.tsx");
