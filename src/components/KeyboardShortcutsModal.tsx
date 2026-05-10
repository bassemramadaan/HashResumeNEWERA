import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  
  const shortcuts = [
    { key: ['Ctrl', 'Z'], desc: isAr ? "تراجع" : "Undo" },
    { key: ['Ctrl', 'Shift', 'Z'], desc: isAr ? "إعادة" : "Redo" },
    { key: ['Ctrl', 'S'], desc: isAr ? "حفظ كمسودة" : "Save as Draft" },
    { key: ['Esc'], desc: isAr ? "إغلاق النوافذ" : "Close Modals" },
    { key: ['Enter'], desc: isAr ? "تأكيد" : "Confirm" },
  ];

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
            dir={isAr ? "rtl" : "ltr"}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <Keyboard size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isAr ? "اختصارات الكيبورد" : "Keyboard Shortcuts"}
                </h3>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.key.map((k, ki) => (
                      <kbd key={ki} className="px-2 py-1 bg-slate-100 border-b-2 border-slate-300 rounded text-[10px] font-black text-slate-700 min-w-[24px] text-center">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              {isAr ? "حسناً" : "Got it"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
