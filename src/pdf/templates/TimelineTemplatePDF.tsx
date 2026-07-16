import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../types/resume';
import { renderMarkdownToPDF } from '../utils';
import { detectIsArabic } from '../../utils/language';

export const TimelineTemplatePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, projects, settings } = data;
  const isRtl = detectIsArabic(data as any);
  
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
      fontSize: 22,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 3,
    },
    contactText: {
      fontSize: 9,
      color: '#6B7280',
      lineHeight: 1.3,
    },
    divider: {
      borderBottomWidth: 1.5,
      borderBottomColor: '#111827',
      marginTop: 8,
      marginBottom: 10,
    },
    section: {
      marginTop: 10,
      marginBottom: 4,
    },
    sectionHeading: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: '#111827',
      marginBottom: 8,
      textAlign: isRtl ? 'right' : 'left',
    },
    timelineItem: {
      borderLeftWidth: isRtl ? 0 : 1.5,
      borderLeftColor: '#E5E7EB',
      borderRightWidth: isRtl ? 1.5 : 0,
      borderRightColor: '#E5E7EB',
      paddingLeft: isRtl ? 0 : 14,
      paddingRight: isRtl ? 14 : 0,
      marginLeft: isRtl ? 0 : 4,
      marginRight: isRtl ? 4 : 0,
      position: 'relative',
      paddingBottom: 8,
    },
    timelineDot: {
      position: 'absolute',
      left: isRtl ? 'auto' : -4.5,
      right: isRtl ? -4.5 : 'auto',
      top: 3,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#374151',
    },
    row: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1,
    },
    titleText: {
      fontSize: 10,
      fontWeight: 700,
      color: '#111827',
      textAlign: isRtl ? 'right' : 'left',
    },
    subtitleText: {
      fontSize: 9.5,
      color: '#6B7280',
      marginBottom: 2,
      textAlign: isRtl ? 'right' : 'left',
    },
    dateText: {
      fontSize: 9,
      color: '#6B7280',
    },
    descContainer: {
      marginTop: 1,
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
        <Text style={styles.contactText}>{contactItems.join("  |  ")}</Text>
        <View style={styles.divider} />
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
            <View key={i} style={styles.timelineItem} wrap={false}>
              <View style={styles.timelineDot} />
              <Text style={styles.titleText}>{exp.position}</Text>
              <Text style={styles.subtitleText}>
                {exp.company}  •  {exp.startDate} {exp.startDate && (exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate) ? "–" : ""} {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}
              </Text>
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
            {skills.map(s => typeof s === 'string' ? s : (s as any).name).join(", ")}
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
                {proj.link && <Text style={[styles.dateText, { color: '#001639' }]}>{proj.link}</Text>}
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
