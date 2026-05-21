import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { LOGO_URL } from "../../constants";
import { cn } from "../../lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "instapay" | "vodafone" | "code";

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

  // Approval flow status and custom sharing features after approval is granted
  const [isApproved, setIsApproved] = useState(false);
  const [userPhone, setUserPhone] = useState(resumeData.personalInfo?.phone || "");

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
    if (resumeData.personalInfo?.phone && !userPhone) setUserPhone(resumeData.personalInfo.phone);
  }, [userFullEmail, userFullName, userEmailInput, senderNameOrPhone, resumeData.personalInfo?.phone, userPhone]);

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

  const getWhatsAppMessage = () => {
    const fullName = resumeData.personalInfo?.fullName || (isAr ? "فلان الفلاني" : "User");
    const jobTitle = resumeData.personalInfo?.jobTitle || (isAr ? "مطور برمجيات" : "Professional");
    const phone = resumeData.personalInfo?.phone || "";
    const email = resumeData.personalInfo?.email || "";

    const expText = resumeData.experience && resumeData.experience.length > 0
      ? resumeData.experience.slice(0, 3).map(e => `• ${e.position} - ${e.company}`).join("\n")
      : "";

    if (isAr) {
      return `*📝 نسخة من بيانات سيرتي الذاتية كـ (${jobTitle})*

مرحباً، إليك ملف سيرتي الذاتية المعتمد والجاهز للمشاركة الفورية:

*👤 الاسم الكريم:* ${fullName}
*💼 المسمى الوظيفي المستهدف:* ${jobTitle}

${expText ? `*💼 مقتطف من الخبرات المهنية:*\n${expText}\n` : ""}
*📞 للتواصل السريع والمباشر:*
• الهاتف: ${phone}
• البريد الإلكتروني: ${email}
• رابط السيرة الذاتية للتعديل والعرض المباشر: ${window.location.href}

_تم الإنشاء بنجاح وبأعلى معايير التوافق والذكاء الاصطناعي_`;
    } else {
      return `*📝 My Certified Professional Resume details: (${jobTitle})*

Hello, here is my updated resume details card for quick access and instant sharing:

*👤 Name:* ${fullName}
*💼 Target Career Title:* ${jobTitle}

${expText ? `*💼 Recent Experience Highlight:*\n${expText}\n` : ""}
*📞 Quick Contact Links:*
• Mobile/Phone: ${phone}
• Email: ${email}
• View/Download Live Link: ${window.location.href}

_Designed and optimized with professional ATS-compatible structure_`;
    }
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = userPhone.replace(/[^\d]/g, "");
    const message = encodeURIComponent(getWhatsAppMessage());

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
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
        useResumeStore.getState().unlockPremium();
        setIsApproved(true);
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
      const msg = err instanceof Error ? err.message : "Connection failed";
      setError(isAr ? `فشل التوصيل: ${msg}` : `Failed to connect to payments: ${msg}`);
    } finally {
      setSubmittingManual(false);
    }
  };

  // 3. Check if Admin marked Transaction as Approved
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
        useResumeStore.getState().unlockPremium();
        setIsApproved(true);
      } else {
        const defaultMsg = isAr
          ? "المعاملة قيد المراجعة حالياً من الإدارة. يرجى الانتظار دقيقة وجرب مرة أخرى."
          : "Your transaction is still under review. Please allow 1-5 minutes and click update again.";
        setError(result.message || defaultMsg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error polling Status";
      setError(isAr ? `فشل الحصول على الحالة: ${msg}` : `Failed to poll status: ${msg}`);
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
    ? `السلام عليكم، أرغب في الدفع عبر ${selectedMethod === "instapay" ? "InstaPay" : selectedMethod === "vodafone" ? "Vodafone Cash" : "كود تفعيل"} للحصول على كود Hash Resume`
    : `Hi, I want to pay via ${selectedMethod} to get my Hash Resume code.`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop overlay with modern blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.18)] overflow-hidden border border-slate-100 my-8 z-10"
          >
            {/* Elegant Brand Color Strip at the very top */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 to-[#FF4D2D] overflow-hidden" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-5 p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-full transition-all duration-200 z-20",
                isAr ? "left-5" : "right-5"
              )}
            >
              <X size={16} />
            </button>

            <div className="px-5 py-7 sm:px-8 sm:py-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              
              {isApproved ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-1 border border-emerald-100/50">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {isAr ? "تم تفعيل وتأكيد حسابك بنجاح! 🎉" : "Activation Confirmed & Approved! 🎉"}
                    </h3>
                    <p className="text-slate-500 font-semibold text-xs mt-2 px-1 leading-relaxed">
                      {isAr
                        ? "تهانينا! سيرتك الذاتية المهنية جاهزة الآن للتصدير اللانهائي وبأعلى معايير التوافق."
                        : "Congratulations! Your professional CV is unlocked for unlimited exports and sharing."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 text-start">
                    {/* Option 1: Save to Device */}
                    <div className="bg-slate-50 border border-slate-150/70 p-5 rounded-2xl relative overflow-hidden group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="p-2 bg-rose-50 text-[#FF4D2D] border border-rose-100 rounded-xl">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </div>
                        <h4 className="text-sm font-black text-slate-800">
                          {isAr ? "1. تنزيل ملف PDF وحفظه بالجهاز" : "1. Save CV to Device PDF"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold mb-4 leading-normal">
                        {isAr
                          ? "قم بتنزيل النسخة الرسمية المصممة بعناية فائقة وتجاوز فلاتر التوظيف تلقائياً على هاتفك أو كمبيوترك."
                          : "Save the formal print-ready PDF file directly to your file system for quick uploading to job portals."}
                      </p>
                      <button
                        onClick={onSuccess}
                        className="w-full h-11 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] active:scale-95 transition-all rounded-xl text-xs font-black shadow-md shadow-orange-500/10 cursor-pointer select-none"
                      >
                        {isAr ? "حفظ ملف الـ PDF على الجهاز" : "Save PDF to Device"}
                      </button>
                    </div>

                    {/* Option 2: Send directly to WhatsApp */}
                    <div className="bg-slate-50 border border-slate-150/70 p-5 rounded-2xl relative overflow-hidden group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800">
                          {isAr ? "2. إرسال السيرة الذاتية عبر الواتساب" : "2. Send CV Details to WhatsApp"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold mb-4 leading-normal">
                        {isAr
                          ? "سيقوم بإرسال ملف ملخص منسق بالكامل ببياناتك مع رابط استعراض مباشر وسريع ليكون متاحاً بمحادثتك دائماً."
                          : "Sends a beautifully structured text profile of your resume details and a direct access link to any chat."}
                      </p>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value.replace(/[^\d+]/g, ""))}
                            placeholder={isAr ? "رقم الواتساب الخاص بك" : "Your WhatsApp number"}
                            className="flex-1 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none rounded-xl px-3 py-2 text-xs font-black transition-all placeholder:text-slate-400"
                          />
                          <button
                            onClick={handleSendWhatsApp}
                            className="bg-[#128C7E] hover:bg-[#0e7065] text-white active:scale-95 transition-all rounded-xl text-xs font-black px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                          >
                            <MessageCircle size={14} />
                            <span>{isAr ? "إرسال الآن" : "Send Now"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={onClose}
                      className="text-xs font-black text-slate-400 hover:text-slate-600 px-4 py-2 transition-all cursor-pointer block mx-auto"
                    >
                      {isAr ? "إغلاق النافذة" : "Close window"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Top Header Block */}
                  <div className="flex flex-col items-center text-center mt-2 mb-6">
                    <div className="relative p-2 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3.5">
                      <img src={LOGO_URL} alt="Hash Resume Logo" className="h-9 w-auto" loading="lazy" />
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {isAr ? "تحميل السيرة الذاتية المهنية" : "Unlock Professional Export"}
                    </h2>
                    <p className="text-slate-500 font-semibold text-xs mt-1 px-4 leading-relaxed">
                      {isAr 
                        ? "تفعيل فوري لتنزيل وتحميل غير محدود (PDF / DOCX) بأعلى جودة وبدون أي علامة مائية" 
                        : "Instant activation for unlimited downloads (PDF / DOCX) in high quality with no watermark"}
                    </p>
                    
                    {/* Simplified Price Tag */}
                    <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-orange-50 text-[#FF4D2D] rounded-2xl border border-orange-100 shadow-sm">
                      <Sparkles size={14} className="text-[#FF4D2D] shrink-0" />
                      <span className="text-lg font-black tracking-tight flex items-baseline gap-1">
                        50 <span className="text-xs font-bold">{isAr ? "ج.م فقط" : "EGP"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Redesigned Payment Method Tabs (Extremely Cohesive & Simplified) */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-200/50 mb-6">
                    {[
                      { id: "instapay", label: isAr ? "انستاباي" : "InstaPay", icon: Zap },
                      { id: "vodafone", label: isAr ? "فودافون كاش" : "Vodafone", icon: Smartphone },
                      { id: "code", label: isAr ? "كود تفعيل" : "Verification Code", icon: CreditCard },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedMethod === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setSelectedMethod(item.id as PaymentMethod); setError(""); }}
                          className={cn(
                            "flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl text-center transition-all duration-200 cursor-pointer relative",
                            isSelected 
                              ? "bg-white text-[#FF4D2D] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-200/40" 
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <Icon size={15} className={cn("mb-1 transition-transform duration-200", isSelected ? "text-[#FF4D2D] scale-110" : "text-slate-400")} />
                          <span className="text-[10px] sm:text-[11px] font-black tracking-tight leading-none">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Content Panels */}
                  <div className="relative">
                    {pendingRef ? (
                      // SCREEN: Pending state with automatic approval check
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 bg-orange-50/50 p-5 rounded-2xl border border-orange-100 text-center relative overflow-hidden shadow-sm"
                      >
                        <div className="relative inline-flex">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400/20 opacity-75 animate-ping" />
                          <div className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#FF4D2D] shadow-sm border border-orange-100">
                            <Loader2 size={18} className="animate-spin text-[#FF4D2D]" />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-black text-orange-950">
                            {isAr ? "جاري مطابقة المعاملة تلقائياً" : "Verifying Transaction State"}
                          </h3>
                          <p className="text-[#FF4D2D]/85 text-[11px] font-semibold leading-normal mt-1 max-w-xs mx-auto">
                            {isAr 
                              ? "نسجل ونطابق الرقم المرجعي للمعاملة حالياً مع النظام، سيتم تفعيل حسابك مباشرة فور الاعتماد." 
                              : "We are actively tracing your submitted reference. High-quality exports will unlock shortly."}
                          </p>
                        </div>

                        <div className="bg-white/80 border border-orange-100/60 py-2 px-3 rounded-xl inline-block font-mono text-xs font-bold text-[#FF4D2D] shadow-sm select-all">
                          {isAr ? "معاملة رقم: " : "Ref #: "}{pendingRef}
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => handleCheckApproval()}
                            disabled={checkingApproval}
                            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-black text-xs bg-[#FF4D2D] hover:bg-[#E64528] text-white transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-40"
                          >
                            {checkingApproval ? (
                              <Loader2 size={15} className="animate-spin text-white" />
                            ) : (
                              <>
                                <RefreshCw size={12} className="animate-spin-slow" />
                                {isAr ? "تحقق من حالة الدفع فوراً" : "Re-Check Status Now"}
                              </>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleClearPending}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 block mx-auto py-1"
                          >
                            {isAr ? "إلغاء المطابقة وإدخال معاملة جديدة" : "Cancel and enter another transfer"}
                          </button>
                        </div>
                      </motion.div>
                    ) : selectedMethod === "instapay" || selectedMethod === "vodafone" ? (
                      // SCREEN: Manual Mobile Wallet Transfers
                      <motion.div
                        key={selectedMethod}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Transfer Guideline Card */}
                        <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-orange-100 text-[#FF4D2D] border border-orange-200">
                              {isAr ? "الخطوة 1" : "STEP 1"}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {isAr ? "أرسل مبلغ الدفع" : "Transfer Request"}
                            </span>
                          </div>
                          
                          {selectedMethod === "instapay" ? (
                            <div className="space-y-3.5">
                              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                {isAr 
                                  ? "اضغط على الرابط بالأسفل للتحويل السريع، أو امسح كود الـ QR بالتليفون للدفع الفوري:" 
                                  : "Tap the button below to pay, or scan the QR code to transfer instantly:"}
                              </p>

                              {/* Beautiful QR Code Framing */}
                              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-150/80 rounded-2xl shadow-xs max-w-[190px] mx-auto group hover:border-[#FF4D2D]/35 transition-colors">
                                <img 
                                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fipn.eg%2FS%2Fbassemramadaaaaan%2Finstapay%2F1LWlmU" 
                                  alt="InstaPay QR Code" 
                                  className="w-36 h-36 rounded-xl border border-slate-50 p-0.5 object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mt-2">
                                  {isAr ? "كود دفع انستاباي" : "InstaPay QR Code"}
                                </span>
                              </div>

                              {/* Quick Launch Action Button */}
                              <a 
                                href="https://ipn.eg/S/bassemramadaaaaan/instapay/1LWlmU"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-4 h-11 bg-orange-50 hover:bg-orange-100/90 text-[#FF4D2D] border border-orange-200/50 rounded-xl text-xs font-black transition-all shadow-2xs w-full text-center"
                              >
                                <Sparkles size={13} className="text-[#FF4D2D] shrink-0 animate-pulse" />
                                {isAr ? "اضغط لفتح تطبيق انستاباي والدفع" : "Tap Here to Open InstaPay App"}
                              </a>

                              {/* Backup Manual IPA Copy Option */}
                              <div className="space-y-1.5 pt-1 border-t border-slate-100/60">
                                <p className="text-[11px] text-slate-400 font-bold">
                                  {isAr ? "أو التحويل اليدوي لعنوان InstaPay التالي:" : "Or copy the InstaPay address manually:"}
                                </p>
                                <div className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-xl shadow-sm hover:border-[#FF4D2D]/40 transition-colors group">
                                  <span className="font-mono font-black text-xs sm:text-sm text-slate-800 select-all flex-1 tracking-wide">bassemramadaaaaan@instapay</span>
                                  <button
                                    onClick={() => handleCopy("bassemramadaaaaan@instapay", "ipa")}
                                    className="p-1.5 bg-slate-50 text-slate-400 hover:text-[#FF4D2D] border border-slate-100 rounded-lg transition-all"
                                  >
                                    {copiedText === "ipa" ? (
                                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#FF4D2D] px-1">
                                        <Check size={12} /> {isAr ? "تم" : "Done"}
                                      </span>
                                    ) : (
                                      <Copy size={13} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                {isAr ? "قم بتحويل 50 جنيه كاش إلى رقم محفظة فودافون كاش التالي:" : "Transfer exactly 50 EGP to this Vodafone Cash wallet:"}
                              </p>
                              <div className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-xl shadow-sm hover:border-[#FF4D2D]/40 transition-colors group">
                                <span className="font-mono font-black text-sm text-slate-800 select-all flex-1 tracking-wider">01101007965</span>
                                <button
                                  onClick={() => handleCopy("01101007965", "phone")}
                                  className="p-1.5 bg-slate-50 text-slate-400 hover:text-[#FF4D2D] border border-slate-100 rounded-lg transition-all"
                                >
                                  {copiedText === "phone" ? (
                                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#FF4D2D] px-1">
                                      <Check size={12} /> {isAr ? "تم" : "Done"}
                                    </span>
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Step 2 Form details */}
                        <div className="space-y-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-orange-100 text-[#FF4D2D] border border-orange-200">
                              {isAr ? "الخطوة 2" : "STEP 2"}
                            </span>
                            <h4 className="text-xs font-black text-slate-700">
                              {isAr ? "أدخل تفاصيل المعاملة للتأكيد الفوري والمطابقة" : "Confirm reference for verification"}
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                {isAr ? "الرقم المرجعي للمعاملة (Ref ID) *" : "Transaction Reference ID *"}
                              </label>
                              <input
                                type="text"
                                value={refNum}
                                onChange={(e) => setRefNum(e.target.value.replace(/\D/g, ""))}
                                placeholder={selectedMethod === "instapay" ? (isAr ? "مثال: 123456789101" : "e.g. 123456789101") : (isAr ? "اكتب رقم معاملة المحفظة" : "Wallet transaction ID")}
                                maxLength={18}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 focus:bg-white outline-none rounded-xl px-3 py-2.5 text-xs font-bold transition-all placeholder:text-slate-400"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                  {isAr ? "اسم المرسل" : "Sender Name"}
                                </label>
                                <input
                                  type="text"
                                  value={senderNameOrPhone}
                                  onChange={(e) => setSenderNameOrPhone(e.target.value)}
                                  placeholder={isAr ? "الاسم أو الهاتف" : "Name or phone"}
                                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 focus:bg-white outline-none rounded-xl px-3 py-2 text-xs font-bold transition-all placeholder:text-slate-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                  {isAr ? "البريد الإلكتروني" : "Your Email"}
                                </label>
                                <input
                                  type="email"
                                  value={userEmailInput}
                                  onChange={(e) => setUserEmailInput(e.target.value)}
                                  placeholder="e.g. name@domain.com"
                                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 focus:bg-white outline-none rounded-xl px-3 py-2 text-xs font-bold transition-all placeholder:text-slate-400"
                                />
                              </div>
                            </div>

                            {/* Submission Button */}
                            <div className="pt-1.5">
                              <button
                                onClick={handleSubmitManualPayment}
                                disabled={submittingManual || !refNum}
                                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-black text-xs text-white uppercase tracking-wider bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 cursor-pointer"
                              >
                                {submittingManual ? (
                                  <Loader2 size={16} className="animate-spin text-white" />
                                ) : (
                                  <>
                                    <Lock size={13} className="text-white shrink-0" />
                                    {isAr ? "تسجيل ومطابقة الكود فوراً" : "Submit and Match Code"}
                                  </>
                                )}
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => { setSelectedMethod("code"); }}
                              className="text-[10px] font-bold text-slate-400 hover:text-[#FF4D2D] transition-all block mx-auto py-1"
                            >
                              {isAr ? "لديك كود تفعيل؟ أدخله هنا مباشرة ←" : "Already have an activation code? Enter here →"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // SCREEN: Classic activation/voucher/purchased code verification
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-2">
                          <span className="inline-flex bg-white shadow-sm text-[#FF4D2D] text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-slate-200 animate-pulse">
                            {isAr ? "كود تفعيل مسبق" : "Voucher Code"}
                          </span>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {isAr 
                              ? "إذا تم تزويدك بكود تفعيل من الإدارة، اكتبه بالأسفل لتصدير وتحميل سيرتك الذاتية مجاناً." 
                              : "Enter the custom activation code provided to unlock high-fidelity downloads."}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-[#FF4D2D]/5 focus-within:border-[#FF4D2D]/70 transition-all">
                            <input
                              type="text"
                              value={code}
                              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                              placeholder="HASH-XXXX"
                              className="flex-1 px-3 bg-transparent font-mono uppercase tracking-widest text-xs outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal font-bold text-slate-800"
                            />
                            <button
                              onClick={handleVerify}
                              disabled={verifying || !code.trim()}
                              className="flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl font-black text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-45 cursor-pointer"
                            >
                              {verifying ? <Loader2 size={14} className="animate-spin text-white" /> : <><Lock size={12} /> {isAr ? "تأكيد" : "Verify"}</>}
                            </button>
                          </div>

                          {/* Separator */}
                          <div className="relative flex items-center justify-center my-3">
                            <div className="flex-grow border-t border-slate-100" />
                            <span className="flex-shrink mx-3 text-slate-300 text-[10px] font-black uppercase tracking-wider">{isAr ? "أو" : "OR"}</span>
                            <div className="flex-grow border-t border-slate-100" />
                          </div>

                          {/* WhatsApp trigger */}
                          <a
                            href={`https://wa.me/201101007965?text=${encodeURIComponent(whatsappMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white transition-all active:scale-[0.98] shadow-md shadow-orange-500/10 cursor-pointer font-sans"
                            style={{ backgroundColor: '#128C7E' }}
                          >
                            <MessageCircle size={15} />
                            {isAr ? "طلب كود تفعيل فوري عبر الواتساب" : "Request Code direct via WhatsApp"}
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Dynamic Error display with robust icon and styling */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 shadow-sm"
                    >
                      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-bold leading-relaxed max-w-xs">{error}</p>
                    </motion.div>
                  )}

                  {/* Secure checkout badges */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ShieldCheck size={14} className="text-[#FF4D2D]" />
                      {isAr ? "آمن 100%" : "Secure Check"}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <CheckCircle2 size={14} className="text-[#FF4D2D]" />
                      {isAr ? "مراجعة فورية" : "Verified Direct"}
                    </div>
                  </div>
                </>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
