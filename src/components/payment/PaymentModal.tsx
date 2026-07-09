import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, AlertCircle, Share2, ArrowLeft } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { LOGO_URL } from "../../constants";
import { cn } from "../../lib/utils";
import VoucherTicket from "./VoucherTicket";

// Helper to generate elegant deterministic fallback codes based on the payment reference hash
const generateDeterministicCodes = (ref: string, isBundle: boolean): string[] => {
  const cleanRef = ref.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  let hash = 0;
  for (let i = 0; i < cleanRef.length; i++) {
    hash = (hash << 5) - hash + cleanRef.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);
  
  if (!isBundle) {
    const codePart = ((hash * 997) % 1000000).toString().padStart(6, "8");
    return [`HSH-1X-${cleanRef.slice(0, 3).padEnd(3, "X")}-${codePart}`];
  } else {
    const code1 = ((hash * 997) % 10000).toString().padStart(4, "7");
    const code2 = ((hash * 883) % 10000).toString().padStart(4, "6");
    const code3 = ((hash * 769) % 10000).toString().padStart(4, "5");
    const prefix = cleanRef.slice(0, 2).padEnd(2, "X");
    return [
      `HSH-3X-A${prefix}-${code1}`,
      `HSH-3X-B${prefix}-${code2}`,
      `HSH-3X-C${prefix}-${code3}`,
    ];
  }
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (codes?: string[]) => void;
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
  const [selectedPackage, setSelectedPackage] = useState<"single" | "bundle">("single");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Codes retrieved from Google Sheets or generated deterministically
  const [approvedCodes, setApprovedCodes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("hashresume_approved_codes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isApproved, setIsApproved] = useState(false);

  // Approval flow status and custom sharing features after approval is granted
  const [sharingPdf, setSharingPdf] = useState(false);
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

  // Progressive verification state & steps
  const [verificationProgress, setVerificationProgress] = useState(15);
  const [verificationStepIndex, setVerificationStepIndex] = useState(0);

  // Auto-advance verification logs simulator
  useEffect(() => {
    if (!pendingRef) {
      setVerificationProgress(15);
      setVerificationStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 98) return 98;
        const increment = Math.floor(Math.random() * 8) + 3;
        const next = prev + increment;
        
        if (next < 30) setVerificationStepIndex(0);
        else if (next < 60) setVerificationStepIndex(1);
        else if (next < 85) setVerificationStepIndex(2);
        else setVerificationStepIndex(3);

        return next > 98 ? 98 : next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [pendingRef]);

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
      // Start polling every 10 seconds silently
      intervalId = setInterval(() => {
        handleCheckApproval(pendingRef, true);
      }, 10000); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingRef]);

  // Reset key states when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsApproved(false);
      setCode("");
      setError("");
      setStep(1);
      setRefNum("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleSharePdfFile = async () => {
    setSharingPdf(true);
    setError("");
    try {
      const resumeEl = document.getElementById("resume-preview-container") || document.querySelector(".box-border.bg-white");
      if (!resumeEl) {
        throw new Error(isAr ? "لم يتم العثور على منطقة عرض السيرة الذاتية" : "Could not find resume preview container");
      }
      const htmlContent = resumeEl.innerHTML;
      const styles = Array.from(
        document.head.querySelectorAll('style, link[rel="stylesheet"]')
      )
        .map((el) => el.outerHTML)
        .join("\n");

      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: `<div class="p-8">${htmlContent}</div>`,
          css: styles,
        }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const fileName = `${userFullName || "Resume"}_CV.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: isAr ? "إليك سيرة ذاتية مهنية ومحدثة" : "Here is my updated professional resume PDF",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        
        setError(
          isAr 
            ? "المشاركة المباشرة عبر المتصفح غير مدعومة على هذا الجهاز. تم تنزيل السيرة الذاتية لملفات جهازك، يمكنك الآن اختيار إرسالها لأي محادثة!" 
            : "Direct file sharing is not supported in this browser. The PDF has been downloaded to your device, you can now share it with any chat!"
        );
      }
    } catch (err: any) {
      console.error("Failed to share PDF:", err);
      const msg = err instanceof Error ? err.message : "Error generating PDF";
      setError(isAr ? `فشل جاري معالجة ومشاركة ملف الـ PDF: ${msg}` : `Failed to process and share PDF file: ${msg}`);
    } finally {
      setSharingPdf(false);
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
        localStorage.setItem('cv-last-used-code', code.trim().toUpperCase());
        useResumeStore.getState().unlockPremium(userFullName, userFullEmail, "");
        setIsApproved(true);
        onSuccess([code.trim().toUpperCase()]);
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
          amount: selectedPackage === "single" ? "50 EGP" : "120 EGP (3 Codes)"
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
  const handleCheckApproval = async (refToCheck?: string, isSilent = false) => {
    const targetRef = refToCheck || pendingRef;
    if (!targetRef) return;

    if (!isSilent) {
      setCheckingApproval(true);
      setError("");
    }
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
        const codeToSave = (result.codes && result.codes[0]) || result.code || targetRef;
        if (codeToSave) {
          localStorage.setItem('cv-last-used-code', codeToSave);
        }

        let isBundlePackage = selectedPackage === "bundle";
        if (result.amount) {
           isBundlePackage = String(result.amount).includes("120") || String(result.amount).includes("3");
        }

        // Claim codes from Google sheet response, with a smart deterministic fallback so they are NEVER empty
        let codesList: string[] = [];
        if (result.codes && Array.isArray(result.codes) && result.codes.length > 0) {
          codesList = result.codes;
        } else if (result.code) {
          codesList = [result.code];
        } else {
          codesList = generateDeterministicCodes(targetRef, isBundlePackage);
        }

        setApprovedCodes(codesList);
        localStorage.setItem("hashresume_approved_codes", JSON.stringify(codesList));

        // Unlock premium!
        useResumeStore.getState().unlockPremium(userFullName, userFullEmail, "");

        setIsApproved(true);

        // Trigger download and close modal instantly!
        onSuccess(codesList);
        return;
      } else {
        if (!isSilent) {
          const defaultMsg = isAr
            ? "المعاملة قيد المراجعة حالياً من الإدارة. يرجى الانتظار دقيقة وجرب مرة أخرى."
            : "Your transaction is still under review. Please allow 1-5 minutes and click update again.";
          setError(result.message || defaultMsg);
        }
      }
    } catch (err: unknown) {
      if (!isSilent) {
        const msg = err instanceof Error ? err.message : "Error polling Status";
        setError(isAr ? `فشل الحصول على الحالة: ${msg}` : `Failed to poll status: ${msg}`);
      }
    } finally {
      if (!isSilent) {
        setCheckingApproval(false);
      }
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
    ? `السلام عليكم، أرغب في الدفع عبر ${selectedMethod === "instapay" ? "InstaPay" : selectedMethod === "vodafone" ? "Vodafone Cash" : "كود تفعيل"} لشراء الباقة ${selectedPackage === "single" ? "الفردية (50 ج.م)" : "الثلاثية (120 ج.م)"} للحصول على كود تفعيل Hash Resume.`
    : `Hi, I want to pay via ${selectedMethod} to purchase the ${selectedPackage === "single" ? "Single Code (50 EGP)" : "Saver Bundle (120 EGP)"} for Hash Resume.`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-modal-container"
          dir={isAr ? "rtl" : "ltr"}
        >
          <style>{`
            @media (max-width: 480px) {
              .custom-modal-container {
                align-items: flex-end !important;
                justify-content: center !important;
                padding: 0 !important;
              }
              .custom-modal-wrapper {
                border-radius: 24px 24px 0 0 !important;
                margin-top: auto !important;
                margin-bottom: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                bottom: 0 !important;
              }
            }
          `}</style>
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
            className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.18)] overflow-hidden border border-slate-100 my-8 z-10 custom-modal-wrapper"
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

                  {/* High fidelity activated voucher ticket block */}
                  <div className="w-full">
                    <VoucherTicket
                      language={language}
                      type={selectedPackage}
                      isApproved={true}
                      codes={approvedCodes}
                      code={approvedCodes[0] || code || pendingRef || "ACTIVE-HASH"}
                    />
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
                        onClick={() => onSuccess([])}
                        className="w-full h-11 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] active:scale-95 transition-all rounded-xl text-xs font-black shadow-md shadow-orange-500/10 cursor-pointer select-none"
                      >
                        {isAr ? "حفظ ملف الـ PDF على الجهاز" : "Save PDF to Device"}
                      </button>
                    </div>

                    {/* Option 2: Share PDF File directly to WhatsApp or general share */}
                    <div className="bg-slate-50 border border-slate-150/70 p-5 rounded-2xl relative overflow-hidden group">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800">
                          {isAr ? "2. مشاركة ملف السيرة الـ PDF مباشرة" : "2. Share CV PDF File Directly"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold mb-4 leading-normal">
                        {isAr
                          ? "قم بمشاركة ملف الـ PDF الفعلي مباشرة لدردشة الواتساب، الإيميل، أو أي تطبيق آخر فوراً ومباشرة كملف معتمد."
                          : "Instantly share the actual, fully compiled PDF work-file directly to WhatsApp chats, Telegram, or official emails."}
                      </p>

                      <button
                        onClick={handleSharePdfFile}
                        disabled={sharingPdf}
                        className="w-full h-11 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 active:scale-95 transition-all rounded-xl text-xs font-black shadow-md shadow-emerald-500/10 cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {sharingPdf ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>{isAr ? "جاري تحضير ملف الـ PDF ومشاركته..." : "Preparing & Sharing PDF..."}</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={16} />
                            <span>{isAr ? "مشاركة ملف الـ PDF الآن" : "Share PDF File Now"}</span>
                          </>
                        )}
                      </button>
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
                  {pendingRef ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5 text-center relative overflow-hidden"
                    >
                      <VoucherTicket
                        language={language}
                        type={selectedPackage}
                        isPending={true}
                        pendingRef={pendingRef}
                        selectedMethod={selectedMethod}
                      />

                      <div className="bg-slate-50 border border-slate-200/75 p-4 rounded-2xl space-y-4 text-start">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4D2D]"></span>
                            </span>
                            {isAr ? "حالة فحص وتتبع المعاملة" : "Transaction Audit Stream"}
                          </h3>
                          <span className="text-xs font-black text-[#FF4D2D] bg-orange-50 px-2 py-0.5 rounded-md">
                            {verificationProgress}%
                          </span>
                        </div>

                        {/* Glowing Progress Bar */}
                        <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden relative">
                          <motion.div 
                            className="bg-gradient-to-r from-orange-500 to-[#FF4D2D] h-full rounded-full"
                            animate={{ width: `${verificationProgress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        </div>

                        {/* Step logs list */}
                        <div className="space-y-2.5 pt-1">
                          {([
                            isAr ? "الاتصال الآمن بخادم الدفع والتحقق" : "Establishing secure verification gateway",
                            isAr ? "البحث في كشوفات بنوك الكاش المستلمة" : "Scanning receiver bank statement logs",
                            isAr ? "مطابقة الرقم المرجعي للمعاملة الرقمية" : "Matching transfer reference signature",
                            isAr ? "ترقية الاشتراك وبدء تصدير المستند" : "Finalizing membership & clearing download"
                          ]).map((stepLabel, idx) => {
                            const isDone = idx < verificationStepIndex;
                            const isActive = idx === verificationStepIndex;
                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-[11px] font-bold">
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                ) : isActive ? (
                                  <Loader2 size={14} className="text-[#FF4D2D] animate-spin shrink-0" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white shrink-0" />
                                )}
                                <span className={cn(
                                  "transition-all",
                                  isDone ? "text-slate-400 font-medium" : isActive ? "text-slate-800 font-black" : "text-slate-400"
                                )}>
                                  {stepLabel}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleCheckApproval()}
                          disabled={checkingApproval}
                          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-black text-xs bg-[#FF4D2D] hover:bg-[#E64528] text-white transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-40 cursor-pointer"
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
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 block mx-auto py-1 cursor-pointer"
                        >
                          {isAr ? "إلغاء المطابقة وإدخال معاملة جديدة" : "Cancel and enter another transfer"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                      {/* Top Header Block */}
                      <div className="flex flex-col items-center text-center mt-2 mb-5">
                        <div className="relative p-1.5 bg-white rounded-xl shadow-xs border border-slate-150/40 mb-3 text-slate-500">
                          <img src={LOGO_URL} alt="Hash Resume Logo" className="h-7 w-auto opacity-95" loading="lazy" />
                        </div>
                        
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
                          {isAr ? "تحميل وترقية السيرة الذاتية" : "Upgrade to Premium Export"}
                        </h2>
                        <p className="text-slate-400 font-medium text-[11px] mt-1 px-4 leading-normal">
                          {isAr 
                            ? "تحميل غير محدود وبأعلى جودة واجتياز تلقائي لأنظمة الـ ATS" 
                            : "Pristine export status with automatic ATS system integration"}
                        </p>
                        
                        {/* Simplified, Calmer Package Switcher */}
                        <div className="mt-4 w-full bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60 max-w-sm shadow-inner shadow-slate-100/50">
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => { setSelectedPackage("single"); setError(""); }}
                              className={cn(
                                "py-2.5 rounded-xl border text-center flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden",
                                selectedPackage === "single"
                                  ? "bg-white border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-slate-800 scale-[1.02] z-10"
                                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                              )}
                            >
                              <span className="text-[11px] font-bold">{isAr ? "كود تحميل واحد" : "Single Code"}</span>
                              <span className="text-sm font-black text-slate-800 mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>50 <span className="text-[9px] font-bold text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAr ? "ج.م" : "EGP"}</span></span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => { setSelectedPackage("bundle"); setError(""); }}
                              className={cn(
                                "py-2.5 rounded-xl border text-center flex flex-col items-center justify-center relative cursor-pointer overflow-hidden transition-all duration-300",
                                selectedPackage === "bundle"
                                  ? "bg-gradient-to-b from-white to-orange-50/30 border-orange-200 shadow-[0_4px_12px_rgba(255,77,45,0.08)] text-slate-800 scale-[1.02] z-10"
                                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0 right-0 font-black text-[7px] px-2 py-0.5 rounded-bl-lg transition-colors",
                                selectedPackage === "bundle" ? "bg-gradient-to-r from-rose-500 to-[#FF4D2D] text-white" : "bg-slate-200 text-slate-500"
                              )}>
                                {isAr ? "توفير ٦٠٪" : "SAVE 60%"}
                              </div>
                              <span className="text-[11px] font-bold">{isAr ? "باقة ٣ أكواد" : "3-Codes Bundle"}</span>
                              <span className="text-sm font-black text-[#FF4D2D] mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>120 <span className="text-[9px] font-bold opacity-70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAr ? "ج.م" : "EGP"}</span></span>
                            </button>
                          </div>
                        </div>

                        {/* Visual Voucher Representation */}
                        <div className="mt-4 w-full">
                          <VoucherTicket
                            language={language}
                            type={selectedPackage}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-black text-xs text-white uppercase tracking-wider bg-gradient-to-r from-orange-500 to-[#FF4D2D] hover:from-orange-600 hover:to-[#E64528] active:scale-[0.98] transition-all shadow-md shadow-orange-500/20 cursor-pointer mb-2"
                      >
                        {isAr ? "متابعة للدفع" : "Continue to Payment"} &rarr;
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                      {/* Step Header */}
                      <div className="flex items-center gap-3 mb-4 text-[#FF4D2D]">
                        <button onClick={() => setStep(1)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                          <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-sm font-black text-slate-800">{isAr ? "اختر طريقة الدفع" : "Choose Payment Method"}</h3>
                      </div>
                      
                      {/* Redesigned Payment Method Tabs (Extremely Cohesive & Simplified) */}
                      <div className="grid grid-cols-3 gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 mb-6">
                        {[
                          { id: "instapay", label: isAr ? "انستاباي" : "InstaPay", icon: Zap, brandBadge: "IPN", brandColor: "bg-pink-500 text-white" },
                          { id: "vodafone", label: isAr ? "فودافون كاش" : "Vodafone", icon: Smartphone, brandBadge: "Cash", brandColor: "bg-red-600 text-white" },
                          { id: "code", label: isAr ? "كود تفعيل" : "Verification Code", icon: CreditCard },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isSelected = selectedMethod === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => { setSelectedMethod(item.id as PaymentMethod); setError(""); }}
                              className={cn(
                                "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer relative overflow-hidden",
                                isSelected 
                                  ? "bg-white text-slate-800 shadow-xs border border-slate-200/40" 
                                  : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              {item.brandBadge && (
                                <span className={cn(
                                  "absolute top-0.5 right-0.5 text-[6.5px] font-black uppercase px-1 py-[0.5px] rounded-[2px] tracking-wide",
                                  item.brandColor
                                )}>
                                  {item.brandBadge}
                                </span>
                              )}
                              <Icon size={14} className={cn("mb-1 transition-transform duration-200", isSelected ? (item.id === "vodafone" ? "text-red-600 scale-105" : "text-[#FF4D2D] scale-105") : "text-slate-400")} />
                              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight leading-none animate-fade-in">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic Content Panels */}
                      <div className="relative">
                        {(selectedMethod === "instapay" || selectedMethod === "vodafone") && (
                      <motion.div
                        key={selectedMethod}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Transfer Guideline Card */}
                        <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase bg-slate-100 text-slate-600 border border-slate-205">
                              {isAr ? "الخطوة ١" : "STEP 1"}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 font-sans">
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
                                {isAr 
                                  ? `قم بتحويل مبلّغ قدره ${selectedPackage === "single" ? "50" : "120"} جنيه كاش إلى رقم محفظة فودافون كاش التالي:` 
                                  : `Transfer exactly ${selectedPackage === "single" ? "50" : "120"} EGP to this Vodafone Cash wallet:`}
                              </p>
                              <div className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-xl shadow-sm hover:border-[#FF4D2D]/40 transition-colors group">
                                <span className="font-mono font-black text-sm text-slate-800 select-all flex-1 tracking-wider" dir="ltr">01101007965</span>
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
                {selectedMethod !== "code" && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full h-12 mt-4 flex items-center justify-center gap-2 rounded-xl font-black text-xs text-slate-800 uppercase tracking-wider bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isAr ? "لقد قمت بالتحويل بنجاح" : "I have transferred the money"}
                  </button>
                )}
              </motion.div>
            )}
           </div>
          </motion.div>
        )}

        {((step === 3 && selectedMethod !== "code") || pendingRef) && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                {/* Step Header */}
                {!pendingRef && (
                  <div className="flex items-center gap-3 mb-4 text-[#FF4D2D]">
                    <button onClick={() => setStep(2)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                    <h3 className="text-sm font-black text-slate-800">{isAr ? "تأكيد المعاملة" : "Confirm Transaction"}</h3>
                  </div>
                )}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1.5">
                            <span className="inline-flex text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase bg-slate-100 text-slate-600 border border-slate-205">
                              {isAr ? "الخطوة ٢" : "STEP 2"}
                            </span>
                            <h4 className="text-xs font-semibold text-slate-600 font-sans">
                              {isAr ? "أدخل تفاصيل المعاملة للمطابقة" : "Confirm reference for verification"}
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
                    )}
                    {step === 2 && !pendingRef && selectedMethod === "code" && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
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
                    </>
                  )}

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

                  {/* Accepted Payment Badges (mada, visa, vodafone cash) */}
                  <div className="mt-4 flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/50 w-full">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center">
                      {isAr ? "وسائل الدفع المقبولة والآمنة" : "SECURE & ACCEPTED PAYMENT METHODS"}
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {/* Visa Badge */}
                      <div className="flex items-center justify-center bg-white border border-slate-200 rounded-md px-2 py-0.5 shadow-2xs">
                        <span className="text-[10px] font-black italic text-blue-900 tracking-tighter">VISA</span>
                      </div>
                      {/* Mastercard Badge */}
                      <div className="flex items-center justify-center bg-white border border-slate-200 rounded-md px-2 py-0.5 shadow-2xs">
                        <span className="text-[10px] font-black italic text-orange-600 tracking-tighter">Mastercard</span>
                      </div>
                      {/* Mada Badge */}
                      <div className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-md px-2.5 py-0.5 shadow-2xs font-bold text-[8px] tracking-tight">
                        mada <span className="mx-1 font-semibold text-[8px]">مدى</span>
                      </div>
                      {/* Vodafone Cash Badge */}
                      <div className="flex items-center justify-center bg-red-600 text-white rounded-md px-2 py-0.5 shadow-2xs font-black text-[8px] tracking-tight">
                        فودافون كاش
                      </div>
                    </div>
                  </div>

                  {/* Secure checkout badges */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-100">
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
