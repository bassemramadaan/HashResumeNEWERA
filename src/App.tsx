import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { MotionConfig } from "motion/react";
import PageLoader from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { BottomNavBar } from "./components/BottomNavBar";
import { OfflineIndicator } from "./components/ui/OfflineIndicator";

const lazyRetry = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) => {
  return React.lazy(async () => {
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem("lazy-retry-refreshed") || "false"
    );
    try {
      const component = await componentImport();
      window.sessionStorage.setItem("lazy-retry-refreshed", "false");
      return component;
    } catch (error) {
      if (!hasRefreshed) {
        window.sessionStorage.setItem("lazy-retry-refreshed", "true");
        window.location.reload();
      }
      throw error;
    }
  });
};

const LandingPage = lazyRetry(() => import("./pages/Landing/index"));
const EditorPage = lazyRetry(() => import("./pages/EditorPage"));
const HashHuntPage = lazyRetry(() => import("./pages/HashHuntPage"));
const PricingPage = lazyRetry(() => import("./pages/PricingPage"));
const PaymentPage = lazyRetry(() => import("./pages/PaymentPage"));
const PaymentSuccessPage = lazyRetry(() => import("./pages/PaymentSuccessPage"));
const BlogPage = lazyRetry(() => import("./pages/BlogPage"));
const BlogPostPage = lazyRetry(() => import("./pages/BlogPostPage"));
const TemplatesPage = lazyRetry(() => import("./pages/TemplatesPage"));
const SharePage = lazyRetry(() => import("./pages/SharePage"));
const PrivacyPage = lazyRetry(() => import("./pages/PrivacyPage"));
const TermsOfServicePage = lazyRetry(() => import("./pages/TermsOfServicePage"));
const HowAtsWorksPage = lazyRetry(() => import("./pages/HowAtsWorksPage"));
const TrustPage = lazyRetry(() => import("./pages/TrustPage"));
const FAQPage = lazyRetry(() => import("./pages/FAQPage"));
const NotFoundPage = lazyRetry(() => import("./pages/NotFoundPage"));
const DashboardPage = lazyRetry(() => import("./pages/DashboardPage"));

import { initGA, trackPageView } from "./services/analytics";
import { useLanguageStore } from "./store/useLanguageStore";
import { useDeviceState } from "./hooks/useDeviceState";

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
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/hash-hunt" element={<HashHuntPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/checkout" element={<Navigate to="/payment" replace />} />
          <Route path="/jobs" element={<Navigate to="/hash-hunt" replace />} />
          <Route path="/cover-letter" element={<Navigate to="/editor" replace />} />
          <Route path="/interview-prep" element={<Navigate to="/blog/interview-preparation-guide" replace />} />
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
        <OfflineIndicator />
        {import.meta.env.PROD && <Analytics />}
      </Suspense>
    </div>
  );
}

export default function App() {
  const { language, dir } = useLanguageStore();
  const { isMobile } = useDeviceState();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [language, dir]);

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
