import React from 'react';
import { TranslationContent } from '../types';

interface BottomCtaSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section className="bg-black text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Subtle Line Accent */}
        <div className="w-12 h-[2px] bg-neutral-700 mx-auto mb-8" />

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-12 max-w-3xl mx-auto">
          {t.bottomCta.title}
        </h2>

        {/* 3 Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-5">
          {/* White Button: Consultoria */}
          <button
            id="bottom-cta-consultoria"
            onClick={() => onOpenModal('Solicitar Consultoria')}
            className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm"
          >
            {t.bottomCta.btnConsulting}
          </button>

          {/* Gold Outline: Missão */}
          <a
            id="bottom-cta-missao"
            href="#missao"
            className="w-full sm:w-auto border border-[#c8a24d] hover:bg-[#c8a24d]/10 text-[#c8a24d] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer"
          >
            {t.bottomCta.btnMission}
          </a>

          {/* Gold Outline: Palestra */}
          <a
            id="bottom-cta-palestra"
            href="#palestras"
            className="w-full sm:w-auto border border-[#c8a24d] hover:bg-[#c8a24d]/10 text-[#c8a24d] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer"
          >
            {t.bottomCta.btnKeynotes}
          </a>
        </div>
      </div>
    </section>
  );
};
