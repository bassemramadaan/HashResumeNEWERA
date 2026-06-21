import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from "lucide-react";
import { motion, Reorder, AnimatePresence, useDragControls } from "motion/react";
import FormSkeleton from "./FormSkeleton";
import SectionTooltip from "./SectionTooltip";
import EmptyState from "./EmptyState";

const EducationItem = ({
  edu,
  expandedId,
  setExpandedId,
  t,
  removeEducation,
  updateEducation,
  eduSuggestions,
  isAr
}: any) => {
  const controls = useDragControls();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Reorder.Item
      value={edu}
      dragListener={false}
      dragControls={controls}
      className="bg-white border border-slate-200/60 rounded-xl overflow-hidden transition-colors"
    >
      <div className="flex items-center px-4 md:px-5 py-3 bg-transparent border-b border-slate-100 justify-between">
        <div className="flex items-center flex-1 min-w-0 mr-3 ml-3">
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              controls.start(e);
            }}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-slate-50 hover:bg-[#FF4D2D]/10 text-slate-500 hover:text-[#FF4D2D] hover:scale-105 active:scale-95 border border-slate-200/60 hover:border-[#FF4D2D]/15 transition-all shadow-3xs flex items-center justify-center shrink-0 mr-2 ml-2"
            title="Drag to reorder"
          >
            <GripVertical size={16} style={{ strokeWidth: 2.2 }} />
          </div>
          <button
            onClick={() => toggleExpand(edu.id)}
            className="flex-1 text-left rtl:text-right font-bold text-slate-900 truncate tracking-tight cursor-pointer hover:text-brand-500 transition-colors block"
          >
            {edu.degree || edu.institution || String(t.education?.notSpecified || "Not specified")}
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => removeEducation(edu.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
            title={String(t.education?.remove || "Remove")}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => toggleExpand(edu.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {expandedId === edu.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === edu.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 md:p-6 space-y-4 text-start" dir={isAr ? "rtl" : "ltr"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.education?.institution || "Institution")}
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="e.g. Cairo University"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.education?.degree || "Degree")}
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.education?.startDate || "Start Date")}
                  </label>
                  <input
                    type="text"
                    value={edu.startDate || ""}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="e.g. 2020"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.education?.endDate || "End Date")}
                  </label>
                  <input
                    type="text"
                    value={edu.endDate || ""}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="e.g. 2024"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {String(t.education?.description || "Description")}
                </label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                  placeholder={String(t.education?.descriptionPlaceholder || "Describe your studies...")}
                  rows={4}
                  className="block w-full p-3 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all resize-y placeholder-slate-400 font-medium outline-none"
                />
              </div>

              {eduSuggestions && eduSuggestions.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {String(t.education?.clickToAppend || "Click a suggestion to append it to your description:")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eduSuggestions.map((suggestion: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const currentDesc = edu.description || "";
                          const separator = currentDesc ? "\n" : "";
                          updateEducation(edu.id, { description: currentDesc + separator + suggestion });
                        }}
                        className="text-start text-xs text-slate-700 bg-slate-50 hover:bg-[#FF4D2D]/10 hover:text-[#FF4D2D] hover:border-[#FF4D2D]/20 px-3 py-1.5 rounded-xl border border-slate-200/60 transition-all font-medium cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

const EducationForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const isAr = language === "ar";
  const eduSuggestions = t.education?.eduSuggestions || [];
  
  const { data, isHydrated, addEducation, updateEducation, removeEducation, updateData } =
    useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.education[0]?.id || null,
  );

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { education } = data;

  const handleAdd = () => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
    addEducation({
      id: newId,
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setExpandedId(newId);
  };

  const handleReorder = (newOrder: typeof education) => {
    updateData({ ...data, education: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={String(t.education?.title || "")}
            content={String(t.education?.tooltipDesc || "Add your educational background, starting with the most recent.")}
            example={String(t.education?.tooltipExample || "e.g., Bachelor of Science in Computer Science, Cairo University")}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-900 border-slate-900 border text-white hover:bg-slate-950 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer hover:shadow-xs active:scale-95"
        >
          <Plus size={16} />
          {String(t.education?.add || "")}
        </button>
      </div>

      {education.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={32} className="stroke-[1.5]" />}
          title={String(t.education?.title || "Education")}
          description={String(t.education?.noEducation || "No education history added yet.")}
          buttonText={String(t.education?.add || "Add Education")}
          onAdd={handleAdd}
        />
      ) : (
        <Reorder.Group
          axis="y"
          values={education}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {education.map((edu) => (
            <EducationItem
              key={edu.id}
              edu={edu}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              t={t}
              removeEducation={removeEducation}
              updateEducation={updateEducation}
              eduSuggestions={eduSuggestions}
              isAr={isAr}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default EducationForm;
