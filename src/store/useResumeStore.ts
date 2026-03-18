import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import debounce from 'lodash.debounce';

// Debounced storage to prevent excessive writes
const debouncedStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: debounce((name: string, value: string) => {
    localStorage.setItem(name, value);
  }, 1000),
  removeItem: (name: string) => localStorage.removeItem(name),
};

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

export type CustomSection = {
  id: string;
  title: string;
  content: string;
};

export type SectionId = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';

export type ResumeData = {
  personalInfo: PersonalInfo;
  coverLetter: CoverLetter;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  settings: {
    template: 'modern' | 'classic' | 'creative' | 'minimal' | 'tech' | 'executive' | 'medical' | 'legal' | 'academic' | 'professional' | 'elegant';
    themeColor: string;
    language: 'en' | 'ar' | 'fr';
    isFreshGrad: boolean;
    sectionOrder: SectionId[];
    hiddenSections: SectionId[];
  };
  jobDescription: string;
  isPremium: boolean;
};

const defaultSectionOrder: SectionId[] = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom'];

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
  customSections: [],
  settings: {
    template: 'modern',
    themeColor: '#475569', // Neutral Slate
    language: 'en',
    isFreshGrad: false,
    sectionOrder: defaultSectionOrder,
    hiddenSections: [],
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
  addCustomSection: (section: Omit<CustomSection, 'id'>) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  updateSettings: (settings: Partial<ResumeData['settings']>) => void;
  updateJobDescription: (jd: string) => void;
  updateCoverLetter: (cl: Partial<CoverLetter>) => void;
  unlockPremium: () => void;
  resetData: () => void;
  loadExampleData: () => void;
  loadData: (data: ResumeData) => void;
  updateData: (data: ResumeData) => void;
  reorderSections: (newOrder: SectionId[]) => void;
  importFromLinkedIn: (data: Partial<ResumeData>) => void;
  addSection: (sectionId: SectionId) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
};

export const useResumeStore = create<ResumeStore>()(
  temporal(
    persist(
      (set) => ({
      data: initialData,
      reorderSections: (newOrder) =>
        set((state) => ({
          data: { ...state.data, settings: { ...state.data.settings, sectionOrder: newOrder } },
        })),
      importFromLinkedIn: (linkedinData) =>
        set((state) => ({
          data: { ...state.data, ...linkedinData },
        })),
      addSection: (sectionId) =>
        set((state) => ({
          data: {
            ...state.data,
            settings: {
              ...state.data.settings,
              hiddenSections: state.data.settings.hiddenSections.filter((id) => id !== sectionId),
            },
          },
        })),
      reorderExperience: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.data.experience);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { data: { ...state.data, experience: result } };
        }),
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
            experience: [...state.data.experience, { ...exp, id: nanoid() }],
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
            education: [...state.data.education, { ...edu, id: nanoid() }],
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
            projects: [...state.data.projects, { ...proj, id: nanoid() }],
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
            certifications: [...state.data.certifications, { ...cert, id: nanoid() }],
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
      addCustomSection: (section) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: [...state.data.customSections, { ...section, id: nanoid() }],
          },
        })),
      updateCustomSection: (id, section) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.map((s) => (s.id === id ? { ...s, ...section } : s)),
          },
        })),
      removeCustomSection: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.filter((s) => s.id !== id),
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
                id: nanoid(),
                company: 'Global Tech Solutions',
                position: 'Senior Frontend Developer',
                startDate: '2020-01',
                endDate: 'Present',
                description: 'Worked on the core web application using React and TypeScript.', // Shortened description
              },
              {
                id: nanoid(),
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
                id: nanoid(),
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
                id: nanoid(),
                name: 'E-commerce Platform',
                description: 'A full-stack e-commerce platform built with MERN stack.',
                link: 'github.com/johndoe/ecommerce',
              },
            ],
            certifications: [
              {
                id: nanoid(),
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
              sectionOrder: defaultSectionOrder,
              hiddenSections: [],
            },
            jobDescription: '',
            isPremium: false,
          },
        }),
    }),
    {
      name: 'hash-resume-storage',
      storage: createJSONStorage(() => debouncedStorage as any),
    }
  )
  )
);
