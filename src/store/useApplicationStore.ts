import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt: string;
}

interface ApplicationStore {
  applications: Application[];
  addApplication: (app: Omit<Application, "id" | "appliedAt">) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  removeApplication: (id: string) => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      applications: [],
      addApplication: (app) =>
        set((state) => ({
          applications: [
            ...state.applications,
            {
              ...app,
              id: crypto.randomUUID(),
              appliedAt: new Date().toISOString(),
            },
          ],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, status } : app,
          ),
        })),
      removeApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
    }),
    {
      name: "application-tracking-storage",
    },
  ),
);
