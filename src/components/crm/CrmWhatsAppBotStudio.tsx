import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Sparkles,
  Smartphone,
  Sliders,
  Play,
  Send,
  User,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  Globe,
  Lock,
  Building2,
  HelpCircle,
  PhoneCall,
  Save,
  Clock,
  Radio,
  SlidersHorizontal,
  Flame,
  FileText
} from 'lucide-react';
import { ClientVIP, Property } from '../../types';

interface CrmWhatsAppBotStudioProps {
  clients: ClientVIP[];
  properties: Property[];
  onOpenClientDetail?: (client: ClientVIP) => void;
}

export interface BotConfig {
  agentName: string;
  brokerageName: string;
  personality: 'ultra_formal' | 'consultive_luxury' | 'direct_executive';
  qualificationGoal: 'budget_and_urgency' | 'schedule_private_tour' | 'off_market_curation';
  autoReplyDelaySeconds: number;
  enableOffMarketDiscretion: boolean;
  minBudgetThreshold: number; // in Millions
  greetingMessage: string;
  disclaimerText: string;
  triggerWebhookUrl: string;
  fallbackPhoneNumber: string;
  activeChannel: 'official_meta_cloud' | 'evolution_api' | 'z_api';
  customInstructions: string;
}

interface SimulatorMessage {
  id: string;
  sender: 'client' | 'bot';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export const CrmWhatsAppBotStudio: React.FC<CrmWhatsAppBotStudioProps> = ({
  clients,
  properties,
  onOpenClientDetail,
}) => {
  // Active Tab inside Studio
  const [activeTab, setActiveTab] = useState<'simulator' | 'training' | 'connection' | 'playbooks'>('simulator');

  // Bot Configuration State (saved locally/cloud)
  const [config, setConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem('sergio_langer_crm_bot_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      agentName: 'Isabella (Concierge Sergio Langer)',
      brokerageName: 'Sergio Langer Private Real Estate',
      personality: 'consultive_luxury',
      qualificationGoal: 'schedule_private_tour',
      autoReplyDelaySeconds: 2,
      enableOffMarketDiscretion: true,
      minBudgetThreshold: 5,
      greetingMessage:
        'Olá! Sou Isabella, Concierge Digital do Sergio Langer. Seja muito bem-vindo ao nosso atendimento confidencial de imóveis de altíssimo padrão.',
      disclaimerText: 'Atendimento estritamente confidencial para compradores qualificados.',
      triggerWebhookUrl: 'https://api.sergiolanger.com.br/v1/whatsapp/webhook',
      fallbackPhoneNumber: '+55 11 99888-7766',
      activeChannel: 'evolution_api',
      customInstructions: `Você atende exclusivamente empresários, médicos, investidores e famílias de alto poder aquisitivo.
- Sempre valorize a privacidade e o sigilo off-market.
- Pergunte sutilmente sobre a faixa orçamentária (R$ 5M a R$ 50M) e os bairros de interesse (Jardins, Itaim Bibi, Vila Nova Conceição).
- Nunca pressione o cliente; apresente-se como uma curadoria de ativos imobiliários irreproduzíveis.
- Se o cliente demonstrar urgência, ofereça o contato direto do Sergio Langer via ligação confidencial.`,
    };
  });

  const [hasSavedConfig, setHasSavedConfig] = useState(false);

  const saveConfig = () => {
    localStorage.setItem('sergio_langer_crm_bot_config', JSON.stringify(config));
    setHasSavedConfig(true);
    setTimeout(() => setHasSavedConfig(false), 3000);
  };

  // WhatsApp Interactive Simulator State
  const [simulatorMessages, setSimulatorMessages] = useState<SimulatorMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `${config.greetingMessage}\n\nPara que eu possa filtrar com discrição nosso portfólio off-market, você já possui uma região de preferência em São Paulo (como Jardins, Itaim ou Vila Nova) ou busca por uma metragem específica?`,
      time: '14:20',
      status: 'read',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Send message in simulator
  const handleSendSimulatorMessage = async (customText?: string) => {
    const text = customText || userInput;
    if (!text.trim() || isBotTyping) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: SimulatorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'client',
      text,
      time: timeNow,
      status: 'delivered',
    };

