import React from 'react';
import type { AppLang } from '@/hooks/useDirection';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Software Engineer",
    textAr: "عملت السي في في 5 دقايق وجالي مقابلة في ألمسافر تالت يوم! تصميم مريح وممتاز جداً.",
    textEn: "Created my CV in 5 minutes and got an interview at Almosafer by day 3! Excellent design.",
    rating: 5,
    initials: "AH"
  },
  {
    name: "Sarah Ahmed",
    role: "Project Manager",
    textAr: "موقع عبقري.. أول مرة الـ ATS يقرا بياناتي صح 100%. شكراً جداً لتوفير الوقت.",
    textEn: "Genius platform.. First time the ATS reads my details 100% correctly. Thanks for saving my time.",
    rating: 5,
    initials: "SA"
  },
  {
    name: "Mahmoud Tarek",
    role: "Marketing Executive",
    textAr: "دفعت 50 جنيه بس وبصراحة النتيجة مبهرة، الـ AI لخص خبراتي أحسن مني شخصياً 😂",
    textEn: "Paid just 50 EGP and the result is stunning, AI summarized my experience better than I could 😂",
    rating: 5,
    initials: "MT"
  }
];

export function TestimonialsSection({ lang }: { lang: AppLang }) {
  const isRtl = lang === 'ar';

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200/50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {isRtl ? "قصص نجاح حقيقية 🚀" : "Real Success Stories 🚀"}
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            {isRtl 
              ? "انضم لآلاف المستخدمين اللي حققوا قفزة في مسارهم المهني مع Hash Resume."
              : "Join thousands of users who leaped forward in their careers with Hash Resume."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col"
            >
              <div className="flex text-amber-400 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" stroke="none" />
                ))}
              </div>
              <p className="text-slate-700 italic flex-1 mb-6 leading-relaxed font-medium">
                "{isRtl ? t.textAr : t.textEn}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-black shrink-0">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
