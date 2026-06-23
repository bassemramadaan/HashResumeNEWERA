import { motion } from "motion/react";
import type { AppLang } from "../../hooks/useDirection";

export default function EditorNavbar({
  lang = "ar",
  onBackToHome = () => {},
}: {
  lang?: AppLang;
  onBackToHome?: () => void;
}) {
  const isRtl = lang === "ar";

  return (
    <div className="w-full z-[100] pt-4 px-4 sm:px-6 pb-2 bg-transparent pointer-events-none flex justify-center transform-gpu shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="pointer-events-auto bg-white/40 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl px-4 md:px-5 h-16 flex items-center justify-center w-full max-w-7xl transition-all relative">
        
        {/* ── Center group: Floating Logo ONLY ── */}
        <div className="flex items-center justify-center select-none transition-all">
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
        </div>

      </nav>
    </div>
  );
}
