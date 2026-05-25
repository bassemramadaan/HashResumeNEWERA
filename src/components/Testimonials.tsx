import React from "react";
import { Star, Quote, CheckCircle2, Award } from "lucide-react";
import { motion } from "motion/react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

interface Testimonial {
  name: string;
  text: string;
  role: string;
  company: { ar: string; en: string };
  lang: string;
  featured?: boolean;
}

const reviews: Testimonial[] = [
  {
    name: "يوسف أحمد",
    role: "مهندس برمجيات",
    company: { ar: "نيوم", en: "NEOM" },
    text: "بفضل ميزة تحليل الـ ATS، قدرت أعدل سيرتي الذاتية وأستهدف الكلمات المفتاحية المطلوبة بدقة متناهية. جالي رد ومقابلة عمل من أول أسبوع تقديم في شركة أحلامي!",
    lang: "ar",
    featured: true,
  },
  {
    name: "Laila Hassan",
    role: "Product Manager",
    company: { ar: "دبي القابضة", en: "Dubai Holding" },
    text: "I love the 100% data privacy. No online accounts or databases, and the option to export exactly identical Web, PDF, and Word documents is a real lifesaver.",
    lang: "en",
  },
  {
    name: "محمد إبراهيم",
    role: "مدير مشاريع",
    company: { ar: "أرامكو السعودية", en: "Saudi Aramco" },
    text: "الأداة دي احترافية للدرجة القصوى وسهلة جداً! وفرت عليا شهور من التنسيق اليدوي المعقد بالوورد. تضمن لك مرور سيرتك من أنظمة الفرز الأوتوماتيكية.",
    lang: "ar",
  },
  {
    name: "Amina Al-Kharji",
    role: "Lead UX Designer",
    company: { ar: "طيران الإمارات", en: "Emirates Group" },
    text: "Dual language templates with absolute RTL support. The output looks extremely polished, premium, and professional for high-tier companies.",
    lang: "en",
    featured: true,
  },
  {
    name: "محمود حسن",
    role: "محلل مالي",
    company: { ar: "بنك مصر", en: "Banque Misr" },
    text: "كنت دايماً أواجه مشاكل في قوالب السيرة الذاتية العربية مع الـ ATS، لكن هنا متوافقة تماماً ومرت بنجاح وحصلت على وظيفتي الحالية في قطاع الخزينة والاستثمار.",
    lang: "ar",
  },
  {
    name: "أسماء محمود",
    role: "كبير مصممي واجهات",
    company: { ar: "فودافون", en: "Vodafone" },
    text: "الشكل النهائي للسيرة مبهر ويفتح النفس! دعم الخط العربي المتقن والألوان المدروسة جعل مظهري المهني فارق وقاموا باختياري فوراً.",
    lang: "ar",
  },
  {
    name: "عبد العزيز القحطاني",
    role: "محلل بيانات أول",
    company: { ar: "هيئة الاتصالات", en: "CST Saudi" },
    text: "تجربة خرافية وسهلة جداً. أنصح به بشدة لكل الباحثين عن التميز المهني وسرعة الإنشاء بجودة تضاهي بيوت التصميم الحصرية.",
    lang: "ar",
  },
];

const colors = [
  "from-[#FF4D2D] to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-indigo-500 to-violet-500",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-500",
  "from-blue-500 to-sky-600",
];

export default function Testimonials() {
  const { language } = useLanguageStore();
  const t = translations[language]?.landing ?? { testimonialsSubtitle: "" };

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden select-none"
    >
      {/* Absolute Decorative Premium Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-15%] start-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF4D2D]/20 to-orange-500/10 blur-[130px]" />
        <div className="absolute bottom-[-15%] end-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with high-contrast indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6" dir={language === "ar" ? "rtl" : "ltr"}>
          <div className="max-w-2xl text-center md:text-start mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] text-xs font-black uppercase tracking-widest mb-6 border border-[#FF4D2D]/15 shadow-2xs"
            >
              <Star size={14} className="fill-current animate-pulse text-[#FF4D2D]" />
              <span>
                {language === "ar" ? "جدار التميز والنجاح" : "Wall of Love & Success"}
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-4">
              {language === "ar" ? "ماذا يقولون عنا؟" : "Loved by Job Seekers"}
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-semibold max-w-xl mx-auto md:mx-0 leading-relaxed">
              {t.testimonialsSubtitle || (language === "ar" ? "قصص نجاح ومستخدمين حصلوا على مقابلات عمل بفضل تصميم الـ ATS المتكامل." : "Real stories from professionals who successfully bypassed ATS and landed interviews.")}
            </p>
          </div>
        </div>

        {/* Premium Bento Masonry-Style Grid Layout */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {reviews.map((review, index) => {
            const avatarColor = colors[index % colors.length];
            const isFeatured = review.featured;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-55px" }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
                className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 transition-all duration-300 hover:border-[#FF4D2D]/30 shadow-xs hover:shadow-xl hover:shadow-[#FF4D2D]/[0.02] hover:-translate-y-0.5 relative overflow-hidden h-full ${
                  isFeatured ? "md:col-span-1 lg:col-span-2 bg-gradient-to-br from-white via-white to-slate-50/20" : ""
                }`}
              >
                {/* Decorative Giant Background Quote Mark */}
                <div className="absolute top-0 end-0 p-5 opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-550 transform group-hover:scale-105 select-none pointer-events-none">
                  <Quote size={80} className="text-[#FF4D2D] rtl:-scale-x-100" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* User profile layout group */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white text-base border border-white shrink-0 shadow-xs ${avatarColor}`}>
                        {review.name.charAt(0)}
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                          {review.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                          <span>{review.role}</span>
                        </div>
                        
                        {/* Interactive golden rating list */}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-200"
                              />
                            ))}
                          </div>
                          
                          {/* Success localization tag */}
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50/70 border border-emerald-100/50 text-[#0F6E56] rounded-md text-[9px] font-semibold truncate leading-none">
                            <CheckCircle2 size={8} className="shrink-0" />
                            <span>
                              {language === "ar" ? `${review.company.ar}` : `${review.company.en}`}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Highly-tuned readable Quote Paragraph */}
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-normal transition-colors duration-300 group-hover:text-slate-950 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 pl-3.5 rtl:pl-0 rtl:pr-3.5 mb-5">
                      "{review.text}"
                    </p>
                  </div>

                  {/* Trust Badge Footer */}
                  <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      <span>{language === "ar" ? "رأي موثّق" : "Verified review"}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-[#FF4D2D] opacity-80 group-hover:opacity-100 transition-opacity">
                      <Award size={11} className="shrink-0" />
                      <span>{language === "ar" ? "ممتاز 100%" : "Excellent 100%"}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
