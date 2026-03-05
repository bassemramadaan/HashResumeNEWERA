import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export default function ThemeToggle({ className, size = 20 }: { className?: string, size?: number }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${className || ''}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={size} /> : <Sun size={size} />}
    </button>
  );
}
