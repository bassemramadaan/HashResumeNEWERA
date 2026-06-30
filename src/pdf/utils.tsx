import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletRowRtl: {
    flexDirection: 'row-reverse',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
});

export const parseTextWithBold = (text: string) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
};

export const renderMarkdownToPDF = (text: string, isRtl: boolean, baseFont: string) => {
  if (!text) return null;

  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect bullet points (starts with -, *, or •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);

    const textStyle = {
      fontFamily: baseFont,
      fontSize: 10,
      color: '#374151',
      lineHeight: 1.4,
      textAlign: isRtl ? ('right' as const) : ('left' as const),
      direction: isRtl ? ('rtl' as const) : ('ltr' as const),
    };

    if (bulletMatch) {
      const content = bulletMatch[1];
      elements.push(
        <View 
          key={index} 
          style={isRtl ? styles.bulletRowRtl : styles.bulletRow}
        >
          <Text style={[textStyle, styles.bulletPoint, { textAlign: isRtl ? 'right' : 'left' }]}>
            •
          </Text>
          <Text style={[textStyle, styles.bulletText, { paddingLeft: isRtl ? 0 : 4, paddingRight: isRtl ? 4 : 0 }]}>
            {parseTextWithBold(content)}
          </Text>
        </View>
      );
    } else {
      elements.push(
        <Text 
          key={index} 
          style={[textStyle, styles.paragraph]}
        >
          {parseTextWithBold(trimmed)}
        </Text>
      );
    }
  });

  return elements;
};
