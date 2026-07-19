import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ResumeData, useResumeStore } from "../store/useResumeStore";
import ResumePreview from "../components/preview/ResumePreview";
import { Loader2, Copy, Check, Edit, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const loadData = useResumeStore((state) => state.loadData);

  // Track window size for scaling to prevent content cropping or horizontal overflow on small displays
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 375);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/share/${id}`);
        if (!response.ok) {
          throw new Error("CV not found");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load CV");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseTemplate = () => {
    if (data) {
      loadData(data);
      window.location.href = "/editor";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !data) {
    const isAr = window.navigator.language.startsWith("ar");

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 font-sans select-none relative overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-gradient-to-tr from-[#001639]/10 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 to-pink-500/5 rounded-full blur-[110px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl relative text-center"
        >
          {/* Custom Orange Frame Accent */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-orange-500 via-[#001639] to-blue-600 rounded-t-3xl" />

          {/* Premium Logo Icon Box */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-[#001639]/10 text-[#001639] flex items-center justify-center mx-auto mb-6 border border-[#001639]/20 shadow-lg relative">
            <svg className="w-8 h-8 animate-pulse text-[#001639]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <div className="absolute -top-1.5 -right-1.5 bg-orange-500 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-orange-400 text-white leading-none">
              PRO
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mb-2">
            {isAr ? "رابط ويب غير نشط أو يحتاج ترقية" : "CV Link Inactive / Requires Upgrade"}
          </h1>

          <div className="space-y-4 text-slate-400 text-xs sm:text-sm font-normal leading-relaxed text-center mb-8 max-w-sm mx-auto">
            <p>
              {isAr 
                ? "استضافة السيرة الذاتية عبر روابط ويب تفاعلية ومباشرة هي ميزة احترافية (PRO) في منصة Hash Resume. هذا الرابط غير منشور، معطل، أو يحتاج ترقية الحساب المولد." 
                : "Dynamic online resume hosting and public URL sharing is a premium (PRO) upgrade feature of Hash Resume. This link is inactive or requires a premium subscription."}
            </p>
            <p className="border-t border-slate-900 pt-3 text-[11px] text-slate-500">
              {isAr
                ? "ترقيتك للحساب الاحترافي تضمن بقاء سيرتك وتألقك على الإنترنت مدى الحياة مع نطاق فريد."
                : "Upgrading to a PRO membership guarantees your executive web-host URL remains live forever to recruiters."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/editor"
              className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-[#001639] to-[#000a1b] hover:from-[#000d23] hover:to-[#000612] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/10 hover-transform transition-all duration-300 cursor-pointer"
            >
              🚀 {isAr ? "رقّ حسابك في ملف المحرر" : "Upgrade & Build in Editor"}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all"
            >
              {isAr ? "الرئيسية" : "Go Home"}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const cvLang = data?.settings?.language || "ar";
  const isRtl = cvLang === "ar";

  const SHARE_T: Record<string, Record<string, string>> = {
    ar: {
      copied: "تم النسخ!",
      copyLink: "نسخ الرابط",
      editCV: "تعديل السيرة",
      home: "الرئيسية",
      confirmTitle: "استبدال بيانات المحرر؟",
      confirmText: "سيؤدي هذا إلى استبدال نسختك الحالية في المحرر ببيانات هذه السيرة الذاتية. هل أنت متأكد من الاستمرار؟",
      cancel: "إلغاء",
      confirm: "نعم، استمر",
    },
    en: {
      copied: "Copied!",
      copyLink: "Copy Link",
      editCV: "Edit Resume",
      home: "Home",
      confirmTitle: "Overwrite Editor Data?",
      confirmText: "This will overwrite your current local editor draft with this CV. Are you sure you want to continue?",
      cancel: "Cancel",
      confirm: "Yes, Continue",
    },
    fr: {
      copied: "Copié !",
      copyLink: "Copier le lien",
      editCV: "Modifier le CV",
      home: "Accueil",
      confirmTitle: "Écraser les données ?",
      confirmText: "Cela remplacera votre brouillon actuel dans l'éditeur par les données de ce CV. Voulez-vous continuer ?",
      cancel: "Annuler",
      confirm: "Oui, continuer",
    }
  };

  const t = SHARE_T[cvLang] ?? SHARE_T.en;

  // Calculat scaling based on viewport width vs. standard A4 width (794px equivalent of 210mm)
  const scale = Math.min(1, (windowWidth - 32) / 794);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center relative overflow-x-hidden pb-12" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200"
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-center text-slate-900">
                  {t.confirmTitle}
                </h3>
                <p className="text-center text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  {t.confirmText}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      handleUseTemplate();
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-[#001639] hover:opacity-95 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern High-End Frosted Glass Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 px-4 py-3 sm:py-4 shadow-3xs flex justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
              alt="HashResume" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg" 
            />
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Hash Resume
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black transition-all shadow-3xs cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? t.copied : t.copyLink}</span>
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#001639] hover:bg-[#002257] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-[#001639]/10 cursor-pointer"
            >
              <Edit size={14} />
              <span>{t.editCV}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive Resume Preview Container */}
      <main className="flex-1 w-full flex flex-col items-center justify-start py-8 px-4 relative overflow-visible">
        {/* Decorative ambient visual background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-[#001639]/5 via-amber-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div 
          className="origin-top shrink-0 transform-gpu transition-all" 
          style={{
            width: "210mm",
            transform: `scale(${scale})`,
            marginBottom: `-${(1 - scale) * 297}mm`
          }}
        >
          <div className="bg-white shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-slate-200/50 rounded-sm overflow-hidden select-none">
            <ResumePreview data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
