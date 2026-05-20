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
        
        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--color-brand-500)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
          <div className="container-page relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              {lang === 'ar' ? 'مستعد تبدأ مسيرتك المهنية؟' : lang === 'fr' ? 'Prêt à lancer votre carrière ?' : 'Ready to start your career journey?'}
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              {lang === 'ar' 
                ? 'انضم لآلاف المستخدمين اللي بنوا سيرتهم الذاتية في دقايق.'
                : lang === 'fr'
                ? 'Rejoignez des milliers d\'utilisateurs qui ont créé leur CV en quelques minutes.'
                : 'Join thousands of users who built their resumes in minutes.'}
            </p>
            <button 
              onClick={goToEditor}
              className="bg-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              style={{ color: 'var(--color-brand-500)' }}
            >
              {lang === 'ar' ? 'أنشئ سيرتك الآن' : lang === 'fr' ? 'Créer mon CV maintenant' : 'Create My Resume Now'}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
