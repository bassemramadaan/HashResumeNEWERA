import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../types/resume';
import { renderMarkdownToPDF } from '../utils';
import { detectIsArabic } from '../../utils/language';

export const ExecutiveTemplatePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects, settings } = data;
  const isRtl = detectIsArabic(data as any);
  
  const baseFont = isRtl ? 'Cairo' : 'PlusJakartaSans';

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 30,
      fontFamily: baseFont,
      color: '#111827',
      direction: isRtl ? 'rtl' : 'ltr',
    },
    header: {
      backgroundColor: '#F3F4F6',
      borderBottomWidth: 2,
      borderBottomColor: '#111827',
      padding: 24,
      textAlign: isRtl ? 'right' : 'left',
    },
    fullName: {
      fontSize: 26,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 13,
      fontWeight: 500,
      color: '#374151',
      marginBottom: 6,
    },
    contactText: {
      fontSize: 9,
      color: '#6B7280',
      lineHeight: 1.3,
    },
    content: {
      paddingHorizontal: 28,
      paddingTop: 15,
    },
    section: {
      marginTop: 10,
      marginBottom: 4,
    },
    sectionHeadingContainer: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    sectionHeadingAccent: {
      width: 3,
      height: 12,
      backgroundColor: '#111827',
      marginRight: isRtl ? 0 : 6,
      marginLeft: isRtl ? 6 : 0,
    },
    sectionHeading: {
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase',
      color: '#111827',
    },
    row: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    titleText: {
      fontSize: 10,
      fontWeight: 700,
      color: '#111827',
      textAlign: isRtl ? 'right' : 'left',
    },
    subtitleText: {
      fontSize: 9.5,
      fontWeight: 500,
      color: '#374151',
      marginBottom: 3,
      textAlign: isRtl ? 'right' : 'left',
    },
    dateText: {
      fontSize: 9,
      color: '#6B7280',
    },
    descContainer: {
      marginTop: 1,
      marginBottom: 5,
    },
    skillsText: {
      fontSize: 9.5,
      color: '#374151',
      lineHeight: 1.4,
      textAlign: isRtl ? 'right' : 'left',
    },
    certItem: {
      fontSize: 9.5,
      color: '#374151',
      marginBottom: 3,
      textAlign: isRtl ? 'right' : 'left',
    },
  });

  const contactItems = [
    personalInfo.address,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.portfolio
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{personalInfo.fullName}</Text>
        {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
        <Text style={styles.contactText}>{contactItems.join("  |  ")}</Text>
      </View>

      <View style={styles.content}>
        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "الملخص المهني" : "Summary"}</Text>
            </View>
            <View style={styles.descContainer}>
              {renderMarkdownToPDF(personalInfo.summary, isRtl, baseFont)}
            </View>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "الخبرة المهنية" : "Experience"}</Text>
            </View>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 6 }} wrap={false}>
                <Text style={styles.titleText}>{exp.position}</Text>
                <View style={styles.row}>
                  <Text style={styles.subtitleText}>{exp.company}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}
                  </Text>
                </View>
                <View style={styles.descContainer}>
                  {renderMarkdownToPDF(exp.description, isRtl, baseFont)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "التعليم" : "Education"}</Text>
            </View>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.titleText}>{edu.institution}</Text>
                  <Text style={styles.dateText}>{edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}</Text>
                </View>
                <Text style={styles.subtitleText}>{edu.degree}</Text>
                {edu.description && (
                  <View style={styles.descContainer}>
                    {renderMarkdownToPDF(edu.description, isRtl, baseFont)}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "المهارات" : "Skills"}</Text>
            </View>
            <Text style={styles.skillsText}>
              {skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}
            </Text>
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "الشهادات" : "Certifications"}</Text>
            </View>
            {certifications.map((cert, i) => (
              <Text key={i} style={styles.certItem}>
                <Text style={{ fontWeight: 700 }}>{cert.name}</Text>, {cert.issuer} {cert.date ? `(${cert.date})` : ""}
              </Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <View style={styles.sectionHeadingAccent} />
              <Text style={styles.sectionHeading}>{isRtl ? "المشاريع" : "Projects"}</Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.titleText}>{proj.name}</Text>
                  {proj.link && <Text style={[styles.dateText, { color: '#2563EB' }]}>{proj.link}</Text>}
                </View>
                <View style={styles.descContainer}>
                  {renderMarkdownToPDF(proj.description, isRtl, baseFont)}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
