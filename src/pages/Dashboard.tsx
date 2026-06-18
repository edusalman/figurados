import { useCollection } from '@/hooks'
import { ProgressBar, Card } from '@/components/ui'
import { TEAM_NAMES, TEAM_FLAGS } from '@/data/stickers'
import { TeamCode } from '@/types'
import { Trophy, Star, AlertCircle, Copy } from 'lucide-react'

export function Dashboard() {
  const { stats } = useCollection()

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">

      {/* Header Card */}
      <div className="rounded-xl p-5 text-white" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Meu Álbum</h2>
            <p className="text-sm text-blue-200">Copa do Mundo FIFA 2026</p>
          </div>
        </div>
        <ProgressBar
          value={stats.completionPct}
          size="lg"
          color="yellow"
          className="mb-2"
        />
        <div className="flex justify-between text-sm mt-1">
          <span className="text-blue-200">{stats.owned} de {stats.total} figurinhas</span>
          <span className="text-yellow-400 font-bold">{stats.completionPct}%</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <Star className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.owned}</p>
          <p className="text-xs text-gray-500 mt-1">Tenho</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.missing}</p>
          <p className="text-xs text-gray-500 mt-1">Faltam</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <Copy className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.duplicates}</p>
          <p className="text-xs text-gray-500 mt-1">Repetidas</p>
        </Card>
      </div>

      {/* Progresso por Seção Especial */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Seções Especiais</h3>
        <div className="space-y-3">
          {['FWC', 'CC'].map((section) => {
            const s = stats.bySection[section]
            if (!s) return null
            return (
              <div key={section}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">{section === 'FWC' ? '🏆 FWC' : '🥤 Coca-Cola'}</span>
                  <span>{s.owned}/{s.total}</span>
                </div>
                <ProgressBar
                  value={s.completionPct}
                  size="sm"
                  color={s.completionPct === 100 ? 'green' : 'blue'}
                />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Progresso por Seleção */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Progresso por Seleção</h3>
        <div className="space-y-3">
          {(Object.keys(TEAM_NAMES) as TeamCode[]).map((code) => {
            const s = stats.bySection[code]
            if (!s) return null
            return (
              <div key={code}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">
                    {TEAM_FLAGS[code]} {TEAM_NAMES[code]}
                  </span>
                  <span className={s.completionPct === 100 ? 'text-green-600 font-bold' : ''}>
                    {s.owned}/{s.total}
                    {s.completionPct === 100 && ' ✅'}
                  </span>
                </div>
                <ProgressBar
                  value={s.completionPct}
                  size="sm"
                  color={s.completionPct === 100 ? 'green' : 'blue'}
                />
              </div>
            )
          })}
        </div>
      </Card>

    </div>
  )
}