import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Invalid phone number"),
  address: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  summary: z.string().optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().min(2, "Degree is required"),
  field: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  score: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  technologies: z.array(z.string()).optional(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Certification name is required"),
  issuer: z.string().min(2, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Section title is required"),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  coverLetter: z.object({
    recipientName: z.string().optional(),
    recipientTitle: z.string().optional(),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    content: z.string().optional(),
    date: z.string().optional(),
  }),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  customSections: z.array(customSectionSchema),
  settings: z.object({
    template: z.string(),
    language: z.enum(["en", "fr", "ar"]),
    fontSize: z.enum(["small", "medium", "large"]),
    colorScheme: z.string(),
    layout: z.string().optional(),
  }),
  jobDescription: z.string().optional(),
  isPremium: z.boolean().optional(),
});

export type ResumeData = z.infer<typeof resumeSchema>;
