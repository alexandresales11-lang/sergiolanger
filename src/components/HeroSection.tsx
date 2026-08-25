import React from 'react';
import { TranslationContent } from '../types';

interface HeroSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section
      id="inicio"
      className="relative bg-black text-white pt-40 pb-28 md:pt-48 md:pb-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl mb-12">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 items-stretch sm:items-center">
            {/* Primary Gold Button */}
            <button
              id="hero-btn-consultoria"
              onClick={() => onOpenModal('Consultoria Estratégica')}
              className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm hover:shadow"
            >
              {t.hero.btnConsulting}
            </button>

            {/* Outlined Gold Button: Missão */}
            <a
              id="hero-btn-missao"
              href="#missao"
              className="border border-[#c8a24d] hover:bg-[#c8a24d]/10 text-[#c8a24d] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer"
            >
              {t.hero.btnMission}
            </a>

            {/* Outlined Gold Button: Palestra */}
            <a
              id="hero-btn-palestra"
              href="#palestras"
              className="border border-[#c8a24d] hover:bg-[#c8a24d]/10 text-[#c8a24d] font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer"
            >
              {t.hero.btnKeynotes}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
