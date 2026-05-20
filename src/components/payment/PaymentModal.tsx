import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, ArrowRightLeft } from "lucide-react";
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
    } catch (err: any) {
      setError(err.message || (isAr ? "فشل التحقق، حاول مرة أخرى" : "Verification failed, please try again"));
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
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200/60 my-8"
        >
          {/* Top Brand Stripe Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-5 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-all z-10",
              isAr ? "left-5" : "right-5"
            )}
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Header / Brand visual block */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="relative p-1 bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm">
                  <img src={LOGO_URL} alt="Hash Resume Logo" className="h-9 w-auto" loading="lazy" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-800 tracking-tight font-syne">
                  {isAr ? "تحميل سيرتك الذاتية" : "Unlock Your Resume"}
                </h2>
              </div>
              <p className="text-neutral-500 font-medium text-xs sm:text-sm max-w-sm leading-relaxed">
                {isAr ? "تفعيل دائم لمرة واحدة وتنزيل غير محدود بدون أي علامة مائية" : "One-time lifelong activation. Download infinitely with no watermark"}
              </p>
              
              {/* Receipt-style Pricing Badge */}
              <div className="mt-4 inline-flex items-center gap-2 bg-brand-50/70 border border-brand-100/80 px-4 py-1.5 rounded-2xl relative shadow-sm">
                <Sparkles size={14} className="text-brand-500 animate-pulse" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-brand-600" style={{ fontFamily: isAr ? 'Cairo' : 'inherit' }}>50</span>
                  <span className="text-[10px] font-bold text-brand-500 uppercase">{isAr ? "جنيه مصري فقط" : "EGP Only"}</span>
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
                  activeBg: "bg-purple-50/50 border-purple-500 ring-purple-100 text-purple-600 shadow-purple-100/50", 
                  labelAr: "انستاباي"
                },
                { 
                  id: "vodafone", 
                  label: "Vodafone", 
                  icon: Smartphone, 
                  activeBg: "bg-red-50/50 border-red-500 ring-red-100 text-red-600 shadow-red-100/50", 
                  labelAr: "فودافون كاش"
                },
                { 
                  id: "card", 
                  label: "Activation Code", 
                  icon: CreditCard, 
                  activeBg: "bg-neutral-50/50 border-neutral-700 ring-neutral-100 text-neutral-800 shadow-neutral-200/50", 
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
                        : "border-neutral-150/80 hover:border-neutral-300 hover:bg-neutral-50 bg-neutral-50/30 hover:-translate-y-0.5 hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm",
                      isSelected ? "bg-white border-0 scale-110" : "bg-white border border-neutral-150/60 text-neutral-500 group-hover:text-neutral-700"
                    )}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wide text-neutral-800 text-center leading-tight mt-3">
                      {isAr ? method.labelAr : method.label}
                    </span>
                    {isSelected && (
                      <motion.div 
                        layoutId="payment-active-indicator" 
                        className={cn(
                          "w-1.5 h-1.5 rounded-full absolute bottom-1.5",
                          method.id === "instapay" ? "bg-purple-600" : method.id === "vodafone" ? "bg-red-600" : "bg-neutral-800"
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
                  className="space-y-4 bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 bg-amber-100/50 rounded-bl-xl text-amber-600">
                    <ArrowRightLeft size={14} className="animate-pulse" />
                  </div>
                  
                  <div className="relative inline-flex mb-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping" />
                    <div className="relative w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200">
                      <Loader2 size={22} className="animate-spin text-amber-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-base font-black text-neutral-800">
                    {isAr ? "تحويلك الرقمي قيد المطابقة الآن" : "Verifying Your Transaction"}
                  </h3>
                  
                  <div className="space-y-2 max-w-sm mx-auto">
                    <div className="bg-white/80 border border-amber-200/60 p-2.5 rounded-xl font-mono text-xs font-bold text-neutral-700 shadow-inner">
                      {isAr ? "الرقم المرجعي: " : "Ref #: "}{pendingRef}
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {isAr 
                        ? "لقد سجلنا المعاملة بنجاح، ونقوم بمطابقتها تفصيلياً مع إشعارات البنك لتفعيل ميزة تنزيل سيرتك فوراً." 
                        : "We registered the reference and are actively matching it against standard bank inputs."}
                    </p>
                  </div>

                  <div className="pt-3 space-y-2">
                    <button
                      onClick={() => handleCheckApproval()}
                      disabled={checkingApproval}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs bg-neutral-800 hover:bg-neutral-900 text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-40"
                    >
                      {checkingApproval ? (
                        <Loader2 size={15} className="animate-spin text-white" />
                      ) : (
                        <>
                          <RefreshCw size={13} className="animate-spin-slow" />
                          {isAr ? "تحديث حالة التفعيل الفوري" : "Check Approval Status"}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleClearPending}
                      className="text-[10px] text-neutral-400 hover:text-neutral-600 hover:underline block mx-auto py-1"
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
                  className="space-y-5"
                >
                  {/* Step 1: Transfer Details Box */}
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-150/40 p-5 space-y-3.5 shadow-inner">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border",
                        selectedMethod === "instapay" ? "bg-purple-100/60 text-purple-700 border-purple-200" : "bg-red-100/60 text-red-700 border-red-200"
                      )}>
                        {isAr ? "الخطوة الأولى" : "Step 1"}
                      </span>
                      <span className="text-xs font-bold text-neutral-500">
                        {isAr ? "تحويل محفظة رقمية" : "Send Digital Transfer"}
                      </span>
                    </div>
                    
                    {selectedMethod === "instapay" ? (
                      <div className="space-y-2.5">
                        <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                          {isAr ? "افتح تطبيق انستاباي الخاص بك وأرسل 50 جنيه لاسم المستخدم التالي:" : "Send exactly 50 EGP to this InstaPay Address:"}
                        </p>
                        <div className="flex items-center justify-between gap-3 bg-white border border-neutral-200/80 p-3 rounded-xl shadow-sm hover:border-purple-200 transition-colors">
                          <span className="font-mono font-black text-xs sm:text-sm text-purple-750 select-all tracking-wide">bassemramadaan@instapay</span>
                          <button
                            onClick={() => handleCopy("bassemramadaan@instapay", "ipa")}
                            className="p-1.5 bg-neutral-50 hover:bg-purple-50 hover:text-purple-600 border border-neutral-100 rounded-lg transition-all text-neutral-500"
                            title={isAr ? "نسخ العنوان" : "Copy Address"}
                          >
                            {copiedText === "ipa" ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 px-1">
                                <Check size={12} /> {isAr ? "تم!" : "Copied"}
                              </span>
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                          {isAr ? "قم بتحويل 50 جنيه كاش لمحفظة فودافون كاش التالية:" : "Transfer exactly 50 EGP to this Vodafone Cash wallet:"}
                        </p>
                        <div className="flex items-center justify-between gap-3 bg-white border border-neutral-200/80 p-3 rounded-xl shadow-sm hover:border-red-200 transition-colors">
                          <span className="font-mono font-black text-sm text-neutral-800 select-all tracking-wider">01101007965</span>
                          <button
                            onClick={() => handleCopy("01101007965", "phone")}
                            className="p-1.5 bg-neutral-50 hover:bg-red-50 hover:text-red-600 border border-neutral-100 rounded-lg transition-all text-neutral-500"
                            title={isAr ? "نسخ الرقم" : "Copy Wallet Number"}
                          >
                            {copiedText === "phone" ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 px-1">
                                <Check size={12} /> {isAr ? "تم!" : "Copied"}
                              </span>
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Form submission */}
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-3.5 rounded-full bg-brand-500 block" />
                      <h4 className="text-xs sm:text-sm font-black text-neutral-800">
                        {isAr ? "الخطوة الثانية: كتابة تفاصيل المعاملة للتأكيد الفوري" : "Step 2: Confirm Reference for Immediate Verification"}
                      </h4>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">
                          {isAr ? "الرقم المرجعي للمعاملة (11/12 رقم أو رقم العملية) *" : "Transaction Reference ID / Operation Number *"}
                        </label>
                        <input
                          type="text"
                          value={refNum}
                          onChange={(e) => setRefNum(e.target.value.replace(/\D/g, ""))}
                          placeholder={selectedMethod === "instapay" ? (isAr ? "مثال: 123456789101" : "e.g. 123456789101") : (isAr ? "رقم عملية فودافون كاش المرسل برسالة التأكيد" : "Vodafone Cash transaction ID")}
                          maxLength={18}
                          className="w-full bg-white border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-neutral-350"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">
                            {isAr ? "اسم المرسل للاستدلال" : "Sender Mobile / Account"}
                          </label>
                          <input
                            type="text"
                            value={senderNameOrPhone}
                            onChange={(e) => setSenderNameOrPhone(e.target.value)}
                            placeholder={isAr ? "مثال: باسم رمضان" : "e.g. Bassem"}
                            className="w-full bg-white border border-neutral-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-neutral-350"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">
                            {isAr ? "بريدك الإلكتروني" : "Your Email"}
                          </label>
                          <input
                            type="email"
                            value={userEmailInput}
                            onChange={(e) => setUserEmailInput(e.target.value)}
                            placeholder="yourname@domain.com"
                            className="w-full bg-white border border-neutral-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-neutral-350"
                          />
                        </div>
                      </div>

                      {/* Main Unlock CTA */}
                      <button
                        onClick={handleSubmitManualPayment}
                        disabled={submittingManual || !refNum}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs text-white uppercase tracking-wider shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed",
                          selectedMethod === "instapay" 
                            ? "bg-purple-600 hover:bg-purple-700 shadow-purple-100/50" 
                            : "bg-red-600 hover:bg-red-700 shadow-red-100/50"
                        )}
                      >
                        {submittingManual ? (
                          <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                          <>
                            <Lock size={13} className="text-white" />
                            {isAr ? "تسجيل التحويل ومطابقته فورياً" : "Submit & Check Approval"}
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { setSelectedMethod("card"); }}
                        className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 transition-all block mx-auto pt-1"
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
                  className="space-y-5"
                >
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-150/40 p-5 space-y-3 shadow-inner">
                    <span className="inline-flex bg-neutral-200 text-neutral-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {isAr ? "كود التفعيل الفوري" : "Activation Code"}
                    </span>
                    <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                      {isAr 
                        ? "إذا كان لديك كود مرسل مسبقاً من الإدارة، اكتبه بالأسفل لتفعيل ميزة تحميل سيرتك الذاتية بدون أي علامات مائية وبصيغ متعددة." 
                        : "Enter the precise activation code to unlock and download instantly."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 p-1.5 bg-neutral-50 rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-neutral-100 transition-all shadow-inner">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        placeholder="HASH-XXXX"
                        className="flex-1 px-4 bg-transparent font-mono uppercase tracking-[0.15em] text-xs sm:text-sm outline-none transition-all placeholder:text-neutral-300 placeholder:tracking-normal font-bold"
                      />
                      <button
                        onClick={handleVerify}
                        disabled={verifying || !code.trim()}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-black text-xs bg-neutral-800 text-white transition-all disabled:opacity-40 shadow-md hover:bg-neutral-900 cursor-pointer"
                      >
                        {verifying ? <Loader2 size={14} className="animate-spin text-white" /> : <><Lock size={12} /> {isAr ? "تحقق" : "Verify"}</>}
                      </button>
                    </div>

                    <div className="relative flex py-1.5 items-center">
                      <div className="flex-grow border-t border-neutral-150/80"></div>
                      <span className="flex-shrink mx-4 text-neutral-400 text-[10px] uppercase font-black tracking-widest">{isAr ? "أو" : "Or"}</span>
                      <div className="flex-grow border-t border-neutral-150/80"></div>
                    </div>

                    <a
                      href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs text-white transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-emerald-200 duration-250 cursor-pointer"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle size={15} />
                      {isAr ? "طلب كود تفعيل فوري عبر الواتساب" : "Request Code direct via WhatsApp"}
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Error alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500" />
                <p className={cn(
                  "text-xs text-rose-700 font-bold px-1.5 leading-relaxed flex items-start gap-1.5",
                  isAr ? "text-right" : "text-left"
                )}>
                  <span className="text-rose-500">●</span>
                  <span>{error}</span>
                </p>
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-5 sm:gap-8 py-4 border-t border-neutral-100">
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-450">
                <ShieldCheck size={14} className="text-emerald-500" />
                {isAr ? "تأمين 100%" : "Secure 100%"}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-450">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {isAr ? "تأكيد تلقائي ذكي" : "Smart Matching"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
