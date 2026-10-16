import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Target,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  MessageCircle,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Property, ClientVIP } from '../../types';
import {
  PIPELINE_STAGES,
  formatCurrency,
  formatCompactCurrency,
} from '../../data/crmData';

interface CrmDashboardProps {
  properties: Property[];
  clients: ClientVIP[];
  onOpenClientDetail: (client: ClientVIP) => void;
  onOpenPropertyDetail: (property: Property) => void;
  onGoToPipeline: () => void;
  onGoToSmartMatch: () => void;
  onDirectWhatsApp: (client: ClientVIP) => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  properties,
  clients,
  onOpenClientDetail,
  onOpenPropertyDetail,
  onGoToPipeline,
  onGoToSmartMatch,
  onDirectWhatsApp,
}) => {
  // Financial Calculations
  const totalVGV = clients.reduce((acc, c) => acc + c.estimatedDealValue, 0);
  const avgTicket = clients.length > 0 ? totalVGV / clients.length : 0;
  const totalExpectedCommission = clients.reduce((acc, c) => acc + c.expectedCommission, 0);
  const totalPortfolioValue = properties.reduce((acc, p) => acc + p.price, 0);

  // Conversion rate (clients in proposal or closing vs total leads)
  const advancedClients = clients.filter(
    (c) => c.stage === 'proposta_due_diligence' || c.stage === 'fechamento_escritura'
  );
  const conversionRate = clients.length > 0 ? (advancedClients.length / clients.length) * 100 : 0;
  const websiteLeadsCount = clients.filter((c) =>
    c.tags?.some((t) => t.toLowerCase().includes('site'))
  ).length;

  // Stages Count & Volume
  const stageStats = PIPELINE_STAGES.map((stage) => {
    const stageClients = clients.filter((c) => c.stage === stage.id);
    const stageVGV = stageClients.reduce((acc, c) => acc + c.estimatedDealValue, 0);
    return {
      stage,
      count: stageClients.length,
      vgv: stageVGV,
    };
  });

  // Top Urgency / High Stakes Deals
  const urgentDeals = [...clients]
    .sort((a, b) => b.estimatedDealValue - a.estimatedDealValue)
    .slice(0, 4);

  // Neighborhood Breakdown
  const neighborhoodBreakdown = properties.reduce((acc, p) => {
    acc[p.neighborhood] = (acc[p.neighborhood] || 0) + p.price;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Executive Overview */}
      <div className="bg-gradient-to-r from-[#141414] via-[#111111] to-[#0c0c0c] border border-neutral-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8a24d]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
                ESTRATÉGIA COMERCIAL & RESULTADOS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-neutral-400 font-medium">Pipeline Ativo em Tempo Real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Painel de Performance High-End
            </h1>
            <p className="text-sm text-neutral-400 mt-1.5 max-w-2xl">
              Monitoramento estratégico de VGV sob gestão, comissões de corretagem e cruzamento de ativos off-market.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToSmartMatch}
              className="flex items-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs tracking-wider uppercase px-5 py-3 transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Executar Smart Match</span>
            </button>

            <button
              onClick={onGoToPipeline}
              className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-wider uppercase px-5 py-3 transition-colors cursor-pointer border border-neutral-700"
            >
              <Target className="w-4 h-4" />
              <span>Ver Kanban Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Main Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total VGV */}
        <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              VGV no Funil
            </span>
            <div className="p-2 rounded bg-amber-950/40 text-[#c8a24d] border border-[#c8a24d]/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCompactCurrency(totalVGV)}
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{clients.length} negociações</span>
              {websiteLeadsCount > 0 && (
                <span className="text-amber-400 font-semibold">• {websiteLeadsCount} do site</span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Ticket Médio */}
        <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Ticket Médio
            </span>
            <div className="p-2 rounded bg-sky-950/40 text-sky-400 border border-sky-800/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCompactCurrency(avgTicket)}
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs text-neutral-400">
              <span>Segmento Ultra High-End</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Comissões Previstas */}
        <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Comissões Previstas
            </span>
            <div className="p-2 rounded bg-purple-950/40 text-purple-400 border border-purple-800/30">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c8a24d] tracking-tight">
              {formatCompactCurrency(totalExpectedCommission)}
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs text-neutral-400">
              <span>Média 6% contratuais</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Portfólio Exclusivo */}
        <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Valor em Carteira
            </span>
            <div className="p-2 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCompactCurrency(totalPortfolioValue)}
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs text-neutral-400">
              <span>{properties.length} ativos exclusivos</span>
            </div>
          </div>
        </div>

        {/* Metric 5: Taxa de Conversão */}
        <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Taxa de Conversão
            </span>
            <div className="p-2 rounded bg-rose-950/40 text-rose-400 border border-rose-800/30">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-xs text-neutral-400">
              <span>{advancedClients.length} em fase final</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel Overview */}
      <div className="bg-[#111111] border border-neutral-800 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Distribuição do Pipeline por Estágio
            </h2>
            <p className="text-xs text-neutral-400">
              Volume financeiro e contagem de leads em cada etapa do funil
            </p>
          </div>
          <button
            onClick={onGoToPipeline}
            className="text-xs font-bold text-[#c8a24d] hover:underline uppercase tracking-wider cursor-pointer"
          >
            Abrir Pipeline →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {stageStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-neutral-800 p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-neutral-800">
                    {item.count} {item.count === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-neutral-200 leading-tight mb-2 min-h-[32px]">
                  {item.stage.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-neutral-800/80">
                <span className="text-xs font-extrabold text-[#c8a24d]">
                  {formatCompactCurrency(item.vgv)}
                </span>
                <div className="w-full bg-neutral-800 h-1.5 mt-2 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#c8a24d]"
                    style={{
                      width: totalVGV > 0 ? `${(item.vgv / totalVGV) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Urgent High-Stakes Deals & Portfolio Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Highest Stakes Deals */}
        <div className="lg:col-span-7 bg-[#111111] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-[#c8a24d]" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Negociações Estratégicas Prioritárias
                </h2>
              </div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Maior VGV
              </span>
            </div>

            <div className="space-y-4">
              {urgentDeals.map((client) => {
                const associatedProp = properties.find((p) => p.id === client.associatedPropertyId);
                const stageObj = PIPELINE_STAGES.find((s) => s.id === client.stage);

                return (
                  <div
                    key={client.id}
                    className="bg-[#171717] border border-neutral-800 p-4 sm:p-5 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <span className="text-sm font-bold text-white">
                          {client.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 border ${stageObj?.badgeBg}`}>
                          {stageObj?.title}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 mb-2 line-clamp-1">
                        {associatedProp ? `Interesse: ${associatedProp.title}` : `Perfil: ${client.profile} • ${client.preferredNeighborhoods.join(', ')}`}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                        <span className="font-bold text-[#c8a24d]">
                          VGV: {formatCurrency(client.estimatedDealValue)}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400">
                          Comissão: {formatCompactCurrency(client.expectedCommission)}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>Resp: {client.assignedBroker}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onDirectWhatsApp(client)}
                        className="p-2.5 bg-[#15803d]/20 hover:bg-[#15803d]/40 text-[#22c55e] border border-[#15803d]/40 transition-colors cursor-pointer"
                        title="Falar no WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenClientDetail(client)}
                        className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-700"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Mostrando os 4 maiores negócios em andamento
            </span>
            <button
              onClick={onGoToPipeline}
              className="text-xs font-bold text-[#c8a24d] hover:underline uppercase tracking-wider cursor-pointer"
            >
              Ver todos os {clients.length} clientes →
            </button>
          </div>
        </div>

        {/* Right Column: Portfolio Highlights & Neighborhood Distribution */}
        <div className="lg:col-span-5 space-y-8">
          {/* Neighborhood breakdown */}
          <div className="bg-[#111111] border border-neutral-800 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white tracking-tight mb-2">
              VGV por Região Nobre
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Concentração de patrimônio imobiliário sob gestão
            </p>

            <div className="space-y-4">
              {(Object.entries(neighborhoodBreakdown) as [string, number][]).map(([neighborhood, valNum], idx) => {
                const pct = totalPortfolioValue > 0 ? (valNum / totalPortfolioValue) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{neighborhood}</span>
                      <span className="font-extrabold text-[#c8a24d]">
                        {formatCompactCurrency(valNum)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c8a24d] to-[#e6ca7d]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Property Snapshot */}
          <div className="bg-[#111111] border border-neutral-800 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Destaque do Portfólio
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#c8a24d]/10 text-[#c8a24d] border border-[#c8a24d]/30">
                EXCLUSIVIDADE ATIVA
              </span>
            </div>

            {properties.length > 0 && (
              <div
                onClick={() => onOpenPropertyDetail(properties[0])}
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden aspect-video bg-neutral-900 mb-3 border border-neutral-800">
                  <img
                    src={properties[0].imageUrl}
                    alt={properties[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 text-[11px] font-bold text-[#c8a24d]">
                    {properties[0].code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-3 py-1 text-xs font-extrabold text-white">
                    {formatCurrency(properties[0].price)}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#c8a24d] transition-colors line-clamp-1">
                  {properties[0].title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {properties[0].areaM2}m² • {properties[0].suites} suítes • {properties[0].parkingSpots} vagas • {properties[0].neighborhood}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
