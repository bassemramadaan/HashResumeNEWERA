import React from 'react';
import { Star, Quote, BadgeCheck, MapPin, Briefcase, MessageCircle } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#f16529] dark:text-orange-400 font-medium text-xs mb-4 border border-orange-200 dark:border-orange-800/50">
          <Star size={14} className="fill-[#f16529] dark:fill-orange-400" />
          {t.testimonialsTitle}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display tracking-tight">
          {language === 'ar' ? 'ماذا يقولون عنا؟' : 'Wall of Love'}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.testimonialsSubtitle}
        </p>
      </div>

      {/* Be the first to review CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center gap-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-orange-500/10 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-48 -mb-48 group-hover:bg-indigo-500/10 transition-colors"></div>
          
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 mb-4 relative z-10">
            <Star size={40} fill="currentColor" />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t.beFirstToReview}
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              {t.shareYourStory}
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full max-w-xs">
            <button 
              onClick={() => window.open('https://wa.me/201101007965', '_blank')}
              className="w-full bg-[#f16529] hover:bg-[#e44d26] text-white px-8 py-5 rounded-2xl font-bold shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <MessageCircle size={24} />
              {language === 'ar' ? 'أرسل تقييمك الآن' : 'Send Your Review Now'}
            </button>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              {language === 'ar' ? 'سنقوم بنشر تقييمك هنا قريباً!' : 'We will feature your review here soon!'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
