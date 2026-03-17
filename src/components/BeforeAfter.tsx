import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function BeforeAfter() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">{t.beforeAfterTitle}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">{t.beforeAfterSubtitle}</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">{t.beforeTitle}</h3>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-inner h-64 overflow-hidden text-start text-sm text-slate-500 dark:text-slate-400 font-mono">
              <p className="mb-2">John Doe</p>
              <p className="mb-2">Software Dev, NYC</p>
              <p className="mb-4">Did stuff at company X. Good at coding. Contact me at john@email.com</p>
              <p className="mb-2">Experience:</p>
              <p>Worked on projects. Fixed bugs. Used Java, Python, C++, JS, HTML, CSS, SQL, NoSQL, AWS, Azure, GCP, Docker, K8s...</p>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
            <h3 className="text-lg font-bold text-[#f16529] mb-4">{t.afterTitle}</h3>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg h-64 overflow-hidden text-start text-sm text-slate-700 dark:text-slate-200">
              <h4 className="font-bold text-lg mb-1">John Doe</h4>
              <p className="text-slate-500 text-xs mb-4">Software Engineer | New York, NY | john@email.com</p>
              <h5 className="font-bold text-xs uppercase text-[#f16529] mb-2 border-b border-orange-100 pb-1">Experience</h5>
              <p className="font-semibold text-sm">Software Engineer, Tech Corp</p>
              <p className="text-xs text-slate-500 mb-2">2020 - Present</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Engineered scalable microservices using Java and Spring Boot.</li>
                <li>Optimized cloud infrastructure on AWS, reducing latency by 20%.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
