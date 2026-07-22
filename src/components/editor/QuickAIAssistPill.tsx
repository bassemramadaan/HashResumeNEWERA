import { useState } from "react";
import { Sparkles, X, Check, Copy, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageStore } from "../../store/useLanguageStore";

interface QuickAIAssistPillProps {
  section: "basics" | "experience" | "education" | "skills" | "projects" | "certifications";
  onInject: (text: string) => void;
}

const DICTIONARY = {
  ar: {
    pillLabel: "إرشاد ذكي ✨",
    modalTitle: "مساعد الذكاء الاصطناعي السريع 🪄",
    modalSub: "اختر عبارات إنجاز غنية بالكلمات الدلالية وانسخها أو احقنها في نموذجك فوراً:",
    copied: "تم نسخها!",
    inject: "حقن في النموذج",
    close: "إغلاق",
    categories: {
      basics: [
        "مهندس برمجيات واجهات متمرس ومحب لبناء لوحات تحكم فائقة الأداء",
        "مدير مشاريع تقنية معتمد بخبرة في قيادة الفرق الرشيقة وتقليل الهدر الزمني",
        "محلل بيانات أول مهتم بنمذجة البيانات الضخمة ودعم اتخاذ القرارات التنفيذية",
        "مصمم برمجيات متخصص في صهر واجهات المستخدم وتسهيل معايير النفاذ الرقمي",
      ],
      experience: [
        "قيادة تطوير واجهات النظام مما ساهم في تسريع تحميل الصفحات بنسبة 40% دقة.",
        "أتمتة النسخ الاحتياطي لقواعد البيانات وتقليل زمن التعطل الفني بنسبة 90% مستمر.",
        "تنسيق العمل مع 5 جهات مصلحة لتوحيد معايير تجربة العميل وتحسين الأداء التشغيلي.",
        "تحسين معايير الجودة ومراجعة الشيفرات البرمجية لرفع جودة مخرجات الفريق بنسبة 25%.",
      ],
      education: [
        "تخرج بمرتبة الشرف الأولى في تخصص هندسة الحاسب الآلي (معدل 4.9/5.0).",
        "مدرج في لوحة شرف العميد للتميز العلمي والأكاديمي والبحوث الطلابية.",
        "إتمام حزمة دراسية متكاملة متخصصة في الإحصاء التطبيقي وتعلم الآلة ذي الكفاءة.",
      ],
      skills: [
        "React.js", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "Docker", "PostgreSQL", "GraphQL", "REST APIs", "Agile", "Scrum", "CI/CD", "Git"
      ],
      projects: [
        "بناء منصة تواصل فورية ذات مرجعية أمنية تدعم أكثر من 15 ألف مستخدم نشط شهرياً.",
        "تصميم لوحة بيانات مالية تفاعلية وتوطين تحليلات الرسوم البيانية بدقة فائقة.",
        "برمجة محرك بحث سريع ومؤتمت لمعالجة النصوص وتصنيف الوثائق الإدارية ديناميكياً.",
      ],
      certifications: [
        "شهادة مدير مشاريع معتمد (PMP) من معهد إدارة المشاريع العالمي.",
        "مطور معتمد لحلول الحوسبة السحابية من Google Cloud Platform (GCP Professional).",
        "ممارس مرن معتمد من Scrum Alliance لتسريع إطلاق المنتجات التقنية.",
      ]
    }
  },
  en: {
    pillLabel: "Quick AI Assist ✨",
    modalTitle: "AI Quick Assist Pill 🪄",
    modalSub: "Tap or click any high-impact metric-driven sentence or keyword to inject it instantly:",
    copied: "Copied!",
    inject: "Inject",
    close: "Close",
    categories: {
      basics: [
        "Result-driven Software Architect with 5+ years of scaling reliable modern web cloud systems.",
        "Certified Technical Project Manager specialized in agile methodology and optimizing delivery velocity.",
        "Senior Financial Analyst with a strong background in large-scale predictive modeling & executive reporting.",
        "Creative UX Designer deeply passionate about human-computer interaction and building accessible layouts.",
      ],
      experience: [
        "Architected scalable backend microservices, boosting API peak-hour reliability from 94% to 99.9%.",
        "Automated continuous integration pipelines, cutting regression feedback loop times from 1 hour to 8 minutes.",
        "Partnered with cross-functional directors to build enterprise billing portals, capturing $145K in run-rate revenue.",
        "Initiated comprehensive performance optimization audits, reducing aggregate bundle size by 38% globally.",
      ],
      education: [
        "Graduated Summa Cum Laude with a Bachelor of Science in Computer Science & Applied Informatics (GPA: 3.92/4.0).",
        "Placed on the Dean's List for continuous academic excellence and high-standing senior project ranking.",
        "Completed accelerated curriculum focusing on distributed systems engineering, database design, and cloud storage.",
      ],
      skills: [
        "React 19", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "PostgreSQL", "Docker", "Kubernetes", "AWS Cloud", "GraphQL", "CI/CD Setup", "System Design", "Product Strategy"
      ],
      projects: [
        "Designed and published an open-source visualizer tool, accumulating over 4,500 GitHub stars and 200 forks.",
        "Created a real-time collaborative map app using WebSockets, supporting 600 concurrent editor operations smoothly.",
        "Engineered end-to-end medical inventory scanner reporting metrics accurately using Web Bluetooth APIs.",
      ],
      certifications: [
        "AWS Certified Solutions Architect – Professional (SAP-C02).",
        "Project Management Professional (PMP) – Project Management Institute.",
        "Certified ScrumMaster (CSM) – Scrum Alliance.",
      ]
    }
  },
  fr: {
    pillLabel: "Aide IA Rapide ✨",
    modalTitle: "Pillule d'Aide IA Rapide 🪄",
    modalSub: "Cliquez sur une phrase à fort impact ou un mot-clé pour l'injecter instantanément :",
    copied: "Copié !",
    inject: "Injecter",
    close: "Fermer",
    categories: {
      basics: [
        "Architecte logiciel axé sur les résultats, avec 5 ans d'expérience dans le cloud.",
        "Chef de projet technique spécialisé en méthodologie Agile et en accélération des livraisons.",
        "Analyste de données senior passionné par la modélisation prédictive et les rapports décisionnels.",
      ],
      experience: [
        "Conçu des microservices redondants, augmentant la fiabilité sur le cloud de 94% à 99,9%.",
        "Automatisé les pipelines de CI/CD, réduisant le temps de retour des tests de 50 minutes à 6 minutes.",
        "Collaboré avec les directeurs commerciaux pour concevoir la plateforme de paiement, générant $120k.",
      ],
      education: [
        "Diplômé avec distinction d'un Bachelor en Science de l'Informatique (Moyenne : 18/20).",
        "Inscrit sur la liste d'excellence académique du doyen pour le projet de fin d'études.",
      ],
      skills: [
        "React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "Docker", "PostgreSQL", "CI/CD", "Git", "Agile"
      ],
      projects: [
        "Développé une plateforme collaborative en temps réel supportant 500 éditeurs simultanés.",
        "Créé un scanner d'inventaire médical léger avec géolocalisation des stocks.",
      ],
      certifications: [
        "AWS Certified Solutions Architect – Associate.",
        "Project Management Professional (PMP).",
      ]
    }
  }
};

