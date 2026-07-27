import React from "react";
import { WifiOff, AlertCircle } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLanguageStore } from "@/store/useLanguageStore";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguageStore();

  if (isOnline) return null;

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="fixed top-4 inset-x-4 sm:inset-x-auto sm:end-6 z-[200] flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-600 text-white backdrop-blur-xl border border-rose-400/50 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 pointer-events-auto"
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
        <WifiOff size={20} className="text-white animate-pulse" />
      </div>
      <div className="text-xs flex-1">
        <div className="flex items-center gap-1.5 font-black text-white text-sm">
          <AlertCircle size={16} className="shrink-0 text-amber-200" />
          <span>{language === "ar" ? "وضع عدم الاتصال مفعل 🔴" : "Offline Mode Active 🔴"}</span>
        </div>
        <p className="text-[11px] text-rose-100 font-semibold mt-0.5 leading-tight">
          {language === "ar"
            ? "انقطع الاتصال بالإنترنت. يتم حفظ جميع بياناتك وسيرتك الذاتية محلياً تلقائياً 💾"
            : "Internet connection lost. All your CV data is automatically saved locally 💾"}
        </p>
      </div>
    </div>
  );
};


