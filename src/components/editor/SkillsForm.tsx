import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Wrench, Plus, X, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
  'HTML/CSS', 'SQL', 'NoSQL', 'Git', 'Docker', 'AWS', 'Agile', 'Communication',
  'Problem Solving', 'Team Leadership', 'Project Management'
];

export default function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const { skills } = data;
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const unaddedSuggestions = SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 8);

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Wrench className="text-indigo-500" size={24} />
        Skills
      </h2>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleAdd} className="mb-6">
          <label htmlFor="skillInput" className="block text-sm font-medium text-slate-700 mb-2">
            Add a skill
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="skillInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="e.g. React, Project Management..."
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </form>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 mb-3">Your Skills</h3>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium group"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-red-500 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {unaddedSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              AI Suggested Skills (Free)
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-sm font-medium transition-colors"
                >
                  <Plus size={14} />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
