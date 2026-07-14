import React from "react";
import type { ResumeData } from "../../store/useResumeStore";
import { SafeDescription } from "./SafeDescription";
import { detectIsArabic } from "../../utils/language";

const TemplateClassic: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects, settings } = data;
  const isRtl = detectIsArabic(data);
  
  return (
    <div className={`w-[794px] mx-auto bg-white p-[40px] font-sans text-[#111827] ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      <header className="text-center mb-6 avoid-break">
        <h2 className="text-[28px] font-bold text-[#111827]">{personalInfo.fullName}</h2>
        <p className="text-[11px] text-[#6B7280] mt-1">
          {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio].filter(Boolean).join(" | ")}
        </p>
        <div className="border-b-2 border-[#111827] mt-4" />
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
            {isRtl ? "الملخص المهني" : "Summary"}
          </h2>
          <div className="text-[11px] leading-[1.5] text-[#374151] markdown-body">
            <SafeDescription text={personalInfo.summary} />
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
            {isRtl ? "الخبرة المهنية" : "Experience"}
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4 avoid-break">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[12px] font-semibold text-[#111827]">{exp.position}</h3>
                <span className="text-[11px] text-[#6B7280]">{exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}</span>
              </div>
              <p className="text-[11px] text-[#6B7280]">{exp.company}</p>
              <div className="text-[11px] text-[#374151] leading-[1.5] mt-1 markdown-body">
                <SafeDescription text={exp.description} />
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
            {isRtl ? "التعليم" : "Education"}
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2 avoid-break">
              <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-[#111827]">{edu.institution}</h3>
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
          <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
            {isRtl ? "المهارات" : "Skills"}
          </h2>
          <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}</p>
        </section>
      )}

      {certifications.length > 0 && (
          <section className="mb-6 avoid-break">
            <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
              {isRtl ? "الشهادات" : "Certifications"}
            </h2>
            {certifications.map((cert, i) => (
              <div key={i} className="text-[11px] text-[#374151] mb-1">
                <span className="font-semibold">{cert.name}</span>, {cert.issuer} {cert.date ? `(${cert.date})` : ""}
              </div>
            ))}
          </section>
      )}

      {projects.length > 0 && (
          <section className="avoid-break">
            <h2 className="text-[12px] font-bold uppercase tracking-[1.5px] border-b-[1.5px] border-[#111827] pb-1 mb-2">
              {isRtl ? "المشاريع" : "Projects"}
            </h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-semibold text-[#111827]">{proj.name}</h3>
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

export default TemplateClassic;
