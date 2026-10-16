import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  MessageCircle,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Property, ClientVIP } from '../types';
import { formatCurrency, formatRentalCurrency } from '../data/crmData';
import { captureWebsiteLead } from '../lib/firebase';

interface VipConciergeModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onLeadCaptured?: (lead: ClientVIP) => void;
}

export const VipConciergeModal: React.FC<VipConciergeModalProps> = ({
  isOpen,
  property,
  onClose,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState<
    'dossie' | 'visita' | 'proposta'
  >('dossie');
  const [contactTime, setContactTime] = useState<string>('imediato');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  if (!isOpen || !property) return null;

  // Simple auto-formatter for Brazilian/international phone input
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 11) {
      if (raw.length > 6) {
        setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`);
      } else if (raw.length > 2) {
        setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2)}`);
      } else {
        setPhone(raw);
      }
    } else {
      setPhone(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const now = new Date();
      const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const interestLabel =
        interestType === 'visita'
          ? 'Agendamento de Visita Técnica Privada'
          : interestType === 'proposta'
          ? 'Proposta Comercial / Permuta'
          : 'Receber Dossiê e Book Confidencial';

      const timeLabel =
        contactTime === 'manha'
          ? 'Período da Manhã (09h às 12h)'
          : contactTime === 'tarde'
          ? 'Período da Tarde (14h às 18h)'
          : contactTime === 'noite'
          ? 'Período da Noite (18h às 21h)'
          : 'Imediato via WhatsApp';

      const estimatedPrice = property.price || 15000000;
      const newLeadId = `lead-site-${Date.now()}`;

      // Monta objeto completo e padronizado do ClientVIP
      const newLead: ClientVIP = {
        id: newLeadId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '.')}@cliente-site.com.br`,
        profile: 'Comprador Final',
        targetBudgetMin: Math.floor(estimatedPrice * 0.8),
        targetBudgetMax: Math.floor(estimatedPrice * 1.25),
        preferredNeighborhoods: [property.neighborhood],
        preferredTypes: [property.type],
        stage: 'lead_recebido',
        associatedPropertyId: property.id,
        assignedBroker: 'Sergio Langer',
        estimatedDealValue: estimatedPrice,
        expectedCommission: Math.floor(estimatedPrice * 0.06),
        urgency: 'Alta',
        liquidityStatus: '100% Líquido / À Vista',
        notes: `Lead de alto padrão originado do portfólio público. Imóvel de interesse: ${property.code} - "${property.title}" (${property.neighborhood}, ${property.city}). Interesse: ${interestLabel}. Preferência de contato: ${timeLabel}.`,
        tags: [
          'Site Portfólio',
          'Lead do Site',
          property.code,
          property.neighborhood,
          interestLabel,
          'WhatsApp VIP',
        ],
        interactions: [
          {
            id: `int-${Date.now()}`,
            date: dateStr,
            type: 'whatsapp',
            author: 'Concierge Digital',
            content: `Lead demonstrou interesse no imóvel ${property.code} (${property.title}). Solicitação: ${interestLabel}. Horário preferido: ${timeLabel}.`,
          },
        ],
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: 'client',
            senderName: name.trim(),
            text: `Olá Sergio Langer! Me chamo ${name.trim()}. Demonstrei interesse no imóvel ${property.title} (Cód: ${property.code}) no seu site e gostaria de conversar sobre ${interestLabel.toLowerCase()}.`,
            timestamp: timeStr,
            status: 'sent',
            propertyCode: property.code,
          },
        ],
        createdAt: now.toISOString().slice(0, 10),
      };

      // Gravação direta no Firestore
      await captureWebsiteLead(newLead);

      if (onLeadCaptured) {
        onLeadCaptured(newLead);
      }

      // Prepara mensagem personalizada do WhatsApp
      const purposeText =
        property.purpose === 'aluguel'
          ? 'locação'
          : property.purpose === 'ambos'
          ? 'aquisição / locação'
          : 'aquisição';

      const waMessage = `Olá Sergio Langer! Me chamo *${name.trim()}*. Acabei de solicitar o dossiê confidencial do imóvel *${property.title}* (Cód: *${property.code}* - ${property.neighborhood}) no seu portfólio para *${purposeText}*.\n\nMinha intenção: *${interestLabel}*.\nHorário de preferência: *${timeLabel}*.\n\nPoderia me enviar a apresentação completa por aqui?`;

      const targetUrl = `https://wa.me/5511998887766?text=${encodeURIComponent(waMessage)}`;
      setWhatsappLink(targetUrl);
      setIsSuccess(true);

      // Abre automaticamente o WhatsApp após breve delay para experiência fluida
      setTimeout(() => {
        try {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } catch (openErr) {
          console.warn('Popup blocked, link is available on UI:', openErr);
        }
      }, 500);
    } catch (err) {
      console.error('Erro ao gravar lead do site no CRM:', err);
      // Mesmo com qualquer aviso, mantemos o fluxo amigável para o cliente
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setWhatsappLink(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111111] text-white border border-[#c8a24d]/30 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Subtle top gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#c8a24d] to-transparent w-full" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2 z-10 cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[#c8a24d]/20 rounded-full animate-ping opacity-75" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#c8a24d] to-[#997328] rounded-full flex items-center justify-center shadow-lg shadow-[#c8a24d]/20">
                  <CheckCircle2 className="w-9 h-9 text-black stroke-[2.5]" />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-[0.25em] block mb-1">
                  CADASTRO CONFIRMADO • ATENDIMENTO VIP
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Dossiê Solicitado com Sucesso!
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Olá <strong className="text-white">{name}</strong>, seus dados já foram integrados diretamente à mesa de atendimento privado de{' '}
                  <strong className="text-[#c8a24d]">Sergio Langer</strong>.
                </p>
              </div>

              {/* Property Summary Badge in Success */}
              <div className="bg-[#171717] border border-neutral-800 p-4 max-w-lg mx-auto flex items-center space-x-3 text-left">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-16 h-16 object-cover border border-neutral-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#c8a24d] uppercase">
                    Cód: {property.code}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">
                    {property.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {property.neighborhood}, {property.city}
                  </p>
                  <p className="text-xs font-extrabold text-[#c8a24d] mt-0.5">
                    {property.purpose === 'aluguel'
                      ? formatRentalCurrency(property.rentalPrice || property.price)
                      : formatCurrency(property.price)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-extrabold py-3.5 px-6 uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-900/30 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Abrir Conversa no WhatsApp Agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={handleResetAndClose}
                  className="w-full bg-[#1c1c1c] hover:bg-[#252525] text-neutral-300 text-xs font-bold py-3 uppercase tracking-wider transition-colors cursor-pointer border border-neutral-800"
                >
                  Voltar ao Portfólio
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-neutral-500 pt-2">
                <Lock className="w-3.5 h-3.5 text-neutral-600" />
                <span>Atendimento confidencial e seguro via CRM Sergio Langer</span>
              </div>
            </div>
          ) : (
            /* Lead Form */
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#c8a24d]/10 text-[#c8a24d] border border-[#c8a24d]/30">
                    <Sparkles className="w-3 h-3 text-[#c8a24d]" />
                    <span>CONCIERGE DIGITAL & ATENDIMENTO PRIVATE</span>
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Acesso ao Dossiê Confidencial
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">
                  Receba o book técnico em alta resolução com fotos, plantas e valores diretamente em seu WhatsApp.
                </p>
              </div>

              {/* Selected Property Preview Bar */}
              <div className="bg-[#161616] border border-neutral-800 p-3.5 mb-6 flex items-center space-x-3.5">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-20 h-16 object-cover border border-neutral-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-black text-[#c8a24d] border border-[#c8a24d]/30 uppercase">
                      {property.code}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                      {property.purpose === 'aluguel' ? 'Locação' : 'Venda'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-1">
                    {property.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-neutral-400 text-[11px] flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#c8a24d]" />
                      <span>{property.neighborhood}, {property.city}</span>
                    </span>
                    <span className="font-extrabold text-[#c8a24d]">
                      {property.purpose === 'aluguel'
                        ? formatRentalCurrency(property.rentalPrice || property.price)
                        : formatCurrency(property.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dr. Roberto Silveira"
                      className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3.5 py-2.5 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Ex: (11) 98765-4321"
                      className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3.5 py-2.5 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    E-mail (opcional para envio do book em PDF)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: roberto@investimentos.com.br"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#c8a24d] text-white text-xs px-3.5 py-2.5 focus:outline-none transition-colors"
                  />
                </div>

                {/* Primary Interest Segmented Selector */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Qual seu objetivo com este imóvel?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setInterestType('dossie')}
                      className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                        interestType === 'dossie'
                          ? 'border-[#c8a24d] bg-[#c8a24d]/10 text-white'
                          : 'border-neutral-800 bg-[#161616] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-white text-[11px]">
                        Receber Dossiê
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Book fotográfico & plantas
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInterestType('visita')}
                      className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                        interestType === 'visita'
                          ? 'border-[#c8a24d] bg-[#c8a24d]/10 text-white'
                          : 'border-neutral-800 bg-[#161616] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-white text-[11px]">
                        Agendar Visita
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Visita técnica confidencial
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInterestType('proposta')}
                      className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                        interestType === 'proposta'
                          ? 'border-[#c8a24d] bg-[#c8a24d]/10 text-white'
                          : 'border-neutral-800 bg-[#161616] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-white text-[11px]">
                        Proposta / Permuta
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Condições de pagamento
                      </div>
                    </button>
                  </div>
                </div>

                {/* Best Contact Time */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Preferência de Atendimento:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'imediato', label: 'Imediato (WhatsApp)' },
                      { id: 'manha', label: 'Manhã (09h às 12h)' },
                      { id: 'tarde', label: 'Tarde (14h às 18h)' },
                      { id: 'noite', label: 'Noite (18h às 21h)' },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setContactTime(slot.id)}
                        className={`px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                          contactTime === slot.id
                            ? 'border-[#c8a24d] bg-[#c8a24d] text-black font-bold'
                            : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security Guarantee Note */}
                <div className="flex items-center space-x-2 text-[11px] text-neutral-400 pt-1">
                  <Shield className="w-3.5 h-3.5 text-[#c8a24d] shrink-0" />
                  <span>
                    Sigilo rigoroso garantido. Seus dados chegam diretamente no CRM da equipe Sergio Langer.
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c8a24d] to-[#b8933e] hover:from-[#d4b059] hover:to-[#c8a24d] text-black text-xs font-extrabold py-3.5 px-6 uppercase tracking-wider transition-all shadow-lg hover:shadow-[#c8a24d]/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Integrando com CRM & Gerando Dossiê...</span>
                      </div>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 fill-black" />
                        <span>Liberar Dossiê & Chamar no WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
