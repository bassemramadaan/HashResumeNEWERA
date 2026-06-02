import React, { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { aiService } from "../../services/aiService";

interface AISuggestionProps {
  currentValue: string;
  onApply: (newValue: string) => void;
  context?: string;
  promptOverride?: string;
}

export default function AISuggestion({
  currentValue,
  onApply,
  context,
  promptOverride,
}: AISuggestionProps) {
  const { language } = useLanguageStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async () => {
    if (!currentValue.trim() && !promptOverride) return;

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = promptOverride || `
 You are a professional resume writer. 
 Improve the following sentence for a resume to make it more impactful, professional, and result-oriented.
 If possible, turn it into a numerical achievement.
 Language: ${language === "ar" ? "Arabic" : language === "fr" ? "French" : "English"}.
 
 Current sentence:"${currentValue}"
 Context (if any):"${context || ""}"
 
 Provide ONLY the improved sentence, no other text.
`;

      const response = await aiService.generateContent(prompt);

      const text = response.text?.trim();
      if (text) {
        setSuggestion(text);
      } else {
        setError(response.error || "Could not generate suggestion");
      }
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      setError("Error connecting to AI");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentValue.trim() && !promptOverride) return null;

  return (
    <div className="mt-2 p-4 rounded-xl bg-brand-50/15 border border-brand-100/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-brand-650">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            AI Suggestion
          </span>
        </div>
        {!suggestion && !isGenerating && (
          <button
            onClick={generateSuggestion}
            className="text-[10px] font-bold text-brand-600 hover:underline"
          >
            {language === "ar"
              ? "تحسين باستخدام الذكاء الاصطناعي"
              : "Improve with AI"}
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2">
            <Loader2 size={12} className="animate-spin text-brand-500" />
            <span className="text-xs text-slate-500 italic font-medium">
               {language === "ar" ? "جاري التفكير..." : "Thinking..."}
            </span>
          </div>
          <div className="space-y-2">
            <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="h-3 bg-brand-100 rounded-full w-full" 
            />
            <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
               className="h-3 bg-brand-100 rounded-full w-5/6" 
            />
          </div>
          <div className="text-[9px] text-slate-400 opacity-70 leading-tight flex items-center gap-1">
             <Sparkles size={8} className="text-brand-400" />
             {language === "ar" 
               ? "يتم معالجة النص بشكل مجهول لتوليد تجربة محتوى احترافية." 
               : "Processing anonymized text to generate professional content suggestions."}
          </div>
        </div>
      )}

      {suggestion && (
        <div className="space-y-2">
          <p className="text-sm text-slate-700 italic">"{suggestion}"</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onApply(suggestion);
                setSuggestion(null);
              }}
              className="flex items-center gap-1 px-4 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-950 transition-colors"
            >
              <Check size={12} />
              {language === "ar" ? "تطبيق" : "Apply"}
            </button>
            <button
              onClick={generateSuggestion}
              className="flex items-center gap-1 px-4 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={12} />
              {language === "ar" ? "إعادة المحاولة" : "Retry"}
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
