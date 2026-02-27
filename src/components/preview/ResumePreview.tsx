import { forwardRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Mail, Phone, MapPin, Linkedin, Calendar } from 'lucide-react';

const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const themeColor = settings.themeColor || '#4F46E5';
  
  const renderExperience = () => (
    experience.length > 0 && (
      <section className="mb-8">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
          Work Experience
        </h3>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-zinc-800">{exp.position}</h4>
                <span className="text-sm font-medium text-zinc-500">
                  {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate}
                </span>
              </div>
              <div className="text-sm font-medium text-zinc-600 mb-2">{exp.company}</div>
              {exp.description && (
                <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  );

  const renderEducation = () => (
    education.length > 0 && (
      <section className="mb-8">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
          Education
        </h3>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-zinc-800">{edu.degree}</h4>
                <span className="text-sm font-medium text-zinc-500">
                  {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                </span>
              </div>
              <div className="text-sm font-medium text-zinc-600 mb-1">{edu.institution}</div>
              {edu.description && (
                <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  );

  return (
    <div 
      ref={ref} 
      className="w-full h-full bg-white text-zinc-900 font-sans p-8 md:p-12 box-border"
      style={{ minHeight: '297mm' }} // A4 aspect ratio approximation
    >
      {/* Header */}
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2" style={{ color: themeColor }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <h2 className="text-xl font-medium text-zinc-600 mb-4">
          {personalInfo.jobTitle || 'Job Title'}
        </h2>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={14} />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.dob && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{personalInfo.dob}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-3" style={{ color: themeColor }}>
            Professional Summary
          </h3>
          <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience & Education Order based on Fresh Grad Mode */}
      {settings.isFreshGrad ? (
        <>
          {renderEducation()}
          {renderExperience()}
        </>
      ) : (
        <>
          {renderExperience()}
          {renderEducation()}
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
            Projects
          </h3>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-zinc-800">
                    {proj.name}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 text-xs font-normal text-blue-500 hover:underline">
                        Link
                      </a>
                    )}
                  </h4>
                </div>
                {proj.description && (
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
            Certifications
          </h3>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-zinc-800 inline">{cert.name}</h4>
                  <span className="text-sm font-medium text-zinc-600 ml-2">— {cert.issuer}</span>
                </div>
                <span className="text-sm font-medium text-zinc-500">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watermark */}
      <div className="mt-12 text-center text-xs text-zinc-300 font-medium opacity-50">
        Created with Hash Resume
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
