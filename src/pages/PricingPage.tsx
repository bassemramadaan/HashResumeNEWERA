import { motion } from "motion/react";
import { Check, Zap, Smartphone, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "../store/useLanguageStore";

export default function PricingPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  
  return (
    <>
      <Helmet>
        <title>الأسعار والباقات | Hash Resume</title>
        <meta name="description" content="باقة 50 جنيه للسيرة الواحدة أو 120 جنيه لـ 3 سير ذاتية. بدون اشتراك شهري أو رسوم خفية." />
        <link rel="canonical" href="https://hashresume.com/pricing" />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-36" dir={isAr ? "rtl" : "ltr"}>
        <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
            {/* Left side: Back to home link for visual balance */}
            <div className="flex items-center select-none">
              <Link 
                to="/" 
                className="text-xs sm:text-sm font-extrabold text-neutral-500 hover:text-neutral-950 transition-colors flex items-center gap-1.5"
              >
                {isAr ? (
                  <>
                    <span>الرئيسية</span>
                    <span className="text-[10px] opacity-50">→</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] opacity-50">←</span>
                    <span>Home</span>
                  </>
                )}
              </Link>
            </div>

            {/* Logo Link centered absolutely */}
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center pointer-events-none">
              <Link to="/" className="pointer-events-auto flex justify-center items-center">
                <img
                  src="/logo.png"
                  alt="Hash Resume"
                  className="h-[60px] sm:h-[75px] w-auto object-contain transition-all duration-300 hover:scale-105 active:scale-95"
                />
              </Link>
            </div>

            {/* Right side CTA */}
            <div className="flex items-center">
              <Link 
                to="/editor"
                className="text-xs sm:text-sm font-black text-white bg-slate-900 px-3.5 sm:px-4 py-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isAr ? "بناء السيرة الذاتية" : "Build Resume"}
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-32 px-4 max-w-5xl mx-auto pb-40">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {isAr ? "أسعار بسيطة. قيمة لا محدودة." : "Simple pricing. Unlimited value."}
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              {isAr 
                ? "ابدأ بخطتك المثالية. الدفع مرة واحدة ولا توجد اشتراكات خفية."
                : "Start with the perfect plan. Pay once, no hidden subscriptions."}
            </p>

            {/* Clear Free vs Paid notice */}
            <div className="max-w-xl mx-auto mt-6 bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-sm font-semibold text-blue-800 shadow-sm">
              💡 {isAr 
                ? "أنشئ واستعرض مجاناً — ادفع فقط عند التحميل"
                : "Build & preview for free — pay only when you download"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            {/* Single Package */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-0 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-800 mb-2">{isAr ? "كود تحميل واحد" : "Single Code"}</h3>
              <p className="text-slate-500 dark:text-neutral-500 text-sm mb-6 min-h-[40px]">
                {isAr ? "مثالي لشخص يبحث عن وظيفة واحدة ويريد سيرة ذاتية مثالية." : "Perfect for a single application or update."}
              </p>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-neutral-900">50</span>
                {" "}
                <span className="text-slate-500 dark:text-neutral-500 font-bold">{isAr ? "ج.م" : "EGP"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  isAr ? "١ تحميل PDF خالي من العلامة المائية" : "1 watermark-free PDF export",
                  isAr ? "تحليل ATS بالذكاء الاصطناعي" : "AI ATS analysis",
                  isAr ? "جميع القوالب الاحترافية" : "All professional templates",
                  isAr ? "دعم اللغتين العربية والإنجليزية" : "Arabic & English support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-neutral-700">
                    <Check className="w-5 h-5 text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/editor?plan=single"
                className="w-full py-4 rounded-xl font-bold text-center border-2 border-slate-200 dark:border-neutral-200 text-slate-800 dark:text-neutral-800 hover:border-slate-300 dark:hover:border-neutral-350 hover:bg-slate-50 dark:hover:bg-neutral-50 transition-colors"
              >
                {isAr ? "شراء كود واحد — ٥٠ ج.م" : "Buy Single Code — 50 EGP"}
              </Link>
            </motion.div>

            {/* Bundle Package */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/10 dark:to-neutral-100 rounded-3xl p-6 sm:p-8 border-2 border-blue-500/80 shadow-lg relative flex flex-col md:scale-[1.02]"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-[#001639] to-[#000a1b] text-white px-3 py-1 rounded-full text-xs font-black shadow-sm shadow-orange-500/15">
                {isAr ? "توفير ٦٠٪ - الأكثر شعبية" : "SAVE 60% - MOST POPULAR"}
              </div>
              
              <h3 className="text-xl font-black text-blue-950 dark:text-blue-200 mb-2">{isAr ? "باقة ٣ أكواد" : "3-Codes Bundle"}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 min-h-[40px] font-medium">
                {isAr ? "شارك الباقة مع أصدقائك أو أنشئ أكثر من سيرة ذاتية لمجالات مختلفة." : "Share with friends or create multiple versions of your resume."}
              </p>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#001639]">120</span>
                {" "}
                <span className="text-slate-500 dark:text-slate-400 font-bold">{isAr ? "ج.م" : "EGP"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  isAr ? "٣ أكواد تحميل مستقلة" : "3 independent export codes",
                  isAr ? "مثالي للتخصيص لأكثر من وظيفة" : "Perfect for tailoring to multiple roles",
                  isAr ? "تحليل ATS بالذكاء الاصطناعي" : "AI ATS analysis",
                  isAr ? "تحديث السيرة الذاتية لاحقاً" : "Update resume later (use code anytime)",
                  isAr ? "جميع مميزات الباقة الفردية" : "All Single Code features"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-neutral-800">
                    <Check className="w-5 h-5 text-blue-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/editor?plan=bundle"
                className="w-full py-4 rounded-xl font-black text-center text-white bg-gradient-to-r from-[#001639] to-[#000a1b] hover:from-[#000d23] hover:to-[#000612] shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isAr ? "شراء الباقة — ١٢٠ ج.م" : "Buy Bundle — 120 EGP"}
              </Link>
            </motion.div>
          </div>
          
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold text-slate-650 mb-6 uppercase tracking-wider">
              {isAr ? "ندعم جميع وسائل الدفع المحلية والعالمية:" : "We support all local & global payment options:"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-3xs hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-brand-500" />
                </div>
                <span className="font-extrabold text-slate-800 text-xs">InstaPay</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{isAr ? "تحويل فوري" : "Instant Transfer"}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-3xs hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                  <Smartphone className="w-5 h-5 text-rose-500" />
                </div>
                <span className="font-extrabold text-slate-800 text-xs">Vodafone Cash</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{isAr ? "وجميع المحافظ" : "All Mobile Wallets"}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-3xs hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-extrabold text-slate-800 text-xs">Visa / MasterCard</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{isAr ? "بطاقات الدفع" : "Credit & Debit Cards"}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-3xs hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-extrabold text-slate-800 text-xs">SSL Secure</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{isAr ? "اتصال مشفر وآمن" : "Encrypted Gateway"}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
