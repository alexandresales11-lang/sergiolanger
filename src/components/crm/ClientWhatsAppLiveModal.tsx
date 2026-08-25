import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  PhoneCall,
  CheckCircle2,
  Lock,
  Bot,
  User,
  Paperclip,
  Image as ImageIcon,
  ExternalLink,
  Clock,
  ShieldCheck,
  Building2,
  AlertCircle,
  CornerDownRight,
  Maximize2
} from 'lucide-react';
import { ClientVIP, Property, WhatsAppChatMessage } from '../../types';
import { formatCompactCurrency, formatCurrency } from '../../data/crmData';

interface ClientWhatsAppLiveModalProps {
  client: ClientVIP | null;
  properties: Property[];
  onClose: () => void;
  onSendMessage: (clientId: string, message: WhatsAppChatMessage) => void;
}

export const ClientWhatsAppLiveModal: React.FC<ClientWhatsAppLiveModalProps> = ({
  client,
  properties,
  onClose,
  onSendMessage,
}) => {
  if (!client) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [selectedPropertyCode, setSelectedPropertyCode] = useState<string>('');
  const [simulateClientReply, setSimulateClientReply] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages: WhatsAppChatMessage[] = client.chatHistory || [];

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, autoScroll]);

  // Send message directly from CRM to WhatsApp
  const handleSendBrokerMessage = async (customText?: string, openWhatsAppApp: boolean = true) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: WhatsAppChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'broker',
      senderName: 'Sergio Langer',
      text: textToSend.trim(),
      timestamp: timeNow,
      status: 'sent',
      propertyCode: selectedPropertyCode || undefined,
    };

    onSendMessage(client.id, newMsg);
    if (!customText) setInputMessage('');

    // Check if Evolution API credentials exist
    const evoUrl = localStorage.getItem('evolution_api_url');
    const evoKey = localStorage.getItem('evolution_api_key');
    const evoInstance = localStorage.getItem('evolution_instance_name');

    if (evoUrl && evoKey && evoInstance) {
      try {
        // Send via Evolution API in the background
        fetch('/api/whatsapp/evolution/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiUrl: evoUrl,
            apiKey: evoKey,
            instanceName: evoInstance,
            number: client.phone,
            text: textToSend.trim(),
          }),
        }).catch((err) => console.warn('Falha background Evolution API:', err));
      } catch (err) {
        console.warn('Erro ao disparar Evolution API:', err);
      }
    } else if (openWhatsAppApp) {
      // If Evolution API not configured yet, open WhatsApp Web/App
      const cleanPhone = client.phone.replace(/\D/g, '');
      const encodedText = encodeURIComponent(textToSend.trim());
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
      window.open(waUrl, '_blank');
    }

    // Only if client simulation mode is explicitly enabled by the user
    if (simulateClientReply) {
      setTimeout(async () => {
        try {
          // Request AI simulation of client response
          const response = await fetch('/api/ai/copilot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: textToSend,
              context: {
                role: 'simulate_vip_client',
                clientProfile: client.profile,
                clientName: client.name,
                targetBudget: `R$ ${(client.targetBudgetMin / 1000000).toFixed(0)}M - ${(client.targetBudgetMax / 1000000).toFixed(0)}M`,
                urgency: client.urgency,
              },
            }),
          });
          const data = await response.json();
          const replyText = data.reply || `Perfeito, Sergio. Vamos agendar para o meu arquiteto conferir a planta amanhã às 16h. Obrigado pela discrição!`;

          const clientReplyMsg: WhatsAppChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'client',
            senderName: client.name,
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          };
          onSendMessage(client.id, clientReplyMsg);
        } catch (e) {
          const clientReplyMsg: WhatsAppChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'client',
            senderName: client.name,
            text: `Perfeito, Sergio. Recebi os dados e vou avaliar com a família. Podemos falar hoje às 18h?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          };
          onSendMessage(client.id, clientReplyMsg);
        }
      }, 2500);
    }
  };

  // Generate AI Concierge Smart Suggestion for this specific conversation
  const handleGenerateAiSuggestion = async (scenario: 'schedule_visit' | 'objection_price' | 'send_dossier') => {
    setIsAiGenerating(true);
    try {
      const associatedProp = properties.find((p) => p.code === selectedPropertyCode) || properties[0];
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          property: associatedProp,
          scenario,
          context: {
            role: 'whatsapp_response_generator',
            lastMessage: chatMessages[chatMessages.length - 1]?.text,
          },
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setInputMessage(data.reply);
      } else {
        if (scenario === 'schedule_visit') {
          setInputMessage(`Olá ${client.name.split(' ')[0]}, organizei com a equipe uma janela de visita estritamente privada nesta quinta às 16h ou sexta às 11h. Qual desses horários é mais conveniente para sua agenda?`);
        } else if (scenario === 'send_dossier') {
          setInputMessage(`Prezado ${client.name.split(' ')[0]}, acabei de gerar o Dossiê Arquitetônico Confidencial da propriedade (${associatedProp.code}). Posso lhe encaminhar o PDF reservado por aqui?`);
        } else {
          setInputMessage(`Compreendo sua análise, ${client.name.split(' ')[0]}. Essa propriedade possui valor de m² justificado pela exclusividade do terreno e segurança armada blindada, um ativo irreproduzível na região.`);
        }
      }
    } catch (err) {
      setInputMessage(`Olá ${client.name.split(' ')[0]}, tenho duas novidades confidenciais para compartilhar sobre o portfólio. Gostaria de uma ligação de 5 minutos hoje?`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const associatedProp = properties.find((p) => p.id === client.associatedPropertyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0e161a] text-white border border-[#2a3942] shadow-2xl rounded-xl overflow-hidden flex flex-col h-[90vh]">
        {/* Top App Header */}
        <div className="bg-[#202c33] px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#2a3942]">
          {/* Left: Client Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#182229] border border-[#c8a24d]/60 text-[#c8a24d] font-black flex items-center justify-center text-sm shadow-md">
                {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-[#202c33] rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">{client.name}</h3>
                <span className="bg-[#c8a24d]/20 text-[#c8a24d] border border-[#c8a24d]/30 text-[10px] font-black px-2 py-0.5 rounded">
                  {client.profile}
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] text-[#22c55e] font-bold">
                  • WhatsApp Conectado
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex items-center space-x-3 mt-0.5">
                <span>{client.phone}</span>
                <span>•</span>
                <span className="text-[#ffd279] font-semibold">
                  Orçamento: {formatCompactCurrency(client.targetBudgetMin)} - {formatCompactCurrency(client.targetBudgetMax)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Open Native WhatsApp Tab Button */}
            <a
              href={`https://api.whatsapp.com/send?phone=${client.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 bg-[#128c7e] hover:bg-[#075e54] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
              title="Abrir diretamente no aplicativo do WhatsApp"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir no WhatsApp Web</span>
            </a>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-[#2a3942] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Columns Body: (Chat Timeline + Real Estate Fast-Action Sidebar) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main WhatsApp Chat Canvas (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0b141a] relative border-r border-[#2a3942]">
            {/* Encryption & Security Badge */}
            <div className="p-2.5 flex justify-center border-b border-[#2a3942]/40 bg-[#111b21]/80">
              <div className="bg-[#182229] border border-[#2a3942] text-neutral-300 text-[11px] px-3 py-1 rounded text-center shadow-sm flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Central de Disparo WhatsApp • Mensagens enviadas são salvas no CRM</span>
              </div>
            </div>

            {/* Message Feed */}
            <div
              className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 my-auto">
                  <div className="w-12 h-12 rounded-full bg-[#182229] border border-[#c8a24d]/30 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-[#c8a24d]" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Histórico de WhatsApp do Lead</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    Digite uma mensagem abaixo para enviar diretamente ao WhatsApp de <strong className="text-white">{client.name}</strong> ({client.phone}).
                  </p>
                </div>
              )}

              {chatMessages.map((msg) => {
                const isBroker = msg.sender === 'broker' || msg.sender === 'ai_concierge';
                const isAi = msg.sender === 'ai_concierge';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBroker ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3.5 text-xs sm:text-[13px] leading-relaxed shadow relative ${
                        isBroker
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                          : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border-l-2 border-[#c8a24d]'
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between space-x-2 text-[10px] font-bold mb-1 opacity-80">
                        <span>{msg.senderName}</span>
                        {isAi && (
                          <span className="bg-[#c8a24d] text-black px-1.5 py-0.2 rounded font-black text-[9px]">
                            IA AUTO
                          </span>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Property Tag Attached if any */}
                      {msg.propertyCode && (
                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center space-x-1.5 text-[11px] text-[#ffd279] font-bold">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Imóvel Anexado: {msg.propertyCode}</span>
                        </div>
                      )}

                      {/* Timestamp & Status */}
                      <div className="flex items-center justify-end space-x-1 mt-1.5 text-[10px] text-[#8696a0]">
                        <span>{msg.timestamp}</span>
                        {isBroker && <CheckCircle2 className="w-3.5 h-3.5 text-[#53bdeb]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer & Toolbar */}
            <div className="bg-[#202c33] p-3 sm:p-4 border-t border-[#2a3942] space-y-2">
              {/* Quick AI Suggestion Chips */}
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[#c8a24d] flex items-center space-x-1 shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>Sugerir Resposta IA:</span>
                </span>
                <button
                  onClick={() => handleGenerateAiSuggestion('schedule_visit')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  📅 Agendar Visita Privada
                </button>
                <button
                  onClick={() => handleGenerateAiSuggestion('send_dossier')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  💎 Oferecer Dossiê Off-Market
                </button>
                <button
                  onClick={() => handleGenerateAiSuggestion('objection_price')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  🛡️ Contornar Objeção de Preço
                </button>
              </div>

              {/* Main Input Form */}
              <div className="flex items-center space-x-2">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendBrokerMessage();
                    }
                  }}
                  placeholder={`Digite uma mensagem para enviar ao WhatsApp de ${client.name.split(' ')[0]}... (Enter para enviar)`}
                  className="flex-1 bg-[#2a3942] text-white text-xs sm:text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] placeholder:text-[#8696a0] resize-none"
                />

                <button
                  onClick={() => handleSendBrokerMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-[#00a884] hover:bg-[#008f6f] disabled:bg-[#2a3942] disabled:text-[#8696a0] text-black font-bold p-3.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-lg flex items-center justify-center"
                  title="Enviar mensagem para o WhatsApp do cliente"
                >
                  <Send className="w-5 h-5 fill-black text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Client Dossier & Property Quick-Share (4 cols on lg) */}
          <div className="lg:col-span-4 bg-[#111b21] p-4 sm:p-5 overflow-y-auto space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c8a24d] block mb-1">
                Ficha Rápida do Comprador
              </span>
              <h4 className="text-sm font-bold text-white">{client.name}</h4>
              <p className="text-xs text-neutral-400 mt-1">{client.notes}</p>
            </div>

            {/* Quick Property Selector to Share */}
            <div className="bg-[#182229] border border-[#2a3942] p-4 space-y-3 rounded-lg">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#c8a24d]" />
                <span>Anexar Imóvel na Conversa</span>
              </span>

              <select
                value={selectedPropertyCode}
                onChange={(e) => setSelectedPropertyCode(e.target.value)}
                className="w-full bg-[#111b21] border border-neutral-700 text-xs text-white p-2.5 rounded focus:border-[#c8a24d] focus:outline-none"
              >
                <option value="">Selecione um imóvel do portfólio...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.code}>
                    {p.code} - {p.title} ({formatCompactCurrency(p.price)})
                  </option>
                ))}
              </select>

              {selectedPropertyCode && (
                <button
                  onClick={() => {
                    const p = properties.find((prop) => prop.code === selectedPropertyCode);
                    if (p) {
                      const text = `💎 *Dossiê Off-Market Exclusivo: ${p.title}* (${p.code})\n📍 Bairro: ${p.neighborhood}\n📐 Área: ${p.areaM2}m² | ${p.suites} Suítes | ${p.parkingSpots} Vagas\n💰 Valor: ${formatCurrency(p.price)}\n\nPodemos fazer uma visita técnica confidencial nesta semana?`;
                      handleSendBrokerMessage(text);
                    }
                  }}
                  className="w-full bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs py-2 rounded uppercase tracking-wider transition-colors cursor-pointer shadow flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Ficha do Imóvel</span>
                </button>
              )}
            </div>

            {/* Preferences Tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Bairros Preferidos
              </span>
              <div className="flex flex-wrap gap-1.5">
                {client.preferredNeighborhoods.map((n, idx) => (
                  <span
                    key={idx}
                    className="bg-[#182229] border border-[#2a3942] text-neutral-200 text-xs px-2 py-0.5 rounded"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Smart Simulator Toggle */}
            <div className="bg-[#182229] border border-[#2a3942] p-3.5 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Modo Teste / Simulação IA</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Se ativado, a IA simula uma resposta do cliente após seu envio (apenas para testes).
                </div>
              </div>
              <input
                type="checkbox"
                checked={simulateClientReply}
                onChange={(e) => setSimulateClientReply(e.target.checked)}
                className="w-4 h-4 accent-[#22c55e] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
