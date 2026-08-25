import React, { useState } from 'react';
import {
  Users,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ClientVIP, PipelineStageId, Property } from '../../types';
import {
  PIPELINE_STAGES,
  formatCurrency,
  formatCompactCurrency,
} from '../../data/crmData';

interface CrmClientsListProps {
  clients: ClientVIP[];
  properties: Property[];
  onOpenClientDetail: (client: ClientVIP) => void;
  onOpenNewLead: () => void;
  onDirectWhatsApp: (client: ClientVIP) => void;
  onOpenLiveWhatsAppChat?: (client: ClientVIP) => void;
  onUpdateClientStage: (clientId: string, stage: PipelineStageId) => void;
}

export const CrmClientsList: React.FC<CrmClientsListProps> = ({
  clients,
  properties,
  onOpenClientDetail,
  onOpenNewLead,
  onDirectWhatsApp,
  onOpenLiveWhatsAppChat,
  onUpdateClientStage,
}) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('todos');
  const [profileFilter, setProfileFilter] = useState('todos');

  const filteredClients = clients.filter((c) => {
    if (stageFilter !== 'todos' && c.stage !== stageFilter) return false;
    if (profileFilter !== 'todos' && c.profile !== profileFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.preferredNeighborhoods.some((n) => n.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-neutral-800 p-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
              BASE DE COMPRADORES & INVESTIDORES
            </span>
            <span className="text-xs text-neutral-400">
              • {filteredClients.length} Clientes Qualificados
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Carteira VIP & Gestão de Relacionamento
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou bairro..."
            className="bg-[#171717] border border-neutral-800 focus:border-[#c8a24d] text-white text-xs px-3.5 py-2 focus:outline-none placeholder:text-neutral-500 w-56"
          />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-[#171717] border border-neutral-800 text-white text-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Estágios</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <select
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
            className="bg-[#171717] border border-neutral-800 text-white text-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Perfis</option>
            <option value="Investidor Familiar">Investidor Familiar</option>
            <option value="Empresário / C-Level">Empresário / C-Level</option>
            <option value="Celebridade / Atleta">Celebridade / Atleta</option>
            <option value="Incorporador">Incorporador</option>
          </select>

          <button
            onClick={onOpenNewLead}
            className="flex items-center space-x-1.5 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs tracking-wider uppercase px-4 py-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Cliente VIP</span>
          </button>
        </div>
      </div>

      {/* Table / Card List */}
      <div className="bg-[#111111] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#161616] text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Cliente VIP / Contato</th>
                <th className="py-3.5 px-4">Perfil & Liquidez</th>
                <th className="py-3.5 px-4">Faixa de Busca & Bairros</th>
                <th className="py-3.5 px-4">VGV em Potencial</th>
                <th className="py-3.5 px-4">Etapa do Funil</th>
                <th className="py-3.5 px-4">Corretor</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredClients.map((client) => {
                const stageObj = PIPELINE_STAGES.find((s) => s.id === client.stage);
                return (
                  <tr
                    key={client.id}
                    className="hover:bg-[#151515] transition-colors"
                  >
                    {/* Name & Contact */}
                    <td className="py-4 px-4 sm:px-6">
                      <div
                        onClick={() => onOpenClientDetail(client)}
                        className="font-bold text-sm text-white hover:text-[#c8a24d] cursor-pointer transition-colors"
                      >
                        {client.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {client.phone} • {client.email}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {client.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-800 text-neutral-400 text-[10px] px-1.5 py-0.2 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Profile & Liquidity */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">
                        {client.profile}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-0.5">
                        {client.liquidityStatus}
                      </div>
                    </td>

                    {/* Target Budget & Locations */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-neutral-200">
                        {formatCompactCurrency(client.targetBudgetMin)} — {formatCompactCurrency(client.targetBudgetMax)}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                        {client.preferredNeighborhoods.join(', ')}
                      </div>
                    </td>

                    {/* VGV */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-[#c8a24d] text-sm">
                        {formatCurrency(client.estimatedDealValue)}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Comissão: {formatCompactCurrency(client.expectedCommission)}
                      </div>
                    </td>

                    {/* Stage Pill */}
                    <td className="py-4 px-4">
                      <select
                        value={client.stage}
                        onChange={(e) => onUpdateClientStage(client.id, e.target.value as PipelineStageId)}
                        className={`text-[11px] font-bold px-2 py-1 border cursor-pointer ${stageObj?.badgeBg}`}
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#111111] text-white">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Broker */}
                    <td className="py-4 px-4 font-semibold text-white">
                      {client.assignedBroker}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onOpenLiveWhatsAppChat && (
                          <button
                            onClick={() => onOpenLiveWhatsAppChat(client)}
                            className="px-2.5 py-1.5 bg-[#22c55e]/20 hover:bg-[#22c55e]/35 text-[#22c55e] border border-[#22c55e]/40 transition-colors cursor-pointer rounded flex items-center space-x-1 font-bold text-[11px]"
                            title="Ver histórico e conversar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                        <button
                          onClick={() => onOpenClientDetail(client)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-neutral-700 rounded"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
