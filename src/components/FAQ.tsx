import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export default function FAQ({ isFAQPage = false }: { isFAQPage?: boolean }) {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqs = [
    { question: t.faq1Q, answer: t.faq1A },
    { question: t.faq2Q, answer: t.faq2A },
    { question: t.faq9Q, answer: t.faq9A },
    { question: t.faq3Q, answer: t.faq3A },
    { question: t.faq8Q, answer: t.faq8A },
    { question: t.faq4Q, answer: t.faq4A },
    { question: t.faq7Q, answer: t.faq7A },
    { question: t.faq5Q, answer: t.faq5A },
    { question: t.faq6Q, answer: t.faq6A },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white relative">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-xs font-bold text-slate-800 tracking-tight uppercase mb-6">
            <span>{language === "ar" ? "الأسئلة الشائعة" : "FAQ"}</span>
          </div>
          {isFAQPage ? (
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display tracking-tight leading-[1.15]">
              {t.faqsTitle}
            </h1>
          ) : (
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display tracking-tight leading-[1.15]">
              {t.faqsTitle}
            </h2>
          )}
          <p className="text-lg text-slate-500 font-medium">{t.faqsSubtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:border-slate-300 transition-colors shadow-sm"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-start flex justify-between items-center gap-4 bg-white transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-[14px] sm:text-base leading-tight">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                    {isOpen ? (
                      <ChevronUp size={16} strokeWidth={3} />
                    ) : (
                      <ChevronDown size={16} strokeWidth={3} />
                    )}
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 text-slate-600 text-[14px] sm:text-[15px] leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
