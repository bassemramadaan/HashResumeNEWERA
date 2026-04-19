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
                  ? "لا تستخدم أي أداة في العالم خوارزميات ATS الدقيقة لكل الشركات لأنها أنظمة مغلقة، ولكننا نستخدم المعايير العالمية المعترف بها لضمان اجتياز سيرتك لهذه الأنظمة. نقوم بحساب الدرجة بناءً على:"
                  : "No tool in the world has access to the exact proprietary algorithms of every ATS. However, we use globally recognized standards to ensure your resume passes. We calculate your score based on:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{language === "ar" ? "اكتمال الأقسام الأساسية (ملخص، خبرة، تعليم، مهارات)." : "Completeness of core sections (Summary, Experience, Education, Skills)."}</li>
                <li>{language === "ar" ? "استخدام أفعال قوية (Action Verbs) في بداية النقاط." : "Use of strong Action Verbs at the beginning of bullet points."}</li>
                <li>{language === "ar" ? "تحديد النتائج بالأرقام كلما أمكن." : "Quantifying results with metrics and numbers."}</li>
                <li>{language === "ar" ? "تضمين تفاصيل الاتصال بشكل صحيح لسهولة الاستخراج." : "Proper inclusion of contact details for easy parsing."}</li>
                <li>{language === "ar" ? "طول النص وكثافة الكلمات المفتاحية المتعلقة بالمجال." : "Text length and density of industry-relevant keywords."}</li>
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
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Database size={18} className="text-emerald-500" />
                    {language === "ar" ? "التخزين المحلي" : "Local Storage (Default)"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {language === "ar" 
                      ? "بشكل افتراضي، لا تغادر نصوص سيرتك الذاتية جهازك أبدًا. يتم تخزين جميع البيانات في المتصفح المحلي (LocalStorage)." 
                      : "By default, your resume text never leaves your device. All data is stored in your browser's LocalStorage."}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-indigo-500" />
                    {language === "ar" ? "استخدام الذكاء الاصطناعي" : "Using AI Features"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {language === "ar" 
                      ? "فقط عند ضغطك على 'تحسين بالذكاء الاصطناعي'، نرسل النص القصير المحدد إلى استضافة Google Gemini API لتصحيحه، ثم نتخلص من النص. لا نخزن أي شيء على خوادم قاعدة البيانات الخاصة بنا." 
                      : "Only when you click 'Fix with AI', we send the specific short text to the Google Gemini API for improvement. The text is immediately discarded by our backend after the response. We do not store your data in any proprietary database."}
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
                  {language === "ar" ? "ماذا تعني نتائج الاستبيان المذكورة؟" : "What do our 'Survey Results' mean?"}
                </h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {language === "ar" 
                  ? "على صفحتنا الرئيسية نذكر أن السير الذاتية المحسنة تؤدي إلى رفع نسبة الاستجابات وزيادة الراتب. هذه الارقام ليست عشوائية، بل هي مبنية على:" 
                  : "On our homepage, we mention that optimized resumes lead to more callbacks and potentially higher initial offers. These numbers are based on:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>{language === "ar" ? "متابعة أداء أكثر من 1,250 مستخدم نشط في مجالات التكنولوجيا والتمويل في أوائل عام 2025." : "Tracking the job hunt performance of over 1,250 active users in tech and finance in early 2025."}</li>
                <li>{language === "ar" ? "إحصائيات صناعية عامة وموثقة توضح أن تجاوز نظام الـ ATS هو السبب الأكبر للوصول لمرحلة المقابلة." : "Publicly documented industry statistics showing that passing the ATS is the largest roadblock to securing an interview."}</li>
              </ul>
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
