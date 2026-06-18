export interface PackOpeningResult {
  id: string
  openedAt: string
  inputCodes: string[]
  newStickers: string[]
  duplicateStickers: string[]
  invalidCodes: string[]
  summary: {
    total: number
    newCount: number
    duplicateCount: number
    invalidCount: number
  }
}