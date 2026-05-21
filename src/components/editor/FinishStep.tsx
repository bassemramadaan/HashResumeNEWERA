import { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  ArrowRight,
  Target,
  PenTool,
  Search,
  MessageCircle,
  Share2,
  Download,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

interface FinishStepProps {
  onPrint?: () => void;
  onExportWord?: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({
  onPrint,
  onExportWord,
  onJumpToStep,
}: FinishStepProps) {
  const { data } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].landing.finish;
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [userPhone, setUserPhone] = useState(data.personalInfo.phone || "");

  const isAr = language === "ar";

  const getWhatsAppMessage = () => {
    const fullName = data.personalInfo.fullName || (isAr ? "فلان الفلاني" : "User");
    const jobTitle = data.personalInfo.jobTitle || (isAr ? "مطور برمجيات" : "Professional");
    const phone = data.personalInfo.phone || "";
    const email = data.personalInfo.email || "";

    const expText = data.experience && data.experience.length > 0
      ? data.experience.map(e => `• ${e.position} - ${e.company}`).join("\n")
      : "";

    if (isAr) {
      return `*📝 نسخة من بيانات سيرتي الذاتية كـ (${jobTitle})*

مرحباً، إليك ملف سيرتي المحدث والجاهز للتقديم والمشاركة:

*👤 الاسم الكريم:* ${fullName}
*💼 المسمى الوظيفي المستهدف:* ${jobTitle}

${expText ? `*💼 من آخر الخبرات المهنية:*\n${expText}\n` : ""}
*📞 للتواصل السريع والمباشر:*
• الهاتف: ${phone}
• البريد الإلكتروني: ${email}
• رابط السيرة الذاتية: ${window.location.href}

_تم الإنشاء بنجاح وبأعلى معايير التوافق والذكاء الاصطناعي_`;
    } else {
      return `*📝 My Professional Resume Details: (${jobTitle})*

Hello, here is my updated resume details card for quick access and instant sharing:

*👤 Name:* ${fullName}
*💼 Target Career Title:* ${jobTitle}

${expText ? `*💼 Recent Experience Highlight:*\n${expText}\n` : ""}
*📞 Quick Contact Links:*
• Mobile/Phone: ${phone}
• Email: ${email}
• Edit/View Live Link: ${window.location.href}

_Designed and optimized with professional ATS-compatible structure_`;
    }
  };

  const handleSendWhatsApp = () => {
    // Basic formatting: remove spaces / non-numbers, prepare wa.me link
    const cleanPhone = userPhone.replace(/[^\d]/g, "");
    const message = encodeURIComponent(getWhatsAppMessage());

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
    setShowWhatsAppModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handlePdfDownloadClick = () => {
    if (onPrint) {
      onPrint();
    }
    // After download starts, show the WhatsApp popup helper after 1.5 seconds so it feels natural!
    setTimeout(() => {
      setShowWhatsAppModal(true);
    }, 1500);
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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-4xl mx-auto relative">
      
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

      {/* Unified Download & Share Dashboard Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.03)] text-start relative overflow-hidden group">
        <div className="absolute top-0 end-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full -me-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-slate-100 rtl:divide-x-reverse">
          {/* Left Block: Traditional Downloads */}
          <div className="space-y-5 pb-6 md:pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {isAr ? "تحميل وحفظ السيرة الذاتية" : "Download & Local Save"}
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {isAr 
                ? "احصل على نسختك الجاهزة للتقديم الآن. ننصح بصيغة الـ PDF للحفاظ على التصميم والخطوط المنسقة لتجاوز مرشحات التوظيف."
                : "Get your finished resume immediately. We highly recommend exporting in PDF format to maintain formatting, styling, and ATS parsing readiness."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handlePdfDownloadClick}
                className="flex items-center justify-center gap-2 h-13 px-5 text-white bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] active:scale-95 transition-all rounded-2xl text-xs font-black shadow-md cursor-pointer select-none"
              >
                <Download size={16} />
                <span>{t.exportPdf || (isAr ? "تحميل ملف PDF" : "Download PDF")}</span>
              </button>

              <button
                onClick={onExportWord}
                className="flex items-center justify-center gap-2 h-13 px-5 border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all rounded-2xl text-xs font-bold text-slate-800 shadow-sm cursor-pointer select-none"
              >
                <FileText size={16} className="text-blue-500" />
                <span>{isAr ? "تصدير بصيغة Word" : "Export to Word"}</span>
              </button>
            </div>
          </div>

          {/* Right Block: Instant Share with WhatsApp & Email options */}
          <div className="space-y-5 pt-6 md:pt-0 md:ps-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {isAr ? "إرسال السيرة الذاتية لنفسك" : "Send Resume To Yourself"}
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {isAr
                ? "أرسل تفاصيل وبيانات السيرة مباشرة ومجاناً لدردشة الواتساب لتكون محفوظة في هاتفك دائماً وجاهزة للمشاركة والإرسال العاجل."
                : "Send a perfectly structured copy of your resume data and quick link directly to your WhatsApp. Perfectly saved on your phone for easy access!"}
            </p>

            <div className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value.replace(/[^\d+]/g, ""))}
                  placeholder={isAr ? "رقم الواتساب الخاص بك: مثلاً 01011112222" : "Your WhatsApp number: e.g. +201011112222"}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none rounded-2xl px-4 py-3.5 text-xs font-black transition-all placeholder:text-slate-400"
                />
                <button
                  onClick={handleSendWhatsApp}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 h-10 px-4 text-white bg-[#128C7E] hover:bg-[#0e7065] active:scale-95 transition-all rounded-xl text-[11px] font-black cursor-pointer shadow-3xs"
                >
                  <MessageCircle size={14} />
                  <span>{isAr ? "إرسال" : "Send"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  {isAr 
                    ? "يتيح لك هذا الخيار إرسال تفاصيل السيرة المنسقة بوضوح لدردشتك الخاصة بسهولة." 
                    : "This creates a beautiful text package and opens a chat window directly on your device."}
                </p>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 border border-slate-200/60 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-3xs"
                >
                  <Share2 size={12} className="text-slate-500" />
                  <span>{copiedLink ? (isAr ? "تم نسخ الرابط!" : "Link Copied!") : (isAr ? "نسخ رابط السيرة" : "Copy Live Link")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stunning Interactive WhatsApp Prompt Modal (Shows after PDF Export) */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative text-start transition-colors"
            >
              {/* Green Header */}
              <div className="bg-[#075E54] p-6 text-white relative">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/15 hover:bg-black/25 text-white/95 rounded-full transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                    <MessageCircle className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight select-none">
                      {isAr ? "📥 بدأ تحميل سيرة PDF بنجاح!" : "📥 PDF Download Started!"}
                    </h3>
                    <p className="text-xs text-slate-200 font-bold mt-0.5 opacity-90 select-none">
                      {isAr ? "هل تود الاحتفاظ بنسخة ومشاركتها في الواتس اب؟" : "Want to save a handy copy to your WhatsApp?"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {isAr 
                    ? "لحفظ السيرة على هاتفك ومنع فقدانها بالكامل، أرسل نسخة منسقة ببيانات العمل وموقعك الإلكتروني لدردشة الواتساب لتكون دائماً جاهزة للمدراء!"
                    : "Make sure you never lose your data. Send a summary and direct access links directly to your personal WhatsApp chat so they remain right at your fingertips."}
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value.replace(/[^\d+]/g, ""))}
                    placeholder={isAr ? "رقم الواتساب: مثلاً 01011112222" : "e.g. +201011112222"}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none rounded-2xl px-4 py-3.5 text-xs font-black transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowWhatsAppModal(false)}
                    className="h-12 border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all rounded-2xl text-xs font-bold text-slate-700 cursor-pointer text-center"
                  >
                    {isAr ? "إغلاق نافذة" : "Close Window"}
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="flex items-center justify-center gap-1.5 h-12 text-white bg-[#128C7E] hover:bg-[#0e7065] active:scale-95 transition-all rounded-2xl text-xs font-black cursor-pointer shadow-sm"
                  >
                    <MessageCircle size={15} />
                    <span>{isAr ? "إرسال الآن" : "Send Now"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                className="group p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start cursor-pointer w-full"
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
