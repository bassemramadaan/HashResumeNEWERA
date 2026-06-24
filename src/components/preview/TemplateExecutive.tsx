import React from "react";
import type { ResumeData } from "../../store/useResumeStore";

const TemplateExecutive: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects } = data;

  return (
    <div className="w-[794px] mx-auto bg-white font-sans text-[#111827]">
      <header className="bg-[#F9FAFB] border-b-2 border-[#111827] p-[24px]">
        <h1 className="text-[34px] font-bold text-[#111827]">{personalInfo.fullName}</h1>
        <p className="text-[15px] text-[#374151] mt-1">{personalInfo.jobTitle}</p>
        <p className="text-[11px] text-[#6B7280] mt-2">
          {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio].filter(Boolean).join(" | ")}
        </p>
      </header>
      
      <div className="p-[28px]">
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Summary</h2>
            <p className="text-[11px] leading-[1.5] text-[#374151] whitespace-pre-wrap">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <h3 className="text-[12px] font-semibold text-[#111827]">{exp.position}</h3>
                <p className="text-[12px] text-[#374151]">{exp.company} | {exp.startDate} {exp.startDate && (exp.endDate || "Present") ? "–" : ""} {exp.endDate || (exp.startDate ? "Present" : "")}</p>
                <ul className="list-none mt-1">
                  {exp.description?.split("\n").filter(Boolean).map((b, j) => (
                    <li key={j} className="text-[11px] text-[#374151] leading-[1.5] flex gap-2">
                      <span className="text-[#374151]">▸</span>
                      <span>{b.replace(/^[•\-*]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-[#111827]">{edu.institution}</h3>
                  <span className="text-[11px] text-[#6B7280]">{edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}</span>
                </div>
                <p className="text-[11px] text-[#374151]">{edu.degree}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Skills</h2>
            <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}</p>
          </section>
        )}
        
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Certifications</h2>
            {certifications.map((cert, i) => (
              <div key={i} className="text-[11px] text-[#374151] mb-1">
                <span className="font-semibold">{cert.name}</span>, {cert.issuer} {cert.date ? `(${cert.date})` : ""}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold text-[#111827] border-l-[3px] border-[#111827] pl-[10px] mb-2 uppercase">Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-semibold text-[#111827]">{proj.name}</h3>
                    {proj.link && <span className="text-[11px] text-[#6B7280]">{proj.link}</span>}
                  </div>
                  <p className="text-[11px] text-[#374151] leading-[1.5] whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateExecutive;
