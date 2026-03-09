import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function ProductShowcase() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">{t.showcaseTitle}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">{t.showcaseSubtitle}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Live Editor', desc: 'See changes in real-time as you type.' },
            { title: 'ATS Optimized', desc: 'Templates designed to pass automated scans.' },
            { title: '100% Private', desc: 'Your data stays on your device, always.' }
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:border-[#f16529] transition-colors">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-[#f16529] mb-6 mx-auto text-2xl font-bold">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
