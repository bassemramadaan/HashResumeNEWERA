import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle, Briefcase, Code, FileText, Sparkles } from 'lucide-react'

interface MiniCVPreviewProps {
  lang: 'ar' | 'en' | 'fr'
}

const DATA = {
  ar: {
    name: 'أحمد ممدوح منصور',
    title: 'مهندس برمجيات أول (Team Lead)',
    phone: '+966 50 123 4567',
    email: 'ahmed.mansour@email.com',
    address: 'الرياض، المملكة العربية السعودية',
    summaryTitle: 'الملخص المهني',
    summaryText: 'مهندس برمجيات ذو خبرة 8+ سنوات في بناء التطبيقات السحابية فائقة الأداء وتصميم البنية التحتية القابلة للتوسع. قيادة فرق هندسية متعددة الجنسيات لتقديم حلول مبتكرة متوافقة مع معايير الـ ATS العالمية.',
    experienceTitle: 'الخبرات المهنية',
    exp1Title: 'مهندس برمجيات أول | حلول التقدم السحابية',
    exp1Date: '2022 - الآن',
    exp1Bullet1: '• تصميم وبناء بنية الخدمات المصغرة (Microservices) مما قلل زمن الاستجابة بنسبة 35%',
    exp1Bullet2: '• قيادة فريق من 6 مهندسين لتطوير نظام دفع إلكتروني آمن يعالج 10 آلاف عملية يومياً',
    exp2Title: 'مطور واجهات متكاملة | التقنية المتكاملة المحدودة',
    exp2Date: '2019 - 2022',
    exp2Bullet1: '• تطوير وتحديث لوحات تحكم متقدمة باستخدام React و TypeScript مما رفع تفاعل المستخدم بنسبة 50%',
    skillsTitle: 'المهارات التقنية',
    skills: ['React / Next.js', 'Node.js', 'Cloud Architecture', 'TypeScript', 'SQL / NoSQL', 'System Design', 'CI/CD Pipelines', 'ATS-Friendly Formats'],
    atsScore: 'معدل التوافق مع ATS: 98%',
    atsTip: 'تم تحسين الكلمات المفتاحية بذكاء'
  },
  en: {
    name: 'Alexander Mercer',
    title: 'Senior Software Engineer (Team Lead)',
    phone: '+1 (555) 019-2834',
    email: 'alex.mercer@email.com',
    address: 'Austin, Texas, United States',
    summaryTitle: 'Professional Summary',
    summaryText: 'Results-driven Software Engineer with 8+ years of expertise in designing highly scalable cloud systems and resilient backend structures. Proven record of leading cross-functional engineering teams to build products that scale smoothly.',
    experienceTitle: 'Work Experience',
    exp1Title: 'Senior Software Engineer | ScaleFlow Solutions',
    exp1Date: '2022 - Present',
    exp1Bullet1: '• Architected containerized microservices, reducing global API latency by 35%',
    exp1Bullet2: '• Mentored a team of 6 engineers to build secure payment integrations processing $2M+ monthly',
    exp2Title: 'Full-Stack Developer | NetCore Systems Inc.',
    exp2Date: '2019 - 2022',
    exp2Bullet1: '• Redesigned dynamic single-page applications using React & NestJS, boosting performance by 40%',
    skillsTitle: 'Core Competencies',
    skills: ['React / Next.js', 'Node.js', 'Cloud Computing', 'TypeScript', 'PostgreSQL', 'System Architecture', 'CI/CD Pipelines', 'ATS Optimization'],
    atsScore: 'ATS Compatibility: 98%',
    atsTip: 'Keywords optimized with AI suggestions'
  },
  fr: {
    name: 'Alexandre Mercier',
    title: 'Ingénieur Logiciel Senior (Chef d’équipe)',
    phone: '+33 6 12 34 56 78',
    email: 'alexandre.mercier@email.com',
    address: 'Paris, France',
    summaryTitle: 'Résumé Professionnel',
    summaryText: 'Ingénieur logiciel axé sur les résultats avec plus de 8 ans d’expertise dans la conception de systèmes cloud évolutifs et d’architectures backend résilientes. Expérience avérée dans la direction d’équipes d’ingénieurs.',
    experienceTitle: 'Expérience Professionnelle',
    exp1Title: 'Ingénieur Logiciel Senior | ScaleFlow Solutions',
    exp1Date: '2022 - Présent',
    exp1Bullet1: '• Architecture de microservices conteneurisés, réduisant la latence des API mondiales de 35%',
    exp1Bullet2: '• Encadré une équipe de 6 ingénieurs pour créer des intégrations de paiement sécurisées',
    exp2Title: 'Développeur Full-Stack | NetCore Systems',
    exp2Date: '2019 - 2022',
    exp2Bullet1: '• Refonte d’applications monopages dynamiques avec React & NestJS, améliorant les performances de 40%',
    skillsTitle: 'Compétences Clés',
    skills: ['React / Next.js', 'Node.js', 'Cloud Computing', 'TypeScript', 'PostgreSQL', 'Architecture Système', 'Pipelines CI/CD', 'Optimisation ATS'],
    atsScore: 'Compatibilité ATS : 98%',
    atsTip: 'Mots-clés optimisés par l’IA'
  }
}

