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
    hashHunt: isRtl ? 'هاش هانت' : language === 'fr' ? 'Hash Hunt' : 'Hash Hunt',
    pricing: isRtl ? 'الأسعار' : language === 'fr' ? 'Tarifs' : 'Pricing',
  };

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex justify-around items-center pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] z-[100] px-3 transition-all duration-300" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. Home Link */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all relative ${
          isActive('/') ? 'text-[#001639] scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={20} className="transition-transform duration-200" strokeWidth={isActive('/') ? 2.5 : 2} />
        <span className="text-[9.5px] tracking-tight leading-none">{labels.home}</span>
        {isActive('/') && (
          <span className="absolute bottom-[-6px] w-1.5 h-1.5 rounded-full bg-[#001639]" />
        )}
      </Link>

      {/* 2. Templates Link */}
      <Link
        to="/templates"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all relative ${
          isActive('/templates') ? 'text-[#001639] scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <LayoutTemplate size={20} className="transition-transform duration-200" strokeWidth={isActive('/templates') ? 2.5 : 2} />
        <span className="text-[9.5px] tracking-tight leading-none">{labels.templates}</span>
        {isActive('/templates') && (
          <span className="absolute bottom-[-6px] w-1.5 h-1.5 rounded-full bg-[#001639]" />
        )}
      </Link>

      {/* 3. Central Prominent "Create" Button */}
      <div className="flex-1 flex justify-center -mt-5 relative z-10">
        <button
          onClick={() => navigate('/editor')}
          className="flex flex-col items-center justify-center cursor-pointer select-none group"
        >
          <div className="bg-gradient-to-br from-[#001639] to-[#01255c] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md shadow-[#001639]/30 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-bold text-[#001639] mt-1 tracking-tight">
            {labels.start}
          </span>
        </button>
      </div>

      {/* 4. Hash Hunt Link */}
      <Link
        to="/hash-hunt"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all relative ${
          isActive('/hash-hunt') ? 'text-[#001639] scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Briefcase size={20} className="transition-transform duration-200" strokeWidth={isActive('/hash-hunt') ? 2.5 : 2} />
        <span className="text-[9.5px] tracking-tight leading-none text-center">{labels.hashHunt}</span>
        {isActive('/hash-hunt') && (
          <span className="absolute bottom-[-6px] w-1.5 h-1.5 rounded-full bg-[#001639]" />
        )}
      </Link>

      {/* 5. Pricing Link */}
      <Link
        to="/pricing"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all relative ${
          isActive('/pricing') ? 'text-[#001639] scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Tag size={20} className="transition-transform duration-200" strokeWidth={isActive('/pricing') ? 2.5 : 2} />
        <span className="text-[9.5px] tracking-tight leading-none">{labels.pricing}</span>
        {isActive('/pricing') && (
          <span className="absolute bottom-[-6px] w-1.5 h-1.5 rounded-full bg-[#001639]" />
        )}
      </Link>
    </nav>
  );
};
