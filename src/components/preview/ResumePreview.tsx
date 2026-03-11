import { forwardRef } from 'react';
import { useResumeStore, ResumeData } from '../../store/useResumeStore';
import { Mail, Phone, MapPin, Linkedin, Calendar } from 'lucide-react';
import { cn } from '../../utils/utils';

interface ResumePreviewProps {
  data?: ResumeData;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>((props, ref) => {
  const storeData = useResumeStore((state) => state.data);
  const data = props.data || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const themeColor = settings.themeColor || '#2563EB';

  const FreshGradBadge = () => (
    settings.isFreshGrad ? (
      <div className="absolute top-4 right-4 z-50 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-sm print:hidden flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Fresh Graduate Mode
      </div>
    ) : null
  );

  const renderModern = () => (
    <div className="font-sans text-slate-800 leading-relaxed p-6 md:p-12 relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      {/* Header */}
      <header className="mb-10 border-b-2 pb-8" style={{ borderColor: themeColor }}>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-1" style={{ color: themeColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 tracking-tight">{personalInfo.jobTitle}</h2>
        )}
        <div className="flex flex-wrap gap-y-3 gap-x-6 text-[15px] text-slate-600 font-semibold">
          {personalInfo.email && <div className="flex items-center gap-2"><Mail size={16} className="text-slate-400" />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={16} className="text-slate-400" />{personalInfo.phone}</div>}
          {personalInfo.address && <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" />{personalInfo.address}</div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={16} className="text-slate-400" />{personalInfo.linkedin}</div>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: themeColor }}>
            <span className="w-6 h-0.5 bg-current rounded-full"></span>
            Professional Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
        </section>
      )}

