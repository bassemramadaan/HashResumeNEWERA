import React from 'react';
import { Star, Quote, BadgeCheck, MapPin, Briefcase } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const testimonials = [
    {
      name: t.testimonial1Name,
      role: t.testimonial1Role,
      country: t.testimonial1Country,
      text: t.testimonial1Text,
      initials: language === 'ar' ? 'أ ح' : 'AH',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: t.testimonial2Name,
      role: t.testimonial2Role,
      country: t.testimonial2Country,
      text: t.testimonial2Text,
      initials: language === 'ar' ? 'م ق' : 'MQ',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: t.testimonial3Name,
      role: t.testimonial3Role,
      country: t.testimonial3Country,
      text: t.testimonial3Text,
      initials: language === 'ar' ? 'ن س' : 'NS',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: t.testimonial4Name,
      role: t.testimonial4Role,
      country: t.testimonial4Country,
      text: t.testimonial4Text,
      initials: language === 'ar' ? 'م ع' : 'ME',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      name: t.testimonial5Name,
      role: t.testimonial5Role,
      country: t.testimonial5Country,
      text: t.testimonial5Text,
      initials: language === 'ar' ? 'ف ع' : 'FA',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      name: t.testimonial6Name,
      role: t.testimonial6Role,
      country: t.testimonial6Country,
      text: t.testimonial6Text,
      initials: language === 'ar' ? 'ج ث' : 'JA',
      gradient: 'from-rose-500 to-red-500'
    },
    {
      name: t.testimonial7Name,
      role: t.testimonial7Role,
      country: t.testimonial7Country,
      text: t.testimonial7Text,
      initials: language === 'ar' ? 'ك و' : 'KW',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      name: t.testimonial8Name,
      role: t.testimonial8Role,
      country: t.testimonial8Country,
      text: t.testimonial8Text,
      initials: language === 'ar' ? 'ر ح' : 'RA',
      gradient: 'from-fuchsia-500 to-purple-500'
    },
    {
      name: t.testimonial9Name,
      role: t.testimonial9Role,
      country: t.testimonial9Country,
      text: t.testimonial9Text,
      initials: language === 'ar' ? 'ف س' : 'FS',
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      name: t.testimonial10Name,
      role: t.testimonial10Role,
      country: t.testimonial10Country,
      text: t.testimonial10Text,
      initials: language === 'ar' ? 'م ع' : 'MA',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      name: t.testimonial11Name,
      role: t.testimonial11Role,
      country: t.testimonial11Country,
      text: t.testimonial11Text,
      initials: language === 'ar' ? 'ع ط' : 'OT',
      gradient: 'from-violet-500 to-indigo-500'
    },
    {
      name: t.testimonial12Name,
      role: t.testimonial12Role,
      country: t.testimonial12Country,
      text: t.testimonial12Text,
      initials: language === 'ar' ? 'ل م' : 'LM',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-sm mb-6 border border-indigo-200 dark:border-indigo-800/50">
            <Star size={16} className="fill-indigo-700 dark:fill-indigo-300" />
            {t.testimonialsTitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
            {language === 'ar' ? 'ماذا يقولون عنا؟' : 'Loved by Professionals'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Masonry Layout Board */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((item, i) => (
            <div 
              key={i} 
              className="break-inside-avoid bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 text-slate-100 dark:text-slate-800 w-12 h-12 -z-10 group-hover:text-indigo-50 dark:group-hover:text-indigo-900/20 transition-colors" />
              
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-base relative z-10 font-medium">
                "{item.text}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-inner`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {item.name}
                    <BadgeCheck size={16} className="text-indigo-500 dark:text-indigo-400" />
                  </h4>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 font-medium space-y-1 mt-1">
                    <li className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <MapPin size={12} />
                      {item.country}
                    </li>
                    <li className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {item.role}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
