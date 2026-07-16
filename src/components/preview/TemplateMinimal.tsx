import React from "react";
import type { ResumeData } from "../../store/useResumeStore";
import { SafeDescription } from "./SafeDescription";
import { detectIsArabic } from "../../utils/language";

const TemplateMinimal: React.FC<{ data: ResumeData; isMini?: boolean }> = ({ data, isMini }) => {
  const { personalInfo, experience, education, skills, certifications, projects, settings } = data;
  const isRtl = detectIsArabic(data);

  const TitleTag = isMini ? "div" : "h1";
  const SectionTag = isMini ? "div" : "h2";
  const SubSectionTag = isMini ? "div" : "h3";

  return (
    <div className={`w-[794px] mx-auto bg-white p-[40px] font-sans text-[#111827] ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      <header className="text-center mb-6 avoid-break">
        <TitleTag className="text-[28px] font-light text-[#111827] tracking-[4px] uppercase">{personalInfo.fullName}</TitleTag>
        <p className="text-[10px] text-[#9CA3AF] mt-2 tracking-[1px]">
          {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio].filter(Boolean).join(" • ")}
        </p>
      </header>
      
      <div className="mt-[24px]">
        {personalInfo.summary && (
          <section className="mb-6">
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
              {isRtl ? "الملخص المهني" : "Summary"}
            </SectionTag>
            <div className="text-[11px] leading-[1.5] text-[#374151] markdown-body">
              <SafeDescription text={personalInfo.summary} />
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
              {isRtl ? "الخبرة المهنية" : "Experience"}
            </SectionTag>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4 avoid-break">
                <SubSectionTag className="text-[13px] font-semibold text-[#111827]">{exp.position}</SubSectionTag>
                <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}</span>
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
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
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
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
              {isRtl ? "المهارات" : "Skills"}
            </SectionTag>
            <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}</p>
          </section>
        )}
        
        {certifications.length > 0 && (
          <section className="mb-6 avoid-break">
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
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
            <SectionTag className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">
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
    </div>
  );
};

export default TemplateMinimal;
