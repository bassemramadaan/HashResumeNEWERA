import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Loader2, Unlock, Lock, CheckCircle2 } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

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
    ? "السلام عليكم، عايز أشتري كود تحميل السيرة الذاتية من HashResume (50 جنيه)"
    : "Hi, I want to buy a resume download code from HashResume (50 EGP)";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(18,18,16,0.5)' }}
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-md flex flex-col"
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
            border: '1px solid var(--color-neutral-200)',
          }}
        >
          {/* Header */}
          <div
            className="flex flex-col items-center text-center px-6 pt-8 pb-6"
            style={{ borderBottom: '1px solid var(--color-neutral-100)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 rounded-full transition-colors"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              <X size={18} />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--color-brand-50)' }}
            >
              <Unlock size={26} style={{ color: 'var(--color-brand-500)' }} />
            </div>

            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-neutral-900)' }}>
              {isAr ? "حمّل سيرتك الذاتية" : "Download Your Resume"}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
              {isAr ? "ادفع مرة واحدة فقط — بدون اشتراك" : "One-time payment — no subscription"}
            </p>

            {/* Price badge */}
            <div
              className="mt-4 px-5 py-2 rounded-full font-bold text-lg"
              style={{
                backgroundColor: 'var(--color-neutral-900)',
                color: '#fff',
              }}
            >
              50 {isAr ? "جنيه فقط" : "EGP only"}
            </div>
          </div>

          {/* Steps */}
          <div className="px-6 py-6 space-y-5">

            {/* Step 1 */}
            <div className="flex gap-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--color-brand-500)', color: '#fff' }}
              >
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-neutral-700)' }}>
                  {isAr ? "تواصل واطلب الكود" : "Contact us to get your code"}
                </p>
                
                <a
                  href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all"
                  style={{ backgroundColor: '#25D366', color: '#fff' }}
                >
                  <MessageCircle size={18} />
                  {isAr ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
                </a>

                {/* InstaPay hint */}
                <div
                  className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: 'var(--color-neutral-50)',
                    color: 'var(--color-neutral-500)',
                    border: '1px solid var(--color-neutral-200)',
                  }}
                >
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }} />
                  <span>
                    {isAr
                      ? "الدفع عبر InstaPay — بتبعت الفلوس وبتاخد الكود فوراً"
                      : "Pay via InstaPay — send money and get your code instantly"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'var(--color-neutral-100)' }} />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}
              >
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-neutral-700)' }}>
                  {isAr ? "أدخل الكود وحمّل" : "Enter your code and download"}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder={isAr ? "HASH-XXXX" : "HASH-XXXX"}
                    className="flex-1 px-4 py-2.5 rounded-xl border font-mono uppercase tracking-widest text-sm outline-none transition-all"
                    style={{
                      borderColor: error ? 'var(--color-danger)' : 'var(--color-neutral-300)',
                      height: 48,
                    }}
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !code.trim()}
                    className="flex items-center justify-center gap-2 px-5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--color-brand-500)',
                      color: '#fff',
                      height: 48,
                      minWidth: 80,
                    }}
                  >
                    {verifying
                      ? <Loader2 size={16} className="animate-spin" />
                      : <><Lock size={14} /> {isAr ? "فتح" : "Unlock"}</>
                    }
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs mt-2 text-start"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 flex items-center justify-center"
            style={{ borderTop: '1px solid var(--color-neutral-100)' }}
          >
            <button
              onClick={onClose}
              className="text-xs transition-colors"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
