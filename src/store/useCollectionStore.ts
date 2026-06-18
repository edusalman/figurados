import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Collection, CollectionStats } from '@/types'
import { idbStorage } from './storage'
import { computeStats, createEmptyCollection } from '@/utils/statistics'

interface CollectionStore {
  collection: Collection
  stats: CollectionStats

  markOwned: (stickerId: string) => void
  markMissing: (stickerId: string) => void
  addDuplicate: (stickerId: string) => void
  removeDuplicate: (stickerId: string) => void
  bulkUpdate: (stickerIds: string[]) => void
  resetCollection: () => void
}

const emptyCollection = createEmptyCollection()

export const useCollectionStore = create<CollectionStore>()(
  persist(
    immer((set) => ({
      collection: emptyCollection,
      stats: computeStats(emptyCollection),

      markOwned: (stickerId) =>
        set((state) => {
          state.collection.stickers[stickerId] = {
            stickerId,
            owned: true,
            duplicates: 0,
            addedAt: new Date().toISOString(),
          }
          state.stats = computeStats(state.collection)
          state.collection.updatedAt = new Date().toISOString()
        }),

      markMissing: (stickerId) =>
        set((state) => {
          delete state.collection.stickers[stickerId]
          state.stats = computeStats(state.collection)
          state.collection.updatedAt = new Date().toISOString()
        }),

      addDuplicate: (stickerId) =>
        set((state) => {
          const s = state.collection.stickers[stickerId]
          if (s?.owned) {
            s.duplicates += 1
          } else {
            state.collection.stickers[stickerId] = {
              stickerId,
              owned: true,
              duplicates: 1,
              addedAt: new Date().toISOString(),
            }
          }
          state.stats = computeStats(state.collection)
          state.collection.updatedAt = new Date().toISOString()
        }),

      removeDuplicate: (stickerId) =>
        set((state) => {
          const s = state.collection.stickers[stickerId]
          if (s && s.duplicates > 0) {
            s.duplicates -= 1
          }
          state.stats = computeStats(state.collection)
          state.collection.updatedAt = new Date().toISOString()
        }),

      bulkUpdate: (stickerIds) =>
        set((state) => {
          stickerIds.forEach((id) => {
            const existing = state.collection.stickers[id]
            if (existing?.owned) {
              existing.duplicates += 1
            } else {
              state.collection.stickers[id] = {
                stickerId: id,
                owned: true,
                duplicates: 0,
                addedAt: new Date().toISOString(),
              }
            }
          })
          state.stats = computeStats(state.collection)
          state.collection.updatedAt = new Date().toISOString()
        }),

      resetCollection: () =>
        set((state) => {
          const fresh = createEmptyCollection()
          state.collection = fresh
          state.stats = computeStats(fresh)
        }),
    })),
    { 
      name: 'figurados-collection',
      storage: createJSONStorage(() => idbStorage),
    }
  )
)