import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Target, Search, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

interface HashHuntModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HashHuntModal({ isOpen, onClose }: HashHuntModalProps) {
  const { language } = useLanguageStore();

  const content = {
    en: {
      title: "How Hash Hunt Works",
      subtitle: "The bridge between job seekers and top companies",
      steps: [
        {
          icon: Target,
          title: "Enable Discovery",
          desc: "Switch on Hash Hunt in your profile settings to make your resume visible to our partner recruiters.",
        },
        {
          icon: ShieldCheck,
          title: "AI-Powered Matching",
          desc: "Our AI analyzes your skills and matches you with job openings that fit your profile perfectly.",
        },
        {
          icon: Users,
          title: "Direct Access",
          desc: "Verified companies can view your 'blind' profile and request to see your full resume if there's a match.",
        },
        {
          icon: Search,
          title: "Automatic Outreach",
          desc: "Instead of applying to hundreds of jobs, the right companies find you directly.",
        },
      ],
      cta: "Try it Now",
      privacyNote: "Your private details stay hidden until you approve a company's request.",
    },
    ar: {
      title: "كيف يعمل Hash Hunt",
      subtitle: "الجسر بين الباحثين عن عمل وأفضل الشركات",
      steps: [
        {
          icon: Target,
          title: "تفعيل الظهور",
          desc: "قم بتفعيل خاصية Hash Hunt في إعداداتك لتجعل سيرتك الذاتية مرئية لموظفي التوظيف لدينا.",
        },
        {
          icon: ShieldCheck,
          title: "مطابقة بالذكاء الاصطناعي",
          desc: "يقوم نظامنا بتحليل مهاراتك ومطابقتها مع الوظائف الشاغرة التي تناسبك تماماً.",
        },
        {
          icon: Users,
          title: "وصول مباشر",
          desc: "يمكن للشركات الموثقة رؤية ملفك الشخصي 'المجهول' وطلب رؤية سيرتك الكاملة عند وجود تطابق.",
        },
        {
          icon: Search,
          title: "تواصل تلقائي",
          desc: "بدلاً من التقديم على مئات الوظائف، الشركات المناسبة هي من ستجدك مباشرة.",
        },
      ],
      cta: "جربه الآن",
      privacyNote: "بياناتك الخاصة تظل مخفية حتى توافق على طلب الشركة.",
    },
    fr: {
      title: "Comment fonctionne Hash Hunt",
      subtitle: "Le pont entre les candidats et les meilleures entreprises",
      steps: [
        {
          icon: Target,
          title: "Activer la découverte",
          desc: "Activez Hash Hunt dans vos paramètres pour rendre votre CV visible auprès de nos recruteurs partenaires.",
        },
        {
          icon: ShieldCheck,
          title: "Match par l'IA",
          desc: "Notre IA analyse vos compétences et vous met en relation avec des offres qui vous correspondent parfaitement.",
        },
        {
          icon: Users,
          title: "Accès direct",
          desc: "Les entreprises vérifiées peuvent voir votre profil anonyme et demander à voir votre CV complet en cas de match.",
        },
        {
          icon: Search,
          title: "Recrutement inversé",
          desc: "Au lieu de postuler à des centaines d'offres, les bonnes entreprises vous trouvent directement.",
        },
      ],
      cta: "Essayer maintenant",
      privacyNote: "Vos informations privées restent masquées jusqu'à ce que vous approuviez une demande.",
    },
  };

  const t = content[language] || content.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Target size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  {t.title}
                </h2>
                <p className="text-slate-500 font-medium max-w-sm">
                  {t.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {t.steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                <p className="text-xs text-slate-500 text-center font-medium italic">
                  {t.privacyNote}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95"
              >
                {t.cta}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
