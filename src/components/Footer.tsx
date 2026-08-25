import React from 'react';
import { TranslationContent } from '../types';

interface FooterProps {
  t: TranslationContent;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <p className="text-xs sm:text-sm text-neutral-400 tracking-wide">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
};
