import * as fs from "fs";

function patch() {
  const file = "src/components/editor/ExperienceForm.tsx";
  let content = fs.readFileSync(file, "utf8");

  content = content.replace("import { motion, Reorder, AnimatePresence } from \"motion/react\";", "import { motion, Reorder, AnimatePresence, useDragControls } from \"motion/react\";");

  content = content.replace(/bg-\[\#FF4D2D\]\/10/g, "bg-slate-900/10");
  content = content.replace(/text-\[\#FF4D2D\]/g, "text-slate-900");
  content = content.replace(/border-\[\#FF4D2D\]\/15/g, "border-slate-900/15");

  let reorderItemStr = content.match(/<Reorder\.Item[\s\S]*?<\/Reorder\.Item>/)?.[0];
  if (!reorderItemStr) {
    console.log("Could not find Reorder.Item in ExperienceForm!");
    return;
  }
  
  let replacedItemStr = reorderItemStr.replace(
    /onClick=\{\(e\) => e.stopPropagation\(\)\}/,
    "onPointerDown={(e) => { e.stopPropagation(); controls.start(e); }}"
  );
  
  replacedItemStr = replacedItemStr.replace(/<Reorder\.Item/, `<Reorder.Item dragListener={false} dragControls={controls}`);

  const componentStr = `
const ExperienceItem = ({ exp, expandedId, setExpandedId, t, addExperience, removeExperience, updateExperience, generateDescription, isGeneratingMap }: any) => {
  const controls = useDragControls();
  return (
    ${replacedItemStr}
  );
};

export const ExperienceForm: React.FC = () => {`;

  content = content.replace('export const ExperienceForm: React.FC = () => {', componentStr);

  content = content.replace(reorderItemStr, `
            <ExperienceItem
              key={exp.id}
              exp={exp}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              t={t}
              addExperience={addExperience}
              removeExperience={removeExperience}
              updateExperience={updateExperience}
              generateDescription={generateDescription}
              isGeneratingMap={isGeneratingMap}
            />`);
  
  fs.writeFileSync(file, content);
}
patch();
