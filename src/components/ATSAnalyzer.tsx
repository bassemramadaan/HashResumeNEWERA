import React, { useState } from "react";
import { aiService } from "../services/aiService";
import { Loader2, Sparkles } from "lucide-react";

interface ATSAnalyzerProps {
  resume: string;
  jobDescription: string;
}

interface ATSResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  seniorityFit: string;
}

export const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({
  resume,
  jobDescription,
}) => {
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    const response = await aiService.matchResumeToJob(resume, jobDescription);
    if (response.error) {
      setError(response.error);
    } else {
      try {
        setResult(JSON.parse(response.text));
      } catch {
        setError("Failed to parse analysis result");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm transition-colors">
      <button
        onClick={analyze}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 :bg-slate-100 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
        Analyze ATS Score
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4 text-slate-900">
          <div className="text-3xl font-black text-indigo-600">
            Score: {result.score}/100
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold mb-1">Seniority Fit:</h4>
            <p className="text-slate-600 text-sm">{result.seniorityFit}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold mb-2">Missing Keywords:</h4>
            <ul className="flex flex-wrap gap-2">
              {result.missingKeywords.map((k, i) => (
                <li
                  key={i}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600"
                >
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
