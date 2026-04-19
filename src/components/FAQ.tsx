import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export default function FAQ() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? [] : [index],
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

  return (
    <section id="faq" className="py-12 bg-slate-50">
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
                className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-6 py-4 text-start flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-[#ff4d2d]" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-500" size={20} />
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

        <div className="mt-16 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 border border-slate-700 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 end-0 w-64 h-64 bg-[#ff4d2d] rounded-full mix-blend-screen filter blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 start-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-slate-200/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === "ar" ? "جاهز للبدء؟" : "Ready to start?"}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 font-display tracking-tight leading-tight max-w-2xl">
              {t.faqCTA}
            </h3>
            <Link
              to="/templates"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white rounded-full font-bold text-lg hover:from-[#e63e1d] hover:to-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/30 ring-4 ring-orange-500/20"
            >
              {t.faqCTAButton}
              <ArrowRight size={24} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
