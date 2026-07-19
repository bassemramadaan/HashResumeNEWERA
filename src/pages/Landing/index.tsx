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

export default function LandingPage() {
  const navigate = useNavigate()
  const { language: lang } = useLanguageStore()
  const goToEditor = () => navigate('/templates')

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
      </div>
    </>
  )
}
