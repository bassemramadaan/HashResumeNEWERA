import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

// Step 1: Human-crafted input form layout
const StepOneGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
    <div className="absolute inset-x-0 bottom-0 top-1/3 bg-linear-to-t from-white to-transparent" />
    <motion.div 
      initial={{ y: 5 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      className="w-48 bg-white border border-slate-200/85 rounded-xl p-3 shadow-sm flex flex-col gap-2 relative z-10"
    >
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <div className="h-2 bg-slate-100 rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-100 rounded-full w-12" />
          <div className="h-6 bg-slate-50 border border-slate-100 rounded-md w-full flex items-center px-1.5 justify-between">
            <span className="text-[9px] font-bold text-slate-400">Software En...</span>
            <span className="w-1 h-3.5 bg-[#FF4D2D] rounded-full animate-pulse" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-100 rounded-full w-16" />
          <div className="h-4 bg-slate-50 border border-slate-100/60 rounded-md w-11/12" />
        </div>
      </div>
    </motion.div>
  </div>
);

// Step 2: Live AI transformation before/after
const StepTwoGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
    <div className="absolute inset-0 bg-radial from-[#FF4D2D]/5 to-transparent opacity-60" />
    <div className="flex flex-col gap-2 w-48 relative z-10">
      {/* Before */}
      <motion.div 
        initial={{ opacity: 0.6, scale: 0.95 }}
        whileInView={{ opacity: 0.8, scale: 0.98 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-150 rounded-lg p-2 shadow-2xs text-[9px] font-semibold text-slate-400 line-through"
      >
        I am a developer who codes apps.
      </motion.div>
      {/* After */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-[#FF4D2D]/20 rounded-lg p-2 shadow-3xs text-[10px] font-bold text-slate-850 flex items-start gap-1 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1 h-full bg-[#FF4D2D]" />
        <Sparkles size={11} className="text-[#FF4D2D] shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="text-[#FF4D2D] font-black">AI: </span>
          <span>Crafting premium and highly scalable full-stack applications.</span>
        </div>
      </motion.div>
    </div>
  </div>
);

// Step 3: Beautiful polished export
const StepThreeGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent" />
    <motion.div 
      initial={{ y: 20, rotate: -4 }}
      whileInView={{ y: 8, rotate: -1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 80 }}
      className="w-36 bg-white border border-slate-200/80 rounded-t-xl p-3 shadow-md flex flex-col gap-2 relative z-10"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <span className="text-[10px] font-black text-rose-500 font-mono tracking-tight">PDF</span>
        <div className="w-5 h-5 rounded bg-[#FF4D2D]/5 flex items-center justify-center">
          <Download size={10} className="text-[#FF4D2D]" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 bg-[#FF4D2D]/10 rounded-full w-2/3" />
        <div className="h-1 bg-slate-150 rounded-full w-full" />
        <div className="h-1 bg-slate-150 rounded-full w-full" />
        <div className="h-1 bg-slate-150 rounded-full w-4/5" />
      </div>
    </motion.div>
    <div className="absolute inset-x-0 bottom-0 h-4 bg-slate-50 border-t border-slate-150 z-20" />
  </div>
);

export default function SimpleSteps() {
  const { language } = useLanguageStore();
  const t = translations[language]?.landing ?? {};

  const steps = [
    {
      icon: FileText,
      num: "01",
      title: t.simpleStep1Title || (language === "ar" ? "املأ بياناتك" : "Fill Details"),
      desc: t.simpleStep1Desc || (language === "ar" ? "أدخل مهاراتك وخبراتك بسهولة في واجهة مرنة." : "Enter your experience and skills in a smooth dashboard."),
      graphics: <StepOneGraphics />,
    },
    {
      icon: Sparkles,
      num: "02",
      title: t.simpleStep2Title || (language === "ar" ? "حسّن سيرتك بالذكاء الاصطناعي" : "Optimize with AI"),
      desc: t.simpleStep2Desc || (language === "ar" ? "بنقرة واحدة ارفع من جودة الصياغة لتبهر مسؤولي التوظيف." : "Rephrase sections using Gemini AI to sound highly professional."),
      graphics: <StepTwoGraphics />,
    },
    {
      icon: Download,
      num: "03",
      title: t.simpleStep3Title || (language === "ar" ? "تنزيل فوري" : "Instant Export"),
      desc: t.simpleStep3Desc || (language === "ar" ? "حمّل سيرتك الذاتية بصيغة PDF أنيقة جاهزة لتجاوز الـ ATS." : "Get an ATS-friendly, outstanding PDF format ready for jobs."),
      graphics: <StepThreeGraphics />,
    },
  ];

  const isRtl = language === "ar";

  return (
    <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden select-none">
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 text-[#FF4D2D] text-[10px] font-black uppercase tracking-widest mb-3.5">
            <span>{language === "ar" ? "كيف يعمل صانع السيرة الذاتية" : "How it works"}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-sans">
            {t.howItWorksTitle || (language === "ar" ? "خطوات ذكية وبسيطة للغاية" : "Smarter Ways to Build")}
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm mt-3 leading-relaxed font-medium">
            {language === "ar" 
              ? "خطوات بسيطة وسريعة جداً لصياغة مظهرك المهني وتجاوز أنظمة التوظيف." 
              : "A polished workflow designed to prepare and export an outstanding ATS-ready resume in seconds."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative">
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-white border border-slate-150 rounded-3xl p-6 shadow-3xs hover:shadow-sm hover:border-slate-250 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card graphics background */}
              <div className="mb-6 relative">
                {step.graphics}
                
                {/* Floating micro number badge */}
                <div className="absolute -top-3.5 -end-3.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-white text-white font-mono flex items-center justify-center text-xs font-black shadow-sm">
                  {step.num}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2 text-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF4D2D]/5 flex items-center justify-center shrink-0 border border-[#FF4D2D]/10 group-hover:scale-110 transition-transform">
                    <step.icon size={14} className="text-[#FF4D2D]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium pl-0.5">
                  {step.desc}
                </p>
              </div>

              {/* Connecting elements inside grid layout for desktop */}
              {index < 2 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                  {isRtl ? (
                    <ArrowLeft size={16} className="text-[#FF4D2D]/20" />
                  ) : (
                    <ArrowRight size={16} className="text-[#FF4D2D]/20" />
                  )}
                </div>
              )}
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
