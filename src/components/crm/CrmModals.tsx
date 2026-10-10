import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Mail,
  Building,
  User,
  Plus,
  Send,
  Lock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Maximize2,
  BedDouble,
  Car,
  FileText,
  Clock,
  DollarSign,
  Tag,
  Trash2,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  ClientVIP,
  Property,
  PipelineStageId,
  PropertyType,
  PropertyStatus,
  ClientInteraction,
} from '../../types';
import {
  PIPELINE_STAGES,
  formatCurrency,
  formatCompactCurrency,
} from '../../data/crmData';

// ==========================================
// 1. CLIENT DETAIL & TIMELINE MODAL
// ==========================================

interface ClientDetailModalProps {
  client: ClientVIP | null;
  properties: Property[];
  onClose: () => void;
  onUpdateStage: (clientId: string, stage: PipelineStageId) => void;
  onAddInteraction: (clientId: string, interaction: Omit<ClientInteraction, 'id'>) => void;
  onOpenWhatsApp: (client: ClientVIP) => void;
  onOpenLiveWhatsAppChat?: (client: ClientVIP) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  properties,
  onClose,
  onUpdateStage,
  onAddInteraction,
  onOpenWhatsApp,
  onOpenLiveWhatsAppChat,
}) => {
  const [newNote, setNewNote] = useState('');
  const [interactionType, setInteractionType] = useState<ClientInteraction['type']>('whatsapp');

  if (!client) return null;

  const associatedProp = properties.find((p) => p.id === client.associatedPropertyId);
  const stageObj = PIPELINE_STAGES.find((s) => s.id === client.stage);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    onAddInteraction(client.id, {
      date: dateStr,
      type: interactionType,
      author: 'Sergio Langer',
      content: newNote.trim(),
    });

    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
                {client.profile}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs text-neutral-400">Cadastrado em {client.createdAt}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {client.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 mt-2">
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>{client.phone}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>{client.email}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live WhatsApp Chat inside CRM */}
            {onOpenLiveWhatsAppChat && (
              <button
                onClick={() => onOpenLiveWhatsAppChat(client)}
                className="flex items-center space-x-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold text-xs py-2.5 px-4 uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-black text-black" />
                <span>Abrir Conversa WhatsApp</span>
              </button>
            )}

            <select
              value={client.stage}
              onChange={(e) => onUpdateStage(client.id, e.target.value as PipelineStageId)}
              className={`text-xs font-bold px-3 py-2 border cursor-pointer ${stageObj?.badgeBg}`}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#111111] text-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Column: Financial Qualification & Criteria */}
          <div className="lg:col-span-5 space-y-6">
            {/* Financial Card */}
            <div className="bg-[#161616] border border-neutral-800 p-5 space-y-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Qualificação Financeira
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Faixa de Investimento:</span>
                <span className="font-bold text-white">
                  {formatCompactCurrency(client.targetBudgetMin)} — {formatCompactCurrency(client.targetBudgetMax)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">VGV da Operação:</span>
                <span className="font-extrabold text-[#c8a24d]">
                  {formatCurrency(client.estimatedDealValue)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Comissão Prevista (6%):</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(client.expectedCommission)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800">
                <span className="text-neutral-400">Status de Liquidez:</span>
                <span className="font-semibold text-neutral-200">
                  {client.liquidityStatus}
                </span>
              </div>
            </div>

            {/* Criteria Preferences */}
            <div className="bg-[#161616] border border-neutral-800 p-5 space-y-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Critérios de Busca
              </span>

              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Bairros de Interesse:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.preferredNeighborhoods.map((n, idx) => (
                    <span key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-2 py-0.5 rounded">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-neutral-400 block mb-1">Tipologias Aceitas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.preferredTypes.map((t, idx) => (
                    <span key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {associatedProp && (
                <div className="pt-3 border-t border-neutral-800">
                  <span className="text-[11px] text-[#c8a24d] font-bold block mb-1">Imóvel Vinculado:</span>
                  <div className="text-xs font-semibold text-white">
                    {associatedProp.code}: {associatedProp.title} ({formatCompactCurrency(associatedProp.price)})
                  </div>
                </div>
              )}
            </div>

            {/* Confidential Notes */}
            <div className="bg-[#161616] border border-neutral-800 p-5">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Observações Confidenciais
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {client.notes}
              </p>
            </div>
          </div>

          {/* Right Column: Interaction Timeline & New Event Logger */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#c8a24d]" />
                  <span>Linha do Tempo & Histórico ({client.interactions.length})</span>
                </h3>

                {onOpenLiveWhatsAppChat && (
                  <button
                    onClick={() => onOpenLiveWhatsAppChat(client)}
                    className="text-[11px] text-[#22c55e] hover:text-[#4ade80] font-bold flex items-center space-x-1 cursor-pointer transition-colors bg-[#22c55e]/10 hover:bg-[#22c55e]/20 px-2.5 py-1 rounded border border-[#22c55e]/30"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ver Conversa Completa no WhatsApp</span>
                  </button>
                )}
              </div>

              {/* Interaction List */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                {client.interactions.map((int) => (
                  <div
                    key={int.id}
                    className="bg-[#161616] border border-neutral-800 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#c8a24d] uppercase tracking-wider">
                        {int.type === 'whatsapp' ? 'Mensagem WhatsApp' : int.type === 'call' ? 'Ligação Telefônica' : int.type === 'visit' ? 'Visita Técnica Presencial' : int.type === 'proposal' ? 'Minuta / Proposta' : 'Reunião'}
                      </span>
                      <span className="text-neutral-500">{int.date}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                      {int.content}
                    </p>
                    <div className="text-[10px] text-neutral-500 text-right">
                      Registrado por: {int.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Interaction Form */}
            <form onSubmit={handleAddNote} className="bg-[#161616] border border-neutral-800 p-4 space-y-3">
              <span className="text-xs font-bold text-white block">
                Registrar Nova Interação com o Cliente
              </span>

              <div className="flex items-center space-x-3">
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value as any)}
                  className="bg-[#202020] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="call">Ligação</option>
                  <option value="meeting">Reunião</option>
                  <option value="visit">Visita ao Imóvel</option>
                  <option value="proposal">Proposta Formal</option>
                  <option value="note">Anotação Interna</option>
                </select>

                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Resuma o que foi conversado ou combinado..."
                  className="flex-1 bg-[#202020] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2 focus:outline-none"
                />

                <button
                  type="submit"
                  className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PROPERTY DETAIL MODAL
// ==========================================

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onTriggerSmartMatch: (property: Property) => void;
  onShareWhatsApp: (property: Property) => void;
  onDeleteProperty?: (propertyId: string) => void;
  onUpdateStatus?: (propertyId: string, status: PropertyStatus) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onTriggerSmartMatch,
  onShareWhatsApp,
  onDeleteProperty,
  onUpdateStatus,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2 z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo & Badges */}
        <div className="relative aspect-[16/8] overflow-hidden bg-neutral-900 border border-neutral-800 mb-6">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.failed) {
                target.dataset.failed = 'true';
                target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
              }
            }}
          />
          <div className="absolute top-4 left-4 bg-black/90 px-3 py-1 text-xs font-extrabold text-[#c8a24d] border border-[#c8a24d]/30">
            {property.code}
          </div>
          <div className="absolute bottom-4 right-4 bg-black/90 px-4 py-2 text-lg sm:text-xl font-extrabold text-[#c8a24d]">
            {formatCurrency(property.price)}
          </div>
        </div>

        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase block">
                {property.type} • {property.neighborhood}, {property.city}
              </span>
              {onUpdateStatus && (
                <select
                  value={property.status}
                  onChange={(e) => onUpdateStatus(property.id, e.target.value as PropertyStatus)}
                  className="bg-[#1c1c1c] text-white text-xs border border-neutral-700 px-2 py-1 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="exclusividade">Exclusividade Ativa</option>
                  <option value="em_negociacao">Em Negociação</option>
                  <option value="vendido">Vendido</option>
                </select>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {property.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onTriggerSmartMatch(property)}
              className="flex items-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs py-2.5 px-4 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Match</span>
            </button>

            <button
              onClick={() => onShareWhatsApp(property)}
              className="flex items-center space-x-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs py-2.5 px-4 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ficha WhatsApp</span>
            </button>

            {onDeleteProperty && (
              <div>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center space-x-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 text-xs py-2.5 px-3 font-bold uppercase transition-colors cursor-pointer"
                    title="Remover imóvel do portfólio"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 bg-red-950 border border-red-700 p-1">
                    <span className="text-[11px] text-red-200 px-1 font-semibold">Confirmar?</span>
                    <button
                      onClick={() => {
                        onDeleteProperty(property.id);
                        onClose();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 font-extrabold cursor-pointer"
                    >
                      Sim, Excluir
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-2 py-1 cursor-pointer"
                    >
                      Não
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-neutral-800 text-center">
          <div className="bg-[#161616] p-3 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Área Útil</span>
            <span className="text-base font-extrabold text-white">{property.areaM2} m²</span>
          </div>
          <div className="bg-[#161616] p-3 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Suítes</span>
            <span className="text-base font-extrabold text-white">{property.suites}</span>
          </div>
          <div className="bg-[#161616] p-3 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Vagas</span>
            <span className="text-base font-extrabold text-white">{property.parkingSpots}</span>
          </div>
          <div className="bg-[#161616] p-3 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Condomínio / IPTU</span>
            <span className="text-xs font-bold text-neutral-300">
              {formatCompactCurrency(property.condoFee)} / {formatCompactCurrency(property.iptu)}
            </span>
          </div>
        </div>

        {/* Description & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Memorial Descritivo & Conceito
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {property.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Diferenciais & Acabamentos
              </h3>
              <div className="space-y-1.5">
                {property.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a24d] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confidential Owner Info */}
          <div className="bg-[#161616] border border-neutral-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[#c8a24d] font-bold text-xs uppercase tracking-wider mb-4">
                <Lock className="w-4 h-4" />
                <span>Dados Confidenciais do Proprietário</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 block">Nome / Representante:</span>
                  <span className="font-bold text-white text-sm">{property.owner.name}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block">Contato Direto:</span>
                  <span className="font-semibold text-neutral-200">{property.owner.phone} • {property.owner.email}</span>
                </div>

                <div className="pt-3 border-t border-neutral-800">
                  <span className="text-[#c8a24d] font-bold block mb-1">Diretrizes de Negociação:</span>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-[#1f1f1f] p-3 border border-neutral-700">
                    {property.owner.confidentialNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2.5 NEW PROPERTY MODAL (CADASTRO DE IMÓVEIS)
// ==========================================

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProperty: (property: Property) => void;
}

export const NewPropertyModal: React.FC<NewPropertyModalProps> = ({
  isOpen,
  onClose,
  onSaveProperty,
}) => {
  const [code, setCode] = useState(`SL-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Penthouse / Cobertura');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [price, setPrice] = useState(25000000);
  const [areaM2, setAreaM2] = useState(480);
  const [suites, setSuites] = useState(4);
  const [parkingSpots, setParkingSpots] = useState(5);
  const [condoFee, setCondoFee] = useState(12000);
  const [iptu, setIptu] = useState(65000);
  const [imageUrl, setImageUrl] = useState('/images/luxury_penthouse_terrace_1787618010460.jpg');
  const [status, setStatus] = useState<PropertyStatus>('exclusividade');
  const [description, setDescription] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('Piscina privativa aquecida, Vista 360 panorâmica, Automação Lutron, Segurança patrimonial blindada');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+55 11 9');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('Proprietário aceita ouvir proposta à vista. Não aceita permuta imobiliária fora de SP.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const highlights = highlightsInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      code: code.trim() || `SL-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      type,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      price: Number(price) || 0,
      areaM2: Number(areaM2) || 0,
      suites: Number(suites) || 0,
      parkingSpots: Number(parkingSpots) || 0,
      condoFee: Number(condoFee) || 0,
      iptu: Number(iptu) || 0,
      imageUrl: imageUrl.trim() || '/images/luxury_penthouse_terrace_1787618010460.jpg',
      status,
      description: description.trim() || `${type} exclusivo em ${neighborhood}, ${city}. Arquitetura autoral, acabamento ultra-premium e total discrição.`,
      highlights: highlights.length > 0 ? highlights : ['Acabamento de altíssimo padrão', 'Segurança máxima', 'Localização prime'],
      smartKeywords: [type.toLowerCase(), neighborhood.toLowerCase(), city.toLowerCase(), 'luxo', 'alto padrão', ...highlights.map((h) => h.toLowerCase())],
      owner: {
        name: ownerName.trim() || 'Proprietário Confidencial',
        phone: ownerPhone.trim() || '+55 11 99999-0000',
        email: ownerEmail.trim() || 'contato.offmarket@langer.com',
        confidentialNotes: confidentialNotes.trim() || 'Acesso sob NDA prévio.',
      },
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onSaveProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <Building2 className="w-5 h-5 text-[#c8a24d]" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
            Novo Ativo Imobiliário
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-6">
          Cadastrar Imóvel no Portfólio VIP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Identificação Básica */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Código / Ref *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: SL-105"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Título do Imóvel *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Penthouse Duplex com Vista 360°"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Seção 2: Tipologia, Status e Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Tipologia *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none cursor-pointer"
              >
                <option value="Penthouse / Cobertura">Penthouse / Cobertura</option>
                <option value="Mansão Urbana">Mansão Urbana</option>
                <option value="Fazenda / Campo">Fazenda / Campo</option>
                <option value="Branded Residence">Branded Residence</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Status Inicial *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none cursor-pointer"
              >
                <option value="exclusividade">Exclusividade Ativa</option>
                <option value="disponivel">Disponível</option>
                <option value="em_negociacao">Em Negociação</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Bairro *
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Jardins"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Cidade / UF *
              </label>
              <div className="flex space-x-1">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo"
                  className="w-3/4 bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-2.5 py-2.5 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="SP"
                  className="w-1/4 bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-2 py-2.5 text-center focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Valores & Metragem */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider block mb-1.5">
                Preço Pedido (R$) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={500000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Área Útil (m²) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Suítes *
              </label>
              <input
                type="number"
                required
                min={0}
                value={suites}
                onChange={(e) => setSuites(Number(e.target.value))}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Vagas
              </label>
              <input
                type="number"
                min={0}
                value={parkingSpots}
                onChange={(e) => setParkingSpots(Number(e.target.value))}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Condomínio / IPTU
              </label>
              <div className="flex space-x-1">
                <input
                  type="number"
                  placeholder="Cond."
                  value={condoFee}
                  onChange={(e) => setCondoFee(Number(e.target.value))}
                  className="w-1/2 bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-2 py-2.5 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="IPTU"
                  value={iptu}
                  onChange={(e) => setIptu(Number(e.target.value))}
                  className="w-1/2 bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-2 py-2.5 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Foto e URL */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              URL da Fotografia Principal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Ex: /images/luxury_penthouse_terrace_1787618010460.jpg ou link https://..."
                className="flex-1 bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setImageUrl('/images/luxury_penthouse_terrace_1787618010460.jpg')}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-3 py-2.5 font-semibold cursor-pointer"
              >
                Foto Penthouse
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('/images/luxury_mansion_jardins_1787618022912.jpg')}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-3 py-2.5 font-semibold cursor-pointer"
              >
                Foto Mansão
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('/images/luxury_country_estate_1787618039456.jpg')}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-3 py-2.5 font-semibold cursor-pointer"
              >
                Foto Campo
              </button>
            </div>
          </div>

          {/* Seção 5: Destaques & Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Diferenciais & Destaques (separados por vírgula)
              </label>
              <textarea
                rows={3}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Ex: Piscina privativa, Vista 360, Heliponto, Automação completa"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Memorial Descritivo do Imóvel
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a arquitetura, acabamento, vista e atributos exclusivos..."
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Seção 6: Informações Confidenciais do Proprietário (Off-Market) */}
          <div className="bg-[#171717] border border-neutral-800 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-[#c8a24d] text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Dados Confidenciais do Proprietário (Off-Market)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  Nome do Proprietário / Família
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ex: Família Fontes"
                  className="w-full bg-[#202020] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  Telefone / WhatsApp Direto
                </label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+55 11 98888-7777"
                  className="w-full bg-[#202020] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  E-mail Confidencial
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="contato@familia.com.br"
                  className="w-full bg-[#202020] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                Diretrizes de Negociação / Termos NDA
              </label>
              <input
                type="text"
                value={confidentialNotes}
                onChange={(e) => setConfidentialNotes(e.target.value)}
                placeholder="Ex: Não divulgar fotos externas. Visitas apenas mediante qualificação financeira prévia."
                className="w-full bg-[#202020] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs px-6 py-2.5 uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Imóvel no Portfólio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. NEW VIP LEAD MODAL
// ==========================================

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Omit<ClientVIP, 'id' | 'createdAt' | 'interactions'>) => void;
  prefillStage?: PipelineStageId;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
  prefillStage = 'lead_recebido',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState<ClientVIP['profile']>('Empresário / C-Level');
  const [budgetMin, setBudgetMin] = useState(20000000);
  const [budgetMax, setBudgetMax] = useState(35000000);
  const [neighborhoods, setNeighborhoods] = useState('Itaim Bibi, Jardins');
  const [urgency, setUrgency] = useState<ClientVIP['urgency']>('Alta');
  const [liquidity, setLiquidity] = useState<ClientVIP['liquidityStatus']>('100% Líquido / À Vista');
  const [broker, setBroker] = useState('Sergio Langer');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estValue = (budgetMin + budgetMax) / 2;
    const comm = estValue * 0.06;

    onSaveLead({
      name,
      email,
      phone,
      profile,
      targetBudgetMin: Number(budgetMin),
      targetBudgetMax: Number(budgetMax),
      preferredNeighborhoods: neighborhoods.split(',').map((n) => n.trim()),
      preferredTypes: ['Penthouse / Cobertura', 'Mansão Urbana'],
      stage: prefillStage,
      assignedBroker: broker,
      estimatedDealValue: estValue,
      expectedCommission: comm,
      urgency,
      liquidityStatus: liquidity,
      notes: notes || 'Lead cadastrado diretamente na plataforma VIP.',
      tags: ['Novo Lead', urgency, profile],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#c8a24d] uppercase block mb-1">
            QUALIFICAÇÃO COMERCIAL
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            Cadastrar Novo Comprador / Investidor VIP
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Nome Completo do Cliente *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Eduardo Silveira Bueno"
              className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                E-mail Executivo *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eduardo@empresa.com.br"
                className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                WhatsApp / Telefone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 99999-9999"
                className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Perfil de Comprador
              </label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value as any)}
                className="w-full bg-[#1c1c1c] border border-neutral-700 text-white px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
              >
                <option value="Empresário / C-Level">Empresário / C-Level</option>
                <option value="Investidor Familiar">Investidor Familiar</option>
                <option value="Celebridade / Atleta">Celebridade / Atleta</option>
                <option value="Incorporador">Incorporador</option>
                <option value="Comprador Final">Comprador Final</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Corretor Responsável
              </label>
              <select
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-neutral-700 text-white px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
              >
                <option value="Sergio Langer">Sergio Langer</option>
                <option value="Gabriel Santos">Gabriel Santos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Orçamento Mínimo (R$)
              </label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Orçamento Máximo (R$)
              </label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Bairros de Preferência (separar por vírgula)
              </label>
              <input
                type="text"
                value={neighborhoods}
                onChange={(e) => setNeighborhoods(e.target.value)}
                placeholder="Ex: Itaim Bibi, Jardins, Vila Nova Conceição"
                className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Status de Liquidez
              </label>
              <select
                value={liquidity}
                onChange={(e) => setLiquidity(e.target.value as any)}
                className="w-full bg-[#1c1c1c] border border-neutral-700 text-white px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
              >
                <option value="100% Líquido / À Vista">100% Líquido / À Vista</option>
                <option value="Financiamento Private">Financiamento Private</option>
                <option value="Permuta de Ativos">Permuta de Ativos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Observações & Momento de Compra
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Busca imóvel com pé direito duplo e vista livre..."
              className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-2 text-xs focus:outline-none resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer"
            >
              Cadastrar Lead VIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. WHATSAPP SCRIPT GENERATOR MODAL
// ==========================================

interface WhatsAppGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientVIP | null;
  property?: Property | null;
}

export const WhatsAppGeneratorModal: React.FC<WhatsAppGeneratorModalProps> = ({
  isOpen,
  onClose,
  client,
  property,
}) => {
  if (!isOpen) return null;

  const clientName = client?.name.split(' ')[0] || 'Investidor';
  const propTitle = property?.title || 'Oportunidade Off-Market Exclusiva';
  const propPrice = property ? formatCurrency(property.price) : 'R$ 28.500.000';
  const propCode = property?.code || 'SL-EXCLUSIVE';

  const defaultMessage = `Olá, ${clientName}. Tudo bem?\n\nAqui é o Sergio Langer. Estou entrando em contato de forma estritamente confidencial para apresentar uma oportunidade off-market que se encaixa perfeitamente nas diretrizes que você busca:\n\n💎 *${propTitle}* (${propCode})\n📍 Localização: ${property?.neighborhood || 'Itaim Bibi'}\n📐 Área: ${property?.areaM2 || 740}m² | ${property?.suites || 5} Suítes | ${property?.parkingSpots || 8} Vagas\n💰 Valor: ${propPrice}\n\nPodemos agendar uma breve apresentação executiva sem compromisso nesta semana?`;

  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const handleCopyAndOpen = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    const phone = client?.phone.replace(/\D/g, '') || '5511999999999';
    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#22c55e] uppercase flex items-center space-x-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>DISPARO DIRETO WHATSAPP</span>
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Script Personalizado de Alto Padrão
          </h2>
        </div>

        <div className="space-y-4">
          <textarea
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#181818] border border-neutral-700 focus:border-[#22c55e] text-white p-4 text-xs focus:outline-none resize-none leading-relaxed font-mono"
          />

          <button
            onClick={handleCopyAndOpen}
            className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow"
          >
            <Send className="w-4 h-4" />
            <span>{copied ? 'Copiado! Abrindo WhatsApp...' : 'Enviar Agora no WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