      {/* Dynamic Content based on Fresh Grad Mode */}
      {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
        if (section === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-6 h-0.5 bg-current rounded-full"></span>
                Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative ps-4 border-s-2 border-slate-200">
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full -start-[6px] top-1.5" style={{ borderColor: themeColor }}></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-[15px]">{exp.position}</h4>
                      <span className="text-sm font-medium text-slate-500">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-600 mb-2">{exp.company}</div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-6 h-0.5 bg-current rounded-full"></span>
                Education
              </h3>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="relative ps-4 border-s-2 border-slate-200">
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full -start-[6px] top-1.5" style={{ borderColor: themeColor }}></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-[15px]">{edu.degree}</h4>
                      <span className="text-sm font-medium text-slate-500">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-600 mb-1">{edu.institution}</div>
                    {edu.description && <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Two Column Layout for the rest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-6 h-0.5 bg-current rounded-full"></span>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-sm font-medium text-slate-700">
                    {skill}
                    {index < skills.length - 1 && <span className="mx-2 text-slate-300">•</span>}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-6 h-0.5 bg-current rounded-full"></span>
                Projects
              </h3>
              <div className="space-y-5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-[15px]">{proj.name}</h4>
                      {proj.link && <a href={proj.link} className="text-xs font-medium text-indigo-600 hover:underline">Link</a>}
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-6 h-0.5 bg-current rounded-full"></span>
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="mb-3 last:mb-0">
                    <h4 className="font-bold text-slate-900 text-sm">{cert.name}</h4>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span>{cert.issuer}</span>
                      {cert.issuer && cert.date && <span>•</span>}
                      <span>{cert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="font-serif text-slate-900 leading-tight p-6 md:p-12 max-w-[850px] mx-auto relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      {/* Header */}
      <header className="mb-8 text-center border-b-2 border-slate-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-3 text-slate-900">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <h2 className="text-lg md:text-xl italic text-slate-700 mb-4">{personalInfo.jobTitle}</h2>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.address && (personalInfo.phone || personalInfo.email) && <span className="text-slate-400 hidden md:inline">•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="text-slate-400 hidden md:inline">•</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span className="text-slate-400 hidden md:inline">•</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1 text-slate-800">Professional Summary</h3>
          <p className="text-[15px] text-justify whitespace-pre-wrap leading-relaxed text-slate-700">{personalInfo.summary}</p>
        </section>
      )}

      {/* Dynamic Content based on Fresh Grad Mode */}
      {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
        if (section === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="mb-8">
              <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 text-slate-800">Experience</h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                      <h4 className="font-bold text-[17px] text-slate-900">{exp.position}</h4>
                      <span className="text-[15px] italic text-slate-600">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                    </div>
                    <div className="text-[15px] italic mb-2 text-slate-700 font-medium">{exp.company}</div>
                    <p className="text-[15px] whitespace-pre-wrap ps-4 border-s-2 border-slate-200 leading-relaxed text-slate-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-8">
              <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 text-slate-800">Education</h3>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                      <h4 className="font-bold text-[17px] text-slate-900">{edu.institution}</h4>
                      <span className="text-[15px] italic text-slate-600">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
                    </div>
                    <div className="text-[15px] italic mb-2 text-slate-700 font-medium">{edu.degree}</div>
                    {edu.description && <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-slate-700 ps-4 border-s-2 border-slate-200">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1 text-slate-800">Skills</h3>
          <p className="text-[15px] leading-relaxed text-slate-700">
            {skills.map((skill, i) => (
              <span key={i}>
                <span className="font-medium">{skill}</span>
                {i < skills.length - 1 && <span className="mx-2 text-slate-300">•</span>}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 text-slate-800">Projects</h3>
          <div className="space-y-5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                  <h4 className="font-bold text-[17px] text-slate-900">{proj.name}</h4>
                  {proj.link && <span className="text-sm italic text-slate-500">{proj.link}</span>}
                </div>
                <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-slate-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 text-slate-800">Certifications</h3>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col md:flex-row md:justify-between md:items-baseline text-[15px]">
                <span className="font-bold text-slate-900">{cert.name} <span className="font-normal italic text-slate-600">({cert.issuer})</span></span>
                <span className="italic text-slate-600">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderCreative = () => (
    <div className="font-sans flex flex-col md:flex-row min-h-[297mm] relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      {/* Left Sidebar */}
      <div className="w-full md:w-[35%] p-6 md:p-8 text-white flex flex-col" style={{ backgroundColor: themeColor }}>
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 leading-none">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <h2 className="text-lg md:text-xl font-medium opacity-90">{personalInfo.jobTitle}</h2>
          )}
        </div>

        <div className="space-y-8 flex-1">
          <div className="space-y-4 text-[15px] opacity-90">
            {personalInfo.email && <div className="flex items-center gap-3"><Mail size={18} /> <span className="break-all">{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-3"><Phone size={18} /> <span>{personalInfo.phone}</span></div>}
            {personalInfo.address && <div className="flex items-center gap-3"><MapPin size={18} /> <span>{personalInfo.address}</span></div>}
            {personalInfo.linkedin && <div className="flex items-center gap-3"><Linkedin size={18} /> <span className="break-all">{personalInfo.linkedin}</span></div>}
          </div>

          {skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-white/20 pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-sm font-medium opacity-90">
                    {skill}
                    {index < skills.length - 1 && <span className="mx-2 opacity-50">•</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-white/20 pb-2">Certifications</h3>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-[15px] mb-0.5">{cert.name}</h4>
                    <div className="text-sm opacity-80">{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-[65%] p-6 md:p-10 bg-white text-slate-800">
        {personalInfo.summary && (
          <section className="mb-10">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-4 text-slate-900 flex items-center gap-3">
              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Profile
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{personalInfo.summary}</p>
          </section>
        )}

        {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
          if (section === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="mb-10">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-6 text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  Experience
                </h3>
                <div className="space-y-8">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                        <h4 className="font-bold text-slate-900 text-lg">{exp.position}</h4>
                        <span className="text-sm font-bold opacity-90">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                      </div>
                      <div className="text-[15px] font-bold text-slate-500 mb-3 uppercase tracking-wide">{exp.company}</div>
                      <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'education' && education.length > 0) {
            return (
              <section key="education" className="mb-10">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-6 text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  Education
                </h3>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                        <h4 className="font-bold text-slate-900 text-lg">{edu.degree}</h4>
                        <span className="text-sm font-bold text-slate-500">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
                      </div>
                      <div className="text-[15px] font-bold text-slate-500 mb-2 uppercase tracking-wide">{edu.institution}</div>
                      {edu.description && <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}

        {projects.length > 0 && (
          <section className="mb-10">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-6 text-slate-900 flex items-center gap-3">
              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Projects
            </h3>
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 text-lg">{proj.name}</h4>
                    {proj.link && <a href={proj.link} className="text-sm font-bold hover:underline" style={{ color: themeColor }}>View Project</a>}
                  </div>
                  <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="font-sans text-slate-800 leading-relaxed p-6 md:p-14 max-w-[850px] mx-auto relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-slate-900 mb-3 uppercase">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && <h2 className="text-lg md:text-xl font-medium text-slate-500 mb-5 tracking-widest uppercase">{personalInfo.jobTitle}</h2>}
        <div className="flex flex-wrap justify-center gap-6 text-[15px] text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-[15px] text-slate-600 leading-loose text-center max-w-3xl mx-auto">{personalInfo.summary}</p>
        </section>
      )}

      {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
        if (section === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="mb-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 mb-8 text-center border-b border-slate-100 pb-4">Experience</h3>
              <div className="space-y-10">
                {experience.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-[15px] text-slate-400 font-medium md:text-right pt-1">
                      {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                    </div>
                    <div className="md:col-span-3">
                      <h4 className="font-semibold text-slate-900 text-lg">{exp.position}</h4>
                      <div className="text-[15px] text-slate-500 mb-3 font-medium">{exp.company}</div>
                      <p className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 mb-8 text-center border-b border-slate-100 pb-4">Education</h3>
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-[15px] text-slate-400 font-medium md:text-right pt-1">
                      {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                    </div>
                    <div className="md:col-span-3">
                      <h4 className="font-semibold text-slate-900 text-lg">{edu.degree}</h4>
                      <div className="text-[15px] text-slate-500 font-medium">{edu.institution}</div>
                      {edu.description && <p className="text-[15px] text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        return null;
      })}

      {skills.length > 0 && (
        <section className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 mb-8 text-center border-b border-slate-100 pb-4">Skills</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="text-[15px] text-slate-600 font-medium">
                {skill}
                {index < skills.length - 1 && <span className="mx-2 text-slate-300">/</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 mb-8 text-center border-b border-slate-100 pb-4">Projects</h3>
          <div className="space-y-8">
            {projects.map((proj) => (
              <div key={proj.id} className="text-center">
                <h4 className="font-semibold text-slate-900 text-lg mb-1">{proj.name}</h4>
                {proj.link && <a href={proj.link} className="text-[15px] text-slate-400 hover:text-slate-600 mb-3 block">{proj.link}</a>}
                <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderTech = () => (
    <div className="font-mono text-slate-800 leading-relaxed p-6 md:p-12 bg-slate-50 min-h-full relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      <header className="mb-10 border-b-2 border-slate-300 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight" style={{ color: themeColor }}>
          &gt; {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && <h2 className="text-lg md:text-xl text-slate-600 mb-5">/* {personalInfo.jobTitle} */</h2>}
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-slate-600">
          {personalInfo.email && <div><span className="font-semibold" style={{ color: themeColor }}>email:</span> '{personalInfo.email}'</div>}
          {personalInfo.phone && <div><span className="font-semibold" style={{ color: themeColor }}>phone:</span> '{personalInfo.phone}'</div>}
          {personalInfo.linkedin && <div><span className="font-semibold" style={{ color: themeColor }}>linkedin:</span> '{personalInfo.linkedin}'</div>}
          {personalInfo.address && <div><span className="font-semibold" style={{ color: themeColor }}>location:</span> '{personalInfo.address}'</div>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4" style={{ color: themeColor }}># summary</h3>
          <p className="text-[15px] text-slate-700 whitespace-pre-wrap ps-4 border-s-2 border-slate-300 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4" style={{ color: themeColor }}># skills</h3>
          <div className="flex flex-wrap gap-3 ps-4">
            {skills.map((skill, index) => (
              <span key={index} className="text-[15px] text-slate-800 font-medium">
                {skill}
                {index < skills.length - 1 && <span className="mx-2 text-slate-400">;</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
        if (section === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="mb-10">
              <h3 className="text-lg font-bold mb-5" style={{ color: themeColor }}># experience</h3>
              <div className="space-y-8 ps-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                      <h4 className="font-bold text-slate-900 text-[17px]">{exp.position} <span className="text-slate-500 font-normal">@ {exp.company}</span></h4>
                      <span className="text-[15px] text-slate-500 font-medium">[{exp.startDate} - {exp.endDate || 'present'}]</span>
                    </div>
                    <p className="text-[15px] text-slate-700 whitespace-pre-wrap mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-10">
              <h3 className="text-lg font-bold mb-5" style={{ color: themeColor }}># education</h3>
              <div className="space-y-6 ps-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                      <h4 className="font-bold text-slate-900 text-[17px]">{edu.degree}</h4>
                      <span className="text-[15px] text-slate-500 font-medium">[{edu.startDate} - {edu.endDate || 'present'}]</span>
                    </div>
                    <div className="text-[15px] text-slate-600 font-medium">{edu.institution}</div>
                    {edu.description && <p className="text-[15px] text-slate-700 whitespace-pre-wrap mt-2 leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        return null;
      })}

      {projects.length > 0 && (
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-5" style={{ color: themeColor }}># projects</h3>
          <div className="space-y-8 ps-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                  <h4 className="font-bold text-slate-900 text-[17px]">{proj.name}</h4>
                  {proj.link && <a href={proj.link} className="text-[15px] hover:underline font-medium" style={{ color: themeColor }}>[link]</a>}
                </div>
                <p className="text-[15px] text-slate-700 whitespace-pre-wrap mt-2 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderExecutive = () => (
    <div className="font-serif text-slate-900 leading-relaxed p-6 md:p-12 relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      <header className="mb-10 flex flex-col items-center border-b-[3px] pb-8" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-3 text-center">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && <h2 className="text-lg md:text-xl font-medium text-slate-600 mb-5 text-center uppercase tracking-wider">{personalInfo.jobTitle}</h2>}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] font-sans text-slate-600">
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin size={16} />{personalInfo.address}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={16} />{personalInfo.phone}</span>}
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={16} />{personalInfo.email}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={16} />{personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-10">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Executive Summary</h3>
          <p className="text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {(settings.isFreshGrad ? ['education', 'experience'] : ['experience', 'education']).map((section) => {
            if (section === 'experience' && experience.length > 0) {
              return (
                <section key="experience" className="mb-10">
                  <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Professional Experience</h3>
                  <div className="space-y-8">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <span className="text-[15px] font-sans font-medium text-slate-600">{exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}</span>
                        </div>
                        <div className="text-base font-medium text-slate-700 mb-3 uppercase tracking-wide">{exp.company}</div>
                        <p className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (section === 'education' && education.length > 0) {
              return (
                <section key="education" className="mb-10">
                  <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Education</h3>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                          <h4 className="font-bold text-lg">{edu.degree}</h4>
                          <span className="text-[15px] font-sans font-medium text-slate-600">{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
                        </div>
                        <div className="text-base text-slate-700 font-medium">{edu.institution}</div>
                        {edu.description && <p className="text-[15px] text-slate-800 whitespace-pre-wrap mt-2 leading-relaxed">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>

        <div className="md:col-span-1">
          {skills.length > 0 && (
            <section className="mb-10">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Core Competencies</h3>
              <ul className="list-disc list-inside space-y-2.5 text-[15px] text-slate-800 font-sans">
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {certifications.length > 0 && (
            <section className="mb-10">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Certifications</h3>
              <div className="space-y-5">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-[15px] mb-0.5">{cert.name}</h4>
                    <div className="text-sm font-sans text-slate-600">{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-10">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-slate-300 pb-2" style={{ color: themeColor }}>Key Projects</h3>
              <div className="space-y-6">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <h4 className="font-bold text-[15px] mb-0.5">{proj.name}</h4>
                    {proj.link && <a href={proj.link} className="text-sm font-sans text-indigo-600 hover:underline mb-2 block">View Project</a>}
                    <p className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderMedical = () => (
    <div className="font-sans text-slate-900 leading-relaxed p-6 md:p-12 max-w-[850px] mx-auto bg-white relative text-start" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <FreshGradBadge />
      <header className="mb-8 border-b-4 border-emerald-600 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && <h2 className="text-xl font-medium text-slate-600 mb-4">{personalInfo.jobTitle}</h2>}
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {personalInfo.email && <div className="flex items-center gap-1"><Mail size={14} />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={14} />{personalInfo.phone}</div>}
          {personalInfo.address && <div className="flex items-center gap-1"><MapPin size={14} />{personalInfo.address}</div>}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {personalInfo.summary && (
          <section>
            <h3 className="text-lg font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-100 pb-1">Professional Summary</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-100 pb-1">Licenses & Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="font-bold text-emerald-900">{cert.name}</div>
                  <div className="text-sm text-emerald-700">{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-100 pb-1">Clinical Experience</h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900">{exp.position}</h4>
                    <span className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-emerald-600 font-medium mb-2">{exp.company}</div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-100 pb-1">Education</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-600">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="font-serif text-slate-900 leading-relaxed p-6 md:p-12 max-w-[850px] mx-auto bg-[#fdfbf7]">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 uppercase tracking-widest">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="w-24 h-1 bg-slate-900 mx-auto mb-4"></div>
        {personalInfo.jobTitle && <h2 className="text-xl italic text-slate-700 mb-4">{personalInfo.jobTitle}</h2>}
        <div className="flex justify-center gap-6 text-sm text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </header>

      <div className="space-y-8">
        {personalInfo.summary && (
          <section>
            <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-4 text-slate-500">Professional Profile</h3>
            <p className="text-justify text-slate-800 leading-loose">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-6 text-slate-500">Legal Experience</h3>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1 font-sans">
                    <h4 className="font-bold text-lg text-slate-900">{exp.company}</h4>
                    <span className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="italic text-slate-700 mb-2">{exp.position}</div>
                  <p className="text-slate-800 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-6 text-slate-500">Education</h3>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1 font-sans">
                    <h4 className="font-bold text-lg text-slate-900">{edu.institution}</h4>
                    <span className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="italic text-slate-700">{edu.degree}</div>
                  {edu.description && <p className="text-slate-800 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div className="font-serif text-slate-900 leading-relaxed p-6 md:p-12 max-w-[850px] mx-auto bg-white">
      <header className="mb-8 border-b border-slate-300 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-slate-600 mb-4">{personalInfo.jobTitle}</div>
        <div className="text-sm text-slate-600 space-y-1">
          {personalInfo.address && <div>{personalInfo.address}</div>}
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
        </div>
      </header>

      <div className="space-y-8">
        {education.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 uppercase mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-sm text-slate-600">{edu.endDate}</div>
                  <div>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="italic text-slate-700">{edu.institution}</div>
                    {edu.description && <p className="text-sm text-slate-800 mt-1">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 uppercase mb-4">Academic & Professional Experience</h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-sm text-slate-600">{exp.startDate} - {exp.endDate}</div>
                  <div>
                    <div className="font-bold text-slate-900">{exp.position}</div>
                    <div className="italic text-slate-700 mb-2">{exp.company}</div>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 uppercase mb-4">Research & Projects</h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-slate-900">{proj.name}</div>
                  <p className="text-sm text-slate-800">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 uppercase mb-4">Skills</h3>
            <p className="text-sm text-slate-800">{skills.join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div 
      ref={ref} 
      className="w-full h-full bg-white box-border"
      style={{ minHeight: '297mm' }}
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {settings.template === 'modern' && renderModern()}
      {settings.template === 'classic' && renderClassic()}
      {settings.template === 'creative' && renderCreative()}
      {settings.template === 'minimal' && renderMinimal()}
      {settings.template === 'tech' && renderTech()}
      {settings.template === 'executive' && renderExecutive()}
      {settings.template === 'medical' && renderMedical()}
      {settings.template === 'legal' && renderLegal()}
      {settings.template === 'academic' && renderAcademic()}
      
      {/* Watermark */}
      <div className="mt-8 pb-4 text-center text-xs text-slate-300 font-medium opacity-50">
        Created with Hash Resume
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
