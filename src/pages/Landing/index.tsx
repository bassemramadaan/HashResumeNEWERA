import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { Helmet } from "react-helmet-async"
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import LandingAtsTester from '@/components/landing/LandingAtsTester'
import Footer from '@/components/Footer'
import { CTASection } from '@/components/CTASection'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { AppLang } from '@/hooks/useDirection'
import { motion, AnimatePresence } from 'motion/react'
import { FileText, LayoutGrid } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { language: lang } = useLanguageStore()
  const goToEditor = () => navigate('/templates')

  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowSticky(true)
      } else {
        setShowSticky(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  // Translation copy for Sticky bar
  const buildCvText = isAr ? 'أنشئ سيرتك الذاتية' : isFr ? 'Créer mon CV' : 'Build CV'
  const templatesText = isAr ? 'عرض القوالب' : isFr ? 'Voir modèles' : 'See Templates'

  return (
    <>
      <Helmet>
        <title>Hash Resume — سيرتك الاحترافية في 5 دقائق</title>
        <meta name="description" content="أنشئ سيرتك الذاتية بالذكاء الاصطناعي في 5 دقائق. يدعم العربية والإنجليزية والفرنسية. ATS-Friendly. بدون تسجيل." />
        <link rel="canonical" href="https://hashresume.com/" />
        <link rel="alternate" hrefLang="en" href="https://hashresume.com/?lang=en" />
        <link rel="alternate" hrefLang="ar" href="https://hashresume.com/?lang=ar" />
        <link rel="alternate" hrefLang="fr" href="https://hashresume.com/?lang=fr" />
        <link rel="alternate" hrefLang="x-default" href="https://hashresume.com/" />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Hash Resume",
              "description": "أنشئ سيرتك الذاتية بالذكاء الاصطناعي في 5 دقائق. يدعم العربية والإنجليزية والفرنسية. ATS-Friendly. بدون تسجيل.",
              "url": "https://hashresume.com/",
              "applicationCategory": "Utilities",
              "operatingSystem": "Web"
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Hash Resume",
              "operatingSystem": "All",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "120",
                "priceCurrency": "EGP"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1420"
              }
            }
          ])}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar onStartClick={goToEditor} />

        <main id="main-content" className="flex-1 bg-white">
          <HeroSection lang={lang as AppLang} onStart={goToEditor} />
          <FeaturesSection lang={lang as AppLang} />
          <LandingAtsTester lang={lang as AppLang} onStartClick={goToEditor} />
          <CTASection lang={lang as AppLang} />
        </main>

        <Footer />

        {/* ── Beautiful, Scroll-Aware Sticky Mobile CTA ── */}
        <AnimatePresence>
          {showSticky && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="fixed bottom-4 left-4 right-4 z-50 md:hidden pointer-events-auto"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.15)] p-2 rounded-2xl flex items-center justify-between gap-2.5">
                {/* Secondary: Templates button */}
                <button
                  onClick={goToEditor}
                  className="flex-1 h-12 flex items-center justify-center gap-1.5 bg-slate-50 active:bg-slate-100 hover:bg-slate-100/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/70 cursor-pointer transition-all active:scale-[0.97]"
                >
                  <LayoutGrid size={14} className="opacity-80" />
                  <span className="whitespace-nowrap">{templatesText}</span>
                </button>

                {/* Primary: Build CV button */}
                <button
                  onClick={goToEditor}
                  className="flex-[1.4] h-12 flex items-center justify-center gap-1.5 bg-brand-600 active:bg-brand-700 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.97]"
                >
                  <FileText size={14} className="shrink-0" />
                  <span className="whitespace-nowrap">{buildCvText}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
