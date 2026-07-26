import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, LayoutTemplate, Tag, Plus, Briefcase } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const isActive = (path: string) => location.pathname === path;

  const labels = {
    home: isRtl ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home',
    templates: isRtl ? 'القوالب' : language === 'fr' ? 'Modèles' : 'Templates',
    start: isRtl ? 'إنشاء ✨' : language === 'fr' ? 'Créer ✨' : 'Build ✨',
    hashHunt: isRtl ? 'وظائف هاش' : language === 'fr' ? 'Hash Hunt' : 'Hash Hunt',
    pricing: isRtl ? 'الأسعار' : language === 'fr' ? 'Tarifs' : 'Pricing',
  };

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex justify-around items-center pt-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] z-[100] px-2 transition-all duration-300 touch-manipulation" 
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ touchAction: 'manipulation' }}
    >
      {/* 1. Home Link */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 relative min-w-[48px] min-h-[48px] active:scale-95 touch-manipulation ${
          isActive('/') 
            ? 'text-brand-600 font-bold bg-brand-50/80 shadow-3xs' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className={`p-1 rounded-xl transition-all duration-200 ${isActive('/') ? '-translate-y-0.5 text-brand-600 bg-brand-100/60' : ''}`}>
          <Home size={19} className="transition-transform duration-200" strokeWidth={isActive('/') ? 2.5 : 2} />
        </div>
        <span className="text-[10px] tracking-tight leading-none font-medium">{labels.home}</span>
        {isActive('/') && (
          <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
        )}
      </Link>

      {/* 2. Templates Link */}
      <Link
        to="/templates"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 relative min-w-[48px] min-h-[48px] active:scale-95 touch-manipulation ${
          isActive('/templates') 
            ? 'text-brand-600 font-bold bg-brand-50/80 shadow-3xs' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className={`p-1 rounded-xl transition-all duration-200 ${isActive('/templates') ? '-translate-y-0.5 text-brand-600 bg-brand-100/60' : ''}`}>
          <LayoutTemplate size={19} className="transition-transform duration-200" strokeWidth={isActive('/templates') ? 2.5 : 2} />
        </div>
        <span className="text-[10px] tracking-tight leading-none font-medium">{labels.templates}</span>
        {isActive('/templates') && (
          <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
        )}
      </Link>

      {/* 3. Central Prominent "Create" Button */}
      <div className="flex-1 flex justify-center -mt-6 relative z-10">
        <button
          onClick={() => navigate('/editor')}
          className="flex flex-col items-center justify-center cursor-pointer select-none group min-w-[48px] min-h-[48px] touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="bg-gradient-to-br from-brand-600 to-[#01255c] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-brand-600/35 group-hover:scale-105 group-active:scale-95 transition-all duration-200 ring-4 ring-white">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-bold text-brand-600 mt-1 tracking-tight">
            {labels.start}
          </span>
        </button>
      </div>

      {/* 4. Hash Hunt Link */}
      <Link
        to="/hash-hunt"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 relative min-w-[48px] min-h-[48px] active:scale-95 touch-manipulation ${
          isActive('/hash-hunt') 
            ? 'text-brand-600 font-bold bg-brand-50/80 shadow-3xs' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className={`p-1 rounded-xl transition-all duration-200 ${isActive('/hash-hunt') ? '-translate-y-0.5 text-brand-600 bg-brand-100/60' : ''}`}>
          <Briefcase size={19} className="transition-transform duration-200" strokeWidth={isActive('/hash-hunt') ? 2.5 : 2} />
        </div>
        <span className="text-[10px] tracking-tight leading-none text-center font-medium">{labels.hashHunt}</span>
        {isActive('/hash-hunt') && (
          <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
        )}
      </Link>

      {/* 5. Pricing Link */}
      <Link
        to="/pricing"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 relative min-w-[48px] min-h-[48px] active:scale-95 touch-manipulation ${
          isActive('/pricing') 
            ? 'text-brand-600 font-bold bg-brand-50/80 shadow-3xs' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className={`p-1 rounded-xl transition-all duration-200 ${isActive('/pricing') ? '-translate-y-0.5 text-brand-600 bg-brand-100/60' : ''}`}>
          <Tag size={19} className="transition-transform duration-200" strokeWidth={isActive('/pricing') ? 2.5 : 2} />
        </div>
        <span className="text-[10px] tracking-tight leading-none font-medium">{labels.pricing}</span>
        {isActive('/pricing') && (
          <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
        )}
      </Link>
    </nav>
  );
};
