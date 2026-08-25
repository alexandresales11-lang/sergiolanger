import React from 'react';
import { Mic, BarChart3, Globe, FileText, MapPin, Users } from 'lucide-react';
import { TranslationContent } from '../types';

interface ContentSectionProps {
  t: TranslationContent;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ t }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'podcast':
        return <Mic className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      case 'chart':
        return <BarChart3 className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      case 'globe':
        return <Globe className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      case 'file':
        return <FileText className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      case 'pin':
        return <MapPin className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      case 'users':
        return <Users className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
      default:
        return <FileText className="w-5 h-5 text-neutral-300" strokeWidth={1.75} />;
    }
  };

  return (
    <section id="conteudos" className="bg-black text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Tag */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
            {t.content.tag}
          </span>
          <div className="w-12 h-[2px] bg-neutral-600 mt-2" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-16 max-w-4xl">
          {t.content.title}
        </h2>

        {/* 6 Boxed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.content.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-black border border-neutral-800 p-8 sm:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors"
            >
              <div className="mb-6">
                {getIcon(card.icon)}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
