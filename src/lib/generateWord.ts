import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../store/useResumeStore';

export const generateWord = async (data: ResumeData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: data.personalInfo.fullName || "Your Name",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: data.personalInfo.jobTitle || "",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun(`${data.personalInfo.email || ""} ${data.personalInfo.phone ? "| " + data.personalInfo.phone : ""}`),
            new TextRun({
              text: data.personalInfo.address ? ` | ${data.personalInfo.address}` : "",
            }),
          ],
        }),
        new Paragraph({ text: "" }), // Spacer

        // Summary
        ...(data.personalInfo.summary ? [
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          new Paragraph({
            text: data.personalInfo.summary,
          }),
          new Paragraph({ text: "" }),
        ] : []),

        // Experience
        ...(data.experience.length > 0 ? [
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.position,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: ` at ${exp.company}`,
                  italics: true,
                  size: 24,
                }),
              ]
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.endDate}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: exp.description,
            }),
            new Paragraph({ text: "" }),
          ])
        ] : []),

        // Education
        ...(data.education.length > 0 ? [
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          ...data.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: ` - ${edu.institution}`,
                  italics: true,
                  size: 24,
                }),
              ]
            }),
            new Paragraph({
              text: `${edu.startDate} - ${edu.endDate}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: edu.description || "",
            }),
            new Paragraph({ text: "" }),
          ])
        ] : []),

        // Skills
        ...(data.skills.length > 0 ? [
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          new Paragraph({
            text: data.skills.join(", "),
          }),
        ] : []),
        
        // Projects
        ...(data.projects.length > 0 ? [
          new Paragraph({
            text: "Projects",
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          ...data.projects.flatMap(proj => [
             new Paragraph({
              children: [
                new TextRun({
                  text: proj.name,
                  bold: true,
                  size: 24,
                }),
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.link || "",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              text: proj.description,
            }),
            new Paragraph({ text: "" }),
          ])
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personalInfo.fullName || 'resume'}.docx`);
};
