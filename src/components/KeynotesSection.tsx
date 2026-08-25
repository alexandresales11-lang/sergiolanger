import React from 'react';
import { Mic, Check } from 'lucide-react';
import { TranslationContent } from '../types';

interface KeynotesSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const KeynotesSection: React.FC<KeynotesSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section id="palestras" className="bg-white text-neutral-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            {t.keynotes.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-900 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-6 max-w-4xl">
          {t.keynotes.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed max-w-3xl mb-10">
          {t.keynotes.description}
        </p>

        {/* CTA Button */}
        <div className="mb-16 md:mb-20">
          <button
            id="keynotes-btn-cta"
            onClick={() => onOpenModal('Contratação de Palestra')}
            className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm"
          >
            {t.keynotes.btnCta}
          </button>
        </div>

        {/* Two Columns: Temas & Diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Temas */}
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase block mb-6">
              {t.keynotes.topicsTitle}
            </span>
            <div className="space-y-4">
              {t.keynotes.topics.map((topic, idx) => (
                <div key={idx} className="flex items-center space-x-3.5">
                  <Mic className="w-4 h-4 text-neutral-700 shrink-0" strokeWidth={2.2} />
                  <span className="text-sm sm:text-base font-semibold text-neutral-900">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Diferenciais */}
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase block mb-6">
              {t.keynotes.diffTitle}
            </span>
            <div className="space-y-4">
              {t.keynotes.differentials.map((diff, idx) => (
                <div key={idx} className="flex items-center space-x-3.5">
                  <Check className="w-4 h-4 text-neutral-700 shrink-0" strokeWidth={2.5} />
                  <span className="text-sm sm:text-base font-semibold text-neutral-900">
                    {diff}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
