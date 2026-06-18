import { create } from 'zustand'

interface UIStore {
  searchQuery: string
  activeSection: string | null
  showOnlyMissing: boolean
  showOnlyDuplicates: boolean

  setSearchQuery: (query: string) => void
  setActiveSection: (section: string | null) => void
  toggleShowOnlyMissing: () => void
  toggleShowOnlyDuplicates: () => void
  resetFilters: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: '',
  activeSection: null,
  showOnlyMissing: false,
  showOnlyDuplicates: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveSection: (section) => set({ activeSection: section }),
  toggleShowOnlyMissing: () =>
    set((state) => ({ showOnlyMissing: !state.showOnlyMissing, showOnlyDuplicates: false })),
  toggleShowOnlyDuplicates: () =>
    set((state) => ({ showOnlyDuplicates: !state.showOnlyDuplicates, showOnlyMissing: false })),
  resetFilters: () =>
    set({ searchQuery: '', activeSection: null, showOnlyMissing: false, showOnlyDuplicates: false }),
}))