import React from 'react';
import { TranslationContent } from '../types';

interface MissionSectionProps {
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
}

export const MissionSection: React.FC<MissionSectionProps> = ({ t, onOpenModal }) => {
  return (
    <section id="missao" className="bg-black text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
            {t.mission.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-600 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
          {t.mission.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-3xl mb-14">
          {t.mission.description}
        </p>

        {/* Content Grid: Left audience list & CTA, Right Event Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-6">
                {t.mission.subheading}
              </span>

              <div className="divide-y divide-neutral-800 border-t border-neutral-800">
                {t.mission.audience.map((item) => (
                  <div key={item.id} className="py-4.5 flex items-center space-x-5">
                    <span className="text-neutral-500 font-bold text-sm select-none w-6 shrink-0">
                      {item.id}
                    </span>
                    <span className="text-white font-bold text-base sm:text-lg">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                id="mission-btn-cta"
                onClick={() => onOpenModal('Missão Alto Padrão - Próxima Edição')}
                className="bg-[#c8a24d] hover:bg-[#b8933e] text-black font-bold text-xs sm:text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 text-center cursor-pointer shadow-sm w-full sm:w-auto inline-block"
              >
                {t.mission.btnCta}
              </button>
            </div>
          </div>

          {/* Right Column: Photo */}
          <div className="lg:col-span-6">
            <div className="relative bg-neutral-900 overflow-hidden shadow-2xl border border-neutral-800">
              <img
                src="/images/missao_alto_padrao_event_1787582084347.jpg?v=2"
                alt="Missão Alto Padrão & Luxo"
                className="w-full h-auto object-cover aspect-[16/10] hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.failed) {
                    target.dataset.failed = 'true';
                    target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
