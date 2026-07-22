import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShieldCheck, Database, Award, BrainCircuit } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";
import { useLanguageStore } from "../store/useLanguageStore";

export default function TrustPage() {
  const { dir, language } = useLanguageStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-36" dir={dir}>
      <Helmet>
        <title>الخصوصية والأمان | Hash Resume</title>
        <meta name="description" content="بياناتك محفوظة 100% على جهازك فقط. لا قواعد بيانات، لا تتبع، لا مشاركة بيانات." />
        <link rel="canonical" href="https://hashresume.com/trust" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {language === "ar" ? "الثقة والشفافية" : "Trust & Transparency"}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {language === "ar" 
                ? "دليلك لمعرفة كيف تعمل منصتنا، كيف نحمي بياناتك، والأرقام الحقيقية خلف نجاح المشتركين." 
                : "Your guide to how our platform works, how we protect your data, and the real numbers behind our success."}
            </p>
          </div>

          <div className="space-y-12">
            {/* ATS Score Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff4d2d] border border-orange-100">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {language === "ar" ? "كيف يتم حساب درجة الـ ATS؟" : "How is the ATS Score calculated?"}
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                {language === "ar"
                  ? "لا توجد أداة منفردة تمتلك حق الوصول الحصري للخوارزميات المغلقة لكافة أنظمة تتبع المتقدمين العالمية، ولكننا نطبق المعايير الدولية المعتمدة لضمان مطابقة وفحص ملفك على 4 ركائز أساسية:"
                  : "No single tool has proprietary access to the closed-door algorithms of every ATS. However, we audit your resume against internationally recognized guidelines across 4 critical pillars:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="text-xl font-black text-slate-300 font-mono leading-none">01</div>
                  <div>
                    <span className="font-extrabold block mb-1 text-slate-900">{language === "ar" ? "اكتمال الأقسام" : "Section Completeness"}</span>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">{language === "ar" ? "التحقق من تواجد الأقسام الخمسة الرئيسية والأساسية للملف." : "Ensuring presence and clear labeling of the 5 standard core sections."}</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="text-xl font-black text-slate-300 font-mono leading-none">02</div>
                  <div>
                    <span className="font-extrabold block mb-1 text-slate-900">{language === "ar" ? "أفعال الإنجاز والحركة" : "Action & Achievement Verbs"}</span>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">{language === "ar" ? "بدء الجمل بأفعال قوية تدل على القيادة والفاعلية المهنية." : "Starting each bullet point with powerful, goal-oriented verbs."}</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="text-xl font-black text-slate-300 font-mono leading-none">03</div>
                  <div>
                    <span className="font-extrabold block mb-1 text-slate-900">{language === "ar" ? "القياس والنتائج الرقمية" : "Quantification & Metrics"}</span>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">{language === "ar" ? "تحويل الواجبات اليومية العادية إلى نسب مئوية وأرقام قياسية." : "Converting passive task logs into active, measured key results."}</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="text-xl font-black text-slate-300 font-mono leading-none">04</div>
                  <div>
                    <span className="font-extrabold block mb-1 text-slate-900">{language === "ar" ? "سهولة الاستخلاص البرمجي" : "Machine-Readable Formatting"}</span>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">{language === "ar" ? "تجنب التعقيدات الرسومية أو التداخل الذي يحجب النصوص عن الآلة." : "Avoiding graphics or nested layouts that break parsing scanners."}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hash Hunt Privacy Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-brand-600 border border-orange-100">
                  <BrainCircuit size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {language === "ar" ? "خصوصية Hash Hunt والتحكم المطلق" : "Hash Hunt Privacy & Opt-in"}
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                {language === "ar" 
                  ? "على نقيض المنصات البديلة التي تسرب بيانات الباحثين عن عمل، نحن لا ندرج معلوماتك المهنية في قاعدة بيانات المواهب إلا بموجب موافقة مسبقة وصريحة تماماً منك." 
                  : "Unlike other candidate hubs that mine or resell contact lists, we never insert your bio into our public talent pool without your explicit permission."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/40 border border-emerald-100/60 rounded-2xl">
                  <span className="text-emerald-700 font-black text-sm block mb-1">{language === "ar" ? "تحكم وسحب فوري:" : "Instant Revocation:"}</span>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">
                    {language === "ar" ? "تستطيع إخفاء أو سحب سيرتك الذاتية من ترشيحات Hash Hunt بضغطة واحدة في أي وقت." : "You can completely hide or withdraw your resume from employer searches instantly with a single toggle."}
                  </p>
                </div>
                <div className="p-5 bg-emerald-50/40 border border-emerald-100/60 rounded-2xl">
                  <span className="text-emerald-700 font-black text-sm block mb-1">{language === "ar" ? "قنوات تواصل مباشرة:" : "Direct Connection:"}</span>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">
                    {language === "ar" ? "تصلك عروض التوظيف وطلبات المقابلات بصورة مباشرة على بريدك المهني دون وسيط." : "All recruiter messages and interview invites route straight to your email inbox without annoying middlemen."}
                  </p>
                </div>
              </div>
            </section>

            {/* Data & AI Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                  <Database size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {language === "ar" ? "دورة حياة البيانات والذكاء الاصطناعي" : "Data Lifecycle & AI Integration"}
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                {language === "ar" ? "أمانك وخصوصيتك خط أحمر. إليك التفاصيل التقنية الدقيقة لكيفية معالجة مدخلاتك:" : "Your file integrity is our highest priority. Here are the exact technical specifications of our pipelines:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                      <Database size={18} className="text-emerald-500" />
                      {language === "ar" ? "التخزين المحلي بالكامل" : "Local-First Storage (By Default)"}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {language === "ar" 
                        ? "بشكل افتراضي، لا تغادر نصوص سيرتك الذاتية متصفحك أو جهازك مطلقاً، بل يتم الاحتفاظ بها مؤقتاً في LocalStorage الخاص بالمتصفح، مما يعني استحالة تتبعنا لبياناتك الشخصية." 
                        : "By default, your input text never leaves your device. Data is securely retained locally in your browser's LocalStorage, meaning we have zero baseline access to your contact fields."}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                      <BrainCircuit size={18} className="text-brand-500" />
                      {language === "ar" ? "أمان الذكاء الاصطناعي (Gemini API)" : "Secure AI Optimization (Google Gemini)"}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {language === "ar" 
                        ? "عند تفعيل خيارات التحسين الذكي، يتم إرسال النص المعني فقط عبر تشفير SSL آمن لـ API الخاص بـ Google Gemini لتقديم تحسين فوري، ولا يدخل مطلقاً في تدريب النماذج." 
                        : "When utilizing AI assist tools, only the designated target string is sent over a secure SSL channel to the Google Gemini API. This data is processed in-memory and never saved for model training."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Survey Results Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {language === "ar" ? "المصادر ومصداقية الأرقام" : "Audit Integrity & Actual Metrics"}
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                {language === "ar" 
                  ? "لا ننشر نسباً عشوائية بهدف التسويق، الأرقام المعلنة مستقاة وموثقة بالكامل من إحصاءات حقيقية للمستخدمين:" 
                  : "We reject arbitrary marketing numbers. Every percentage we share is derived from actual user studies and direct callback feedback:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 border-s-4 border-s-emerald-500">
                  <div className="text-3xl font-black text-slate-950 font-mono">1,250+</div>
                  <div className="text-xs text-slate-500 font-bold mt-1 leading-normal">{language === "ar" ? "مشارك مهني في استبيان نجاح المستخدمين السنوي لعام 2025" : "Active survey participants in our annual 2025 success follow-up"}</div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 border-s-4 border-s-brand-500">
                  <div className="text-3xl font-black text-slate-950 font-mono">35%</div>
                  <div className="text-xs text-slate-500 font-bold mt-1 leading-normal">{language === "ar" ? "متوسط الزيادة المباشرة في استجابة مسؤولي التوظيف" : "Average increase in active callback invites for fully-optimized users"}</div>
                </div>
              </div>
            </section>

            <div className="flex justify-center mt-10">
              <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                <ArrowLeft size={16} className={language === "ar" ? "rotate-180" : ""} />
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
