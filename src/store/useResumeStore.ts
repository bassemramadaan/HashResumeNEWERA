import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { temporal } from "zundo";
import { nanoid } from "nanoid";
import debounce from "lodash.debounce";

// Debounced storage to prevent excessive writes
const debouncedStorage: Storage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: debounce((name: string, value: string) => {
    localStorage.setItem(name, value);
  }, 1000) as (name: string, value: string) => void,
  removeItem: (name: string) => localStorage.removeItem(name),
  clear: () => localStorage.clear(),
  key: (index: number) => localStorage.key(index),
  length: localStorage.length,
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
  certificateId?: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  nationality?: string;
  maritalStatus?: string;
  militaryStatus?: string;
  visaStatus?: string;
  drivingLicense?: string;
  birthDate?: string;
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

export type SectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

export type ResumeData = {
  personalInfo: PersonalInfo;
  coverLetter: CoverLetter;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  customSections?: unknown[];
  settings: {
    template:
      | "modern"
      | "classic"
      | "executive"
      | "minimal"
      | "timeline";
    themeColor: string;
    language: "en" | "ar" | "fr";
    isFreshGrad: boolean;
    sectionOrder: SectionId[];
    hiddenSections: SectionId[];
    fontSize?: "small" | "medium" | "large" | string;
    fontFamily?: string;
    marginSize?: "compact" | "normal" | "relaxed";
    sectionSpacing?: "compact" | "normal" | "relaxed";
    lineHeight?: "tight" | "normal" | "relaxed";
    customFontSize?: number;
    customLineHeight?: number;
    customSpacing?: number;
    customMargin?: number;
    showQRCode?: boolean;
    qrCodeType?: "linkedin" | "vcard" | "contact";
    inkFriendly?: boolean;
  };
  jobDescription: string;
  isPremium: boolean;
  isLocked?: boolean;
  unlockedName?: string;
  unlockedEmail?: string;
  unlockedSignature?: string;
};

export function getResumeSignature(data: ResumeData | Partial<ResumeData>): string {
  if (!data) return "";
  const parts = {
    personalInfo: JSON.stringify(data.personalInfo || {}),
    experience: (data.experience || []).map((e: { company: string; position: string; startDate: string; endDate: string; description: string }) => `${e.company}-${e.position}-${e.startDate}-${e.endDate}-${e.description}`),
    education: (data.education || []).map((e: { institution: string; degree: string; startDate: string; endDate: string; description: string }) => `${e.institution}-${e.degree}-${e.startDate}-${e.endDate}-${e.description}`),
    skills: data.skills || [],
    projects: (data.projects || []).map((p: { name: string; description: string; link: string }) => `${p.name}-${p.description}-${p.link}`),
    certifications: (data.certifications || []).map((c: Certification) => `${c.name}-${c.issuer}-${c.date}-${c.certificateId || ''}`),
    template: data.settings?.template || "",
    themeColor: data.settings?.themeColor || "",
  };
  return JSON.stringify(parts);
}

const defaultSectionOrder: SectionId[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

const initialData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    nationality: "",
    maritalStatus: "",
    militaryStatus: "",
    visaStatus: "",
    drivingLicense: "",
    birthDate: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  },
  coverLetter: {
    fullName: "",
    jobTitle: "",
    companyName: "",
    hiringManager: "",
    jobDescription: "",
    skills: "",
    generatedContent: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  settings: {
    template: "modern",
    themeColor: "#475569", // Neutral Slate
    language: "en",
    isFreshGrad: false,
    sectionOrder: defaultSectionOrder,
    hiddenSections: [],
    fontSize: "medium",
    fontFamily: "inter",
    marginSize: "normal",
    sectionSpacing: "normal",
    lineHeight: "normal",
    customFontSize: 100,
    customLineHeight: 100,
    customSpacing: 100,
    customMargin: 100,
    showQRCode: false,
    qrCodeType: "linkedin",
    inkFriendly: false,
  },
  jobDescription: "",
  isPremium: false,
  unlockedName: "",
  unlockedEmail: "",
  unlockedSignature: "",
};

