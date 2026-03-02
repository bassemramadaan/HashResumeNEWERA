import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const testimonials = [
    {
      name: t.testimonial1Name,
      role: t.testimonial1Role,
      text: t.testimonial1Text,
      initials: language === 'ar' ? 'أ ح' : 'AH'
    },
    {
      name: t.testimonial2Name,
      role: t.testimonial2Role,
      text: t.testimonial2Text,
      initials: language === 'ar' ? 'م ق' : 'MQ'
    },
    {
      name: t.testimonial3Name,
      role: t.testimonial3Role,
      text: t.testimonial3Text,
      initials: language === 'ar' ? 'ن س' : 'NS'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
            {t.testimonialsTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.testimonialsSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative">
              <Quote className="absolute top-6 right-6 text-indigo-100 w-10 h-10" />
              
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed relative z-10">
                "{item.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
