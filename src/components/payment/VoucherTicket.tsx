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
      className="relative w-full max-w-md mx-auto overflow-hidden select-none select-none transition-all duration-300"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Curved ticket body with beautifully textured pastel watercolor gradient */}
      <div 
        className="relative flex items-stretch rounded-[1.75rem] shadow-[0_15px_35px_-10px_rgba(139,92,246,0.18)] border border-purple-200/40 text-purple-950 font-sans overflow-hidden min-h-[220px]"
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #fae8ff 50%, #fef9c3 100%)",
        }}
      >
        {/* Subtle decorative mesh overlay for print-voucher texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "radial-gradient(#8b5cf6 0.75px, transparent 0.75px), radial-gradient(#8b5cf6 0.75px, #f5f3ff 0.75px)", backgroundSize: "16px 16px", backgroundPosition: "0 0, 8px 8px" }} />
        
        {/* SIDE A: Stub Part (Left for LTR, Right for RTL) */}
        <div className={`w-[32%] flex flex-col justify-between items-center p-3 sm:p-4 border-dashed border-purple-950/20 relative z-10 ${isAr ? "order-2 border-r" : "order-1 border-l-0"}`}>
          
          {/* Perforation Cutouts - exactly on the border edge */}
          <div className={`absolute -top-3 w-6 h-6 rounded-full bg-white z-20 shadow-inner border border-purple-200/10 ${isAr ? "-left-3" : "-right-3"}`} />
          <div className={`absolute -bottom-3 w-6 h-6 rounded-full bg-white z-20 shadow-inner border border-purple-200/10 ${isAr ? "-left-3" : "-right-3"}`} />

          {/* Vertical perforated line simulation */}
          <div className={`absolute top-0 bottom-0 ${isAr ? "left-0" : "right-0"} w-0 border-r border-dashed border-purple-900/15 z-10`} />

          {/* Ticket header tag */}
          <div className="text-center w-full mt-1">
            <span className="text-[8px] font-black tracking-widest text-purple-900/60 uppercase block">
              {isAr ? "قسيمة خصم" : "VALUED AT"}
            </span>
            <span className="text-[11px] font-black tracking-tight text-purple-950">
              {type === "bundle" ? (isAr ? "توفير ٣٠٪" : "30% OFF") : (isAr ? "تحميل فوري" : "INSTANT")}
            </span>
          </div>

          {/* Stylized realistic barcode */}
          <div className="flex flex-col items-center justify-center space-y-1 w-full my-2">
            <div className="flex items-end justify-center gap-[1.2px] py-1 px-1.5 bg-white/40 rounded-md border border-purple-900/5 backdrop-blur-xs">
              {[1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1, 3, 1, 2, 1].map((n, idx) => (
                <div key={idx} className={`bg-purple-950 rounded-full h-8`} style={{ width: `${n * 0.7}px` }} />
              ))}
            </div>
            <span className="font-mono text-[8px] font-bold tracking-widest text-purple-900/70 select-none uppercase">
              {pendingRef ? `REF-${pendingRef}` : "0003554562"}
            </span>
          </div>

          {/* Price Label */}
          <div className="text-center w-full mb-1">
            <span className="text-[8px] font-black tracking-wider text-purple-900/60 uppercase block">
              {isAr ? "السعر" : "PRICE"}
            </span>
            <span className="text-sm font-black text-purple-950">
              {type === "bundle" ? "120" : "50"} {isAr ? "ج.م" : "EGP"}
            </span>
          </div>
        </div>

        {/* ROTATED TAGLINE FOR INTERACTIVE DIVIDER */}
        <div className={`absolute top-1/2 -translate-y-1/2 text-[8px] font-black text-purple-900/40 tracking-wider uppercase z-20 pointer-events-none select-none select-none hidden sm:block ${isAr ? "left-[31%]" : "left-[28%]"}`} style={{ transform: "translateY(-50%) rotate(-90deg)" }}>
          www.hashresume.com
        </div>

        {/* SIDE B: Title & Information (Left for RTL, Right for LTR) */}
        <div className={`flex-1 flex flex-col justify-between p-4 sm:p-5 relative z-10 ${isAr ? "order-1" : "order-2"}`}>
          
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Sparkles size={11} className="text-[#FF4D2D] shrink-0 animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#FF4D2D]">
                  {isAr ? "تفعيل الحساب الممتاز" : "PREMIUM ACCESS"}
                </span>
              </div>
              
              <h4 className="text-sm sm:text-base font-black text-purple-950 mt-1 leading-tight tracking-tight uppercase select-none">
                {isApproved 
                  ? (isAr ? "تم التفعيل بنجاح! 🎉" : "GIFT VOUCHER")
                  : isPending
                  ? (isAr ? "في انتظار التأكيد" : "VERIFYING VOUCHER")
                  : (isAr ? "قسيمة الترقية الفورية" : "GIFT VOUCHER")
                }
              </h4>
            </div>

            {/* Micro Badge indicator */}
            {isApproved ? (
              <span className="px-2 py-0.5 rounded-full text-[7px] font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 flex items-center gap-1 shrink-0">
                <CircleDot size={7} className="animate-pulse text-emerald-600" />
                {isAr ? "معتمد" : "ACTIVE"}
              </span>
            ) : isPending ? (
              <span className="px-2 py-0.5 rounded-full text-[7px] font-black tracking-wider uppercase bg-amber-500/10 text-amber-800 border border-amber-500/25 flex items-center gap-1 shrink-0">
                <RefreshCw size={7} className="animate-spin text-amber-600" />
                {isAr ? "مراجعة..." : "PENDING"}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full text-[7.5px] font-black tracking-wider bg-purple-950/10 text-purple-900 border border-purple-900/15 shrink-0">
                {isAr ? "غير مفعل" : "UNLOCKED"}
              </span>
            )}
          </div>

          {/* Middle Decorative Badge / Icon Layer resembling Canva design */}
          <div className="flex items-center gap-3 my-3">
            <div className="bg-purple-950 text-white font-black text-xs sm:text-sm px-3 py-2 rounded-lg text-center select-none uppercase tracking-wider shrink-0 shadow-xs">
              {type === "bundle" ? (isAr ? "٣ أكواد" : "3 CODES") : (isAr ? "كود ١" : "1 CODE")}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-purple-900/60 uppercase tracking-widest block">
                {isAr ? "الخدمة المتاحة" : "BENEFIT"}
              </span>
              <span className="text-[11px] font-black text-purple-950 block truncate">
                {type === "bundle" 
                  ? (isAr ? "تصادق ٣ سير ذاتية منفصلة مفعّلة" : "Unlocks 3 premium CVs")
                  : (isAr ? "حفظ سحابي + تنزيل كامل بدون علامة" : "PDF + ATS premium report")
                }
              </span>
            </div>
          </div>

          {/* Interactive Codes Claiming Sandbox */}
          <div className="bg-white/50 border border-purple-950/10 rounded-2xl p-2.5 sm:p-3 shadow-inner">
            {isApproved ? (
              <div className="space-y-2">
                
                {/* Bundle Tabs Selector if more than 1 code */}
                {activeCodesList.length > 1 && (
                  <div className="flex items-center gap-1 pb-1.5 border-b border-purple-950/5 overflow-x-auto">
                    {activeCodesList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-2 py-0.5 rounded-md text-[8px] font-black transition-all cursor-pointer whitespace-nowrap ${
                          activeTab === idx
                            ? "bg-purple-950 text-white shadow-xs"
                            : "bg-purple-950/10 text-purple-900 hover:bg-purple-950/20"
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
                      <p className="text-[8px] font-black text-purple-900/50 uppercase tracking-widest flex items-center gap-0.5">
                        <Key size={8} className="text-[#FF4D2D]" />
                        {isAr ? "انسخ واستخدم الكود للتفعيل" : "COPY CODE TO ACTIVATE PREMIUM"}
                      </p>
                      <span className="text-xs sm:text-sm font-mono font-black text-[#FF4D2D] select-all uppercase tracking-wider block truncate mt-0.5">
                        {activeCodeToDisplay}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(activeCodeToDisplay, activeTab)}
                      className="p-1.5 sm:p-2 bg-purple-950/5 border border-purple-950/10 hover:bg-purple-950/15 text-purple-950 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
                      title={isAr ? "نسخ الكود" : "Copy Code"}
                    >
                      {copiedIdx === activeTab ? (
                        <Check size={12} className="text-emerald-600 animate-bounce" />
                      ) : (
                        <Copy size={12} className="text-purple-950" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-purple-900/60 font-bold text-center py-1">
                    {isAr ? "بانتظار تصدير الكود من النظام..." : "Claiming active code..."}
                  </div>
                )}
                
              </div>
            ) : isPending ? (
              <div className="space-y-1 py-0.5">
                <div className="flex items-center gap-1.5 text-[8px] text-amber-700 font-black uppercase tracking-widest">
                  <Clock size={10} className="animate-spin text-amber-600 shrink-0" />
                  {isAr ? "معاملة معلقة للمطابقة والاعتماد" : "WAITING FOR VERIFICATION"}
                </div>
                <p className="text-[9px] text-purple-950/80 font-bold leading-normal">
                  {isAr 
                    ? `الرقم المرجعي: ${pendingRef}. يتم سحب الكود وتقديمه لك فور تأكيد إرسال Vodafone/Instapay.` 
                    : `REF: ${pendingRef}. Your verified login code gets claimed from Google Sheets on approval.`
                  }
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 py-0.5">
                <div className="text-[8px] font-black text-purple-900/50 uppercase tracking-widest">
                  {isAr ? "التفعيل الفوري يشمل" : "TICKET BENEFITS"}
                </div>
                <p className="text-[9px] text-purple-950 font-bold leading-relaxed">
                  {type === "bundle" 
                    ? (isAr ? "🚀 الحصول على ٣ أكود مميزة صالحة لسنة لـ ٣ سير ذاتية مختلفة!" : "🚀 Claim 3 independent premium codes valid for 1 full year")
                    : (isAr ? "🚀 كود تفعيل فوري يحذف العلامة المائية ويفتح الفحص الذكاء والـ ATS" : "🚀 Instant personal key, complete ATS scanner & watermark removal")
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer date decoration with dynamic layout matching Canva mock */}
          <div className="flex items-center gap-2 mt-2 select-none">
            <span className="text-[8px] font-black text-purple-950/60 uppercase tracking-wider block shrink-0">
              {formattedDate}
            </span>
            <div className="flex-1 h-[1px] bg-purple-950/10" />
            <span className="text-[8.5px] font-black tracking-widest text-purple-950/40">
              HASH RESUME
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
