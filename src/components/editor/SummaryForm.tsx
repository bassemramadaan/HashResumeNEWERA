import React, { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Sparkles, FileText } from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import AISuggestion from "./AISuggestion";
import InlineGhostSuggest from "./InlineGhostSuggest";

export default function SummaryForm() {
  const { language } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).editor;
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);

  const [summaryState, setSummaryState] = useState(personalInfo.summary || "");

  useEffect(() => {
    const activeId = document.activeElement?.id;
    if (activeId !== "summary-input") {
      setSummaryState(personalInfo.summary || "");
    }
  }, [personalInfo.summary]);

  const debouncedUpdateRef = useRef<any>(null);
  useEffect(() => {
    debouncedUpdateRef.current = debounce((val: string) => {
      updatePersonalInfo({ summary: val });
    }, 150);
    return () => {
      debouncedUpdateRef.current?.cancel();
    };
  }, [updatePersonalInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSummaryState(val);
    debouncedUpdateRef.current?.(val);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2.5xl p-5 shadow-3xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">
                {language === "ar" ? "الملخص المهني" : "Professional Summary"}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {language === "ar"
                  ? "اكتب نبذة موجزة (3-5 أسطر) تبرز خبراتك، مهاراتك الأساسية وإنجازاتك"
                  : "Write a brief 3-5 sentence bio highlighting skills and achievements"}
              </p>
            </div>
          </div>
          <SectionTooltip
            title={t.summaryTips}
            content={t.summaryDesc}
            example={t.summaryExample}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="text-xs font-bold text-brand-600 flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100/70 border border-brand-200/60 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-3xs"
            title={language === "ar" ? "صياغة واقتراح ملخص ذكي" : "AI Smart Rewrite"}
          >
            <Sparkles size={14} className="text-brand-600 animate-pulse" />
            <span>{language === "ar" ? "المحرر الذكي 🪄" : "Smart Rewrite 🪄"}</span>
          </button>
        </div>

        {showAISuggestions && (
          <div className="mb-2">
            <AISuggestion
              currentValue={personalInfo.summary}
              onApply={(newText) => {
                setSummaryState(newText);
                updatePersonalInfo({ summary: newText });
                setShowAISuggestions(false);
              }}
              context={`Job Title: ${personalInfo.jobTitle}`}
            />
          </div>
        )}

        <div className="relative">
          <textarea
            dir="auto"
            ref={summaryRef}
            id="summary-input"
            name="summary"
            rows={6}
            value={summaryState}
            onChange={handleChange}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            data-gramm="false"
            className="block w-full p-4 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all resize-y bg-white text-slate-900 placeholder-slate-400 font-medium leading-relaxed"
            placeholder={t.summaryPlaceholder}
          />
          <InlineGhostSuggest
            value={summaryState}
            onChange={(val) => {
              setSummaryState(val);
              updatePersonalInfo({ summary: val });
            }}
            isAr={language === "ar"}
            textareaRef={summaryRef}
            context={`Job Title: ${personalInfo.jobTitle}`}
          />
          <div className="mt-2.5 text-[10px] text-slate-400 flex items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-1 opacity-80">
              <Sparkles size={11} className="text-brand-500 shrink-0" />
              <span>
                {language === "ar"
                  ? "يساعدك المحرر على تجاوز فحص أنظمة الـ ATS بسهولة"
                  : "Helps your resume effortlessly pass ATS parsing engines"}
              </span>
            </div>
            <div className={`font-mono font-bold ${(summaryState?.length || 0) > 500 ? "text-amber-500" : "text-slate-400"}`}>
              {summaryState?.length || 0} / 500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
