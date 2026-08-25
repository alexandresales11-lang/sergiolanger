import React from 'react';
import { TranslationContent } from '../types';

interface AccelerationSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const AccelerationSection: React.FC<AccelerationSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section id="aceleracao" className="bg-white text-neutral-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            {t.acceleration.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-900 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-6 max-w-4xl">
          {t.acceleration.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed max-w-3xl mb-16">
          {t.acceleration.description}
        </p>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 mb-16">
          {t.acceleration.pillars.map((pillar) => (
            <div key={pillar.id} className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-400 mb-3 select-none">
                {pillar.id}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div>
          <button
            id="acceleration-btn-cta"
            onClick={() => onOpenModal('Aceleração de Corretores - Próxima Turma')}
            className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm"
          >
            {t.acceleration.btnCta}
          </button>
        </div>
      </div>
    </section>
  );
};
