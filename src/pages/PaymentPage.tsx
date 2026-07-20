import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ArrowRight, ArrowLeft, Smartphone, ShieldCheck, 
  Copy, Sparkles, Loader2, Info, CheckCircle2, Ticket, HelpCircle
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";
import { translations } from "../i18n/translations";
import { LogoImage } from "../components/LogoImage";
import { LOGO_BLACK_URL } from "../constants";

export default function PaymentPage() {
  const { language } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).payment;
  const isAr = language === "ar";
  const isFr = language === "fr";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected plan state (defaults to bundle or query param)
  const initialPlan = searchParams.get("plan") === "single" ? "single" : "bundle";
  const [selectedPlan, setSelectedPlan] = useState<"single" | "bundle">(initialPlan);
  
  // Payment methods: instapay, vodafone, fawry
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "vodafone" | "fawry">("instapay");
  
  // Contact and verification info
  const [email, setEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [refNum, setRefNum] = useState("");

  // Promo Code
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showPromoForm, setShowPromoForm] = useState(false);

  // UI state
  const [copiedText, setCopiedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);

  // Load user details if available
  const resumeData = useResumeStore((state) => state.data);
  useEffect(() => {
    if (resumeData.personalInfo?.email) {
      setEmail(resumeData.personalInfo.email);
    }
    if (resumeData.personalInfo?.fullName) {
      setSenderName(resumeData.personalInfo.fullName);
    }
  }, [resumeData]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const getPrice = () => {
    const base = selectedPlan === "single" ? 50 : 120;
    if (promoApplied) {
      return Math.max(10, base - discountAmount);
    }
    return base;
  };

  const handleApplyPromo = async () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    try {
      const response = await fetch("/api/payment/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: code,
          plan: selectedPlan
        })
      });

      const result = await response.ok ? await response.json() : null;
      if (result && result.success) {
        setDiscountAmount(result.discountAmount);
        setPromoApplied(true);
      } else {
        setPromoError(
          isAr 
            ? "كود الخصم غير صحيح أو منتهي الصلاحية" 
            : isFr 
              ? "Code promo invalide ou expiré" 
              : (result && result.message) || "Invalid or expired promo code"
        );
      }
    } catch (err) {
      console.error("Error applying promo:", err);
      setPromoError(
        isAr 
          ? "حدث خطأ أثناء تطبيق كود الخصم" 
          : "An error occurred while applying the promo code"
      );
    }
  };

  // Reactively re-validate promo code server-side when selected plan changes, keeping calculations on backend
  useEffect(() => {
    if (promoApplied) {
      const reapplyPromo = async () => {
        try {
          const response = await fetch("/api/payment/apply-promo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              promoCode,
              plan: selectedPlan
            })
          });
          const result = await response.ok ? await response.json() : null;
          if (result && result.success) {
            setDiscountAmount(result.discountAmount);
          } else {
            setPromoApplied(false);
            setDiscountAmount(0);
          }
        } catch (err) {
          console.error(err);
          setPromoApplied(false);
          setDiscountAmount(0);
        }
      };
      reapplyPromo();
    }
  }, [selectedPlan, promoApplied, promoCode]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage(
        isAr 
          ? "يرجى كتابة البريد الإلكتروني لإرسال الأكواد" 
          : isFr 
            ? "Veuillez entrer votre e-mail pour recevoir les codes" 
            : "Please enter your email to receive the codes"
      );
      return;
    }

    if (!refNum.trim()) {
      setErrorMessage(
        isAr 
          ? "يرجى إدخال الرقم المرجعي أو رقم المعاملة للتحقق" 
          : isFr 
            ? "Veuillez saisir la référence de transaction pour vérification" 
            : "Please enter the transaction reference number for verification"
      );
      return;
    }

    setIsSubmitting(true);
    
    // Simulate/Perform transaction submission to verify backend
    const finalRef = refNum.trim();
    const finalAmount = `${getPrice()} EGP`;
    const finalSender = senderName.trim() || resumeData.personalInfo?.fullName || "Anonymous";

    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submitPayment",
          reference: finalRef,
          senderInfo: finalSender,
          email: email.trim(),
          amount: selectedPlan === "single" ? `${finalAmount} (Single Code)` : `${finalAmount} (3 Codes)`
        })
      });

      if (!response.ok) {
        throw new Error("Payment submission failed");
      }

      const result = await response.json();
      if (result.success === true) {
        // Save references in localStorage
        const usedRefs = JSON.parse(localStorage.getItem("used_payment_refs") || "[]");
        if (!usedRefs.includes(finalRef)) {
          usedRefs.push(finalRef);
          localStorage.setItem("used_payment_refs", JSON.stringify(usedRefs));
        }
        localStorage.setItem("pending_payment_ref", finalRef);

        // Redirect to success page with full details
        navigate(
          `/payment-success?ref=${encodeURIComponent(finalRef)}&email=${encodeURIComponent(email.trim())}&amount=${getPrice()}&plan=${selectedPlan}&method=${paymentMethod}`
        );
      } else {
        setErrorMessage(result.message || (isAr ? "فشل تسجيل المعاملة، يرجى مراجعة البيانات." : "Failed to register transaction. Please check details."));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(isAr ? "حدث خطأ غير متوقع أثناء الاتصال بالخادم." : "An unexpected error occurred while connecting to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderSummary = (isMobile: boolean = false) => {
    if (isMobile) {
      return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xs mt-2 overflow-hidden text-start">
          {/* Header toggle */}
          <button
            type="button"
            onClick={() => setSummaryCollapsed(!summaryCollapsed)}
            className="w-full p-5 flex items-center justify-between text-start hover:bg-slate-50/50 transition-colors cursor-pointer outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">🛍️</span>
              <h3 className="text-xs sm:text-sm font-black text-slate-850">
                {t.orderSummaryMobile}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-[#001639] bg-[#001639]/5 px-2.5 py-1 rounded-lg font-mono">
                {getPrice()} EGP
              </span>
              <span className="text-slate-400 text-[10px] transition-transform duration-200" style={{ transform: summaryCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
                ▼
              </span>
            </div>
          </button>

          {!summaryCollapsed && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500">
                    {selectedPlan === "single" 
                      ? t.singleCodeActivation
                      : t.threeCodesBundle}
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {selectedPlan === "single" ? "50 EGP" : "120 EGP"}
                  </span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                    <span>{t.promoDiscountApplied}</span>
                    <span>-{discountAmount} EGP</span>
                  </div>
                )}
              </div>

              {/* Promo Code Accordion */}
              <div className="pt-4 border-t border-slate-100">
                {!showPromoForm && !promoApplied ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoForm(true)}
                    className="inline-flex text-xs font-semibold text-slate-400 hover:text-[#001639] items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Ticket size={12} />
                    <span>{t.haveCoupon}</span>
                  </button>
                ) : (
                  <div className="text-start">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-bold text-slate-500">
                        {t.promoCodeLabel}
                      </label>
                      {!promoApplied && (
                        <button
                          type="button"
                          onClick={() => setShowPromoForm(false)}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {t.cancel}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        disabled={promoApplied}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={t.promoPlaceholder}
                        className="flex-1 font-bold font-mono px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase bg-white"
                      />
                      <button
                        type="button"
                        disabled={promoApplied}
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-colors disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                      >
                        {promoApplied ? t.applied : t.apply}
                      </button>
                    </div>
                  </div>
                )}
                
                {promoApplied && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>{t.discountApplied}</span>
                  </p>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5">{promoError}</p>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs hidden lg:block text-start">
        <h3 className="text-lg font-extrabold mb-5 text-slate-900 border-b border-slate-100 pb-3">
          {t.orderSummaryTitle}
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">
              {selectedPlan === "single" 
                ? t.singleCodeActivation
                : t.threeCodesBundle}
            </span>
            <span className="font-extrabold text-slate-850">
              {selectedPlan === "single" ? "50 EGP" : "120 EGP"}
            </span>
          </div>

          {promoApplied && (
            <div className="flex justify-between items-center text-sm text-emerald-600 font-bold">
              <span>{t.promoDiscountApplied}</span>
              <span>-{discountAmount} EGP</span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
            <span className="font-black text-slate-800 text-base">{t.grandTotal}</span>
            <span className="text-3xl font-black text-[#001639] font-mono leading-none">
              {getPrice()} EGP
            </span>
          </div>
        </div>

        {/* Promo Code Accordion */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          {!showPromoForm && !promoApplied ? (
            <button
              type="button"
              onClick={() => setShowPromoForm(true)}
              className="inline-flex text-xs font-semibold text-slate-400 hover:text-[#001639] items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ticket size={12} />
              <span>{t.haveCoupon}</span>
            </button>
          ) : (
            <div className="text-start">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500">
                  {t.promoCodeLabel}
                </label>
                {!promoApplied && (
                  <button
                    type="button"
                    onClick={() => setShowPromoForm(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  disabled={promoApplied}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={t.promoPlaceholder}
                  className="flex-1 font-bold font-mono px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase"
                />
                <button
                  type="button"
                  disabled={promoApplied}
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-colors disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                >
                  {promoApplied ? t.applied : t.apply}
                </button>
              </div>
            </div>
          )}
          
          {promoApplied && (
            <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <Sparkles size={12} />
              <span>{t.discountApplied}</span>
            </p>
          )}
          {promoError && (
            <p className="text-[10px] text-rose-500 font-bold mt-1.5">{promoError}</p>
          )}
        </div>
      </div>
    );
  };

  const renderTrustBadges = (isMobile: boolean = false) => {
    return (
      <div className={`bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[2rem] p-6 sm:p-8 relative overflow-hidden ${isMobile ? "block lg:hidden" : "hidden lg:block"}`}>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-32 h-32 bg-[#001639] rounded-full blur-2xl opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-[#001639]" size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{t.paymentSecureTitle}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{t.paymentSecureDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="text-amber-400" size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{t.instantActivationTitle}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{t.instantActivationDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <HelpCircle className="text-sky-400" size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{t.continuousSupportTitle}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{t.continuousSupportDesc}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24" dir={isAr ? "rtl" : "ltr"}>
        {/* Navigation Bar */}
        <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
            <Link 
              to="/pricing" 
              className="text-xs sm:text-sm font-extrabold text-neutral-500 hover:text-neutral-950 transition-colors flex items-center gap-1.5"
            >
              {isAr ? <><ArrowRight size={16} /> <span>{t.backToPricing}</span></> : <><ArrowLeft size={16} /> <span>{t.backToPricing}</span></>}
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="flex items-center">
                <LogoImage
                  src={LOGO_BLACK_URL}
                  alt="Hash Resume"
                  className="h-[55px] sm:h-[65px] w-auto object-contain"
                />
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={18} />
              <span className="text-xs font-bold text-slate-500">
                {t.sslEncryption}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="pt-28 px-4 sm:px-6 max-w-5xl mx-auto">
          
          <div className="text-center mt-6 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black mb-3.5">
              <ShieldCheck size={14} />
              <span>{t.directCheckout}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.secureCheckout}
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Checkout details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 1: Select/Toggle package */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-[#001639]" />
                  {t.selectPlan}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Single plan option */}
                  <div 
                    onClick={() => setSelectedPlan("single")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === "single" 
                        ? "border-[#001639] bg-[#001639]/5" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900">{t.singleCodeTitle}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === "single" ? "border-[#001639]" : "border-slate-300"}`}>
                          {selectedPlan === "single" && <div className="w-2 h-2 rounded-full bg-[#001639]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                        {t.singleCodeDesc}
                      </p>
                    </div>
                    <span className="text-lg font-black text-slate-900 font-mono">50 EGP</span>
                  </div>

                  {/* Bundle plan option */}
                  <div 
                    onClick={() => setSelectedPlan("bundle")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === "bundle" 
                        ? "border-[#001639] bg-[#001639]/5" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {t.bestValue}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900">{t.bundleCodeTitle}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === "bundle" ? "border-[#001639]" : "border-slate-300"}`}>
                          {selectedPlan === "bundle" && <div className="w-2 h-2 rounded-full bg-[#001639]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                        {t.bundleCodeDesc}
                      </p>
                    </div>
                    <span className="text-lg font-black text-[#001639] font-mono">120 EGP</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Payment methods selection */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-[#001639]" />
                  {t.selectPaymentMethod}
                </h3>

                {/* Tabs view of payment methods */}
                <div className="bg-slate-100 p-1 rounded-2xl flex w-full mb-6 relative">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("instapay")}
                    className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs font-black ${
                      paymentMethod === "instapay"
                        ? "bg-white text-[#001639] shadow-sm font-black scale-[1.01]"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    <Smartphone size={15} />
                    <span>InstaPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vodafone")}
                    className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs font-black ${
                      paymentMethod === "vodafone"
                        ? "bg-white text-red-650 shadow-sm font-black scale-[1.01]"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    <Smartphone size={15} className="text-red-500" />
                    <span>Vodafone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("fawry")}
                    className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs font-black ${
                      paymentMethod === "fawry"
                        ? "bg-white text-amber-650 shadow-sm font-black scale-[1.01]"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    <Ticket size={15} className="text-amber-500" />
                    <span>Fawry</span>
                  </button>
                </div>

                {/* Instructions per Payment Method */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-slate-700">
                  {paymentMethod === "instapay" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-brand-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-brand-500" />
                        <span>{t.instapayTitle}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {t.instapayDesc}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.ipaLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all font-mono break-all block">hashresume@instapay</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("hashresume@instapay", "instapay")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "instapay" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.receiverNameLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all break-words block">{t.bassemName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(t.bassemName, "receiverName")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "receiverName" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "vodafone" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-red-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-red-500" />
                        <span>{t.vodafoneTitle}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {t.vodafoneDesc}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.walletNumberLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all font-mono break-all block">01027136006</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("01027136006", "vodafone")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "vodafone" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.receiverConfirmLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all break-words block">{t.bassemConfirm}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(t.bassemConfirm, "vodafoneReceiver")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "vodafoneReceiver" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "fawry" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-amber-500" />
                        <span>{t.fawryTitle}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {t.fawryDesc}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.fawryServiceCodeLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-mono break-all block">78921</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("78921", "fawrycode")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "fawrycode" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{t.directReferenceNumberLabel}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-mono break-all block">928104829</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("928104829", "fawryref")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={t.copy}
                        >
                          {copiedText === "fawryref" ? <span className="text-xs text-emerald-500 font-bold">{t.copied}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* On mobile: Render Order Summary and Trust Badges BEFORE the activation form */}
              {renderOrderSummary(true)}
              {renderTrustBadges(true)}

              {/* Box 3: Form for transaction verification inputs */}
              <form onSubmit={handleSubmitPayment} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-extrabold flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t.verificationInfoTitle}
                </h3>

                <div className="space-y-3">
                  {/* Email block */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>{t.emailLabel}</span>
                      <span className="text-[#001639] font-extrabold">*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  {/* Sender Info name/phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>{t.senderInfoLabel}</span>
                    </label>
                    <input 
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={t.senderPlaceholder}
                      className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  {/* Transaction reference */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>{t.txIdLabel}</span>
                      <span className="text-[#001639] font-extrabold">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={refNum}
                      onChange={(e) => setRefNum(e.target.value)}
                      placeholder={t.txIdPlaceholder}
                      className="w-full font-mono font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Info size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submitting button */}
                <div className="space-y-3 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#001639] hover:bg-blue-700 disabled:bg-slate-300 text-white py-4.5 rounded-2xl font-black text-base shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>{t.submittingTransaction}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        <span>{t.verifyButtonText} {getPrice()} {language === "ar" ? "ج.م" : "EGP"}</span>
                      </>
                    )}
                  </button>

                  {/* Instant WhatsApp release link */}
                  <div className="flex justify-center mt-3">
                    <a
                      href={`https://wa.me/201101007965?text=${encodeURIComponent(
                        language === "ar"
                          ? `مرحباً! لقد قمت بتحويل مبلغ ${getPrice()} ج.م لخط محفظة Hash Resume لتفعيل الباقة.\nالبريد الإلكتروني: ${email || "[اكتب بريدك هنا]"}\nالرقم المرجعي للمعاملة: ${refNum || "[اكتب رقم المعاملة هنا]"}`
                          : language === "fr"
                            ? `Bonjour! Je viens de transférer ${getPrice()} EGP vers le portefeuille Hash Resume pour l'activation du code.\nMon e-mail: ${email || "[Votre e-mail]"}\nRéf de transaction: ${refNum || "[Référence de transaction]"}`
                            : `Hi! I just transferred ${getPrice()} EGP to Hash Resume wallet for code activation.\nMy Email: ${email || "[Your Email]"}\nTransaction Ref: ${refNum || "[Transaction Reference]"}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 py-1 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>💬</span>
                      <span className="underline underline-offset-2">{t.whatsappDisclaimer}</span>
                    </a>
                  </div>

                  {/* Manual verification disclaimer message */}
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed font-bold px-2">
                    {t.reviewDisclaimer}
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary (5 cols) - Shown only on desktop */}
            <div className="lg:col-span-5 space-y-6">
              {renderOrderSummary(false)}
              {renderTrustBadges(false)}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
