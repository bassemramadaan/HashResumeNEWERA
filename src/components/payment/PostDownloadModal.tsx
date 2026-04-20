import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, X, Target, ArrowRight, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../../store/useLanguageStore";

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDownloadModal({
  isOpen,
  onClose,
}: PostDownloadModalProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <PartyPopper size={40} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {isRtl ? "تم تحميل سيرتك الذاتية!" : "Resume Downloaded!"}
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-sm mx-auto">
              {isRtl
                ? "سيرتك الذاتية الاحترافية جاهزة الآن."
                : "Your professional resume is ready."}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex flex-col justify-between text-start text-orange-900 group">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <PenTool size={16} className="text-orange-600" />
                    {isRtl ? "خطاب تقديم (Cover Letter)" : "Matching Cover Letter"}
                  </h3>
                  <p className="text-xs text-orange-700/80 mb-4 font-semibold">
                    {isRtl
                      ? "قم بتوليد خطاب احترافي يطابق تصميم سيرتك الذاتية في ثوانٍ."
                      : "Generate a professional cover letter matching your new resume in seconds."}
                  </p>
                </div>
                <Link
                  to="/cover-letter"
                  className="inline-flex items-center gap-2 w-full bg-white text-orange-600 px-4 py-2 rounded-xl font-bold transition-all border border-orange-200 justify-center shadow-sm group-hover:bg-orange-600 group-hover:text-white"
                >
                  {isRtl ? "إنشاء الآن" : "Create Now"}
                  <ArrowRight size={14} className={isRtl ? "rotate-180" : ""} />
                </Link>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between text-start text-indigo-900 group">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <Target size={16} className="text-indigo-600" />
                    {isRtl ? "وظائف Hash Hunt" : "Hash Hunt Jobs"}
                  </h3>
                  <p className="text-xs text-indigo-700/80 mb-4 font-semibold">
                    {isRtl
                      ? "انضم وضع سيرتك الذاتية أمام مديري التوظيف مباشرة."
                      : "Join our talent pool to let partner companies reach out to you."}
                  </p>
                </div>
                <Link
                  to="/hash-hunt"
                  className="inline-flex items-center gap-2 w-full bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold transition-all border border-indigo-200 justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white"
                >
                  {isRtl ? "انضم للمنصة" : "Get Matched"}
                  <ArrowRight size={14} className={isRtl ? "rotate-180" : ""} />
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-sm font-medium text-white0 hover:text-slate-800 transition-colors"
            >
              {isRtl ? "إغلاق" : "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
