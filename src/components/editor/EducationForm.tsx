import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  GripVertical,
} from "lucide-react";
import { Reorder } from "motion/react";
import FormSkeleton from "./FormSkeleton";
import SectionTooltip from "./SectionTooltip";

import AISuggestion from "./AISuggestion";

const EducationForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const eduSuggestions = t.education.eduSuggestions;
  const universities = t.education.universities;
  const { data, isHydrated, addEducation, updateEducation, removeEducation, updateData } =
    useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.education[0]?.id || null,
  );
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(
    null,
  );

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { education } = data;

  const handleAdd = () => {
    addEducation({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
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
          className="flex items-center gap-2 bg-slate-900 border-slate-900 border text-white hover:bg-slate-950 hover:text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 cursor-pointer hover:shadow-xs active:scale-95"
        >
          <Plus size={16} />
          {String(t.education?.add || "")}
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500 shadow-3xs">
          {String(t.education?.noEducation || "")}
        </div>
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
              addEducation={addEducation}
              removeEducation={removeEducation}
              updateEducation={updateEducation}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default EducationForm;
