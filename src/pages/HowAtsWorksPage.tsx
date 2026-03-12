import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Target, Search, CheckCircle2, AlertTriangle, FileSearch } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguageStore } from '../store/useLanguageStore';

export default function HowAtsWorksPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{isAr ? 'كيف يعمل تقييم ATS - Hash Resume' : 'How ATS Score Works - Hash Resume'}</title>
      </Helmet>
      
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">
            {isAr ? 'كيف يعمل تقييم ATS؟' : 'How does the ATS Score Work?'}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {isAr 
              ? 'نظام تتبع المتقدمين (ATS) هو برنامج تستخدمه الشركات لفرز السير الذاتية. إليك كيف نساعدك على تجاوزه.' 
              : 'Applicant Tracking Systems (ATS) are software used by companies to filter resumes. Here is how we help you beat them.'}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <FileSearch size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'تحليل الكلمات المفتاحية' : 'Keyword Analysis'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'نقوم بمقارنة سيرتك الذاتية مع الوصف الوظيفي الذي تدخله. نتحقق من وجود الكلمات المفتاحية الأساسية والمهارات المطلوبة لضمان تطابق ملفك مع متطلبات الوظيفة.' 
                    : 'We compare your resume against the job description you provide. We check for essential keywords and required skills to ensure your profile matches the job requirements.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'هيكلة البيانات' : 'Data Structuring'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'أنظمة ATS تواجه صعوبة في قراءة التصاميم المعقدة. قوالبنا مصممة برمجياً لتكون سهلة القراءة للآلات (Machine-readable)، مما يضمن استخراج بياناتك بشكل صحيح.' 
                    : 'ATS systems struggle with complex designs. Our templates are programmatically designed to be machine-readable, ensuring your data is extracted correctly.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'اكتشاف الأخطاء الشائعة' : 'Detecting Common Errors'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'نقوم بفحص سيرتك الذاتية بحثاً عن الأخطاء التي قد تؤدي إلى رفضها تلقائياً، مثل نقص معلومات الاتصال، أو استخدام خطوط غير مدعومة، أو غياب التواريخ الواضحة للخبرات.' 
                    : 'We scan your resume for errors that might lead to automatic rejection, such as missing contact info, unsupported fonts, or unclear dates for your experience.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'كيفية تحسين النتيجة' : 'How to Improve Your Score'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'للحصول على نتيجة أعلى من 80%، تأكد من إدخال وصف وظيفي دقيق، واستخدم أداة الذكاء الاصطناعي (AI Enhance) لإعادة صياغة نقاط خبرتك لتتضمن الكلمات المفتاحية المطلوبة بشكل طبيعي.' 
                    : 'To get a score above 80%, make sure to input an accurate job description, and use our AI Enhance tool to rephrase your experience bullets to naturally include required keywords.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
