import { create } from 'zustand'

interface AuthState {
  user: any | null
  signOut: () => void
  signIn: (user: any) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signOut: () => set({ user: null }),
  signIn: (user) => set({ user }),
}))