export default function MiniCVPreview({ lang }: MiniCVPreviewProps) {
  const data = DATA[lang] || DATA['en']
  const isAr = lang === 'ar'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto px-4 mt-6 md:mt-12"
    >
      {/* Outer Floating Card Container */}
      <div className="relative group bg-slate-50/50 p-1.5 md:p-3 rounded-3xl border border-slate-250/60 shadow-2xl shadow-slate-200/50 hover:shadow-orange-500/10 transition-all duration-500">
        
        {/* ATS Score Floating Badge */}
        <div className={`absolute -top-3 ${isAr ? '-left-2 md:-left-4' : '-right-2 md:-right-4'} z-20 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 animate-bounce`} style={{ animationDuration: '4s' }}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{data.atsScore}</span>
        </div>

        {/* AI Optimization Tip Floating Badge */}
        <div className={`absolute -bottom-3 ${isAr ? '-right-2 md:-right-4' : '-left-2 md:-left-4'} z-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[9px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1.5`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span>{data.atsTip}</span>
        </div>

        {/* The Mock CV Card Body */}
        <div className="bg-white rounded-2xl border border-slate-150 p-5 md:p-8 text-start select-none relative overflow-hidden transition-all duration-300">
          
          {/* Subtle Document Gridline Effect */}
          <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] pointer-events-none -z-10" />

          {/* CV Header */}
          <div className="border-b border-slate-100 pb-5 mb-5">
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight">{data.name}</h2>
            <p className="text-xs md:text-sm font-semibold text-orange-600 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {data.title}
            </p>
            
            {/* Quick Contact Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] md:text-xs text-slate-500 font-medium">
              <span>{data.phone}</span>
              <span className="opacity-40">|</span>
              <span>{data.email}</span>
              <span className="opacity-40">|</span>
              <span>{data.address}</span>
            </div>
          </div>

          {/* Two-Column Grid for larger screens, Stacked on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left/Right Column: Personal Summary & Experience (Col span 2) */}
            <div className="md:col-span-2 space-y-5">
              
              {/* Summary Section */}
              <div className="space-y-2">
                <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  {data.summaryTitle}
                </h3>
                <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-medium bg-orange-50/20 p-2.5 rounded-lg border border-orange-100/30">
                  {data.summaryText}
                </p>
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                  {data.experienceTitle}
                </h3>
                
                {/* Job 1 */}
                <div className="space-y-1.5 relative border-s border-slate-150 ps-3.5">
                  <div className="absolute w-2 h-2 rounded-full bg-orange-500 -start-[4.5px] top-1" />
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <h4 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight">{data.exp1Title}</h4>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{data.exp1Date}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-normal font-medium">{data.exp1Bullet1}</p>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-normal font-medium">{data.exp1Bullet2}</p>
                </div>

                {/* Job 2 */}
                <div className="space-y-1.5 relative border-s border-slate-150 ps-3.5">
                  <div className="absolute w-2 h-2 rounded-full bg-slate-300 -start-[4.5px] top-1" />
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <h4 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight">{data.exp2Title}</h4>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{data.exp2Date}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-600 leading-normal font-medium">{data.exp2Bullet1}</p>
                </div>

              </div>

            </div>

            {/* Right/Left Column: Skills & Badges */}
            <div className="space-y-4 border-t md:border-t-0 md:border-s border-slate-100 pt-4 md:pt-0 md:ps-6">
              <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-orange-500" />
                {data.skillsTitle}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9px] md:text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-150 hover:border-orange-200 px-2.5 py-1 rounded-md transition-all duration-250 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  )
}
