import React, { useState, useMemo } from "react";
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
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Reorder } from "motion/react";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";

import AISuggestion from "./AISuggestion";
import FormSkeleton from "./FormSkeleton";

const ExperienceForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
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
  const [showAISuggestionFor, setShowAISuggestionFor] = useState<string | null>(
    null,
  );
  const [aiSuggestionType, setAiSuggestionType] = useState<"improve" | "verbs">("improve");

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { experience, jobDescription } = data;

  const handleAdd = () => {
    addExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (newOrder: typeof experience) => {
    updateData({ ...data, experience: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={String(t.experience?.title || "")}
            content={String(t.experience?.tooltipDesc || "Add your work experience, starting with the most recent.")}
            example={String(t.experience?.tooltipExample || "e.g., Senior Software Engineer at Google")}
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
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500 shadow-3xs">
          {String(t.experience?.noExperience || "")}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={experience}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {experience.map((exp) => (
            
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
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default ExperienceForm;
