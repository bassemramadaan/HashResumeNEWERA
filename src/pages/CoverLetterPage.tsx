import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Copy, Check } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function CoverLetterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    skills: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCoverLetter = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const letter = `${formData.fullName}
[Your Address]
[Your Email] | [Your Phone]

${date}

${formData.hiringManager ? formData.hiringManager : 'Hiring Manager'}
${formData.companyName}
[Company Address]

Dear ${formData.hiringManager ? formData.hiringManager : 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With a proven track record of delivering results and a deep passion for the industry, I am confident in my ability to make a significant contribution to your team.

${formData.jobDescription ? `Having reviewed the job description, I am particularly drawn to the opportunity to contribute to ${formData.companyName}'s goals. My experience aligns well with the requirements you've outlined.` : ''}

${formData.skills ? `My core competencies include ${formData.skills}, which I have successfully leveraged in my previous roles to drive success.` : ''} I am a quick learner, a collaborative team player, and a dedicated professional who thrives in dynamic environments. 

I am particularly impressed by ${formData.companyName}'s commitment to innovation and excellence, and I am eager to bring my skills and enthusiasm to your organization. I welcome the opportunity to discuss how my background, skills, and certifications will be of value to your team.

Thank you for your time and consideration. I look forward to the possibility of discussing this exciting opportunity with you.

Sincerely,

${formData.fullName}`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Floating Dock Navbar */}
      <div className="sticky top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none mb-8">
        <nav className="pointer-events-auto flex items-center gap-3 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] max-w-full overflow-x-auto scrollbar-hide">
          
          {/* Back Button */}
          <Link to="/" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-transform shrink-0">
            <ArrowLeft size={24} />
          </Link>

          {/* Title */}
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:inline">Cover Letter Builder</span>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1"></div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6 transition-colors">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Job Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Ahmed Hassan"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hiring Manager (Optional)</label>
              <input
                type="text"
                name="hiringManager"
                value={formData.hiringManager}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Skills to Highlight</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="React, Node.js, Team Leadership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Description Snippet (Optional)</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                placeholder="Paste a few sentences from the job description..."
              />
            </div>
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={!formData.fullName || !formData.jobTitle || !formData.companyName || isGenerating}
            className="w-full mt-6 bg-[#E2FF6F] hover:bg-[#D4FF3F] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#E2FF6F]/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <div className="bg-black rounded-full p-1.5 group-hover:rotate-12 transition-transform">
                  <Sparkles size={16} className="text-white" />
                </div>
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cover Letter</h2>
            {generatedLetter && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-full"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            )}
          </div>

          {generatedLetter ? (
            <div className="flex-1 relative">
              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full h-full min-h-[500px] p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-serif text-slate-800 dark:text-slate-200 leading-relaxed transition-colors"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 bg-slate-50 dark:bg-slate-800/50 transition-colors">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-indigo-300 dark:text-indigo-500 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Letter Generated Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Fill out the job details on the left and click "Generate Cover Letter" to create a professional, tailored letter.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
