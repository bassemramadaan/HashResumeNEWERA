import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    question: "Is my data safe?",
    answer: "Yes, absolutely. Hash Resume runs entirely in your browser. Your personal data is stored locally on your device and is never sent to our servers. We prioritize your privacy above all else."
  },
  {
    question: "Is it really free?",
    answer: "Yes! You can build, edit, and download your resume for free. We believe everyone deserves a professional resume without barriers."
  },
  {
    question: "What is an ATS-friendly resume?",
    answer: "ATS (Applicant Tracking System) software is used by recruiters to filter resumes. Our templates are designed with clean formatting and standard sections to ensure these systems can easily read and rank your application."
  },
  {
    question: "Can I create a cover letter too?",
    answer: "Yes! We have a dedicated Cover Letter Builder that helps you craft professional cover letters tailored to your job applications."
  },
  {
    question: "How do I save my resume?",
    answer: "Your resume is automatically saved to your browser's local storage in real-time. You can close the tab and come back later to continue editing. You can also export it as a PDF at any time. We recommend exporting your resume regularly to keep a backup."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-[#f16529]" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400 dark:text-slate-500" size={20} />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
