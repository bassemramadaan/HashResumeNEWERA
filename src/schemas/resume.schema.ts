import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  score: z.string().optional(),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
  certifications: z.array(z.object({ id: z.string(), name: z.string(), issuer: z.string(), date: z.string(), url: z.string().optional() })),
  projects: z.array(z.object({ id: z.string(), name: z.string(), description: z.string(), url: z.string().optional(), technologies: z.array(z.string()) })),
});

export type ResumeData = z.infer<typeof resumeSchema>;
