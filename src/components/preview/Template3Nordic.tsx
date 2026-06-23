import React from "react";
import type { ResumeData } from "../../types/resume";

const Template3Nordic: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div id="resume-print-area" className="w-[794px] mx-auto bg-white font-sans text-black flex min-h-[1123px]">
      {/* Sidebar */}
      <div className="w-[30%] bg-[#F5F5F5] p-[32px]">
        <h1 className="text-[20px] font-bold mb-1">{data.name}</h1>
        <p className="text-[10px] uppercase tracking-[2px] mb-8">{data.title}</p>

        <div className="border-t border-black mb-6" />
        
        <section className="mb-8">
            <h3 className="text-[9px] font-semibold uppercase mb-3">Contact</h3>
            <div className="text-[10px] space-y-1">
                <p>{data.contact.email}</p>
                <p>{data.contact.phone}</p>
                <p>{data.contact.linkedin}</p>
            </div>
        </section>

        <section>
            <h3 className="text-[9px] font-semibold uppercase mb-3">Skills</h3>
            <div className="text-[10px] space-y-1">
                {data.skills.map((s, i) => <p key={i}>{s}</p>)}
            </div>
        </section>
      </div>

      {/* Main Content */}
      <div className="w-[70%] p-[40px_40px_32px_36px] bg-white">
        <p className="text-[11.5px] italic leading-[1.4] mb-8">{data.summary.join(" ")}</p>

        <section className="mb-6">
            <h3 className="text-[11px] font-bold uppercase mb-4 border-b border-black pb-1 inline-block">Experience</h3>
            <div className="space-y-[16px]">
                {data.experience.map((exp, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-[11px] font-semibold">
                            <span>{exp.company}</span>
                            <span>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="italic text-[10px] mb-1">{exp.role} · {exp.location}</p>
                        <ul className="space-y-[5px]">
                            {exp.bullets.map((b, j) => (
                                <li key={j} className="text-[10.5px] leading-[1.4] flex gap-2">
                                    <span className="mt-1.5 w-[6px] h-[6px] bg-black block shrink-0" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        <section>
            <h3 className="text-[11px] font-bold uppercase mb-4 border-b border-black pb-1 inline-block">Education</h3>
            {data.education.map((edu, i) => (
                <div key={i} className="mb-3 text-[10.5px]">
                    <p className="font-semibold">{edu.institution}</p>
                    <p>{edu.degree} in {edu.field} ({edu.startYear} – {edu.endYear})</p>
                </div>
            ))}
        </section>
      </div>
    </div>
  );
};

export default Template3Nordic;
