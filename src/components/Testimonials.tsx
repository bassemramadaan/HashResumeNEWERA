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

  // Split testimonials into two rows
  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6, 12);

  const TestimonialCard = ({ item }: { item: typeof testimonials[0] }) => (
    <div className="w-[350px] shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 mx-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner`}>
            {item.initials}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
              {item.name}
            </h4>
            <div className="flex items-center gap-1 text-amber-400 mt-0.5">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={10} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
        <Quote className="text-slate-200 dark:text-slate-800 w-6 h-6" />
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
        "{item.text}"
      </p>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50">
        <ul className="text-[11px] text-slate-500 dark:text-slate-400 font-medium space-y-1">
          <li className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <MapPin size={10} />
            {item.country}
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase size={10} />
            {item.role}
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#f16529] dark:text-orange-400 font-medium text-xs mb-4 border border-orange-200 dark:border-orange-800/50">
          <Star size={14} className="fill-[#f16529] dark:fill-orange-400" />
          {t.testimonialsTitle}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display tracking-tight">
          {language === 'ar' ? 'ماذا يقولون عنا؟' : 'Loved by Professionals'}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t.testimonialsSubtitle}
        </p>
      </div>

      <div className="relative w-full overflow-hidden space-y-8">
        {/* Row 1: Left Scroll */}
        <div className="flex w-max animate-scroll pause-on-hover">
          {[...row1, ...row1, ...row1].map((item, i) => (
            <TestimonialCard key={`row1-${i}`} item={item} />
          ))}
        </div>

        {/* Row 2: Right Scroll */}
        <div className="flex w-max animate-scroll-reverse pause-on-hover">
          {[...row2, ...row2, ...row2].map((item, i) => (
            <TestimonialCard key={`row2-${i}`} item={item} />
          ))}
        </div>
        
        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
