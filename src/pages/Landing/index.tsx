import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { Helmet } from "react-helmet-async"
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection }  from './PricingSection'
import LandingAtsTester from '@/components/landing/LandingAtsTester'
import SimpleSteps from '@/components/SimpleSteps'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import { CTASection } from '@/components/CTASection'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { AppLang } from '@/hooks/useDirection'

export default function LandingPage() {
  const navigate = useNavigate()
  const { language: lang } = useLanguageStore()
  const goToEditor = () => navigate('/editor')

  return (
    <>
      <Helmet>
        <title>Hash Resume — سيرتك الاحترافية في 5 دقائق</title>
        <meta name="description" content="أنشئ سيرتك الذاتية بالذكاء الاصطناعي في 5 دقائق. يدعم العربية والإنجليزية والفرنسية. ATS-Friendly. بدون تسجيل." />
        <link rel="canonical" href="https://hashresume.com/" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar onStartClick={goToEditor} />

        <main id="main-content" className="flex-1 bg-white">
          <HeroSection lang={lang as AppLang} onStart={goToEditor} />
          <SimpleSteps />
          <FeaturesSection lang={lang as AppLang} />
          <LandingAtsTester lang={lang as AppLang} onStartClick={goToEditor} />
          <TestimonialsSection lang={lang as AppLang} />
          <PricingSection lang={lang as AppLang} onPaidClick={goToEditor} />
          <FAQ />
          <CTASection lang={lang as AppLang} />
        </main>

        <Footer />
      </div>
    </>
  )
}
