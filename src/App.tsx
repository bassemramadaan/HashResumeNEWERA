import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import { useLanguageStore } from "./store/useLanguageStore";
import { useThemeStore } from "./store/useThemeStore";
import PageLoader from "./components/PageLoader";
import ExitIntentPopup from "./components/ExitIntentPopup";
import { ErrorBoundary } from "./components/ErrorBoundary";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const EditorPage = React.lazy(() => import("./pages/EditorPage"));
const HashHuntPage = React.lazy(() => import("./pages/HashHuntPage"));
const CoverLetterPage = React.lazy(() => import("./pages/CoverLetterPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage"));
const TemplatesPage = React.lazy(() => import("./pages/TemplatesPage"));
const SharePage = React.lazy(() => import("./pages/SharePage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsOfServicePage = React.lazy(() => import("./pages/TermsOfServicePage"));
const HowAtsWorksPage = React.lazy(() => import("./pages/HowAtsWorksPage"));
const WhyNoSignupPage = React.lazy(() => import("./pages/WhyNoSignupPage"));

export default function App() {
  const { language, dir } = useLanguageStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/hash-hunt" element={<HashHuntPage />} />
              <Route path="/cover-letter" element={<CoverLetterPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/share/:id" element={<SharePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/how-ats-works" element={<HowAtsWorksPage />} />
              <Route path="/why-no-signup" element={<WhyNoSignupPage />} />
            </Routes>
            <ExitIntentPopup />
            <Analytics />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
}
