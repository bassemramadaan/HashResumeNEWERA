import { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Download, Share2, FileText, Check, Copy, Loader2 } from 'lucide-react';
import { generateWord } from '../../lib/generateWord';

interface FinishStepProps {
  onPrint: () => void;
}

export default function FinishStep({ onPrint }: FinishStepProps) {
  const { data } = useResumeStore();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadWord = async () => {
    try {
      await generateWord(data);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word document. Please try again.');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to share');
      }

      const result = await response.json();
      if (result.id) {
        const url = `${window.location.origin}/share/${result.id}`;
        setShareUrl(url);
      }
    } catch (error) {
      console.error('Error sharing CV:', error);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your CV is Ready!</h2>
        <p className="text-slate-500 dark:text-slate-400">Choose how you want to save or share your resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Download */}
        <button
          onClick={onPrint}
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all group"
        >
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Download className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Download PDF</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Best for applications and printing. Maintains formatting.</p>
        </button>

        {/* Word Download */}
        <button
          onClick={handleDownloadWord}
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all group"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Download Word</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Editable format compatible with Microsoft Word.</p>
        </button>

        {/* Share Link */}
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Share2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Share Link</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">Get a unique link to share your resume online.</p>
          
          {!shareUrl ? (
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSharing ? 'Generating...' : 'Generate Link'}
            </button>
          ) : (
            <div className="w-full animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg mb-2 w-full">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl} 
                  className="bg-transparent text-xs text-slate-600 dark:text-slate-300 flex-1 outline-none font-mono"
                />
                <button 
                  onClick={handleCopyLink}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors text-slate-500"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">Link ready to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
