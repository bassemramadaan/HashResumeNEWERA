import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "../store/useLanguageStore";

export default function PricingPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  
  return (
    <>
      <Helmet>
        <title>{isAr ? "الأسعار - Hash Resume" : "Pricing - Hash Resume"}</title>
        <meta 
          name="description" 
          content={isAr ? "اختر الباقة المناسبة لسيرتك الذاتية. باقات مرنة واقتصادية." : "Choose the right package for your resume. Flexible and affordable pricing."} 
        />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 pb-20" dir={isAr ? "rtl" : "ltr"}>
        <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 grid grid-cols-[1fr,auto,1fr] items-center">
            {/* Spacer/Empty div for grid balance */}
            <div></div>

            {/* Logo Link centered */}
            <Link to="/" className="flex justify-center items-center">
              <img
                src="https://i.ibb.co/p6bMBFQT/IN-LOGO-icon-with-tag-1.png"
                alt="Hash Resume"
                className="h-[80px] sm:h-[100px] w-auto object-contain"
              />
            </Link>

            {/* Right side CTA */}
            <div className="flex justify-end">
              <Link 
                to="/editor"
                className="text-sm font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isAr ? "بناء السيرة الذاتية" : "Build Resume"}
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-32 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {isAr ? "أسعار بسيطة. قيمة لا محدودة." : "Simple pricing. Unlimited value."}
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              {isAr 
                ? "ابدأ بخطتك المثالية. الدفع مرة واحدة ولا توجد اشتراكات خفية."
                : "Start with the perfect plan. Pay once, no hidden subscriptions."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Package */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-0 rounded-3xl p-8 border border-slate-200 dark:border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-800 mb-2">{isAr ? "كود تحميل واحد" : "Single Code"}</h3>
              <p className="text-slate-500 dark:text-neutral-500 text-sm mb-6 min-h-[40px]">
                {isAr ? "مثالي لشخص يبحث عن وظيفة واحدة ويريد سيرة ذاتية مثالية." : "Perfect for a single application or update."}
              </p>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-neutral-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>50</span>
                <span className="text-slate-500 dark:text-neutral-500 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAr ? "ج.م" : "EGP"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  isAr ? "١ تحميل PDF خالي من العلامة المائية" : "1 watermark-free PDF export",
                  isAr ? "تحليل ATS بالذكاء الاصطناعي" : "AI ATS analysis",
                  isAr ? "جميع القوالب الاحترافية" : "All professional templates",
                  isAr ? "دعم اللغتين العربية والإنجليزية" : "Arabic & English support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-neutral-700">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/editor"
                className="w-full py-4 rounded-xl font-bold text-center border-2 border-slate-200 dark:border-neutral-200 text-slate-800 dark:text-neutral-800 hover:border-slate-300 dark:hover:border-neutral-350 hover:bg-slate-50 dark:hover:bg-neutral-50 transition-colors"
              >
                {isAr ? "ابدأ الآن" : "Start Now"}
              </Link>
            </motion.div>

            {/* Bundle Package */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-orange-50 to-white dark:from-brand-500/10 dark:to-neutral-100 rounded-3xl p-8 border-2 border-orange-200 dark:border-brand-500/40 shadow-lg relative flex flex-col scale-[1.02]"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
                {isAr ? "توفير ٦٠٪ - الأكثر شعبية" : "SAVE 60% - MOST POPULAR"}
              </div>
              
              <h3 className="text-xl font-black text-orange-950 dark:text-orange-200 mb-2">{isAr ? "باقة ٣ أكواد" : "3-Codes Bundle"}</h3>
              <p className="text-orange-800/70 dark:text-orange-300/80 text-sm mb-6 min-h-[40px] font-medium">
                {isAr ? "شارك الباقة مع أصدقائك أو أنشئ أكثر من سيرة ذاتية لمجالات مختلفة." : "Share with friends or create multiple versions of your resume."}
              </p>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#FF4D2D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>120</span>
                <span className="text-orange-850 dark:text-orange-200/90 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAr ? "ج.م" : "EGP"}</span>
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
                    <Check className="w-5 h-5 text-[#FF4D2D] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/editor"
                className="w-full py-4 rounded-xl font-black text-center text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isAr ? "احصل على الباقة" : "Get the Bundle"}
              </Link>
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm font-medium text-slate-500 mb-4">
              {isAr ? "ندعم وسائل الدفع المحلية:" : "We support local payment methods:"}
            </p>
            <div className="flex items-center justify-center gap-6 opacity-70 grayscale">
              <div className="font-black text-lg">InstaPay</div>
              <div className="font-black text-lg">Vodafone Cash</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
