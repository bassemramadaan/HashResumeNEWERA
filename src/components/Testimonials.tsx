import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

const reviews = [
  {
    name: "Sarah Jenkins",
    text: "Hash Resume helped me land my dream job in just 2 weeks! The ATS optimization is real.",
    role: "Software Engineer",
    lang: "en",
  },
  {
    name: "محمد إبراهيم",
    text: "يا باشا الأداة دي جامدة جداً، وفرت عليا وقت ومجهود كبير في تنسيق الـ CV، بجد تسلم إيديكو!",
    role: "مهندس مدني",
    lang: "ar",
  },
  {
    name: "Mark Thompson",
    text: "The interface is so clean and intuitive. I love that it's 100% private.",
    role: "Product Manager",
    lang: "en",
  },
  {
    name: "محمود حسن",
    text: "بصراحة يا جماعة الموقع ده غير حياتي، الـ CV طلع شكله بروفيشنال أوي والـ ATS قبله من أول مرة.",
    role: "محاسب",
    lang: "ar",
  },
  {
    name: "Emily Rodriguez",
    text: "Finally, a resume builder that actually cares about privacy and design quality.",
    role: "UX Designer",
    lang: "en",
  },
  {
    name: "خالد العتيبي",
    text: "ما شاء الله، الموقع جداً ممتاز وسهل الاستخدام، القوالب احترافية وتناسب سوق العمل عندنا في السعودية.",
    role: "مدير تسويق",
    lang: "ar",
  },
  {
    name: "سارة محمود",
    text: "أحلى حاجة إن الموقع سهل ومفهوم، والـ CV طلع شكله يفتح النفس، شكراً ليكم بجد على المجهود ده.",
    role: "مصممة جرافيك",
    lang: "ar",
  },
  {
    name: "عبد العزيز القحطاني",
    text: "تجربة ممتازة، الموقع يوفر قوالب احترافية جداً ومناسبة لمتطلبات الشركات الكبرى في المملكة.",
    role: "محلل بيانات",
    lang: "ar",
  },
];

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl text-center md:text-start mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 text-[#ff4d2d] text-xs font-bold uppercase tracking-widest mb-6 border border-orange-200/50 shadow-sm"
            >
              <Star size={16} className="fill-current" />
              <span>
                {language === "ar" ? "آراء المستخدمين" : "Testimonials"}
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight mb-4">
              {language === "ar" ? "ماذا يقولون عنا؟" : "Wall of Love"}
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
              {t.testimonialsSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-max items-start">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-[#ff4d2d]/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#ff4d2d]/10 relative overflow-hidden group h-full flex flex-col"
            >
              <div className="absolute top-0 end-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                <Quote size={80} className="text-[#ff4d2d] rtl:-scale-x-100" />
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center font-bold text-[#ff4d2d] text-xl border border-orange-200/50 shrink-0 shadow-inner">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                      {review.name}
                    </h4>
                    <div className="text-sm text-white0 mt-0.5 font-medium">
                      {review.role}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-[#ff4d2d] text-[#ff4d2d]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium mt-auto">
                  "{review.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
