import React from "react";
import type { ResumeData } from "../../store/useResumeStore";

const TemplateMinimal: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects } = data;

  return (
    <div className="w-[794px] mx-auto bg-white p-[40px] font-sans text-[#111827]">
      <header className="text-center mb-6">
        <h1 className="text-[28px] font-light text-[#111827] tracking-[4px] uppercase">{personalInfo.fullName}</h1>
        <p className="text-[10px] text-[#9CA3AF] mt-2 tracking-[1px]">
          {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio].filter(Boolean).join(" • ")}
        </p>
      </header>
      
      <div className="mt-[24px]">
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Summary</h2>
            <p className="text-[11px] leading-[1.5] text-[#374151] whitespace-pre-wrap">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <h3 className="text-[13px] font-semibold text-[#111827]">{exp.position}</h3>
                <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} {exp.startDate && (exp.endDate || "Present") ? "–" : ""} {exp.endDate || (exp.startDate ? "Present" : "")}</span>
                </div>
                <ul className="list-none mt-1">
                  {exp.description?.split("\n").filter(Boolean).map((b, j) => (
                    <li key={j} className="text-[11px] text-[#374151] leading-[1.5] flex gap-2">
                      <span className="text-[#9CA3AF]">–</span>
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
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-semibold text-[#111827]">{edu.institution}</h3>
                  <span className="text-[11px] text-[#6B7280]">{edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}</span>
                </div>
                <p className="text-[11px] text-[#374151]">{edu.degree}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Skills</h2>
            <p className="text-[11px] text-[#374151] leading-[1.5]">{skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}</p>
          </section>
        )}
        
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Certifications</h2>
            {certifications.map((cert, i) => (
              <div key={i} className="text-[11px] text-[#374151] mb-1">
                <span className="font-semibold">{cert.name}</span>, {cert.issuer} {cert.date ? `(${cert.date})` : ""}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold text-[#374151] uppercase tracking-[2px] mb-3">Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[11px] font-semibold text-[#111827]">{proj.name}</h3>
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

export default TemplateMinimal;
