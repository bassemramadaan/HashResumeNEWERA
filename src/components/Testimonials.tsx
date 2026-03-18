import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

const reviews = [
  {
    name: "Sarah Jenkins",
    text: "Hash Resume helped me land my dream job in just 2 weeks! The ATS optimization is real.",
    lang: "en"
  },
  {
    name: "محمد إبراهيم",
    text: "يا باشا الأداة دي جامدة جداً، وفرت عليا وقت ومجهود كبير في تنسيق الـ CV، بجد تسلم إيديكو!",
    lang: "ar"
  },
  {
    name: "Mark Thompson",
    text: "The interface is so clean and intuitive. I love that it's 100% private.",
    lang: "en"
  },
  {
    name: "محمود حسن",
    text: "بصراحة يا جماعة الموقع ده غير حياتي، الـ CV طلع شكله بروفيشنال أوي والـ ATS قبله من أول مرة.",
    lang: "ar"
  },
  {
    name: "Emily Rodriguez",
    text: "Finally, a resume builder that actually cares about privacy and design quality.",
    lang: "en"
  },
  {
    name: "خالد العتيبي",
    text: "ما شاء الله، الموقع جداً ممتاز وسهل الاستخدام، القوالب احترافية وتناسب سوق العمل عندنا في السعودية.",
    lang: "ar"
  },
  {
    name: "سارة محمود",
    text: "أحلى حاجة إن الموقع سهل ومفهوم، والـ CV طلع شكله يفتح النفس، شكراً ليكم بجد على المجهود ده.",
    lang: "ar"
  },
  {
    name: "عبد العزيز القحطاني",
    text: "تجربة ممتازة، الموقع يوفر قوالب احترافية جداً ومناسبة لمتطلبات الشركات الكبرى في المملكة.",
    lang: "ar"
  }
];

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#f16529] text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Star size={12} className="fill-current" />
              <span>{language === 'ar' ? 'آراء المستخدمين' : 'Testimonials'}</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
              {language === 'ar' ? 'ماذا يقولون عنا؟' : 'Wall of Love'}
            </h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
            {t.testimonialsSubtitle}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-[#f16529]/40 transition-all duration-500 group relative shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1"
            >
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="text-[#f16529]" />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#f16529] text-[#f16529]" />
                  ))}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 leading-relaxed font-medium italic">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-black text-[#f16529] text-lg border border-orange-200/50 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{review.name}</h4>
                    <div className="h-1 w-8 bg-[#f16529]/20 rounded-full mt-1 group-hover:w-12 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
