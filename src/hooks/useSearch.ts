import { useMemo } from 'react'
import { Sticker } from '@/types'
import { ALL_STICKERS } from '@/data/stickers'
import { useCollection } from './useCollection'
import { useUIStore } from '@/store'

export function useSearch() {
  const { searchQuery, activeSection, showOnlyMissing, showOnlyDuplicates } =
    useUIStore()
  const { isOwned, getDuplicates } = useCollection()

  const filtered = useMemo(() => {
    return ALL_STICKERS.filter((sticker: Sticker) => {
      if (activeSection && sticker.section !== activeSection) return false
      if (showOnlyMissing && isOwned(sticker.id)) return false
      if (showOnlyDuplicates && getDuplicates(sticker.id) === 0) return false
      if (searchQuery) {
        return sticker.id
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      }
      return true
    })
  }, [searchQuery, activeSection, showOnlyMissing, showOnlyDuplicates, isOwned, getDuplicates])

  return { filtered }
}