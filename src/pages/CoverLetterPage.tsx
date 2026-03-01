import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Copy, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Cover Letter Builder</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Job Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hiring Manager (Optional)</label>
              <input
                type="text"
                name="hiringManager"
                value={formData.hiringManager}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills to Highlight</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="React, Node.js, Team Leadership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description Snippet (Optional)</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Paste a few sentences from the job description..."
              />
            </div>
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={!formData.fullName || !formData.jobTitle || !formData.companyName || isGenerating}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Cover Letter</h2>
            {generatedLetter && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full"
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
                className="w-full h-full min-h-[500px] p-6 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-serif text-slate-800 leading-relaxed"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-indigo-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Letter Generated Yet</h3>
              <p className="text-slate-500 max-w-sm">
                Fill out the job details on the left and click "Generate Cover Letter" to create a professional, tailored letter.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
