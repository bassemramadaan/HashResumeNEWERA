import React from 'react';
import { Shield, Lock, EyeOff, Server, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguageStore } from '../store/useLanguageStore';

export default function PrivacyPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">
            {isAr ? 'خصوصيتك هي أولويتنا' : 'Your Privacy is Our Priority'}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {isAr 
              ? 'نحن نؤمن بأن بياناتك الشخصية ملك لك وحدك. إليك كيف نحميها.' 
              : 'We believe your personal data belongs to you. Here is how we protect it.'}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'تخزين محلي فقط' : 'Local Storage Only'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'جميع بيانات سيرتك الذاتية تُحفظ محلياً على متصفحك. نحن لا نقوم بتخزين أي من معلوماتك الشخصية على خوادمنا إلا إذا اخترت صراحةً الانضمام إلى مجمع المواهب (Hash Hunt).' 
                    : 'All your resume data is saved locally on your browser. We do not store any of your personal information on our servers unless you explicitly choose to join our Talent Pool (Hash Hunt).'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <EyeOff size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'لا تتبع، لا إعلانات' : 'No Tracking, No Ads'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'نحن لا نبيع بياناتك لأطراف ثالثة ولا نستخدم ملفات تعريف الارتباط (Cookies) لتتبع نشاطك لأغراض إعلانية. نموذج عملنا يعتمد فقط على عمليات الدفع المباشرة مقابل التحميل.' 
                    : 'We do not sell your data to third parties and we do not use tracking cookies for advertising. Our business model relies solely on direct payments for downloads.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'معالجة آمنة للذكاء الاصطناعي' : 'Secure AI Processing'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'عند استخدامك لميزات الذكاء الاصطناعي (مثل تحسين النصوص أو فحص ATS)، يتم إرسال النصوص بشكل آمن ومؤقت إلى مزود الخدمة (Google Gemini) للمعالجة فقط، ولا يتم استخدامها لتدريب النماذج.' 
                    : 'When you use our AI features (like text enhancement or ATS checking), the text is sent securely and temporarily to our provider (Google Gemini) for processing only, and is not used to train models.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-[#ff4d2d]">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'حذف البيانات' : 'Data Deletion'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'بما أن البيانات مخزنة على متصفحك، يمكنك مسحها في أي وقت عن طريق مسح بيانات المتصفح (Clear Browsing Data) أو استخدام خيار "إعادة تعيين" داخل المحرر.' 
                    : 'Since data is stored on your browser, you can delete it at any time by clearing your browser data or using the "Reset" option inside the editor.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
