import * as fs from "fs";

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Replace generic focus rings
  content = content.replace(/focus:ring-indigo-500\/10 focus:border-indigo-500/g, "focus:ring-brand-500/10 focus:border-brand-500");
  
  // AI Objective Suggestions button
  content = content.replace(/text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100/g, "text-brand-600 flex items-center gap-1 bg-brand-50/50 hover:bg-brand-50 border border-brand-100/30");
  
  // Sparkles
  content = content.replace(/text-indigo-400 shrink-0/g, "text-brand-400 shrink-0");

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

replaceInFile("src/components/editor/PersonalInfoForm.tsx");
replaceInFile("src/components/editor/ExperienceForm.tsx");
replaceInFile("src/components/editor/EducationForm.tsx");
