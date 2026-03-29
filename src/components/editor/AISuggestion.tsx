import React, { useState } from 'react';
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguageStore } from '../../store/useLanguageStore';

interface AISuggestionProps {
  currentValue: string;
  onApply: (newValue: string) => void;
  context?: string;
}

export default function AISuggestion({ currentValue, onApply, context }: AISuggestionProps) {
  const { language } = useLanguageStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async () => {
    if (!currentValue.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are a professional resume writer. 
        Improve the following sentence for a resume to make it more impactful, professional, and result-oriented.
        If possible, turn it into a numerical achievement.
        Language: ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
        
        Current sentence: "${currentValue}"
        Context (if any): "${context || ''}"
        
        Provide ONLY the improved sentence, no other text.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        setSuggestion(text);
      } else {
        setError('Could not generate suggestion');
      }
    } catch (err) {
      console.error('AI Suggestion Error:', err);
      setError('Error connecting to AI');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentValue.trim()) return null;

  return (
    <div className="mt-2 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Suggestion</span>
        </div>
        {!suggestion && !isGenerating && (
          <button 
            onClick={generateSuggestion}
            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {language === 'ar' ? 'تحسين باستخدام الذكاء الاصطناعي' : 'Improve with AI'}
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center gap-2 py-1">
          <Loader2 size={12} className="animate-spin text-indigo-500" />
          <span className="text-xs text-slate-500 italic">Thinking...</span>
        </div>
      )}

      {suggestion && (
        <div className="space-y-2">
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{suggestion}"</p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                onApply(suggestion);
                setSuggestion(null);
              }}
              className="flex items-center gap-1 px-4 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors"
            >
              <Check size={12} />
              {language === 'ar' ? 'تطبيق' : 'Apply'}
            </button>
            <button 
              onClick={generateSuggestion}
              className="flex items-center gap-1 px-4 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={12} />
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}
