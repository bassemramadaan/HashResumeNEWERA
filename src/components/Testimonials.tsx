import React from 'react';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

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

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-[#f16529]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <Quote className="text-[#f16529] mb-6" size={32} />
                <p className="text-slate-800 dark:text-slate-200 text-lg mb-8 leading-relaxed italic">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f16529] to-orange-400 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">{review.name}</h4>
                  <p className="text-sm text-[#f16529] font-bold">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
