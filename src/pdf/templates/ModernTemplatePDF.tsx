import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../store/useResumeStore';
import { renderMarkdownToPDF } from '../utils';
import { detectIsArabic } from '../../utils/language';

export const ModernTemplatePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects } = data;
  const isRtl = detectIsArabic(data);
  
  const baseFont = isRtl ? 'Cairo' : 'PlusJakartaSans';

  const styles = StyleSheet.create({
    container: {
      padding: 30,
      fontFamily: baseFont,
      color: '#111827',
      direction: isRtl ? 'rtl' : 'ltr',
    },
    header: {
      marginBottom: 15,
      textAlign: isRtl ? 'right' : 'left',
    },
    fullName: {
      fontSize: 24,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    contactText: {
      fontSize: 9,
      color: '#6B7280',
    },
    section: {
      marginTop: 12,
      marginBottom: 4,
    },
    sectionHeading: {
      fontSize: 11,
      fontWeight: 700,
      color: '#111827',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 2,
      marginBottom: 6,
      textAlign: isRtl ? 'right' : 'left',
    },
    row: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1,
    },
    titleText: {
      fontSize: 10.5,
      fontWeight: 700,
      color: '#111827',
      textAlign: isRtl ? 'right' : 'left',
    },
    subtitleRow: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    subtitleText: {
      fontSize: 9.5,
      fontWeight: 500,
      color: '#374151',
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

  const contacts = [
    personalInfo.address,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.portfolio || personalInfo.website
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{personalInfo.fullName}</Text>
        <View style={styles.contactRow}>
          {contacts.map((contact, index) => (
            <Text key={index} style={styles.contactText}>
              {contact} {index < contacts.length - 1 ? '  •  ' : ''}
            </Text>
          ))}
        </View>
      </View>

      {/* Summary */}
      {personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>{isRtl ? "الملخص المهني" : "Summary"}</Text>
          <View style={styles.descContainer}>
            {renderMarkdownToPDF(personalInfo.summary, isRtl, baseFont)}
          </View>
        </View>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>{isRtl ? "الخبرة المهنية" : "Experience"}</Text>
          {experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 6 }} wrap={false}>
              <Text style={styles.titleText}>{exp.position}</Text>
              <View style={styles.subtitleRow}>
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
          <Text style={styles.sectionHeading}>{isRtl ? "التعليم" : "Education"}</Text>
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
          <Text style={styles.sectionHeading}>{isRtl ? "المهارات" : "Skills"}</Text>
          <Text style={styles.skillsText}>
            {skills.map(s => typeof s === 'string' ? s : (s as unknown as { name: string }).name).join(", ")}
          </Text>
        </View>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading}>{isRtl ? "الشهادات" : "Certifications"}</Text>
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
          <Text style={styles.sectionHeading}>{isRtl ? "المشاريع" : "Projects"}</Text>
          {projects.map((proj, i) => (
            <View key={i} style={{ marginBottom: 6 }} wrap={false}>
              <View style={styles.row}>
                <Text style={styles.titleText}>{proj.name}</Text>
                {proj.link && <Text style={[styles.dateText, { color: '#2563FF' }]}>{proj.link}</Text>}
              </View>
              <View style={styles.descContainer}>
                {renderMarkdownToPDF(proj.description, isRtl, baseFont)}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