    setSimulatorMessages((prev) => [...prev, userMsg]);
    if (!customText) setUserInput('');
    setIsBotTyping(true);

    try {
      // Call server AI endpoint with the Bot's customized system prompt
      const botSystemPrompt = `Você é "${config.agentName}", Concierge Digital de Inteligência da "${config.brokerageName}".
Personalidade configurada: ${config.personality === 'ultra_formal' ? 'Ultra Formal e Discreta' : config.personality === 'consultive_luxury' ? 'Consultiva de Alto Padrão (Elegante, acolhedora e altamente profissional)' : 'Executiva Direta'}.
Objetivo de qualificação principal: ${config.qualificationGoal}.
Instruções customizadas de treinamento:
${config.customInstructions}

Portfólio de imóveis disponíveis para consulta confidencial:
${properties.map((p) => `- ${p.code}: ${p.title} (${p.neighborhood}, R$ ${(p.price / 1000000).toFixed(1)}M, ${p.areaM2}m², ${p.suites} suítes)`).join('\n')}

Responda como se estivesse conversando no WhatsApp oficial. Seja conciso (1 a 3 parágrafos curtos), elegante, use quebras de linha limpas.`;

      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            customSystemInstruction: botSystemPrompt,
            role: 'whatsapp_bot',
          },
        }),
      });

      const data = await response.json();
      const botReplyText = data.reply || 'Entendido. Estou selecionando as melhores oportunidades do nosso acervo confidencial.';

      setTimeout(() => {
        const botMsg: SimulatorMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReplyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        setSimulatorMessages((prev) => [...prev, botMsg]);
        setIsBotTyping(false);
      }, config.autoReplyDelaySeconds * 600); // realistic typing delay
    } catch (err) {
      setTimeout(() => {
        const botMsg: SimulatorMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Compreendo perfeitamente o seu perfil. Temos 2 coberturas estritamente confidenciais nessa faixa nos Jardins que ainda não foram a mercado. Gostaria que o Sergio Langer lhe apresente o dossiê reservado hoje às 17h?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        setSimulatorMessages((prev) => [...prev, botMsg]);
        setIsBotTyping(false);
      }, 1000);
    }
  };

  const handleResetSimulator = () => {
    setSimulatorMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: `${config.greetingMessage}\n\nPara que eu possa filtrar com discrição nosso portfólio off-market, você já possui uma região de preferência em São Paulo ou busca por uma metragem específica?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#17140e] via-[#121212] to-[#141414] border border-[#c8a24d]/30 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center space-x-1.5 bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] text-[11px] font-black px-2.5 py-0.5 tracking-wider uppercase">
              <Smartphone className="w-3.5 h-3.5" />
              <span>WHATSAPP BOT & AGENTE DE CONCIERGE VIP</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold">• Treinamento, Automação & Simulação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Central de Treinamento e Execução do Agente de WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
            Configure a personalidade, regras de discrição, qualificação automática de leads milionários e conecte a sua linha de WhatsApp Oficial ou API dedicada.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={saveConfig}
            className="flex items-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-black text-xs px-4 py-2.5 uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            {hasSavedConfig ? (
              <>
                <Check className="w-4 h-4" />
                <span>Configurações Salvas!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Treinamento</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Studio Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'simulator', label: '1. Simulador Interativo de WhatsApp', icon: Smartphone, badge: 'TESTE AO VIVO' },
          { id: 'training', label: '2. Treinamento & Prompts do Agente', icon: SlidersHorizontal },
          { id: 'connection', label: '3. Como Conectar ao WhatsApp Real', icon: QrCode, badge: 'ARQUITETURA' },
          { id: 'playbooks', label: '4. Playbooks & Roteiros de Qualificação', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-[#c8a24d] text-black border-[#c8a24d] shadow-sm'
                  : 'bg-[#141414] text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-black text-[#c8a24d]' : 'bg-[#c8a24d]/20 text-[#c8a24d]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE WHATSAPP SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Prompts to Test (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Cenários Reais de Teste</span>
                </span>
                <span className="text-[10px] text-neutral-400">Clique para simular o cliente</span>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Clique nos botões abaixo para simular mensagens reais que compradores de alta renda enviam no WhatsApp:
              </p>

              <div className="space-y-2">
                {[
                  {
                    title: 'Comprador Procurando Cobertura',
                    text: 'Boa tarde. Vi o anúncio de vocês. Estou procurando uma cobertura nos Jardins com no mínimo 4 suítes e 600m².',
                  },
                  {
                    title: 'Pergunta Direta de Preço',
                    text: 'Qual o valor exato daquela casa no condomínio Cidade Jardim? Aceita imóvel menor como parte de pagamento?',
                  },
                  {
                    title: 'Cliente Exigindo Discrição',
                    text: 'Olá, sou assessor de uma família e precisamos de uma propriedade com heliponto e segurança armada privada.',
                  },
                  {
                    title: 'Investidor Pedindo Cap Rate',
                    text: 'Vocês têm lajes corporativas ou imóveis locados com renda garantida acima de 0,65% ao mês?',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendSimulatorMessage(item.text)}
                    className="w-full text-left p-3 bg-[#181818] hover:bg-[#201c14] border border-neutral-800 hover:border-[#c8a24d]/60 transition-all text-xs text-neutral-200 group cursor-pointer"
                  >
                    <div className="font-bold text-white group-hover:text-[#c8a24d] mb-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      <Send className="w-3 h-3 text-neutral-600 group-hover:text-[#c8a24d]" />
                    </div>
                    <div className="text-[11px] text-neutral-400 line-clamp-2 italic">
                      "{item.text}"
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Live Personality Toggles */}
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-neutral-800">
                <Sliders className="w-3.5 h-3.5 text-[#c8a24d]" />
                <span>Ajuste Rápido de Tom</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Estilo de Resposta
                </label>
                <select
                  value={config.personality}
                  onChange={(e) => setConfig({ ...config, personality: e.target.value as any })}
                  className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-2.5 focus:border-[#c8a24d] focus:outline-none"
                >
                  <option value="consultive_luxury">Consultivo de Alto Padrão (Recomendado)</option>
                  <option value="ultra_formal">Ultra Formal & Sigiloso</option>
                  <option value="direct_executive">Direto & Executivo (C-Level)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Meta Principal do Bot
                </label>
                <select
                  value={config.qualificationGoal}
                  onChange={(e) => setConfig({ ...config, qualificationGoal: e.target.value as any })}
                  className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-2.5 focus:border-[#c8a24d] focus:outline-none"
                >
                  <option value="schedule_private_tour">Agendar Visita Técnica Privada</option>
                  <option value="budget_and_urgency">Qualificar Orçamento & Liquidez</option>
                  <option value="off_market_curation">Apresentar Dossiê Confidencial</option>
                </select>
              </div>

              <button
                onClick={handleResetSimulator}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold py-2 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer border border-neutral-700"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reiniciar Teste do WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right: Realistic WhatsApp Mobile View (8 cols) */}
          <div className="lg:col-span-8 flex justify-center">
            {/* WhatsApp Smartphone Frame */}
            <div className="w-full max-w-md bg-[#111b21] border-4 border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
              {/* WhatsApp Chat Top Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942] text-white">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#c8a24d] text-black font-extrabold flex items-center justify-center text-sm shadow-md">
                      SL
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-[#202c33] rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>{config.agentName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                    </div>
                    <span className="text-[11px] text-[#00a884] font-medium">
                      {isBotTyping ? 'digitando...' : 'online • Atendimento VIP'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[#aebac1]">
                  <PhoneCall className="w-4 h-4 cursor-pointer hover:text-white" />
                  <Lock className="w-4 h-4 cursor-pointer hover:text-white" title="Criptografia de ponta a ponta" />
                </div>
              </div>

              {/* WhatsApp Messages Canvas */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a] bg-opacity-95"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {/* Security Encryption Notice */}
                <div className="flex justify-center my-2">
                  <div className="bg-[#182229] border border-[#2a3942] text-[#ffd279] text-[10px] px-3 py-1.5 rounded text-center max-w-xs shadow-sm flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>As mensagens são protegidas com criptografia de ponta a ponta.</span>
                  </div>
                </div>

                {simulatorMessages.map((msg) => {
                  const isBot = msg.sender === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 text-xs sm:text-[13px] leading-relaxed shadow relative ${
                          isBot
                            ? 'bg-[#202c33] text-[#e9edef] rounded-tl-none border-l-2 border-[#c8a24d]'
                            : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-[#8696a0]">
                          <span>{msg.time}</span>
                          {!isBot && <CheckCircle2 className="w-3 h-3 text-[#53bdeb]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-[#aebac1] px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-[#c8a24d] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#c8a24d] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#c8a24d] rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] ml-1 text-[#8696a0]">Digitando resposta VIP...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Input Bar */}
              <div className="bg-[#202c33] p-2.5 flex items-center space-x-2 border-t border-[#2a3942]">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendSimulatorMessage();
                  }}
                  placeholder="Digite uma mensagem como cliente..."
                  className="flex-1 bg-[#2a3942] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-lg focus:outline-none placeholder:text-[#8696a0]"
                />
                <button
                  onClick={() => handleSendSimulatorMessage()}
                  disabled={!userInput.trim() || isBotTyping}
                  className="bg-[#00a884] hover:bg-[#008f6f] disabled:bg-[#2a3942] disabled:text-[#8696a0] text-black font-bold p-2.5 rounded-full transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 fill-black text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRAINING & PROMPTS */}
      {activeTab === 'training' && (
        <div className="bg-[#121212] border border-neutral-800 p-6 space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#c8a24d]" />
              <span>Personalização de Treinamento do Agente</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Defina como a inteligência artificial deve se comportar, o que ela pode ou não dizer sobre preços e imóveis, e as instruções de ouro para corretores de luxo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field: Agent Name */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Nome do Concierge / Atendente Digital
              </label>
              <input
                type="text"
                value={config.agentName}
                onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Ex: "Isabella (Concierge Sergio Langer)" ou "Assistente Executivo VIP"
              </span>
            </div>

            {/* Field: Brokerage Name */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Nome da Imobiliária / Marca
              </label>
              <input
                type="text"
                value={config.brokerageName}
                onChange={(e) => setConfig({ ...config, brokerageName: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none"
              />
            </div>

            {/* Field: Greeting Message */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Mensagem de Boas-Vindas Automática (Primeiro Contato)
              </label>
              <textarea
                rows={2}
                value={config.greetingMessage}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Field: Custom Instructions (System Prompt) */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Regras de Ouro & Treinamento Exclusivo (System Prompt)
                </label>
                <span className="text-[10px] text-[#c8a24d] font-bold">MANDATÓRIO PARA ALTO PADRÃO</span>
              </div>
              <textarea
                rows={6}
                value={config.customInstructions}
                onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-3 font-mono focus:border-[#c8a24d] focus:outline-none leading-relaxed"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Dica: Especifique quais bairros são o foco, como falar sobre permuta, e que valores exatos de imóveis off-market só são abertos após confirmação de interesse.
              </span>
            </div>

            {/* Toggle: Off-Market Discretion */}
            <div className="flex items-center justify-between p-4 bg-[#181818] border border-neutral-800">
              <div>
                <div className="text-xs font-bold text-white">Sigilo de Ativos Off-Market</div>
                <div className="text-[11px] text-neutral-400">
                  O bot nunca revela endereço exato ou nome do proprietário no WhatsApp sem autorização.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableOffMarketDiscretion}
                onChange={(e) => setConfig({ ...config, enableOffMarketDiscretion: e.target.checked })}
                className="w-4 h-4 accent-[#c8a24d] cursor-pointer"
              />
            </div>

            {/* Field: Min Budget Threshold */}
            <div className="flex items-center justify-between p-4 bg-[#181818] border border-neutral-800">
              <div>
                <div className="text-xs font-bold text-white">Filtro Mínimo de Ticket</div>
                <div className="text-[11px] text-neutral-400">
                  Qualificar leads com orçamento a partir de R$ {config.minBudgetThreshold} Milhões.
                </div>
              </div>
              <input
                type="number"
                min="1"
                max="50"
                value={config.minBudgetThreshold}
                onChange={(e) => setConfig({ ...config, minBudgetThreshold: Number(e.target.value) })}
                className="w-20 bg-neutral-900 border border-neutral-700 text-xs text-white p-2 text-center focus:border-[#c8a24d] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              onClick={saveConfig}
              className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-black text-xs px-6 py-3 uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações de Treinamento</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: REAL WHATSAPP EVOLUTION API CONNECTION */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          {/* Active Live Status Banner */}
          <div className="bg-[#121212] border border-neutral-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <span>Central de Conexão WhatsApp (Evolution API)</span>
                    <span className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase">
                      QR CODE AO VIVO
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Conecte seu WhatsApp lendo o QR Code para enviar e sincronizar mensagens diretamente pelo CRM.
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Credentials & Form */}
            <EvolutionConnectionManager />
          </div>
        </div>
      )}

      {/* TAB 4: PLAYBOOKS & SCRIPTS */}
      {activeTab === 'playbooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Playbook 1: O Primeiro Contato com Lead de Alto Padrão',
              goal: 'Transformar a curiosidade em agendamento de visita técnica sem parecer insistente.',
              sampleText:
                'Olá, [Nome]. Tudo bem? Sou a Isabella, Concierge do Sergio Langer. Identifiquei que você demonstrou interesse na Cobertura Off-Market dos Jardins. Como se trata de uma propriedade estritamente reservada, posso lhe enviar o book arquitetônico confidencial em PDF?',
              rules: ['Nunca envie o endereço completo de cara.', 'Sempre cite o nome da imobiliária.', 'Ofereça o PDF como ativo de valor.'],
            },
            {
              title: 'Playbook 2: Qualificação Elegante de Orçamento (R$ 5M a R$ 50M)',
              goal: 'Descobrir a faixa de preço real sem constranger o cliente.',
              sampleText:
                'Perfeito, Dr. [Nome]. Nosso portfólio nessa região varia entre R$ 8M e R$ 25M com metragens de 400m² a 900m². Qual dessas configurações melhor atende à dinâmica da sua família neste momento?',
              rules: ['Use faixas amplas para o cliente escolher.', 'Foque no benefício familiar.', 'Não fale em "quanto você tem para gastar".'],
            },
            {
              title: 'Playbook 3: Contorno de Proposta com Permuta',
              goal: 'Receber a proposta de dação em pagamento com seriedade e análise de liquidez.',
              sampleText:
                'Compreendo perfeitamente. O proprietário avalia dação em pagamento desde que o ativo possua liquidez comprovada ou renda locatícia ativa. Você teria a ficha técnica resumida do imóvel para submetermos à avaliação do comitê?',
              rules: ['Chame de "comitê de avaliação" para dar peso institucional.', 'Peça ficha técnica antes de dizer não.', 'Mantenha a porta aberta.'],
            },
            {
              title: 'Playbook 4: Passagem de Bastão para o Corretor Humano',
              goal: 'Conectar o comprador quente diretamente à ligação do Sergio Langer.',
              sampleText:
                'Excelente! Com base nas suas exigências, o próprio Sergio Langer preparou duas opções exclusivas que ainda não foram publicadas. Ele pode lhe ligar em 5 minutos ou prefere uma chamada de vídeo hoje às 17h30?',
              rules: ['Crie exclusividade no atendimento do fundador.', 'Dê duas opções de horário fechadas.', 'Finalize a qualificação.'],
            },
          ].map((playbook, pIdx) => (
            <div key={pIdx} className="bg-[#121212] border border-neutral-800 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#c8a24d] mb-1">{playbook.title}</h3>
                <p className="text-xs text-neutral-400 mb-3">{playbook.goal}</p>

                <div className="bg-[#181818] border-l-2 border-[#c8a24d] p-3 text-xs text-neutral-200 italic font-mono mb-3">
                  "{playbook.sampleText}"
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Regras de Execução:</span>
                  {playbook.rules.map((r, rIdx) => (
                    <div key={rIdx} className="text-[11px] text-neutral-300 flex items-center space-x-1.5">
                      <Check className="w-3 h-3 text-[#22c55e] shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('simulator');
                    handleSendSimulatorMessage(playbook.sampleText);
                  }}
                  className="text-xs font-bold text-[#c8a24d] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>Testar no Simulador</span>
                  <Play className="w-3 h-3 fill-[#c8a24d]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Subcomponent: Live Evolution API Connection Manager with QR Code
export const EvolutionConnectionManager: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('evolution_api_url') || 'https://sua-evolution-api.com');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('evolution_api_key') || '');
  const [instanceName, setInstanceName] = useState<string>(() => localStorage.getItem('evolution_instance_name') || 'sergio_langer_vip');
  
  const [connectionState, setConnectionState] = useState<'idle' | 'checking' | 'connecting' | 'open' | 'close' | 'error'>('idle');
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSaveCredentials = () => {
    localStorage.setItem('evolution_api_url', apiUrl);
    localStorage.setItem('evolution_api_key', apiKey);
    localStorage.setItem('evolution_instance_name', instanceName);
    setStatusMessage('Configurações salvas localmente no CRM com sucesso!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleCheckOrConnect = async () => {
    if (!apiUrl || !apiKey || !instanceName) {
      setStatusMessage('Preencha a URL da API, a Chave de Autenticação e o Nome da Instância.');
      return;
    }

    setConnectionState('checking');
    setStatusMessage('Consultando instância na Evolution API...');
    setQrCodeBase64(null);

    try {
      const res = await fetch('/api/whatsapp/evolution/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl, apiKey, instanceName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setConnectionState('error');
        setStatusMessage(data.error || 'Erro ao conectar com o servidor da Evolution API.');
        return;
      }

      if (data.state === 'open') {
        setConnectionState('open');
        setStatusMessage('WhatsApp conectado e pronto para envio e sincronização!');
      } else {
        setConnectionState('connecting');
        if (data.qrcode) {
          setQrCodeBase64(data.qrcode);
          setStatusMessage('QR Code gerado! Abra o WhatsApp no seu celular > Aparelhos Conectados > Conectar um aparelho.');
        } else {
          setStatusMessage('Instância em estado de conexão. Aguardando leitura de QR Code...');
        }
      }
    } catch (err: any) {
      setConnectionState('error');
      setStatusMessage(`Falha de rede ao conectar: ${err?.message || 'Verifique se a URL da API está acessível'}`);
    }
  };

  const webhookUrl = `${window.location.origin}/api/whatsapp/evolution/webhook`;

  return (
    <div className="space-y-6">
      {/* 3 Step Onboarding Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#181818] border border-neutral-800 p-4 rounded flex items-start space-x-3">
          <div className="w-7 h-7 rounded-full bg-[#c8a24d]/20 text-[#c8a24d] font-bold text-xs flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Criar Instância</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Tenha uma Evolution API instalada (na Railway, Render, VPS ou servidor próprio).
            </p>
          </div>
        </div>

        <div className="bg-[#181818] border border-neutral-800 p-4 rounded flex items-start space-x-3">
          <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-bold text-xs flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Escanear QR Code</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Clique em "Gerar QR Code", aponte a câmera do WhatsApp no celular e conecte.
            </p>
          </div>
        </div>

        <div className="bg-[#181818] border border-neutral-800 p-4 rounded flex items-start space-x-3">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sincronização 24/7</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Mensagens enviadas e recebidas aparecem automaticamente no histórico do lead.
            </p>
          </div>
        </div>
      </div>

      {/* Main Connection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Credentials */}
        <div className="lg:col-span-7 bg-[#181818] border border-neutral-800 p-5 space-y-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-neutral-800 pb-3">
            <Sliders className="w-4 h-4 text-[#c8a24d]" />
            <span>Dados da sua Evolution API</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              URL do Servidor Evolution API
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://sua-api.up.railway.app ou https://evolution.seudominio.com"
              className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none"
            />
            <span className="text-[10px] text-neutral-500 mt-0.5 block">
              A URL pública onde sua Evolution API está hospedada.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Nome da Instância
              </label>
              <input
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="sergio_langer_vip"
                className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Chave Global (API Key / Token)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ex: 42964e2b-6b81-435e-99e1..."
                className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white p-3 focus:border-[#c8a24d] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={handleSaveCredentials}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Dados</span>
            </button>

            <button
              onClick={handleCheckOrConnect}
              disabled={connectionState === 'checking'}
              className="bg-[#22c55e] hover:bg-[#1ea34d] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black text-xs px-5 py-2.5 rounded transition-colors cursor-pointer flex items-center space-x-2 shadow-md"
            >
              <QrCode className="w-4 h-4" />
              <span>{connectionState === 'checking' ? 'Verificando...' : 'Gerar QR Code / Conectar'}</span>
            </button>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded text-xs leading-relaxed ${
              connectionState === 'open' 
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]'
                : connectionState === 'error'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-[#c8a24d]/10 border border-[#c8a24d]/30 text-[#c8a24d]'
            }`}>
              {statusMessage}
            </div>
          )}

          {/* Webhook Config info */}
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="text-xs font-bold text-neutral-300 mb-1 flex items-center justify-between">
              <span>URL de Webhook do CRM (Para receber respostas dos clientes):</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="text-[10px] text-[#c8a24d] hover:text-white flex items-center space-x-1 cursor-pointer font-normal"
              >
                {isCopied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copiado!' : 'Copiar Webhook'}</span>
              </button>
            </div>
            <div className="bg-neutral-950 p-2 text-[11px] font-mono text-neutral-400 border border-neutral-800 select-all overflow-x-auto">
              {webhookUrl}
            </div>
          </div>
        </div>

        {/* Right Canvas: QR Code & Status Box */}
        <div className="lg:col-span-5 bg-[#181818] border border-neutral-800 p-5 flex flex-col items-center justify-center text-center relative min-h-[320px]">
          {connectionState === 'open' ? (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 border border-[#22c55e] flex items-center justify-center mx-auto text-[#22c55e]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instância 100% Conectada</h3>
                <p className="text-xs text-[#22c55e] font-semibold mt-1">Status: OPEN (Online)</p>
                <p className="text-xs text-neutral-400 max-w-xs mt-2 mx-auto">
                  Seu número está pronto para disparos com IA e sincronização no CRM.
                </p>
              </div>
              <button
                onClick={handleCheckOrConnect}
                className="text-xs font-bold text-neutral-400 hover:text-white flex items-center space-x-1.5 mx-auto bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Verificar Novamente</span>
              </button>
            </div>
          ) : qrCodeBase64 ? (
            <div className="space-y-3 py-2">
              <div className="p-3 bg-white rounded-lg shadow-xl inline-block border-4 border-[#22c55e]">
                {qrCodeBase64.startsWith('data:image') ? (
                  <img src={qrCodeBase64} alt="QR Code WhatsApp" className="w-48 h-48 mx-auto" />
                ) : (
                  <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code WhatsApp" className="w-48 h-48 mx-auto" />
                )}
              </div>
              <div className="text-xs font-bold text-white">Aponte o WhatsApp do Celular</div>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                No celular: <strong>Configurações &gt; Aparelhos Conectados &gt; Conectar um aparelho</strong>
              </p>
              <button
                onClick={handleCheckOrConnect}
                className="text-xs font-bold text-[#c8a24d] hover:text-white flex items-center space-x-1 mx-auto pt-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Atualizar QR Code</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-500">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aguardando Conexão</h4>
                <p className="text-xs text-neutral-400 max-w-xs mt-1 mx-auto leading-relaxed">
                  Insira as credenciais da sua Evolution API ao lado e clique no botão para gerar o QR Code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

