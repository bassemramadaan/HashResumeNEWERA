import React from "react";
import type { ResumeData } from "../../store/useResumeStore";
import { Briefcase, GraduationCap, Wrench, FileText, Award, FolderGit2, MapPin, Phone, Mail, Linkedin, Globe } from "lucide-react";
import { SafeDescription } from "./SafeDescription";
import { detectIsArabic } from "../../utils/language";

const TemplateModern: React.FC<{ data: ResumeData; isMini?: boolean }> = ({ data, isMini }) => {
  const { personalInfo, experience, education, skills, certifications, projects } = data;
  const isRtl = detectIsArabic(data);

  const TitleTag = isMini ? "div" : "h1";
  const SectionTag = isMini ? "div" : "h2";
  const SubSectionTag = isMini ? "div" : "h3";
  
  const ContactItem = ({ icon: Icon, text }: { icon: React.ComponentType<{ size?: number; className?: string }>, text: string }) => {
    if (!text) return null;
    return (
      <span className="inline-flex items-center gap-1">
        <Icon size={10} className="text-[#9CA3AF]" />
        <span>{text}</span>
      </span>
    );
  };

  return (
    <div className={`w-[794px] mx-auto bg-white p-[40px] font-sans text-[#111827] ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6 avoid-break">
        <TitleTag className="text-[32px] font-bold text-[#111827] mb-2">{personalInfo.fullName}</TitleTag>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B7280]">
          <ContactItem icon={MapPin} text={personalInfo.address} />
          <ContactItem icon={Phone} text={personalInfo.phone} />
          <ContactItem icon={Mail} text={personalInfo.email} />
          <ContactItem icon={Linkedin} text={personalInfo.linkedin} />
          <ContactItem icon={Globe} text={personalInfo.portfolio || personalInfo.website} />
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
            <FileText size={14} className="text-[#6B7280]" />
            {isRtl ? "الملخص المهني" : "Summary"}
          </SectionTag>
          <div className="text-[11px] leading-[1.5] text-[#374151] markdown-body">
            <SafeDescription text={personalInfo.summary} />
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
            <Briefcase size={14} className="text-[#6B7280]" />
            {isRtl ? "الخبرة المهنية" : "Experience"}
          </SectionTag>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4 avoid-break">
              <SubSectionTag className="text-[13px] font-semibold text-[#111827]">{exp.position}</SubSectionTag>
              <div className="flex justify-between text-[12px] text-[#374151]">
                  <span>{exp.company}</span>
                  <span className="text-[#6B7280]">{exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}</span>
              </div>
              <div className="text-[11px] text-[#374151] leading-[1.5] mt-1 markdown-body">
                <SafeDescription text={exp.description} />
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
            <GraduationCap size={14} className="text-[#6B7280]" />
            {isRtl ? "التعليم" : "Education"}
          </SectionTag>
          {education.map((edu, i) => (
            <div key={i} className="mb-2 avoid-break">
              <div className="flex justify-between items-baseline">
                  <SubSectionTag className="text-[12px] font-semibold text-[#111827]">{edu.institution}</SubSectionTag>
                  <span className="text-[11px] text-[#6B7280]">{edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}</span>
              </div>
              <p className="text-[11px] text-[#374151]">{edu.degree}</p>
              {edu.description && (
                <div className="text-[11px] text-[#374151] leading-[1.5] mt-1 markdown-body">
                  <SafeDescription text={edu.description} />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6 avoid-break">
          <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
            <Wrench size={14} className="text-[#6B7280]" />
            {isRtl ? "المهارات" : "Skills"}
          </SectionTag>
          <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as unknown as { name: string }).name).join(", ")}</p>
        </section>
      )}
      
      {certifications.length > 0 && (
          <section className="mb-6 avoid-break">
            <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
              <Award size={14} className="text-[#6B7280]" />
              {isRtl ? "الشهادات" : "Certifications"}
            </SectionTag>
            {certifications.map((cert, i) => (
              <div key={i} className="text-[11px] text-[#374151] mb-1">
                <span className="font-semibold">{cert.name}</span>, {cert.issuer} {cert.date ? `(${cert.date})` : ""}
              </div>
            ))}
          </section>
      )}

      {projects.length > 0 && (
          <section className="avoid-break">
            <SectionTag className="flex items-center gap-2 text-[13px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-1 mb-2">
              <FolderGit2 size={14} className="text-[#6B7280]" />
              {isRtl ? "المشاريع" : "Projects"}
            </SectionTag>
            {projects.map((proj, i) => (
              <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <SubSectionTag className="text-[12px] font-semibold text-[#111827]">{proj.name}</SubSectionTag>
                    {proj.link && <span className="text-[11px] text-[#6B7280]">{proj.link}</span>}
                  </div>
                  <div className="text-[11px] text-[#374151] leading-[1.5] markdown-body">
                    <SafeDescription text={proj.description} />
                  </div>
              </div>
            ))}
          </section>
      )}
    </div>
  );
};

export default TemplateModern;
