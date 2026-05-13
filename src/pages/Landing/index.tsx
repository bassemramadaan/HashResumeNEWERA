import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { PricingSection }  from './PricingSection'
import Testimonials from '@/components/Testimonials'
import SimpleSteps from '@/components/SimpleSteps'
import Footer from '@/components/Footer'
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
        <Testimonials />
        <PricingSection lang={lang as AppLang} onPaidClick={goToEditor} />
      </main>

      <Footer />
    </div>
  )
}
