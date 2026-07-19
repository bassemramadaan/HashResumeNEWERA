import { motion } from 'motion/react'
import { Bot, Target, Globe, Zap, FileDown, Lock } from 'lucide-react'
import type { AppLang } from '@/hooks/useDirection'

const ICON_MAP = {
  bot: Bot,
  target: Target,
  globe: Globe,
  zap: Zap,
  file: FileDown,
  lock: Lock,
} as const;

interface FeaturesSectionProps { lang: AppLang }

const FEATURES = {
  ar: [
    { icon: "bot", title: "صياغة فائقة الذكاء", desc: "نظام يعمل على فهم مجالك ويعيد كتابة خبراتك لتظهر بأكثر الصور احترافية وإقناعاً لمدراء التوظيف.", tag: "AI Engine" },
    { icon: "target", title: "مُحسّن لاجتياز ATS", desc: "بنية برمجية معتمدة لاجتياز أنظمة تصفية السير الذاتية الآلية بنجاح، مما يضمن وصول ملفك.", tag: "ATS Ready" },
    { icon: "globe", title: "دعم لغوي شامل", desc: "تصميم متجاوب بالكامل يدعم اللغتين العربية والإنجليزية بطريقة صحيحة مع محاذاة دقيقة وأنماط خطوط رائعة.", tag: "Bilingual" },
    { icon: "zap", title: "بدون أي تعقيدات", desc: "إبدأ بكتابة بياناتك فوراً بدون الحاجة لإنشاء حساب مسبق أو تعقيدات تسجيل الدخول.", tag: "Frictionless" },
    { icon: "file", title: "ملفات فائقة الجودة", desc: "تصدير الملفات بصيغة PDF نقية ومصقولة ليتم طباعتها وتداولها بأفضل صورة احترافية.", tag: "Export" },
    { icon: "lock", title: "خصوصية بياناتك المطلقة", desc: "يتم حفظ جميع التعديلات داخلياً في متصفحك لضمان أعلى درجات الأمان والخصوصية لك.", tag: "Privacy" },
  ],
  en: [
    { icon: "bot", title: "Advanced AI Engine", desc: "Gemini AI crafts rich professional content matched to your unique style and highlights your strengths.", tag: "AI Engine" },
    { icon: "target", title: "100% ATS Friendly", desc: "Meticulously structure elements to bypass recruitment parsing software and reach human eyes.", tag: "ATS Ready" },
    { icon: "globe", title: "True Multilingual RTL", desc: "Perfect bi-directional handling, layout mirroring, and elegant fonts natively supported.", tag: "Bilingual" },
    { icon: "zap", title: "Frictionless Onboarding", desc: "No email verification or accounts. Start writing your CV in seconds flat.", tag: "Frictionless" },
    { icon: "file", title: "Professional PDF Export", desc: "Perfect vectors and aligned layouts rendering accurately across all modern devices.", tag: "Export" },
    { icon: "lock", title: "Complete Privacy Mode", desc: "All client personal details reside strictly inside your immediate browser local state.", tag: "Privacy" },
  ],
  fr: [
    { icon: "bot", title: "Moteur IA natif", desc: "Gemini IA génère du texte de CV de manière fluide et professionnelle pour mettre en valeur vos compétences.", tag: "IA Native" },
    { icon: "target", title: "Compatible ATS à 100%", desc: "Prêt pour les portails de recrutement modernes sans aucune rupture de mise en forme.", tag: "ATS Prêt" },
    { icon: "globe", title: "Multilingue et RTL", desc: "Gère l'arabe, le français et l'anglais avec de magnifiques polices adaptatives et translations parfaites.", tag: "Bilingue" },
    { icon: "zap", title: "Zéro barrière", desc: "Pas d'inscription ni d'e-mail requis pour commencer l'édition directe de votre document.", tag: "Sans friction" },
    { icon: "file", title: "Exports de haute qualité", desc: "Vos PDF sont parfaitement lignés, propres et légers pour une évaluation professionnelle.", tag: "Export" },
    { icon: "lock", title: "Données protégées", desc: "Vos informations restent locales à votre navigateur, assurant votre confidentialité totale.", tag: "Privé" },
  ],
}

const HEADINGS = {
  ar: { label: 'تصميم للمستقبل', title: 'كيف تعمل Hash Resume', subtitle: 'مجموعة من أفضل المعايير التقنية صُممت خصيصاً لضمان القبول والتألق في الشركات.' },
  en: { label: 'Distinctive Features', title: 'How Hash Resume Works', subtitle: 'A cohesive ecosystem of advanced tools designed to help you land premium corporate jobs.' },
  fr: { label: 'Avantages Professionnels', title: 'Excellence Technique', subtitle: 'Une suite complète pour façonner, polir et propulser votre carrière de manière optimale.' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const currentFeatures = FEATURES[lang] || FEATURES['en']
  const heading = HEADINGS[lang] || HEADINGS['en']

  return (
    <section id="features" className="py-24 sm:py-32 px-4 md:px-6 w-full bg-white relative overflow-hidden select-none border-t border-slate-50">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-xs font-bold text-slate-800 tracking-tight uppercase mb-6">
            <span>{heading.label}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            {heading.title}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            {heading.subtitle}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {currentFeatures.map((f, i) => {
            return <FeatureCard key={i} {...f} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag }: { 
  icon: string, 
  title: string, 
  desc: string, 
  tag: string
}) {
  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:border-brand-500/30 transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:shadow-brand-500/5 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-brand-50 group-hover:border-brand-100 transition-all duration-500">
          {IconComponent && (
            <IconComponent className="w-5 h-5 text-slate-700 group-hover:text-brand-500 transition-colors duration-500" strokeWidth={2} />
          )}
        </div>
        <span className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full text-slate-400 bg-slate-50 border border-slate-100">
          {tag}
        </span>
      </div>
      
      <div className="space-y-3 flex-1">
        <h3 className="text-[17px] font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-[14px] leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
