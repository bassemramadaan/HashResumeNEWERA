import * as fs from "fs";

function patch() {
  const file = "src/components/editor/EducationForm.tsx";
  let content = fs.readFileSync(file, "utf8");

  content = content.replace("import { motion, Reorder, AnimatePresence } from \"motion/react\";", "import { motion, Reorder, AnimatePresence, useDragControls } from \"motion/react\";");

  content = content.replace(/bg-\[\#FF4D2D\]\/10/g, "bg-slate-900/10");
  content = content.replace(/text-\[\#FF4D2D\]/g, "text-slate-900");
  content = content.replace(/border-\[\#FF4D2D\]\/15/g, "border-slate-900/15");

  let reorderItemStr = content.match(/<Reorder\.Item[\s\S]*?<\/Reorder\.Item>/)?.[0];
  if (!reorderItemStr) {
    console.log("Could not find Reorder.Item in EducationForm!");
    return;
  }
  
  let replacedItemStr = reorderItemStr.replace(
    /onClick=\{\(e\) => e.stopPropagation\(\)\}/,
    "onPointerDown={(e) => { e.stopPropagation(); controls.start(e); }}"
  );
  
  replacedItemStr = replacedItemStr.replace(/<Reorder\.Item/, `<Reorder.Item dragListener={false} dragControls={controls}`);

  const componentStr = `
const EducationItem = ({ edu, expandedId, setExpandedId, t, addEducation, removeEducation, updateEducation }: any) => {
  const controls = useDragControls();
  return (
    ${replacedItemStr}
  );
};

export const EducationForm: React.FC = () => {`;

  content = content.replace('export const EducationForm: React.FC = () => {', componentStr);

  content = content.replace(reorderItemStr, `
            <EducationItem
              key={edu.id}
              edu={edu}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              t={t}
              addEducation={addEducation}
              removeEducation={removeEducation}
              updateEducation={updateEducation}
            />`);
  
  fs.writeFileSync(file, content);
}
patch();
