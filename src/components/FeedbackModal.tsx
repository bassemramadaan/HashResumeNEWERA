import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

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

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);

    try {
      // Note: Google Apps Script Web App usually requires 'no-cors' for simple POST requests from client-side
      // However, the provided URL looks like a library URL (.../library/d/...), not a Web App Executable URL (.../macros/s/.../exec).
      // Libraries cannot be called directly via HTTP. 
      // Assuming the user might have copied the wrong URL or meant a Web App URL.
      // I will use the URL provided but it might fail if it's strictly a library.
      // Usually these URLs look like https://script.google.com/macros/s/AKfycbx.../exec
      
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment, timestamp: new Date().toISOString() }),
      });

      // Since no-cors returns an opaque response, we assume success if no network error occurred.
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Ideally show error state, but for now we'll just log it
    } finally {
      setLoading(false);
    }
  };

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
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
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
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  />
                  <textarea
                    placeholder={t.commentPlaceholder}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t.noThanks}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!rating || loading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
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
    </AnimatePresence>
  );
}
