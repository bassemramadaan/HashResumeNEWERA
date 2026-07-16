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
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "هل Hash Resume مجاني؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نعم، يمكنك بناء السيرة الذاتية مجاناً وتحميلها ببعض القوالب، وتتوفر خطط مدفوعة للوصول الكامل لجميع القوالب والميزات."
                }
              }, {
                "@type": "Question",
                "name": "هل تدعمون اللغة العربية؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نعم، النظام مصمم لدعم اللغة العربية بشكل كامل مع توافق مع أنظمة قراءة السير الذاتية ATS."
                }
              }]
            }
          `}
        </script>
      </Helmet>

      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-36 lg:pb-12">
        <FAQ isFAQPage={true} />
      </main>

      <Footer />
    </div>
  );
}
