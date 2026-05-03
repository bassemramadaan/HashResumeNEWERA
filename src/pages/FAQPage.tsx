import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
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
        <title>{language === 'ar' ? 'الأسئلة الشائعة | Hash Resume' : 'FAQ | Hash Resume'}</title>
        <meta name="description" content={language === 'ar' ? 'الأسئلة الشائعة وإجاباتها' : 'Frequently Asked Questions'} />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
