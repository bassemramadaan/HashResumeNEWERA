import * as fs from "fs";

const file = "src/components/editor/MobileEditorLayout.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/to-\[\#FF4D2D\]\/5 hover:from-rose-500\/15 hover:to-\[\#FF4D2D\]\/10/g, "to-slate-900/5 hover:from-slate-700/15 hover:to-slate-900/10");
content = content.replace("from-rose-500/10", "from-slate-700/10");
fs.writeFileSync(file, content);
console.log("Fixed last bit of orange");
