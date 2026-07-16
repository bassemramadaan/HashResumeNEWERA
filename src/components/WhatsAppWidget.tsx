import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

export function WhatsAppWidget() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "201016757134"; // Default support number
  const messageEn = "Hello Hash Resume team! I need some assistance with creating/tailoring my resume.";
  const messageAr = "مرحباً فريق هاش ريزومي! أرغب في الحصول على مساعدة بخصوص إنشاء أو تعديل سيرتي الذاتية.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(isAr ? messageAr : messageEn)}`;

  return (
    <div 
      className="fixed bottom-6 top-6 sm:bottom-6 sm:top-auto z-50 flex flex-col items-end gap-3"
      style={{ left: isAr ? "24px" : "auto", right: isAr ? "auto" : "24px" }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            className="w-72 bg-white rounded-3xl border border-slate-150 shadow-2xl overflow-hidden text-start font-sans"
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-4 bg-[#075e54] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-black text-xs">
                    💬
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075e54] rounded-full animate-ping" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075e54] rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">
                    {isAr ? "الدعم الفني المباشر" : "Direct WhatsApp Support"}
                  </h4>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    {isAr ? "متصلون الآن لمساعدتك" : "Online to assist you"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-slate-50 space-y-3">
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                {isAr 
                  ? "أهلاً بك! يمكنك التحدث معنا مباشرة عبر الواتساب للحصول على مساعدة سريعة في كتابة أو مراجعة سيرتك الذاتية."
                  : "Hi there! Message our live support specialists directly on WhatsApp for premium advice on optimizing your resume."}
              </p>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsOpen(false)}
                className="w-full h-10 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>💬 {isAr ? "بدء المحادثة الفورية" : "Start Live Chat"}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer relative z-50 group border border-emerald-500/10"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] font-bold text-white animate-pulse">
          1
        </span>
        <MessageSquare size={20} className="group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
}
