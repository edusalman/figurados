import { Collection, CollectionStats } from '@/types'
import { ALL_STICKERS, STICKERS_BY_SECTION } from '@/data/stickers'

export function computeStats(collection: Collection): CollectionStats {
  const stickers = collection.stickers

  const owned = Object.values(stickers).filter((s) => s.owned).length
  const duplicates = Object.values(stickers).reduce(
    (acc, s) => acc + (s.owned ? s.duplicates : 0),
    0
  )

  const bySection: CollectionStats['bySection'] = {}

  Object.entries(STICKERS_BY_SECTION).forEach(([section, list]) => {
    const total = list.length
    const sectionOwned = list.filter((s) => stickers[s.id]?.owned).length
    bySection[section] = {
      total,
      owned: sectionOwned,
      completionPct: Math.round((sectionOwned / total) * 100),
    }
  })

  return {
    total: ALL_STICKERS.length,
    owned,
    missing: ALL_STICKERS.length - owned,
    duplicates,
    completionPct: Math.round((owned / ALL_STICKERS.length) * 100),
    bySection,
  }
}

export function createEmptyCollection(): Collection {
  return {
    id: crypto.randomUUID(),
    stickers: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}