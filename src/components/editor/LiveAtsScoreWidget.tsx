import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Info, Star } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { calculateATSScore } from '../../utils/ats';
import { useResumeStore } from '../../store/useResumeStore';

export default function LiveAtsScoreWidget() {
  const data = useResumeStore(state => state.data);
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const { score, sections } = React.useMemo(() => {
    try {
      return calculateATSScore(data);
    } catch {
      return { score: 0, sections: [], tips: [], criticalFailures: [] };
    }
  }, [data]);

  const isRtl = language === 'ar';
  
  // Categorize tips
  const requiredTips: string[] = [];
  const recommendedTips: string[] = [];
  const niceToHaveTips: string[] = [];

  sections?.forEach((section) => {
    if (section.title === "Job Match") {
       niceToHaveTips.push(...section.improvements);
    } else if (section.score < section.maxScore * 0.4) {
       requiredTips.push(...section.improvements);
    } else if (section.improvements.length > 0) {
       recommendedTips.push(...section.improvements);
    }
  });

  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const progressBg = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  if (!data.personalInfo.fullName && !data.experience.length) return null; // Don't show if empty

  return (
    <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 hidden md:block`} dir={isRtl ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute bottom-full mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[60vh] ${isRtl ? 'left-0' : 'right-0'}`}
          >
            <div className="bg-slate-900 text-white p-5 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">
                  {language === 'ar' ? 'مؤشر اكتمال السيرة الذاتية' : 'Resume Completion Tracker'}
                </h3>
                <span className={`text-xs font-black px-2 py-1 rounded-lg bg-white/10 ${scoreColor}`}>
                  {score}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${progressBg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-slate-300 mt-2 font-medium">
                {language === 'ar' 
                  ? 'يعتمد التقييم على جودة واكتمال الحقول الأساسية' 
                  : 'Score is based on quality and completion of essential fields'}
              </p>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6 bg-slate-50/50 flex-1">
              {requiredTips.length === 0 && recommendedTips.length === 0 && niceToHaveTips.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-2 text-emerald-600 py-6">
                  <CheckCircle2 size={32} />
                  <span className="font-bold text-sm">
                    {language === 'ar' ? 'سيرتك الذاتية ممتازة ومكتملة!' : 'Your resume is excellent and complete!'}
                  </span>
                </div>
              ) : (
                <>
                  {requiredTips.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        {language === 'ar' ? 'تعديلات ضرورية' : 'Required Fixes'}
                      </h4>
                      <ul className="space-y-2">
                        {requiredTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium leading-relaxed bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendedTips.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                        <Info size={12} />
                        {language === 'ar' ? 'تحسينات موصى بها' : 'Recommended'}
                      </h4>
                      <ul className="space-y-2">
                        {recommendedTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium leading-relaxed bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {niceToHaveTips.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-500 flex items-center gap-1.5">
                        <Star size={12} />
                        {language === 'ar' ? 'لمسات إضافية' : 'Nice to Have'}
                      </h4>
                      <ul className="space-y-2">
                        {niceToHaveTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium leading-relaxed bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
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
              strokeDashoffset={125.6 - (125.6 * score) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="22"
              cy="22"
              animate={{ strokeDashoffset: 125.6 - (125.6 * score) / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${scoreColor}`}>
            {score}%
          </div>
        </div>
        <div className="pr-2 flex items-center gap-2 text-start">
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-slate-900">
              {language === 'ar' ? 'نسبة الاكتمال' : 'Completion'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {language === 'ar' ? 'اضغط للتفاصيل' : 'Click for details'}
            </span>
          </div>
          {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
        </div>
      </motion.button>
    </div>
  );
}
