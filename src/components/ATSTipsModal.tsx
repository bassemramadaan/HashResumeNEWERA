import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

interface ATSTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tips: string[];
}

export default function ATSTipsModal({ isOpen, onClose, tips }: ATSTipsModalProps) {
  const { language } = useLanguageStore();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            dir={language === "ar" ? "rtl" : "ltr"}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-slate-200 text-start"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {language === "ar" ? "كيف ترفع نتيجتك؟" : "How to improve score?"}
              </h3>
              <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {tips.length > 0 ? (
                tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 text-[10px] font-black">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{tip}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">{language === "ar" ? "سيرتك ممتازة! لا توجد ملاحظات حالياً." : "Excellent resume! No tips currently."}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              {language === "ar" ? "فهمت" : "Got it"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
