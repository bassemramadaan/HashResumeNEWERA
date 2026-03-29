import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2 } from "lucide-react";
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { cn } from '../utils';

// Using the URL provided by the user
const SHEET_URL = "https://script.google.com/macros/library/d/1ux4DtfoYKsXzQwAX08evzn5JlCwuDuQFmEWKaBRGs5HgVWqF0gDOx0hX/1";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { language } = useLanguageStore();
  const t = translations[language].feedbackModal;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const moodEmojis = ["", "😟", "😟", "😐", "🙂", "😍"];
  const quickTags = [
    { id: 'easy', label: 'Easy to use' },
    { id: 'templates', label: 'Great templates' },
    { id: 'ats', label: 'ATS Audit' },
    { id: 'speed', label: 'Fast' },
    { id: 'bug', label: 'Found a bug' },
    { id: 'feature', label: 'Feature request' },
  ];

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);

    try {
      // Note: Google Apps Script Web App usually requires 'no-cors' for simple POST requests from client-side
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          rating, 
          comment, 
          tags: tags.join(', '),
          timestamp: new Date().toISOString() 
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Ideally show error state, but for now we'll just log it
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.thankYouTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {t.thankYouMessage}
                </p>
                <button 
                  onClick={onClose} 
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2 h-10 flex items-center justify-center">
                    {moodEmojis[hover || rating]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t.subtitle}</p>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`${
                          star <= (hover || rating) 
                            ? "fill-amber-400 text-amber-400" 
                            : "fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-700"
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {/* Quick Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-2">
                    {quickTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.label)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                          tags.includes(tag.label)
                            ? "bg-orange-600 border-orange-600 text-white shadow-md scale-105"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-400"
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                  />
                  <textarea
                    placeholder={t.commentPlaceholder}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t.noThanks}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!rating || loading}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:text-slate-500 text-white py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      t.submit
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}
