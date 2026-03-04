import { motion, AnimatePresence } from 'motion/react';
import { PartyPopper, Briefcase, ExternalLink, X } from 'lucide-react';

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDownloadModal({ isOpen, onClose }: PostDownloadModalProps) {
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
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Resume Downloaded!</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Your professional resume is ready. Now, let us help you land your dream job.
            </p>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Join Hash Hunt</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Upload your newly created resume to our exclusive talent pool. We partner with top companies to match you with the perfect role.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  Direct access to hiring managers
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  Personalized job matching
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  100% free for candidates
                </li>
              </ul>
              
              <a 
                href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 dark:shadow-none"
              >
                Submit Resume to Hash Hunt
                <ExternalLink size={18} />
              </a>
            </div>

            <button 
              onClick={onClose}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Maybe later, I'll apply on my own
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
