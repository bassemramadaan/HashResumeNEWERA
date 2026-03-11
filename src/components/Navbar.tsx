import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, Target, ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { cn } from '../utils';

export default function Navbar() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.landing.templates || 'Templates', path: '/templates' },
    { name: t.landing.coverLetter || 'Cover Letter', path: '/cover-letter', icon: <PenTool size={14} /> },
    { name: t.landing.blog || 'Blog', path: '/blog' },
    { name: t.landing.hashHuntJobs || 'Hash Hunt', path: '/hash-hunt', icon: <Target size={18} className="text-[#f16529]" />, highlight: true },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-[#f16529] group-hover:scale-105 transition-transform">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Hash<span className="text-[#f16529]">Resume</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2",
                  location.pathname === link.path
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                    : link.highlight
                      ? "text-[#f16529] hover:opacity-80"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher size={18} className="text-sm px-4 py-2" />
            <Link 
              to="/editor" 
              className="flex items-center gap-2 bg-[#f16529] hover:bg-[#e44d26] text-white font-bold py-2 px-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group"
            >
              <span className="text-sm tracking-tight">{t.landing.buildResume || 'Build Resume'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher size={18} className="text-sm p-2" />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-base font-bold rounded-xl transition-all flex items-center gap-3",
                  location.pathname === link.path
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                    : link.highlight
                      ? "text-[#f16529] bg-orange-50 dark:bg-orange-900/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
            <Link 
              to="/editor" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#f16529] text-white font-bold py-3 px-5 rounded-xl text-center"
            >
              {t.landing.buildResume || 'Build Resume'}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
