import React, { useState } from "react";
import { useResumeStore, Experience } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SectionTooltip from "./SectionTooltip";
import AISuggestion from "./AISuggestion";
import FormSkeleton from "./FormSkeleton";
import ATSVerbAssistant from "./ATSVerbAssistant";
import QuickAIAssistPill from "./QuickAIAssistPill";
import EmptyState from "./EmptyState";
import { SortableList, DragHandle } from "../ui/SortableList";

import RichTextEditor from "./RichTextEditor";

interface ExperienceItemProps {
  exp: Experience;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  t: Record<string, string>;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, updated: Partial<Experience>) => void;
  isAr: boolean;
}

const ExperienceItem = ({
  exp,
  expandedId,
  setExpandedId,
  t,
  removeExperience,
  updateExperience,
  isAr
}: ExperienceItemProps) => {
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden transition-colors">
      <div className="flex items-center px-4 md:px-5 py-3 bg-transparent border-b border-slate-100 justify-between">
        <div className="flex items-center flex-1 min-w-0 mr-3 ml-3">
          <DragHandle />
          <button
            onClick={() => toggleExpand(exp.id)}
            className="flex-1 text-left rtl:text-right font-bold text-slate-900 truncate tracking-tight cursor-pointer hover:text-brand-500 transition-colors block"
          >
            {exp.position || exp.company || String(t.experience?.notSpecified || "Not specified")}
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => removeExperience(exp.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
            title={String(t.experience?.remove || "Remove")}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => toggleExpand(exp.id)}
            className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {expandedId === exp.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === exp.id && (
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
                    {String(t.experience?.company || "Company")}
                  </label>
                  <input dir="auto"
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="e.g. Google"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.experience?.position || "Position")}
                  </label>
                  <input dir="auto"
                    type="text"
                    value={exp.position || ""}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="e.g. Senior Frontend Developer"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.experience?.startDate || "Start Date")}
                  </label>
                  <input dir="auto"
                    type="text"
                    value={exp.startDate || ""}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="e.g. Oct 2021"
                    className="block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {String(t.experience?.endDate || "End Date")}
                  </label>
                  <input dir="auto"
                    type="text"
                    value={exp.endDate || ""}
                    disabled={exp.currentlyWorking}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    placeholder={exp.currentlyWorking ? String(t.experience?.currentlyWorking || "Present") : "e.g. Present"}
                    className="disabled:opacity-50 block w-full px-3 py-2 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs transition-all font-medium placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 pb-4">
                <input dir="auto"
                  type="checkbox"
                  id={`currentlyWorking-${exp.id}`}
                  checked={exp.currentlyWorking || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    updateExperience(exp.id, {
                      currentlyWorking: isChecked,
                      endDate: isChecked ? "Present" : ""
                    });
                  }}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-400 border-slate-300 cursor-pointer"
                />
                <label htmlFor={`currentlyWorking-${exp.id}`} className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                  {String(t.experience?.currentlyWorking || "I currently work here")}
                </label>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-500 block">
                      {String(t.experience?.description || "Description")}
                    </label>
                    <button
                      onClick={() => {
                        const currentVal = exp.description || "";
                        if (currentVal.length < 10) return alert(isAr ? "اكتب بعض التفاصيل أولاً ليتمكن الذكاء الاصطناعي من صياغتها" : "Write some details first so the AI can enhance it");
                        // Mock AI Enhancement with magical vibe
                        const btn = document.getElementById(`magic-btn-${exp.id}`);
                        if(btn) btn.classList.add("animate-pulse", "text-brand-500");
                        setTimeout(() => {
                           // This is where real API call goes. We'll do a string replacement for now
                           updateExperience(exp.id, { description: currentVal + (isAr ? "\n• تم تحسين وإعادة صياغة النقاط لتعكس الاحترافية واستخدام أفعال مؤثرة." : "\n• Enhanced and rephrased using action verbs for higher impact.") });
                           if(btn) btn.classList.remove("animate-pulse", "text-brand-500");
                        }, 1200);
                      }}
                      id={`magic-btn-${exp.id}`}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors text-[10px] font-bold cursor-pointer border border-brand-200/50"
                      title={isAr ? "إعادة صياغة ذكية بالذكاء الاصطناعي 🪄" : "Smart Rewrite 🪄"}
                    >
                      <Sparkles size={11} />
                      {isAr ? "المحرر الذكي" : "Smart Rewrite"}
                    </button>
                  </div>
                  <ATSVerbAssistant 
                    onSelectWord={(word) => {
                      const currentVal = exp.description || "";
                      const newVal = currentVal ? `${currentVal}\n• ${word} ` : `• ${word} `;
                      updateExperience(exp.id, { description: newVal });
                    }}
                    isAr={isAr}
                  />
                </div>
                <RichTextEditor
                  value={exp.description || ""}
                  onChange={(val) => updateExperience(exp.id, { description: val })}
                  placeholder={String(t.experience?.descriptionPlaceholder || "Describe your responsibilities...")}
                />
              </div>

              <AISuggestion
                currentValue={exp.description || ""}
                onApply={(newValue) => updateExperience(exp.id, { description: newValue })}
                context={`Company: ${exp.company || ""}, Position: ${exp.position || ""}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExperienceForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const isAr = language === "ar";

  const {
    data,
    isHydrated,
    addExperience,
    updateExperience,
    removeExperience,
    updateData,
  } = useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.experience[0]?.id || null,
  );

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { experience } = data;

  const handleAdd = () => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
    addExperience({
      id: newId,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      currentlyWorking: false,
    });
    setExpandedId(newId);
  };

  const handleReorder = (newOrder: typeof experience) => {
    updateData({ ...data, experience: newOrder });
  };

  const handleQuickInject = (text: string) => {
    let activeId = expandedId;
    if (!activeId) {
      if (experience.length === 0) {
        const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
        addExperience({
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: `• ${text}`,
          currentlyWorking: false,
        });
        setExpandedId(newId);
        return;
      } else {
        activeId = experience[0].id;
        setExpandedId(activeId);
      }
    }
    const targetItem = experience.find(x => x.id === activeId);
    if (targetItem) {
      const currentDesc = targetItem.description || "";
      const spacing = currentDesc ? "\n" : "";
      updateExperience(activeId, {
        description: `${currentDesc}${spacing}• ${text}`
      });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <SectionTooltip
            title={String(t.experience?.title || "")}
            content={String(t.experience?.tooltipDesc || "Add your work experience, starting with the most recent.")}
            example={String(t.experience?.tooltipExample || "e.g., Senior Software Engineer at Google")}
          />
          <QuickAIAssistPill
            section="experience"
            onInject={handleQuickInject}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-900 border-slate-900 border text-white hover:bg-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-brand-100 cursor-pointer shadow-3xs active:scale-95"
        >
          <Plus size={16} />
          {String(t.experience?.add || "")}
        </button>
      </div>

      {experience.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={32} className="stroke-[1.5]" />}
          title={String(t.experience?.title || "Work Experience")}
          description={String(t.experience?.noExperience || "You haven't added any experience yet.")}
          buttonText={String(t.experience?.add || "Add Experience")}
          onAdd={handleAdd}
        />
      ) : (
        <SortableList
          items={experience}
          onReorder={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={(exp) => (
            <ExperienceItem
              exp={exp}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              t={t}
              removeExperience={removeExperience}
              updateExperience={updateExperience}
              isAr={isAr}
            />
          )}
        />
      )}
    </div>
  );
};

export default ExperienceForm;
