import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../store/useLanguageStore';

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDownloadModal({ isOpen, onClose }: PostDownloadModalProps) {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <PartyPopper size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {isRtl ? 'تم تحميل سيرتك الذاتية!' : 'Resume Downloaded!'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              {isRtl ? 'سيرتك الذاتية الاحترافية جاهزة الآن.' : 'Your professional resume is ready.'}
            </p>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 mb-8 border border-indigo-100 dark:border-indigo-800/50">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Target className="text-indigo-500" size={24} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'هل تريد أن تبحث الشركات عنك؟' : 'Want companies to reach out to you?'}
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {isRtl 
                  ? 'انضم إلى Hash Hunt بضغطة زر ودع الشركات الشريكة لنا تتواصل معك مباشرة.' 
                  : 'Join Hash Hunt in one click and let our partner companies reach out to you directly.'}
              </p>
              <Link 
                to="/hash-hunt"
                className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-sm"
              >
                {isRtl ? 'انضم إلى Hash Hunt' : 'Join Hash Hunt'}
                <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>

            <button 
              onClick={onClose}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
