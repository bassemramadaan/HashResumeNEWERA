import React from 'react';
import { ResumeData } from '../../store/useResumeStore';
import { cn } from '@/lib/utils';
import { SafeDescription } from './SafeDescription';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { detectIsArabic } from "../../utils/language";

export default function TemplateTwoColumn({ data, isMini }: { data: ResumeData; isMini?: boolean }) {
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;
  const isRtl = detectIsArabic(data);
  
  const themeColor = settings.themeColor || '#2563FF';

  const TitleTag = isMini ? "div" : "h1";
  const SectionTag = isMini ? "div" : "h2";
  const SubSectionTag = isMini ? "div" : "h3";
  
  const ContactItem = ({ icon: Icon, text }: { icon: React.ComponentType<{ size?: number; className?: string }>, text: string }) => {
    if (!text) return null;
    return (
      <div className="flex items-start gap-2 mb-2 text-[10px]">
        <Icon size={12} className="mt-0.5 shrink-0" style={{ color: themeColor }} />
        <span className="break-all">{text}</span>
      </div>
    );
  };

  return (
    <div className={cn(
      "w-full bg-white relative flex font-sans",
      isRtl ? "flex-row-reverse text-right" : "flex-row text-left"
    )} dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Sidebar */}
      <div className="w-[30%] bg-slate-50 border-e border-slate-200 px-6 py-8 min-h-[1056px]">
        
        {/* Name (for sidebar) or just contact. Let's put contact in sidebar */}
        <div className="mb-8">
          <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
            {isRtl ? "معلومات الاتصال" : "Contact"}
          </SectionTag>
          <div className="space-y-3 text-slate-600">
            <ContactItem icon={Mail} text={personalInfo.email} />
            <ContactItem icon={Phone} text={personalInfo.phone} />
            <ContactItem icon={MapPin} text={personalInfo.address} />
            <ContactItem icon={Globe} text={personalInfo.website} />
            <ContactItem icon={Linkedin} text={personalInfo.linkedin} />
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
              {isRtl ? "المهارات" : "Skills"}
            </SectionTag>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <React.Fragment key={index}>
                  <span 
                    className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700"
                  >
                    {skill}
                  </span>
                  {" "}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
              {isRtl ? "الشهادات" : "Certifications"}
            </SectionTag>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-[10px]">
                  <div className="font-bold text-slate-800">{cert.name}</div>
                  <div className="text-slate-600">{cert.issuer}</div>
                  <div className="text-slate-400 mt-0.5">{cert.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Main Content */}
      <div className="w-[70%] px-8 py-8">
        
        {/* Header */}
        <header className="mb-8">
          <TitleTag className="text-3xl font-black text-slate-900 tracking-tight mb-1" style={{ color: themeColor }}>
            {personalInfo.fullName}
          </TitleTag>
          <div className="text-lg font-medium text-slate-600">
            {personalInfo.jobTitle}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3" style={{ color: themeColor }}>
              {isRtl ? "الملخص المهني" : "Summary"}
            </SectionTag>
            <div className="text-[11px] text-slate-600 leading-relaxed markdown-body">
              <SafeDescription text={personalInfo.summary} />
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4" style={{ color: themeColor }}>
              {isRtl ? "الخبرة المهنية" : "Experience"}
            </SectionTag>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="avoid-break">
                  <div className="flex justify-between items-baseline mb-1">
                    <SubSectionTag className="text-xs font-bold text-slate-900">{exp.position}</SubSectionTag>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded shrink-0">
                      {exp.startDate} - {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 mb-2">{exp.company}</div>
                  <div className="text-[10px] text-slate-600 leading-relaxed markdown-body">
                    <SafeDescription text={exp.description} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4" style={{ color: themeColor }}>
              {isRtl ? "المشاريع" : "Projects"}
            </SectionTag>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="avoid-break">
                  <div className="flex justify-between items-baseline mb-1">
                    <SubSectionTag className="text-xs font-bold text-slate-900">{proj.name}</SubSectionTag>
                    {proj.link && (
                      <a href={proj.link} className="text-[10px] text-brand-600 hover:underline">
                        {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-600 leading-relaxed markdown-body">
                    <SafeDescription text={proj.description} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-8">
            <SectionTag className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4" style={{ color: themeColor }}>
              {isRtl ? "التعليم" : "Education"}
            </SectionTag>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="avoid-break">
                  <div className="flex justify-between items-baseline mb-1">
                    <SubSectionTag className="text-xs font-bold text-slate-900">{edu.degree}</SubSectionTag>
                    <span className="text-[10px] font-medium text-slate-500 shrink-0">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700">{edu.institution}</div>
                  {edu.description && (
                    <div className="text-[10px] text-slate-600 leading-relaxed mt-1 markdown-body">
                      <SafeDescription text={edu.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
