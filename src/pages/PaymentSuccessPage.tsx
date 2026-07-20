import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  CheckCircle, Copy, Check, MessageCircle, ArrowRight, Loader2, 
  Sparkles, RefreshCw, Award, Download
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";

export default function PaymentSuccessPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [searchParams] = useSearchParams();

  // Search parameters
  const refNum = searchParams.get("ref") || "";
  const email = searchParams.get("email") || "";
  const amount = searchParams.get("amount") || "50";
  const isBundle = searchParams.get("plan") === "bundle";
  const _method = searchParams.get("method") || "instapay";
  const isSimulated = searchParams.get("simulated") === "true";

  // State
  const [copiedText, setCopiedText] = useState("");
  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [approvedCodes, setApprovedCodes] = useState<string[]>([]);
  const [verificationProgress, setVerificationProgress] = useState(10);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [checking, setChecking] = useState(false);

  // Steps explanation
  const steps = isAr ? [
    "تلقي إخطار المعاملة الرقمية",
    "مطابقة المعاملة المسجلة بالنظام",
    "التحقق من القيمة المرسلة",
    "توليد وتنشيط أكواد التحميل"
  ] : [
    "Receiving digital transaction alert",
    "Matching transaction record in system",
    "Validating transferred amount",
    "Generating & activating download codes"
  ];

  // Progressive verification bar
  useEffect(() => {
    const timer = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 95) return 95;
        const add = Math.floor(Math.random() * 8) + 4;
        const next = prev + add;
        if (next < 30) setActiveStepIndex(0);
        else if (next < 60) setActiveStepIndex(1);
        else if (next < 85) setActiveStepIndex(2);
        else setActiveStepIndex(3);
        return next;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Poll server for approval
  useEffect(() => {
    if (!refNum) return;

    const handleCheckApproval = async (isSilent = false) => {
      if (!isSilent) setChecking(true);
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "checkStatus",
            reference: refNum,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success === true && result.status === "approved") {
            setStatus("approved");
            setVerificationProgress(100);
            setActiveStepIndex(3);

            // Get codes
            let codes: string[] = [];
            if (result.codes && Array.isArray(result.codes)) {
              codes = result.codes;
            } else if (result.code) {
              codes = [result.code];
            } else {
              codes = generateDeterministicFallback(refNum, isBundle);
            }
            setApprovedCodes(codes);
            localStorage.setItem("hashresume_approved_codes", JSON.stringify(codes));
            if (codes[0]) {
              localStorage.setItem("cv-last-used-code", codes[0]);
            }
            useResumeStore.getState().unlockPremium(
              useResumeStore.getState().data.personalInfo?.fullName || "User",
              email || "user@hashresume.com",
              ""
            );
          }
        }
      } catch (err) {
        console.error("Failed to check approval status:", err);
      } finally {
        if (!isSilent) setChecking(false);
      }
    };

    // Fast check first
    handleCheckApproval();

    // Loop check every 8 seconds
    const interval = setInterval(() => {
      handleCheckApproval(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [refNum, isBundle, email]);

  // Fallback simulator for demo / local resilience
  useEffect(() => {
    if (status === "approved") return;

    if (isSimulated) {
      // Simulate automatic approval after 12 seconds in demo mode
      const timer = setTimeout(() => {
        setStatus("approved");
        setVerificationProgress(100);
        setActiveStepIndex(3);
        const codes = generateDeterministicFallback(refNum, isBundle);
        setApprovedCodes(codes);
        localStorage.setItem("hashresume_approved_codes", JSON.stringify(codes));
        if (codes[0]) {
          localStorage.setItem("cv-last-used-code", codes[0]);
        }
        useResumeStore.getState().unlockPremium(
          useResumeStore.getState().data.personalInfo?.fullName || "User",
          email || "user@hashresume.com",
          ""
        );
      }, 12000);

      return () => clearTimeout(timer);
    }
  }, [isSimulated, status, refNum, isBundle, email]);

  const generateDeterministicFallback = (ref: string, bundle: boolean): string[] => {
    const clean = ref.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);
    
    if (!bundle) {
      const codePart = ((hash * 997) % 1000000).toString().padStart(6, "8");
      return [`HSH-1X-${clean.slice(0, 3).padEnd(3, "X")}-${codePart}`];
    } else {
      const code1 = ((hash * 997) % 10000).toString().padStart(4, "7");
      const code2 = ((hash * 883) % 10000).toString().padStart(4, "6");
      const code3 = ((hash * 769) % 10000).toString().padStart(4, "5");
      const prefix = clean.slice(0, 2).padEnd(2, "X");
      return [
        `HSH-3X-A${prefix}-${code1}`,
        `HSH-3X-B${prefix}-${code2}`,
        `HSH-3X-C${prefix}-${code3}`,
      ];
    }
  };

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // WhatsApp share link
  const getWhatsAppShareUrl = () => {
    const codesStr = approvedCodes.join(", ");
    const text = isAr 
      ? `مرحباً! لقد قمت بتفعيل باقتي على موقع HashResume.com بنجاح 🎉\nأكواد التفعيل الخاصة بي: ${codesStr}\nرقم المرجعية: ${refNum}`
      : `Hi! I just activated my resume package on HashResume.com successfully 🎉\nMy Activation Code(s): ${codesStr}\nReference Num: ${refNum}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Email share link
  const getEmailShareUrl = () => {
    const codesStr = approvedCodes.join("\n- ");
    const subject = isAr ? "أكواد تحميل سيرة ذاتية Hash Resume" : "Your Hash Resume Activation Codes";
    const body = isAr
      ? `أهلاً بك،\n\nلقد تم تأكيد دفعتك بقيمة ${amount} ج.م بنجاح!\n\nأكواد التفعيل الخاصة بك:\n- ${codesStr}\n\nيمكنك استخدام هذه الأكواد في محرر السير الذاتية لتحميل ملفات الـ PDF مباشرة.\n\nرقم العملية المرجعي: ${refNum}\n\nشكراً لاستخدامك موقع HashResume.`
      : `Hello,\n\nYour payment of ${amount} EGP has been verified successfully!\n\nYour Activation Codes:\n- ${codesStr}\n\nYou can input these codes directly inside the resume editor to export watermark-free PDFs.\n\nTransaction Ref: ${refNum}\n\nThank you for choosing Hash Resume.`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Helmet>
        <title>
          {isAr ? "تحقق من الدفع والرمز المرجعي | Hash Resume" : "Verify Payment & Release Codes | Hash Resume"}
        </title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 flex flex-col justify-center items-center px-4" dir={isAr ? "rtl" : "ltr"}>
        
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/60 shadow-xl space-y-8 relative overflow-hidden">
          {/* Top highlight visual */}
          <div className={`absolute top-0 inset-x-0 h-3 bg-gradient-to-r ${status === "approved" ? "from-emerald-400 to-teal-500 animate-pulse" : "from-orange-400 to-rose-500"}`} />

          {status !== "approved" ? (
            /* Pending state view */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-[#001639]">
                <Loader2 size={32} className="animate-spin" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isAr ? "جاري تدقيق معاملتك الرقمية" : "Verifying Digital Transfer..."}
                </h1>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {isAr 
                    ? `تلقينا طلبك برقم العملية ${refNum}. نتحقق حالياً من التحويل الرقمي لتأكيد وإصدار أكواد السير الذاتية.` 
                    : `We are verifying your transaction ID ${refNum}. Your download codes will be released automatically within minutes.`}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider font-mono">
                  <span>{isAr ? "نسبة التحقق" : "Verification Progress"}</span>
                  <span>{verificationProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#001639] to-[#000a1b] rounded-full transition-all duration-1000"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>
              </div>

              {/* Progressive logs */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 text-start max-w-md mx-auto border border-slate-150 space-y-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {isAr ? "خطوات التدقيق المالي" : "Verification Pipeline Status"}
                </h4>
                
                <div className="space-y-2.5">
                  {steps.map((stepDesc, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-medium">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        idx < activeStepIndex 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : idx === activeStepIndex 
                            ? "border-orange-500 text-orange-500 animate-pulse" 
                            : "border-slate-200 text-slate-300"
                      }`}>
                        {idx < activeStepIndex && <Check size={10} strokeWidth={3} />}
                        {idx === activeStepIndex && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                      </div>
                      <span className={idx === activeStepIndex ? "font-bold text-slate-800" : idx < activeStepIndex ? "text-slate-500 line-through decoration-slate-200" : "text-slate-400"}>
                        {stepDesc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
                  <span>{isAr ? "تحديث الحالة يدوياً" : "Check for Status Update"}</span>
                </button>
                <a
                  href={`https://wa.me/201101007965?text=${encodeURIComponent(isAr ? `أهلاً، أريد الاستفسار عن كود تفعيل المعاملة رقم: ${refNum}` : `Hi, I want to inquire about activation code for transaction: ${refNum}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>{isAr ? "مساعدة عبر واتساب" : "Support on WhatsApp"}</span>
                </a>
              </div>
            </div>
          ) : (
            /* Approved success state view */
            <div className="text-center space-y-6">
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-100/60 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                  {isAr ? "تم تأكيد الدفعة بنجاح" : "PAYMENT APPROVED"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isAr ? "أكواد التحميل جاهزة!" : "Your Codes Are Ready!"}
                </h1>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {isAr 
                    ? `شكراً لثقتك! تم التحقق من معاملتك ${refNum} بنجاح. انسخ كود التفعيل وأدخله في المحرر لتحميل سيرتك الذاتية.` 
                    : `Thank you! Your transfer ${refNum} was confirmed. Copy the code(s) below and enter them in the editor to download.`}
                </p>
              </div>

              {/* Codes Container with Tickets layout */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                {approvedCodes.map((codeStr, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-50 hover:bg-slate-100/50 rounded-2xl p-4 sm:p-5 border border-slate-200 relative overflow-hidden flex items-center justify-between transition-all"
                  >
                    {/* Ticket side notches */}
                    <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-white border border-slate-200 rounded-full" />
                    <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-white border border-slate-200 rounded-full" />

                    <div className="ps-4">
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        <Award size={10} className="text-orange-500" />
                        <span>{isAr ? `كود رقم ${idx + 1}` : `Code #${idx + 1}`}</span>
                      </div>
                      <span className="font-extrabold text-slate-800 tracking-wide font-mono select-all text-sm sm:text-base">
                        {codeStr}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeStr, codeStr)}
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black flex items-center gap-1 text-[#001639] transition-all cursor-pointer shadow-xs active:scale-95 me-4"
                    >
                      {copiedText === codeStr ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-emerald-600">{isAr ? "تم نسخ!" : "Copied!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>{isAr ? "نسخ الكود" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Share & Receive layout */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-4">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>{isAr ? "إرسال الكود عبر واتساب" : "Send code via WhatsApp"}</span>
                </a>
                
                {email && (
                  <a
                    href={getEmailShareUrl()}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} className="text-orange-500" />
                    <span>{isAr ? "إرسال الكود للبريد" : "Email my code"}</span>
                  </a>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 max-w-md mx-auto space-y-3">
                <Link
                  to="/editor?download=pdf"
                  className="w-full bg-gradient-to-r from-[#001639] to-[#000a1b] hover:from-[#000d23] hover:to-[#000612] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-98"
                >
                  <Download size={16} className="animate-bounce" />
                  <span>{isAr ? "تحميل السيرة الذاتية PDF الآن 🚀" : "Download Resume PDF Now 🚀"}</span>
                </Link>

                <Link
                  to="/editor"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <span>{isAr ? "دخول محرر السيرة الذاتية" : "Go to Resume Editor"}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
              </div>

            </div>
          )}

        </div>

      </div>
    </>
  );
}
