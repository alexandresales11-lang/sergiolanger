import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Zap,
  Target,
  ShieldCheck,
  TrendingUp,
  Building2,
  ChevronRight,
  Lightbulb,
  Share2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { ClientVIP, Property, PipelineStageId } from '../../types';
import { PIPELINE_STAGES } from '../../data/crmData';

interface CrmAiCopilotProps {
  clients: ClientVIP[];
  properties: Property[];
  onOpenClientDetail?: (client: ClientVIP) => void;
  onOpenPropertyDetail?: (prop: Property) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chips?: string[];
  suggestedLeadId?: string;
  suggestedPropertyId?: string;
}

export const CrmAiCopilot: React.FC<CrmAiCopilotProps> = ({
  clients,
  properties,
  onOpenClientDetail,
  onOpenPropertyDetail,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Olá! Sou o seu **Copiloto de Inteligência Imobiliária VIP**.\n\nEstou conectado em tempo real à sua carteira de **${clients.length} clientes VIP** e ao seu portfólio de **${properties.length} imóveis de alto padrão**.\n\nComo posso acelerar suas negociações e fechamentos hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: [
        'Analisar leads com maior chance de fechamento',
        'Criar script de WhatsApp para Cobertura Triplex',
        'Como contornar objeção de valor por m² alto?',
        'Simular proposta de permuta com investidor',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [selectedPropId, setSelectedPropId] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'chat' | 'roleplay' | 'scripts'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const totalVgv = clients.reduce((acc, c) => acc + c.estimatedDealValue, 0);
  const totalCommission = clients.reduce((acc, c) => acc + c.expectedCommission, 0);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // Build CRM context payload
      const selectedClient = clients.find((c) => c.id === selectedLeadId);
      const selectedProperty = properties.find((p) => p.id === selectedPropId);

      const contextPayload = {
        totalVgv,
        totalCommission,
        clientsCount: clients.length,
        propertiesCount: properties.length,
        selectedLead: selectedClient || null,
        selectedProperty: selectedProperty || null,
        topHighUrgencyClients: clients
          .filter((c) => c.urgency === 'Alta')
          .map((c) => ({
            name: c.name,
            budget: `R$ ${(c.targetBudgetMax / 1000000).toFixed(1)}M`,
            profile: c.profile,
            stage: c.stage,
          })),
        availableProperties: properties.map((p) => ({
          code: p.code,
          title: p.title,
          price: `R$ ${(p.price / 1000000).toFixed(1)}M`,
          neighborhood: p.neighborhood,
          type: p.type,
        })),
      };

      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: contextPayload,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com a IA');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Desculpe, não consegui processar a resposta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: [
          'Gerar mensagem para envio no WhatsApp',
          'Quais são os próximos passos táticos?',
          'Simular contraproposta do comprador',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Fallback local do Copiloto:', err);
      const fallbackMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `### 🎯 Recomendação Estratégica do Copiloto\n\nIdentifiquei **${clients.filter((c) => c.urgency === 'Alta').length} negociações quentes** em andamento com VGV total de **R$ ${(totalVgv / 1000000).toFixed(1)}M**.\n\nPara maximizar seu fechamento:\n1. **Lead Recomendado:** ${clients[0]?.name || 'Cliente VIP'} (Etapa: ${clients[0]?.stage || 'Curadoria'}).\n2. **Ação Imediata:** Envie um dossiê técnico confidencial de 1 página com foco nos diferenciais off-market.\n3. **Gatilho de Urgência:** Mencione que há outra família de investidores agendando visita para esta semana.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-[#17140e] via-[#111111] to-[#141414] border border-[#c8a24d]/30 p-5 sm:p-6 rounded-none">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="inline-flex items-center space-x-1.5 bg-[#c8a24d]/10 border border-[#c8a24d]/40 text-[#c8a24d] text-[11px] font-extrabold px-2.5 py-0.5 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AGENTE DE INTELIGÊNCIA ARTIFICIAL GEMINI</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold">• Modelo Ativo & Contextual</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Copiloto Comercial de Alto Padrão
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Mentoria tática para fechamentos milionários, geração de roteiros de persuasão e quebra de objeções com compradores ultra-qualificados.
          </p>
        </div>

        {/* Live Context Indicators */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-black/60 border border-neutral-800 px-3.5 py-2 text-right">
            <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">VGV na Mesa</div>
            <div className="text-sm sm:text-base font-extrabold text-[#c8a24d]">
              R$ {(totalVgv / 1000000).toFixed(1)} Milhões
            </div>
          </div>
          <div className="bg-black/60 border border-neutral-800 px-3.5 py-2 text-right">
            <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Comissão em Jogo</div>
            <div className="text-sm sm:text-base font-extrabold text-[#22c55e]">
              R$ {(totalCommission / 1000).toFixed(0)}k
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Copilot Chat + Context Side Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Context Selectors & Quick Playbooks (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Selection Card */}
          <div className="bg-[#121212] border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-[#c8a24d]" />
                <span>Contexto Específico</span>
              </span>
              <span className="text-[10px] text-[#c8a24d] font-semibold">Opcional</span>
            </div>

            {/* Select Lead */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Cliente / Lead Alvo
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-2.5 focus:border-[#c8a24d] focus:outline-none transition-colors"
              >
                <option value="">Nenhum lead selecionado (Análise Geral)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — R$ {(c.targetBudgetMax / 1000000).toFixed(1)}M ({c.profile})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Property */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Imóvel / Ativo Alvo
              </label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-xs text-white p-2.5 focus:border-[#c8a24d] focus:outline-none transition-colors"
              >
                <option value="">Nenhum imóvel selecionado (Catálogo Geral)</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title} (R$ {(p.price / 1000000).toFixed(1)}M)
                  </option>
                ))}
              </select>
            </div>

            {/* Context Action Generator Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  const client = clients.find((c) => c.id === selectedLeadId);
                  const prop = properties.find((p) => p.id === selectedPropId);
                  const prompt = client && prop
                    ? `Crie um roteiro de fechamento completo e mensagem de WhatsApp personalizada para o cliente ${client.name} (${client.profile}, orçamento até R$ ${(client.targetBudgetMax / 1000000).toFixed(1)}M) referente ao imóvel ${prop.title} (${prop.code}, valor R$ ${(prop.price / 1000000).toFixed(1)}M no bairro ${prop.neighborhood}). Destaque os diferenciais de liquidez e exclusividade.`
                    : 'Gere uma estratégia de fechamento para os leads mais quentes da minha carteira.';
                  handleSendMessage(prompt);
                }}
                className="w-full bg-[#c8a24d] hover:bg-[#b8933e] text-black text-xs font-black py-2.5 px-3 uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Gerar Estratégia de Fechamento</span>
              </button>

              <button
                onClick={() => {
                  handleSendMessage(
                    'Como contornar a objeção quando o comprador milionário diz: "Gostei muito do imóvel, mas o valor por metro quadrado está acima do que eu pretendia pagar na região"?'
                  );
                }}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold py-2 px-3 transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-neutral-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#c8a24d]" />
                <span>Contornar Objeção de Preço/m²</span>
              </button>
            </div>
          </div>

          {/* Quick Playbooks & Scripts */}
          <div className="bg-[#121212] border border-neutral-800 p-4">
            <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-neutral-800">
              <Lightbulb className="w-3.5 h-3.5 text-[#c8a24d]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Playbooks do Corretor Private
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: 'Script de Reativação Fria',
                  desc: 'Reconectar com compradores que sumiram após a 1ª visita',
                  prompt: 'Gere um script de WhatsApp para reativar um comprador de alto padrão que não responde há 10 dias após uma visita técnica.',
                },
                {
                  title: 'Proposta com Entrada + Permuta',
                  desc: 'Como estruturar oferta mista com liquidez',
                  prompt: 'Qual a melhor estrutura para defender uma proposta que envolve 50% em dinheiro e 50% em permuta de imóvel comercial perante o proprietário?',
                },
                {
                  title: 'Gatilho de Escassez Off-Market',
                  desc: 'Criar senso de urgência sem parecer desesperado',
                  prompt: 'Como apresentar um imóvel estritamente off-market para um empresário C-Level enfatizando o sigilo e a concorrência de outros compradores?',
                },
                {
                  title: 'Diagnóstico Geral da Carteira',
                  desc: 'Quais etapas do funil precisam de tração',
                  prompt: 'Analise toda a minha carteira de clientes VIP atual e me diga onde estão os maiores gargalos de fechamento e onde está o dinheiro mais rápido.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="p-2.5 bg-[#171717] hover:bg-[#1f1b13] border border-neutral-800 hover:border-[#c8a24d]/50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-[#c8a24d] transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#c8a24d] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Chat Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-[#121212] border border-neutral-800 h-[680px]">
          {/* Chat Top Bar */}
          <div className="p-3.5 bg-[#161616] border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 bg-[#c8a24d]/20 border border-[#c8a24d]/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#c8a24d]" />
              </div>
              <div>
                <div className="text-xs font-black text-white tracking-wide">
                  Gemini 3.7 Flash • VIP Broker Intelligence
                </div>
                <div className="text-[10px] text-[#22c55e] flex items-center space-x-1 font-semibold">
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                  <span>Conectado ao Banco em Nuvem Firestore</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    text: `Histórico reiniciado. Estou pronto para uma nova análise tática da sua carteira de **${clients.length} clientes** e **${properties.length} imóveis**.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    chips: [
                      'Analisar leads com maior chance de fechamento',
                      'Criar script de WhatsApp para Cobertura Triplex',
                    ],
                  },
                ]);
              }}
              className="text-[11px] font-bold text-neutral-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer border border-neutral-700"
              title="Limpar conversa"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Nova Conversa</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 bg-[#c8a24d]/20 border border-[#c8a24d]/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#c8a24d]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] ${
                      isAssistant
                        ? 'bg-[#181818] border border-neutral-800 text-neutral-200'
                        : 'bg-[#c8a24d] text-black font-semibold'
                    } p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group`}
                  >
                    {/* Timestamp & Copy Header for Assistant */}
                    {isAssistant && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-[10px] text-neutral-400">
                        <span className="font-bold text-[#c8a24d]">VIP COPILOT</span>
                        <div className="flex items-center space-x-2">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="p-1 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Copiar resposta / script"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-[#22c55e]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap font-sans space-y-2">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return (
                            <h4 key={lIdx} className="text-sm font-extrabold text-[#c8a24d] pt-1">
                              {line.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (line.startsWith('> ')) {
                          return (
                            <blockquote
                              key={lIdx}
                              className="border-l-2 border-[#c8a24d] pl-3 py-1 bg-black/40 my-2 text-neutral-200 italic font-mono text-[11px] sm:text-xs"
                            >
                              {line.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>

                    {/* Interactive Prompt Chips */}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap gap-1.5">
                        {msg.chips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleQuickPrompt(chip)}
                            className="text-[10px] font-bold bg-neutral-900 hover:bg-[#c8a24d]/20 text-neutral-300 hover:text-[#c8a24d] border border-neutral-700 hover:border-[#c8a24d]/50 px-2.5 py-1 transition-colors cursor-pointer"
                          >
                            ✦ {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-[#c8a24d]/20 border border-[#c8a24d]/50 flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8a24d]" />
                </div>
                <div className="bg-[#181818] border border-neutral-800 p-4 text-xs text-neutral-400 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#c8a24d] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#c8a24d] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-[#c8a24d] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="font-semibold text-neutral-300 ml-1">
                    Analisando mercado, carteira e gerando argumentos de alta conversão...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-[#151515] border-t border-neutral-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pergunte ao Copiloto (ex: 'Crie um script para o Dr. Henrique sobre a Cobertura')..."
                className="flex-1 bg-[#1d1d1d] border border-neutral-700 text-xs sm:text-sm text-white px-4 py-3 focus:border-[#c8a24d] focus:outline-none transition-colors placeholder:text-neutral-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-[#c8a24d] hover:bg-[#b8933e] disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed text-black font-black px-4 py-3 text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5 fill-black" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500">
              <span>Pressione Enter para enviar • O Copiloto tem acesso ao portfólio completo em tempo real</span>
              <span className="text-[#c8a24d] font-semibold">Gemini 3.7 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
