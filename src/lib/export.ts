import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "../store/useResumeStore";

export const exportToTxt = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;
  
  let content = "";

  // Header
  content += `${personalInfo.fullName.toUpperCase()}\n`;
  if (personalInfo.jobTitle) content += `${personalInfo.jobTitle}\n`;
  content += `\n`;
  if (personalInfo.email) content += `Email: ${personalInfo.email}\n`;
  if (personalInfo.phone) content += `Phone: ${personalInfo.phone}\n`;
  if (personalInfo.linkedin) content += `LinkedIn: ${personalInfo.linkedin}\n`;
  if (personalInfo.portfolio) content += `Portfolio: ${personalInfo.portfolio}\n`;
  if (personalInfo.address) content += `Location: ${personalInfo.address}\n`;
  content += `\n${"=".repeat(20)}\n\n`;

  // Summary
  if (personalInfo.summary) {
    content += `PROFESSIONAL SUMMARY\n`;
    content += `${"-".repeat(20)}\n`;
    content += `${personalInfo.summary}\n\n`;
  }

  // Experience
  if (experience.length > 0) {
    content += `EXPERIENCE\n`;
    content += `${"-".repeat(20)}\n`;
    experience.forEach(exp => {
      content += `${exp.position} at ${exp.company}\n`;
      content += `${exp.startDate} - ${exp.endDate || "Present"}\n`;
      content += `${exp.description}\n\n`;
    });
  }

  // Education
  if (education.length > 0) {
    content += `EDUCATION\n`;
    content += `${"-".repeat(20)}\n`;
    education.forEach(edu => {
      content += `${edu.degree}\n`;
      content += `${edu.institution}\n`;
      content += `${edu.startDate} - ${edu.endDate || "Present"}\n`;
      if (edu.description) content += `${edu.description}\n`;
      content += `\n`;
    });
  }

  // Skills
  if (skills.length > 0) {
    content += `SKILLS\n`;
    content += `${"-".repeat(20)}\n`;
    content += `${skills.join(", ")}\n\n`;
  }

  // Projects
  if (projects.length > 0) {
    content += `PROJECTS\n`;
    content += `${"-".repeat(20)}\n`;
    projects.forEach(proj => {
      content += `${proj.name}\n`;
      if (proj.link) content += `${proj.link}\n`;
      content += `${proj.description}\n\n`;
    });
  }

  // Certifications
  if (certifications.length > 0) {
    content += `CERTIFICATIONS\n`;
    content += `${"-".repeat(20)}\n`;
    certifications.forEach(cert => {
      content += `${cert.name} - ${cert.issuer}\n`;
      content += `${cert.date}\n\n`;
    });
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.txt`);
};

export const exportToDocx = async (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: personalInfo.fullName.toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: personalInfo.jobTitle,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: personalInfo.email ? `${personalInfo.email} | ` : "" }),
              new TextRun({ text: personalInfo.phone ? `${personalInfo.phone} | ` : "" }),
              new TextRun({ text: personalInfo.address || "" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: personalInfo.linkedin ? `${personalInfo.linkedin} | ` : "" }),
              new TextRun({ text: personalInfo.portfolio || "" }),
            ],
            spacing: { after: 400 },
          }),

          // Summary
          ...(personalInfo.summary ? [
            new Paragraph({
              text: "PROFESSIONAL SUMMARY",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [new TextRun(personalInfo.summary)],
              spacing: { after: 300 },
            }),
          ] : []),

          // Experience
          ...(experience.length > 0 ? [
            new Paragraph({
              text: "EXPERIENCE",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            ...experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.position, bold: true, size: 24 }),
                  new TextRun({
                    text: `\t${exp.startDate} - ${exp.endDate || "Present"}`,
                    bold: true,
                  }),
                ],
                tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: exp.company, italics: true })],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [new TextRun(exp.description)],
                spacing: { after: 300 },
              }),
            ]),
          ] : []),

          // Education
          ...(education.length > 0 ? [
            new Paragraph({
              text: "EDUCATION",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            ...education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.institution, bold: true, size: 24 }),
                  new TextRun({
                    text: `\t${edu.startDate} - ${edu.endDate || "Present"}`,
                    bold: true,
                  }),
                ],
                tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: edu.degree, italics: true })],
                spacing: { after: 100 },
              }),
              ...(edu.description ? [
                new Paragraph({
                  children: [new TextRun(edu.description)],
                  spacing: { after: 300 },
                }),
              ] : []),
            ]),
          ] : []),

          // Skills
          ...(skills.length > 0 ? [
            new Paragraph({
              text: "SKILLS",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [new TextRun(skills.join(", "))],
              spacing: { after: 300 },
            }),
          ] : []),

          // Projects
          ...(projects.length > 0 ? [
            new Paragraph({
              text: "PROJECTS",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            ...projects.flatMap(proj => [
              new Paragraph({
                children: [
                  new TextRun({ text: proj.name, bold: true, size: 24 }),
                  ...(proj.link ? [new TextRun({ text: ` | ${proj.link}`, size: 20 })] : []),
                ],
              }),
              new Paragraph({
                children: [new TextRun(proj.description)],
                spacing: { after: 300 },
              }),
            ]),
          ] : []),

          // Certifications
          ...(certifications.length > 0 ? [
            new Paragraph({
              text: "CERTIFICATIONS",
              heading: HeadingLevel.HEADING_1,
              border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 200, after: 100 },
            }),
            ...certifications.flatMap(cert => [
              new Paragraph({
                children: [
                  new TextRun({ text: cert.name, bold: true }),
                  new TextRun({ text: ` - ${cert.issuer}` }),
                  new TextRun({ text: ` (${cert.date})` }),
                ],
                spacing: { after: 100 },
              }),
            ]),
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.docx`);
};
