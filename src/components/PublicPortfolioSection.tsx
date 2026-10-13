import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Maximize2,
  BedDouble,
  Car,
  Shield,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Tag,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, PROPERTIES_COLLECTION, CLIENTS_COLLECTION, saveClientToFirestore } from '../lib/firebase';
import { Property, PropertyPurpose, PropertyType, ClientVIP } from '../types';
import { INITIAL_PROPERTIES, formatCurrency, formatRentalCurrency } from '../data/crmData';

interface PublicPortfolioSectionProps {
  onOpenModal?: (subject?: string) => void;
}

export const PublicPortfolioSection: React.FC<PublicPortfolioSectionProps> = ({ onOpenModal }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('sergio_langer_crm_properties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_PROPERTIES;
  });
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [activePurpose, setActivePurpose] = useState<'todos' | 'venda' | 'aluguel'>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Lead interest form inside public modal
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Real-time Firestore sync: updates instantly whenever CRM updates!
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, PROPERTIES_COLLECTION));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Property[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Property);
            });
            setProperties(list);
            setIsCloudSynced(true);
            try {
              localStorage.setItem('sergio_langer_crm_properties', JSON.stringify(list));
            } catch {}
          } else {
            setProperties(INITIAL_PROPERTIES);
          }
        },
        (error) => {
          console.warn('Real-time portfolio sync offline, fallback to local data:', error);
        }
      );
    } catch (e) {
      console.warn('Firestore snapshot error:', e);
    }

    return () => unsubscribe();
  }, []);

  const filteredProperties = properties.filter((p) => {
    // Purpose filter
    if (activePurpose === 'venda' && p.purpose === 'aluguel') return false;
    if (activePurpose === 'aluguel' && p.purpose === 'venda') return false;

    // Type filter
    if (selectedType !== 'todos' && p.type !== selectedType) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchNeigh = p.neighborhood.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchKeywords = p.smartKeywords?.some((k) => k.toLowerCase().includes(q));
      if (!matchTitle && !matchNeigh && !matchCity && !matchCode && !matchKeywords) {
        return false;
      }
    }

    return true;
  });

  const handleOpenWhatsApp = (prop: Property) => {
    const purposeText = prop.purpose === 'aluguel' ? 'locação' : prop.purpose === 'ambos' ? 'venda/locação' : 'aquisição';
    const msg = `Olá! Gostaria de mais informações confidenciais sobre o imóvel *${prop.title}* (Cód: *${prop.code}*), anunciado para *${purposeText}* no portfólio de alto padrão Sergio Langer.`;
    const url = `https://wa.me/5511998887766?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !leadName.trim() || !leadPhone.trim()) return;

    setLeadSubmitting(true);
    try {
      const newLead: ClientVIP = {
        id: `lead-site-${Date.now()}`,
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim() || 'cliente@portal.com.br',
        profile: 'Comprador Final',
        targetBudgetMin: selectedProperty.price ? Math.floor(selectedProperty.price * 0.8) : 5000000,
        targetBudgetMax: selectedProperty.price ? Math.floor(selectedProperty.price * 1.2) : 20000000,
        preferredNeighborhoods: [selectedProperty.neighborhood],
        preferredTypes: [selectedProperty.type],
        stage: 'lead_recebido',
        associatedPropertyId: selectedProperty.id,
        assignedBroker: 'Sergio Langer',
        estimatedDealValue: selectedProperty.price || 15000000,
        expectedCommission: Math.floor((selectedProperty.price || 15000000) * 0.06),
        urgency: 'Alta',
        liquidityStatus: '100% Líquido / À Vista',
        notes: `Lead originado do formulário público do imóvel ${selectedProperty.code} (${selectedProperty.title}). Mensagem do cliente: "${leadMessage.trim() || 'Desejo receber o dossiê e agendar visita técnica confidencial'}"`,
        tags: ['Site Público', selectedProperty.code, selectedProperty.neighborhood, selectedProperty.purpose || 'Venda'],
        interactions: [
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'note',
            author: 'Sistema Público',
            content: `Solicitação de dossiê do imóvel ${selectedProperty.code}`,
          },
        ],
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await saveClientToFirestore(newLead);
      setLeadSuccess(true);
      setTimeout(() => {
        setLeadSuccess(false);
        setLeadName('');
        setLeadPhone('');
        setLeadEmail('');
        setLeadMessage('');
      }, 4000);
    } catch (err) {
      console.warn('Erro ao salvar lead:', err);
      setLeadSuccess(true);
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0a] text-white border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xs font-bold tracking-[0.25em] text-[#c8a24d] uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c8a24d]" />
                PORTFÓLIO DE ATIVOS IMOBILIÁRIOS
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atualizado em Tempo Real</span>
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Imóveis Selecionados & Off-Market
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Residências icônicas, coberturas panorâmicas e propriedades de alto luxo para{' '}
              <strong className="text-white">venda definitiva</strong> e{' '}
              <strong className="text-white">locação de alto padrão</strong> com assessoria confidencial.
            </p>
          </div>

          {/* Quick Purpose Tabs */}
          <div className="flex items-center p-1 bg-[#141414] border border-neutral-800 self-start md:self-auto">
            <button
              onClick={() => setActivePurpose('todos')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePurpose === 'todos'
                  ? 'bg-[#c8a24d] text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos ({properties.length})
            </button>
            <button
              onClick={() => setActivePurpose('venda')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePurpose === 'venda'
                  ? 'bg-[#c8a24d] text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Para Venda ({properties.filter((p) => p.purpose !== 'aluguel').length})
            </button>
            <button
              onClick={() => setActivePurpose('aluguel')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePurpose === 'aluguel'
                  ? 'bg-[#c8a24d] text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Para Alugar ({properties.filter((p) => p.purpose === 'aluguel' || p.purpose === 'ambos').length})
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#111111] border border-neutral-800 p-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por bairro, condomínio, cidade ou código (ex: Jardins, Itaim, IB-980)..."
              className="w-full bg-[#171717] border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8a24d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#171717] border border-neutral-800 text-neutral-300 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c8a24d] cursor-pointer"
            >
              <option value="todos">Todas as Tipologias</option>
              <option value="Penthouse / Cobertura">Penthouse / Cobertura</option>
              <option value="Mansão Urbana">Mansão Urbana</option>
              <option value="Fazenda / Campo">Fazenda / Campo</option>
              <option value="Branded Residence">Branded Residence</option>
              <option value="Apartamento Garden">Apartamento Garden</option>
              <option value="Terreno Exclusivo">Terreno Exclusivo</option>
            </select>

            <span className="text-xs text-neutral-400 font-semibold px-2">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-[#121212] border border-neutral-800 p-12 text-center my-6">
            <Building2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Nenhum imóvel encontrado nesta categoria</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Ajuste seus filtros ou entre em contato direto para acessar nosso acervo confidencial off-market.
            </p>
            <button
              onClick={() => {
                setActivePurpose('todos');
                setSelectedType('todos');
                setSearchQuery('');
              }}
              className="bg-[#c8a24d] hover:bg-[#b8933e] text-black text-xs font-bold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#111111] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                {/* Photo & Floating Badges */}
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => setSelectedProperty(prop)}>
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.failed) {
                          target.dataset.failed = 'true';
                          target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                        }
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="bg-black/90 text-[#c8a24d] text-xs font-extrabold px-2.5 py-1 tracking-wider border border-[#c8a24d]/30">
                        {prop.code}
                      </span>
                      <span className="bg-neutral-900/90 text-white text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase border border-neutral-700">
                        {prop.purpose === 'aluguel' ? 'Locação' : prop.purpose === 'ambos' ? 'Venda & Locação' : 'Venda'}
                      </span>
                      {prop.status === 'exclusividade' && (
                        <span className="bg-[#c8a24d] text-black text-[10px] font-extrabold px-2 py-0.5 tracking-wider uppercase">
                          Exclusivo
                        </span>
                      )}
                    </div>

                    {/* Price in Bottom Right */}
                    <div className="absolute bottom-3 right-3 bg-black/90 px-3.5 py-1.5 border border-white/10 text-right">
                      {prop.purpose === 'aluguel' ? (
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase font-bold">Locação Mensal</span>
                          <span className="text-base font-extrabold text-[#c8a24d]">
                            {formatRentalCurrency(prop.rentalPrice || prop.price)}
                          </span>
                        </div>
                      ) : prop.purpose === 'ambos' ? (
                        <div>
                          <span className="text-base font-extrabold text-[#c8a24d] block">
                            {formatCurrency(prop.price)}
                          </span>
                          {prop.rentalPrice && (
                            <span className="text-[10px] text-neutral-300 font-bold block">
                              Aluguel: {formatRentalCurrency(prop.rentalPrice)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase font-bold">Venda</span>
                          <span className="text-base font-extrabold text-[#c8a24d]">
                            {formatCurrency(prop.price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center space-x-1.5 text-xs text-[#c8a24d] font-semibold mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{prop.neighborhood}, {prop.city}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedProperty(prop)}
                      className="text-lg font-bold text-white group-hover:text-[#c8a24d] cursor-pointer transition-colors leading-snug mb-3 line-clamp-2"
                    >
                      {prop.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {prop.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-800 text-xs text-neutral-300">
                      <div className="flex items-center space-x-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{prop.areaM2} m²</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{prop.suites} Suítes</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Car className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{prop.parkingSpots} Vagas</span>
                      </div>
                    </div>

                    {/* Highlights Pills */}
                    {prop.highlights && prop.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {prop.highlights.slice(0, 2).map((h, i) => (
                          <span key={i} className="text-[10px] bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 sm:p-6 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProperty(prop)}
                    className="w-full bg-[#1c1c1c] hover:bg-[#252525] text-white text-xs font-bold py-2.5 px-3 border border-neutral-700 transition-colors uppercase tracking-wider text-center cursor-pointer"
                  >
                    Ver Dossiê
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(prop)}
                    className="w-full flex items-center justify-center space-x-1.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold py-2.5 px-3 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner Call to Action */}
        <div className="mt-16 bg-[#111111] border border-neutral-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-[#c8a24d] tracking-[0.2em] uppercase block">
              ATENDIMENTO PRIVADO & FAMÍLIAS HIGH-NET-WORTH
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Possui um imóvel de alto luxo para cadastrar no portfólio?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Garantimos sigilo absoluto, avaliação criteriosa por m² e apresentação estritamente off-market para investidores qualificados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenModal && onOpenModal('Avaliação e Venda de Imóvel de Luxo')}
              className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs px-6 py-3.5 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cadastrar Meu Imóvel
            </button>
            <a
              href="https://wa.me/5511998887766?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20a%20gest%C3%A3o%20e%20venda%20confidencial%20do%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white border border-neutral-700 text-xs font-bold px-6 py-3.5 uppercase tracking-wider transition-colors inline-flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PUBLIC PROPERTY DETAIL MODAL */}
      {/* ========================================== */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2 z-10"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo & Big Header */}
            <div className="relative aspect-[16/8] overflow-hidden bg-neutral-900 border border-neutral-800 mb-6">
              <img
                src={selectedProperty.imageUrl}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.failed) {
                    target.dataset.failed = 'true';
                    target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="bg-black/90 px-3 py-1 text-xs font-extrabold text-[#c8a24d] border border-[#c8a24d]/30">
                  {selectedProperty.code}
                </span>
                <span className="bg-neutral-900/90 px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider border border-neutral-700">
                  {selectedProperty.purpose === 'aluguel' ? 'Locação' : selectedProperty.purpose === 'ambos' ? 'Venda & Locação' : 'Venda'}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/90 px-4 py-2 border border-neutral-700 text-right">
                {selectedProperty.purpose === 'aluguel' ? (
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Locação Mensal</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#c8a24d]">
                      {formatRentalCurrency(selectedProperty.rentalPrice || selectedProperty.price)}
                    </span>
                  </div>
                ) : selectedProperty.purpose === 'ambos' ? (
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#c8a24d] block">
                      {formatCurrency(selectedProperty.price)}
                    </span>
                    {selectedProperty.rentalPrice && (
                      <span className="text-xs text-neutral-300 font-bold block">
                        ou {formatRentalCurrency(selectedProperty.rentalPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Preço de Venda</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#c8a24d]">
                      {formatCurrency(selectedProperty.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Location */}
            <div className="pb-6 border-b border-neutral-800">
              <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase block mb-1">
                {selectedProperty.type} • {selectedProperty.neighborhood}, {selectedProperty.city} - {selectedProperty.state}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedProperty.title}
              </h2>
            </div>

            {/* Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-neutral-800 text-center">
              <div className="bg-[#161616] border border-neutral-800 p-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Área Útil</span>
                <span className="text-base font-extrabold text-white">{selectedProperty.areaM2} m²</span>
              </div>
              <div className="bg-[#161616] border border-neutral-800 p-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Suítes</span>
                <span className="text-base font-extrabold text-white">{selectedProperty.suites} Suítes</span>
              </div>
              <div className="bg-[#161616] border border-neutral-800 p-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Vagas Cobertas</span>
                <span className="text-base font-extrabold text-white">{selectedProperty.parkingSpots} Vagas</span>
              </div>
              <div className="bg-[#161616] border border-neutral-800 p-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Condomínio / IPTU</span>
                <span className="text-base font-extrabold text-white">
                  {selectedProperty.condoFee ? `R$ ${selectedProperty.condoFee.toLocaleString('pt-BR')}` : 'Isento'} / mês
                </span>
              </div>
            </div>

            {/* Description & Lead Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* Left Column: Description & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#c8a24d] uppercase tracking-wider mb-2">
                    Dossiê do Imóvel
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                {selectedProperty.highlights && selectedProperty.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#c8a24d] uppercase tracking-wider mb-3">
                      Diferenciais & Acabamentos Exclusivos
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                      {selectedProperty.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-[#171717] p-2.5 border border-neutral-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-[#151515] border border-neutral-800 p-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Atendimento Imediato via WhatsApp
                  </span>
                  <p className="text-xs text-neutral-300 mb-3">
                    Fale em tempo real com nossa equipe de curadoria e receba o book fotográfico completo no seu celular.
                  </p>
                  <button
                    onClick={() => handleOpenWhatsApp(selectedProperty)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-extrabold py-3 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Iniciar Conversa no WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Request Tour & Dossier */}
              <div className="lg:col-span-5 bg-[#161616] border border-neutral-800 p-5 sm:p-6">
                <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider block mb-1">
                  Agendar Visita / Dossiê
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  Atendimento Confidencial
                </h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                  Preencha seus dados para receber o book técnico e coordenar uma visita técnica privada com o Sergio Langer.
                </p>

                {leadSuccess ? (
                  <div className="bg-emerald-950/80 border border-emerald-700 p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-white">
                      Solicitação registrada com sucesso!
                    </p>
                    <p className="text-[11px] text-emerald-200">
                      Um de nossos consultores private entrará em contato em instantes no WhatsApp informado.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo Silva"
                        className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        WhatsApp / Celular *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="Ex: (11) 99888-7766"
                        className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="Ex: carlos@empresa.com.br"
                        className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2.5 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        Mensagem / Preferência de Horário
                      </label>
                      <textarea
                        rows={2}
                        value={leadMessage}
                        onChange={(e) => setLeadMessage(e.target.value)}
                        placeholder="Gostaria de agendar visita na quinta-feira à tarde..."
                        className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full bg-[#c8a24d] hover:bg-[#b8933e] text-black text-xs font-extrabold py-3 uppercase tracking-wider transition-colors cursor-pointer mt-2"
                    >
                      {leadSubmitting ? 'Registrando...' : 'Solicitar Apresentação Privada'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
