import * as fs from "fs";

function patch() {
  const file = "src/components/editor/CustomSectionsForm.tsx";
  let content = fs.readFileSync(file, "utf8");

  // Fix Tailwind colors
  content = content.replace(/blue-/g, "brand-");
  content = content.replace(/gray-/g, "slate-");
  
  const componentStr = `import { useDragControls as useFramerDragControls } from "motion/react";

const CustomSectionItem = ({ section, expandedId, toggleExpand, updateCustomSection, duplicateCustomSection, removeCustomSection, t }: any) => {
  const controls = useFramerDragControls();
  
  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center px-4 py-3 bg-slate-50/50 border-b border-slate-100">
        <div 
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-slate-50 hover:bg-slate-900/10 text-slate-500 hover:text-slate-900 hover:scale-105 active:scale-95 border border-slate-200/60 hover:border-slate-900/15 transition-all shadow-3xs flex items-center justify-center shrink-0 mr-3 ml-3" title="Drag to reorder">
          <GripVertical size={16} style={{ strokeWidth: 2.2 }} />
        </div>
        <button
          onClick={() => toggleExpand(section.id)}
          className="flex-1 text-left rtl:text-right font-medium text-slate-900 truncate"
        >
          {section.title || String(t.custom?.placeholderTitle || "")}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateCustomSection(section.id)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
            title={String(t.experience?.duplicate || "")}
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => removeCustomSection(section.id)}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title={String(t.experience?.remove || "")}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => toggleExpand(section.id)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
          >
            {expandedId === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === section.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 rtl:text-right">
                  {String(t.custom?.name || "")}
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                  placeholder={String(t.custom?.placeholderTitle || "")}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 rtl:text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 rtl:text-right">
                  {String(t.custom?.content || "")}
                </label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                  placeholder={String(t.custom?.placeholderContent || "")}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-mono text-sm leading-relaxed rtl:text-right"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

export const CustomSectionsForm: React.FC = () => {`;

  content = content.replace('export const CustomSectionsForm: React.FC = () => {', componentStr);

  const reorderItemRegex = /<Reorder\.Item[\s\S]*?<\/Reorder\.Item>/;
  content = content.replace(reorderItemRegex, `
            <CustomSectionItem 
              key={section.id}
              section={section}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              updateCustomSection={updateCustomSection}
              duplicateCustomSection={duplicateCustomSection}
              removeCustomSection={removeCustomSection}
              t={t}
            />`);

  fs.writeFileSync(file, content);
}
patch();
