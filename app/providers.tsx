"use client";

import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../src/store/useThemeStore';
import { useLanguageStore } from '../src/store/useLanguageStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useThemeStore();
  const { language, dir } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
}
