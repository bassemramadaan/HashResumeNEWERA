import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResumeData, useResumeStore } from '../store/useResumeStore';
import ResumePreview from '../components/preview/ResumePreview';
import { Loader2, Copy, Check, Edit, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const loadData = useResumeStore(state => state.loadData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/share/${id}`);
        if (!response.ok) {
          throw new Error('CV not found');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CV');
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
      window.location.href = '/editor';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">CV Not Found</h1>
        <p className="text-slate-500 mb-8">{error || "The link might be invalid or expired."}</p>
        <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 flex flex-col items-center relative">
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">Overwrite Editor Data?</h3>
                <p className="text-center text-slate-600 dark:text-slate-400">
                  This will overwrite your current editor data with this CV. Are you sure you want to continue?
                </p>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      handleUseTemplate();
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
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
        <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">
          Hash Resume
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Link'}
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

      <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm overflow-hidden">
        <ResumePreview data={data} />
      </div>
    </div>
  );
}
