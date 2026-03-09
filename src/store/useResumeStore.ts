import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
};

export type CoverLetter = {
  fullName: string;
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  jobDescription: string;
  skills: string;
  generatedContent: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  coverLetter: CoverLetter;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  settings: {
    template: 'modern' | 'classic' | 'creative' | 'minimal' | 'tech' | 'executive' | 'medical' | 'legal' | 'academic';
    themeColor: string;
    language: 'en' | 'ar' | 'fr';
    isFreshGrad: boolean;
  };
  jobDescription: string;
  isPremium: boolean;
};

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  coverLetter: {
    fullName: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    skills: '',
    generatedContent: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  settings: {
    template: 'modern',
    themeColor: '#2563EB', // Green
    language: 'en',
    isFreshGrad: false,
  },
  jobDescription: '',
  isPremium: false,
};

type ResumeStore = {
  data: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  updateSettings: (settings: Partial<ResumeData['settings']>) => void;
  updateJobDescription: (jd: string) => void;
  updateCoverLetter: (cl: Partial<CoverLetter>) => void;
  unlockPremium: () => void;
  resetData: () => void;
  loadExampleData: () => void;
  loadData: (data: ResumeData) => void;
  updateData: (data: ResumeData) => void;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useResumeStore = create<ResumeStore>()(
  temporal(
    persist(
      (set) => ({
      data: initialData,
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
        })),
      updateCoverLetter: (cl) =>
        set((state) => ({
          data: { ...state.data, coverLetter: { ...state.data.coverLetter, ...cl } },
        })),
      addExperience: (exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, { ...exp, id: generateId() }],
          },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        })),
      addEducation: (edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, { ...edu, id: generateId() }],
          },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        })),
      addSkill: (skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...state.data.skills, skill],
          },
        })),
      removeSkill: (skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((s) => s !== skill),
          },
        })),
      addProject: (proj) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [...state.data.projects, { ...proj, id: generateId() }],
          },
        })),
      updateProject: (id, proj) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        })),
      addCertification: (cert) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: [...state.data.certifications, { ...cert, id: generateId() }],
          },
        })),
      updateCertification: (id, cert) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.filter((c) => c.id !== id),
          },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          data: { ...state.data, settings: { ...state.data.settings, ...settings } },
        })),
      updateJobDescription: (jd) =>
        set((state) => ({
          data: { ...state.data, jobDescription: jd },
        })),
      unlockPremium: () =>
        set((state) => ({
          data: { ...state.data, isPremium: true },
        })),
      resetData: () => set({ data: initialData }),
      loadData: (data) => set({ data }),
      updateData: (data) => set({ data }),
      loadExampleData: () =>
        set({
          data: {
            personalInfo: {
              fullName: 'John Doe',
              jobTitle: 'Senior Software Engineer',
              email: 'john.doe@example.com',
              phone: '+1 234 567 8900',
              address: 'New York, NY',
              linkedin: '', // Removed LinkedIn to lower ATS score
              github: 'github.com/johndoe',
              portfolio: 'johndoe.dev',
              summary: '', // Removed summary to lower ATS score
            },
            coverLetter: {
              fullName: '',
              jobTitle: '',
              companyName: '',
              hiringManager: '',
              jobDescription: '',
              skills: '',
              generatedContent: '',
            },
            experience: [
              {
                id: generateId(),
                company: 'Global Tech Solutions',
                position: 'Senior Frontend Developer',
                startDate: '2020-01',
                endDate: 'Present',
                description: 'Worked on the core web application using React and TypeScript.', // Shortened description
              },
              {
                id: generateId(),
                company: 'Innovate Systems LLC',
                position: 'Frontend Developer',
                startDate: '2017-06',
                endDate: '2019-12',
                description:
                  '• Developed responsive web interfaces using HTML, CSS, and JavaScript.\n• Collaborated with designers to implement pixel-perfect UI components.\n• Integrated RESTful APIs to display dynamic content.',
              },
            ],
            education: [
              {
                id: generateId(),
                institution: 'State University of Technology',
                degree: 'Bachelor of Science in Computer Science',
                startDate: '2013-09',
                endDate: '2017-05',
                description: 'Graduated with Honors. Relevant coursework: Data Structures, Algorithms, Web Development.',
              },
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git', 'Agile Methodologies'],
            projects: [
              {
                id: generateId(),
                name: 'E-commerce Platform',
                description: 'A full-stack e-commerce platform built with MERN stack.',
                link: 'github.com/johndoe/ecommerce',
              },
            ],
            certifications: [
              {
                id: generateId(),
                name: 'AWS Certified Developer',
                issuer: 'Amazon Web Services',
                date: '2021-08',
              },
            ],
            settings: {
              template: 'modern',
              themeColor: '#2563EB',
              language: 'en',
              isFreshGrad: false,
            },
            jobDescription: '',
            isPremium: false,
          },
        }),
    }),
    {
      name: 'hash-resume-storage',
    }
  )
  )
);
