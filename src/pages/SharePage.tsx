import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResumeData, useResumeStore } from '../store/useResumeStore';
import ResumePreview from '../components/preview/ResumePreview';
import { Loader2, Copy, Check, Edit } from 'lucide-react';

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      if (window.confirm('This will overwrite your current editor data. Continue?')) {
        loadData(data);
        window.location.href = '/editor';
      }
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 flex flex-col items-center">
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
            onClick={handleUseTemplate}
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
