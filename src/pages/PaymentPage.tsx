import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { 
  ArrowRight, ArrowLeft, CreditCard, Smartphone, ShieldCheck, 
  Copy, Sparkles, Loader2, Info, CheckCircle2, Ticket, HelpCircle
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";
import { validatePromoCode } from "../data/promoCodes";

export default function PaymentPage() {
  const { language } = useLanguageStore();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isAr = language === "ar";
  const isFr = language === "fr";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected plan state (defaults to bundle or query param)
  const initialPlan = searchParams.get("plan") === "single" ? "single" : "bundle";
  const [selectedPlan, setSelectedPlan] = useState<"single" | "bundle">(initialPlan);
  
  // Payment methods: instapay, vodafone, fawry, card
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "vodafone" | "fawry" | "card">("instapay");
  
  // Contact and verification info
  const [email, setEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [refNum, setRefNum] = useState("");
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

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

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const discountPercent = validatePromoCode(code);
    if (discountPercent !== null) {
      const base = selectedPlan === "single" ? 50 : 120;
      const discount = Math.round(base * (discountPercent / 100));
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      setPromoError(
        isAr 
          ? "كود الخصم غير صحيح أو منتهي الصلاحية" 
          : isFr 
            ? "Code promo invalide ou expiré" 
            : "Invalid or expired promo code"
      );
    }
  };

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

    if (!executeRecaptcha) {
      setErrorMessage(isAr ? "يرجى الانتظار حتى يتم تحميل اختبار التحقق من الروبوت" : "Please wait for reCAPTCHA to load");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate/Perform transaction submission to verify backend
    const finalRef = refNum.trim();
    const finalAmount = `${getPrice()} EGP`;
    const finalSender = senderName.trim() || resumeData.personalInfo?.fullName || "Anonymous";

    try {
      const token = await executeRecaptcha("payment_submit");
      
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submitPayment",
          reference: finalRef,
          senderInfo: finalSender,
          email: email.trim(),
          amount: selectedPlan === "single" ? `${finalAmount} (Single Code)` : `${finalAmount} (3 Codes)`,
          recaptchaToken: token
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
    return (
      <div className={`bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs ${isMobile ? "block lg:hidden mt-2" : "hidden lg:block"}`}>
        <h3 className="text-lg font-extrabold mb-5 text-slate-900 border-b border-slate-100 pb-3">
          {isAr ? "ملخص طلبك" : "Order Summary"}
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">
              {selectedPlan === "single" 
                ? (isAr ? "كود تفعيل واحد" : "Single Code Activation") 
                : (isAr ? "باقة ٣ أكواد تفعيل" : "3-Codes Value Bundle")}
            </span>
            <span className="font-extrabold text-slate-850">
              {selectedPlan === "single" ? "50 EGP" : "120 EGP"}
            </span>
          </div>

          {promoApplied && (
            <div className="flex justify-between items-center text-sm text-emerald-600 font-bold">
              <span>{isAr ? "خصم ترويجيapplied" : "Promo discount applied"}</span>
              <span>-{discountAmount} EGP</span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
            <span className="font-black text-slate-800 text-base">{isAr ? "الإجمالي الكلي:" : "Grand Total:"}</span>
            <span className="text-3xl font-black text-[#001639] font-mono leading-none">
              {getPrice()} EGP
            </span>
          </div>
        </div>

          {/* Security & Trust indicators */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>SSL Secured</span>
            </div>
          </div>
          <a href="https://wa.me/201XXXXXXXXXX" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-emerald-700 font-bold hover:bg-emerald-100 transition-colors">
            <span className="text-sm">💬</span> {isAr ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp for Support"}
          </a>
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
              <span>{isAr ? "هل لديك كوبون؟" : "Have a coupon?"}</span>
            </button>
          ) : (
            <div className="text-start">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500">
                  {isAr ? "كود الخصم:" : "Promo code:"}
                </label>
                {!promoApplied && (
                  <button
                    type="button"
                    onClick={() => setShowPromoForm(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  disabled={promoApplied}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={isAr ? "مثال: START20" : "e.g. START20"}
                  className="flex-1 font-bold font-mono px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase"
                />
                <button
                  type="button"
                  disabled={promoApplied}
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-colors disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                >
                  {promoApplied ? (isAr ? "مفعّل" : "Applied") : (isAr ? "تطبيق" : "Apply")}
                </button>
              </div>
            </div>
          )}
          
          {promoApplied && (
            <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <Sparkles size={12} />
              <span>{isAr ? "تم تطبيق كود الخصم ٢٠٪ بنجاح!" : "20% discount applied successfully!"}</span>
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
              <h4 className="font-extrabold text-sm">{isAr ? "دفع رقمي آمن بنسبة ١٠٠٪" : "100% Secure Digital Payments"}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{isAr ? "لا يتم حفظ معلومات تحويلاتك مطلقاً" : "Your payment info is never stored"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="text-amber-400" size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{isAr ? "تنشيط فوري للأكواد" : "Instant Activation Codes"}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{isAr ? "تتم مراجعة الدفع تلقائياً خلال دقائق معدودة" : "Submissions reviewed in real-time within minutes"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <HelpCircle className="text-sky-400" size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{isAr ? "دعم مستمر ٢٤/٧" : "Continuous Support"}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{isAr ? "تواصل معنا مباشرة عبر واتساب للمساعدة الفورية" : "Contact support via WhatsApp for any issues"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {isAr 
            ? "إتمام الدفع الآمن | Hash Resume" 
            : isFr 
              ? "Paiement Sécurisé | Hash Resume" 
              : "Secure Payment Checkout | Hash Resume"}
        </title>
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
              {isAr ? <><ArrowRight size={16} /> <span>الرجوع للأسعار</span></> : <><ArrowLeft size={16} /> <span>Back to Pricing</span></>}
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="flex items-center">
                <img
                  src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
                  alt="Hash Resume"
                  className="h-[55px] sm:h-[65px] w-auto object-contain"
                />
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={18} />
              <span className="text-xs font-bold text-slate-500">
                {isAr ? "تشفير SSL آمن 100%" : "100% SSL Secure Encryption"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="pt-28 px-4 sm:px-6 max-w-5xl mx-auto">
          
          <div className="text-center mt-6 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black mb-3.5">
              <ShieldCheck size={14} />
              <span>{isAr ? "دفع رقمي آمن ومباشر" : "Direct & Secure Digital Checkout"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isAr ? "إتمام عملية الشراء" : isFr ? "Finaliser votre achat" : "Secure Checkout"}
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Checkout details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 1: Select/Toggle package */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-[#001639]" />
                  {isAr ? "اختر باقة التفعيل:" : "Select your plan:"}
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
                        <span className="font-extrabold text-slate-900">{isAr ? "كود تفعيل واحد" : "Single Code"}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === "single" ? "border-[#001639]" : "border-slate-300"}`}>
                          {selectedPlan === "single" && <div className="w-2 h-2 rounded-full bg-[#001639]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                        {isAr ? "تحميل ملف PDF واحد خالي من العلامة المائية." : "1 watermark-free PDF download."}
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
                      {isAr ? "الأكثر توفيراً" : "Best Value"}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900">{isAr ? "باقة ٣ أكواد" : "3-Codes Bundle"}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === "bundle" ? "border-[#001639]" : "border-slate-300"}`}>
                          {selectedPlan === "bundle" && <div className="w-2 h-2 rounded-full bg-[#001639]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                        {isAr ? "٣ أكواد تحميل منفصلة تمنحك مرونة لتحديث سيرتك لاحقاً." : "3 unique codes to update or build multiple resumes."}
                      </p>
                    </div>
                    <span className="text-lg font-black text-[#001639] font-mono">120 EGP</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Payment methods selection */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {isAr ? "اختر وسيلة الدفع المناسبة:" : "Select Payment Method:"}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("instapay")}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "instapay" 
                        ? "border-[#001639] bg-[#001639]/5 text-[#001639] font-bold" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Smartphone size={20} />
                    <span className="text-xs font-black">InstaPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vodafone")}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "vodafone" 
                        ? "border-[#001639] bg-[#001639]/5 text-[#001639] font-bold" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Smartphone size={20} className="text-red-500" />
                    <span className="text-xs font-black">Vodafone Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("fawry")}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "fawry" 
                        ? "border-[#001639] bg-[#001639]/5 text-[#001639] font-bold" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Ticket size={20} className="text-amber-500" />
                    <span className="text-xs font-black">Fawry</span>
                  </button>
                </div>

                {/* Instructions per Payment Method */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-slate-700">
                  {paymentMethod === "instapay" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-indigo-500" />
                        <span>{isAr ? "الدفع الفوري عبر إنستاباي (InstaPay):" : "Instant payment via InstaPay:"}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {isAr 
                          ? "افتح تطبيق إنستاباي على هاتفك، وقم بتحويل قيمة الباقة للعنوان الموضح أدناه:" 
                          : "Open the InstaPay app on your phone, then transfer the package price to the address below:"}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "عنوان الدفع الرياضي (IPA)" : "InstaPay Address (IPA)"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all font-mono break-all block">hashresume@instapay</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("hashresume@instapay", "instapay")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "instapay" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "اسم الحساب المستلم" : "Receiver Name"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all break-words block">{isAr ? "باسم رمضان عبده" : "Bassem Ramadan Abdo"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(isAr ? "باسم رمضان عبده" : "Bassem Ramadan Abdo", "receiverName")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "receiverName" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "vodafone" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-red-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-red-500" />
                        <span>{isAr ? "تحويل كاش (فودافون كاش ومحافظ المحمول):" : "Transfer via Vodafone Cash / Mobile Wallets:"}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {isAr 
                          ? "قم بتحويل قيمة الباقة من محفظتك الإلكترونية إلى رقم المحفظة التالي:" 
                          : "Transfer the plan price from your electronic wallet to the following wallet number:"}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "رقم المحفظة" : "Wallet Number"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all font-mono break-all block">01027136006</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("01027136006", "vodafone")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "vodafone" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "الاسم للتأكيد" : "Receiver Name"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 select-all break-words block">{isAr ? "باسم رمضان" : "Bassem Ramadan"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(isAr ? "باسم رمضان" : "Bassem Ramadan", "vodafoneReceiver")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "vodafoneReceiver" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "fawry" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                        <CheckCircle2 size={16} className="text-amber-500" />
                        <span>{isAr ? "الدفع عبر فوري (Fawry Pay):" : "Pay via Fawry Pay:"}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {isAr 
                          ? "توجه لأي منفذ فوري أو استخدم تطبيق مصرفي، واطلب الدفع برقم كود الخدمة:" 
                          : "Go to any Fawry outlet or mobile banking app, and request payment using the service code:"}
                      </p>
                      
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "رقم خدمة فوري" : "Fawry Service Code"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-mono break-all block">78921</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("78921", "fawrycode")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "fawrycode" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "الرقم المرجعي المباشر للطلب" : "Direct Reference Number"}</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-mono break-all block">928104829</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("928104829", "fawryref")}
                          className="p-2 hover:bg-slate-50 rounded-lg text-[#001639] transition-colors shrink-0"
                          title={isAr ? "نسخ" : "Copy"}
                        >
                          {copiedText === "fawryref" ? <span className="text-xs text-emerald-500 font-bold">{isAr ? "تم!" : "Copied!"}</span> : <Copy size={16} className="shrink-0" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                        <CreditCard size={16} className="text-indigo-500" />
                        <span>{isAr ? "الدفع بالبطاقة الائتمانية / الخصم المباشر:" : "Credit / Debit Card Checkout:"}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-start">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{isAr ? "اسم صاحب البطاقة" : "Cardholder Name"}</label>
                          <input 
                            type="text" 
                            value={cardName} 
                            onChange={(e) => setCardName(e.target.value)} 
                            placeholder={isAr ? "باسم رمضان" : "Bassem Ramadan"}
                            className="w-full text-xs font-bold !bg-white px-3 py-2.5 rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{isAr ? "رقم البطاقة" : "Card Number"}</label>
                          <input 
                            type="text" 
                            maxLength={19}
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} 
                            placeholder="0000 0000 0000 0000"
                            className="w-full text-xs font-mono font-bold !bg-white px-3 py-2.5 rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{isAr ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                          <input 
                            type="text" 
                            maxLength={5}
                            value={cardExpiry} 
                            onChange={(e) => setCardExpiry(e.target.value)} 
                            placeholder="MM/YY"
                            className="w-full text-xs font-mono font-bold !bg-white px-3 py-2.5 rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CVV</label>
                          <input 
                            type="password" 
                            maxLength={3}
                            value={cardCvv} 
                            onChange={(e) => setCardCvv(e.target.value)} 
                            placeholder="•••"
                            className="w-full text-xs font-mono font-bold !bg-white px-3 py-2.5 rounded-lg border border-slate-200"
                          />
                        </div>
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
                  {isAr ? "بيانات إرسال الأكواد والتحقق:" : "Activation & Verification Info:"}
                </h3>

                <div className="space-y-3">
                  {/* Email block */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>{isAr ? "البريد الإلكتروني (لتلقي كود التفعيل):" : "Email Address (to receive activation codes):"}</span>
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

                  {paymentMethod !== "card" && (
                    <>
                      {/* Sender Info name/phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                          <span>{isAr ? "اسم المحول أو هاتف المحفظة المرسلة:" : "Sender Name or Mobile Wallet Phone:"}</span>
                        </label>
                        <input 
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder={isAr ? "الاسم ثلاثي أو الرقم الذي تم التحويل منه" : "Your name or mobile number transferred from"}
                          className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>

                      {/* Transaction reference */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                          <span>{isAr ? "رقم التحويل المرجعي / معرّف المعاملة:" : "Transaction Reference / TxID:"}</span>
                          <span className="text-[#001639] font-extrabold">*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={refNum}
                          onChange={(e) => setRefNum(e.target.value)}
                          placeholder={isAr ? "أدخل الـ Ref أو الرقم المرجعي للمعاملة" : "Enter reference number or transaction ID"}
                          className="w-full font-mono font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                    </>
                  )}
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
                        <span>{isAr ? "جاري إرسال المعاملة للتدقيق..." : "Submitting Transaction..."}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        <span>{isAr ? `تأكيد الدفع وإصدار الأكواد — ${getPrice()} ج.م` : `Verify & Issue Codes — ${getPrice()} EGP`}</span>
                      </>
                    )}
                  </button>

                  {/* Instant WhatsApp release button */}
                  {paymentMethod !== "card" && (
                    <a
                      href={`https://wa.me/201027136006?text=${encodeURIComponent(
                        isAr 
                          ? `مرحباً! لقد قمت بتحويل مبلغ ${getPrice()} ج.م لخط محفظة Hash Resume لتفعيل الباقة.\nالبريد الإلكتروني: ${email || "[اكتب بريدك هنا]"}\nالرقم المرجعي للمعاملة: ${refNum || "[اكتب رقم المعاملة هنا]"}`
                          : `Hi! I just transferred ${getPrice()} EGP to Hash Resume wallet for code activation.\nMy Email: ${email || "[Your Email]"}\nTransaction Ref: ${refNum || "[Transaction Reference]"}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>💬</span>
                      <span>{isAr ? "إرسال إثبات الدفع عبر واتساب للتفعيل الفوري" : "Send Proof via WhatsApp for Instant Activation"}</span>
                    </a>
                  )}

                  {/* Manual verification disclaimer message */}
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed font-bold px-2">
                    {isAr 
                      ? "🔒 سنراجع عملية الدفع وتفاصيل المعاملة يدوياً خلال دقائق معدودة، وسيتم إرسال كود التفعيل فور تأكيد التحويل إلى بريدك الإلكتروني الموضح أعلاه." 
                      : "🔒 We will manually review the payment details within minutes, and send your activation codes directly to your email address listed above as soon as the transfer is confirmed."}
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
