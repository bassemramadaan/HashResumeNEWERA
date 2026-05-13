import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { PricingSection }  from './PricingSection'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { AppLang } from '@/hooks/useDirection'
import Logo from '@/components/Logo'

export default function LandingPage() {
  const navigate = useNavigate()
  const { language: lang } = useLanguageStore()
  const goToEditor = () => navigate('/editor')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onStartClick={goToEditor} />

      <main id="main-content" className="flex-1">
        <HeroSection lang={lang as AppLang} onStart={goToEditor} />
        <FeaturesSection lang={lang as AppLang} />
        <PricingSection lang={lang as AppLang} onPaidClick={goToEditor} />
      </main>

      <footer className="border-t border-neutral-200 py-8" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <div className="flex items-center gap-1">
            <Logo width="auto" height={40} variant="gradient" />
            <span className="mx-2">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-neutral-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
