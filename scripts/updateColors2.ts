import * as fs from "fs";

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  
  content = content.replace(/bg-indigo-600 to-blue-600/g, "bg-brand-600 to-orange-500");
  content = content.replace(/from-indigo-400 to-indigo-600/g, "from-brand-500 to-brand-600");
  
  content = content.replace(/text-indigo/g, "text-brand");
  content = content.replace(/bg-indigo/g, "bg-brand");
  content = content.replace(/border-indigo/g, "border-brand");
  content = content.replace(/ring-indigo/g, "ring-brand");
  content = content.replace(/from-indigo/g, "from-brand");
  content = content.replace(/shadow-indigo/g, "shadow-brand");
  content = content.replace(/to-indigo/g, "to-brand");
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const files = [
  "src/components/editor/WelcomeModal.tsx",
  "src/components/editor/CertificationsForm.tsx",
  "src/components/editor/ATSAudit.tsx",
  "src/components/editor/CoverLetterForm.tsx",
  "src/components/editor/ExperienceForm.tsx",
  "src/components/editor/EducationForm.tsx",
  "src/components/editor/SectionTooltip.tsx",
  "src/components/editor/CustomSectionsForm.tsx"
];

for(const file of files) {
    if (fs.existsSync(file)) {
        replaceInFile(file);
    }
}
