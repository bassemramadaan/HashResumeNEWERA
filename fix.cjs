const fs = require('fs');
let file = "src/store/useResumeStore.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
`  duplicateCertification: (id: string) => void;
            },
          })),
        importFromLinkedIn: (linkedinData) =>`,
`  duplicateCertification: (id: string) => void;
  setSettings: (settings: Partial<ResumeData["settings"]>) => void;
  setJobDescription: (desc: string) => void;
  importFromLinkedIn: (linkedinData: any) => void;
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
  ) => Promise<{ suggestions: any[] }>;
  generateCoverLetter: (
    jobDescription: string,
    companyName: string,
    jobTitle: string,
    language: string,
    onStream: (text: string) => void,
  ) => Promise<void>;
  updateCoverLetter: (content: string) => void;
  checkATSCompatibility: (language: string) => Promise<any>;
  translateResume: (targetLanguage: string) => Promise<void>;
  unlockPremium: (
    name: string,
    email: string,
    signature: string,
  ) => Promise<boolean>;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      data: initialState,
      isHydrated: false,
      isGeneratingText: false,
      isTranslating: false,
      isCheckingATS: false,
      isGeneratingMap: {},
      aiSuggestions: [],
      atsResult: null,

      setHydrated: (isHydrated) => set({ isHydrated }),
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),
        importFromLinkedIn: (linkedinData) =>`
);

let missingImplementation = `
        duplicateCertification: (id) =>
          set((state) => {
            const certToDuplicate = state.data.certifications.find(
              (c) => c.id === id,
            );
            if (!certToDuplicate) return state;
            return {
              data: {
                ...state.data,
                certifications: [
                  ...state.data.certifications,
                  { ...certToDuplicate, id: crypto.randomUUID() },
                ],
              },
            };
          }),
        setSettings: (settings) =>
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
`;
content = content.replace(
  `        importFromLinkedIn: (linkedinData)`,
  missingImplementation + "\n        importFromLinkedIn: (linkedinData)"
);

fs.writeFileSync(file, content);
