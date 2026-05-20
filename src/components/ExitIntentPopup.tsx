import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageStore } from "../store/useLanguageStore";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => {
    // Check if user already dismissed it forever or for this session
    if (
      localStorage.getItem("hideExitPopup") === "true" ||
      sessionStorage.getItem("hideExitPopupSession") === "true"
    ) {
      return;
    }

    let isReady = false;
    // Wait 15 seconds before enabling the exit intent
    const timer = setTimeout(() => {
      isReady = true;
    }, 15000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (isReady && e.clientY <= 0) {
        setIsVisible(true);
        // Remove listener once shown
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = (neverShowAgain: boolean = false) => {
    setIsVisible(false);
    if (neverShowAgain) {
      localStorage.setItem("hideExitPopup", "true");
    } else {
      sessionStorage.setItem("hideExitPopupSession", "true");
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-50 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {/* Decorative background */}
            <div className="absolute top-0 start-0 w-full h-32 bg-gradient-to-br from-orange-100 to-orange-50 -z-10" />
            <div className="absolute -top-10 -end-10 w-32 h-32 bg-[#ff4d2d]/10 rounded-full blur-2xl -z-10" />

            <button
              onClick={() => handleClose(false)}
              className="absolute top-4 end-4 p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-[#ff4d2d]" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 font-display">
                {language === "ar"
                  ? "لست متأكداً بعد؟ شاهد كيف ستبدو سيرتك أولاً"
                  : language === "fr"
                  ? "Vous hésitez encore ? Voyez à quoi ça ressemble d'abord"
                  : "Still not sure? See how it looks first"}
              </h2>

              <p className="text-slate-600 mb-8 leading-relaxed">
                {language === "ar"
                  ? "قم بتجربة محرّر السير الذاتية التفاعلي المتميز الآن. لا يُطلب منك أي تسجيل ويمكنك التحميل لاحقاً."
                  : language === "fr"
                  ? "Essayez notre éditeur de CV dynamique maintenant. Aucune inscription requise et vous pouvez télécharger plus tard."
                  : "Try our dynamic resume builder now. No sign-up required, and you can download it later."}
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/editor"
                  onClick={() => handleClose(true)}
                  className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                  {language === "ar" ? "ابدأ تصميم سيرتك الذاتية الآن" : language === "fr" ? "Commencer maintenant" : "Start designing now"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                </Link>
                <button
                  onClick={() => handleClose(false)}
                  className="w-full bg-slate-50 text-slate-500 hover:text-slate-700 font-medium py-3 px-6 rounded-2xl transition-colors"
                >
                  {language === "ar" ? "ربما لاحقاً" : language === "fr" ? "Peut-être plus tard" : "Maybe later"}
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="text-xs text-slate-500 hover:text-slate-600 mt-2 underline underline-offset-2"
                >
                  {language === "ar" ? "لا تظهر هذه الرسالة مرة أخرى" : language === "fr" ? "Ne plus afficher ce message" : "Don't show this again"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
