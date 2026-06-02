import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy, BookOpen } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "motion/react";

export const CustomSectionsForm: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateCustomSection, addCustomSection, removeCustomSection, reorderCustomSections, duplicateCustomSection } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(data.customSections[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-none">
            {String(t.custom?.title || "")}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {String(t.custom?.placeholderContent || "")}
          </p>
        </div>
        <button
          onClick={() => addCustomSection({ title: "", content: "" })}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          {String(t.custom?.add || "")}
        </button>
      </div>

      {data.customSections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            {String(t.custom?.noSections || "")}
          </h3>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={data.customSections}
          onReorder={reorderCustomSections}
          className="space-y-4"
        >
          {data.customSections.map((section) => (
            <Reorder.Item
              key={section.id}
              value={section}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-slate-50 hover:bg-[#FF4D2D]/10 text-slate-500 hover:text-[#FF4D2D] hover:scale-105 active:scale-95 border border-slate-200/60 hover:border-[#FF4D2D]/15 transition-all shadow-3xs flex items-center justify-center shrink-0 mr-3 ml-3" title="Drag to reorder">
                  <GripVertical size={16} style={{ strokeWidth: 2.2 }} />
                </div>
                <button
                  onClick={() => toggleExpand(section.id)}
                  className="flex-1 text-left font-medium text-gray-900 truncate"
                >
                  {section.title || String(t.custom?.placeholderTitle || "")}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateCustomSection(section.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title={String(t.experience?.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => removeCustomSection(section.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={String(t.experience?.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(section.id)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {String(t.custom?.name || "")}
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                          placeholder={String(t.custom?.placeholderTitle || "")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {String(t.custom?.content || "")}
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                          placeholder={String(t.custom?.placeholderContent || "")}
                          rows={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-mono text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default CustomSectionsForm;
