import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Download } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

const EditorMockup = () => (
  <div className="w-full h-40 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden flex flex-col">
    <div className="h-8 border-b border-slate-100 bg-slate-50 flex items-center px-3 gap-1.5">
       <div className="w-2 h-2 rounded-full bg-rose-300"></div>
       <div className="w-2 h-2 rounded-full bg-amber-300"></div>
       <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-3">
       <div className="flex gap-3 items-center">
           <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0"></div>
           <div className="flex-1 space-y-2 py-1">
             <motion.div 
               initial={{ width: "20%" }} 
               whileInView={{ width: "60%" }} 
               transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }} 
               className="h-2 bg-slate-200 rounded-full" 
             />
             <motion.div 
               initial={{ width: "40%" }} 
               whileInView={{ width: "80%" }} 
               transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "reverse" }} 
               className="h-2 bg-slate-100 rounded-full" 
             />
           </div>
       </div>
       <div className="space-y-2 mt-3">
         <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
         <div className="h-1.5 bg-slate-100 rounded-full w-5/6"></div>
         <div className="h-1.5 bg-slate-100 rounded-full w-4/6"></div>
       </div>
    </div>
  </div>
);

const AIMockup = () => (
  <div className="w-full h-40 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden relative flex items-center justify-center p-4">
     <div className="w-full space-y-4">
        <div className="h-2 bg-slate-100 rounded-full w-full"></div>
        <motion.div 
          initial={{ backgroundColor: "#f1f5f9" }}
          whileInView={{ backgroundColor: "#f3e8ff", scale: 1.02 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="h-3 rounded-xl w-5/6 relative py-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
            className="absolute -top-5 -right-3 text-purple-600 bg-white rounded-full p-1 shadow-sm border border-purple-100"
          >
             <Sparkles size={14} className="fill-purple-100" />
          </motion.div>
        </motion.div>
        <div className="h-2 bg-slate-100 rounded-full w-4/6"></div>
     </div>
  </div>
);

const DownloadMockup = () => (
  <div className="w-full h-40 bg-emerald-50/50 border border-emerald-100 rounded-xl overflow-hidden relative flex flex-col items-center justify-center gap-4">
     <motion.div 
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
        className="w-16 h-20 bg-white shadow-md border border-slate-200 rounded-sm flex flex-col p-2 top-4 relative"
     >
        <div className="h-1.5 bg-emerald-500 rounded-full w-1/2 mb-3"></div>
        <div className="space-y-1.5">
          <div className="h-1 bg-slate-200 rounded-full w-full"></div>
          <div className="h-1 bg-slate-200 rounded-full w-5/6"></div>
          <div className="h-1 bg-slate-200 rounded-full w-4/6"></div>
        </div>
     </motion.div>
  </div>
);

export default function SimpleSteps() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const steps = [
    {
      icon: FileText,
      title: t.simpleStep1Title,
      desc: t.simpleStep1Desc,
      color: "text-brand-500",
      bg: "bg-brand-50 ",
      border: "border-brand-200 ",
      mockup: <EditorMockup />,
    },
    {
      icon: Sparkles,
      title: t.simpleStep2Title,
      desc: t.simpleStep2Desc,
      color: "text-brand-500",
      bg: "bg-brand-50 ",
      border: "border-brand-200 ",
      mockup: <AIMockup />,
    },
    {
      icon: Download,
      title: t.simpleStep3Title,
      desc: t.simpleStep3Desc,
      color: "text-brand-500",
      bg: "bg-brand-50 ",
      border: "border-brand-200 ",
      mockup: <DownloadMockup />,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 font-display">
            {t.howItWorksTitle}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-12 relative justify-center items-center md:items-stretch">
          {/* Connecting Line is removed because we will use arrows instead for clearer direction */}

          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group flex-1"
              >
                <div className="w-full mb-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {step.mockup}
                </div>
                <div
                  className={`w-16 h-16 rounded-[1.5rem] ${step.bg} ${step.border} border border-slate-200/50 flex items-center justify-center mb-6 shadow-xl shadow-slate-200/40 relative overflow-hidden group-hover:-translate-y-1 transition-all`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent" />
                  <div className="absolute -top-2 -end-2 w-7 h-7 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center font-bold text-[10px] shadow-md z-20">
                    {index + 1}
                  </div>
                  <step.icon size={26} className={`${step.color} relative z-10`} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 max-w-[250px] leading-relaxed text-sm">{step.desc}</p>
              </motion.div>

              {/* Directional Arrow between steps (only on Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-brand-300 px-2 lg:px-4 mt-[110px]">
                  {language === 'ar' ? (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                    </svg>
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
                    </svg>
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
