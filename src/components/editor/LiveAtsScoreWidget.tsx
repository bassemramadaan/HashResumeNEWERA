import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { calculateATSScore } from '../../utils/ats';
import { useResumeStore } from '../../store/useResumeStore';

export default function LiveAtsScoreWidget() {
  const data = useResumeStore(state => state.data);
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const { score, tips } = React.useMemo(() => {
    try {
      return calculateATSScore(data);
    } catch {
      return { score: 0, criticalFailures: [], tips: [] };
    }
  }, [data]);

  const isRtl = language === 'ar';
  
  // Choose color based on score
  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const strokeDashoffset = 125.6 - (125.6 * score) / 100;

  if (!data.personalInfo.fullName && !data.experience.length) return null; // Don't show if empty

  return (
    <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 hidden md:block`} dir={isRtl ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold text-sm">
                {language === 'ar' ? 'تقييم ATS المباشر' : 'Live ATS Score'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {language === 'ar' ? 'يتم التحديث مع كل حرف تكتبه' : 'Updates with every keystroke'}
              </p>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto">
              {tips.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  {language === 'ar' ? 'سيرتك الذاتية ممتازة!' : 'Your resume looks great!'}
                </div>
              ) : (
                <ul className="space-y-3">
                  {tips.slice(0, 3).map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 p-2 flex items-center gap-3 transition-colors hover:border-slate-300"
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
            <circle
              className="text-slate-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="22"
              cy="22"
            />
            <motion.circle
              className={scoreColor}
              strokeWidth="4"
              strokeDasharray="125.6"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="22"
              cy="22"
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${scoreColor}`}>
            {score}
          </div>
        </div>
        <div className="pr-2 flex items-center gap-2">
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-slate-900">
              {language === 'ar' ? 'فحص ATS' : 'ATS Check'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {language === 'ar' ? 'تحديث لحظي' : 'Live update'}
            </span>
          </div>
          {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
        </div>
      </motion.button>
    </div>
  );
}
