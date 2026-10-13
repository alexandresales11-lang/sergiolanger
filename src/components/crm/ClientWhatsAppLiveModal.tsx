import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  Check,
  CheckCheck,
  Building2,
  ExternalLink,
  ShieldCheck,
  Paperclip,
  RefreshCw,
  Copy,
  ChevronDown,
  User,
  Tag,
  DollarSign,
  MapPin,
  Clock,
  MessageSquare
} from 'lucide-react';
import { ClientVIP, Property, WhatsAppChatMessage } from '../../types';
import { formatCompactCurrency, formatCurrency } from '../../data/crmData';

interface ClientWhatsAppLiveModalProps {
  client: ClientVIP | null;
  properties: Property[];
  onClose: () => void;
  onSendMessage: (clientId: string, message: WhatsAppChatMessage) => void;
  onSyncHistory?: (clientId: string, messages: WhatsAppChatMessage[]) => void;
}

export const ClientWhatsAppLiveModal: React.FC<ClientWhatsAppLiveModalProps> = ({
  client,
  properties,
  onClose,
  onSendMessage,
  onSyncHistory,
}) => {
  if (!client) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPropertyCode, setSelectedPropertyCode] = useState<string>('');
  const [showPropertyDrawer, setShowPropertyDrawer] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages: WhatsAppChatMessage[] = client.chatHistory || [];

  // Fetch real WhatsApp messages from Evolution API
  const fetchLiveHistory = async () => {
    if (!client?.phone) return;
    setIsSyncing(true);
    try {
      const evoUrl = localStorage.getItem('evolution_api_url');
      const evoKey = localStorage.getItem('evolution_api_key');
      const evoInstance = localStorage.getItem('evolution_instance_name');

      const res = await fetch('/api/whatsapp/evolution/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: evoUrl || undefined,
          apiKey: evoKey || undefined,
          instanceName: evoInstance || undefined,
          number: client.phone
        })
      });

      const data = await res.json().catch(() => ({}));
      if (data?.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        if (onSyncHistory) {
          onSyncHistory(client.id, data.messages);
        } else {
          data.messages.forEach((msg: WhatsAppChatMessage) => {
            const exists = chatMessages.some(m => m.text === msg.text || m.id === msg.id);
            if (!exists) {
              onSendMessage(client.id, msg);
            }
          });
        }
      }
    } catch (err) {
      console.warn('Falha ao sincronizar histórico WhatsApp:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveHistory();
  }, [client.id, client.phone]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Send message directly from CRM to WhatsApp
  const handleSendBrokerMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    setIsSending(true);
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
    if (selectedPropertyCode) setSelectedPropertyCode('');

    // Check if Evolution API credentials exist
    const evoUrl = localStorage.getItem('evolution_api_url');
    const evoKey = localStorage.getItem('evolution_api_key');
    const evoInstance = localStorage.getItem('evolution_instance_name');

    // Send via Evolution API backend proxy
    try {
      const res = await fetch('/api/whatsapp/evolution/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: evoUrl || undefined,
          apiKey: evoKey || undefined,
          instanceName: evoInstance || undefined,
          number: client.phone,
          text: textToSend.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSendSuccessToast(true);
        setTimeout(() => setSendSuccessToast(false), 3000);
      }
    } catch (err) {
      console.warn('Erro ao disparar Evolution API:', err);
    } finally {
      setIsSending(false);
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
          properties,
          scenario,
          context: {
            role: 'whatsapp_response_generator',
            lastMessage: chatMessages[chatMessages.length - 1]?.text,
            properties,
          },
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setInputMessage(data.reply);
      } else {
        const firstName = client.name.split(' ')[0];
        if (scenario === 'schedule_visit') {
          setInputMessage(`Olá ${firstName}, organizei com a equipe uma janela de visita estritamente privada nesta quinta às 16h ou sexta às 11h. Qual horário fica melhor para sua agenda?`);
        } else if (scenario === 'send_dossier') {
          setInputMessage(`Prezado ${firstName}, preparei o Dossiê Arquitetônico Confidencial com fotos exclusivas e planta. Posso lhe encaminhar o PDF reservado por aqui?`);
        } else {
          setInputMessage(`Compreendo sua análise, ${firstName}. Essa propriedade possui valor de m² justificado pela exclusividade do terreno e segurança armada blindada, um ativo irreproduzível.`);
        }
      }
    } catch (err) {
      const firstName = client.name.split(' ')[0];
      setInputMessage(`Olá ${firstName}, tenho uma oportunidade confidencial no portfólio que se encaixa no seu perfil. Gostaria de ver os detalhes hoje?`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(client.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const cleanDigitsPhone = client.phone.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#0b141a] text-white border border-[#2a3942] shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[92vh] max-h-[880px]">
        
        {/* TOP HEADER - AUTHENTIC WHATSAPP DARK + LUXURY REAL ESTATE */}
        <div className="bg-[#202c33] px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#2a3942] shrink-0">
          
          {/* Contact Profile Info */}
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#111b21] border-2 border-[#c8a24d] text-[#c8a24d] font-black flex items-center justify-center text-sm shadow-md">
                {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-[#202c33] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                  {client.name}
                </h3>
                <span className="bg-[#c8a24d]/15 text-[#c8a24d] border border-[#c8a24d]/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {client.profile}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-[#8696a0] mt-0.5">
                <span className="font-mono text-white/90">{client.phone}</span>
                <button
                  onClick={handleCopyPhone}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Copiar telefone"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                </button>
                <span>•</span>
                <span className="text-[#22c55e] font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  <span>Evolution API Online</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Sync History Button */}
            <button
              onClick={fetchLiveHistory}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 bg-[#111b21] hover:bg-[#182229] border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Sincronizar histórico do WhatsApp"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c8a24d]' : ''}`} />
              <span className="hidden md:inline">{isSyncing ? 'Sincronizando...' : 'Atualizar Chat'}</span>
            </button>

            {/* Open WhatsApp Web Tab */}
            <a
              href={`https://web.whatsapp.com/send?phone=${cleanDigitsPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-[#005c4b] hover:bg-[#007a64] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              title="Abrir diretamente no WhatsApp Web"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Web</span>
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-[#2a3942] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-COLUMNS BODY: (CHAT AREA + LEAD DOSSIER SIDEBAR) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* MAIN CHAT CANVAS (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0b141a] relative border-r border-[#2a3942]">
            
            {/* WhatsApp Doodle Pattern Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Toast for successful delivery */}
            {sendSuccessToast && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#005c4b] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-[#22c55e]/40 flex items-center space-x-1.5 animate-in fade-in slide-in-from-top-2">
                <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                <span>Mensagem entregue via WhatsApp real!</span>
              </div>
            )}

            {/* Message Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 z-10">
              
              {/* Date Header Badge */}
              <div className="flex justify-center my-2">
                <span className="bg-[#182229] border border-[#2a3942] text-[#8696a0] text-[11px] font-medium px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  Conversa Criptografada • Evolution API
                </span>
              </div>

              {chatMessages.length === 0 && (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <div className="w-12 h-12 rounded-full bg-[#182229] border border-[#c8a24d]/30 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-[#c8a24d]" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Nenhuma mensagem recente no histórico</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    Envie uma mensagem abaixo para iniciar o atendimento no WhatsApp de <strong className="text-white">{client.name}</strong>.
                  </p>
                </div>
              )}

              {chatMessages.map((msg) => {
                const isBroker = msg.sender === 'broker' || msg.sender === 'ai_concierge';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBroker ? 'justify-end' : 'justify-start'} animate-in fade-in duration-100`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[72%] p-2.5 sm:px-3.5 sm:py-2 text-[13px] leading-relaxed shadow-md relative ${
                        isBroker
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs'
                          : 'bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-xs'
                      }`}
                    >
                      {/* Attached Property Card if any */}
                      {msg.propertyCode && (
                        <div className="mb-2 p-2 bg-black/20 rounded-lg border border-white/10 flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#ffd279] shrink-0" />
                          <span className="text-xs font-bold text-[#ffd279]">
                            Imóvel Anexado: {msg.propertyCode}
                          </span>
                        </div>
                      )}

                      {/* Text Content */}
                      <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                      {/* Timestamp & Checks inline bottom right */}
                      <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-[#8696a0] select-none">
                        <span>{msg.timestamp || 'Agora'}</span>
                        {isBroker && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* BOTTOM COMPOSER & SMART BAR */}
            <div className="bg-[#202c33] p-3 sm:p-4 border-t border-[#2a3942] space-y-2 z-10 shrink-0">
              
              {/* AI Quick Response Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-0.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#c8a24d] flex items-center space-x-1 shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>Respostas Rápidas IA:</span>
                </span>
                
                <button
                  onClick={() => handleGenerateAiSuggestion('schedule_visit')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 hover:text-white px-2.5 py-1 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                >
                  📅 Agendar Visita Privada
                </button>
                
                <button
                  onClick={() => handleGenerateAiSuggestion('send_dossier')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 hover:text-white px-2.5 py-1 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                >
                  💎 Dossiê Off-Market
                </button>
                
                <button
                  onClick={() => handleGenerateAiSuggestion('objection_price')}
                  disabled={isAiGenerating}
                  className="bg-[#111b21] hover:bg-[#182229] border border-neutral-700 hover:border-[#c8a24d] text-[11px] text-neutral-300 hover:text-white px-2.5 py-1 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                >
                  🛡️ Contornar Objeção
                </button>
              </div>

              {/* Property Attachment Selector (if toggled) */}
              {showPropertyDrawer && (
                <div className="p-3 bg-[#111b21] border border-[#2a3942] rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-bold text-white flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-[#c8a24d]" />
                      <span>Selecionar Imóvel para Envio</span>
                    </span>
                    <button onClick={() => setShowPropertyDrawer(false)} className="text-neutral-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPropertyCode(p.code);
                          setShowPropertyDrawer(false);
                          setInputMessage(`💎 *Dossiê Off-Market: ${p.title}* (${p.code})\n📍 Bairro: ${p.neighborhood}\n📐 Área: ${p.areaM2}m² | ${p.suites} Suítes\n💰 Valor: ${formatCurrency(p.price)}\n\nPodemos agendar uma visita técnica confidencial?`);
                        }}
                        className="p-2 bg-[#182229] hover:bg-[#202c33] border border-neutral-800 hover:border-[#c8a24d] rounded-lg text-left transition-colors cursor-pointer flex items-center space-x-2"
                      >
                        <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover rounded" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{p.title}</p>
                          <p className="text-[10px] text-[#ffd279]">{formatCompactCurrency(p.price)} • {p.neighborhood}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Input Row */}
              <div className="flex items-end space-x-2">
                <button
                  onClick={() => setShowPropertyDrawer(!showPropertyDrawer)}
                  className={`p-3 rounded-xl transition-colors cursor-pointer shrink-0 ${
                    showPropertyDrawer || selectedPropertyCode
                      ? 'bg-[#c8a24d] text-black'
                      : 'bg-[#2a3942] text-neutral-300 hover:text-white'
                  }`}
                  title="Anexar Ficha de Imóvel"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 bg-[#2a3942] rounded-xl flex items-center px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#00a884]">
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
                    placeholder={`Mensagem para ${client.name.split(' ')[0]}... (Enter para enviar)`}
                    className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder:text-[#8696a0] resize-none max-h-24 py-1"
                  />
                </div>

                <button
                  onClick={() => handleSendBrokerMessage()}
                  disabled={!inputMessage.trim() || isSending}
                  className="bg-[#00a884] hover:bg-[#008f6f] disabled:bg-[#2a3942] disabled:text-[#8696a0] text-black font-bold p-3.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-lg flex items-center justify-center"
                  title="Enviar mensagem para o WhatsApp do cliente"
                >
                  {isSending ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <Send className="w-5 h-5 fill-black text-black" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: DOSSIÊ & CLIENT PROFILE (4 cols) */}
          <div className="lg:col-span-4 bg-[#111b21] p-4 sm:p-5 overflow-y-auto space-y-4 border-t lg:border-t-0 border-[#2a3942]">
            
            {/* Card: VIP Dossier */}
            <div className="bg-[#182229] border border-[#2a3942] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#c8a24d] flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Perfil do Comprador VIP</span>
                </span>
                <span className="text-[10px] font-bold bg-[#22c55e]/15 text-[#22c55e] px-2 py-0.5 rounded">
                  {client.urgency} Urgência
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Orçamento Alvo:</span>
                  <span className="font-bold text-[#ffd279] font-mono">
                    {formatCompactCurrency(client.targetBudgetMin)} - {formatCompactCurrency(client.targetBudgetMax)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Liquidez:</span>
                  <span className="font-semibold text-white">{client.liquidityStatus}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Estágio Atual:</span>
                  <span className="font-bold text-white capitalize">{client.stage.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Neighborhoods tags */}
              <div className="pt-2 border-t border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1.5">
                  Bairros de Interesse:
                </span>
                <div className="flex flex-wrap gap-1">
                  {client.preferredNeighborhoods.map((n, i) => (
                    <span key={i} className="bg-[#111b21] border border-neutral-700 text-neutral-300 text-[10px] px-2 py-0.5 rounded">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Property Card */}
            {properties[0] && (
              <div className="bg-[#182229] border border-[#2a3942] p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Imóvel em Destaque no Perfil</span>
                </span>

                <div className="relative rounded-lg overflow-hidden border border-neutral-800">
                  <img src={properties[0].imageUrl} alt={properties[0].title} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                    <p className="text-xs font-bold text-white truncate">{properties[0].title}</p>
                    <p className="text-[10px] text-[#ffd279] font-mono font-bold">{formatCurrency(properties[0].price)}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const p = properties[0];
                    const text = `💎 *Dossiê Off-Market: ${p.title}* (${p.code})\n📍 Bairro: ${p.neighborhood}\n📐 Área: ${p.areaM2}m² | ${p.suites} Suítes | ${p.parkingSpots} Vagas\n💰 Valor: ${formatCurrency(p.price)}\n\nPodemos fazer uma visita técnica confidencial nesta semana?`;
                    handleSendBrokerMessage(text);
                  }}
                  className="w-full bg-[#c8a24d] hover:bg-[#b8933e] text-black font-black text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5 fill-black" />
                  <span>Enviar Ficha deste Imóvel</span>
                </button>
              </div>
            )}

            {/* Direct Instructions */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-[11px] text-neutral-400 space-y-1">
              <p className="text-white font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Integração Evolution API Ativa</span>
              </p>
              <p>
                Cada mensagem enviada é processada em tempo real e entregue no WhatsApp do destinatário.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
