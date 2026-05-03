import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Loader2, Unlock, Lock } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError(isAr ? "يرجى كتابة الكود الخاص بك." : "Please enter a code.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const url = `https://script.google.com/macros/s/AKfycbxzY_w_K7mzU-AYqds3vvLARGwAQjvbWi88v0c8U0FXKE8KfFQ4XxlhZc3ExkRM8XLMVg/exec?code=${encodeURIComponent(code)}&t=${Date.now()}`;
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success === true) {
        onSuccess();
      } else {
        setError(result.message || (isAr ? "كود غير صالح أو مستخدم." : "Invalid or used code."));
      }
    } catch (e) {
      console.error("Verification error:", e);
      setError(isAr ? "فشل التحقق، يرجى المحاولة مرة أخرى." : "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-4">
            <Unlock size={32} />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {isAr ? "احصل على السيرة الذاتية الآن" : "Unlock Your Resume Now"}
          </h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-sm">
            {isAr ? "ادفع فقط عندما تكون جاهزاً للتحميل بنسبة 100%." : "Try everything for free. Only pay when you're 100% ready to download."}
          </p>

          <div className="w-full space-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-neutral-700 self-start text-start">
                {isAr ? "1. تواصل معنا للحصول على كود الدفع" : "1. Get your unlock code"}
              </span>
              <a
                href="https://wa.me/201101007965?text=I%20want%20to%20buy%20a%20Resume%20Code"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle size={20} />
                {isAr ? "احصل على الكود عبر واتساب" : "Buy Code via WhatsApp"}
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-neutral-700 self-start text-start">
                {isAr ? "2. أدخل كود التحميل" : "2. Enter your unlock code"}
              </span>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={isAr ? "أدخل الكود (مثال: HASH-A1B2)" : "Enter code (e.g. HASH-A1B2)"}
                  className="flex-1 input font-mono uppercase tracking-wider h-[48px]"
                />
                <button
                  onClick={handleVerify}
                  disabled={verifying || !code.trim()}
                  className="btn-primary"
                >
                  {verifying ? <Loader2 size={18} className="animate-spin" /> : (
                    <>
                      <Lock size={16} /> {isAr ? "فتح" : "Unlock"}
                    </>
                  )}
                </button>
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs text-start mt-1"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

