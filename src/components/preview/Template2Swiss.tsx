import React from "react";
import type { ResumeData } from "../../types/resume";

const Template2Swiss: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div id="resume-print-area" className="w-[794px] mx-auto bg-white p-[56px_48px_48px_40px] font-sans text-black relative min-h-[1123px]">
      <div className="absolute top-[56px] bottom-[48px] left-[142px] w-[1px] bg-black" />
      
      {/* Name/Title (Right Column) */}
      <div className="grid grid-cols-[142px_1fr] gap-[40px]">
        <div></div>
        <div className="mb-8">
            <h1 className="text-[32px] font-light tracking-[-0.5px] mb-1">{data.name}</h1>
            <p className="text-[11px] font-normal tracking-[4px] uppercase">{data.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-[142px_1fr] gap-[40px]">
        {/* Left Col (Labels) */}
        <div className="flex flex-col gap-[32px]">
            <div className="text-[9px] font-medium tracking-[3px] uppercase">Profile</div>
            <div className="text-[9px] font-medium tracking-[3px] uppercase">Experience</div>
            <div className="text-[9px] font-medium tracking-[3px] uppercase">Skills</div>
            <div className="text-[9px] font-medium tracking-[3px] uppercase">Education</div>
            <div className="text-[9px] font-medium tracking-[3px] uppercase mt-auto">Contact</div>
        </div>

        {/* Right Col */}
        <div className="flex flex-col gap-[32px] text-[10.5px] leading-[1.5]">
            {/* Summary */}
            <div className="space-y-1">
                {data.summary.map((s, i) => <p key={i}>{s}</p>)}
            </div>

            {/* Experience */}
            <div className="space-y-[24px]">
                {data.experience.map((exp, i) => (
                    <div key={i} className="flex justify-between">
                        <div className="w-[85%]">
                            <h4 className="font-semibold">{exp.company} – {exp.role}</h4>
                            <ul className="list-[circle] pl-4">
                                {exp.bullets.map((b, j) => <li key={j} className="text-[10px]">{b}</li>)}
                            </ul>
                        </div>
                        <div className="text-[10px] text-right font-medium">{exp.startDate} – {exp.endDate}</div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <p>{data.skills.join(" · ")}</p>

            {/* Education */}
            <div className="space-y-[16px]">
                {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between">
                        <div>
                            <h4 className="font-semibold">{edu.institution}</h4>
                            <p className="text-[10px]">{edu.degree} in {edu.field}</p>
                        </div>
                        <div className="text-[10px] text-right font-medium">{edu.startYear} – {edu.endYear}</div>
                    </div>
                ))}
            </div>

            {/* Contact */}
            <div className="mt-auto text-[10px] space-y-0.5">
                <p>{data.contact.email}</p>
                <p>{data.contact.phone}</p>
                <p>{data.contact.city}, {data.contact.country}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Template2Swiss;
