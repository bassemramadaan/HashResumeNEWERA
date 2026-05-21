import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, ArrowRightLeft, AlertCircle } from "lucide-react";
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
  }, [userFullEmail, userFullName, userEmailInput, senderNameOrPhone]);

  // Auto-polling for pending transaction status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (pendingRef) {
      // Start polling every 5 seconds
      intervalId = setInterval(() => {
        if (!checkingApproval) {
          handleCheckApproval(pendingRef);
        }
      }, 5000); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingRef, checkingApproval]);

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg || (isAr ? "فشل التحقق، حاول مرة أخرى" : "Verification failed, please try again"));
    } finally {
      setVerifying(false);
    }
  };

  // 2. New Mode: Submit Manual Payment Transaction
  const handleSubmitManualPayment = async () => {
    const trimmedRef = refNum.trim();
    if (!trimmedRef) {
      setError(isAr ? "يرجى كتابة الرقم المرجعي للمعاملة أولاً" : "Please enter the transaction reference first");
      return;
    }
    
    // Local duplicate check
    const usedRefs = JSON.parse(localStorage.getItem("used_payment_refs") || "[]");
    if (usedRefs.includes(trimmedRef)) {
      setError(isAr ? "عذراً، لقد استخدمت هذا الرقم المرجعي مسبقاً. يرجى إدخال رقم مرجعي جديد وصحيح." : "You have already used this reference number. Please provide a new, valid transaction reference.");
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
          reference: trimmedRef,
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
        // Automatically save to local history so we don't spam the same one
        const updatedRefs = [...usedRefs, trimmedRef];
        localStorage.setItem("used_payment_refs", JSON.stringify(updatedRefs));
        
        localStorage.setItem("pending_payment_ref", trimmedRef);
        setPendingRef(trimmedRef);
        setError("");
        // Instantly poll to see if it triggers
        handleCheckApproval(trimmedRef);
      } else {
        setError(result.message || (isAr ? "فشل تسجيل التحويل الرقمي، تأكد من التفاصيل." : "Failed to record payment reference. Please check connection."));
      }
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100 my-8"
          >
            {/* Top Brand Stripe Accent with subtle pulsing */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-5 p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all z-10",
                isAr ? "left-5" : "right-5"
              )}
            >
              <X size={18} />
            </button>

            <div className="px-6 py-8 sm:px-10 sm:py-10 max-h-[85vh] overflow-y-auto custom-scrollbar relative z-0">
              {/* Header / Brand visual block */}
              <div className="flex flex-col items-center text-center mt-2 mb-8">
                <div className="flex flex-col items-center gap-4 mb-3">
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                    <img src={LOGO_URL} alt="Hash Resume Logo" className="h-10 w-auto" loading="lazy" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-syne">
                    {isAr ? "تصدير السيرة الذاتية" : "Unlock Your Resume"}
                  </h2>
                </div>
                <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-sm leading-relaxed px-4">
                  {isAr ? "تفعيل سريع وتنزيل غير محدود (PDF/DOCX) بدون أي علامة مائية" : "Instant activation. Download infinitely (PDF/DOCX) with no watermark"}
                </p>
                
                {/* Receipt-style Pricing Badge */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100/80 px-6 py-2.5 rounded-2xl shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/60 to-emerald-100/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                    <Sparkles size={16} className="text-emerald-500 relative z-10" />
                    <div className="flex items-baseline gap-1.5 relative z-10">
                      <span className="text-2xl font-black text-emerald-700" style={{ fontFamily: isAr ? 'Cairo' : 'inherit' }}>50</span>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{isAr ? "جنية مصري" : "EGP"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { 
                    id: "instapay", 
                    label: "InstaPay", 
                    icon: Zap, 
                    activeBg: "bg-emerald-50/50 border-emerald-500 ring-emerald-100 text-emerald-600 shadow-emerald-100/50", 
                    labelAr: "انستاباي"
                  },
                  { 
                    id: "vodafone", 
                    label: "Vodafone", 
                    icon: Smartphone, 
                    activeBg: "bg-emerald-50/50 border-emerald-500 ring-emerald-100 text-emerald-600 shadow-emerald-100/50", 
                    labelAr: "فودافون كاش"
                  },
                  { 
                    id: "card", 
                    label: "Voucher Code", 
                    icon: CreditCard, 
                    activeBg: "bg-slate-50 border-slate-700 ring-slate-200 text-slate-800 shadow-slate-200/50", 
                    labelAr: "كود التفعيل"
                  },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => { setSelectedMethod(method.id as PaymentMethod); setError(""); }}
                      className={cn(
                        "flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-300 relative group cursor-pointer",
                        isSelected 
                          ? cn("border-2 shadow-md ring-4 transform -translate-y-1", method.activeBg)
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 bg-white hover:-translate-y-0.5 hover:shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm",
                        isSelected ? "bg-white border-0 scale-110" : "bg-white border border-slate-100 text-slate-400 group-hover:text-slate-600"
                      )}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black tracking-wide text-slate-700 text-center leading-tight mt-3">
                        {isAr ? method.labelAr : method.label}
                      </span>
                      {isSelected && (
                        <motion.div 
                          layoutId="payment-active-indicator" 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full absolute bottom-1.5",
                            method.id === "card" ? "bg-slate-800" : "bg-emerald-600"
                          )} 
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content area based on states */}
              <div className="relative">
                {pendingRef ? (
                  // ── SCREEN: PENDING TRANSACTION REVIEW (POLLED REDIRECT) ──
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 bg-amber-50 p-6 rounded-2xl border border-amber-200/80 text-center relative overflow-hidden shadow-inner"
                  >
                    <div className="absolute top-0 right-0 p-2 text-amber-600">
                      <ArrowRightLeft size={16} className="animate-pulse opacity-20" />
                    </div>
                    
                    <div className="relative inline-flex mb-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-30 animate-ping duration-700" />
                      <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                        <Loader2 size={24} className="animate-spin text-amber-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-base font-black text-amber-900">
                      {isAr ? "تحويلك الرقمي قيد المطابقة الآن" : "Verifying Your Transaction"}
                    </h3>
                    
                    <div className="space-y-2 max-w-sm mx-auto">
                      <div className="bg-white/80 border border-amber-200/60 p-2.5 rounded-xl font-mono text-xs font-bold text-amber-800/80 shadow-sm isolate">
                        {isAr ? "الرقم المرجعي: " : "Ref #: "}{pendingRef}
                      </div>
                      <p className="text-amber-700/70 text-xs leading-relaxed font-semibold">
                        {isAr 
                          ? "لقد سجلنا المعاملة بنجاح، ونقوم بمطابقتها تفصيلياً مع إشعارات البنك لتفعيل ميزة تنزيل سيرتك فوراً." 
                          : "We registered the reference and are actively matching it against standard bank inputs."}
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      <button
                        onClick={() => handleCheckApproval()}
                        disabled={checkingApproval}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md shadow-amber-500/20 active:scale-[0.98] disabled:opacity-40"
                      >
                        {checkingApproval ? (
                          <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                          <>
                            <RefreshCw size={14} className="animate-spin-slow" />
                            {isAr ? "تحديث حالة التفعيل الفوري" : "Check Approval Status"}
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleClearPending}
                        className="text-[10px] font-bold text-amber-600/60 hover:text-amber-800 hover:underline block mx-auto py-1"
                      >
                        {isAr ? "إلغاء المعاملة الحالية وإدخال تفاصيل أخرى" : "Cancel & submit another reference"}
                      </button>
                    </div>
                  </motion.div>
                ) : selectedMethod === "instapay" || selectedMethod === "vodafone" ? (
                  // ── SCREEN: INSTAPAY or VODAFONE CASH MANUAL TRANSFER ──
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Step 1: Transfer Details Box */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border bg-emerald-100/60 text-emerald-700 border-emerald-200">
                          {isAr ? "الخطوة الأولى" : "Step 1"}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {isAr ? "تحويل محفظة رقمية" : "Send Digital Transfer"}
                        </span>
                      </div>
                      
                      {selectedMethod === "instapay" ? (
                        <div className="space-y-2.5">
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {isAr ? "افتح تطبيق انستاباي الخاص بك وأرسل 50 جنيه لعنوان الدفع التالي:" : "Send exactly 50 EGP to this InstaPay Address:"}
                          </p>
                          <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-emerald-300 transition-colors group">
                            <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 flex-1 select-all tracking-wide">bassemramadaan@instapay</span>
                            <button
                              onClick={() => handleCopy("bassemramadaan@instapay", "ipa")}
                              className="p-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 rounded-lg transition-all text-slate-400"
                              title={isAr ? "نسخ العنوان" : "Copy Address"}
                            >
                              {copiedText === "ipa" ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 px-1">
                                  <Check size={14} /> {isAr ? "تم!" : "Copied"}
                                </span>
                              ) : (
                                <Copy size={15} />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {isAr ? "قم بتحويل 50 جنيه كاش لمحفظة فودافون كاش التالية:" : "Transfer exactly 50 EGP to this Vodafone Cash wallet:"}
                          </p>
                          <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-emerald-300 transition-colors group">
                            <span className="font-mono font-black text-sm text-slate-800 flex-1 select-all tracking-wider">01101007965</span>
                            <button
                              onClick={() => handleCopy("01101007965", "phone")}
                              className="p-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 rounded-lg transition-all text-slate-400"
                              title={isAr ? "نسخ الرقم" : "Copy Wallet Number"}
                            >
                              {copiedText === "phone" ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 px-1">
                                  <Check size={14} /> {isAr ? "تم!" : "Copied"}
                                </span>
                              ) : (
                                <Copy size={15} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Form submission */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-full bg-emerald-500 block" />
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">
                          {isAr ? "الخطوة الثانية: كتابة تفاصيل المعاملة للتأكيد الفوري" : "Step 2: Confirm Reference for Immediate Verification"}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
                            {isAr ? "الرقم المرجعي للمعاملة (Ref ID) *" : "Transaction Reference ID / Operation Number *"}
                          </label>
                          <input
                            type="text"
                            value={refNum}
                            onChange={(e) => setRefNum(e.target.value.replace(/\D/g, ""))}
                            placeholder={selectedMethod === "instapay" ? (isAr ? "مثال: 123456789101" : "e.g. 123456789101") : (isAr ? "مثال لعملية فودافون كاش المرسل برسالة التأكيد" : "Vodafone Cash transaction ID")}
                            maxLength={18}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3.5 text-xs font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
                              {isAr ? "اسم المرسل للاستدلال" : "Sender Mobile / Name"}
                            </label>
                            <input
                              type="text"
                              value={senderNameOrPhone}
                              onChange={(e) => setSenderNameOrPhone(e.target.value)}
                              placeholder={isAr ? "مثال: باسم رمضان" : "e.g. Bassem"}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
                              {isAr ? "بريدك الإلكتروني" : "Your Email"}
                            </label>
                            <input
                              type="email"
                              value={userEmailInput}
                              onChange={(e) => setUserEmailInput(e.target.value)}
                              placeholder="yourname@domain.com"
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* Main Unlock CTA */}
                        <div className="pt-2">
                          <button
                            onClick={handleSubmitManualPayment}
                            disabled={submittingManual || !refNum}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs text-white uppercase tracking-wider shadow-[0_10px_40px_-10px] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-xl bg-slate-900 hover:bg-slate-800 shadow-slate-900/40"
                          >
                            {submittingManual ? (
                              <Loader2 size={18} className="animate-spin text-white" />
                            ) : (
                              <>
                                <Lock size={15} className="text-white mb-0.5" />
                                {isAr ? "تسجيل التحويل ومطابقته فورياً" : "Submit & Check Approval"}
                              </>
                            )}
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => { setSelectedMethod("card"); }}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all block mx-auto pt-1"
                        >
                          {isAr ? "لديك كود تفعيل بالفعل؟ أدخله هنا ←" : "Already have an activation code? Enter here →"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // ── SCREEN: CLASSIC ACTIVATION CODE ENTER ──
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-3">
                      <span className="inline-flex bg-white shadow-sm text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-200">
                        {isAr ? "كود التفعيل الفوري" : "Activation Code"}
                      </span>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {isAr 
                          ? "إذا كان لديك كود مرسل مسبقاً من الإدارة، اكتبه بالأسفل لتفعيل ميزة تصدير وتحميل سيرتك الذاتية بشكل مجاني دائماً." 
                          : "Enter the precise activation code provided to unlock infinite exports."}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="flex gap-2 p-1.5 bg-slate-50/50 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-slate-500/10 focus-within:border-slate-400 transition-all">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                          placeholder="HASH-XXXX"
                          className="flex-1 px-4 bg-transparent font-mono uppercase tracking-[0.2em] text-sm outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal font-bold text-slate-800"
                        />
                        <button
                          onClick={handleVerify}
                          disabled={verifying || !code.trim()}
                          className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl font-black text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-40 shadow-sm disabled:shadow-none cursor-pointer"
                        >
                          {verifying ? <Loader2 size={16} className="animate-spin text-white" /> : <><Lock size={14} /> {isAr ? "تأكيد" : "Verify"}</>}
                        </button>
                      </div>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-slate-300 text-[10px] uppercase font-black tracking-widest">{isAr ? "أو" : "Or"}</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>

                      <a
                        href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-xs text-white transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer"
                        style={{ backgroundColor: '#128C7E' }}
                      >
                        <MessageCircle size={18} />
                        {isAr ? "طلب كود تفعيل فوري عبر الواتساب" : "Request Code direct via WhatsApp"}
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Error alerts */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl relative overflow-hidden flex items-start gap-2.5 shadow-sm shadow-rose-100/50"
                >
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className={cn(
                    "text-xs text-rose-700 font-bold leading-relaxed",
                    isAr ? "text-right" : "text-left"
                  )}>
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 border-t border-slate-100/80">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  {isAr ? "تأمين 100%" : "Secure 100%"}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {isAr ? "تأكيد تلقائي" : "Smart Verify"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
