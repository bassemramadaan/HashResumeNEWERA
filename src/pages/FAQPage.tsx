import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import { useLanguageStore } from "../store/useLanguageStore";

export default function FAQPage() {
  const { language } = useLanguageStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Helmet>
        <title>الأسئلة الشائعة | Hash Resume</title>
        <meta name="description" content="إجابات على أكثر الأسئلة شيوعاً حول Hash Resume — التسعير، الخصوصية، دعم العربي، وكيفية عمل ATS." />
        <link rel="canonical" href="https://hashresume.com/faq" />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="sr-only">{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h1>
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
