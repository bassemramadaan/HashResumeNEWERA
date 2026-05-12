import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { LOGO_URL } from "../../constants";
import { cn } from "../../lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "instapay" | "vodafone" | "card";

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("instapay");

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError(isAr ? "يرجى كتابة الكود أولاً" : "Please enter your code first");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const url = `https://script.google.com/macros/s/AKfycbxzY_w_K7mzU-AYqds3vvLARGwAQjvbWi88v0c8U0FXKE8KfFQ4XxlhZc3ExkRM8XLMVg/exec?code=${encodeURIComponent(code)}&t=${Date.now()}`;
      const response = await fetch(url, { method: "GET", mode: "cors" });
      if (!response.ok) throw new Error("HTTP error");
      const result = await response.json();
      if (result.success === true) {
        onSuccess();
      } else {
        setError(result.message || (isAr ? "كود غير صالح أو مستخدم من قبل" : "Invalid or already used code"));
      }
    } catch {
      setError(isAr ? "فشل التحقق، حاول مرة أخرى" : "Verification failed, please try again");
    } finally {
      setVerifying(false);
    }
  };

  const whatsappMsg = isAr
    ? `السلام عليكم، أرغب في الدفع عبر ${selectedMethod === "instapay" ? "InstaPay" : selectedMethod === "vodafone" ? "Vodafone Cash" : "البطاقة البنكية"} للحصول على كود Hash Resume`
    : `Hi, I want to pay via ${selectedMethod} to get my Hash Resume code.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex items-center gap-3 mb-4">
                <img src={LOGO_URL} alt="Hash Resume Logo" className="h-10 w-auto" loading="lazy" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isAr ? "حمّل سيرتك الذاتية" : "Download Your Resume"}
                </h2>
              </div>
              <p className="text-slate-500 font-medium text-sm max-w-xs">
                {isAr ? "دفع لمرة واحدة للحصول على ملف احترافي بدون علامة مائية" : "One-time payment for a professional resume without watermarks"}
              </p>
              
              <div className="mt-6 flex items-baseline gap-1 bg-brand-50 px-6 py-2 rounded-full border border-brand-100 animate-pulse">
                <span className="text-3xl font-black text-brand-600">50</span>
                <span className="text-sm font-bold text-brand-500 uppercase">{isAr ? "جنيه" : "EGP"}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { id: "instapay", label: "InstaPay", icon: Zap, color: "bg-purple-50 text-purple-600 border-purple-100" },
                { id: "vodafone", label: "Vodafone", icon: Smartphone, color: "bg-red-50 text-red-600 border-red-100" },
                { id: "card", label: isAr ? "بطاقة" : "Card", icon: CreditCard, color: "bg-blue-50 text-blue-600 border-blue-100" },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 group",
                      isSelected ? "border-brand-500 bg-brand-50/30 ring-4 ring-brand-50" : "border-slate-100 hover:border-slate-300 bg-slate-50/50"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", method.color)}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">{method.label}</span>
                    {isSelected && (
                      <motion.div layoutId="payment-active" className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selection Content */}
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">1</span>
                  {isAr ? "احصل على الكود" : "Step 1: Get Code"}
                </div>
                <a
                  href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-white transition-all shadow-xl shadow-emerald-200 active:scale-95"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle size={24} />
                  {isAr ? "اطلب الكود عبر واتساب" : "Request Code via WhatsApp"}
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">2</span>
                  {isAr ? "أدخل الكود للتحميل" : "Step 2: Unlock & Download"}
                </div>
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="HASH-XXXX"
                    className="flex-1 px-4 bg-transparent font-mono uppercase tracking-[0.2em] text-sm outline-none transition-all placeholder:text-slate-300"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !code.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 text-white transition-all disabled:opacity-50 min-w-[100px] shadow-lg shadow-slate-200"
                  >
                    {verifying ? <Loader2 size={18} className="animate-spin text-white" /> : <><Lock size={16} /> {isAr ? "فتح" : "Unlock"}</>}
                  </button>
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-500 font-bold px-4">
                    {error}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex items-center justify-center gap-6 py-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                {isAr ? "دفع آمن" : "Secure Payment"}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {isAr ? "وصول فوري" : "Instant Access"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
