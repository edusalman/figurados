import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  CheckCircle2, 
  Files, 
  AlertOctagon, 
  History, 
  Trash2,
  X
} from 'lucide-react';
import { usePackOpener } from '@/hooks/usePackOpener';
import { usePackStore } from '@/store/usePackStore';
import { PackOpeningResult } from '@/types';

// Assumindo que os componentes UI existem conforme a estrutura de pastas.
// Caso a API deles seja um pouco diferente, você pode ajustar facilmente.
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PackOpener() {
  const [rawInput, setRawInput] = useState('');
  const [lastResult, setLastResult] = useState<PackOpeningResult | null>(null);
  
  const { openPack } = usePackOpener();
  const { history, clearHistory } = usePackStore();

  const handleOpenPack = () => {
    if (!rawInput.trim()) return;
    
    const result = openPack(rawInput);
    setLastResult(result);
    setRawInput(''); // Limpa o input após processar
  };

  const handleClearInput = () => {
    setRawInput('');
    setLastResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abrir Pacotes</h1>
          <p className="text-gray-500 text-sm">
            Cole ou digite os códigos das figurinhas (ex: FWC01, BRA10, CC04)
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card className="p-4 sm:p-6 shadow-sm border-gray-200">
        <div className="space-y-4">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Digite os códigos separados por vírgula, espaço ou quebra de linha..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handleClearInput}
              disabled={!rawInput && !lastResult}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            
            <Button 
              onClick={handleOpenPack}
              disabled={!rawInput.trim()}
              className="bg-blue-700 hover:bg-blue-800 text-white min-w-37.5"
            >
              <Package className="w-4 h-4 mr-2" />
              Abrir Pacote
            </Button>
          </div>
        </div>
      </Card>

      {/* Animated Result Section */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-blue-200 bg-blue-50/50 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🎉 Resultado do Pacote
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Novas */}
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Novas
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {lastResult.summary.newCount}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lastResult.newStickers.length > 0 ? (
                      lastResult.newStickers.map((code) => (
                        <span key={code} className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-xs rounded font-medium">
                          {code}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Nenhuma inédita</span>
                    )}
                  </div>
                </div>

                {/* Repetidas */}
                <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-yellow-700 flex items-center gap-2">
                      <Files className="w-4 h-4" /> Repetidas
                    </span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {lastResult.summary.duplicateCount}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lastResult.duplicateStickers.length > 0 ? (
                      lastResult.duplicateStickers.map((code, i) => (
                        <span key={`${code}-${i}`} className="px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded font-medium">
                          {code}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Nenhuma repetida</span>
                    )}
                  </div>
                </div>

                {/* Inválidas */}
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-red-700 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4" /> Inválidas
                    </span>
                    <Badge className="bg-red-100 text-red-800">
                      {lastResult.summary.invalidCount}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lastResult.invalidCodes.length > 0 ? (
                      lastResult.invalidCodes.map((code, i) => (
                        <span key={`invalid-${i}`} className="px-2 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium line-through">
                          {code}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Nenhuma inválida</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Histórico de Aberturas
          </h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Histórico
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 border-dashed">
            Nenhum pacote aberto recentemente.
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <Card key={record.id} className="p-4 border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 min-w-30">
                    {new Date(record.openedAt).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-gray-100 text-gray-700">
                      {record.summary.total} lidas
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3"/> {record.summary.newCount}
                  </span>
                  <span className="text-yellow-600 font-medium flex items-center gap-1">
                    <Files className="w-3 h-3"/> {record.summary.duplicateCount}
                  </span>
                  {record.summary.invalidCount > 0 && (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3"/> {record.summary.invalidCount}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}