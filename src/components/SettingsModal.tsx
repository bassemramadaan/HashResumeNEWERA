import React from "react";
import { X, Eye, Sparkles } from "lucide-react";
import SettingsForm from "./editor/SettingsForm";
import ResumePreview from "./preview/ResumePreview";
import { useLanguageStore } from "../store/useLanguageStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-slate-50/95 backdrop-blur-md rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.22)] w-full max-w-6xl h-[85vh] max-h-[85vh] overflow-hidden flex flex-col border border-slate-200/60 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-slate-150 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-600 shadow-3xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 font-sans tracking-tight">
                {isRtl ? "معرض القوالب الاحترافية وتخصيص المظهر" : "Professional Template & Theme Station"}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {isRtl ? "اختر قالباً واضبط الأبعاد لرفع التقييم" : "Configure themes & fonts for optimal recruiter ranking"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Split View Container */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200" style={{ direction: isRtl ? "rtl" : "ltr" }}>
          
          {/* LEFT HALF: Highly Interactive live miniature CV viewport */}
          <div className={`hidden lg:flex w-[42%] bg-slate-100/50 flex-col items-center justify-center p-6 shrink-0 relative overflow-hidden select-none select-none border-b lg:border-b-0 ${isRtl ? "order-2" : "order-1"}`}>
            
            {/* Glossy top guide tag */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-white/70 backdrop-blur-sm px-4 py-2 border border-slate-200/40 rounded-xl shadow-3xs z-30">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-650 tracking-wide">
                <Eye className="w-3.5 h-3.5 text-brand-500" />
                {isRtl ? "معاينة حية ومباشرة لتنسيقك الحالي" : "LIVE COMPANION VIEWPORT"}
              </span>
              <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                {isRtl ? "تزامن فوري" : "SYNCHRONIZED"}
              </span>
            </div>

            {/* The scaled down live preview container */}
            <div className="w-full h-full flex items-center justify-center pt-8 overflow-hidden select-none">
              <div className="scale-[0.41] md:scale-[0.44] lg:scale-[0.47] xl:scale-[0.52] origin-center h-full flex items-center justify-center rounded-lg shadow-xl shrink-0 transition-transform duration-300 pointer-events-none hover:scale-[0.56]">
                <div className="bg-white p-4 overflow-hidden rounded-xl leading-normal border border-slate-200">
                  <ResumePreview />
                </div>
              </div>
            </div>

            {/* Ambient colorful underlying glow */}
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl z-10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl z-10 pointer-events-none" />
          </div>

          {/* RIGHT HALF: Complete layout customization and selection options */}
          <div className={`flex-1 h-full overflow-y-auto p-4 md:p-6 bg-white shrink-0 ${isRtl ? "order-1 border-l-0 border-r border-slate-200" : "order-2"}`}>
            <SettingsForm />
          </div>

        </div>

      </div>
    </div>
  );
}
