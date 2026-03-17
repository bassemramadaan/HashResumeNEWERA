import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Copy, Check, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CoverLetterPreview() {
  const { data } = useResumeStore();
  const coverLetter = data.coverLetter || { generatedContent: '' };
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!coverLetter.generatedContent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Cover Letter Yet</h3>
        <p className="max-w-xs">Fill out the details in the form and click "Generate with AI" to create your cover letter.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-8 md:p-12 shadow-sm overflow-y-auto font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ReactMarkdown>{coverLetter.generatedContent}</ReactMarkdown>
      </div>
    </div>
  );
}
