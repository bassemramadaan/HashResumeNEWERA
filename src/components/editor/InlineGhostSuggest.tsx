import React, { useState, useEffect } from "react";
import { Sparkles, CornerDownLeft } from "lucide-react";

interface InlineGhostSuggestProps {
  value: string;
  onChange: (val: string) => void;
  isAr: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  context?: string;
}

const ENGLISH_COMPLETIONS = [
  { trigger: "react", text: " and TypeScript to build modular and performant web applications with responsive layouts" },
  { trigger: "typescript", text: " and modern React hooks to ensure scale, type safety, and clean code codebase standards" },
  { trigger: "developer", text: " specializing in frontend technologies, UX optimization, and building accessible UI features" },
  { trigger: "engineered", text: " a scalable architecture that optimized asset bundles, boosting loading times by 35%" },
  { trigger: "collaborated", text: " with cross-functional design, product, and QA teams to consistently meet sprint deadlines" },
  { trigger: "spearheaded", text: " the development of several customer-facing dashboards, expanding overall user engagement" },
  { trigger: "optimized", text: " slow database queries and search index queries to reduce average server latency" },
  { trigger: "designed", text: " interactive dashboards and responsive elements conforming to strict pixel-perfect Figma prototypes" },
  { trigger: "led", text: " a skilled agile delivery squad in designing, building, and deploying secure cloud services" },
  { trigger: "responsible for", text: " developing critical customer portals, keeping application uptime close to 99.9%" },
  { trigger: "implemented", text: " automated CI/CD deployments and comprehensive unit tests to achieve high-quality stable builds" },
  { trigger: "summary", text: " with extensive experience in architecting single-page applications and responsive websites" }
];

const ARABIC_COMPLETIONS = [
  { trigger: "تطوير", text: " وبرمجة واجهات الويب التفاعلية لضمان أداء فائق وتجربة مستخدم متكاملة وسلسة" },
  { trigger: "مسؤول", text: " عن تصميم وتنفيذ الأنظمة البرمجية وتسليم الميزات المطلوبة في المواعيد المحددة بكفاءة" },
  { trigger: "تصميم", text: " واجهات وتطبيقات تفصيلية متجاوبة وثابتة لجميع مقاسات الهواتف والأجهزة اللوحية" },
  { trigger: "قيادة", text: " وتوجيه فرق عمل برمجية لتخطيط وتصميم بنية تحتية مستقرة للبرمجيات السحابية" },
  { trigger: "تحسين", text: " زمن استجابة الموقع وسرعة قواعد البيانات بنسبة 40% لتوفير تجربة خالية من التباطؤ" },
  { trigger: "تنسيق", text: " العمل مع مصممي واجهات وتجربة المستخدم لتطبيق الهويات البصرية والـ Design Systems" },
  { trigger: "بناء", text: " مكونات واجهات مستخدم مخصصة مسبقة الصنع لتقليل وقت كتابة الأكواد في المستقبل" },
];

export default function InlineGhostSuggest({
  value = "",
  onChange,
  isAr,
  textareaRef,
}: InlineGhostSuggestProps) {
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestion("");
      return;
    }

    const cleanText = value.toLowerCase().trim();
    const completions = isAr ? ARABIC_COMPLETIONS : ENGLISH_COMPLETIONS;
    
    // Find matching word
    const matched = completions.find(item => {
      // check if text ends with or contains the word
      const triggerWord = item.trigger.toLowerCase();
      // Match trigger word at the end of text or close to it
      return cleanText.endsWith(triggerWord) || cleanText.split(/\s+/).pop() === triggerWord;
    });

    if (matched) {
      setSuggestion(matched.text);
    } else {
      // If we have some content typed, provide a smart adaptive finishing phrase on pause
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length >= 6 && words.length % 5 === 0) {
        // Offer standard continuation phrases
        if (isAr) {
          const generalAr = " وتحقيق أهداف المنشأة من خلال تبني أفضل الحلول الهندسية المتطورة.";
          if (!value.endsWith(generalAr.trim())) {
            setSuggestion(generalAr);
          }
        } else {
          const generalEn = " to deliver high-quality code and support product scaling initiatives.";
          if (!value.endsWith(generalEn.trim())) {
            setSuggestion(generalEn);
          }
        }
      } else {
        setSuggestion("");
      }
    }
  }, [value, isAr]);

  // Intercept Tab key on the textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        
        const start = el.selectionStart || 0;
        const end = el.selectionEnd || 0;
        const currentVal = el.value;
        
        // Append suggestion at cursor position
        const newVal = currentVal.substring(0, start) + suggestion + currentVal.substring(end);
        onChange(newVal);
        
        // Clear suggestion
        setSuggestion("");
        
        // Reset cursor location at end of inserted text
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + suggestion.length, start + suggestion.length);
        }, 10);
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [suggestion, onChange, textareaRef]);

  if (!suggestion) return null;

  return (
    <div 
      className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200/65 rounded-xl px-3 py-1.5 text-[10px] animate-in fade-in slide-in-from-top-1 duration-200 select-none z-10 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-400 to-rose-400 opacity-60" />
      <p className="font-medium text-slate-500 leading-normal flex items-center gap-1.5 flex-1 pl-1 pr-1 truncate">
        <Sparkles size={11} className="text-orange-500 shrink-0 animate-pulse" />
        <span className="text-slate-400 text-[10px]">
          {isAr ? "اقتراح ذكي:" : "AI Suggestion:"}
        </span>
        <span className="font-extrabold text-[#001639] italic max-w-md truncate">
          {suggestion}
        </span>
      </p>
      
      <button
        type="button"
        onClick={() => {
          const el = textareaRef.current;
          if (el) {
            const currentVal = el.value;
            onChange(currentVal + suggestion);
            setSuggestion("");
            el.focus();
          }
        }}
        className="shrink-0 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-black text-slate-800 hover:text-[#001639] hover:border-[#001639]/20 transition-all cursor-pointer shadow-3xs active:scale-95"
      >
        <span>Tab</span>
        <CornerDownLeft size={8} />
      </button>
    </div>
  );
}
