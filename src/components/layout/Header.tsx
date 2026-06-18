import { Trophy } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-blue-900 text-white px-4 py-3 flex items-center gap-3 shadow-md">
      <Trophy className="w-6 h-6 text-yellow-400" />
      <div>
        <h1 className="text-base font-bold leading-tight">Figurados</h1>
        <p className="text-xs text-blue-200 leading-tight">Copa do Mundo 2026</p>
      </div>
    </header>
  )
}