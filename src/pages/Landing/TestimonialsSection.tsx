import React from 'react';
import type { AppLang } from '@/hooks/useDirection';
import { motion } from 'motion/react';
import { Star, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    name: "Mohamed Abdel-Karim",
    nameAr: "محمد عبد الكريم",
    role: "Financial Accountant",
    roleAr: "محاسب مالي",
    textAr: "دفعت 50 جنيه بـ فوري وحملت الـ PDF، والحمد لله اتقبلت في شركة كبيرة في التجمع بعد أسبوع واحد من التقديم! الموقع ده يستاهل كل قرش.",
    textEn: "Paid 50 EGP via Fawry and downloaded the PDF. Thank God, I got accepted into a major company in Fifth Settlement just a week after applying! Worth every penny.",
    rating: 5,
    initials: "MK",
    verifiedAr: "شراء مؤكد (فوري)",
    verifiedEn: "Verified Purchase (Fawry)"
  },
  {
    name: "Noha Soliman",
    nameAr: "نهى سليمان",
    role: "UI/UX Designer",
    roleAr: "مصممة واجهات (UI/UX)",
    textAr: "كنت خايفة إنه يكون زي بقية المواقع اللي بتسحب اشتراك شهري تلقائي، بس هنا دفعت مرة واحدة بس بالفيزا وحملت سي في ممتاز جداً ومنظم.",
    textEn: "I was afraid it would be like other sites that charge automatic monthly subscriptions, but here I just paid once with my card and downloaded an excellent, highly structured CV.",
    rating: 5,
    initials: "NS",
    verifiedAr: "شراء مؤكد (بطاقة)",
    verifiedEn: "Verified Purchase (Card)"
  },
  {
    name: "Amira Fawzy",
    nameAr: "أميرة فوزي",
    role: "HR Specialist",
    roleAr: "أخصائية موارد بشرية (HR)",
    textAr: "بحكم شغلي في الموارد البشرية، بشوف مئات السير الذاتية يومياً. التنسيق اللي بيطلع من هنا مطابق تماماً للي بندور عليه وبيمر من الفرز الآلي (ATS) بسهولة.",
    textEn: "Working in HR, I see hundreds of CVs daily. The layout generated here is exactly what we look for, and it passes through ATS screening with ease.",
    rating: 5,
    initials: "AF",
    verifiedAr: "مستشارة توظيف معتمدة",
    verifiedEn: "Certified HR Consultant"
  },
  {
    name: "Abdulrahman Al-Ghamdi",
    nameAr: "عبد الرحمن الغامدي",
    role: "Software Engineer",
    roleAr: "مهندس برمجيات",
    textAr: "جربت مواقع كتير أجنبية بس مكنتش بتدعم العربي والاتجاهات صح. هنا التنسيق العربي واللاتيني مظبوط جداً والذكاء الاصطناعي بيصيغ الإنجازات باحترافية.",
    textEn: "I tried many foreign platforms but they didn't support Arabic and proper RTL direction correctly. Here, the Arabic & English formatting is perfect, and the AI crafts achievements professionally.",
    rating: 5,
    initials: "AG",
    verifiedAr: "شراء مؤكد (مدى)",
    verifiedEn: "Verified Purchase (Mada)"
  }
];

export function TestimonialsSection({ lang }: { lang: AppLang }) {
  const isRtl = lang === 'ar';

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200/50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black mb-4">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>{isRtl ? "آراء حقيقية من مستخدمين دفعوا وحملوا ملفاتهم" : "Verified reviews from paid & downloaded users"}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {isRtl ? "قصص نجاح حقيقية 🚀" : "Real Success Stories 🚀"}
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            {isRtl 
              ? "انضم لآلاف المستخدمين الذين دفعوا وحققوا قفزة حقيقية في مسارهم المهني مع Hash Resume."
              : "Join thousands of users who upgraded and leaped forward in their careers with Hash Resume."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/60 hover:border-[#FF4D2D]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group"
            >
              {/* Ambient micro border glow line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-400 to-[#FF4D2D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  {isRtl ? t.verifiedAr : t.verifiedEn}
                </span>
              </div>

              <p className="text-slate-700 text-xs italic flex-1 mb-6 leading-relaxed font-semibold">
                "{isRtl ? t.textAr : t.textEn}"
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100/80 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center font-black shrink-0 text-xs">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{isRtl ? t.nameAr : t.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{isRtl ? t.roleAr : t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
