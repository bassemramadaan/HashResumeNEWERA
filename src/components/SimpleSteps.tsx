import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

const StepOneGraphics = () => (
  <div className="relative w-full h-24 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent rounded-2xl" />
    <motion.div 
      initial={{ opacity: 0.8, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="relative w-44 bg-white/85 backdrop-blur-md rounded-xl p-3 border border-slate-150 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-2"
    >
      <div className="flex gap-1.5 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-1.5">
        <motion.div 
          animate={{ width: ["30%", "65%", "30%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 bg-indigo-600/10 rounded-full" 
        />
        <div className="h-1 bg-slate-100 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-5/6" />
      </div>
    </motion.div>
    {/* Floating micro items */}
    <motion.div 
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute right-[15%] bottom-[15%] w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-3xs"
    >
      <FileText size={10} className="text-indigo-600" />
    </motion.div>
  </div>
);

const StepTwoGraphics = () => (
  <div className="relative w-full h-24 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FF4D2D]/5 to-transparent rounded-2xl" />
    <div className="relative w-44 bg-white/85 backdrop-blur-md rounded-xl p-3 border border-slate-150 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-1.5 bg-slate-100 rounded-full w-1/2" />
        <Sparkles size={11} className="text-[#FF4D2D] fill-[#FF4D2D]/10 shrink-0" />
      </div>
      <div className="space-y-1.5 relative">
        <motion.div 
          animate={{ width: ["40%", "85%", "40%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 bg-gradient-to-r from-[#FF4D2D]/20 to-[#FF4D2D]/5 rounded-full relative"
        />
        <div className="h-1 bg-slate-100 rounded-full w-4/5" />
      </div>
    </div>
    {/* Floating sparkle star wrapper */}
    <motion.div 
      animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 15, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-[12%] top-[15%] text-[#FF4D2D] opacity-60"
    >
      <Sparkles size={14} />
    </motion.div>
  </div>
);

const StepThreeGraphics = () => (
  <div className="relative w-full h-24 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/20 to-transparent rounded-2xl" />
    <motion.div 
      animate={{ y: [2, -2, 2] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-44 bg-white/85 backdrop-blur-md rounded-xl p-3 border border-slate-150 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-2 items-center text-center justify-center"
    >
      <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-3xs mb-0.5">
        <Download size={12} className="text-emerald-600" />
      </div>
      <div className="h-1.5 bg-emerald-500/15 rounded-full w-2/3" />
    </motion.div>
    {/* Clean circular radar effect */}
    <div className="absolute w-12 h-12 rounded-full border border-emerald-500/10 animate-ping opacity-35" />
  </div>
);

export default function SimpleSteps() {
  const { language } = useLanguageStore();
  const t = translations[language]?.landing ?? {};

  const steps = [
    {
      icon: FileText,
      title: t.simpleStep1Title || (language === "ar" ? "املأ بياناتك" : "Fill Details"),
      desc: t.simpleStep1Desc || (language === "ar" ? "أدخل مهاراتك وخبراتك بسهولة في واجهة مرنة." : "Enter your experience and skills in a smooth dashboard."),
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      graphics: <StepOneGraphics />,
    },
    {
      icon: Sparkles,
      title: t.simpleStep2Title || (language === "ar" ? "حسّن سيرتك بالذكاء الاصطناعي" : "Optimize with AI"),
      desc: t.simpleStep2Desc || (language === "ar" ? "بنقرة واحدة ارفع من جودة الصياغة لتبهر مسؤولي التوظيف." : "Rephrase sections using Gemini AI to sound highly professional."),
      color: "text-[#FF4D2D] bg-[#FF4D2D]/5 border-[#FF4D2D]/10",
      graphics: <StepTwoGraphics />,
    },
    {
      icon: Download,
      title: t.simpleStep3Title || (language === "ar" ? "تنزيل فوري" : "Instant Export"),
      desc: t.simpleStep3Desc || (language === "ar" ? "حمّل سيرتك الذاتية بصيغة PDF أنيقة جاهزة لتجاوز الـ ATS." : "Get an ATS-friendly, outstanding PDF format ready for jobs."),
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      graphics: <StepThreeGraphics />,
    },
  ];

  const isRtl = language === "ar";

  return (
    <section className="py-20 bg-slate-50/50 border-y border-slate-100 select-none">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
            {t.howItWorksTitle || (language === "ar" ? "كيف يعمل؟" : "How it works?")}
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium leading-relaxed">
            {language === "ar" 
              ? "خطوات بسيطة وسريعة جداً لصياغة مظهرك المهني وتجاوز أنظمة التوظيف." 
              : "A simple and rapid workflow to build beautiful ATS-ready resumes."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-3 lg:gap-8 items-stretch justify-center relative">
          
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              
              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-1 bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex flex-col justify-between group transition-all duration-300 hover:border-indigo-500/20 hover:shadow-2xs"
              >
                {/* Graphics Header */}
                <div className="mb-4">
                  {step.graphics}
                </div>

                {/* Info Text Content */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2.5">
                    {/* Compact Number Badge */}
                    <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight transition-colors group-hover:text-indigo-650">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>

              {/* Seamless connecting arrow between elements */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center shrink-0 text-slate-300 transform self-center z-10 px-1">
                  {isRtl ? (
                    <ArrowLeft size={16} className="text-indigo-500/40" />
                  ) : (
                    <ArrowRight size={16} className="text-indigo-500/40" />
                  )}
                </div>
              )}

            </React.Fragment>
          ))}

        </div>
      </div>
    </section>
  );
}
