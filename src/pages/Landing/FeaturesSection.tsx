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
    { icon: "bot", title: "ذكاء اصطناعي حقيقي", desc: "Gemini AI يكتب المحتوى المهني بأسلوبك وبلمسة احترافية فريدة.", tag: "ذكاء" },
    { icon: "target", title: "ATS متوافق 100%", desc: "قوالب سحابية مهيأة بالكامل لتمرير فحص التوظيف الآلي.", tag: "ذكي" },
    { icon: "globe", title: "دعم حقيقي للاتجاهات", desc: "توجيه حقيقي ورائع للغة العربية والإنجليزية RTL و LTR.", tag: "عالمي" },
    { icon: "zap", title: "بدء فوري بلا تسجيل", desc: "لا حسابات أو كلمات مرور معقدة، ابدأ التحرير مباشرة ووفر وقتك.", tag: "سلس" },
    { icon: "file", title: "تصدير متكامل ورسمي", desc: "حمّل سيرتك بصيغة PDF نقية ومصقولة وجاهزة للتقديم المباشر.", tag: "تصدير" },
    { icon: "lock", title: "خصوصية بياناتك أولاً", desc: "بياناتك آمنة، لا يتم تخزين تفاصيلك الشخصية أبداً على خوادم عامة.", tag: "آمن" },
  ],
  en: [
    { icon: "bot", title: "True AI Engine", desc: "Gemini AI crafts rich professional content matched to your unique style.", tag: "AI" },
    { icon: "target", title: "100% ATS Friendly", desc: "Meticulously structure elements to bypass recruitment parsing software.", tag: "Smart" },
    { icon: "globe", title: "True Multilingual RTL", desc: "Perfect bi-directional handling, layout mirroring, and elegant fonts.", tag: "Global" },
    { icon: "zap", title: "Frictionless Onboarding", desc: "No email verification or accounts. Start writing your CV in seconds flat.", tag: "Fast" },
    { icon: "file", title: "Professional PDF Export", desc: "Perfect vectors and aligned layouts rendering accurately across devices.", tag: "Export" },
    { icon: "lock", title: "Complete Privacy Mode", desc: "All client personal details reside strictly inside your immediate browser local state.", tag: "Secure" },
  ],
  fr: [
    { icon: "bot", title: "Moteur IA natif", desc: "Gemini IA génère du texte de CV de manière fluide et professionnelle.", tag: "IA" },
    { icon: "target", title: "Compatible ATS à 100%", desc: "Prêt pour les portails de recrutement modernes sans aucune rupture.", tag: "Smart" },
    { icon: "globe", title: "Multilingue et RTL", desc: "Gère l'arabe, le français et l'anglais avec de magnifiques polices adaptatives.", tag: "Global" },
    { icon: "zap", title: "Zéro barrière", desc: "Pas d'inscription ni d'e-mail requis pour commencer l'édition directe.", tag: "Rapide" },
    { icon: "file", title: "Exports de haute qualité", desc: "Vos PDF sont parfaitement lignés, propres et légers pour l'évaluation.", tag: "Export" },
    { icon: "lock", title: "Données protégées", desc: "Vos informations restent locales à votre navigateur. Aucun compte requis.", tag: "Sécurisé" },
  ],
}

const HEADINGS = {
  ar: { label: 'مزايا احترافية', title: 'أكثر من مجرد صانع سيرة ذاتية تقليدي', subtitle: 'طوّر سيرتك، نسّقها بدقة بالغة، واكسب ثقة مسؤولي التوظيف في دقائق.' },
  en: { label: 'Distinctive Features', title: 'Not just a Resume Builder', subtitle: 'A cohesive ecosystem of advanced tools designed to help you land premium corporate jobs.' },
  fr: { label: 'Avantages Professionnels', title: 'Plus qu\'un créateur de CV', subtitle: 'Une suite complète pour façonner, polir et propulser votre carrière.' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const currentFeatures = FEATURES[lang] || FEATURES['en']
  const heading = HEADINGS[lang] || HEADINGS['en']

  return (
    <section id="features" className="py-24 px-6 md:px-12 w-full bg-slate-50/30 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="inline-block bg-[#FF4D2D]/5 text-[#FF4D2D] text-[10px] font-black tracking-widest px-3.5 py-1 rounded-full mb-3.5 uppercase border border-[#FF4D2D]/10">
            {heading.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {heading.title}
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed font-medium">
            {heading.subtitle}
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentFeatures.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag }: { 
  icon: string, 
  title: string, 
  desc: string, 
  tag: string,
}) {
  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white border border-slate-150 rounded-2xl p-6 hover:border-[#FF4D2D]/20 shadow-3xs transition-all duration-300 relative overflow-hidden group hover:shadow-xs"
    >
      <div className="flex items-start justify-between mb-5">
        {/* Sleek Minimal Modern Icon container in Coral/Slate tones */}
        <div className="w-10 h-10 rounded-xl bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 group-hover:rotate-1 transition-transform">
          {IconComponent && (
            <IconComponent className="w-4.5 h-4.5 text-[#FF4D2D]" strokeWidth={2.0} />
          )}
        </div>
        <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md text-slate-500 bg-slate-100 border border-slate-200/50">
          {tag}
        </span>
      </div>
      
      <h3 className="text-[15px] font-bold text-slate-950 mb-1.5 leading-tight tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-semibold">
        {desc}
      </p>
    </motion.div>
  );
}
