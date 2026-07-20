import React from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  stars: number;
  text: string;
  author: string;
  role: string;
  av: string;
  avBg: string;
}

interface TestimonialsSectionProps {
  language: string;
}

export function TestimonialsSection({ language }: TestimonialsSectionProps) {
  const isAr = language === "ar";
  const isFr = language === "fr";

  const titleText = isAr 
    ? "مراجعات وقصص مستخدمينا" 
    : isFr 
      ? "Avis et histoires de nos utilisateurs" 
      : "User Reviews & Stories";

  const subtitleText = isAr 
    ? "أعضاء تجاوزوا محرك الـ ATS وحصلوا على عروض" 
    : isFr 
      ? "Des membres qui ont contourné l'ATS et obtenu des offres" 
      : "Users who bypassed ATS and secured offers";

  const testimonials: Testimonial[] = [
    {
      stars: 5,
      text: isAr 
        ? "\"رفعت سيرتي الذاتية يوم الثلاثاء. بحلول الخميس كان لدي طلبا مقابلة. لم يحدث لي هذا من قبل مع مواقع التوظيف التقليدية.\"" 
        : isFr
          ? "\"J'ai téléchargé mon CV un mardi. Le jeudi, j'avais déjà deux demandes d'entretien. Cela ne m'était jamais arrivé avec les sites d'emploi traditionnels.\""
          : "\"I uploaded my resume on a Tuesday. By Thursday I had two interview requests. Never happened to me before with traditional job boards.\"",
      author: isAr ? "أحمد حسين" : "Ahmed Hassan",
      role: isAr ? "مطور واجهات · القاهرة" : isFr ? "Développeur Frontend · Le Caire" : "Frontend Developer · Cairo",
      av: isAr ? "أح" : "AH",
      avBg: "from-[#001639] to-[#000a1b]",
    },
    {
      stars: 5,
      text: isAr 
        ? "\"بصفتي مديرة موارد بشرية، وفرت لنا وظائف هاش أسابيع من الفحص. المرشحون الذين نستقبلهم مطابقون مسبقاً وسيرهم الذاتية محسنة بالفعل.\"" 
        : isFr
          ? "\"En tant que responsable RH, Hash Hunt nous a fait gagner des semaines de tri. Les candidats que nous recevons sont pré-qualifiés et leurs CV sont déjà optimisés.\""
          : "\"As an HR manager, Hash Hunt saved us weeks of screening. The candidates we receive are pre-matched and their CVs are already ATS-optimized.\"",
      author: isAr ? "سارة رمضان" : "Sara Ramadan",
      role: "HR Lead · Noon.com",
      av: "SR",
      avBg: "from-indigo-400 to-indigo-600",
    },
    {
      stars: 5,
      text: isAr 
        ? "\"مش صدقت إن شركة في دبي بعتتلي عرض شغل بعد يومين بس من رفع السيرة. الحمدلله على الفرصة دي.\"" 
        : isFr
          ? "\"Je n'arrivais pas à croire qu'une entreprise à Dubaï m'ait envoyé une offre d'emploi seulement deux jours après avoir téléchargé mon CV. Dieu merci pour cette opportunité.\""
          : "\"I couldn't believe a company in Dubai sent me a job offer just two days after uploading my resume. Thank God for this opportunity.\"",
      author: isAr ? "محمد العمري" : "Mohamed El-Omari",
      role: isAr ? "محلل بيانات · الرياض" : isFr ? "Analyste de données · Riyad" : "Data Analyst · Riyadh",
      av: isAr ? "مع" : "ME",
      avBg: "from-emerald-400 to-emerald-600",
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAF6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            {titleText}
          </h2>
          <p className="text-slate-500 text-sm font-semibold">
            {subtitleText}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200/50 p-8 rounded-3xl flex flex-col justify-between hover:border-[#001639]/15 hover:shadow-lg hover:shadow-slate-100/40 transition-all duration-300"
              id={`testimonial-card-${idx}`}
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-6">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-5 mt-auto">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                  {t.av}
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                    {t.author}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
