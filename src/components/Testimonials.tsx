import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

interface Testimonial {
  name: string;
  text: string;
  role: string;
  company: { ar: string; en: string };
  initial: string;
  avatarBg: string;
}

const reviews: Testimonial[] = [
  {
    name: "يوسف أحمد",
    role: "مهندس برمجيات",
    company: { ar: "نيوم", en: "NEOM" },
    text: "جربت تحليل الـ ATS وقدرت أعدل سيرتي الذاتية وأستهدف الكلمات المفتاحية لمجالي. وحصلت على مقابلة من أول أسبوع تقديم!",
    initial: "ي",
    avatarBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    name: "Laila Hassan",
    role: "Product Manager",
    company: { ar: "دبي القابضة", en: "Dubai Holding" },
    text: "I love the 100% data privacy. No online accounts or databases, and the option to export instantly is a real lifesaver.",
    initial: "L",
    avatarBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    name: "محمد إبراهيم",
    role: "مدير مشاريع",
    company: { ar: "أرامكو السعودية", en: "Saudi Aramco" },
    text: "الأداة دي احترافية للدرجة القصوى وسهلة للغاية! وفرت عليا ساعات من التنسيق اليدوي المعقد بالوورد ومرت من الـ ATS بسهولة.",
    initial: "م",
    avatarBg: "bg-[#FF4D2D]/5 text-[#FF4D2D] border-[#FF4D2D]/10",
  },
  {
    name: "Amina Al-Kharji",
    role: "Lead UX Designer",
    company: { ar: "طيران الإمارات", en: "Emirates Group" },
    text: "Dual language templates with absolute RTL support. The output looks extremely polished, premium, and professional for high-tier companies.",
    initial: "A",
    avatarBg: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    name: "محمود حسن",
    role: "محلل مالي",
    company: { ar: "بنك مصر", en: "Banque Misr" },
    text: "كنت أواجه مشاكل مع نظام الـ ATS لكن تصميم هالقوالب العربي متوافق تماماً وتلقيت ردود إيجابية وتوظيف بفضل مرونة الأداة.",
    initial: "م",
    avatarBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    name: "أسماء محمود",
    role: "كبير مصممي واجهات",
    company: { ar: "فودافون", en: "Vodafone" },
    text: "دعم الخط العربي مذهل وجعل مظهري المهني متميزاً، والألوان منسقة جداً ولا تؤذي العين.",
    initial: "أ",
    avatarBg: "bg-rose-50 text-rose-605 border-rose-100",
  },
];

export default function Testimonials() {
  const { language } = useLanguageStore();

  return (
    <section
      id="testimonials"
      className="py-16 bg-white border-b border-slate-100 select-none font-sans"
    >
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-150 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2.5">
            <Star size={10} className="fill-slate-400 text-slate-400" />
            <span>
              {language === "ar" ? "آراء من نثق بهم" : "Reviews"}
            </span>
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            {language === "ar" ? "جدار المحبة" : "Wall of Love"}
          </h2>
          <p className="text-slate-450 text-[13px] sm:text-xs font-semibold leading-relaxed">
            {language === "ar" 
              ? "آراء واقتباسات حقيقية من مستخدمينا الرائعين حول العالم." 
              : "Real snippets from amazing professionals sharing their honest app experiences."}
          </p>
        </div>

        {/* Quiet, Static Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-250 hover:bg-slate-50/70 shadow-3xs hover:shadow-2xs"
            >
              <div className="space-y-3.5">
                {/* Upper line: quote mark & stars */}
                <div className="flex items-center justify-between">
                  <Quote size={18} className="text-slate-300 transform scale-x-[-1] rtl:scale-x-[1] fill-slate-100/10" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Text citation */}
                <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-semibold">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-5 pt-3.5 border-t border-slate-150/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${review.avatarBg} border flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-3xs`}>
                    {review.initial}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-[12px] sm:text-[13px] leading-tight truncate">
                      {review.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block truncate">
                      {review.role}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700/90 rounded-md text-[9px] font-bold border border-emerald-100/50 shrink-0">
                  <CheckCircle2 size={8.5} className="fill-emerald-500/10" />
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
