import React from 'react';
import { TranslationContent } from '../types';

interface AboutSectionProps {
  t: TranslationContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ t }) => {
  return (
    <section id="sobre" className="bg-white text-neutral-900 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Photo with editorial offset box */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative max-w-md w-full">
              {/* Subtle back decorative outline frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-neutral-300 pointer-events-none hidden sm:block" />

              {/* Main Image Container */}
              <div className="relative bg-neutral-200 overflow-hidden shadow-sm">
                <img
                  src="/images/sergio_langer_portrait_1787582073474.jpg"
                  alt="Sergio Langer"
                  className="w-full h-auto object-cover grayscale contrast-110 aspect-square sm:aspect-[4/4.5]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-7">
            {/* Section Tag */}
            <div className="mb-6">
              <span className="text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                {t.about.tag}
              </span>
              <div className="w-12 h-[2px] bg-neutral-900 mt-2" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-6">
              {t.about.title}
            </h2>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed mb-10 max-w-2xl">
              {t.about.description}
            </p>

            {/* Bullet Points with Em Dash */}
            <ul className="space-y-4 text-neutral-900 font-semibold text-base sm:text-lg">
              {t.about.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  <span className="text-neutral-900 font-normal text-xl select-none">—</span>
                  <span className="text-neutral-900">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
