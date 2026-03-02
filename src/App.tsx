import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import HashHuntPage from './pages/HashHuntPage';
import CoverLetterPage from './pages/CoverLetterPage';
import { useThemeStore } from './store/useThemeStore';
import { useLanguageStore } from './store/useLanguageStore';

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/hash-hunt" element={<HashHuntPage />} />
        <Route path="/cover-letter" element={<CoverLetterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
