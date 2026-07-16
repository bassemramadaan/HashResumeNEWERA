import React from "react";
import type { ResumeData } from "../../store/useResumeStore";
import { SafeDescription } from "./SafeDescription";
import { detectIsArabic } from "../../utils/language";

const TemplateTimeline: React.FC<{ data: ResumeData; isMini?: boolean }> = ({ data, isMini }) => {
  const { personalInfo, experience, education, skills, certifications, projects } = data;
  const isRtl = detectIsArabic(data);

  const TitleTag = isMini ? "div" : "h1";
  const SectionTag = isMini ? "div" : "h2";
  const SubSectionTag = isMini ? "div" : "h3";

  return (
    <div className={`w-[794px] mx-auto bg-white p-[40px] font-sans text-[#111827] ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      <header className="mb-6 avoid-break">
        <TitleTag className="text-[30px] font-bold text-[#111827]">{personalInfo.fullName}</TitleTag>
        <p className="text-[11px] text-[#6B7280]">
          {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio].filter(Boolean).join(" | ")}
        </p>
        <div className="border-b-2 border-[#111827] mt-4" />
      </header>
      
      {personalInfo.summary && (
        <section className="mb-6">
          <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
            {isRtl ? "الملخص المهني" : "Summary"}
          </SectionTag>
          <div className="text-[11px] leading-[1.5] text-[#374151] markdown-body">
            <SafeDescription text={personalInfo.summary} />
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
            {isRtl ? "الخبرة المهنية" : "Experience"}
          </SectionTag>
          {experience.map((exp, i) => (
            <div key={i} className={`mb-4 relative avoid-break ${isRtl ? "pr-[16px]" : "pl-[16px]"}`}>
              <div className={`absolute top-[4px] w-[8px] h-[8px] rounded-full bg-[#374151] ${isRtl ? "right-[-5px]" : "left-[-5px]"}`} />
              <div className={`border-l-2 border-[#E5E7EB] absolute top-[12px] bottom-[-20px] ${isRtl ? "right-0" : "left-0"}`} />
              
              <SubSectionTag className="text-[12px] font-semibold text-[#111827]">{exp.position}</SubSectionTag>
              <p className="text-[11px] text-[#6B7280]">{exp.company} • {exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}</p>
              <div className="text-[11px] text-[#374151] leading-[1.5] mt-1 markdown-body">
                <SafeDescription text={exp.description} />
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
            {isRtl ? "التعليم" : "Education"}
          </SectionTag>
          {education.map((edu, i) => (
            <div key={i} className="mb-2 avoid-break">
              <div className="flex justify-between items-baseline">
                <SubSectionTag className="text-[11px] font-semibold text-[#111827]">{edu.institution}</SubSectionTag>
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
          <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
            {isRtl ? "المهارات" : "Skills"}
          </SectionTag>
          <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as unknown as { name: string }).name).join(", ")}</p>
        </section>
      )}
      
      {certifications.length > 0 && (
          <section className="mb-6 avoid-break">
            <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
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
            <SectionTag className="text-[12px] font-bold text-[#111827] uppercase tracking-[1px] mb-3">
              {isRtl ? "المشاريع" : "Projects"}
            </SectionTag>
            {projects.map((proj, i) => (
              <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <SubSectionTag className="text-[11px] font-semibold text-[#111827]">{proj.name}</SubSectionTag>
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

export default TemplateTimeline;
