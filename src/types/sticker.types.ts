export type TeamCode =
  | 'ALG' | 'ARG' | 'AUS' | 'AUT' | 'BEL' | 'BIH' | 'BRA' | 'CAN'
  | 'CIV' | 'COD' | 'COL' | 'CPV' | 'CRO' | 'CUW' | 'CZE' | 'ECU'
  | 'EGY' | 'ENG' | 'ESP' | 'FRA' | 'GER' | 'GHA' | 'HAI' | 'IRN'
  | 'IRQ' | 'JOR' | 'JPN' | 'KOR' | 'KSA' | 'MAR' | 'MEX' | 'NED'
  | 'NOR' | 'NZL' | 'PAN' | 'PAR' | 'POR' | 'QAT' | 'RSA' | 'SCO'
  | 'SEN' | 'SUI' | 'SWE' | 'TUN' | 'TUR' | 'URU' | 'USA' | 'UZB'

export type StickerSection = 'FWC' | 'CC' | TeamCode

export type StickerType = 'special' | 'team' | 'coca-cola'

export interface Sticker {
  id: string
  section: StickerSection
  number: number
  teamCode?: TeamCode
  type: StickerType
  isSpecial: boolean
}