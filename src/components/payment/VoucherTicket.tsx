import React, { useState } from "react";
import { Check, Copy, Sparkles, Clock, CircleDot, RefreshCw, Key } from "lucide-react";

interface VoucherTicketProps {
  language: "ar" | "en" | "fr";
  type: "single" | "bundle";
  code?: string;
  codes?: string[]; // Multiple codes for Bundle activation
  isPending?: boolean;
  pendingRef?: string;
  isApproved?: boolean;
}

export default function VoucherTicket({
  language,
  type,
  code,
  codes = [],
  isPending = false,
  pendingRef,
  isApproved = false,
}: VoucherTicketProps) {
  const isAr = language === "ar";
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Normalize code list
  const activeCodesList = codes && codes.length > 0 
    ? codes 
    : code 
    ? [code] 
    : [];

  const activeCodeToDisplay = activeCodesList[activeTab] || "";

  // Helper code copy
  const handleCopyCode = (val: string, index: number) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Get dynamic current date
  const formattedDate = new Date().toLocaleDateString(
    isAr ? "ar-EG" : language === "fr" ? "fr-FR" : "en-US", 
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

  return (
    <div 
      className="relative w-full max-w-md mx-auto overflow-hidden select-none transition-all duration-300"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Curved ticket body with beautifully textured minimalist slate/cream styling */}
      <div 
        className="relative flex items-stretch rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/50 text-slate-700 bg-white font-sans min-h-[190px] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300"
      >
        {/* Subtle decorative mesh overlay for refined textured design */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        {/* Glowing orb accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* SIDE A: Stub Part (Left for LTR, Right for RTL) */}
        <div className={`w-[28%] flex flex-col justify-between items-center p-3 sm:p-4 border-dashed border-slate-200/80 relative z-10 bg-slate-50/50 backdrop-blur-sm ${isAr ? "order-2 border-r-2" : "order-1 border-l-0"}`}>
          
          {/* Perforation Cutouts - exactly on the border edge */}
          <div className={`absolute -top-4 w-8 h-8 rounded-full bg-white z-20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)] border-b border-l border-slate-200/50 ${isAr ? "-left-4" : "-right-4"}`} style={{ clipPath: "circle(50% at 50% 0%)" }} />
          <div className={`absolute -bottom-4 w-8 h-8 rounded-full bg-white z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border-t border-l border-slate-200/50 ${isAr ? "-left-4" : "-right-4"}`} style={{ clipPath: "circle(50% at 50% 100%)" }} />

          {/* Vertical perforated line simulation */}
          <div className={`absolute top-0 bottom-0 ${isAr ? "-left-[1px]" : "-right-[1px]"} w-0 border-r-2 border-dashed border-slate-200 z-10`} />

          {/* Ticket header tag */}
          <div className="text-center w-full mt-2">
            <span className="text-[7.5px] font-black tracking-[0.2em] text-slate-400 uppercase block">
              {isAr ? "نوع الباقة" : "PLAN TYPE"}
            </span>
            <span className="text-xs font-black tracking-tight text-slate-800 mt-1 block">
              {type === "bundle" ? (isAr ? "٣ أكواد" : "3 CODES") : (isAr ? "كود واحد" : "1 CODE")}
            </span>
          </div>

          {/* Stylized realistic barcode but quieter */}
          <div className="flex flex-col items-center justify-center space-y-1.5 w-full my-3 mix-blend-darken opacity-70">
            <div className="flex items-end justify-center gap-[1.5px] py-1.5 px-2 bg-transparent rounded-md">
              {[1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1, 3, 1, 2, 1].map((n, idx) => (
                <div key={idx} className="bg-slate-800 rounded-sm h-8" style={{ width: `${n * 0.8}px` }} />
              ))}
            </div>
            <span className="font-mono text-[7px] text-slate-500 font-bold select-none uppercase tracking-widest leading-none">
              {pendingRef ? `REF-${pendingRef.slice(0,8)}` : "SECURE"}
            </span>
          </div>

          {/* Price Label */}
          <div className="text-center w-full mb-2">
            <span className="text-[7.5px] font-black tracking-[0.2em] text-slate-400 uppercase block">
              {isAr ? "السعر" : "PRICE"}
            </span>
            <span className="text-sm font-black text-slate-800 mt-0.5 block">
              {type === "bundle" ? "120" : "50"} <span className="text-[9px] text-slate-500">{isAr ? "ج.م" : "EGP"}</span>
            </span>
          </div>
        </div>

        {/* SIDE B: Title & Information (Left for RTL, Right for LTR) */}
        <div className={`flex-1 flex flex-col justify-between p-4 sm:p-6 relative z-10 bg-white/80 backdrop-blur-sm ${isAr ? "order-1" : "order-2"}`}>
          
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Sparkles size={11} className="text-[#FF4D2D]/80 shrink-0" />
                <span className="text-[8px] font-medium uppercase tracking-widest text-[#FF4D2D]/90">
                  {isAr ? "تأكيد فوري" : "INSTANT VERIFIED"}
                </span>
              </div>
              
              <h4 className="text-sm font-semibold text-slate-800 mt-1 select-none">
                {isApproved 
                  ? (isAr ? "تم التفعيل بنجاح ←" : "VERIFIED & UNLOCKED")
                  : isPending
                  ? (isAr ? "قيد المراجعة والمعالجة" : "PROCESSING PAYMENT")
                  : (isAr ? "كود تحميل السيرة الذاتية" : "AUTHENTICATION VOUCHER")
                }
              </h4>
            </div>

            {/* Micro Badge indicator */}
            {isApproved ? (
              <span className="px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1 shrink-0">
                <CircleDot size={7} className="text-emerald-500 animate-pulse" />
                {isAr ? "نشط" : "ACTIVE"}
              </span>
            ) : isPending ? (
              <span className="px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1 shrink-0">
                <RefreshCw size={7} className="animate-spin text-amber-500" />
                {isAr ? "مراجعة" : "PENDING"}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                {isAr ? "مؤقت" : "READY"}
              </span>
            )}
          </div>

          {/* Middle Decorative Badge / Icon Layer */}
          <div className="flex items-center gap-3 my-2">
            <div className="bg-slate-50 text-slate-600 font-medium text-xs px-2.5 py-1.5 rounded-lg text-center select-none border border-slate-200/50 shrink-0">
              {type === "bundle" ? (isAr ? "مجموعة (٣ أكواد)" : "3 CODES") : (isAr ? "كود تفعيل (١)" : "1 CODE")}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider block">
                {isAr ? "المميزات المفتوحة" : "ACCESS BENEFITS"}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block truncate">
                {type === "bundle" 
                  ? (isAr ? "تحميل ٣ ملفات سيرة ذاتية وحفظ غير محدود" : "Download 3 distinct premium resumes")
                  : (isAr ? "تصدير PDF عالي الجودة بلا علامات مائية" : "High fidelity print-ready PDF export")
                }
              </span>
            </div>
          </div>

          {/* Interactive Codes Claiming Sandbox */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-2.5 shadow-sm">
            {isApproved ? (
              <div className="space-y-2">
                
                {/* Bundle Tabs Selector if more than 1 code */}
                {activeCodesList.length > 1 && (
                  <div className="flex items-center gap-1 pb-1.5 border-b border-slate-200/50 overflow-x-auto">
                    {activeCodesList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-2.5 py-0.5 rounded-md text-[8px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeTab === idx
                            ? "bg-slate-800 text-white shadow-xs"
                            : "bg-slate-200/60 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isAr ? `الكود ${idx + 1}` : `Code ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Display Selectable Code with Copy action */}
                {activeCodeToDisplay ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Key size={8} className="text-slate-500" />
                        {isAr ? "انسخ واستخدم الكود للتفعيل" : "COPY CODE TO ACTIVATE PREMIUM"}
                      </p>
                      <span className="text-xs sm:text-sm font-mono font-medium text-slate-800 select-all uppercase tracking-wider block truncate mt-0.5">
                        {activeCodeToDisplay}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(activeCodeToDisplay, activeTab)}
                      className="p-1.5 sm:p-2 bg-slate-100 border border-slate-200/80 hover:bg-slate-200 text-slate-600 rounded-lg transition-all active:scale-95 cursor-pointer shrink-0"
                      title={isAr ? "نسخ الكود" : "Copy Code"}
                    >
                      {copiedIdx === activeTab ? (
                        <Check size={11} className="text-emerald-500" />
                      ) : (
                        <Copy size={11} className="text-slate-500" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 font-medium text-center py-1">
                    {isAr ? "بانتظار تفعيل الكود من النظام..." : "Claiming active code..."}
                  </div>
                )}
                
              </div>
            ) : isPending ? (
              <div className="space-y-1 py-0.5">
                <div className="flex items-center gap-1.5 text-[8px] text-amber-700 font-semibold uppercase tracking-wider">
                  <Clock size={10} className="animate-spin text-amber-500 shrink-0" />
                  {isAr ? "معاملة معلقة للمطابقة والاعتماد" : "WAITING FOR VERIFICATION"}
                </div>
                <p className="text-[9.5px] text-slate-500 font-medium leading-normal">
                  {isAr 
                    ? `الرقم المرجعي: ${pendingRef}. يتم تفعيل الكود مباشرة فور اعتماد المعاملة.` 
                    : `REF: ${pendingRef}. Your verified code will be claimed shortly on approval.`
                  }
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 py-0.5">
                <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isAr ? "مميزات التفعيل الفوري" : "TICKET BENEFITS"}
                </div>
                <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed">
                  {type === "bundle" 
                    ? (isAr ? "🚀 الحصول على ٣ أكواد تفعيل مستقلة صالحة للاستخدام وسير ذاتية متعددة!" : "🚀 Claim 3 independent single-use premium codes")
                    : (isAr ? "🚀 كود تفعيل فوري يزيل العلامات المائية ويفتح تصدير الـ PDF اللانهائي" : "🚀 Instant premium key, complete ATS scanner & formal export status")
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer date decoration with dynamic layout matching Canva mock */}
          <div className="flex items-center gap-2 mt-2 select-none">
            <span className="text-[8px] font-medium text-slate-400 uppercase block shrink-0">
              {formattedDate}
            </span>
            <div className="flex-1 h-[0.5px] bg-slate-200" />
            <span className="text-[8.5px] font-semibold tracking-wider text-slate-400">
              HASH RESUME
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
