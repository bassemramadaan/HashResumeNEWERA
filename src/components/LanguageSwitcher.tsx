import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function LanguageSwitcher({ className, size = 16 }: { className?: string; size?: number }) {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageSwitch = () => {
    if (language === 'en') setLanguage('ar');
    else if (language === 'ar') setLanguage('fr');
    else setLanguage('en');
  };

  const getTitle = () => {
    if (language === 'en') return 'Switch to Arabic';
    if (language === 'ar') return 'Switch to French';
    return 'Switch to English';
  };

  return (
    <button
      onClick={handleLanguageSwitch}
      className={cn(
        "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-300",
        "bg-white/50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20",
        "text-slate-600 dark:text-slate-300 hover:text-[#f16529] dark:hover:text-orange-400",
        "border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-200 dark:hover:border-orange-800/50",
        "text-xs",
        className
      )}
      title={getTitle()}
    >
      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Globe size={size} strokeWidth={2} />
      </motion.div>
      <span className="font-bold tracking-wider">
        {language.toUpperCase()}
      </span>
    </button>
  );
}
