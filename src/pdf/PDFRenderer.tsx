import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { ClassicTemplatePDF } from './templates/ClassicTemplatePDF';
import { ModernTemplatePDF } from './templates/ModernTemplatePDF';
import { ExecutiveTemplatePDF } from './templates/ExecutiveTemplatePDF';
import { MinimalTemplatePDF } from './templates/MinimalTemplatePDF';
import { TimelineTemplatePDF } from './templates/TimelineTemplatePDF';
import { TwoColumnTemplatePDF } from './templates/TwoColumnTemplatePDF';

// Import font configurations to trigger Font.register
import './fonts';

interface PDFRendererProps {
  templateId: string;
  data: ResumeData;
}

export const PDFRenderer: React.FC<PDFRendererProps> = ({ templateId, data }) => {
  const templates: Record<string, React.FC<{ data: ResumeData }>> = {
    classic: ClassicTemplatePDF,
    modern: ModernTemplatePDF,
    executive: ExecutiveTemplatePDF,
    minimal: MinimalTemplatePDF,
    timeline: TimelineTemplatePDF,
    'two-column': TwoColumnTemplatePDF,
  };

  const SelectedTemplate = templates[templateId] || ClassicTemplatePDF;

  return (
    <Document>
      <Page size="A4" style={{ backgroundColor: '#FFFFFF' }}>
        <SelectedTemplate data={data} />
      </Page>
    </Document>
  );
};
