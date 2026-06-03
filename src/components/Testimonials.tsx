import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

interface Testimonial {
  name: string;
  text: string;
  role: string;
  company: { ar: string; en: string };
  initial: string;
}

// 3 high-impact testimonials representing different fields to simplify and reduce space
const reviews: Testimonial[] = [
  {
    name: "يوسف أحمد",
    role: "مهندس برمجيات",
    company: { ar: "نيوم", en: "NEOM" },
    text: "جربت تحليل الـ ATS وقدرت أعدل سيرتي الذاتية وأستهدف الكلمات المفتاحية لمجالي. حصلت على مقابلة من أول أسبوع!",
    initial: "ي",
  },
  {
    name: "Amina Al-Kharji",
    role: "Lead UX Designer",
    company: { ar: "طيران الإمارات", en: "Emirates Group" },
    text: "Dual language templates with absolute RTL support. The output looks extremely polished, premium, and professional for high-tier companies.",
    initial: "A",
  },
  {
    name: "محمد إبراهيم",
    role: "مدير مشاريع",
    company: { ar: "أرامكو", en: "Saudi Aramco" },
    text: "الأداة دي احترافية للدرجة القصوى وسهلة للغاية! وفرت عليا ساعات من التنسيق اليدوي المعقد بالوورد ومرت من الـ ATS بسهولة.",
    initial: "م",
  },
];

export default function Testimonials() {
  const { language } = useLanguageStore();

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 bg-white border-b border-slate-100 select-none font-sans relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-50/20 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-md mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 text-[#FF4D2D] text-[9px] font-black uppercase tracking-widest mb-2.5">
            <Star size={9} className="fill-[#FF4D2D] text-[#FF4D2D]" />
            <span>
              {language === "ar" ? "آراء المستخدمين" : "TESTIMONIALS"}
            </span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
            {language === "ar" ? "قصص نجاح حقيقية" : "Trusted by Professionals"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-[13px] font-semibold">
            {language === "ar" 
              ? "مستخدمون رائعون تجاوزوا فلاتر الـ ATS وتلقوا عروض توظيف." 
              : "Inspiring success stories from users who bypassed ATS filters successfully."}
          </p>
        </div>

        {/* Simplified Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#FF4D2D]/15 hover:bg-white shadow-3xs"
            >
              <div className="space-y-3">
                {/* Upper line: quote mark */}
                <div className="flex items-center justify-between">
                  <Quote size={14} className="text-[#FF4D2D]/15 transform scale-x-[-1] rtl:scale-x-[1]" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={9} className="fill-[#FF4D2D] text-[#FF4D2D]" />
                    ))}
                  </div>
                </div>

                {/* Text quote */}
                <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed font-semibold text-start">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FF4D2D]/5 text-[#FF4D2D] border border-[#FF4D2D]/10 flex items-center justify-center font-bold text-xs shrink-0 select-none font-mono">
                    {review.initial}
                  </div>
                  <div className="min-w-0 text-start">
                    <h5 className="font-bold text-slate-800 text-[11px] sm:text-xs leading-none truncate">
                      {review.name}
                    </h5>
                    <span className="text-[9px] text-slate-400 font-bold block truncate mt-1">
                      {review.role}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50/70 text-emerald-700 rounded-md text-[8px] font-extrabold border border-emerald-100/50 shrink-0">
                  <CheckCircle2 size={8} className="text-[#10B981]" />
                  <span>{language === "ar" ? review.company.ar : review.company.en}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
