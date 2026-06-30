import React from 'react';

export type Tab =
  | "basics"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "finish"
  | "review";

export interface TabItem {
  id: Tab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  tourId?: string;
}
