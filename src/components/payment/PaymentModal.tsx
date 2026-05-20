import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
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
  
  // Load user data from store for auto-prefill
  const resumeData = useResumeStore((state) => state.data);
  const userFullEmail = resumeData.personalInfo?.email || "";
  const userFullName = resumeData.personalInfo?.fullName || "";

  // Classic verification code state
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("instapay");

  // Manual payment state
  const [copiedText, setCopiedText] = useState("");
  const [refNum, setRefNum] = useState("");
  const [senderNameOrPhone, setSenderNameOrPhone] = useState(userFullName);
  const [userEmailInput, setUserEmailInput] = useState(userFullEmail);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(false);

  // Retrieve pending reference from localStorage if exists
  const [pendingRef, setPendingRef] = useState<string>(() => localStorage.getItem("pending_payment_ref") || "");

  // Update fields if store loads values later
  useEffect(() => {
    if (userFullEmail && !userEmailInput) setUserEmailInput(userFullEmail);
    if (userFullName && !senderNameOrPhone) setSenderNameOrPhone(userFullName);
  }, [userFullEmail, userFullName]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // 1. Existing Mode: Activation Code Verify
  const handleVerify = async () => {
    if (!code.trim()) {
      setError(isAr ? "يرجى كتابة الكود أولاً" : "Please enter your code first");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error(isAr ? "فشل التحقق، يرجى المحاولة مجدداً" : "HTTP verification error");
      }
      
      const result = await response.json();
      if (result.success === true) {
        onSuccess();
      } else {
        setError(result.message || (isAr ? "كود غير صالح أو مستخدم من قبل" : "Invalid or already used code"));
      }
    } catch (err: any) {
      setError(err.message || (isAr ? "فشل التحقق، حاول مرة أخرى" : "Verification failed, please try again"));
    } finally {
      setVerifying(false);
    }
  };

  // 2. New Mode: Submit Manual Payment Transaction
  const handleSubmitManualPayment = async () => {
    if (!refNum.trim()) {
      setError(isAr ? "يرجى كتابة الرقم المرجعي للمعاملة أولاً" : "Please enter the transaction reference first");
      return;
    }
    setSubmittingManual(true);
    setError("");
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submitPayment",
          reference: refNum.trim(),
          senderInfo: senderNameOrPhone.trim() || userFullName || "Anonymous",
          email: userEmailInput.trim() || userFullEmail || "anonymous@hashresume.com",
          amount: "50 EGP"
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Submission Error");
      }

      const result = await response.json();
      if (result.success === true) {
        localStorage.setItem("pending_payment_ref", refNum.trim());
        setPendingRef(refNum.trim());
        setError("");
        // Instantly poll to see if it triggers
        handleCheckApproval(refNum.trim());
      } else {
        setError(result.message || (isAr ? "فشل تسجيل التحويل الرقمي، تأكد من التفاصيل." : "Failed to record payment reference. Please check connection."));
      }
    } catch (err: any) {
      setError(isAr ? "فشل التوصيل، يرجى إعادة المحاولة" : "Failed to connect to spreadsheet payments.");
    } finally {
      setSubmittingManual(false);
    }
  };

  // 3. New Mode: Check if Admin marked Transaction as Approved
  const handleCheckApproval = async (refToCheck?: string) => {
    const targetRef = refToCheck || pendingRef;
    if (!targetRef) return;

    setCheckingApproval(true);
    setError("");
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkStatus",
          reference: targetRef,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP Check Error");
      }

      const result = await response.json();
      if (result.success === true && result.status === "approved") {
        localStorage.removeItem("pending_payment_ref");
        setPendingRef("");
        onSuccess();
      } else {
        // If pending or other
        const defaultMsg = isAr
          ? "المعاملة قيد المراجعة حالياً من الإدارة. يرجى الانتظار دقيقة وجرب مرة أخرى."
          : "Your transaction is still under review. Please allow 1-5 minutes and click update again.";
        setError(result.message || defaultMsg);
      }
    } catch (err: any) {
      setError(isAr ? "فشل الحصول على الحالة، جرب مرة أخرى" : "Failed to poll status. Check connection.");
    } finally {
      setCheckingApproval(false);
    }
  };

  const handleClearPending = () => {
    if (window.confirm(isAr ? "هل تريد إلغاء مراجعة المعاملة الحالية وإدخال معاملة جديدة أو كود؟" : "Clear the pending review to enter another payment or code?")) {
      localStorage.removeItem("pending_payment_ref");
      setPendingRef("");
      setError("");
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

          <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img src={LOGO_URL} alt="Hash Resume Logo" className="h-10 w-auto" loading="lazy" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isAr ? "تحميل سيرتك المستقلة" : "Unlock Your Resume Download"}
                </h2>
              </div>
              <p className="text-slate-500 font-semibold text-xs sm:text-sm max-w-sm">
                {isAr ? "تفعيل دائم لمرة واحدة وتنزيل غير محدود بدون أي علامة مائية" : "One-time lifelong activation. Download infinitely with no watermark"}
              </p>
              
              <div className="mt-4 flex items-baseline gap-1 bg-brand-50 px-5 py-1.5 rounded-full border border-brand-100">
                <span className="text-2xl font-black text-brand-600">50</span>
                <span className="text-xs font-bold text-brand-500 uppercase">{isAr ? "جنيه مصري" : "EGP"}</span>
              </div>
            </div>

            {/* Payment Options tab */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "instapay", label: "InstaPay", icon: Zap, color: "bg-purple-50 text-purple-600 border-purple-100" },
                { id: "vodafone", label: "Vodafone", icon: Smartphone, color: "bg-red-50 text-red-600 border-red-100" },
                { id: "card", label: isAr ? "كود تفعيل" : "Activation Code", icon: CreditCard, color: "bg-blue-50 text-blue-600 border-blue-100" },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => { setSelectedMethod(method.id as PaymentMethod); setError(""); }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all gap-1.5 group",
                      isSelected ? "border-brand-500 bg-brand-50/20 ring-4 ring-brand-55" : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105", method.color)}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black tracking-wide text-slate-800 text-center leading-tight">{method.label}</span>
                    {isSelected && (
                      <motion.div layoutId="payment-active" className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Main Selection Area */}
            {pendingRef ? (
              // ── SCREEN: PENDING TRANSACTION REVIEW (POLLED REDIRECT) ──
              <div className="space-y-4 bg-amber-50/40 p-5 rounded-3xl border border-amber-100 text-center">
                <div className="relative inline-flex mb-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                  <div className="relative w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Loader2 size={24} className="animate-spin text-amber-600" />
                  </div>
                </div>
                
                <h3 className="text-base font-black text-slate-900">
                  {isAr ? "تحويلك قيد المراجعة الفورية" : "Reviewing Your Transfer"}
                </h3>
                
                <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                  {isAr 
                    ? `لقد سجلنا معاملتك رقم (${pendingRef}) بنجاح. نقوم بمطابقتها الآن بالحساب البنكي لتفعيل التحميل لك تلقائياً.` 
                    : `We've recorded transaction #${pendingRef}. We are matching it against bank registers to unlock download.`}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => handleCheckApproval()}
                    disabled={checkingApproval}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md"
                  >
                    {checkingApproval ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        {isAr ? "تحديث حالة التفعيل الفوري" : "Check & Unlock License"}
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClearPending}
                  className="text-[10px] text-slate-400 hover:text-slate-600 hover:underline block mx-auto pt-2"
                >
                  {isAr ? "إلغاء المراجعة وإدخال تفاصيل أخرى" : "Cancel & submit another reference"}
                </button>
              </div>
            ) : selectedMethod === "instapay" || selectedMethod === "vodafone" ? (
              // ── SCREEN: INSTAPAY or VODAFONE CASH MANUAL TRANSFER ──
              <div className="space-y-5">
                {/* Step 1: Transfer Details Box */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-3.5">
                  <span className="inline-flex bg-brand-500/10 text-brand-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {isAr ? "الخطوة الأولى: أرسل المبلغ" : "Step 1: Make Transfer"}
                  </span>
                  
                  {selectedMethod === "instapay" ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {isAr ? "افتح تطبيق انستاباي الخاص بك وأرسل 50 جنيه لاسم المستخدم التالي:" : "Send exactly 50 EGP to this InstaPay Address:"}
                      </p>
                      <div className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-2xl">
                        <span className="font-mono font-black text-xs sm:text-sm text-slate-850 select-all">bassemramadaan@instapay</span>
                        <button
                          onClick={() => handleCopy("bassemramadaan@instapay", "ipa")}
                          className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-250/20 rounded-xl transition-all"
                        >
                          {copiedText === "ipa" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {isAr ? "قم بتحويل 50 جنيه كاش لمحفظة فودافون كاش التالية:" : "Transfer exactly 50 EGP to this Vodafone Cash wallet:"}
                      </p>
                      <div className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-2xl">
                        <span className="font-mono font-black text-sm text-slate-850 select-all">01101007965</span>
                        <button
                          onClick={() => handleCopy("01101007965", "phone")}
                          className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-250/20 rounded-xl transition-all"
                        >
                          {copiedText === "phone" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Form submission */}
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 rounded-full bg-brand-500 block" />
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {isAr ? "الخطوة الثانية: أرسل الرقم المرجعي للتأكيد" : "Step 2: Submit Reference for Verification"}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        {isAr ? "رقم المرجع للمعاملة *" : "Transaction Reference ID / Number *"}
                      </label>
                      <input
                        type="text"
                        value={refNum}
                        onChange={(e) => setRefNum(e.target.value.replace(/\D/g, ""))}
                        placeholder={selectedMethod === "instapay" ? "123456789123" : "2010... أو رقم العملية"}
                        maxLength={18}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-350"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                          {isAr ? "اسم المرسل للاستدلال" : "Sender Mobile / Account"}
                        </label>
                        <input
                          type="text"
                          value={senderNameOrPhone}
                          onChange={(e) => setSenderNameOrPhone(e.target.value)}
                          placeholder={isAr ? "باسم رمضان" : "e.g. Bassem or Phone"}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-350"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                          {isAr ? "بريدك الإلكتروني" : "Your Email"}
                        </label>
                        <input
                          type="email"
                          value={userEmailInput}
                          onChange={(e) => setUserEmailInput(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-350"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitManualPayment}
                      disabled={submittingManual || !refNum}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs text-white bg-brand-500 hover:bg-brand-600 transition-all uppercase tracking-wider shadow-lg shadow-brand-100 disabled:opacity-50"
                    >
                      {submittingManual ? (
                        <Loader2 size={16} className="animate-spin text-white" />
                      ) : (
                        <>
                          <Lock size={14} className="text-white" />
                          {isAr ? "تأكيد الدفع ومتابعة الحالة" : "Submit & Start Tracking Status"}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { setSelectedMethod("card"); }}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all block mx-auto pt-1"
                    >
                      {isAr ? "أو التحقق باستخدام كود تفعيل سابق ←" : "Or verify with existing activation code →"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // ── SCREEN: CLASSIC ACTIVATION CODE ENTER ──
              <div className="space-y-5">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-3">
                  <span className="inline-flex bg-brand-500/10 text-brand-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {isAr ? "كود التفعيل" : "Activation Code"}
                  </span>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {isAr 
                      ? "يمكنك الدخول هنا وكتابة الكود المميز الصادر عن الإدارة لفتح سيرتك الذاتية وتحميلها فوراً." 
                      : "Enter the activation code sent to you by the management to unlock and download instantly."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all shadow-inner">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      placeholder="HASH-XXXX"
                      className="flex-1 px-4 bg-transparent font-mono uppercase tracking-[0.2em] text-xs sm:text-sm outline-none transition-all placeholder:text-slate-300"
                    />
                    <button
                      onClick={handleVerify}
                      disabled={verifying || !code.trim()}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-slate-900 text-white transition-all disabled:opacity-50 min-w-[100px] shadow-lg shadow-slate-200"
                    >
                      {verifying ? <Loader2 size={16} className="animate-spin text-white" /> : <><Lock size={14} /> {isAr ? "فتح" : "Unlock"}</>}
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-xs text-white transition-all hover:scale-[1.01] active:scale-95"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={18} />
                    {isAr ? "طلب كود تفعيل فوري عبر الواتساب" : "Request Code direct via WhatsApp"}
                  </a>
                </div>
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl focus:outline-none"
              >
                <p className="text-xs text-rose-600 font-bold px-1 text-center leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 py-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                {isAr ? "تأمين 100%" : "Secure 100%"}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {isAr ? "مراجعة يدوية ذكية" : "Smart validation"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
