import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShieldCheck, Database, Award, BrainCircuit } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguageStore } from "../store/useLanguageStore";

export default function TrustPage() {
  const { dir, language } = useLanguageStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir={dir}>
      <Helmet>
        <title>{language === "ar" ? "الثقة والشفافية | Hash Resume" : "Trust & Transparency | Hash Resume"}</title>
        <meta name="description" content="Learn how Hash Resume calculates your ATS score, manages your data, and prioritizes your privacy." />
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
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff4d2d]">
                  <Award size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === "ar" ? "كيف يتم حساب درجة الـ ATS؟" : "How is the ATS Score calculated?"}
                </h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {language === "ar"
                  ? "لا تستخدم أي أداة في العالم خوارزميات ATS الدقيقة لكل الشركات لأنها أنظمة مغلقة، ولكننا نستخدم المعايير العالمية المعترف بها لضمان اجتياز سيرتك لهذه الأنظمة. نقوم بحساب الدرجة بناءً على 8 محاور أساسية:"
                  : "No tool in the world has access to the exact proprietary algorithms of every ATS. However, we use globally recognized standards to ensure your resume passes. We calculate your score based on 8 core pillars:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold block mb-1 text-slate-900">{language === "ar" ? "اكتمال الأقسام" : "Section Completeness"}</span>
                  <p className="text-slate-500">{language === "ar" ? "وجود الأقسام الخمسة الرئيسية المعيارية." : "Presence of the 5 standard core sections."}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold block mb-1 text-slate-900">{language === "ar" ? "أفعال الحركة" : "Action Verbs"}</span>
                  <p className="text-slate-500">{language === "ar" ? "بدء النقاط بأفعال قوية تدل على الإنجاز." : "Starting bullet points with powerful achievement verbs."}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold block mb-1 text-slate-900">{language === "ar" ? "القياس الكمي" : "Quantification"}</span>
                  <p className="text-slate-500">{language === "ar" ? "تحويل المهام إلى أرقام ونسب مئوية." : "Translating tasks into metrics and percentages."}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold block mb-1 text-slate-900">{language === "ar" ? "التنسيق الهيكلي" : "Structural Parsing"}</span>
                  <p className="text-slate-500">{language === "ar" ? "مدى سهولة استخراج البيانات بواسطة الأنظمة." : "How easily the text can be parsed by machines."}</p>
                </div>
              </div>
            </section>

            {/* Hash Hunt Privacy Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-indigo-600">
                  <BrainCircuit size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === "ar" ? "خصوصية Hash Hunt" : "Hash Hunt Privacy & Opt-in"}
                </h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {language === "ar" 
                  ? "على عكس المنصات الأخرى التي تبيع بياناتك، نحن لا نضيفك لقاعدة بيانات المواهب الخاصة بنا إلا بطلب صريح منك." 
                  : "Unlike other platforms that sell your data, we never add you to our talent pool unless you explicitly opt-in."}
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">✓</div>
                  <p className="text-slate-700">
                    <span className="font-bold">{language === "ar" ? "تحكم كامل:" : "Full Control:"}</span> {language === "ar" ? "يمكنك سحب سيرتك من Hash Hunt في أي لحظة بضغطة زر." : "You can withdraw your resume from Hash Hunt at any time with one click."}
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">✓</div>
                  <p className="text-slate-700">
                    <span className="font-bold">{language === "ar" ? "تواصل مباشر:" : "Direct Contact:"}</span> {language === "ar" ? "التواصل يتم بينك وبين صاحب العمل مباشرة عبر بريدك الإلكتروني." : "Communication happens directly between you and the employer via your provided email."}
                  </p>
                </li>
              </ul>
            </section>

            {/* Data & AI Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BrainCircuit size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === "ar" ? "دورة حياة البيانات والذكاء الاصطناعي" : "Data Lifecycle & AI Integration"}
                </h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {language === "ar" ? "خصوصيتك هي أولويتنا القصوى. إليك كيف نتعامل مع بياناتك:" : "Your privacy is our highest priority. Here is exactly how we handle your data:"}
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Database size={20} className="text-emerald-500" />
                    {language === "ar" ? "التخزين المحلي (الوضع الافتراضي)" : "Local Storage (Default Mode)"}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === "ar" 
                      ? "بشكل افتراضي، لا تغادر نصوص سيرتك الذاتية جهازك أبدًا. يتم تخزين جميع البيانات في المتصفح المحلي (LocalStorage). هذا يعني أننا لا نملك وصولاً إلى محتوى سيرتك إلا إذا اخترت مشاركتها في Hash Hunt." 
                      : "By default, your resume text never leaves your device. All data is stored in your browser's LocalStorage. This means we have zero access to your content unless you explicitly choose to share it in the Hash Hunt talent pool."}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <BrainCircuit size={20} className="text-indigo-500" />
                    {language === "ar" ? "معالجة الذكاء الاصطناعي (Gemini API)" : "AI Processing (Google Gemini API)"}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === "ar" 
                      ? "عند استخدام ميزات الذكاء الاصطناعي، يتم إرسال النص المحدد فقط عبر قناة مشفرة (SSL) إلى API الخاص بـ Google Gemini. النص يُستخدم فقط للتحسين الـ لحظي ولا يتم استخدامه لتدريب النماذج حسب اتفاقيات المطورين المتبعة." 
                      : "When using AI features, only the specific selected text is sent via SSL encryption to the Google Gemini API. This data is used solely for real-time improvement and is not used for model training according to standard developer privacy agreements."}
                  </p>
                </div>
              </div>
            </section>

            {/* Survey Results Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                   <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === "ar" ? "المصادر والأرقام" : "Sources & Metrics"}
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {language === "ar" 
                  ? "الأرقام التي نذكرها (مثل زيادة الرواتب أو الردود) ليست عشوائية، بل هي نتيجة دراسة ومتابعة:" 
                  : "The numbers we mention (like salary increases or callback rates) are not random; they are the result of careful tracking and research:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="border-s-4 border-emerald-500 ps-4">
                    <div className="text-2xl font-bold text-slate-900">1,250+</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "مشارك في استبانة نجاح المستخدمين لعام 2025" : "Participants in our 2025 User Success Survey"}</div>
                 </div>
                 <div className="border-s-4 border-indigo-500 ps-4">
                    <div className="text-2xl font-bold text-slate-900">35%</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "متوسط الزيادة في نسبة الردود للمستخدمين" : "Avg. increase in callback rates for our users"}</div>
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
