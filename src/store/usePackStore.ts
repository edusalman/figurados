import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PackOpeningResult } from '@/types'
import { idbStorage } from './storage'

interface PackStore {
  history: PackOpeningResult[]
  addOpening: (result: PackOpeningResult) => void
  clearHistory: () => void
}

export const usePackStore = create<PackStore>()(
  persist(
    (set) => ({
      history: [],

      addOpening: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 50),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    { 
      name: 'figurados-packs',
      storage: createJSONStorage(() => idbStorage),
    }
  )
)