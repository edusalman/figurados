import { Sticker, TeamCode } from '@/types'
import { ALBUM, TEAM_NAMES, TEAM_FLAGS } from '@/constants/album'

// Gera as figurinhas FWC (FWC00 até FWC19)
function generateFWCStickers(): Sticker[] {
  return Array.from({ length: ALBUM.FWC_COUNT }, (_, i) => ({
    id: `FWC${String(i).padStart(2, '0')}`,
    section: 'FWC' as const,
    number: i,
    type: 'special' as const,
    isSpecial: true,
  }))
}

// Gera as figurinhas Coca-Cola (CC01 até CC14)
function generateCCStickers(): Sticker[] {
  return Array.from({ length: ALBUM.CC_COUNT }, (_, i) => ({
    id: `CC${String(i + 1).padStart(2, '0')}`,
    section: 'CC' as const,
    number: i + 1,
    type: 'coca-cola' as const,
    isSpecial: true,
  }))
}

// Gera as figurinhas de cada seleção (20 por time)
function generateTeamStickers(): Sticker[] {
  const teams = Object.keys(TEAM_NAMES) as TeamCode[]
  return teams.flatMap((teamCode) =>
    Array.from({ length: ALBUM.STICKERS_PER_TEAM }, (_, i) => ({
      id: `${teamCode}${String(i + 1).padStart(2, '0')}`,
      section: teamCode,
      number: i + 1,
      teamCode,
      type: 'team' as const,
      isSpecial: false,
    }))
  )
}

export const ALL_STICKERS: Sticker[] = [
  ...generateFWCStickers(),
  ...generateCCStickers(),
  ...generateTeamStickers(),
]

// Map para busca O(1) por id
export const STICKERS_MAP = new Map<string, Sticker>(
  ALL_STICKERS.map((s) => [s.id, s])
)

// Agrupa figurinhas por seção
export const STICKERS_BY_SECTION = ALL_STICKERS.reduce<
  Record<string, Sticker[]>
>((acc, sticker) => {
  const key = sticker.section as string
  if (!acc[key]) acc[key] = []
  acc[key].push(sticker)
  return acc
}, {})

// Re-exporta metadados dos times para uso nos componentes
export { TEAM_NAMES, TEAM_FLAGS }