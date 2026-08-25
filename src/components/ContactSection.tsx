import React from 'react';
import { MessageCircle, Instagram, Linkedin, Mic } from 'lucide-react';
import { TranslationContent } from '../types';

interface ContactSectionProps {
  t: TranslationContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ t }) => {
  const whatsappUrl =
    'https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20as%20solu%C3%A7%C3%B5es%20do%20Sergio%20Langer.';

  return (
    <section id="contato" className="bg-white text-neutral-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            {t.contact.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-900 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-4">
          {t.contact.title}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed mb-8">
          {t.contact.description}
        </p>

        {/* WhatsApp Button */}
        <div className="mb-12">
          <a
            id="btn-whatsapp-direct"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm sm:text-base px-7 py-3.5 transition-colors shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white/10" />
            <span>{t.contact.btnWhatsapp}</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-6 text-neutral-900">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-900 hover:text-[#c8a24d] transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-900 hover:text-[#c8a24d] transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#conteudos"
            aria-label="Podcast Vem Pra Mesa"
            className="text-neutral-900 hover:text-[#c8a24d] transition-colors"
          >
            <Mic className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