type ResumeStore = {
  data: ResumeData;
  isHydrated: boolean;
  setHydrated: (isHydrated: boolean) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: Omit<Experience, "id">) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, "id">) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProject: (proj: Omit<Project, "id">) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (newProjects: Project[]) => void;
  duplicateProject: (id: string) => void;
  addCertification: (cert: Omit<Certification, "id">) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (newCerts: Certification[]) => void;
  duplicateCertification: (id: string) => void;
  setSettings: (settings: Partial<ResumeData["settings"]>) => void;
  updateSettings: (settings: Partial<ResumeData["settings"]>) => void;
  setJobDescription: (desc: string) => void;
  importFromLinkedIn: (linkedinData: unknown) => void;
  addSection: (sectionId: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  generateDescription: (
    type: "experience" | "education" | "project",
    id: string,
    prompt: string,
    language: string,
  ) => Promise<void>;
  generateGlobalSuggestions: (
    language: string,
  ) => Promise<{ suggestions: string[] }>;
  generateCoverLetter: (
    jobDescription: string,
    companyName: string,
    jobTitle: string,
    language: string,
    onStream: (text: string) => void,
  ) => Promise<void>;
  updateCoverLetter: (content: string | Partial<CoverLetter>) => void;
  checkATSCompatibility: (language: string) => Promise<unknown>;
  translateResume: (targetLanguage: string) => Promise<void>;
  unlockPremium: (
    name: string,
    email: string,
    signature: string,
  ) => Promise<boolean>;
  resetData: () => void;
  loadData: (data: ResumeData) => void;
  updateData: (data: ResumeData) => void;
  loadExampleData: () => void;
  lockResume: () => void;
  updateJobDescription: (jd: string) => void;
  focusedSection: string | null;
  setFocusedSection: (section: string | null) => void;
}

