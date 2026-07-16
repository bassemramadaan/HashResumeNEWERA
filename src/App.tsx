import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import PageLoader from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { BottomNavBar } from "./components/BottomNavBar";
import { WhatsAppWidget } from "./components/WhatsAppWidget";

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
    <div className={isEditor ? "" : "pb-24 lg:pb-0"}>
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
        <WhatsAppWidget />
      </Suspense>
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

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      <HelmetProvider>
        <BrowserRouter>
          <GAListener />
          <ScrollToTop />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </GoogleReCaptchaProvider>
  );
}
