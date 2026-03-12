import React from 'react';
import { Star, Quote } from 'lucide-react';
import { cn } from '../utils';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { motion } from 'motion/react';

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer",
    text: "Hash Resume helped me land my dream job in just 2 weeks! The ATS optimization is real.",
    lang: "en"
  },
  {
    name: "محمد إبراهيم",
    role: "مهندس برمجيات",
    text: "يا باشا الأداة دي جامدة جداً، وفرت عليا وقت ومجهود كبير في تنسيق الـ CV، بجد تسلم إيديكو!",
    lang: "ar"
  },
  {
    name: "Mark Thompson",
    role: "Product Manager",
    text: "The interface is so clean and intuitive. I love that it's 100% private.",
    lang: "en"
  },
  {
    name: "محمود حسن",
    role: "مدير تسويق",
    text: "بصراحة يا جماعة الموقع ده غير حياتي، الـ CV طلع شكله بروفيشنال أوي والـ ATS قبله من أول مرة.",
    lang: "ar"
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    text: "Finally, a resume builder that actually cares about privacy and design quality.",
    lang: "en"
  },
  {
    name: "خالد العتيبي",
    role: "محلل بيانات",
    text: "ما شاء الله، الموقع جداً ممتاز وسهل الاستخدام، القوالب احترافية وتناسب سوق العمل عندنا في السعودية.",
    lang: "ar"
  },
  {
    name: "سارة محمود",
    role: "محاسبة",
    text: "أحلى حاجة إن الموقع سهل ومفهوم، والـ CV طلع شكله يفتح النفس، شكراً ليكم بجد على المجهود ده.",
    lang: "ar"
  },
  {
    name: "عبد العزيز القحطاني",
    role: "مهندس معماري",
    text: "تجربة ممتازة، الموقع يوفر قوالب احترافية جداً ومناسبة لمتطلبات الشركات الكبرى في المملكة.",
    lang: "ar"
  }
];

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-display tracking-tighter">
            {language === 'ar' ? 'ماذا يقولون عنا؟' : 'Wall of Love'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "break-inside-avoid bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#f16529]/30 transition-all duration-500 group relative overflow-hidden",
                index % 4 === 0 ? "md:row-span-2" : ""
              )}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote size={80} />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#f16529] text-[#f16529]" />
                  ))}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 leading-relaxed font-medium">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[#f16529] text-lg transform group-hover:rotate-6 transition-transform">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{review.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{review.role}</p>
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
