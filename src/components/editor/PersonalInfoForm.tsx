import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { User, Mail, Phone, MapPin, Linkedin, Calendar, FileText } from 'lucide-react';

export default function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 font-sans">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <User className="text-green-500" size={24} />
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-slate-700">Job Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={personalInfo.jobTitle}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="Senior Software Engineer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="john.doe@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-slate-700">Address / Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={personalInfo.address}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium text-slate-700">LinkedIn URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Linkedin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={personalInfo.linkedin}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="dob" className="text-sm font-medium text-slate-700">Date of Birth (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="date"
              id="dob"
              name="dob"
              value={personalInfo.dob}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label htmlFor="summary" className="text-sm font-medium text-slate-700">Professional Summary</label>
          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={personalInfo.summary}
            onChange={handleChange}
            className="block w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors resize-none"
            placeholder="A brief summary of your professional background and goals..."
          />
          <p className="text-xs text-slate-500 mt-1">Aim for 3-4 sentences highlighting your key achievements and skills.</p>
        </div>
      </div>
    </div>
  );
}
