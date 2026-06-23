export interface ContactInfo {
  city: string;
  country: string;
  phone: string;
  email: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  tech?: string;
  link?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ContactInfo;
  summary: string[];         // 2 bullet strings max
  skills: string[];
  experience: ExperienceEntry[];
  projects?: ProjectEntry[];
  education: EducationEntry[];
  certifications?: CertificationEntry[];
}
