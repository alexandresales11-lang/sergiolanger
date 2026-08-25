import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  Sparkles,
  Layers,
  ArrowLeft,
  Plus,
  Bell,
  Search,
  Bot,
  Database,
  Download,
  Check,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { formatCompactCurrency } from '../../data/crmData';

interface CrmHeaderProps {
  currentTab: 'dashboard' | 'pipeline' | 'properties' | 'clients' | 'smart_match' | 'ai_copilot' | 'whatsapp_bot';
  setCurrentTab: (tab: 'dashboard' | 'pipeline' | 'properties' | 'clients' | 'smart_match' | 'ai_copilot' | 'whatsapp_bot') => void;
  onBackToSite: () => void;
  totalVGV: number;
  totalClients: number;
  totalProperties: number;
  onNewLead: () => void;
  onNewProperty: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExportData?: () => void;
  isCloudSynced?: boolean;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  currentTab,
  setCurrentTab,
  onBackToSite,
  totalVGV,
  onNewLead,
  onNewProperty,
  searchQuery,
  setSearchQuery,
  onExportData,
  isCloudSynced = true,
}) => {
  const [showExportToast, setShowExportToast] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Executivo', icon: TrendingUp },
    { id: 'pipeline', label: 'Pipeline VIP (Kanban)', icon: Layers },
    { id: 'properties', label: 'Portfólio Exclusivo', icon: Building2 },
    { id: 'clients', label: 'Clientes VIP', icon: Users },
    { id: 'smart_match', label: 'Smart Match Studio', icon: Sparkles, badge: 'ALGORÍTMICO' },
    { id: 'whatsapp_bot', label: 'Agente WhatsApp Bot', icon: Smartphone, badge: 'WHATSAPP IA', highlight: true },
    { id: 'ai_copilot', label: 'Copiloto de Vendas', icon: Bot, badge: 'GEMINI 3.7' },
  ];

  const handleExport = () => {
    if (onExportData) {
      onExportData();
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 3000);
    }
  };

  return (
    <header className="bg-[#0e0e0e] border-b border-neutral-800 sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-neutral-800/80">
        {/* Left: Brand + Back to Public Site */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={onBackToSite}
            className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-neutral-400 hover:text-white uppercase transition-colors px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voltar ao Site Oficial</span>
            <span className="sm:hidden">Site</span>
          </button>

          <div className="h-5 w-[1px] bg-neutral-800 hidden md:block" />

          {/* CRM Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col leading-none">
              <span className="text-white font-extrabold text-sm tracking-[0.18em] uppercase">
                SERGIO LANGER
              </span>
              <span className="text-[#c8a24d] font-bold text-[10px] tracking-[0.25em] uppercase mt-0.5">
                PRIVATE REAL ESTATE CRM
              </span>
            </div>
            <span className="hidden lg:inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#c8a24d]/10 text-[#c8a24d] border border-[#c8a24d]/30">
              <span>ALTO PADRÃO & LUXO</span>
            </span>
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente VIP, imóvel, corretor ou bairro..."
              className="w-full bg-[#161616] border border-neutral-800 focus:border-[#c8a24d] text-white text-xs pl-10 pr-4 py-2 focus:outline-none transition-colors placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Right: Cloud Sync Status & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cloud Firestore Status Badge */}
          <div
            className="hidden sm:flex items-center space-x-1.5 bg-[#121212] border border-neutral-800 px-2.5 py-1 text-[10px] font-bold text-neutral-300"
            title="Banco de dados Google Cloud Firestore conectado e sincronizado em tempo real"
          >
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-neutral-400">Nuvem Firestore:</span>
            <span className="text-[#22c55e]">Ativa</span>
          </div>

          {/* Quick Export Button */}
          {onExportData && (
            <button
              onClick={handleExport}
              className="hidden lg:flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold px-2.5 py-2 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              title="Exportar backup completo do CRM em CSV/JSON"
            >
              {showExportToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-[#22c55e]">Exportado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Backup</span>
                </>
              )}
            </button>
          )}

          {/* Quick VGV badge */}
          <div className="hidden xl:flex flex-col text-right pr-2">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
              VGV no Funil
            </span>
            <span className="text-sm font-extrabold text-[#c8a24d] leading-none">
              {formatCompactCurrency(totalVGV)}
            </span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onNewLead}
            className="flex items-center space-x-1.5 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs tracking-wider uppercase px-3.5 py-2 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo Lead VIP</span>
            <span className="sm:hidden">Lead</span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-neutral-800">
            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-[#c8a24d]/40 flex items-center justify-center text-xs font-bold text-[#c8a24d]">
              SL
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-white">Sergio Langer</span>
              <span className="text-[10px] text-neutral-400">Diretor Estratégico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Navigation Tabs */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#c8a24d] text-white bg-neutral-900/80 shadow-[inset_0_-1px_0_0_#c8a24d]'
                  : tab.highlight
                  ? 'border-transparent text-[#c8a24d] hover:bg-[#c8a24d]/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive
                    ? 'text-[#c8a24d]'
                    : tab.highlight
                    ? 'text-[#c8a24d] animate-pulse'
                    : 'text-neutral-400'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    tab.highlight
                      ? 'bg-gradient-to-r from-[#c8a24d] to-[#e6ca7b] text-black shadow-sm'
                      : 'bg-[#c8a24d]/20 text-[#c8a24d] border border-[#c8a24d]/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
