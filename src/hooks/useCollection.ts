import { useCollectionStore } from '@/store'

export function useCollection() {
  const { collection, stats, markOwned, markMissing, addDuplicate, removeDuplicate } =
    useCollectionStore()

  const isOwned = (stickerId: string) =>
    !!collection.stickers[stickerId]?.owned

  const getDuplicates = (stickerId: string) =>
    collection.stickers[stickerId]?.duplicates ?? 0

  const toggle = (stickerId: string) => {
    if (isOwned(stickerId)) {
      markMissing(stickerId)
    } else {
      markOwned(stickerId)
    }
  }

  return {
    collection,
    stats,
    isOwned,
    getDuplicates,
    toggle,
    markOwned,
    markMissing,
    addDuplicate,
    removeDuplicate,
  }
}