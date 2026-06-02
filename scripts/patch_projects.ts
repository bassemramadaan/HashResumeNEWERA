import * as fs from "fs";

function patch() {
  const file = "src/components/editor/ProjectsForm.tsx";
  let content = fs.readFileSync(file, "utf8");

  content = content.replace("import { motion, Reorder, AnimatePresence } from \"motion/react\";", "import { motion, Reorder, AnimatePresence, useDragControls } from \"motion/react\";");

  const componentStr = `

const ProjectItem = ({ project, expandedId, toggleExpand, updateProject, duplicateProject, removeProject, t }: any) => {
  const controls = useDragControls();
  
  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm transition-all"
    >
      <div className="flex items-center px-4 md:px-6 py-4 bg-white/50 border-b border-slate-100 justify-between">
        <div className="flex items-center flex-1 min-w-0 mr-3 rtl:ml-3">
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-slate-50 hover:bg-slate-900/10 text-slate-500 hover:text-slate-900 hover:scale-105 active:scale-95 border border-slate-200/60 hover:border-slate-900/15 transition-all shadow-3xs flex items-center justify-center shrink-0 mr-3 ml-3" title="Drag to reorder">
            <GripVertical size={16} style={{ strokeWidth: 2.2 }} />
          </div>
          <button
            onClick={() => toggleExpand(project.id)}
            className="flex-1 text-left rtl:text-right font-bold text-slate-900 truncate tracking-tight cursor-pointer hover:text-brand-500 transition-colors"
          >
            {project.name || String(t.projects?.notSpecified || "")}
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => duplicateProject(project.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-500 hover:text-brand-500 hover:bg-brand-50/50 rounded-lg transition-colors shrink-0 cursor-pointer"
            title={String(t.projects?.duplicate || "")}
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => removeProject(project.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
            title={String(t.projects?.remove || "")}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => toggleExpand(project.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {expandedId === project.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === project.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block rtl:text-right">
                    {String(t.projects?.name || "")}
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="e.g. Personal Portfolio"
                    className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none rtl:text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block rtl:text-right">
                    {String(t.projects?.link || "")}
                  </label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, { link: e.target.value })}
                    placeholder="e.g. project-url.com"
                    className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none rtl:text-right"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block rtl:text-right">
                  {String(t.projects?.description || "")}
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder={String(t.projects?.tipsExample || "")}
                  rows={4}
                  className="block w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all resize-y placeholder-slate-455 font-medium leading-relaxed outline-none rtl:text-right"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

export const ProjectsForm: React.FC = () => {`;

  content = content.replace('export const ProjectsForm: React.FC = () => {', componentStr);

  const reorderItemRegex = /<Reorder\.Item[\s\S]*?<\/Reorder\.Item>/;
  content = content.replace(reorderItemRegex, `
            <ProjectItem 
              key={project.id}
              project={project}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              updateProject={updateProject}
              duplicateProject={duplicateProject}
              removeProject={removeProject}
              t={t}
            />`);

  fs.writeFileSync(file, content);
}
patch();
