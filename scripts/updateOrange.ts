import * as fs from "fs";

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  
  content = content.replace(/border border-\[\#FF4D2D\]/g, "border border-slate-700");
  content = content.replace(/bg-gradient-to-r from-rose-600 to-\[\#FF4D2D\]/g, "bg-slate-900");
  content = content.replace(/hover:to-\[\#E64528\]/g, "hover:bg-slate-950");
  content = content.replace(/bg-\[\#FF4D2D\]/g, "bg-slate-900");
  content = content.replace(/text-\[\#FF4D2D\]/g, "text-slate-900");
  content = content.replace(/border-\[\#FF4D2D\]/g, "border-slate-300");
  content = content.replace(/from-rose-500 to-\[\#FF4D2D\]/g, "from-slate-700 to-slate-900");
  content = content.replace(/\]\} \/\>\} style=\{\{ backgroundColor: '\#FF4D2D'/g, "']} />} style={{ backgroundColor: '#0f172a'");
  content = content.replace(/rgba\(255, 77, 45/g, "rgba(15, 23, 42");

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

replaceInFile("src/pages/EditorPage.tsx");
replaceInFile("src/components/editor/MobileEditorLayout.tsx");
