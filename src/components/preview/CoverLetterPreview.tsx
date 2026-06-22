import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Copy, Check, FileText, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

function Letterhead({ personalInfo, themeColor, template, language }: { 
  personalInfo: any; 
  themeColor: string; 
  template: string; 
  language: string;
}) {
  const isAr = language === "ar";
  
  if (template === "modern" || template === "professional") {
    return (
      <header className="mb-8 border-b-2 pb-6 text-start" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: themeColor }}>
          {personalInfo?.fullName || (isAr ? "الاسم الكامل" : "Your Name")}
        </h1>
        <p className="text-sm font-bold tracking-wide mt-1 uppercase text-neutral-600">
          {personalInfo?.jobTitle || (isAr ? "المسمى الوظيفي" : "Your Profession")}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 font-semibold mt-3">
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span dir="ltr">📞 {personalInfo.phone}</span>}
          {personalInfo?.address && <span>📍 {personalInfo.address}</span>}
        </div>
      </header>
    );
  }

  if (template === "classic" || template === "elegant" || template === "academic") {
    return (
      <header className="mb-8 text-center border-b pb-6 border-neutral-200">
        <h1 className="text-3xl font-serif tracking-normal" style={{ color: themeColor }}>
          {personalInfo?.fullName || (isAr ? "الاسم الكامل" : "Your Name")}
        </h1>
        <p className="text-sm font-serif italic text-neutral-500 mt-1">
          {personalInfo?.jobTitle || (isAr ? "المسمى الوظيفي" : "Your Profession")}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500 mt-3 font-mono">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span dir="ltr">{personalInfo.phone}</span>}
          {personalInfo?.address && <span>{personalInfo.address}</span>}
        </div>
      </header>
    );
  }

  // Creative/Tech/Minimal/Arabic
  return (
    <header className="mb-8 p-5 bg-neutral-50 border-s-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start text-start" style={{ borderInlineStartColor: themeColor }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">
          {personalInfo?.fullName || (isAr ? "الاسم الكامل" : "Your Name")}
        </h1>
        <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: themeColor }}>
          {personalInfo?.jobTitle || (isAr ? "المسمى الوظيفي" : "Your Profession")}
        </p>
      </div>
      <div className="mt-2 sm:mt-0 text-start sm:text-right ltr:sm:text-left text-[11px] text-neutral-500 font-medium space-y-0.5">
        {personalInfo?.email && <div>{personalInfo.email}</div>}
        {personalInfo?.phone && <div dir="ltr">{personalInfo.phone}</div>}
        {personalInfo?.address && <div>{personalInfo.address}</div>}
      </div>
    </header>
  );
}

export default function CoverLetterPreview() {
  const { data } = useResumeStore();
  const coverLetter = data.coverLetter || { generatedContent: "" };
  const [copied, setCopied] = useState(false);
  const [isSynced, setIsSynced] = useState(true);

  const themeColor = data.settings?.themeColor || "#2563EB";
  const template = data.settings?.template || "modern";
  const language = data.settings?.language || "ar";

  const isAr = language === "ar";

  const handleCopy = () => {
    if (coverLetter.generatedContent) {
      navigator.clipboard.writeText(coverLetter.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!coverLetter.generatedContent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
          <FileText size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">
          {isAr ? "لا توجد رسالة تغطية مفعّلة" : "No Cover Letter Yet"}
        </h3>
        <p className="max-w-xs text-xs font-semibold text-slate-400 leading-relaxed">
          {isAr 
            ? "أدخل بياناتك في النموذج الجانبي، واضغط على 'إنشاء بالذكاء الاصطناعي' لتوليد خطاب متناسق فوراً." 
            : "Fill out the details in the form and click 'Generate with AI' to build your letter."}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50/50 p-6 sm:p-10 md:p-12 shadow-sm overflow-y-auto font-sans text-neutral-800 leading-relaxed">
      {/* Sync bar & Copy block */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8 print:hidden select-none" style={{ direction: isAr ? "rtl" : "ltr" }}>
        {/* Identity Sync Switch widget */}
        <button
          onClick={() => setIsSynced(!isSynced)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all border shadow-xs leading-none active:scale-95 ${
            isSynced 
              ? "bg-[#FF4D2D]/10 text-[#FF4D2D] border-[#FF4D2D]/20" 
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <RefreshCw size={13} className={isSynced ? "animate-spin-slow text-[#FF4D2D]" : ""} style={{ animationDuration: "12s" }} />
          <span>
            {isSynced 
              ? (isAr ? "✨ متطابق مع هوية السيرة" : "✨ Syced with Resume Style") 
              : (isAr ? "مواءمة مظهر السيرة" : "Match Resume Theme")}
          </span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 text-xs font-black text-slate-705 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          <span>{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ النص" : "Copy Text")}</span>
        </button>
      </div>

      {/* Styled mockup paper wrapper */}
      <div 
        className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-250/70 shadow-sm print:shadow-none print:p-0"
        style={{ direction: isAr ? "rtl" : "ltr" }}
      >
        {isSynced && (
          <Letterhead 
            personalInfo={data.personalInfo} 
            themeColor={themeColor} 
            template={template} 
            language={language} 
          />
        )}

        <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap font-serif text-neutral-800 text-start">
          <ReactMarkdown>{coverLetter.generatedContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
