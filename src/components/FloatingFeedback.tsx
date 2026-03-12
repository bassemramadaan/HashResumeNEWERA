import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import FeedbackModal from './FeedbackModal';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

export default function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300"
        title={t.feedback || 'Feedback'}
      >
        <MessageSquarePlus size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
          {t.feedback || 'Feedback'}
        </span>
      </motion.button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
