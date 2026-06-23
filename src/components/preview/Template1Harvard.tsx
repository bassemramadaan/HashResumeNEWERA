import React from "react";
import type { ResumeData } from "../../types/resume";

const Template1Harvard: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div id="resume-print-area" className="w-[794px] mx-auto bg-white p-[52px_60px_48px_60px] font-sans text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold mb-2 font-serif">{data.name}</h1>
        <div className="border-t-[1px] border-black my-2" />
        <p className="text-[10px] font-normal uppercase tracking-wide">
          {[data.contact.city + ", " + data.contact.country, data.contact.phone, data.contact.email, data.contact.linkedin, data.contact.portfolio].filter(Boolean).join(" | ")}
        </p>
      </div>

      <div className="space-y-[16px]">
        {/* Education */}
        <section>
          <div className="border-t-[0.75px] border-black mb-1" />
          <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2 font-sans">Education</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between font-bold text-[11px]">
                  <span>{edu.institution}, <span className="font-normal">{edu.degree} in {edu.field}</span></span>
                  <span>{edu.startYear} – {edu.endYear}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section>
          <div className="border-t-[0.75px] border-black mb-1" />
          <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2 font-sans">Experience</h3>
          <div className="space-y-[12px]">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[11px]">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic text-[11px] mb-1">{exp.role}</div>
                <ul className="pl-[14px] space-y-[3px]">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="text-[11px] leading-[1.1] list-none relative">
                        <span className="absolute -left-[14px]">–</span>
                        {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="border-t-[0.75px] border-black mb-1" />
          <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2 font-sans">Skills</h3>
          <p className="text-[11px] leading-[1.1] font-normal">{data.skills.join(", ")}</p>
        </section>
      </div>
    </div>
  );
};

export default Template1Harvard;
