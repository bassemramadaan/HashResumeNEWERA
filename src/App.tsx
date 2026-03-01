import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import HashHuntPage from './pages/HashHuntPage';
import CoverLetterPage from './pages/CoverLetterPage';
import { useThemeStore } from './store/useThemeStore';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
