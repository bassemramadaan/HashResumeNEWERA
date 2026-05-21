import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Download,
  FileText,
  Save,
  Upload,
  CheckCircle2,
  ArrowRight,
  Target,
  PenTool,
  Search,
  MessageCircle,
  Share2,
} from "lucide-react";
import { generateWord } from "../../utils/generateWord";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

interface FinishStepProps {
  onPrint: () => void;
  onExportWord: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({
  onPrint,
  onExportWord,
  onJumpToStep,
}: FinishStepProps) {
  const { data, updateData } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].landing.finish;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [whatsappTone, setWhatsappTone] = useState<"professional" | "creative" | "short">("professional");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [copiedPitch, setCopiedPitch] = useState(false);

  const isAr = language === "ar";

  const getPitchText = () => {
    const fullName = data.personalInfo.fullName || (isAr ? "فلان الفلاني" : "John Doe");
    const jobTitle = data.personalInfo.jobTitle || (isAr ? "مطور برمجيات" : "Software Developer");
    const summary = data.personalInfo.summary || "";
    const phone = data.personalInfo.phone || (isAr ? "رقم الهاتف" : "Phone number");
    const email = data.personalInfo.email || (isAr ? "البريد الإلكتروني" : "Email address");
    
    const skillsList = data.skills && data.skills.length > 0
      ? data.skills.slice(0, 5).map(s => `• ${s}`).join("\n")
      : (isAr ? "• مهارات تخصصية أولى\n• مهارات تخصصية ثانية" : "• Core Skill A\n• Core Skill B");

    const latestJob = data.experience && data.experience.length > 0 ? data.experience[0] : null;
    const lastJobStr = latestJob
      ? (isAr 
          ? `• ${latestJob.position} في ${latestJob.company} (${latestJob.startDate || ""} - ${latestJob.endDate || ""})`
          : `• ${latestJob.position} at ${latestJob.company} (${latestJob.startDate || ""} - ${latestJob.endDate || ""})`
        )
      : (isAr ? "• خبرة عملية أولى في المجال" : "• Professional Experience Role");

    const linksList = [];
    if (data.personalInfo.linkedin) linksList.push(`• LinkedIn: ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) linksList.push(`• GitHub: ${data.personalInfo.github}`);
    if (data.personalInfo.portfolio) linksList.push(`• Portfolio: ${data.personalInfo.portfolio}`);
    const linksText = linksList.length > 0 ? "\n" + linksList.join("\n") : "";

    if (isAr) {
      if (whatsappTone === "short") {
        return `*👋 مرحباً، معكم ${fullName} (${jobTitle})*

أبحث عن فرصة مهنية جديدة ومميزة كـ *${jobTitle}*.

*🎯 المهارات الأبرز:*
${skillsList}

*💡 ملخص سريع:*
${summary ? (summary.length > 120 ? summary.substring(0, 120) + "..." : summary) : "شغوف بالعمل الاحترافي والسعي المستمر لتقديم أفضل الحلول وتطوير المهارات المتكاملة."}

*📞 للتواصل الفوري والواتساب:* ${phone} | ${email}${linksText}

سأكون سعيداً جداً بمشاركة ملف سيرتي الذاتية (PDF) كاملاً ومناقشة الفرص المتاحة لديكم. دمتم بخير!`;
      }

      if (whatsappTone === "creative") {
        return `*🚀 الابتكار والشغف المهني!*

معكم *${fullName}*، شغوف بالمهام والتحديات الكبرى كـ *${jobTitle}*! 🌟

أهتم جداً بالعمل مع شركات رائدة تسعى للتميز والابتكار المستمر. يسعدني استعراض ملف خبراتي معكم:

*✨ المهارات ونقاط القوة:*
${skillsList}

*🎯 رؤيتي وأهدافي:*
${summary ? (summary.length > 150 ? summary.substring(0, 150) + "..." : summary) : "أطمح لتوظيف الشغف والخبرة في تسريع نمو الأعمال وتوفير تجارب مستخدم ومنتجات على أعلى مستوى."}

*💼 آخر وظيفة:*
${lastJobStr}

*💬 لنتواصل فوراً:*
• هاتف: ${phone}
• إيميل: ${email}${linksText}

يسرني إرسال النسخة الكاملة والمحدثة من سيرتي الذاتية ومشاركة رؤيتي وكيف يمكنني قيادة وتطوير الأعمال لديكم!`;
      }

      // Default to "professional"
      return `*📌 طلب انضمام لوظيفة: ${jobTitle}*

السلام عليكم ورحمة الله وبركاته،
أهلاً بحضرتك، أتمنى أن تكونوا بكامل الصحة والعافية.

أنا *${fullName}*، وأعمل كـ *${jobTitle}*. يسعدني ويشرفني تقديم سيرتي الذاتية لفرص العمل المتاحة لديكم.

*💡 نبذة موثوقة:*
${summary || "يسعدني العمل جاهداً وتطبيق المعرفة المتكاملة والخبرات المتراكمة لابتكار حلول ذات أثر وتحقيق غايات الفريق بجودة وكفاءة تامة."}

*🛠️ المهارات الرئيسية:*
${skillsList}

*💼 آخر الخبرات المهنية:*
${lastJobStr}

*📞 معلومات التواصل السريع:*
• الهاتف: ${phone}
• البريد الإلكتروني: ${email}${linksText}

مرفق مع هذه الرسالة سيرتي الذاتية بكافة التفاصيل. يسعدني جداً التباحث حول إمكانية التعاون معكم. شكراً جزيلاً لوقتكم الثمين.`;
    } else {
      // English templates
      if (whatsappTone === "short") {
        return `*👋 Hi there, I'm ${fullName} (${jobTitle})*

I am actively open to new career challenges as a *${jobTitle}*.

*🎯 Key Strengths:*
${skillsList}

*💡 Quick Pitch:*
${summary ? (summary.length > 120 ? summary.substring(0, 120) + "..." : summary) : "Highly-motivated developer focusing on pixel-perfect implementations, clean coding systems, and productive collaboration."}

*📞 Get in Touch:* ${phone} | ${email}${linksText}

I would be delighted to send over my complete PDF Resume and discuss potential fits! Have a wonderful day!`;
      }

      if (whatsappTone === "creative") {
        return `*🚀 Elevating Value with Relentless Passion:*

Hello! My name is *${fullName}*, and I am a dedicated professional in the realm of *${jobTitle}*! 🌟

I help transform processes, scale technical solutions, and inject fresh energy into every challenge. Here is a snapshot of my value offer:

*✨ Core Strengths:*
${skillsList}

*🎯 Personal Statement:*
${summary ? (summary.length > 150 ? summary.substring(0, 150) + "..." : summary) : "Dedicated to unlocking digital potentials and delivering scalable products that elevate standards."}

*💼 Recent Milestone:*
${lastJobStr}

*💬 Let's co-create results:*
• Call/WhatsApp: ${phone}
• Email: ${email}${linksText}

I'd love to share my complete PDF Resume and chat about our shared goals! Let's build together!`;
      }

      // Default: professional
      return `*📌 Job Application: ${jobTitle}*

Dear Hiring Team / Recruiter,

I hope this message finds you well.

My name is *${fullName}*, and I am a *${jobTitle}*. I am very interested in exploring suitable career opportunities with your organization.

*💡 Professional Summary:*
${summary || "A results-oriented professional with strong focus on strategic execution, high-grade development, and collaborative problem-solving."}

*🛠️ Core Expertise & Skills:*
${skillsList}

*💼 Recent Professional Experience:*
${lastJobStr}

*📞 Quick Contact Information:*
• Phone: ${phone}
• Email: ${email}${linksText}

Attached is my full Resume. I look forward to the possibility of discussing how my skills and experience align with your requirements.

Thank you for your time and consideration.`;
    }
  };

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${data.personalInfo.fullName || "resume"}_backup.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Basic validation
        if (
          importedData &&
          importedData.personalInfo &&
          importedData.experience
        ) {
          updateData(importedData);
          setAlertMessage(t.importSuccess);
        } else {
          setAlertMessage(t.importInvalid);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setAlertMessage(t.importFailed);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextSteps = [
    {
      title: t.findJobs || "Apply with Hash Hunt",
      desc: t.findJobsDesc || "Publish your CV to our partner employers.",
      icon: <Search className="w-6 h-6 text-emerald-500" />,
      path: "/hash-hunt",
      type: "link",
    },
    {
      title: t.checkAts,
      desc: t.checkAtsDesc,
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      action: () => onJumpToStep("finish"),
      type: "button",
    },
    {
      title: t.createCover,
      desc: t.createCoverDesc,
      icon: <PenTool className="w-6 h-6 text-orange-500" />,
      path: "/cover-letter",
      type: "link",
    },
  ];

  const handleProceedToExportWord = () => {
    if (data.isPremium) {
      generateWord(data);
    } else {
      onExportWord(); // This will trigger the payment modal in EditorPage
    }
  };

  const AlertModal = () => {
    if (!alertMessage || typeof document === 'undefined') return null;
    return createPortal(
      <AnimatePresence>
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center space-y-4">
              <p className="text-slate-700 font-medium">{alertMessage}</p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
              >
                {t.ok}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-4xl mx-auto relative">
      <AlertModal />

      {/* Celebratory Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-2"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.readyTitle}
        </h2>
        <p className="text-slate-500 text-lg">{t.readySubtitle}</p>
      </div>

      {/* Backup Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 end-0 w-32 h-32 bg-orange-500/5 rounded-full -me-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Save className="w-6 h-6 text-orange-600" />
              </div>
              {t.backupTitle}
            </h3>
            <p className="text-slate-600 leading-relaxed">{t.backupDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-4 w-full lg:w-auto">
            <button
              onClick={onPrint}
              data-tour="download-button"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <FileText size={18} className="text-red-500" />
              {t.exportPdf}
            </button>
            <button
              onClick={handleProceedToExportWord}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <FileText size={18} className="text-blue-500" />
              {t.exportWord}
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <Download size={18} className="text-emerald-500" />
              {t.backupData}
            </button>
            <label className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
              <Upload size={18} className="text-orange-500" />
              {t.restoreData}
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJson}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
      </div>

      {/* WhatsApp Pitch and Share Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl shrink-0 text-emerald-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {isAr ? "التقديم السريع المطور عبر الواتساب" : "Advanced WhatsApp Recruiter Pitch"}
              </h3>
              <p className="text-slate-500 text-sm font-semibold mt-0.5">
                {isAr 
                  ? "حوّل بيانات سيرتك الذاتية لرسالة تقديم احترافية جذابة مصممة للإرسال الفوري للشركات والمدراء." 
                  : "Convert your resume data into a polished presentation pitch ready to be sent directly to recruitment managers."}
              </p>
            </div>
          </div>
        </div>

        {/* Configurations grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls - Left side */}
          <div className="lg:col-span-5 space-y-5">
            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                {isAr ? "أسلوب وكتابة الرسالة" : "Tone Style"}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setWhatsappTone("professional")}
                  className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all ${
                    whatsappTone === "professional"
                      ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {isAr ? "رسمي ومفصل" : "Professional"}
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTone("short")}
                  className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all ${
                    whatsappTone === "short"
                      ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {isAr ? "موجز وسريع" : "Short & Direct"}
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTone("creative")}
                  className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all ${
                    whatsappTone === "creative"
                      ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {isAr ? "حماسي مبتكر" : "Enthusiastic"}
                </button>
              </div>
            </div>

            {/* Optional Phone Number Entry */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                {isAr ? "رقم واتساب المستلم (اختياري)" : "Recruiter's WhatsApp (Optional)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recruiterPhone}
                  onChange={(e) => setRecruiterPhone(e.target.value.replace(/[^\d+]/g, ""))}
                  placeholder={isAr ? "مثال: 01011112222" : "e.g. +201011112222"}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 outline-none rounded-xl px-3.5 py-2.5 text-xs font-black transition-all placeholder:text-slate-400"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-tighter text-[#FF4D2D] select-none pointer-events-none">
                  {isAr ? "مباشر" : "Direct"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold leading-normal">
                {isAr 
                  ? "كتابة رقم المستلم تتيح لك قفز حفظ جهة الاتصال والدردشة معهم فوراً بنقرة زر!" 
                  : "Entering a number opens a direct chat instantly without needing to save them in your contacts first!"}
              </p>
            </div>

            {/* Interactive Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCopyPitch(getPitchText())}
                className="flex items-center justify-center gap-1.5 h-11 border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all rounded-xl text-xs font-bold text-slate-800 shadow-3xs cursor-pointer"
              >
                {copiedPitch ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-emerald-600">{isAr ? "تم النسخ!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} className="text-slate-500 shrink-0" />
                    <span>{isAr ? "نسخ الرسالة" : "Copy Message"}</span>
                  </>
                )}
              </button>

              <a
                href={
                  recruiterPhone 
                    ? `https://wa.me/${recruiterPhone.replace(/\+/g, "")}?text=${encodeURIComponent(getPitchText())}`
                    : `https://wa.me/?text=${encodeURIComponent(getPitchText())}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 h-11 text-white bg-[#128C7E] hover:bg-[#0e7065] active:scale-95 transition-all rounded-xl text-xs font-black shadow-sm cursor-pointer"
              >
                <MessageCircle size={14} className="shrink-0" />
                <span>{isAr ? "فتح الإرسال" : "Send on Chat"}</span>
              </a>
            </div>
          </div>

          {/* Interactive Chat Bubble Representation - Right side */}
          <div className="lg:col-span-7 flex flex-col h-[320px] bg-[#E5DDD5] rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
            {/* Simulated WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cover bg-center flex items-center justify-center font-bold text-xs bg-emerald-100 text-[#075E54] border border-emerald-50 relative shrink-0">
                  HR
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-[#075E54] rounded-full animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white leading-tight">
                    {isAr ? "مدير التوظيف المستهدف" : "Target Recruiter / HR"}
                  </h4>
                  <span className="text-[10px] text-slate-200 font-semibold opacity-90 block">
                    {isAr ? "نشط الآن" : "Active now"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200/80">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/15 text-slate-100 font-mono">
                  {whatsappTone.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Simulated WhatsApp Body with Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-end relative">
              {/* Wallpaper overlay texture look */}
              <div className="absolute inset-0 bg-[radial-gradient(#128c7e0c_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none opacity-40" />

              <div className="relative self-start max-w-[90%] sm:max-w-[85%] bg-white rounded-2xl rounded-tl-none p-3.5 shadow-xs border border-slate-200/40 text-left z-10">
                <div className="absolute top-0 -left-2.5 w-3 h-3.5 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                
                <div className="max-h-[200px] overflow-y-auto text-[11px] font-semibold text-slate-800 leading-relaxed font-mono whitespace-pre-wrap tracking-wide pr-1">
                  {getPitchText()}
                </div>
                
                <div className="text-right text-[9px] font-bold text-slate-400 mt-1.5 block">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic ideas list for recruitment guide */}
        <div className="bg-slate-50 border border-slate-150/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
              ★
            </span>
            {isAr ? "أفكار وحيل ذكية لإرسال السيرة على الواتساب للمنافسة العالمية:" : "Smart WhatsApp Sharing Practices for Global Impact:"}
          </h4>
          <ul className="text-xs text-slate-600 font-bold leading-relaxed space-y-2.5 list-none pl-0">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
              <span>
                <strong>{isAr ? "أرسل ملف الـ PDF كملف أصلي أولاً:" : "Send as Native PDF documents, never images:"}</strong>{" "}
                {isAr 
                  ? "تجنب تصوير الشاشة أو إرسال السيرة كصورة. إرسالها كـ PDF منظم يحافظ على جودتها ويسهّل قراءتها للطباعة والـ ATS." 
                  : "Screenshots fail parsing filters and look highly unprofessional. Keep your resume in PDF format for direct reading."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
              <span>
                <strong>{isAr ? "استخدم عنوان ملف واضح واحترافي لشخصك وثوبك:" : "Name files using professional naming conventions:"}</strong>{" "}
                {isAr 
                  ? "سمّ الملف بالصيغة التالية لتسهيل البحث (مثال: CV_Bassem_Ramadan_Software_Engineer.pdf)." 
                  : "Rename file exactly like: CV_YourName_JobTitle.pdf to simplify parsing and tracking."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
              <span>
                <strong>{isAr ? "احترم التوقيت المثالي لمراجعة الرسائل الصباحية:" : "Respect timings to capture best attention:"}</strong>{" "}
                {isAr 
                  ? "أفضل توقيت هو بين التاسعة والعاشرة صباحاً في أيام العمل الرسمية لضمان قراءة رسالتك في واجهة اليوم." 
                  : "Aim to send messages between 9:00 AM and 10:30 AM in the recruiter's local timezone to stay in fresh morning feeds."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
              <span>
                <strong>{isAr ? "المتابعة الاحترافية اللطيفة بعد ٣ أيام عمل:" : "Polite status follow-up after 3 business days:"}</strong>{" "}
                {isAr 
                  ? "تفقد رد المستلم إذا لم تتلق رداً بعد ٣ أيام عمل برسالة دافئة وموجزة تسأل فيها عن حالة طلبك بشكل مهذب." 
                  : "If they read but didn't write back, a gentle follow-up like 'Hi, hope you are well. Just checking if you had a chance to check my resume' works wonders."}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 px-2 text-start">
          {t.nextStepsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, idx) =>
            step.type === "link" ? (
              <Link
                key={idx}
                to={step.path!}
                className="group p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start"
              >
                <div className="mb-4 p-4 bg-slate-50 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight
                    size={16}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180"
                  />
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </Link>
            ) : (
              <button
                key={idx}
                onClick={step.action}
                className="group p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start"
              >
                <div className="mb-4 p-4 bg-slate-50 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight
                    size={16}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180"
                  />
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
