import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

// Step 1: Human-crafted input form layout
const StepOneGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group-hover:bg-orange-50/20 transition-all duration-300">
    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4D2D]/10 to-[#FF8C6B]/10 border border-[#FF4D2D]/20 shadow-xs">
      <FileText className="w-8 h-8 text-[#FF4D2D]" strokeWidth={1.5} />
    </div>
  </div>
);

// Step 2: Live AI transformation before/after
const StepTwoGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group-hover:bg-amber-50/20 transition-all duration-300">
    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-400/10 border border-amber-500/20 shadow-xs">
      <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" strokeWidth={1.5} />
    </div>
  </div>
);

// Step 3: Beautiful polished export
const StepThreeGraphics = () => (
  <div className="relative w-full h-32 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group-hover:bg-emerald-50/20 transition-all duration-300">
    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 shadow-xs">
      <Download className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
    </div>
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
    <section className="py-16 sm:py-20 bg-white border-y border-slate-100 relative overflow-hidden select-none">
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
