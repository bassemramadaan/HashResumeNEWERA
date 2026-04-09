import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

const reviews = [
  {
    name: "أحمد حسن",
    text: "Landed my dream job in 2 weeks! ATS optimization is real.",
    role: "Software Engineer",
    date: "2 days ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "محمد إبراهيم",
    text: "أداة ممتازة، وفرت عليا وقت ومجهود كبير في تنسيق الـ CV.",
    role: "مهندس مدني",
    date: "منذ أسبوع",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "ياسمين عادل",
    text: "Clean, intuitive, and 100% private. Best resume builder.",
    role: "Product Manager",
    date: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "محمود حسن",
    text: "الـ CV طلع بروفيشنال والـ ATS قبله من أول مرة.",
    role: "محاسب",
    date: "منذ شهر",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "نورهان طارق",
    text: "Finally, a builder that cares about privacy and design.",
    role: "UX Designer",
    date: "1 month ago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "خالد العتيبي",
    text: "قوالب احترافية وتناسب سوق العمل في السعودية.",
    role: "مدير تسويق",
    date: "منذ شهرين",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
  },
];

export default function SmallWallOfLove() {
  const { language } = useLanguageStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximate width of a card + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll = direction === "left" 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          {language === "ar" ? "آراء مستخدمينا" : "Wall of Love"}
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll(language === "ar" ? "right" : "left")}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} className="rtl:rotate-180" />
          </button>
          <button 
            onClick={() => scroll(language === "ar" ? "left" : "right")}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={20} className="rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="snap-center flex-shrink-0 w-[300px] md:w-[380px] bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">{review.date}</span>
              </div>
              <p className="text-base text-slate-700 font-medium italic leading-relaxed">
                "{review.text}"
              </p>
              <div className="mt-auto flex items-center gap-4 pt-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="text-base font-bold text-slate-900 leading-tight">
                    {review.name}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 font-medium">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
