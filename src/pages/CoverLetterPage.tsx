import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Download, 
  Loader2, 
  Check, 
  FileText, 
  Building2, 
  User, 
  Briefcase, 
  Info,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";
import { Navbar } from "../components/layout/Navbar";
import Footer from "../components/Footer";

interface ToneOption {
  id: string;
  en: string;
  ar: string;
  emoji: string;
}

const TONES: ToneOption[] = [
  { id: "professional", en: "Professional & Expert", ar: "مهني ورسمي", emoji: "💼" },
  { id: "enthusiastic", en: "Enthusiastic & Passionate", ar: "حماسي وشغوف", emoji: "🔥" },
  { id: "creative", en: "Creative & Storyteller", ar: "إبداعي وسرد قصصي", emoji: "🎨" },
  { id: "bold", en: "Bold & Direct", ar: "جريء ومباشر", emoji: "🎯" },
  { id: "warm", en: "Warm & Empathetic", ar: "دافئ وودود", emoji: "🤝" }
];

export default function CoverLetterPage() {
  const { language } = useLanguageStore();
  const resumeData = useResumeStore((state) => state.data);
  const isAr = language === "ar";

  // Form states
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [selectedLang, setSelectedLang] = useState(language);

  // Output states
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill from active resume store if available
  useEffect(() => {
    if (resumeData?.personalInfo?.summary) {
      // Pre-fill target title if they have one
      const title = resumeData.personalInfo.title || "";
      setJobTitle(title);
    }
  }, [resumeData]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription,
          tone: selectedTone,
          companyName,
          recipientName,
          jobTitle,
          language: selectedLang
        })
      });

      if (!response.ok) {
        throw new Error(isAr ? "فشل الاتصال بالخادم الذكي" : "Failed to connect to the AI generation server.");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedLetter(result.text || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!generatedLetter) return;
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName || "Company"}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8">
        {/* Header Hero Area */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-100 text-brand-600 rounded-full text-xs font-black"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>{isAr ? "ذكاء اصطناعي فائق" : "NEXT-GEN GOOGLE GEMINI AI"}</span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isAr ? "مُنشئ رسائل التغطية بالذكاء الاصطناعي ✨" : "AI Cover Letter Generator ✨"}
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
            {isAr 
              ? "اكتب رسالة تغطية احترافية ومقنعة مخصصة لكل وظيفة فوراً ومجاناً، لزيادة قبولك في الـ ATS!"
              : "Generate persuasive, beautifully tailored expert cover letters matching target job descriptions in seconds!"}
          </p>
        </div>

        {/* Info panel explaining auto-populate */}
        {resumeData?.personalInfo?.fullName && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-emerald-800 text-xs font-medium">
            <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">
                {isAr ? "تم ربطه بمسودتك الحالية!" : "Draft Synced Successfully!"}
              </span>
              <p className="text-emerald-700/90 leading-normal">
                {isAr 
                  ? `قمنا تلقائيًا بربط معلوماتك وخبراتك المسجلة باسم "${resumeData.personalInfo.fullName}" لصياغة رسالة شديدة التخصيص والدقة.`
                  : `We automatically connected your skills and experiences registered for "${resumeData.personalInfo.fullName}" to write a deeply personalized letter.`}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-5 sm:p-6 space-y-6">
            <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText size={18} className="text-slate-500" />
              {isAr ? "تفاصيل الوظيفة المستهدفة" : "Target Role Information"}
            </h2>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Target Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={13} />
                  {isAr ? "المسمى الوظيفي المستهدف" : "Target Job Title"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: مطور برمجيات، مدير تسويق..." : "e.g., Software Engineer, Marketing Lead..."}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-11 px-3.5 border border-slate-200 hover:border-slate-300 focus:border-brand-500 rounded-xl bg-slate-50/50 text-xs focus:bg-white outline-none transition-all font-medium"
                />
              </div>

              {/* Company & Recipient Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={13} />
                    {isAr ? "اسم الشركة" : "Company Name"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "مثال: شركة هاش لحلول الويب" : "e.g., Hash Web Solutions"}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-11 px-3.5 border border-slate-200 hover:border-slate-300 focus:border-brand-500 rounded-xl bg-slate-50/50 text-xs focus:bg-white outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} />
                    {isAr ? "اسم مسؤول التوظيف (اختياري)" : "Recipient Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "مثال: أ. أحمد، مدير الموارد" : "e.g., Hiring Manager, HR Lead"}
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full h-11 px-3.5 border border-slate-200 hover:border-slate-300 focus:border-brand-500 rounded-xl bg-slate-50/50 text-xs focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  {isAr ? "نبرة وأسلوب الرسالة" : "Tone & Communication Style"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedTone === tone.id
                          ? "border-brand-500 bg-brand-50 text-brand-700 font-extrabold shadow-2xs"
                          : "border-slate-150 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className="text-base">{tone.emoji}</span>
                      <span>{isAr ? tone.ar : tone.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  {isAr ? "لغة رسالة التغطية" : "Letter Language"}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "ar", label: "العربية" },
                    { id: "en", label: "English" }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        selectedLang === lang.id
                          ? "border-[#001639] bg-[#001639] text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description Pasting */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  {isAr ? "الوصف الوظيفي / الشروط المطلوبة (اختياري)" : "Job Description & Requirements (Optional)"}
                </label>
                <textarea
                  placeholder={isAr 
                    ? "الصق شروط الوظيفة أو وصف الدور هنا، ليتم تعديل الرسالة لتجتاز فلاتر الـ ATS وتتطابق مع الدور تماماً!" 
                    : "Paste requirements to match keywords and qualifications perfectly for top recruiter evaluation..."}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-28 p-3 border border-slate-200 hover:border-slate-300 focus:border-brand-500 rounded-xl bg-slate-50/50 text-xs focus:bg-white outline-none transition-all resize-none leading-relaxed font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#001639] hover:bg-[#E64528] active:scale-98 transition-all text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{isAr ? "جاري صياغة رسالتك الاحترافية..." : "AI is writing your letter..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>{isAr ? "توليد رسالة تغطية احترافية ✨" : "Generate Cover Letter ✨"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Letter Output Side */}
          <div className={`lg:col-span-7 flex flex-col h-full bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden min-h-[500px] transition-all ${
            isFullScreen ? "fixed inset-4 z-[100] bg-white m-0" : "relative"
          }`}>
            {/* Header Control Panel */}
            <div className="px-5 py-4 bg-slate-900 text-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg text-emerald-400">
                  <FileText size={14} />
                </div>
                <h3 className="font-bold text-xs">
                  {isAr ? "استعراض مسودة رسالة التغطية" : "Cover Letter Document Draft"}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                {generatedLetter && (
                  <>
                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title={isAr ? "نسخ النص كاملاً" : "Copy to Clipboard"}
                    >
                      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span className="hidden sm:inline text-[10px]">{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ" : "Copy")}</span>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadTxt}
                      className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title={isAr ? "تنزيل كملف نصي" : "Download as text"}
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline text-[10px]">{isAr ? "تنزيل" : "Download"}</span>
                    </button>
                  </>
                )}

                {/* Full screen toggle */}
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg text-white cursor-pointer"
                >
                  {isFullScreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
              </div>
            </div>

            {/* Letter Body Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-white/50 backdrop-blur-xs flex flex-col justify-between" dir={selectedLang === "ar" ? "rtl" : "ltr"}>
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4 text-slate-400">
                  <Loader2 className="animate-spin text-[#001639]" size={36} />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 text-sm animate-pulse">
                      {isAr ? "جاري التفكير والتوليد بالذكاء الاصطناعي..." : "Gemini is tailoring your letter..."}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-none">
                      {isAr ? "يقوم النظام بمطابقة خبراتك لتجتاز معايير القبول الفني" : "Scanning coordinates for maximum ATS compliance"}
                    </p>
                  </div>
                </div>
              ) : generatedLetter ? (
                <div className="space-y-6">
                  {/* Watermark / ATS stamp */}
                  <div className="p-3 bg-brand-50/50 border border-brand-100 rounded-xl flex items-center justify-between text-brand-800 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-brand-500" />
                      <span>{isAr ? "توصيات الـ ATS: رسالة التغطية هذه جاهزة للإرسال والمطابقة الفنية" : "ATS Notice: Highly compliant with industry filters"}</span>
                    </div>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white border border-slate-100 rounded-2xl p-6 shadow-3xs max-w-2xl mx-auto border-t-4 border-t-slate-800 select-all">
                    {generatedLetter}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3 text-slate-450">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 shrink-0">
                    <FileText size={42} strokeWidth={1} />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-bold text-slate-700 text-sm">
                      {isAr ? "رسالتك التغطية تظهر هنا" : "Draft Preview Section"}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      {isAr 
                        ? "املأ تفاصيل الوظيفة واضغط على زر التوليد لصياغة رسالتك الاحترافية بدقة." 
                        : "Your beautifully crafted, job-specific cover letter draft is generated instantly."}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-start">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