export default function QuickAIAssistPill({ section, onInject }: QuickAIAssistPillProps) {
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeLang = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const dict = DICTIONARY[activeLang];
  const items = dict.categories[section] || [];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInject = (text: string) => {
    onInject(text);
    // Subtle physical feedback
    const audioContext = new (window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    osc.start();
    osc.stop(audioContext.currentTime + 0.12);
  };

  return (
    <>
      {/* Golden pulsing shimmer pill */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide border border-amber-350/70 bg-gradient-to-r from-amber-500/10 via-yellow-400/[0.04] to-amber-500/12 text-amber-700 hover:text-amber-800 transition-all cursor-pointer shadow-3xs relative overflow-hidden group select-none mr-2 ml-2"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span>{dict.pillLabel}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-slate-150 overflow-hidden text-start"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {/* Header with warm golden look */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-400/5 p-6 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-3xs">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{dict.modalTitle}</h3>
                    <p className="text-[11px] font-semibold text-amber-700 mt-0.5">{language === "ar" ? "إدماج فوري سلس" : "Instant seamless integration"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Suggestions List */}
              <div className="p-6 max-h-[380px] overflow-y-auto space-y-3.5">
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-1">
                  {dict.modalSub}
                </p>

                {items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 italic">
                    {language === "ar" ? "لا توجد حقول مقترحة لهذا القسم حالياً." : "No quick templates for this section."}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((phrase, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/50 hover:border-amber-300 hover:bg-amber-50/[0.03] transition-all flex flex-col md:flex-row gap-3 items-center md:items-start justify-between group"
                      >
                        <span className="text-xs font-semibold text-slate-700 leading-relaxed flex-1">
                          {section === "skills" ? `• ${phrase}` : phrase}
                        </span>

                        <div className="flex gap-2 shrink-0 self-end md:self-start">
                          <button
                            type="button"
                            onClick={() => handleCopy(phrase, index)}
                            className="bg-white hover:bg-slate-150 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check size={12} className="text-emerald-500" />
                                <span className="text-emerald-600">{dict.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>{language === "ar" ? "نسخ" : "Copy"}</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleInject(phrase)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-black shadow-xs hover:shadow-3xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles size={12} />
                            <span>{dict.inject}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-white border border-slate-250 cursor-pointer text-slate-600 hover:text-slate-800 rounded-xl px-5 py-2 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  {dict.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
