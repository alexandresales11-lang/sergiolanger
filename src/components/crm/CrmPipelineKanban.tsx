import React, { useState } from 'react';
import {
  MoreVertical,
  MessageCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  User,
  Building,
  Plus,
  Filter,
  CheckCircle,
  GripVertical,
  Move,
  Sparkles,
} from 'lucide-react';
import { ClientVIP, PipelineStageId, Property } from '../../types';
import {
  PIPELINE_STAGES,
  formatCurrency,
  formatCompactCurrency,
} from '../../data/crmData';

interface CrmPipelineKanbanProps {
  clients: ClientVIP[];
  properties: Property[];
  onUpdateClientStage: (clientId: string, newStage: PipelineStageId) => void;
  onOpenClientDetail: (client: ClientVIP) => void;
  onOpenNewLead: (prefillStage?: PipelineStageId) => void;
  onDirectWhatsApp: (client: ClientVIP) => void;
  onOpenLiveWhatsAppChat?: (client: ClientVIP) => void;
}

export const CrmPipelineKanban: React.FC<CrmPipelineKanbanProps> = ({
  clients,
  properties,
  onUpdateClientStage,
  onOpenClientDetail,
  onOpenNewLead,
  onDirectWhatsApp,
  onOpenLiveWhatsAppChat,
}) => {
  const [filterBroker, setFilterBroker] = useState<string>('todos');
  const [filterUrgency, setFilterUrgency] = useState<string>('todos');
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<PipelineStageId | null>(null);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    if (filterBroker !== 'todos' && c.assignedBroker !== filterBroker) return false;
    if (filterUrgency !== 'todos' && c.urgency !== filterUrgency) return false;
    return true;
  });

  const getNextStage = (current: PipelineStageId): PipelineStageId | null => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === current);
    if (idx < PIPELINE_STAGES.length - 1) {
      return PIPELINE_STAGES[idx + 1].id;
    }
    return null;
  };

  const getPrevStage = (current: PipelineStageId): PipelineStageId | null => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === current);
    if (idx > 0) {
      return PIPELINE_STAGES[idx - 1].id;
    }
    return null;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    setDraggedClientId(clientId);
    e.dataTransfer.setData('text/plain', clientId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedClientId(null);
    setDragOverStageId(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: PipelineStageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: PipelineStageId) => {
    // Only reset if we are actually leaving the container
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    if (dragOverStageId === stageId) {
      setDragOverStageId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: PipelineStageId) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('text/plain') || draggedClientId;
    if (clientId) {
      const client = clients.find((c) => c.id === clientId);
      if (client && client.stage !== stageId) {
        onUpdateClientStage(clientId, stageId);
      }
    }
    setDraggedClientId(null);
    setDragOverStageId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-neutral-800 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
              PIPELINE DE VENDAS VIP
            </span>
            <span className="text-xs text-neutral-400">
              • {filteredClients.length} Negociações Ativas
            </span>
            <span className="inline-flex items-center space-x-1.5 bg-[#c8a24d]/10 border border-[#c8a24d]/30 text-[#c8a24d] text-[11px] font-bold px-2 py-0.5 rounded">
              <Move className="w-3 h-3" />
              <span>Arraste os cards para mudar de etapa</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Funil Comercial de Alto Padrão
          </h1>
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-[#171717] border border-neutral-800 px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Corretor:</span>
            <select
              value={filterBroker}
              onChange={(e) => setFilterBroker(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-[#171717]">Todos</option>
              <option value="Sergio Langer" className="bg-[#171717]">Sergio Langer</option>
              <option value="Gabriel Santos" className="bg-[#171717]">Gabriel Santos</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-[#171717] border border-neutral-800 px-3 py-1.5 text-xs">
            <span className="text-neutral-400">Urgência:</span>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-[#171717]">Todas</option>
              <option value="Alta" className="bg-[#171717]">Alta</option>
              <option value="Média" className="bg-[#171717]">Média</option>
              <option value="Discreta / Sem Pressa" className="bg-[#171717]">Discreta</option>
            </select>
          </div>

          <button
            onClick={() => onOpenNewLead('lead_recebido')}
            className="flex items-center space-x-1.5 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs tracking-wider uppercase px-4 py-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Lead</span>
          </button>
        </div>
      </div>

      {/* 6 Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage, sIdx) => {
          const stageClients = filteredClients.filter((c) => c.stage === stage.id);
          const stageVGV = stageClients.reduce((acc, c) => acc + c.estimatedDealValue, 0);
          const isOver = dragOverStageId === stage.id;
          const isDraggingAny = draggedClientId !== null;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`bg-[#111111] border transition-all duration-200 flex flex-col min-w-[280px] xl:min-w-0 ${
                isOver
                  ? 'border-[#c8a24d] shadow-[0_0_20px_rgba(200,162,77,0.2)] bg-[#17140e]'
                  : isDraggingAny
                  ? 'border-neutral-700/80 hover:border-neutral-600'
                  : 'border-neutral-800'
              }`}
            >
              {/* Column Header */}
              <div
                className={`p-3.5 border-b transition-colors ${
                  isOver ? 'border-[#c8a24d]/60 bg-[#1e1910]' : 'border-neutral-800 bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {stage.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                    {stageClients.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>VGV da Etapa:</span>
                  <span className="font-extrabold text-[#c8a24d]">
                    {formatCompactCurrency(stageVGV)}
                  </span>
                </div>
              </div>

              {/* Column Body / Cards List */}
              <div className="p-3 space-y-3 min-h-[520px] flex flex-col relative">
                {/* Drop indicator prompt when hovered */}
                {isOver && isDraggingAny && (
                  <div className="p-3 border-2 border-dashed border-[#c8a24d] bg-[#c8a24d]/10 text-[#c8a24d] text-xs font-bold flex items-center justify-center space-x-2 animate-pulse rounded">
                    <span>✦ Soltar lead em {stage.title}</span>
                  </div>
                )}

                {stageClients.length === 0 ? (
                  <div
                    className={`flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed text-xs transition-colors ${
                      isOver
                        ? 'border-[#c8a24d]/50 bg-[#c8a24d]/5 text-[#c8a24d]'
                        : 'border-neutral-800 text-neutral-600'
                    }`}
                  >
                    {isOver ? 'Solte o lead aqui' : 'Nenhum lead nesta etapa'}
                  </div>
                ) : (
                  stageClients.map((client) => {
                    const prop = properties.find((p) => p.id === client.associatedPropertyId);
                    const prevStage = getPrevStage(client.stage);
                    const nextStage = getNextStage(client.stage);
                    const isBeingDragged = draggedClientId === client.id;

                    return (
                      <div
                        key={client.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, client.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-[#181818] border transition-all duration-200 shadow-sm group flex flex-col justify-between cursor-grab active:cursor-grabbing select-none ${
                          isBeingDragged
                            ? 'opacity-40 scale-95 border-dashed border-[#c8a24d] bg-[#221c10]'
                            : 'border-neutral-800 hover:border-neutral-600 hover:shadow-md'
                        }`}
                      >
                        {/* Top: Drag Handle, Client Name & Urgency */}
                        <div className="p-4 pb-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-start space-x-1.5 flex-1 min-w-0">
                              <GripVertical
                                className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#c8a24d] shrink-0 mt-0.5 transition-colors"
                                title="Arraste para mover de etapa"
                              />
                              <h3
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenClientDetail(client);
                                }}
                                className="text-sm font-bold text-white hover:text-[#c8a24d] cursor-pointer transition-colors leading-tight truncate"
                              >
                                {client.name}
                              </h3>
                            </div>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider shrink-0 ${
                                client.urgency === 'Alta'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                  : client.urgency === 'Média'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                              }`}
                            >
                              {client.urgency}
                            </span>
                          </div>

                          {/* Profile & Property Match */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pl-5">
                            <div className="text-[11px] text-neutral-400 flex items-center space-x-1">
                              <User className="w-3 h-3 text-neutral-500 shrink-0" />
                              <span className="truncate">{client.profile}</span>
                            </div>
                            {client.tags?.some((t) => t.toLowerCase().includes('site')) && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#c8a24d]/20 text-[#c8a24d] border border-[#c8a24d]/40 rounded">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Lead do Site</span>
                              </span>
                            )}
                          </div>

                          {prop && (
                            <div className="bg-[#121212] border border-neutral-800/80 p-2 mb-2.5 flex items-center space-x-2">
                              <Building className="w-3 h-3 text-[#c8a24d] shrink-0" />
                              <span className="text-[11px] font-semibold text-neutral-300 truncate">
                                {prop.code}: {prop.neighborhood}
                              </span>
                            </div>
                          )}

                          {/* Deal Financials */}
                          <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-400">VGV Est.:</span>
                              <span className="font-extrabold text-[#c8a24d]">
                                {formatCompactCurrency(client.estimatedDealValue)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Comissão (6%):</span>
                              <span className="font-bold text-neutral-300">
                                {formatCompactCurrency(client.expectedCommission)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Quick Actions & Stage Transition Arrows */}
                        <div className="p-4 pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between">
                          {/* WhatsApp Direct */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenLiveWhatsAppChat) {
                                  onOpenLiveWhatsAppChat(client);
                                } else {
                                  onDirectWhatsApp(client);
                                }
                              }}
                              className="p-1.5 bg-[#15803d]/20 hover:bg-[#15803d]/40 text-[#22c55e] border border-[#15803d]/40 transition-colors cursor-pointer rounded"
                              title="Ver histórico e conversar no WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenClientDetail(client);
                              }}
                              className="px-2 py-1 text-[10px] font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer rounded"
                            >
                              Detalhes
                            </button>
                          </div>

                          {/* Stage Shift Arrows */}
                          <div className="flex items-center space-x-1">
                            {prevStage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateClientStage(client.id, prevStage);
                                }}
                                className="p-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer rounded"
                                title={`Mover para etapa anterior (${PIPELINE_STAGES.find((s) => s.id === prevStage)?.title})`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {nextStage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateClientStage(client.id, nextStage);
                                }}
                                className="p-1 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold transition-colors cursor-pointer rounded"
                                title={`Avançar para ${PIPELINE_STAGES.find((s) => s.id === nextStage)?.title}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {!nextStage && (
                              <span className="p-1 text-emerald-400" title="Negócio Concluído">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Add Lead Quick Button at Bottom of Column */}
                <button
                  onClick={() => onOpenNewLead(stage.id)}
                  className="w-full py-2 border border-dashed border-neutral-800 hover:border-neutral-700 text-neutral-500 hover:text-neutral-300 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer mt-auto"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo lead nesta etapa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
