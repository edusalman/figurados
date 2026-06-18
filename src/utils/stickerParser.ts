import { STICKERS_MAP } from '@/data/stickers'

export function parseInputCodes(rawInput: string): string[] {
  return rawInput
    .split(/[\n,\s]+/)
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
}

export function validateCode(code: string): boolean {
  return STICKERS_MAP.has(code)
}