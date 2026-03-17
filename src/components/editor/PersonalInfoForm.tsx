import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText, Sparkles, AlertCircle } from 'lucide-react';

import SectionTooltip from './SectionTooltip';

const SUMMARY_SUGGESTIONS = [
  "Results-driven professional with a proven track record of delivering high-quality solutions and exceeding performance targets.",
  "Innovative thinker with strong problem-solving skills and a passion for continuous learning and professional development.",
  "Detail-oriented team player with excellent communication skills and the ability to collaborate effectively across departments.",
  "Strategic leader with experience in managing complex projects, optimizing processes, and driving business growth.",
  "Dedicated and adaptable professional seeking to leverage my skills and experience to contribute to a dynamic organization."
];

const PersonalInfoForm = () => {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: string) => {
    let error = '';
    if (name === 'fullName' && !value.trim()) error = 'Full Name is required';
    if (name === 'jobTitle' && !value.trim()) error = 'Job Title is required';
    if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
    }
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-sans transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`h-4 w-4 ${errors.fullName ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ${
                errors.fullName ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title <span className="text-rose-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className={`h-4 w-4 ${errors.jobTitle ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={personalInfo.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ${
                errors.jobTitle ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.jobTitle && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.jobTitle && <p className="text-xs text-rose-500 mt-1">{errors.jobTitle}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address <span className="text-rose-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-4 w-4 ${errors.email ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ${
                errors.email ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
              placeholder="e.g. john.doe@example.com"
            />
            {errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. +1 234 567 8900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300">Address / Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={personalInfo.address}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. New York, NY"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Linkedin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={personalInfo.linkedin}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="github" className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              id="github"
              name="github"
              value={personalInfo.github || ''}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. github.com/johndoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolio" className="text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio / Website</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={personalInfo.portfolio || ''}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. johndoe.dev"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="summary" className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Summary</label>
              <SectionTooltip 
                title="Summary Tips" 
                content="Your summary is the first thing recruiters read. Keep it concise, professional, and focused on your value proposition." 
                example="Results-driven Software Engineer with 5+ years of experience in building scalable web applications. Expert in React and Node.js, with a focus on performance optimization."
              />
            </div>
            <button 
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-2 py-1 rounded-full transition-colors"
            >
              <Sparkles size={12} />
              AI Suggestions (Free)
            </button>
          </div>
          
          {showSuggestions && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Click a suggestion to append it to your summary:</p>
              {SUMMARY_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const currentSummary = personalInfo.summary ? personalInfo.summary + ' ' : '';
                    updatePersonalInfo({ summary: currentSummary + suggestion });
                    setShowSuggestions(false);
                  }}
                  className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={personalInfo.summary}
            onChange={handleChange}
            className="block w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="e.g. Creative Graphic Designer with 5+ years of experience in branding and digital marketing. Proven track record of increasing client engagement by 40%. Skilled in Adobe Creative Suite and UI/UX design principles."
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aim for 3-4 sentences highlighting your key achievements and skills.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
