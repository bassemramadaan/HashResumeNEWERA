import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { FileText, Sparkles, Copy, Check, AlertCircle, Import } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function CoverLetterForm() {
  const { data, updateCoverLetter } = useResumeStore();
  const { personalInfo, skills } = data;
  
  // Safely access coverLetter, ensuring all fields are defined
  const coverLetter = {
    fullName: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    skills: '',
    generatedContent: '',
    ...(data.coverLetter || {})
  };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  // Auto-populate from resume data if empty
  useEffect(() => {
    // Only run if coverLetter exists in data (to avoid infinite loop if updateCoverLetter triggers re-render with new object)
    // But here we want to initialize it if it's missing or empty
    
    const shouldUpdate = 
      (!coverLetter.fullName && personalInfo.fullName) || 
      (!coverLetter.jobTitle && personalInfo.jobTitle) || 
      (!coverLetter.skills && skills.length > 0);

    if (shouldUpdate) {
      updateCoverLetter({
        fullName: coverLetter.fullName || personalInfo.fullName || '',
        jobTitle: coverLetter.jobTitle || personalInfo.jobTitle || '',
        skills: coverLetter.skills || skills.join(', ') || '',
      });
    }
  }, [personalInfo.fullName, personalInfo.jobTitle, skills, coverLetter.fullName, coverLetter.jobTitle, coverLetter.skills, updateCoverLetter]);

  const handleImportFromResume = () => {
    updateCoverLetter({
      fullName: personalInfo.fullName || '',
      jobTitle: personalInfo.jobTitle || '',
      skills: skills.join(', ') || '',
    });
    setImported(true);
    setTimeout(() => setImported(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateCoverLetter({ [name]: value });
  };

  const generateCoverLetter = async () => {
    if (!coverLetter.fullName || !coverLetter.companyName || !coverLetter.jobTitle) {
      setError('Please fill in your name, target company, and job title.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback or error handling if API key is not available
        // For now, let's simulate a delay and set dummy content if no key
        // But in this environment, we should have the key.
        // If not, we can't really generate.
        throw new Error('Gemini API key is missing');
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Write a professional cover letter for a ${coverLetter.jobTitle} position at ${coverLetter.companyName}.
        
        Candidate Name: ${coverLetter.fullName}
        Hiring Manager: ${coverLetter.hiringManager || 'Hiring Manager'}
        
        Job Description:
        ${coverLetter.jobDescription || 'Not provided'}
        
        Key Skills:
        ${coverLetter.skills}
        
        The cover letter should be professional, engaging, and highlight why the candidate is a good fit.
        Keep it concise (under 400 words).
        Do not include placeholders like [Your Name] or [Date], use the provided information.
        Format it with proper paragraphs.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      updateCoverLetter({ generatedContent: text });
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="text-indigo-500 dark:text-indigo-400" size={24} />
          Cover Letter
        </h2>
        <button
          onClick={handleImportFromResume}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors"
          title="Import details from your resume"
        >
          {imported ? <Check size={16} /> : <Import size={16} />}
          {imported ? 'Imported!' : 'Import from Resume'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={coverLetter.fullName}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={coverLetter.jobTitle}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Company</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={coverLetter.companyName}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Google"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hiringManager" className="text-sm font-medium text-slate-700 dark:text-slate-300">Hiring Manager (Optional)</label>
            <input
              type="text"
              id="hiringManager"
              name="hiringManager"
              value={coverLetter.hiringManager}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Jane Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="skills" className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Skills to Highlight</label>
          <textarea
            id="skills"
            name="skills"
            rows={3}
            value={coverLetter.skills}
            onChange={handleChange}
            className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="React, TypeScript, Node.js, Team Leadership..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="jobDescription" className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Description (Optional)</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={4}
            value={coverLetter.jobDescription}
            onChange={handleChange}
            className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Paste the job description here to tailor the cover letter..."
          />
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={generateCoverLetter}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate with AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}
