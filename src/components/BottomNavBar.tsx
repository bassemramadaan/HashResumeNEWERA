import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, LayoutTemplate, Tag, Plus } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] flex justify-around items-center pt-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] z-50 px-2" dir={isRtl ? 'rtl' : 'ltr'}>
      <Link
        to="/"
        className={`flex flex-col items-center gap-[2px] min-w-[64px] ${isActive('/') ? 'text-[#FF4D2D]' : 'text-gray-400'} transition-colors`}
      >
        <Home size={22} className={isActive('/') ? 'fill-current' : ''} />
        <span className="text-[10px] font-medium">{isRtl ? 'الرئيسية' : 'Home'}</span>
      </Link>

      <Link
        to="/templates"
        className={`flex flex-col items-center gap-[2px] min-w-[64px] ${isActive('/templates') ? 'text-[#FF4D2D]' : 'text-gray-400'} transition-colors`}
      >
        <LayoutTemplate size={22} className={isActive('/templates') ? 'fill-current' : ''} />
        <span className="text-[10px] font-medium">{isRtl ? 'القوالب' : 'Templates'}</span>
      </Link>
      
      <Link
        to="/pricing"
        className={`flex flex-col items-center gap-[2px] min-w-[64px] ${isActive('/pricing') ? 'text-[#FF4D2D]' : 'text-gray-400'} transition-colors`}
      >
        <Tag size={22} className={isActive('/pricing') ? 'fill-current' : ''} />
        <span className="text-[10px] font-medium">{isRtl ? 'الأسعار' : 'Pricing'}</span>
      </Link>

      <Link
        to="/editor"
        className="flex flex-col items-center gap-[2px] min-w-[64px] transition-colors"
      >
        <div className="bg-[#FF4D2D] rounded-full p-1.5 text-white transform -translate-y-1 shadow-md">
          <Plus size={20} strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-medium text-[#FF4D2D] -mt-1">
          {isRtl ? 'ابدأ' : 'Start'}
        </span>
      </Link>
    </nav>
  );
};
