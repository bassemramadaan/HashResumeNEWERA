import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useLanguageStore } from './store/useLanguageStore';
import PageLoader from './components/PageLoader';

const LandingPage = React.lazy(() => import('./views/LandingPage'));
const EditorPage = React.lazy(() => import('./views/EditorPage'));
const HashHuntPage = React.lazy(() => import('./views/HashHuntPage'));
const CoverLetterPage = React.lazy(() => import('./views/CoverLetterPage'));
const BlogPage = React.lazy(() => import('./views/BlogPage'));
const BlogPostPage = React.lazy(() => import('./views/BlogPostPage'));
const TemplatesPage = React.lazy(() => import('./views/TemplatesPage'));
const SharePage = React.lazy(() => import('./views/SharePage'));

export default function App() {
  const { theme } = useThemeStore();
  const { language, dir } = useLanguageStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <BrowserRouter>
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
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
