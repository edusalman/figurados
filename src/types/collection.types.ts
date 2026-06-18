export interface StickerState {
  stickerId: string
  owned: boolean
  duplicates: number
  addedAt: string
}

export interface SectionStats {
  total: number
  owned: number
  completionPct: number
}

export interface CollectionStats {
  total: number
  owned: number
  missing: number
  duplicates: number
  completionPct: number
  bySection: Record<string, SectionStats>
}

export interface Collection {
  id: string
  userId?: string
  stickers: Record<string, StickerState>
  createdAt: string
  updatedAt: string
}