import React from 'react';
import { TranslationContent } from '../types';

interface ConsultingSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const ConsultingSection: React.FC<ConsultingSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section id="consultoria" className="bg-black text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
            {t.consulting.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-600 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
          {t.consulting.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-3xl mb-14">
          {t.consulting.description}
        </p>

        {/* Services List Section */}
        <div className="mb-14">
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
              {t.consulting.subheading}
            </span>
          </div>

          {/* 2-Column Grid for Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 max-w-4xl">
            {t.consulting.services.map((service) => (
              <div key={service.id} className="flex items-baseline space-x-4">
                <span className="text-neutral-500 font-bold text-sm sm:text-base select-none w-7 shrink-0">
                  {service.id}
                </span>
                <span className="text-white font-bold text-base sm:text-lg">
                  {service.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            id="consulting-btn-cta"
            onClick={() => onOpenModal('Consultoria para Incorporadoras')}
            className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm"
          >
            {t.consulting.btnCta}
          </button>
        </div>
      </div>
    </section>
  );
};
