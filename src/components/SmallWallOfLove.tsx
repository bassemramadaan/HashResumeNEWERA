import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../store/useLanguageStore";

const reviews = [
  {
    name: "Sarah Jenkins",
    text: "Landed my dream job in 2 weeks! ATS optimization is real.",
    role: "Software Engineer",
  },
  {
    name: "محمد إبراهيم",
    text: "أداة ممتازة، وفرت عليا وقت ومجهود كبير في تنسيق الـ CV.",
    role: "مهندس مدني",
  },
  {
    name: "Mark Thompson",
    text: "Clean, intuitive, and 100% private. Best resume builder.",
    role: "Product Manager",
  },
  {
    name: "محمود حسن",
    text: "الـ CV طلع بروفيشنال والـ ATS قبله من أول مرة.",
    role: "محاسب",
  },
  {
    name: "Emily Rodriguez",
    text: "Finally, a builder that cares about privacy and design.",
    role: "UX Designer",
  },
  {
    name: "خالد العتيبي",
    text: "قوالب احترافية وتناسب سوق العمل في السعودية.",
    role: "مدير تسويق",
  },
];

export default function SmallWallOfLove() {
  const { language } = useLanguageStore();

  // Duplicate reviews multiple times to ensure the marquee never runs out of content on wide screens
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          {language === "ar" ? "آراء مستخدمينا" : "Wall of Love"}
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden group py-4">
        {/* Left/Right Gradient Masks for smooth fade out */}
        <div className="absolute top-0 start-0 w-16 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 end-0 w-16 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 px-4 w-max"
          animate={{ x: language === "ar" ? ["0%", "25%"] : ["0%", "-25%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] md:w-[380px] bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200/50 transition-all duration-300"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-base text-slate-700 font-medium italic leading-relaxed">
                "{review.text}"
              </p>
              <div className="mt-auto flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100 shrink-0">
                  {review.name.charAt(0)}
                </div>
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
        </motion.div>
      </div>
    </section>
  );
}
