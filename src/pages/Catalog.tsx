import React, { useMemo, useState } from 'react'
import { StickerCard } from '@/components/sticker'
import { useCollection } from '@/hooks'
import { ALL_STICKERS, TEAM_FLAGS } from '@/data/stickers'
import { GROUPS } from '@/constants/album'
import { TeamCode } from '@/types'
import { Search, X } from 'lucide-react'

type Filter = 'all' | 'owned' | 'missing' | 'duplicates'

export function Catalog() {
  const { isOwned, getDuplicates } = useCollection()
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('all')
  const [filter, setFilter] = useState<Filter>('all')

  // 1. Filtro base (Busca, Tenho, Faltam, Repetidas)
  const baseFilteredStickers = useMemo(() => {
    return ALL_STICKERS.filter((sticker) => {
      if (filter === 'owned' && !isOwned(sticker.id)) return false
      if (filter === 'missing' && isOwned(sticker.id)) return false
      if (filter === 'duplicates' && getDuplicates(sticker.id) === 0) return false
      if (search && !sticker.id.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, filter, isOwned, getDuplicates])

  // 2. Agrupamento em 2 níveis: Grupos -> Seleções -> Figurinhas
  const groupedStickers = useMemo(() => {
    // Monta a estrutura inicial vazia
    const structure = [
      {
        id: 'Especiais',
        label: 'Especiais',
        subGroups: [
          { id: 'FWC', label: '🏆 FWC', items: [] as typeof baseFilteredStickers }
        ]
      },
      {
        id: 'CocaCola',
        label: 'Coca-Cola',
        subGroups: [
          { id: 'CC', label: '🥤 CC', items: [] as typeof baseFilteredStickers }
        ]
      },
      ...GROUPS.map(g => ({
        id: g.label, // Ex: "Grupo A"
        label: g.label,
        subGroups: g.teams.map(teamCode => ({
          id: teamCode,
          label: `${TEAM_FLAGS[teamCode as TeamCode] || ''} ${teamCode}`,
          items: [] as typeof baseFilteredStickers
        }))
      }))
    ];

    // Distribui as figurinhas filtradas nos seus respectivos subgrupos
    baseFilteredStickers.forEach(sticker => {
      if (sticker.section === 'FWC') {
        structure[0].subGroups[0].items.push(sticker);
      } else if (sticker.section === 'CC') {
        structure[1].subGroups[0].items.push(sticker);
      } else if (sticker.teamCode) {
        // Procura o grupo que contém este time
        const group = structure.find(g => g.subGroups.some(sg => sg.id === sticker.teamCode));
        if (group) {
          const subGroup = group.subGroups.find(sg => sg.id === sticker.teamCode);
          if (subGroup) {
            subGroup.items.push(sticker);
          }
        }
      }
    });

    // 3. Aplica o filtro da seção ativa (botões superiores) e limpa o que ficou vazio
    let result = structure;
    
    if (activeSection !== 'all') {
      result = result.map(group => ({
        ...group,
        subGroups: group.subGroups.filter(sg => sg.id === activeSection)
      }));
    }

    // Remove subgrupos vazios e, em seguida, remove grupos que ficaram vazios
    return result
      .map(group => ({
        ...group,
        subGroups: group.subGroups.filter(sg => sg.items.length > 0)
      }))
      .filter(group => group.subGroups.length > 0)
      .map(group => {
        // Garante que as figurinhas dentro do time fiquem na ordem numérica certa
        group.subGroups.forEach(sg => {
          sg.items.sort((a, b) => a.number - b.number);
        });
        return group;
      });

  }, [baseFilteredStickers, activeSection]);

  // Contagem total para o rodapé do filtro
  const totalStickersCount = useMemo(() => {
    return groupedStickers.reduce((total, group) => {
      return total + group.subGroups.reduce((subTotal, sg) => subTotal + sg.items.length, 0);
    }, 0);
  }, [groupedStickers]);

  const specialSections = [
    { key: 'all', label: 'Todas' },
    { key: 'FWC', label: '🏆 FWC' },
    { key: 'CC', label: '🥤 CC' },
  ]

  return (
    <div className="flex flex-col">

      {/* Barra fixa de filtros (mantida inalterada) */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-3 shadow-sm space-y-2">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar figurinha... ex: BRA01"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {(['all', 'owned', 'missing', 'duplicates'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${filter === f ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {f === 'all' && 'Todas'}
              {f === 'owned' && '✅ Tenho'}
              {f === 'missing' && '❌ Faltam'}
              {f === 'duplicates' && '🔁 Repetidas'}
            </button>
          ))}
        </div>

        {/* Seções */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {specialSections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`
                shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${activeSection === s.key ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {s.label}
            </button>
          ))}

          <div className="shrink-0 w-px bg-gray-300 my-1" />

          {GROUPS.map((group) =>
            group.teams.map((teamCode) => (
              <button
                key={teamCode}
                onClick={() => setActiveSection(teamCode)}
                className={`
                  shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${activeSection === teamCode ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {TEAM_FLAGS[teamCode as TeamCode]} {teamCode}
              </button>
            ))
          )}
        </div>

        <p className="text-xs text-gray-400">
          {totalStickersCount} figurinha{totalStickersCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Área de Renderização com Hierarquia Dupla (Grupos > Seleções) */}
      <div className="p-4 space-y-12 pb-20">
        {groupedStickers.map(group => (
          <div key={group.id} className="space-y-6">
            
            {/* Título do Grupo Principal (ex: Grupo C) */}
            <div className="border-b-2 border-blue-900 pb-2">
              <h2 className="text-2xl font-black text-blue-900 tracking-tight">{group.label}</h2>
            </div>

            {/* Listagem das Seleções dentro do Grupo */}
            <div className="space-y-8">
              {group.subGroups.map(subGroup => (
                <div key={subGroup.id} id={subGroup.id} className="scroll-mt-32">
                  
                  {/* Cabeçalho da Seleção (ex: 🇧🇷 BRA) */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-700">{subGroup.label}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                      {subGroup.items.length} itens
                    </span>
                  </div>

                  {/* Grid de Figurinhas APENAS desta Seleção */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {subGroup.items.map(sticker => (
                      <StickerCard key={sticker.id} sticker={sticker} />
                    ))}
                  </div>
                  
                </div>
              ))}
            </div>

          </div>
        ))}

        {groupedStickers.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Nenhuma figurinha encontrada com os filtros atuais.
          </div>
        )}
      </div>

    </div>
  )
}