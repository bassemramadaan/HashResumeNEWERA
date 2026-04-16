import { motion } from "framer-motion";
import { FileText, Sparkles, Download } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export default function SimpleSteps() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const steps = [
    {
      icon: FileText,
      title: t.simpleStep1Title,
      desc: t.simpleStep1Desc,
      color: "text-blue-500",
      bg: "bg-blue-50 ",
      border: "border-blue-200 ",
    },
    {
      icon: Sparkles,
      title: t.simpleStep2Title,
      desc: t.simpleStep2Desc,
      color: "text-purple-500",
      bg: "bg-purple-50 ",
      border: "border-purple-200 ",
    },
    {
      icon: Download,
      title: t.simpleStep3Title,
      desc: t.simpleStep3Desc,
      color: "text-emerald-500",
      bg: "bg-emerald-50 ",
      border: "border-emerald-200 ",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 font-display">
            {t.howItWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 start-[15%] end-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div
                className={`w-24 h-24 rounded-full ${step.bg} ${step.border} border-2 flex items-center justify-center mb-6 shadow-sm relative`}
              >
                <div className="absolute -top-3 -end-3 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                <step.icon size={40} className={step.color} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 max-w-[250px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
