import { create } from 'zustand'

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthState {
  user: UserProfile | null
  signOut: () => void
  signIn: (user: UserProfile) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signOut: () => set({ user: null }),
  signIn: (user) => set({ user }),
}))
