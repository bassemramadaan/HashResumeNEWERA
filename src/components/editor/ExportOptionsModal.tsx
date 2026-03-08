import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, FileType, X, Download, FileJson, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  onShareLink: () => void;
}

export default function ExportOptionsModal({ 
  isOpen, 
  onClose, 
  onExportPdf, 
  onExportDocx, 
  onExportTxt,
  onShareLink
}: ExportOptionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export & Share</h2>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={onExportPdf}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                    <FileType size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white">PDF Document</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Best for sharing and printing</p>
                  </div>
                </div>
                <Download size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>

              <button
                onClick={onExportDocx}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white">Word Document (DOCX)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Editable in Microsoft Word</p>
                  </div>
                </div>
                <Download size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </button>

              <button
                onClick={onExportTxt}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                    <FileJson size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white">Plain Text (TXT)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">ATS-friendly raw text</p>
                  </div>
                </div>
                <Download size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>

              <button
                onClick={onShareLink}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Share2 size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white">Share Public Link</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Copy a link to share your resume</p>
                  </div>
                </div>
                <Share2 size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
