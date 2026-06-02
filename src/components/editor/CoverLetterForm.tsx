import React, { useState, useEffect } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Sparkles, Check, AlertCircle, Import } from "lucide-react";
import { aiService } from "../../services/aiService";
import SectionTooltip from "./SectionTooltip";

export default function CoverLetterForm() {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateCoverLetter } = useResumeStore();
  const { personalInfo, skills } = data;

  // Safely access coverLetter, ensuring all fields are defined
  const coverLetter = {
    fullName: data.coverLetter?.fullName || "",
    jobTitle: data.coverLetter?.jobTitle || "",
    companyName: data.coverLetter?.companyName || "",
    hiringManager: data.coverLetter?.hiringManager || "",
    jobDescription: data.coverLetter?.jobDescription || "",
    skills: data.coverLetter?.skills || "",
    generatedContent: data.coverLetter?.generatedContent || "",
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState<string>("corporate");

  // Auto-populate from resume data if empty
  useEffect(() => {
    // Only run if coverLetter exists in data (to avoid infinite loop if updateCoverLetter triggers re-render with new object)
    // But here we want to initialize it if it's missing or empty

    const shouldUpdate =
      (!coverLetter.fullName && personalInfo.fullName) ||
      (!coverLetter.jobTitle && personalInfo.jobTitle) ||
      (!coverLetter.skills && skills.length > 0);

    if (shouldUpdate) {
      updateCoverLetter({
        fullName: coverLetter.fullName || personalInfo.fullName || "",
        jobTitle: coverLetter.jobTitle || personalInfo.jobTitle || "",
        skills: coverLetter.skills || skills.join(", ") || "",
      });
    }
  }, [
    personalInfo.fullName,
    personalInfo.jobTitle,
    skills,
    coverLetter.fullName,
    coverLetter.jobTitle,
    coverLetter.skills,
    updateCoverLetter,
  ]);

  const handleImportFromResume = () => {
    updateCoverLetter({
      fullName: personalInfo.fullName || "",
      jobTitle: personalInfo.jobTitle || "",
      skills: skills.join(", ") || "",
    });
    setImported(true);
    setTimeout(() => setImported(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updateCoverLetter({ [name]: value });
  };

  const generateCoverLetter = async () => {
    if (
      !coverLetter.fullName ||
      !coverLetter.companyName ||
      !coverLetter.jobTitle
    ) {
      setError(t.coverLetter.fillRequired);
      return;
    }

    setIsGenerating(true);
    setError(null);

    const stylePrompt = {
      corporate: 'Tone: Highly professional, formal, and direct. Focus on measurable corporate impact.',
      fresh_graduate: 'Tone: Enthusiastic, eager to learn, and adaptable. Focus on potential, academic background, and relevant projects/internships.',
      remote: 'Tone: Independent, reliable, and communicative. Focus on being a self-starter, remote collaboration tools, and time management.',
      gulf: 'Tone: Respectful and professional. Highlight cultural adaptability, language skills (if any), and readiness to relocate or work in a diverse multinational environment in the Gulf.'
    }[selectedStyle] || '';

    const prompt = `
 Write a professional cover letter for a ${coverLetter.jobTitle} position at ${coverLetter.companyName}.
 
 Candidate Name: ${coverLetter.fullName}
 Hiring Manager: ${coverLetter.hiringManager || "Hiring Manager"}
 
 ${stylePrompt}
 
 Job Description:
 ${coverLetter.jobDescription || "Not provided"}
 
 Key Skills:
 ${coverLetter.skills}
 
 The cover letter should be engaging and highlight why the candidate is a good fit based on the requested tone.
 Keep it concise (under 400 words).
 Do not include placeholders like [Your Name] or [Date], use the provided information.
 Format it with proper paragraphs.
`;

    try {
      const result = await aiService.generateContent(prompt);

      if (result.error) {
        setError(result.error);
      } else if (result.text) {
        updateCoverLetter({ generatedContent: result.text });
      }
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setError(t.coverLetter.error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl flex items-start gap-3 mb-2">
        <Sparkles className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
        <div className="text-sm text-brand-900 leading-relaxed">
          {language === "ar" ? (
            <>
              <strong>لمحة سريعة:</strong> هذا القسم يضيف خطاب التقديم كصفحة إضافية داخل <strong>نفس ملف السيرة الذاتية (PDF)</strong>. إذا كنت تريد إنشاء خطاب تقييم <strong>لملف منفصل</strong> بالكامل، يمكنك استخدام <a href="/cover-letter" target="_blank" className="underline font-bold text-brand-600 hover:text-brand-800">صانع الخطابات المستقل</a>.
            </>
          ) : (
            <>
              <strong>Note:</strong> This section generates a cover letter that is integrated directly into your resume PDF as an <strong>extra page</strong>. For a completely <strong>standalone document</strong>, you can use our <a href="/cover-letter" target="_blank" className="underline font-bold text-brand-600 hover:text-brand-800">Standalone Cover Letter Builder</a>.
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={String(t.coverLetter?.title || "")}
            content={String(t.coverLetter?.tooltipDesc || "Generate a tailored cover letter using AI based on your resume and the job description.")}
            example={String(t.coverLetter?.tooltipExample || "Fill in the details below and click Generate.")}
          />
        </div>
        <button
          onClick={handleImportFromResume}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
          title={String(t.coverLetter?.importTooltip || "")}
        >
          {imported ? <Check size={16} /> : <Import size={16} />}
          {imported ? String(t.coverLetter?.imported || "") : String(t.coverLetter?.importFromResume || "")}
        </button>
      </div>

      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-slate-700"
            >
              {String(t.coverLetter?.fullName || "")}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={coverLetter.fullName}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={String(t.coverLetter?.fullNamePlaceholder || "")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-slate-700"
            >
              {String(t.coverLetter?.jobTitle || "")}
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={coverLetter.jobTitle}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={String(t.coverLetter?.jobTitlePlaceholder || "")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="text-sm font-medium text-slate-700"
            >
              {String(t.coverLetter?.companyName || "")}
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={coverLetter.companyName}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-white text-slate-900 placeholder-slate-400"
              placeholder={String(t.coverLetter?.companyNamePlaceholder || "")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="hiringManager"
              className="text-sm font-medium text-slate-700"
            >
              {String(t.coverLetter?.hiringManager || "")}
            </label>
            <input
              type="text"
              id="hiringManager"
              name="hiringManager"
              value={coverLetter.hiringManager}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-white text-slate-900 placeholder-slate-400"
              placeholder={String(t.coverLetter?.hiringManagerPlaceholder || "")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="skills"
            className="text-sm font-medium text-slate-700"
          >
            {String(t.coverLetter?.skills || "")}
          </label>
          <textarea
            id="skills"
            name="skills"
            rows={3}
            value={coverLetter.skills}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-white text-slate-900 placeholder-slate-400"
            placeholder={String(t.coverLetter?.skillsPlaceholder || "")}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="jobDescription"
            className="text-sm font-medium text-slate-700"
          >
            {String(t.coverLetter?.jobDescription || "")}
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={4}
            value={coverLetter.jobDescription}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm bg-white text-slate-900 placeholder-slate-400"
            placeholder={String(t.coverLetter?.jobDescriptionPlaceholder || "")}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            {language === 'ar' ? 'نمط الخطاب' : 'Letter Style'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "corporate", label: language === 'ar' ? 'رسمي ومهني' : 'Corporate & Formal' },
              { id: "fresh_graduate", label: language === 'ar' ? 'حديث التخرج (حماس وقابلية للتعلم)' : 'Fresh Graduate (Eager & trainable)' },
              { id: "remote", label: language === 'ar' ? 'عمل عن بعد (مستقل ومبادر)' : 'Remote (Self-starter)' },
              { id: "gulf", label: language === 'ar' ? 'دول الخليج' : 'Gulf Region' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedStyle === style.id
                    ? 'bg-brand-50 border-brand-200 text-brand-700 border-2'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 border-2'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="relative flex flex-col gap-2">
          <button
            onClick={generateCoverLetter}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-[#ff4d2d] hover:bg-[#e63e1d] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {String(t.coverLetter?.generating || "Generating...")}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {String(t.coverLetter?.generateWithAI || "Generate with AI")}
              </>
            )}
          </button>

          
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 opacity-70 px-2 leading-tight">
               <Sparkles size={10} className="text-brand-400 shrink-0" />
               {language === "ar" 
                 ? "يتم إرسال المعلومات المدخلة أعلاه فقط (بدون أي هويات أو معلومات תواصل) بشكل مشفر لتخصيص محتواك."
                 : "Only the snippets above are sent anonymously to generate tailored content."}
          </div>
        </div>
      </div>
    </div>
  );
}
