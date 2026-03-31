import React, { useState, useEffect } from "react";
import { FileText, Sparkles, Copy, Check, Import } from "lucide-react";
import { useResumeStore } from "../store/useResumeStore";
import Navbar from "../components/Navbar";
import { aiService } from "../services/aiService";

export default function CoverLetterPage() {
  const { data } = useResumeStore();
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    companyName: "",
    hiringManager: "",
    jobDescription: "",
    skills: "",
  });

  useEffect(() => {
    if (data.personalInfo.fullName && !formData.fullName) {
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          fullName: data.personalInfo.fullName || "",
          jobTitle: data.personalInfo.jobTitle || "",
          skills: data.skills.join(", ") || "",
        }));
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.personalInfo.fullName, data.personalInfo.jobTitle, data.skills]);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const importFromResume = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: data.personalInfo.fullName || "",
      jobTitle: data.personalInfo.jobTitle || "",
      skills: data.skills.join(", ") || "",
    }));
  };

  const generateCoverLetter = async () => {
    if (!formData.fullName || !formData.companyName || !formData.jobTitle) {
      return;
    }

    setIsGenerating(true);

    const prompt = `
 Write a professional cover letter for a ${formData.jobTitle} position at ${formData.companyName}.
 
 Candidate Name: ${formData.fullName}
 Hiring Manager: ${formData.hiringManager || "Hiring Manager"}
 
 Job Description:
 ${formData.jobDescription || "Not provided"}
 
 Key Skills:
 ${formData.skills}
 
 The cover letter should be professional, engaging, and highlight why the candidate is a good fit.
 Keep it concise (under 400 words).
 Do not include placeholders like [Your Name] or [Date], use the provided information.
 Format it with proper paragraphs.
`;

    try {
      const result = await aiService.generateContent(prompt);

      if (result.text) {
        setGeneratedLetter(result.text);
      } else {
        setGeneratedLetter(
          "Failed to generate cover letter. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setGeneratedLetter("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-24">
        {/* Input Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Job Details</h2>
            <button
              onClick={importFromResume}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 :bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors"
              title="Import Name, Job Title, and Skills from your resume"
            >
              <Import size={16} />
              Import from Resume
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Tech Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hiring Manager (Optional)
              </label>
              <input
                type="text"
                name="hiringManager"
                value={formData.hiringManager}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Key Skills to Highlight
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. React, Node.js, Team Leadership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Description Snippet (Optional)
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                placeholder="Paste a few sentences from the job description..."
              />
            </div>
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={
              !formData.fullName ||
              !formData.jobTitle ||
              !formData.companyName ||
              isGenerating
            }
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 :from-slate-700 :to-slate-700 disabled:text-slate-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <div className="bg-white/20 rounded-full p-2 group-hover:rotate-12 transition-transform">
                  <Sparkles size={16} className="text-white" />
                </div>
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Cover Letter
            </h2>
            {generatedLetter && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 :text-indigo-400 transition-colors bg-slate-100 hover:bg-indigo-50 :bg-indigo-900/30 px-4 py-2 rounded-full"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} />
                )}
                {copied ? "Copied!" : "Copy Text"}
              </button>
            )}
          </div>

          {generatedLetter ? (
            <div className="flex-1 relative">
              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full h-full min-h-[500px] p-6 border border-slate-200 bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-serif text-slate-800 leading-relaxed transition-colors"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 transition-colors">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-indigo-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No Letter Generated Yet
              </h3>
              <p className="text-slate-500 max-w-sm">
                Fill out the job details on the left and click"Generate Cover
                Letter"to create a professional, tailored letter.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
