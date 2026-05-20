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
    { icon: "bot", title: "ذكاء اصطناعي حقيقي", desc: "Gemini AI يكتب المحتوى المهني بأسلوبك — مش ترجمة حرفية من إنجليزي.", tag: "AI", tagColor: "text-[#FF4D2D]", tagBg: "bg-[#FF4D2D]/10", iconColor: "text-[#FF4D2D]", iconBg: "bg-[#FF4D2D]/5 border-[#FF4D2D]/10" },
    { icon: "target", title: "ATS متوافق 100%", desc: "كل الـ templates مصممة تعدي أنظمة الفلترة الأوتوماتيكية عند أكبر الشركات.", tag: "مهم", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
    { icon: "globe", title: "عربي • إنجليزي • فرنسي", desc: "RTL حقيقي للعربي — مش مجرد تعكيس للنص. الوحيد في السوق بيدعم الفرنسية.", tag: "حصري", tagColor: "text-indigo-700", tagBg: "bg-indigo-100", iconColor: "text-indigo-600", iconBg: "bg-indigo-50 border-indigo-100" },
    { icon: "zap", title: "5 دقائق بدون تسجيل", desc: "مفيش account، مفيش email، مفيش انتظار. تبدأ دلوقتي وتنزّل PDF على طول.", tag: "سريع", tagColor: "text-amber-700", tagBg: "bg-amber-100", iconColor: "text-amber-600", iconBg: "bg-amber-50 border-amber-100" },
    { icon: "file", title: "PDF + Word تصدير", desc: "نزّل بالصيغتين. كتير من أصحاب العمل في MENA بيطلبوا Word صريح.", tag: "مميز", tagColor: "text-blue-700", tagBg: "bg-blue-100", iconColor: "text-blue-600", iconBg: "bg-blue-50 border-blue-100" },
    { icon: "lock", title: "خصوصية كاملة", desc: "بياناتك مش بتتخزن على سيرفراتنا. كل شيء بيشتغل في المتصفح بتاعك.", tag: "آمن", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
  ],
  en: [
    { icon: "bot", title: "True AI", desc: "Gemini AI writes professional content in your style — not just literal translation.", tag: "AI", tagColor: "text-[#FF4D2D]", tagBg: "bg-[#FF4D2D]/10", iconColor: "text-[#FF4D2D]", iconBg: "bg-[#FF4D2D]/5 border-[#FF4D2D]/10" },
    { icon: "target", title: "100% ATS Friendly", desc: "All templates are designed to pass automated filtering systems at top companies.", tag: "Important", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
    { icon: "globe", title: "Arabic • English • French", desc: "True RTL for Arabic. We are the only platform supporting French natively.", tag: "Exclusive", tagColor: "text-indigo-700", tagBg: "bg-indigo-100", iconColor: "text-indigo-600", iconBg: "bg-indigo-50 border-indigo-100" },
    { icon: "zap", title: "5 Mins, No Sign-up", desc: "No account, no email, no waiting. Start now and download PDF instantly.", tag: "Fast", tagColor: "text-amber-700", tagBg: "bg-amber-100", iconColor: "text-amber-600", iconBg: "bg-amber-50 border-amber-100" },
    { icon: "file", title: "PDF + Word Export", desc: "Download in both formats. Many employers in MENA explicitly request Word.", tag: "Special", tagColor: "text-blue-700", tagBg: "bg-blue-100", iconColor: "text-blue-600", iconBg: "bg-blue-50 border-blue-100" },
    { icon: "lock", title: "Complete Privacy", desc: "Your data is not stored on our servers. Everything runs entirely in your browser.", tag: "Secure", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
  ],
  fr: [
    { icon: "bot", title: "Vraie IA", desc: "L'IA Gemini rédige du contenu de façon professionnelle dans votre style.", tag: "IA", tagColor: "text-[#FF4D2D]", tagBg: "bg-[#FF4D2D]/10", iconColor: "text-[#FF4D2D]", iconBg: "bg-[#FF4D2D]/5 border-[#FF4D2D]/10" },
    { icon: "target", title: "100% Compatible ATS", desc: "Tous les modèles sont conçus pour passer les systèmes de filtrage automatisés.", tag: "Important", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
    { icon: "globe", title: "Arabe • Anglais • Français", desc: "Véritable RTL pour l'arabe. La seule plateforme qui gère parfaitement le français.", tag: "Exclusif", tagColor: "text-indigo-700", tagBg: "bg-indigo-100", iconColor: "text-indigo-600", iconBg: "bg-indigo-50 border-indigo-100" },
    { icon: "zap", title: "5 Min, Sans Inscription", desc: "Pas de compte, ni d'email, ni d'attente. Commencez et téléchargez votre PDF.", tag: "Rapide", tagColor: "text-amber-700", tagBg: "bg-amber-100", iconColor: "text-amber-600", iconBg: "bg-amber-50 border-amber-100" },
    { icon: "file", title: "Export PDF + Word", desc: "Téléchargez dans les deux formats. Pratique pour les employeurs qui demandent Word.", tag: "Spécial", tagColor: "text-blue-700", tagBg: "bg-blue-100", iconColor: "text-blue-600", iconBg: "bg-blue-50 border-blue-100" },
    { icon: "lock", title: "Confidentialité totale", desc: "Vos données ne sont pas stockées. Tout s'exécute localement dans votre navigateur.", tag: "Sécurisé", tagColor: "text-emerald-700", tagBg: "bg-emerald-100", iconColor: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
  ],
}

const HEADINGS = {
  ar: { label: 'كل اللي محتاجه', title: 'مش بس Resume Builder', subtitle: 'أدوات كاملة لمساعدتك تحصل على الوظيفة — من كتابة السيرة لحد ما تعدي الـ ATS' },
  en: { label: 'Everything you need', title: 'Not just a Resume Builder', subtitle: 'Complete tools to help you land the job — from writing the CV to passing the ATS.' },
  fr: { label: 'Tout ce dont vous avez besoin', title: 'Plus qu\'un créateur de CV', subtitle: 'Des outils complets pour décrocher le poste — de la rédaction à l\'optimisation ATS.' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const currentFeatures = FEATURES[lang] || FEATURES['en']
  const heading = HEADINGS[lang] || HEADINGS['en']

  return (
    <section id="features" className="py-24 px-6 md:px-12 w-full bg-white select-none">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block bg-[#FF4D2D]/10 text-[#FF4D2D] text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-4 uppercase">
            {heading.label}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
            {heading.title}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {heading.subtitle}
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700"
        >
          {currentFeatures.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag, tagColor, tagBg, iconColor, iconBg }: { 
  icon: string, 
  title: string, 
  desc: string, 
  tag: string, 
  tagColor: string, 
  tagBg: string,
  iconColor?: string,
  iconBg?: string
}) {
  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white border border-slate-200/60 rounded-[1.25rem] p-6 transition-all duration-300 hover:border-[#FF4D2D]/30 hover:shadow-xl hover:shadow-[#FF4D2D]/5 hover:-translate-y-1 relative overflow-hidden group cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D2D]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10 index-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-2xl ${iconBg || 'bg-slate-50 border-slate-100'} border flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs shrink-0`}>
            {IconComponent && (
              <IconComponent className={`w-5 h-5 ${iconColor || 'text-slate-700'}`} strokeWidth={2.4} />
            )}
          </div>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${tagColor} ${tagBg}`}>
            {tag}
          </span>
        </div>
        <h3 className="text-lg font-black text-slate-950 mb-2 group-hover:text-[#FF4D2D] transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed font-semibold">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}