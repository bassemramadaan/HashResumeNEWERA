import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export default function FAQ() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqs = [
    { question: t.faq1Q, answer: t.faq1A },
    { question: t.faq2Q, answer: t.faq2A },
    { question: t.faq3Q, answer: t.faq3A },
    { question: t.faq4Q, answer: t.faq4A },
    { question: t.faq5Q, answer: t.faq5A },
    { question: t.faq6Q, answer: t.faq6A },
  ];

  return (
    <section id="faq" className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
            {t.faqsTitle}
          </h2>
          <p className="text-lg text-slate-600">{t.faqsSubtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-6 py-4 text-start flex justify-between items-center hover:bg-slate-50 :bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-[#ff4d2d]" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-slate-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t.faqCTA}</h3>
          <p className="text-slate-600 mb-6">{t.faqsSubtitle}</p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff4d2d] text-white rounded-2xl font-bold hover:bg-[#e63e1d] transition-all shadow-lg shadow-orange-500/20"
          >
            {t.faqCTAButton}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
