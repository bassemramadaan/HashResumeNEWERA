import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BarChart2, FileText, Users, Undo2, Globe, HelpCircle } from 'lucide-react'
import { PageSection, SectionHeading } from '@/components/layout/PageSection'
import HashHuntModal from '@/components/HashHuntModal'
import { cn } from '@/lib/utils'
import type { AppLang } from '@/hooks/useDirection'

interface FeaturesSectionProps { lang: AppLang }

const FEATURES = {
  ar: [
    { icon: Sparkles,   title: 'ذكاء اصطناعي يكتب عنك',   desc: 'Gemini يولّد محتوى احترافيًا لكل قسم بناءً على مجالك ومستواك الوظيفي.', badge: null,     color: 'brand' },
    { icon: BarChart2,  title: 'تقييم ATS فوري',            desc: 'اعرف مدى توافق سيرتك مع أنظمة التوظيف قبل إرسالها لأي شركة.',           badge: 'مجاني',  color: 'success' },
    { icon: FileText,   title: 'Cover Letter تلقائي',       desc: 'خطاب تقديم مخصص لكل وظيفة بضغطة واحدة — باستخدام نفس بيانات سيرتك.',    badge: null,     color: 'info' },
    { icon: Users,      title: 'Hash Hunt',                  desc: 'اسمح للشركات بإيجادك مباشرة من سيرتك. يُعرض profile على أصحاب العمل.', badge: 'جديد',   color: 'warning' },
    { icon: Undo2,      title: 'تراجع عن أي تعديل',         desc: 'Ctrl+Z يرجعك لأي نقطة — كل التعديلات محفوظة في التاريخ.',               badge: null,     color: 'neutral' },
    { icon: Globe,      title: 'ثلاث لغات كاملة',           desc: 'سيرة واحدة بعدة لغات — عربي، إنجليزي، فرنسي. كل لغة بخط مناسب.',        badge: null,     color: 'brand' },
  ],
  en: [
    { icon: Sparkles,   title: 'AI Writes For You',         desc: 'Gemini generates professional content for every section based on your field.', badge: null,    color: 'brand' },
    { icon: BarChart2,  title: 'Instant ATS Score',         desc: 'See how well your resume performs with applicant tracking systems.',           badge: 'Free',  color: 'success' },
    { icon: FileText,   title: 'Auto Cover Letter',         desc: 'A tailored cover letter for each job in one click.',                           badge: null,    color: 'info' },
    { icon: Users,      title: 'Hash Hunt',                 desc: 'Let companies find you directly from your resume.',                            badge: 'New',   color: 'warning' },
    { icon: Undo2,      title: 'Full Undo History',         desc: 'Ctrl+Z brings back any change. Every edit is tracked.',                       badge: null,    color: 'neutral' },
    { icon: Globe,      title: 'Three Full Languages',      desc: 'Arabic, English, French — each with proper font and direction.',               badge: null,    color: 'brand' },
  ],
  fr: [
    { icon: Sparkles,   title: "L'IA rédige pour vous",     desc: "Gemini génère du contenu professionnel pour chaque section.",                 badge: null,       color: 'brand' },
    { icon: BarChart2,  title: 'Score ATS instantané',      desc: "Vérifiez la compatibilité de votre CV avec les systèmes de recrutement.",    badge: 'Gratuit',  color: 'success' },
    { icon: FileText,   title: 'Lettre de motivation auto', desc: 'Une lettre personnalisée pour chaque offre en un clic.',                     badge: null,       color: 'info' },
    { icon: Users,      title: 'Hash Hunt',                 desc: 'Laissez les entreprises vous trouver directement.',                          badge: 'Nouveau',  color: 'warning' },
    { icon: Undo2,      title: 'Historique complet',        desc: 'Ctrl+Z annule chaque modification.',                                         badge: null,       color: 'neutral' },
    { icon: Globe,      title: 'Trois langues complètes',   desc: 'Arabe, anglais, français — chacun avec la typographie adaptée.',             badge: null,       color: 'brand' },
  ],
}

const HEADINGS = {
  ar: { label: 'الميزات', title: 'كل ما تحتاجه في مكان واحد', subtitle: 'أدوات لا تجدها مجتمعة في أي منصة أخرى في المنطقة' },
  en: { label: 'Features', title: 'Everything you need, in one place', subtitle: "Tools you won't find together on any other platform in the region" },
  fr: { label: 'Fonctionnalités', title: 'Tout ce dont vous avez besoin', subtitle: 'Des outils uniques, réunis en une seule plateforme pour la région MENA' },
}

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  brand:   { bg: 'var(--color-brand-50)',     icon: 'var(--color-brand-500)' },
  success: { bg: 'var(--color-success-light)', icon: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning-light)', icon: 'var(--color-warning)' },
  info:    { bg: 'var(--color-info-light)',    icon: 'var(--color-info)' },
  neutral: { bg: 'var(--color-neutral-100)',  icon: 'var(--color-neutral-600)' },
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const [isHashHuntOpen, setIsHashHuntOpen] = useState(false)
  const features = FEATURES[lang] || FEATURES['en']
  const heading  = HEADINGS[lang] || HEADINGS['en']

  return (
    <PageSection bg="white" id="features">
      <SectionHeading label={heading.label} title={heading.title} subtitle={heading.subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const colors    = COLOR_MAP[f.color]
          const IconComp  = f.icon
          const isHashHunt = f.title.includes('Hash Hunt')
          
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              onClick={() => isHashHunt && setIsHashHuntOpen(true)}
              className={cn(
                "card-hover flex flex-col gap-3 group/card p-6",
                isHashHunt && "cursor-pointer border-brand-200 hover:border-brand-500"
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.bg }}
                >
                  <IconComp className="w-5 h-5" style={{ color: colors.icon }} />
                </div>
                {isHashHunt && (
                  <div className="text-[10px] font-black p-1 text-brand-600 bg-brand-50 rounded-md flex items-center gap-1 group-hover/card:bg-brand-600 group-hover/card:text-white transition-colors">
                    <HelpCircle size={10} />
                    {lang === 'ar' ? 'تعرف أكثر' : 'How it works?'}
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-neutral-800">{f.title}</h3>
                {f.badge && <span className="badge badge-brand flex-shrink-0">{f.badge}</span>}
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          )
        })}
      </div>
      
      <HashHuntModal isOpen={isHashHuntOpen} onClose={() => setIsHashHuntOpen(false)} />
    </PageSection>
  )
}
