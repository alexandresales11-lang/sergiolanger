import React from 'react';
import { TranslationContent } from '../types';

interface IndicatorsSectionProps {
  t: TranslationContent;
}

export const IndicatorsSection: React.FC<IndicatorsSectionProps> = ({ t }) => {
  return (
    <section id="indicadores" className="bg-white text-neutral-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Section Tag */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            {t.indicators.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-400 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-20">
          {t.indicators.title}
        </h2>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200">
          {t.indicators.stats.map((stat, idx) => (
            <div key={idx} className="pt-6 sm:pt-0 lg:px-6 flex flex-col items-center">
              <span className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-neutral-950 tracking-tight leading-none mb-3.5">
                {stat.value}
              </span>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-[200px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
