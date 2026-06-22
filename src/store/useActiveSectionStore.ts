import { create } from "zustand";

type ActiveSectionStore = {
  activeField: string | null; // e.g., 'fullName', 'email', 'phone', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'
  setActiveField: (field: string | null) => void;
};

export const useActiveSectionStore = create<ActiveSectionStore>((set) => ({
  activeField: null,
  setActiveField: (field) => set({ activeField: field }),
}));
