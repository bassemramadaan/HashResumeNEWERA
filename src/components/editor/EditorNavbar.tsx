import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { AppLang } from "../../hooks/useDirection";

export default function EditorNavbar({
  lang = "ar",
  isSaved = true,
  onBackToHome = () => {},
}: {
  lang?: AppLang;
  isSaved?: boolean;
  onBackToHome?: () => void;
  // allow other props without breaking TS
  [key: string]: any;
}) {
  const isRtl = lang === "ar";

  return (
    <div className="w-full z-[100] pt-4 px-4 sm:px-6 pb-2 bg-transparent pointer-events-none flex justify-center transform-gpu shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="pointer-events-auto bg-white border border-slate-200 shadow-sm rounded-[20px] px-4 md:px-5 h-16 flex items-center justify-between w-full max-w-7xl transition-all relative">
        
        {/* Left side spacer */}
        <div className="flex-1 hidden md:flex" />

        {/* ── Center group: Floating Logo & Auto-save ── */}
        <div className="flex items-center justify-center select-none transition-all gap-4">
           <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer"
            title="Back to Home"
          >
            <img 
              src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
              alt="HashResume" 
              className="w-full h-full object-contain drop-shadow-sm" 
            />
          </motion.div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 hidden sm:flex">
             <AnimatePresence mode="wait">
               {isSaved ? (
                 <motion.div
                   key="saved"
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="flex items-center gap-1.5 text-emerald-600"
                 >
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <span className="text-[11px] font-bold">
                     {lang === 'ar' ? 'تم الحفظ محلياً' : lang === 'fr' ? 'Sauvegardé' : 'Saved locally'}
                   </span>
                 </motion.div>
               ) : (
                 <motion.div
                   key="saving"
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="flex items-center gap-1.5 text-slate-500"
                 >
                   <Loader2 className="w-3.5 h-3.5 animate-spin" />
                   <span className="text-[11px] font-bold">
                     {lang === 'ar' ? 'جاري الحفظ...' : lang === 'fr' ? 'Enregistrement...' : 'Saving...'}
                   </span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
        
        {/* Right side spacer */}
        <div className="flex-1 hidden md:flex" />
      </nav>
    </div>
  );
}
