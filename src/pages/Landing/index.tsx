import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
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
    <div className="min-h-screen flex flex-col">
      <Navbar onStartClick={goToEditor} />

      <main id="main-content" className="flex-1">
        <HeroSection lang={lang as AppLang} onStart={goToEditor} />
        <SimpleSteps />
        <FeaturesSection lang={lang as AppLang} />
        <LandingAtsTester lang={lang as AppLang} onStartClick={goToEditor} />
        <PricingSection lang={lang as AppLang} onPaidClick={goToEditor} />
        <FAQ />
        <CTASection lang={lang as AppLang} />
      </main>

      <Footer />
    </div>
  )
}
