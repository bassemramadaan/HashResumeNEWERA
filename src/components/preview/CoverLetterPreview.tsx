import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Copy, Check, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function CoverLetterPreview() {
  const { data } = useResumeStore();
  const coverLetter = data.coverLetter || { generatedContent: "" };
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!coverLetter.generatedContent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No Cover Letter Yet
        </h3>
        <p className="max-w-xs">
          Fill out the details in the form and click"Generate with AI"to create
          your cover letter.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-50 p-8 md:p-12 shadow-sm overflow-y-auto font-serif text-neutral-800 leading-relaxed whitespace-pre-wrap">
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-700 bg-neutral-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <ReactMarkdown>{coverLetter.generatedContent}</ReactMarkdown>
      </div>
    </div>
  );
}
