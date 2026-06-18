import { useCollectionStore, usePackStore } from '@/store'
import { parseInputCodes, validateCode } from '@/utils'
import { PackOpeningResult } from '@/types'

export function usePackOpener() {
  const { collection, bulkUpdate } = useCollectionStore()
  const { addOpening } = usePackStore()

  const openPack = (rawInput: string): PackOpeningResult => {
    const codes = parseInputCodes(rawInput)

    const newStickers: string[] = []
    const duplicateStickers: string[] = []
    const invalidCodes: string[] = []

    codes.forEach((code) => {
      if (!validateCode(code)) {
        invalidCodes.push(code)
        return
      }
      const isOwned = collection.stickers[code]?.owned
      if (isOwned) {
        duplicateStickers.push(code)
      } else {
        newStickers.push(code)
      }
    })

    const validCodes = [...newStickers, ...duplicateStickers]
    if (validCodes.length > 0) {
      bulkUpdate(validCodes)
    }

    const result: PackOpeningResult = {
      id: crypto.randomUUID(),
      openedAt: new Date().toISOString(),
      inputCodes: codes,
      newStickers,
      duplicateStickers,
      invalidCodes,
      summary: {
        total: codes.length,
        newCount: newStickers.length,
        duplicateCount: duplicateStickers.length,
        invalidCount: invalidCodes.length,
      },
    }

    addOpening(result)
    return result
  }

  return { openPack }
}