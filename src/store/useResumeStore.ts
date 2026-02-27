import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  dob: string;
  summary: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  settings: {
    template: 'modern' | 'classic' | 'creative';
    themeColor: string;
    language: 'en' | 'ar';
    isFreshGrad: boolean;
  };
};

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    dob: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  settings: {
    template: 'modern',
    themeColor: '#22C55E', // Green
    language: 'en',
    isFreshGrad: false,
  },
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
  resetData: () => void;
  loadExampleData: () => void;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: initialData,
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
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
      resetData: () => set({ data: initialData }),
      loadExampleData: () =>
        set({
          data: {
            personalInfo: {
              fullName: 'John Doe',
              jobTitle: 'Senior Software Engineer',
              email: 'john.doe@example.com',
              phone: '+1 (555) 123-4567',
              address: 'San Francisco, CA',
              linkedin: 'linkedin.com/in/johndoe',
              dob: '1990-01-01',
              summary:
                'Experienced Software Engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success. Well-versed in technology and writing code to create systems that are reliable and user-friendly.',
            },
            experience: [
              {
                id: generateId(),
                company: 'Tech Solutions Inc.',
                position: 'Senior Frontend Developer',
                startDate: '2020-01',
                endDate: 'Present',
                description:
                  '• Led a team of 5 developers to rebuild the core web application using React and TypeScript.\n• Improved application performance by 40% through code splitting and lazy loading.\n• Mentored junior developers and conducted code reviews.',
              },
              {
                id: generateId(),
                company: 'Web Innovations LLC',
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
                institution: 'University of Technology',
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
              themeColor: '#22C55E',
              language: 'en',
              isFreshGrad: false,
            },
          },
        }),
    }),
    {
      name: 'hash-resume-storage',
    }
  )
);
