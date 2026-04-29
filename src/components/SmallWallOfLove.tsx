import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Linkedin } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

const reviews = [
  {
    name: "Ahmed Hassan",
    text: "Landed my dream job in 2 weeks! ATS optimization is real.",
    role: "Software Engineer · Egypt",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "ياسمين عادل",
    text: "Clean, intuitive, and 100% private. Best resume builder.",
    role: "Product Manager · UAE",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "خالد العتيبي",
    text: "قوالب احترافية وتناسب سوق العمل بشكل مبهر.",
    role: "مدير مشاريع · السعودية",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "نورهان طارق",
    text: "Finally, a builder that cares about privacy and design. Clean exports.",
    role: "UX Designer · Egypt",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
  }
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
    <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {language === "ar" ? "آراء مستخدمينا" : "Wall of Love"}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {language === "ar" ? "نفتخر بقصص نجاح عملائنا" : "Real stories from hired professionals"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll(language === "ar" ? "right" : "left")}
            className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm transition-all"
          >
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>
          <button 
            onClick={() => scroll(language === "ar" ? "left" : "right")}
            className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm transition-all"
          >
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="snap-center flex-shrink-0 w-[280px] md:w-[340px] bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4 shadow-xl shadow-slate-200/50 hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-6 text-slate-300 group-hover:text-[#0A66C2] transition-colors">
                <Linkedin size={20} className="opacity-50 group-hover:opacity-100" />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              
              <p className="text-base text-slate-700 font-medium leading-relaxed my-2 relative z-10 text-wrap whitespace-normal break-words">
                "{review.text}"
              </p>
              
              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="relative">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <CheckCircle2 size={14} className="text-[#0A66C2] fill-[#0A66C2]/20" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    {review.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium truncate">
                    {review.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
