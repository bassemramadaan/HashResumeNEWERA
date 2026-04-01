import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "../store/useResumeStore";

export const generateWord = async (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: personalInfo.fullName,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${personalInfo.jobTitle} | ${personalInfo.email} | ${personalInfo.phone}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${personalInfo.address} | ${personalInfo.linkedin} | ${personalInfo.github}`,
                size: 20,
              }),
            ],
          }),

          // Summary
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: personalInfo.summary,
            spacing: { before: 200 },
          }),

          // Experience
          new Paragraph({
            text: "WORK EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          ...experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun({ text: ` at ${exp.company}`, bold: true }),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.endDate}`,
              spacing: { before: 100 },
            }),
            new Paragraph({
              text: exp.description,
              spacing: { before: 100 },
            }),
          ]),

          // Education
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          ...education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` from ${edu.institution}`, bold: true }),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              text: `${edu.startDate} - ${edu.endDate}`,
              spacing: { before: 100 },
            }),
            new Paragraph({
              text: edu.description,
              spacing: { before: 100 },
            }),
          ]),

          // Skills
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: skills.join(", "),
            spacing: { before: 200 },
          }),

          // Projects
          ...(projects && projects.length > 0 ? [
            new Paragraph({
              text: "PROJECTS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 },
            }),
            ...projects.flatMap((proj) => [
              new Paragraph({
                children: [
                  new TextRun({ text: proj.name, bold: true }),
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                text: proj.description,
                spacing: { before: 100 },
              }),
            ])
          ] : []),

          // Certifications
          ...(certifications && certifications.length > 0 ? [
            new Paragraph({
              text: "CERTIFICATIONS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 },
            }),
            ...certifications.flatMap((cert) => [
              new Paragraph({
                children: [
                  new TextRun({ text: cert.name, bold: true }),
                  new TextRun({ text: ` - ${cert.issuer}`, size: 20 }),
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                text: cert.date,
                spacing: { before: 100 },
              }),
            ])
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.docx`);
};
