import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../store/useResumeStore';
import { renderMarkdownToPDF } from '../utils';
import { detectIsArabic } from '../../utils/language';

export const TwoColumnTemplatePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;
  const isRtl = detectIsArabic(data);
  
  const baseFont = isRtl ? 'Cairo' : 'PlusJakartaSans';
  const themeColor = settings.themeColor || '#001639';

  const styles = StyleSheet.create({
    page: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      fontFamily: baseFont,
      color: '#111827',
      direction: isRtl ? 'rtl' : 'ltr',
    },
    sidebar: {
      width: '30%',
      backgroundColor: '#F8FAFC',
      borderRightWidth: isRtl ? 0 : 1,
      borderRightColor: '#E2E8F0',
      borderLeftWidth: isRtl ? 1 : 0,
      borderLeftColor: '#E2E8F0',
      padding: 16,
      height: '100%',
    },
    mainContent: {
      width: '70%',
      padding: 20,
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarTitle: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: '#1E293B',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      paddingBottom: 3,
      marginBottom: 8,
      textAlign: isRtl ? 'right' : 'left',
    },
    contactItem: {
      marginBottom: 6,
    },
    contactLabel: {
      fontSize: 7.5,
      color: '#64748B',
      fontWeight: 700,
      textTransform: 'uppercase',
      textAlign: isRtl ? 'right' : 'left',
    },
    contactValue: {
      fontSize: 8.5,
      color: '#334155',
      textAlign: isRtl ? 'right' : 'left',
    },
    skillBadge: {
      fontSize: 8,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 3,
      marginBottom: 4,
      marginRight: isRtl ? 0 : 4,
      marginLeft: isRtl ? 4 : 0,
      color: '#334155',
      textAlign: 'center',
    },
    skillsWrapper: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
    },
    certItem: {
      marginBottom: 6,
    },
    certName: {
      fontSize: 8.5,
      fontWeight: 700,
      color: '#1E293B',
      textAlign: isRtl ? 'right' : 'left',
    },
    certIssuer: {
      fontSize: 8,
      color: '#475569',
      textAlign: isRtl ? 'right' : 'left',
    },
    certDate: {
      fontSize: 7.5,
      color: '#94A3B8',
      textAlign: isRtl ? 'right' : 'left',
    },
    mainHeader: {
      marginBottom: 16,
    },
    fullName: {
      fontSize: 24,
      fontWeight: 800,
      color: themeColor,
      marginBottom: 2,
      textAlign: isRtl ? 'right' : 'left',
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 500,
      color: '#475569',
      textAlign: isRtl ? 'right' : 'left',
    },
    mainSection: {
      marginBottom: 14,
    },
    mainSectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: themeColor,
      marginBottom: 6,
      textAlign: isRtl ? 'right' : 'left',
    },
    row: {
      flexDirection: isRtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1,
    },
    itemTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      color: '#0F172A',
      textAlign: isRtl ? 'right' : 'left',
    },
    itemSub: {
      fontSize: 9,
      fontWeight: 500,
      color: '#475569',
      marginBottom: 2,
      textAlign: isRtl ? 'right' : 'left',
    },
    dateText: {
      fontSize: 8,
      color: '#64748B',
      backgroundColor: '#F1F5F9',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },
    descContainer: {
      marginTop: 1,
      marginBottom: 4,
    },
  });

  return (
    <View style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Contact Info */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>{isRtl ? "معلومات الاتصال" : "Contact"}</Text>
          {personalInfo.email && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>{isRtl ? "البريد الإلكتروني" : "Email"}</Text>
              <Text style={styles.contactValue}>{personalInfo.email}</Text>
            </View>
          )}
          {personalInfo.phone && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>{isRtl ? "الهاتف" : "Phone"}</Text>
              <Text style={styles.contactValue}>{personalInfo.phone}</Text>
            </View>
          )}
          {personalInfo.address && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>{isRtl ? "العنوان" : "Address"}</Text>
              <Text style={styles.contactValue}>{personalInfo.address}</Text>
            </View>
          )}
          {personalInfo.website && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>{isRtl ? "الموقع" : "Website"}</Text>
              <Text style={styles.contactValue}>{personalInfo.website}</Text>
            </View>
          )}
          {personalInfo.linkedin && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>{isRtl ? "لينكد إن" : "LinkedIn"}</Text>
              <Text style={styles.contactValue}>{personalInfo.linkedin}</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>{isRtl ? "المهارات" : "Skills"}</Text>
            <View style={styles.skillsWrapper}>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>{isRtl ? "الشهادات" : "Certifications"}</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                {cert.date && <Text style={styles.certDate}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.mainHeader}>
          <Text style={styles.fullName}>{personalInfo.fullName}</Text>
          {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>{isRtl ? "الملخص المهني" : "Summary"}</Text>
            <View style={styles.descContainer}>
              {renderMarkdownToPDF(personalInfo.summary, isRtl, baseFont)}
            </View>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>{isRtl ? "الخبرة المهنية" : "Experience"}</Text>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 6 }} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate} - {exp.current ? (isRtl ? 'الحاضر' : 'Present') : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSub}>{exp.company}</Text>
                <View style={styles.descContainer}>
                  {renderMarkdownToPDF(exp.description, isRtl, baseFont)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>{isRtl ? "المشاريع" : "Projects"}</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.link && (
                    <Text style={[styles.dateText, { backgroundColor: 'transparent', color: themeColor, fontSize: 7.5 }]}>
                      {proj.link}
                    </Text>
                  )}
                </View>
                <View style={styles.descContainer}>
                  {renderMarkdownToPDF(proj.description, isRtl, baseFont)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>{isRtl ? "التعليم" : "Education"}</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.dateText}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <Text style={styles.itemSub}>{edu.institution}</Text>
                {edu.description && (
                  <View style={styles.descContainer}>
                    {renderMarkdownToPDF(edu.description, isRtl, baseFont)}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
