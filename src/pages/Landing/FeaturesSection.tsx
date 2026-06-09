import { useState, useRef } from 'react'
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
    { icon: "bot", title: "ذكاء اصطناعي حقيقي", desc: "Gemini AI يكتب المحتوى المهني بأسلوبك وبلمسة احترافية فريدة.", tag: "Gemini AI" },
    { icon: "target", title: "ATS متوافق 100%", desc: "قوالب سحابية مهيأة بالكامل لتمرير فحص التوظيف الآلي.", tag: "ATS v3" },
    { icon: "globe", title: "دعم حقيقي للاتجاهات", desc: "توجيه حقيقي ورائع للغة العربية والإنجليزية RTL و LTR.", tag: "ثنائي الاتجاه" },
    { icon: "zap", title: "بدء فوري بلا تسجيل", desc: "لا حسابات أو كلمات مرور معقدة، ابدأ التحرير مباشرة ووفر وقتك.", tag: "بدون حساب" },
    { icon: "file", title: "تصدير متكامل ورسمي", desc: "حمّل سيرتك بصيغة PDF نقية ومصقولة وجاهزة للتقديم المباشر.", tag: "PDF / Word" },
    { icon: "lock", title: "خصوصية بياناتك أولاً", desc: "بياناتك آمنة، لا يتم تخزين تفاصيلك الشخصية أبداً على خوادم عامة.", tag: "تخزين محلي" },
  ],
  en: [
    { icon: "bot", title: "True AI Engine", desc: "Gemini AI crafts rich professional content matched to your unique style.", tag: "Gemini AI" },
    { icon: "target", title: "100% ATS Friendly", desc: "Meticulously structure elements to bypass recruitment parsing software.", tag: "ATS v3" },
    { icon: "globe", title: "True Multilingual RTL", desc: "Perfect bi-directional handling, layout mirroring, and elegant fonts.", tag: "RTL / LTR" },
    { icon: "zap", title: "Frictionless Onboarding", desc: "No email verification or accounts. Start writing your CV in seconds flat.", tag: "No Account" },
    { icon: "file", title: "Professional PDF Export", desc: "Perfect vectors and aligned layouts rendering accurately across devices.", tag: "PDF / Word" },
    { icon: "lock", title: "Complete Privacy Mode", desc: "All client personal details reside strictly inside your immediate browser local state.", tag: "Local Safe" },
  ],
  fr: [
    { icon: "bot", title: "Moteur IA natif", desc: "Gemini IA génère du texte de CV de manière fluide et professionnelle.", tag: "Gemini AI" },
    { icon: "target", title: "Compatible ATS à 100%", desc: "Prêt pour les portails de recrutement modernes sans aucune rupture.", tag: "ATS v3" },
    { icon: "globe", title: "Multilingue et RTL", desc: "Gère l'arabe, le français et l'anglais avec de magnifiques polices adaptatives.", tag: "RTL / LTR" },
    { icon: "zap", title: "Zéro barrière", desc: "Pas d'inscription ni d'e-mail requis pour commencer l'édition directe.", tag: "Sans Compte" },
    { icon: "file", title: "Exports de haute qualité", desc: "Vos PDF sont parfaitement lignés, propres et légers pour l'évaluation.", tag: "Export PDF" },
    { icon: "lock", title: "Données protégées", desc: "Vos informations restent locales à votre navigateur. Aucun compte requis.", tag: "Local-First" },
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
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } }
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const currentFeatures = FEATURES[lang] || FEATURES['en']
  const heading = HEADINGS[lang] || HEADINGS['en']

  return (
    <section id="features" className="py-24 sm:py-32 px-6 md:px-12 w-full bg-slate-50/50 relative overflow-hidden select-none border-t border-slate-100">
      {/* Visual background lights for section ambient */}
      <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] rounded-full bg-rose-50/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-[350px] h-[350px] rounded-full bg-orange-50/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="inline-block bg-[#FF4D2D]/5 text-[#FF4D2D] text-[10px] font-black tracking-widest px-3.5 py-1 rounded-full mb-3.5 uppercase border border-[#FF4D2D]/10">
            {heading.label}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {heading.title}
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed font-semibold">
            {heading.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentFeatures.map((f, i) => {
            return <FeatureCard key={i} {...f} className="h-full flex flex-col justify-between" />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag, className }: { 
  icon: string, 
  title: string, 
  desc: string, 
  tag: string,
  className?: string,
}) {
  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={itemVariants as any}
      className={`bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 sm:p-8 hover:border-[#FF4D2D]/35 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] cursor-default ${className || ""}`}
    >
      {/* SaaS active glowing red blur trailing mouse on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-100"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(255, 77, 45, 0.09), transparent 80%)`
          }}
        />
      )}

      {/* Decorative subtle border color bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D2D]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-6 relative z-10">
        {/* Icon in branded coral container with hover rotation/scaling animation */}
        <div className="w-11 h-11 rounded-2xl bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
          {IconComponent && (
            <IconComponent className="w-5 h-5 text-[#FF4D2D]" strokeWidth={2.2} />
          )}
        </div>
        <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full text-slate-500 bg-slate-50 border border-slate-200/50">
          {tag}
        </span>
      </div>
      
      <div className="relative z-10 space-y-2">
        <h3 className="text-base sm:text-[17px] font-black text-slate-900 leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-semibold max-w-2xl">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
