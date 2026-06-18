import { Sticker, TeamCode } from '@/types'
import { useCollection } from '@/hooks'
import { TEAM_FLAGS } from '@/data/stickers'

interface StickerCardProps {
  sticker: Sticker
}

export function StickerCard({ sticker }: StickerCardProps) {
  const { isOwned, getDuplicates, toggle, addDuplicate, removeDuplicate } = useCollection()

  const owned = isOwned(sticker.id)
  const duplicates = getDuplicates(sticker.id)
  const flag = sticker.teamCode ? TEAM_FLAGS[sticker.teamCode as TeamCode] : null

  return (
    <div
      className={`
        relative rounded-xl border-2 p-2 flex flex-col items-center gap-1
        transition-colors duration-150 select-none
        ${owned ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}
      `}
    >
      {/* Flag ou ícone */}
      <span className="text-lg leading-none">
        {flag ?? (sticker.section === 'FWC' ? '🏆' : '🥤')}
      </span>

      {/* Código */}
      <span className="text-xs font-bold text-gray-700 leading-none">
        {sticker.id}
      </span>

      {/* Botão toggle */}
      <button
        onClick={() => toggle(sticker.id)}
        className={`
          w-full text-xs rounded-lg py-1 font-medium transition-colors mt-1
          ${owned
            ? 'bg-green-500 text-white hover:bg-red-400'
            : 'bg-gray-200 text-gray-600 hover:bg-green-400 hover:text-white'
          }
        `}
      >
        {owned ? '✓' : '+'}
      </button>

      {/* Controle de repetidas — ocupa espaço fixo sempre */}
      <div className="flex items-center gap-1 mt-0.5 h-5">
        {owned && (
          <>
            <button
              onClick={() => removeDuplicate(sticker.id)}
              className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-red-200 flex items-center justify-center"
            >
              −
            </button>
            <span className="text-xs font-bold text-yellow-600 min-w-4 text-center">
              {duplicates > 0 ? `+${duplicates}` : '0'}
            </span>
            <button
              onClick={() => addDuplicate(sticker.id)}
              className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-yellow-200 flex items-center justify-center"
            >
              +
            </button>
          </>
        )}
      </div>
    </div>
  )
}