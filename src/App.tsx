import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { MotionConfig } from "motion/react";
import PageLoader from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { BottomNavBar } from "./components/BottomNavBar";

const LandingPage = React.lazy(() => import("./pages/Landing/index"));
const EditorPage = React.lazy(() => import("./pages/EditorPage"));
const HashHuntPage = React.lazy(() => import("./pages/HashHuntPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const PaymentSuccessPage = React.lazy(() => import("./pages/PaymentSuccessPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage"));
const TemplatesPage = React.lazy(() => import("./pages/TemplatesPage"));
const SharePage = React.lazy(() => import("./pages/SharePage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsOfServicePage = React.lazy(() => import("./pages/TermsOfServicePage"));
const HowAtsWorksPage = React.lazy(() => import("./pages/HowAtsWorksPage"));
const TrustPage = React.lazy(() => import("./pages/TrustPage"));
const FAQPage = React.lazy(() => import("./pages/FAQPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const CoverLetterPage = React.lazy(() => import("./pages/CoverLetterPage"));

import { initGA, trackPageView } from "./services/analytics";
import { useLanguageStore } from "./store/useLanguageStore";

function GAListener() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}


function AppContent() {
  const location = useLocation();
  const isEditor = location.pathname === "/editor" || location.pathname.startsWith("/share/");
  const currentPath = location.pathname;
  const baseUrl = "https://hashresume.com";

  return (
    <div className={isEditor ? "" : "pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0"}>
      <Helmet>
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentPath}`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentPath}`} />
        <link rel="alternate" hrefLang="ar" href={`${baseUrl}${currentPath}`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}${currentPath}`} />
      </Helmet>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/hash-hunt" element={<HashHuntPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/checkout" element={<Navigate to="/payment" replace />} />
          <Route path="/jobs" element={<Navigate to="/hash-hunt" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/share/:id" element={<SharePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/trust" element={<TrustPage />} />
          <Route path="/how-ats-works" element={<HowAtsWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {!isEditor && <BottomNavBar />}
        <Analytics />
      </Suspense>

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/201101007965"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed ${isEditor ? 'bottom-24 lg:bottom-6' : 'bottom-[130px] lg:bottom-6'} right-4 lg:right-6 z-[9999] w-12 h-12 rounded-full bg-[#128C7E] hover:bg-[#0a5249] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/10`}
        title="WhatsApp Support"
        aria-label="WhatsApp Support"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.473 1.332 4.988L2 22l5.178-1.332a9.923 9.923 0 004.834 1.32c5.506 0 10-4.494 10-10.012C22.012 6.482 17.518 2 12.012 2zm6.208 14.154c-.255.723-1.47 1.326-2.03 1.385-.56.06-1.12.12-3.61-.884-2.484-1.002-4.085-3.535-4.205-3.695-.12-.16-.97-1.285-.97-2.447 0-1.162.603-1.733.82-1.97.22-.238.48-.3.639-.3s.322-.012.46-.012c.14 0 .326.012.5.422.18.423.616 1.503.67 1.61.054.108.09.23.018.374-.072.144-.108.23-.217.35-.108.12-.228.275-.326.37-.11.11-.223.23-.09.46.13.23.58.956 1.246 1.55.857.765 1.577.995 1.8.104.22-.11.482-.47.61-.63.12-.16.24-.13.41-.07.17.06 1.07.505 1.25.596.18.09.3.132.343.21.043.078.043.452-.21 1.175z" />
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  const { language, dir } = useLanguageStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [language, dir]);

  const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Using test key as fallback
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <HelmetProvider>
      <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
        <BrowserRouter>
          <GAListener />
          <ScrollToTop />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </MotionConfig>
    </HelmetProvider>
  );
}
