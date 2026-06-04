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
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    const isAr = window.navigator.language.startsWith("ar");

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 font-sans select-none relative overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FF4D2D]/10 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 to-pink-500/5 rounded-full blur-[110px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl relative text-center"
        >
          {/* Custom Orange Frame Accent */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-orange-500 via-[#FF4D2D] to-indigo-600 rounded-t-3xl" />

          {/* Premium Logo Icon Box */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center mx-auto mb-6 border border-[#FF4D2D]/20 shadow-lg relative">
            <svg className="w-8 h-8 animate-pulse text-[#FF4D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
              className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-[#FF4D2D] hover:from-orange-600 hover:to-[#E64528] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/10 hover-transform transition-all duration-300 cursor-pointer"
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center relative">
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-amber-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-center text-slate-900">
                  Overwrite Editor Data?
                </h3>
                <p className="text-center text-slate-600">
                  This will overwrite your current editor data with this CV. Are
                  you sure you want to continue?
                </p>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      handleUseTemplate();
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Yes, Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Hash Resume
        </Link>
        <div className="flex gap-4">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Edit size={16} />
            Edit this CV
          </button>
        </div>
      </div>

      <div className="w-full max-w-[210mm] bg-slate-50 shadow-2xl rounded-sm overflow-hidden">
        <ResumePreview data={data} />
      </div>
    </div>
  );
}
