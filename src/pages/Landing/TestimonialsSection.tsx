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
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:border-[#FF4D2D]/30 hover:shadow-lg hover:shadow-orange-500/[0.03] hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden group"
            >
              {/* Ambient micro border glow line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-400 to-[#FF4D2D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex text-[#FF4D2D] mb-4 gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" />
                ))}
              </div>
              <p className="text-slate-700 italic flex-1 mb-6 leading-relaxed font-semibold">
                "{isRtl ? t.textAr : t.textEn}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100/80 pt-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center font-black shrink-0 text-sm">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
