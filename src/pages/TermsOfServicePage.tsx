import React from "react";
import { Scale, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguageStore } from "../store/useLanguageStore";
import { Helmet } from "react-helmet-async";

export default function TermsOfServicePage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col"
      dir={isAr ? "rtl" : "ltr"}
    >
      <Helmet>
        <title>{isAr ? "شروط الخدمة - هاش ريزيومي" : "Terms of Service - Hash Resume"}</title>
        <meta name="description" content={isAr ? "شروط الخدمة الخاصة باستخدام موقع هاش ريزيومي لبناء السير الذاتية." : "Terms of Service for using Hash Resume builder."} />
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">
            {isAr ? "شروط الخدمة" : "Terms of Service"}
          </h1>
          <p className="text-xl text-slate-600">
            {isAr
              ? "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا."
              : "Please read these terms carefully before using our services."}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "قبول الشروط" : "Acceptance of Terms"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "باستخدامك لموقع Hash Resume، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام خدماتنا."
                    : "By accessing and using Hash Resume, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service."}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600 shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "استخدام الخدمة" : "Use of Service"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "نحن نقدم أداة لإنشاء وتنسيق السير الذاتية. أنت مسؤول عن دقة وصحة المعلومات التي تدخلها في سيرتك الذاتية. لا نضمن حصولك على وظيفة نتيجة لاستخدام خدماتنا."
                    : "We provide a tool to create and format resumes. You are responsible for the accuracy and truthfulness of the information you enter into your resume. We do not guarantee employment as a result of using our services."}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-orange-100 rounded-xl text-[#ff4d2d] shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "المدفوعات والاسترداد" : "Payments and Refunds"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "تتم عمليات الدفع لمرة واحدة مقابل تحميل السيرة الذاتية (أو حزم التحميل). نظراً لطبيعة المنتجات الرقمية، لا نقدم استرداداً للأموال بعد إتمام عملية التحميل بنجاح."
                    : "Payments are one-time fees for downloading a resume (or download packs). Due to the nature of digital products, we do not offer refunds once a download has been successfully completed."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
