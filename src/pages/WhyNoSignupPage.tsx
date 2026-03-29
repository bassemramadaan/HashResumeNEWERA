import React from 'react';
import { UserX, Zap, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguageStore } from '../store/useLanguageStore';

export default function WhyNoSignupPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">
            {isAr ? 'لماذا لا نطلب منك إنشاء حساب؟' : 'Why Don\'t We Ask You to Sign Up?'}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {isAr 
              ? 'نحن نؤمن بتجربة مستخدم خالية من التعقيدات. إليك الأسباب.' 
              : 'We believe in a friction-free user experience. Here is why.'}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Zap size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'السرعة والسهولة' : 'Speed and Simplicity'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'أنت هنا لإنشاء سيرة ذاتية، وليس لتذكر كلمة مرور جديدة. يمكنك البدء في كتابة سيرتك الذاتية فوراً دون أي خطوات إضافية.' 
                    : 'You are here to build a resume, not to remember another password. You can start writing your resume immediately without any extra steps.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'الخصوصية التامة' : 'Total Privacy'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'عدم وجود حساب يعني أننا لا نمتلك قاعدة بيانات تحتوي على معلوماتك الشخصية أو بريدك الإلكتروني. بياناتك تُحفظ محلياً على جهازك فقط.' 
                    : 'No account means we do not have a database containing your personal information or email. Your data is saved locally on your device only.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{isAr ? 'كيف تسترجع بياناتك؟' : 'How Do You Retrieve Your Data?'}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'طالما أنك تستخدم نفس المتصفح ولم تقم بمسح بياناته (Local Storage)، ستجد سيرتك الذاتية كما تركتها تماماً عند عودتك للموقع.' 
                    : 'As long as you use the same browser and haven\'t cleared its data (Local Storage), you will find your resume exactly as you left it when you return to the site.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
