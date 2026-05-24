import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Navbar }          from '@/components/layout/Navbar'
import { HeroSection }     from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { PricingSection }  from './PricingSection'
import LandingAtsTester from '@/components/landing/LandingAtsTester'
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
        <LandingAtsTester lang={lang as AppLang} onStartClick={goToEditor} />
        <PricingSection lang={lang as AppLang} onPaidClick={goToEditor} />
        
        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden bg-[#FF4D2D]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
          
          {/* Animated decorative shapes */}
          <div 
             className="absolute -top-[20%] -end-[10%] w-[50%] h-[150%] rounded-full bg-white opacity-5 pointer-events-none blur-3xl transform rotate-45" 
          />
          <div 
             className="absolute -bottom-[20%] -start-[10%] w-[40%] h-[120%] rounded-full bg-white opacity-5 pointer-events-none blur-3xl transform -rotate-45" 
          />

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container-page relative z-10 flex flex-col items-center text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
              {lang === 'ar' ? 'مستعد تبدأ مسيرتك المهنية؟' : lang === 'fr' ? 'Prêt à lancer votre carrière ?' : 'Ready to start your career journey?'}
            </h2>
            <p className="text-white/90 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
              {lang === 'ar' 
                ? 'انضم لآلاف المستخدمين اللي بنوا سيرتهم الذاتية في دقايق.'
                : lang === 'fr'
                ? 'Rejoignez des milliers d\'utilisateurs qui ont créé leur CV en quelques minutes.'
                : 'Join thousands of users who built their resumes in minutes.'}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={goToEditor}
              className="bg-white text-[#FF4D2D] px-10 py-5 rounded-full font-black text-xl shadow-xl transition-all flex items-center gap-3 group"
            >
              {lang === 'ar' ? 'أنشئ سيرتك الآن' : lang === 'fr' ? 'Créer mon CV maintenant' : 'Create My Resume Now'}
              <motion.span 
                 animate={{ x: lang === 'ar' ? [-3, 0, -3] : [3, 0, 3] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                 className="group-hover:opacity-80"
              >
                {lang === 'ar' ? '←' : '→'}
              </motion.span>
            </motion.button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
