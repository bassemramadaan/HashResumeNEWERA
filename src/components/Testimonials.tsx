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

const reviews: Testimonial[] = [
  {
    name: "يوسف أحمد",
    role: "مهندس برمجيات",
    company: { ar: "نيوم", en: "NEOM" },
    text: "جربت تحليل الـ ATS وقدرت أعدل سيرتي الذاتية وأستهدف الكلمات المفتاحية لمجالي. وحصلت على مقابلة من أول أسبوع تقديم!",
    initial: "ي",
  },
  {
    name: "Laila Hassan",
    role: "Product Manager",
    company: { ar: "دبي القابضة", en: "Dubai Holding" },
    text: "I love the 100% data privacy. No online accounts or databases, and the option to export instantly is a real lifesaver.",
    initial: "L",
  },
  {
    name: "محمد إبراهيم",
    role: "مدير مشاريع",
    company: { ar: "أرامكو السعودية", en: "Saudi Aramco" },
    text: "الأداة دي احترافية للدرجة القصوى وسهلة للغاية! وفرت عليا ساعات من التنسيق اليدوي المعقد بالوورد ومرت من الـ ATS بسهولة.",
    initial: "م",
  },
  {
    name: "Amina Al-Kharji",
    role: "Lead UX Designer",
    company: { ar: "طيران الإمارات", en: "Emirates Group" },
    text: "Dual language templates with absolute RTL support. The output looks extremely polished, premium, and professional for high-tier companies.",
    initial: "A",
  },
  {
    name: "محمود حسن",
    role: "محلل مالي",
    company: { ar: "بنك مصر", en: "Banque Misr" },
    text: "كنت أواجه مشاكل مع نظام الـ ATS لكن تصميم هالقوالب العربي متوافق تماماً وتلقيت ردود إيجابية وتوظيف بفضل مرونة الأداة.",
    initial: "م",
  },
  {
    name: "أسماء محمود",
    role: "كبير مصممي واجهات",
    company: { ar: "فودافون", en: "Vodafone" },
    text: "دعم الخط العربي مذهل وجعل مظهري المهني متميزاً، والألوان منسقة جداً ولا تؤذي العين.",
    initial: "أ",
  },
];

export default function Testimonials() {
  const { language } = useLanguageStore();

  return (
    <section
      id="testimonials"
      className="py-24 bg-white border-b border-slate-100 select-none font-sans relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 text-[#FF4D2D] text-[10px] font-black uppercase tracking-widest mb-3.5">
            <Star size={10} className="fill-[#FF4D2D] text-[#FF4D2D]" />
            <span>
              {language === "ar" ? "جدار المحبة" : "WALL OF LOVE"}
            </span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {language === "ar" ? "قصص نجاح حقيقية" : "Trusted by Professionals"}
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm font-semibold leading-relaxed">
            {language === "ar" 
              ? "قصص نجاح واقتباسات حقيقية من مستخدمينا الرائعين حول العالم." 
              : "Read inspiring stories from amazing professionals who achieved success with us."}
          </p>
        </div>

        {/* Premium Masonry-like Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-slate-150 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#FF4D2D]/20 shadow-3xs hover:shadow-2xs"
            >
              <div className="space-y-4">
                {/* Upper line: quote mark & stars */}
                <div className="flex items-center justify-between">
                  <Quote size={20} className="text-[#FF4D2D]/10 transform scale-x-[-1] rtl:scale-x-[1]" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={11} className="fill-[#FF4D2D] text-[#FF4D2D]" />
                    ))}
                  </div>
                </div>

                {/* Text quote */}
                <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed font-semibold">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF4D2D]/5 text-[#FF4D2D] border border-[#FF4D2D]/10 flex items-center justify-center font-bold text-sm shrink-0 select-none shadow-3xs font-mono">
                    {review.initial}
                  </div>
                  <div className="min-w-0 text-start">
                    <h4 className="font-bold text-slate-900 text-[12px] sm:text-[13px] leading-tight truncate">
                      {review.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">
                      {review.role}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-black border border-emerald-100 shrink-0">
                  <CheckCircle2 size={9} className="text-emerald-500" />
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
