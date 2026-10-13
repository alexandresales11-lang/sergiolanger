import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Maximize2,
  BedDouble,
  Car,
  Shield,
  Sparkles,
  Lock,
  MessageCircle,
  Plus,
  Share2,
  DollarSign,
  Tag,
  Instagram,
} from 'lucide-react';
import { Property, PropertyStatus, PropertyType, PropertyPurpose } from '../../types';
import { formatCurrency, formatCompactCurrency, formatRentalCurrency } from '../../data/crmData';

interface CrmPropertiesPortfolioProps {
  properties: Property[];
  onOpenPropertyDetail: (property: Property) => void;
  onOpenNewProperty: () => void;
  onTriggerSmartMatchForProperty: (property: Property) => void;
  onSharePropertyWhatsApp: (property: Property) => void;
  onOpenSocialMarketing?: (property: Property) => void;
}

export const CrmPropertiesPortfolio: React.FC<CrmPropertiesPortfolioProps> = ({
  properties,
  onOpenPropertyDetail,
  onOpenNewProperty,
  onTriggerSmartMatchForProperty,
  onSharePropertyWhatsApp,
  onOpenSocialMarketing,
}) => {
  const [purposeFilter, setPurposeFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProperties = properties.filter((p) => {
    if (purposeFilter === 'venda' && p.purpose === 'aluguel') return false;
    if (purposeFilter === 'aluguel' && p.purpose === 'venda') return false;
    if (statusFilter !== 'todos' && p.status !== statusFilter) return false;
    if (typeFilter !== 'todos' && p.type !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'exclusividade':
        return (
          <span className="bg-[#c8a24d] text-black font-extrabold text-[10px] px-2.5 py-0.5 tracking-wider uppercase">
            Exclusividade Ativa
          </span>
        );
      case 'em_negociacao':
        return (
          <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2.5 py-0.5 tracking-wider uppercase">
            Em Negociação
          </span>
        );
      case 'vendido':
        return (
          <span className="bg-neutral-700 text-white font-extrabold text-[10px] px-2.5 py-0.5 tracking-wider uppercase">
            Vendido
          </span>
        );
      default:
        return (
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 tracking-wider uppercase">
            Disponível
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-neutral-800 p-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase">
              PORTFÓLIO DE ATIVOS EXCLUSIVOS
            </span>
            <span className="text-xs text-neutral-400">
              • {filteredProperties.length} Propriedades High-End
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Imóveis & Empreendimentos Off-Market
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por código, título ou bairro..."
            className="bg-[#171717] border border-neutral-800 focus:border-[#c8a24d] text-white text-xs px-3.5 py-2 focus:outline-none placeholder:text-neutral-500 w-56"
          />

          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="bg-[#171717] border border-[#c8a24d]/40 text-[#c8a24d] text-xs font-bold px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="todos">Venda & Locação</option>
            <option value="venda">Apenas Venda</option>
            <option value="aluguel">Apenas Aluguel</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#171717] border border-neutral-800 text-white text-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Status</option>
            <option value="exclusividade">Exclusividade</option>
            <option value="disponivel">Disponível</option>
            <option value="em_negociacao">Em Negociação</option>
            <option value="vendido">Vendido</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#171717] border border-neutral-800 text-white text-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas as Tipologias</option>
            <option value="Penthouse / Cobertura">Penthouse / Cobertura</option>
            <option value="Mansão Urbana">Mansão Urbana</option>
            <option value="Fazenda / Campo">Fazenda / Campo</option>
            <option value="Branded Residence">Branded Residence</option>
            <option value="Apartamento Garden">Apartamento Garden</option>
            <option value="Terreno Exclusivo">Terreno Exclusivo</option>
          </select>

          <button
            onClick={onOpenNewProperty}
            className="flex items-center space-x-1.5 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs tracking-wider uppercase px-4 py-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Imóvel</span>
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="bg-[#111111] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            {/* Image Container */}
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
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
                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="bg-black/90 text-white text-xs font-extrabold px-2.5 py-1 tracking-wider border border-white/10">
                    {prop.code}
                  </span>
                  <span className="bg-neutral-900/90 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase border border-neutral-700">
                    {prop.purpose === 'aluguel' ? 'Locação' : prop.purpose === 'ambos' ? 'Venda & Locação' : 'Venda'}
                  </span>
                  {getStatusBadge(prop.status)}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/90 px-3.5 py-1.5 border border-[#c8a24d]/30 text-right">
                  {prop.purpose === 'aluguel' ? (
                    <div>
                      <span className="text-[9px] text-neutral-400 block uppercase font-bold">Locação Mensal</span>
                      <span className="text-sm sm:text-base font-extrabold text-[#c8a24d]">
                        {formatRentalCurrency(prop.rentalPrice || prop.price)}
                      </span>
                    </div>
                  ) : prop.purpose === 'ambos' ? (
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-[#c8a24d] block">
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
                      <span className="text-[9px] text-neutral-400 block uppercase font-bold">Preço de Venda</span>
                      <span className="text-sm sm:text-base font-extrabold text-[#c8a24d]">
                        {formatCurrency(prop.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center space-x-1.5 text-xs text-neutral-400 font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>{prop.neighborhood}, {prop.city} - {prop.state}</span>
                </div>

                <h2
                  onClick={() => onOpenPropertyDetail(prop)}
                  className="text-base sm:text-lg font-bold text-white group-hover:text-[#c8a24d] cursor-pointer transition-colors leading-snug mb-3 line-clamp-2"
                >
                  {prop.title}
                </h2>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {prop.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-800/80 text-xs text-neutral-300">
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

                {/* Confidential Owner Info Badge */}
                <div className="mt-4 bg-[#161616] border border-neutral-800 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-[#c8a24d]" />
                    <span className="text-[11px] font-bold text-neutral-300">
                      Proprietário: {prop.owner.name.split(' ')[0]}***
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    Off-Market
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-5 pt-0 flex items-center gap-2">
              <button
                onClick={() => onTriggerSmartMatchForProperty(prop)}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-[#c8a24d]/10 hover:bg-[#c8a24d]/20 text-[#c8a24d] border border-[#c8a24d]/40 font-bold text-xs py-2.5 px-3 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Match</span>
              </button>

              {onOpenSocialMarketing && (
                <button
                  onClick={() => onOpenSocialMarketing(prop)}
                  className="p-2.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 border border-pink-500/40 transition-colors cursor-pointer"
                  title="Criar Arte & Post Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onSharePropertyWhatsApp(prop)}
                className="p-2.5 bg-[#15803d]/20 hover:bg-[#15803d]/40 text-[#22c55e] border border-[#15803d]/40 transition-colors cursor-pointer"
                title="Gerar Apresentação WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenPropertyDetail(prop)}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-neutral-700"
              >
                Ver Ficha
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
