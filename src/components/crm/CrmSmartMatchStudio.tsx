import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Building,
  User,
  CheckCircle2,
  TrendingUp,
  Percent,
  Send,
  Zap,
} from 'lucide-react';
import { Property, ClientVIP, SmartMatchItem } from '../../types';
import {
  calculateSmartMatches,
  formatCurrency,
  formatCompactCurrency,
} from '../../data/crmData';

interface CrmSmartMatchStudioProps {
  properties: Property[];
  clients: ClientVIP[];
  onOpenClientDetail: (client: ClientVIP) => void;
  onOpenPropertyDetail: (property: Property) => void;
  onSendSmartMatchWhatsApp: (match: SmartMatchItem) => void;
}

export const CrmSmartMatchStudio: React.FC<CrmSmartMatchStudioProps> = ({
  properties,
  clients,
  onOpenClientDetail,
  onOpenPropertyDetail,
  onSendSmartMatchWhatsApp,
}) => {
  const [minScore, setMinScore] = useState<number>(60);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('todos');

  const allMatches = calculateSmartMatches(properties, clients);

  const filteredMatches = allMatches.filter((m) => {
    if (m.matchScore < minScore) return false;
    if (selectedPropertyId !== 'todos' && m.property.id !== selectedPropertyId) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#171717] via-[#141414] to-[#0d0d0d] border border-neutral-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MOTOR DE INTELIGÊNCIA COMERCIAL</span>
              </span>
              <span className="bg-[#c8a24d]/10 text-[#c8a24d] text-[10px] font-bold px-2 py-0.5 border border-[#c8a24d]/30">
                CRUZAMENTO OFF-MARKET
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Smart Match: Imóvel ⇄ Comprador VIP
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Cruzamento algorítmico em tempo real entre ativos cadastrados e perfis de liquidez da base de compradores.
            </p>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-[#1c1c1c] border border-neutral-800 px-3.5 py-2 text-xs">
              <span className="text-neutral-400">Filtrar por Imóvel:</span>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="todos" className="bg-[#171717]">Todos os Imóveis ({properties.length})</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#171717]">
                    {p.code} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-[#1c1c1c] border border-neutral-800 px-3.5 py-2 text-xs">
              <span className="text-neutral-400">Match Mínimo:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="bg-transparent text-[#c8a24d] font-bold focus:outline-none cursor-pointer"
              >
                <option value={50} className="bg-[#171717]">≥ 50% de afinidade</option>
                <option value={70} className="bg-[#171717]">≥ 70% de afinidade (Alto)</option>
                <option value={85} className="bg-[#171717]">≥ 85% de afinidade (Perfeito)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Match Results List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-[#111111] border border-neutral-800 p-12 text-center flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-neutral-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            Nenhum cruzamento encontrado para este filtro
          </h3>
          <p className="text-xs text-neutral-400 max-w-md">
            Tente diminuir a pontuação mínima de compatibilidade ou cadastrar novos compradores e propriedades.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match, idx) => (
            <div
              key={idx}
              className="bg-[#111111] border border-neutral-800 hover:border-neutral-700 p-5 sm:p-6 transition-all shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Score Badge & Property Summary */}
                <div className="lg:col-span-4 flex items-start space-x-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded bg-[#181818] border border-[#c8a24d]/40 shrink-0 text-center">
                    <span className="text-lg font-extrabold text-[#c8a24d] leading-none">
                      {match.matchScore}%
                    </span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase mt-1">
                      Match
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-[#c8a24d] mb-0.5">
                      <Building className="w-3.5 h-3.5" />
                      <span>{match.property.code} • {match.property.neighborhood}</span>
                    </div>
                    <h3
                      onClick={() => onOpenPropertyDetail(match.property)}
                      className="text-sm font-bold text-white hover:text-[#c8a24d] cursor-pointer transition-colors line-clamp-1"
                    >
                      {match.property.title}
                    </h3>
                    <div className="text-xs font-extrabold text-white mt-1">
                      {formatCurrency(match.property.price)}
                    </div>
                  </div>
                </div>

                {/* Center: Client VIP Profile */}
                <div className="lg:col-span-4 pl-0 lg:pl-4 lg:border-l border-neutral-800">
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-neutral-400 mb-0.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Comprador Compatível</span>
                  </div>
                  <h3
                    onClick={() => onOpenClientDetail(match.client)}
                    className="text-sm font-bold text-white hover:text-[#c8a24d] cursor-pointer transition-colors"
                  >
                    {match.client.name}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1">
                    Orçamento: {formatCompactCurrency(match.client.targetBudgetMin)} - {formatCompactCurrency(match.client.targetBudgetMax)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    {match.client.liquidityStatus}
                  </div>
                </div>

                {/* Right: Smart Reasons & 1-Click Action */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    {match.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-start space-x-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                        <span className="leading-tight">{reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => onSendSmartMatchWhatsApp(match)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs py-2.5 px-4 transition-colors cursor-pointer shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Apresentar no WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onOpenPropertyDetail(match.property)}
                      className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer border border-neutral-700"
                    >
                      Ver Imóvel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
