import * as fs from "fs";

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Replace the Add buttons which were previously text-indigo-600 bg-indigo-50 or bg-indigo-600
  // e.g. "bg-brand-50 text-brand-600 hover:bg-brand-100" -> "bg-slate-900 text-white border-slate-900 border hover:bg-slate-950"
  content = content.replace(/bg-brand-50 text-brand-600 hover:bg-slate-100/g, "bg-slate-900 border-slate-900 border text-white hover:bg-slate-950");
  content = content.replace(/bg-brand-50 text-brand-600 hover:bg-brand-100/g, "bg-slate-900 border-slate-900 border text-white hover:bg-slate-950");
  content = content.replace(/bg-brand-55 text-brand-605/g, "bg-slate-900 text-white");
  content = content.replace(/bg-brand-55 text-brand-650 hover:bg-brand-50 hover:text-brand-650/g, "bg-slate-900 text-white hover:bg-slate-950 hover:text-white");
  content = content.replace(/bg-brand-600 hover:bg-brand-700/g, "bg-slate-900 hover:bg-slate-950");

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const files = [
  "src/components/editor/CertificationsForm.tsx",
  "src/components/editor/ExperienceForm.tsx",
  "src/components/editor/EducationForm.tsx",
  "src/components/editor/SectionTooltip.tsx",
  "src/components/editor/CustomSectionsForm.tsx",
  "src/pages/EditorPage.tsx"
];

for(const file of files) {
    if (fs.existsSync(file)) {
        replaceInFile(file);
    }
}
