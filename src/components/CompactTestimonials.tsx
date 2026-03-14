import React from 'react';
import { Star } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer",
    text: "Hash Resume helped me land my dream job in just 2 weeks! The ATS optimization is real.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "محمد إبراهيم",
    role: "مهندس برمجيات",
    text: "وفرت عليا وقت ومجهود كبير في تنسيق الـ CV، بجد تسلم إيديكو!",
    avatar: "https://i.pravatar.cc/150?u=mohamed"
  },
  {
    name: "Mark Thompson",
    role: "Product Manager",
    text: "The interface is so clean and intuitive. I love that it's 100% private.",
    avatar: "https://i.pravatar.cc/150?u=mark"
  },
  {
    name: "محمود حسن",
    role: "مدير تسويق",
    text: "الـ CV طلع شكله بروفيشنال أوي والـ ATS قبله من أول مرة.",
    avatar: "https://i.pravatar.cc/150?u=mahmoud"
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    text: "Finally, a resume builder that actually cares about privacy and design quality.",
    avatar: "https://i.pravatar.cc/150?u=emily"
  },
  {
    name: "خالد العتيبي",
    role: "محلل بيانات",
    text: "القوالب احترافية وتناسب سوق العمل عندنا في السعودية.",
    avatar: "https://i.pravatar.cc/150?u=khaled"
  }
];

export default function CompactTestimonials() {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Duplicate reviews to create a seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-950 py-10 border-y border-slate-100 dark:border-slate-800/50 relative">
      {/* Gradient Masks for smooth fade out on edges */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {language === 'ar' ? 'موثوق من قبل آلاف الباحثين عن عمل' : 'Trusted by thousands of job seekers'}
        </p>
      </div>

      <div className="flex relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6 px-3 w-max"
          animate={{
            x: isRtl ? ["0%", "50%"] : ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <div 
              key={index} 
              className="w-[320px] shrink-0 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
              dir={review.name.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{review.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                </div>
                <div className="ml-auto rtl:mr-auto rtl:ml-0 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                "{review.text}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
