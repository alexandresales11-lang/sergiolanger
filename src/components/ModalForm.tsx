import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, Send } from 'lucide-react';
import { TranslationContent } from '../types';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
  t: TranslationContent;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  subject,
  t,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('incorporador');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // after showing success, reset and close after a delay
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }, 400);
  };

  const handleDirectWhatsapp = () => {
    const encodedText = encodeURIComponent(
      `Olá, meu nome é ${name || '[Seu Nome]'} e gostaria de informações sobre ${
        subject || 'Consultoria / Palestra / Missão Alto Padrão'
      }.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-[#111111] text-white border border-neutral-800 p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-[#c8a24d] mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {t.modal.successMessage}
            </h3>
            <p className="text-neutral-400 text-sm max-w-md">
              Nossa equipe especializada entrará em contato em até 24 horas úteis.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c8a24d] uppercase block mb-1">
                {subject || t.modal.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.modal.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                {t.modal.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  {t.modal.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    {t.modal.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@empresa.com.br"
                    className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    {t.modal.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  {t.modal.roleLabel}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-3 text-sm focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="incorporador">Incorporador / Construtor</option>
                  <option value="corretor">Corretor de Imóveis de Alto Padrão</option>
                  <option value="gestor">Gestor Comercial / Diretor Imobiliário</option>
                  <option value="empresa">Empresa / Organização de Eventos</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  {t.modal.messageLabel}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte brevemente sobre seu momento ou objetivo..."
                  className="w-full bg-[#1c1c1c] border border-neutral-700 focus:border-[#c8a24d] text-white px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase py-3.5 px-6 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.modal.submitBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsapp}
                  className="w-full bg-transparent hover:bg-white/5 border border-[#15803d] text-[#22c55e] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase py-3 px-6 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#22c55e]" />
                  <span>{t.modal.directWhatsappBtn}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
