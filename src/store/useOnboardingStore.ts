import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  hasSeenOnboarding: boolean;
  startOnboarding: () => void;
  stopOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isActive: false,
      currentStep: 0,
      hasSeenOnboarding: false,
      startOnboarding: () => set({ isActive: true, currentStep: 0 }),
      stopOnboarding: () => set({ isActive: false }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      skipOnboarding: () => set({ isActive: false, hasSeenOnboarding: true }),
      resetOnboarding: () =>
        set({ isActive: true, currentStep: 0, hasSeenOnboarding: false }),
    }),
    {
      name: "hash-resume-onboarding",
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
    },
  ),
);
