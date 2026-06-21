import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onAdd: () => void;
}

const EmptyState = ({ icon, title, description, buttonText, onAdd }: EmptyStateProps) => {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 border border-slate-200 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#FF4D2D]/30 transition-all duration-500"
      onClick={onAdd}
    >
      <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(255, 77, 45, 0.03), transparent 70%) opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <motion.div 
        className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#FF4D2D] group-hover:scale-110 group-active:scale-95 transition-all duration-500 shadow-sm mb-5 relative z-10"
      >
        {icon || <div className="text-3xl text-slate-300 group-hover:text-[#FF4D2D] transition-colors font-black">+</div>}
      </motion.div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 relative z-10 tracking-tight">
        {title}
      </h3>
      
      <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed relative z-10 font-medium">
        {description}
      </p>

      <button className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 relative z-10 cursor-pointer">
        <Plus size={18} />
        {buttonText}
      </button>
    </motion.div>
  );
};

export default EmptyState;
