import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { cn } from '../lib/utils';

export default function LanguageSwitcher({ className, size = 16 }: { className?: string; size?: number }) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800",
        className
      )}
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={size} />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
