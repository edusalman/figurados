import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Files, 
  Download,
  FileText,
  Share2,
  X,
  Copy
} from 'lucide-react';
import { useCollectionStore } from '@/store/useCollectionStore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

// Importações dos dados base
import { ALL_STICKERS, TEAM_FLAGS } from '@/data/stickers';
import { GROUPS } from '@/constants/album';
import { Sticker, TeamCode } from '@/types';

// Componentes UI genéricos
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

// Tipo auxiliar para a hierarquia
type HierarchicalGroup = {
  groupLabel: string;
  teams: {
    id: string;
    label: string;
    items: Sticker[];
  }[];
};

export default function Stats() {
  const { stats, collection } = useCollectionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [optStats, setOptStats] = useState(true);
  const [optMissing, setOptMissing] = useState(true);
  const [optDuplicates, setOptDuplicates] = useState(true);

  // Lógica de agrupamento por Grupos -> Seleções (Mantendo a ordem do Álbum)
  const buildHierarchicalData = (isMissingTarget: boolean): HierarchicalGroup[] => {
    const result: HierarchicalGroup[] = [];

    const processTeam = (teamCode: string, sectionCode?: string) => {
      const items = ALL_STICKERS.filter(s => {
        const isMatch = sectionCode ? s.section === sectionCode : s.teamCode === teamCode;
        if (!isMatch) return false;
        
        const state = collection.stickers[s.id];
        if (isMissingTarget) {
          return !state || !state.owned; // É faltante
        } else {
          return state && state.duplicates > 0; // É repetida
        }
      });
      // Ordena por número dentro do time
      return items.sort((a, b) => a.number - b.number);
    };

    // 1. Especiais e Coca-Cola
    const fwc = processTeam('FWC', 'FWC');
    const cc = processTeam('CC', 'CC');
    if (fwc.length > 0 || cc.length > 0) {
      const subGroups = [];
      if (fwc.length > 0) subGroups.push({ id: 'FWC', label: 'FWC', items: fwc });
      if (cc.length > 0) subGroups.push({ id: 'CC', label: 'CC', items: cc });
      result.push({ groupLabel: 'Especiais', teams: subGroups });
    }

    // 2. Grupos do Álbum (A até L)
    GROUPS.forEach(g => {
      const teams: HierarchicalGroup['teams'] = [];
      g.teams.forEach(teamCode => {
        const items = processTeam(teamCode);
        if (items.length > 0) {
          teams.push({ id: teamCode, label: teamCode, items });
        }
      });
      if (teams.length > 0) {
        result.push({ groupLabel: g.label, teams });
      }
    });

    return result;
  };

  const missingHierarchy = useMemo(() => buildHierarchicalData(true), [collection]);
  const duplicatesHierarchy = useMemo(() => buildHierarchicalData(false), [collection]);

  // Função para exportar o relatório em PDF (Com AutoTable para visual limpo)
  const handleExportPDF = () => {
    const doc = new jsPDF();
    let currentY = 20;
    
    // Título Principal
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text('Relatório do Álbum - Copa do Mundo 2026', 14, currentY);
    currentY += 15;

    // 1. Bloco de Estatísticas
    if (optStats) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Resumo Geral', 14, currentY);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Total', 'Coladas', 'Faltam', 'Repetidas', 'Progresso']],
        body: [[
          stats.total,
          stats.owned,
          stats.missing,
          stats.duplicates,
          `${stats.completionPct.toFixed(1)}%`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138] }
      });
      currentY = doc.lastAutoTable.finalY + 15;
    }

    // Função Auxiliar: Renderizar uma Tabela Agrupada (Faltantes ou Repetidas)
    const printHierarchicalTable = (title: string, data: HierarchicalGroup[], headColor: [number, number, number]) => {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      
      doc.setFontSize(14);
      doc.setTextColor(headColor[0], headColor[1], headColor[2]);
      doc.text(title, 14, currentY);
      
      if (data.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Nenhuma figurinha nesta categoria.', 14, currentY + 8);
        currentY += 15;
        return;
      }

      const tableBody: any[] = [];

      data.forEach(group => {
        // Linha de Cabeçalho do Grupo (Ex: "Grupo A") - Fundo Cinza
        tableBody.push([{
          content: group.groupLabel.toUpperCase(),
          colSpan: 2,
          styles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold', halign: 'center' }
        }]);

        // Linhas de Seleções dentro do Grupo
        group.teams.forEach(team => {
          const numbersStr = team.items.map(s => s.number.toString().padStart(2, '0')).join(', ');
          tableBody.push([
            { content: team.label, styles: { fontStyle: 'bold', cellWidth: 25, halign: 'center' } },
            { content: numbersStr, styles: { cellPadding: 3, lineHeightFactor: 1.5 } }
          ]);
        });
      });

      autoTable(doc, {
        startY: currentY + 5,
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2, textColor: [50, 50, 50] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' }
        }
      });
      
      currentY = doc.lastAutoTable.finalY + 15;
    };

    // 2. Tabela de Faltantes
    if (optMissing) {
      printHierarchicalTable('Preciso (Faltam)', missingHierarchy, [220, 38, 38]); // Vermelho
    }

    // 3. Tabela de Repetidas
    if (optDuplicates) {
      printHierarchicalTable('Tenho para Troca (Repetidas)', duplicatesHierarchy, [202, 138, 4]); // Amarelo
    }

    doc.save('meu-album-figurados.pdf');
    setIsModalOpen(false);
    toast.success('PDF gerado com sucesso!');
  };

  // Função para Copiar Formato de WhatsApp
  const handleCopyToWhatsApp = () => {
    let text = '*⚽ Álbum Copa 2026 - Minhas Figurinhas*\n\n';

    if (optStats) {
      text += `*Progresso:* ${stats.completionPct.toFixed(1)}%\n`;
      text += `*Faltam:* ${stats.missing} | *Repetidas:* ${stats.duplicates}\n\n`;
    }

    const appendHierarchicalText = (title: string, icon: string, data: HierarchicalGroup[]) => {
      text += `*${icon} ${title}:*\n`;
      
      if (data.length === 0) {
        text += 'Nenhuma.\n\n';
        return;
      }

      data.forEach(group => {
        text += `\n_${group.groupLabel}_\n`; // Nome do grupo em itálico (WhatsApp)
        
        group.teams.forEach(team => {
          const flag = TEAM_FLAGS[team.id as TeamCode] || (team.id === 'FWC' ? '🏆' : '🥤');
          const numbers = team.items.map(s => s.number.toString().padStart(2, '0')).join(', ');
          text += `${flag} *${team.label}:* ${numbers}\n`;
        });
      });
      text += '\n';
    };

    if (optMissing) appendHierarchicalText('PRECISO (Faltam)', '❌', missingHierarchy);
    if (optDuplicates) appendHierarchicalText('TENHO (Repetidas)', '🔁', duplicatesHierarchy);

    text += '_Gerado via App Figurados_';

    navigator.clipboard.writeText(text).then(() => {
      setIsModalOpen(false);
      toast.success('Copiado para a área de transferência!');
    }).catch(() => {
      toast.error('Erro ao copiar texto.');
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estatísticas</h1>
            <p className="text-gray-500 text-sm">
              Análise detalhada e relatórios para troca
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white w-full sm:w-auto"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Exportar Lista
        </Button>
      </div>

      {/* Visão Geral (Cards de Resumo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-600 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total do Álbum</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-green-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Figurinhas Coladas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.owned}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-red-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Faltam</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.missing}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-yellow-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Repetidas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.duplicates}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <Files className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Progresso Geral da Coleção
          </h2>
          <span className="text-xl font-bold text-blue-700">{stats.completionPct.toFixed(1)}%</span>
        </div>
        <ProgressBar progress={stats.completionPct} className="h-4 mt-4" />
      </Card>

      {/* Progresso por Seção */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Detalhamento por Seção
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(stats.bySection).map(([section, data]) => (
            <Card key={section} className="p-4 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {section === 'FWC' ? '🏆 FWC' : section === 'CC' ? '🥤 CC' : `${TEAM_FLAGS[section as TeamCode] || ''} ${section}`}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {data.completionPct.toFixed(0)}%
                </span>
              </div>
              <ProgressBar progress={data.completionPct} className="h-2 mb-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{data.owned} coladas</span>
                <span>{data.total - data.owned} faltam</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Exportação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Exportar Relatório</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Selecione o que você deseja incluir na sua lista para compartilhar com amigos:
            </p>

            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  checked={optStats} 
                  onChange={(e) => setOptStats(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">Resumo de Estatísticas</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-red-100 bg-red-50/50 rounded-lg cursor-pointer hover:bg-red-50">
                <input 
                  type="checkbox" 
                  checked={optMissing} 
                  onChange={(e) => setOptMissing(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-500"
                />
                <span className="font-medium text-red-900">Figurinhas que Faltam</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-yellow-100 bg-yellow-50/50 rounded-lg cursor-pointer hover:bg-yellow-50">
                <input 
                  type="checkbox" 
                  checked={optDuplicates} 
                  onChange={(e) => setOptDuplicates(e.target.checked)}
                  className="w-5 h-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
                />
                <span className="font-medium text-yellow-900">Repetidas (Para Troca)</span>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleCopyToWhatsApp}
                disabled={!optStats && !optMissing && !optDuplicates}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 shadow-md"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar para WhatsApp
              </Button>
              
              <Button 
                onClick={handleExportPDF}
                disabled={!optStats && !optMissing && !optDuplicates}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 shadow-md"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}