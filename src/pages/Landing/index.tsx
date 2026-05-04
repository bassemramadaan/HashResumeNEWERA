import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { PricingSection }  from './PricingSection'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { AppLang } from '@/hooks/useDirection'

export default function LandingPage() {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguageStore()
  const goToEditor = () => navigate('/editor')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        lang={language as AppLang}
        onLangChange={(l) => setLanguage(l)}
        onStartClick={goToEditor}
      />

      <main id="main-content" className="flex-1">
        <HeroSection lang={language as AppLang} onStart={goToEditor} />
        <FeaturesSection lang={language as AppLang} />
        <PricingSection lang={language as AppLang} onPaidClick={goToEditor} />
      </main>

      <footer className="border-t border-neutral-200 py-8" style={{ backgroundColor: 'var(--color-neutral-0)' }}>
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <div className="flex items-center gap-1">
            <span style={{ color: 'var(--color-brand-500)', fontWeight: 600 }}>Hash</span>
            <span className="text-neutral-700 font-semibold">Resume</span>
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
