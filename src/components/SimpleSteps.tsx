import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Download } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

const StepOneGraphics = () => (
  <div className="relative w-full h-40 flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-100/60 overflow-hidden mix-blend-multiply group-hover:bg-slate-100/50 transition-all duration-500">
    <div className="relative flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white border border-slate-200/60 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:shadow-md">
      <FileText className="w-8 h-8 text-slate-800" strokeWidth={1.5} />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-200/50 rounded-full blur-md" />
    </div>
  </div>
);

const StepTwoGraphics = () => (
  <div className="relative w-full h-40 flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-100/60 overflow-hidden mix-blend-multiply group-hover:bg-brand-50/40 transition-all duration-500">
    <div className="relative flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-slate-900 border border-slate-800 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg">
      <Sparkles className="w-8 h-8 text-white animate-pulse" strokeWidth={1.5} />
      <div className="absolute -inset-2 bg-brand-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  </div>
);

const StepThreeGraphics = () => (
  <div className="relative w-full h-40 flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-100/60 overflow-hidden mix-blend-multiply group-hover:bg-orange-50/30 transition-all duration-500">
    <div className="relative flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white border border-slate-200/60 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-md">
      <Download className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
    </div>
  </div>
);

export default function SimpleSteps() {
  const { language } = useLanguageStore();
  const t = translations[language]?.landing ?? {};

  const steps = [
    {
      icon: FileText,
      num: "1",
      title: t.simpleStep1Title || (language === "ar" ? "املأ بياناتك" : "Fill Details"),
      desc: t.simpleStep1Desc || (language === "ar" ? "أدخل مهاراتك وخبراتك بسهولة في واجهة مرنة." : "Enter your experience and skills in a smooth dashboard."),
      graphics: <StepOneGraphics />,
    },
    {
      icon: Sparkles,
      num: "2",
      title: t.simpleStep2Title || (language === "ar" ? "اضف لمسة الذكاء الاصطناعي" : "Optimize with AI"),
      desc: t.simpleStep2Desc || (language === "ar" ? "بنقرة واحدة ارفع من جودة الصياغة لتبهر مسؤولي التوظيف." : "Rephrase sections using Gemini AI to sound highly professional."),
      graphics: <StepTwoGraphics />,
    },
    {
      icon: Download,
      num: "3",
      title: t.simpleStep3Title || (language === "ar" ? "تنزيل فوري" : "Instant Export"),
      desc: t.simpleStep3Desc || (language === "ar" ? "حمّل سيرتك الذاتية بصيغة PDF أنيقة جاهزة لتجاوز الـ ATS." : "Get an ATS-friendly, outstanding PDF format ready for jobs."),
      graphics: <StepThreeGraphics />,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-xs font-bold text-slate-800 tracking-tight uppercase mb-6">
            <span>{language === "ar" ? "كيف يعمل" : "How it works"}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-sans leading-[1.15]">
            {t.howItWorksTitle || (language === "ar" ? "أسهل طريقة لإنشاء سيرة ذاتية احترافية" : "Smarter Ways to Build")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group flex flex-col justify-between relative"
            >
              <div className="mb-8 relative">
                {step.graphics}
              </div>

              <div className="space-y-3 text-start relative">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors duration-300">
                    {step.num}
                  </span>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-[15px] leading-relaxed font-medium pl-2 border-l-2 border-slate-100 group-hover:border-orange-500/30 transition-colors">
                  {step.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