export const useResumeStore = create<ResumeStore>()(
  temporal(
    persist(
      (set) => ({
      data: initialData,
      isHydrated: false,
      isGeneratingText: false,
      isTranslating: false,
      isCheckingATS: false,
      isGeneratingMap: {},
      aiSuggestions: [],
      atsResult: null,
      focusedSection: null,

      setHydrated: (isHydrated) => set({ isHydrated }),
      setFocusedSection: (section) => set({ focusedSection: section }),
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),

        setSettings: (settings) =>
          set((state) => ({
            data: {
              ...state.data,
              settings: { ...state.data.settings, ...settings },
            },
          })),
        updateSettings: (settings) =>
          set((state) => ({
            data: {
              ...state.data,
              settings: { ...state.data.settings, ...settings },
            },
          })),
        setJobDescription: (desc) =>
          set((state) => ({
            data: { ...state.data, jobDescription: desc },
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
                hiddenSections: state.data.settings.hiddenSections.filter(
                  (id) => id !== sectionId,
                ),
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
         updateCoverLetter: (content) =>
           set((state) => {
             const current = state.data.coverLetter || {
               fullName: "",
               jobTitle: "",
               companyName: "",
               hiringManager: "",
               jobDescription: "",
               skills: "",
               generatedContent: "",
             };
             const merged = typeof content === "string" 
               ? { ...current, generatedContent: content }
               : { ...current, ...content };
             return {
               data: {
                 ...state.data,
                 coverLetter: merged,
               },
             };
           }),
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
              experience: state.data.experience.map((e) =>
                e.id === id ? { ...e, ...exp } : e,
              ),
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
              education: state.data.education.map((e) =>
                e.id === id ? { ...e, ...edu } : e,
              ),
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
              projects: state.data.projects.map((p) =>
                p.id === id ? { ...p, ...proj } : p,
              ),
            },
          })),
        removeProject: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.filter((p) => p.id !== id),
            },
          })),
        reorderProjects: (newProjects) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: newProjects,
            },
          })),
        duplicateProject: (id) =>
          set((state) => {
            const projectToDuplicate = state.data.projects.find(p => p.id === id);
            if (!projectToDuplicate) return {};
            return {
              data: {
                ...state.data,
                projects: [
                  ...state.data.projects,
                  { ...projectToDuplicate, id: nanoid() }
                ]
              }
            };
          }),
        addCertification: (cert) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: [
                ...state.data.certifications,
                { ...cert, id: nanoid() },
              ],
            },
          })),
        updateCertification: (id, cert) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: state.data.certifications.map((c) =>
                c.id === id ? { ...c, ...cert } : c,
              ),
            },
          })),
        removeCertification: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: state.data.certifications.filter(
                (c) => c.id !== id,
              ),
            },
          })),
        reorderCertifications: (newCerts) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: newCerts,
            },
          })),
        duplicateCertification: (id) =>
          set((state) => {
            const certToDuplicate = state.data.certifications.find(c => c.id === id);
            if (!certToDuplicate) return {};
            return {
              data: {
                ...state.data,
                certifications: [
                  ...state.data.certifications,
                  { ...certToDuplicate, id: nanoid() }
                ]
              }
            };
          }),
        updateJobDescription: (jd) =>
          set((state) => ({
            data: { ...state.data, jobDescription: jd },
          })),
        unlockPremium: async (name, email, signature) => {
          set((state) => ({
            data: { 
              ...state.data, 
              isPremium: true,
              unlockedName: name,
              unlockedEmail: email,
              unlockedSignature: signature,
            },
          }));
          return true;
        },
        lockResume: () =>
          set((state) => ({
            data: {
              ...state.data,
              isLocked: false,
            },
          })),
        resetData: () => set({ data: initialData }),
        loadData: (data) => set({ data }),
        updateData: (data) => set({ data }),
        loadExampleData: () =>
          set({
            data: {
              personalInfo: {
                fullName: "John Doe",
                jobTitle: "Senior Software Engineer",
                email: "john.doe@example.com",
                phone: "+1 234 567 8900",
                address: "New York, NY",
                linkedin: "", // Removed LinkedIn to lower ATS score
                github: "github.com/johndoe",
                portfolio: "johndoe.dev",
                summary: "", // Removed summary to lower ATS score
              },
              coverLetter: {
                fullName: "",
                jobTitle: "",
                companyName: "",
                hiringManager: "",
                jobDescription: "",
                skills: "",
                generatedContent: "",
              },
              experience: [
                {
                  id: nanoid(),
                  company: "Global Tech Solutions",
                  position: "Senior Frontend Developer",
                  startDate: "2020-01",
                  endDate: "Present",
                  description:
                    "Worked on the core web application using React and TypeScript.",
                },
                {
                  id: nanoid(),
                  company: "Innovate Systems LLC",
                  position: "Frontend Developer",
                  startDate: "2017-06",
                  endDate: "2019-12",
                  description:
                    "• Developed responsive web interfaces using HTML, CSS, and JavaScript.\n• Collaborated with designers to implement pixel-perfect UI components.\n• Integrated RESTful APIs to display dynamic content.",
                },
              ],
              education: [
                {
                  id: nanoid(),
                  institution: "State University of Technology",
                  degree: "Bachelor of Science in Computer Science",
                  startDate: "2013-09",
                  endDate: "2017-05",
                  description:
                    "Graduated with Honors. Relevant coursework: Data Structures, Algorithms, Web Development.",
                },
              ],
              skills: [
                "React",
                "TypeScript",
                "Node.js",
                "Tailwind CSS",
                "Git",
                "Agile Methodologies",
              ],
              projects: [
                {
                  id: nanoid(),
                  name: "E-commerce Platform",
                  description:
                    "A full-stack e-commerce platform built with MERN stack.",
                  link: "github.com/johndoe/ecommerce",
                },
              ],
              certifications: [
                {
                  id: nanoid(),
                  name: "AWS Certified Developer",
                  issuer: "Amazon Web Services",
                  date: "2021-08",
                  certificateId: "AWS-12345",
                },
              ],
              settings: {
                template: "modern",
                themeColor: "#2563EB",
                language: "en",
                isFreshGrad: false,
                sectionOrder: defaultSectionOrder,
                hiddenSections: [],
                customFontSize: 100,
                customLineHeight: 100,
                customSpacing: 100,
                customMargin: 100,
              },
              jobDescription: "",
              isPremium: false,
              unlockedName: "",
              unlockedEmail: "",
              unlockedSignature: "",
            },
          }),
      }),
      {
        name: "hash-resume-storage",
        storage: createJSONStorage(() => debouncedStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      },
    ),
  ),
);
