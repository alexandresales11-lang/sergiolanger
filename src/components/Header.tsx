import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, LayoutDashboard } from 'lucide-react';
import { Language, TranslationContent, CrmUser } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationContent;
  onOpenModal: (subject?: string) => void;
  onOpenCRM: () => void;
  currentUser?: CrmUser | null;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, t, onOpenCRM, currentUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, href: '#inicio' },
    { label: t.nav.portfolio || 'PORTFÓLIO', href: '#portfolio' },
    { label: t.nav.consulting, href: '#consultoria' },
    { label: t.nav.acceleration, href: '#aceleracao' },
    { label: t.nav.mission, href: '#missao' },
    { label: t.nav.keynotes, href: '#palestras' },
    { label: t.nav.podcast, href: '#conteudos' },
    { label: t.nav.contact, href: '#contato' },
  ];

  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#111111]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-[#141414] border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#inicio"
          id="logo-brand"
          className="group flex flex-col justify-center leading-none text-left tracking-wider"
        >
          <span className="text-white font-extrabold text-lg sm:text-xl tracking-[0.2em] uppercase">
            SERGIO
          </span>
          <span className="text-white font-extrabold text-lg sm:text-xl tracking-[0.2em] uppercase">
            LANGER
          </span>
          <div className="w-10 h-[2px] bg-white/40 group-hover:bg-[#c8a24d] mt-1.5 transition-colors" />
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-[13px] font-medium tracking-wider text-neutral-300 hover:text-white transition-colors uppercase whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Section: Language switcher & CRM Portal Entry */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-semibold tracking-wider">
          <div className="flex items-center space-x-1.5 border-r border-neutral-800 pr-3">
            <button
              onClick={() => setLang('pt')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                lang === 'pt'
                  ? 'bg-[#2a2a2a] text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              BR <span className="text-[10px] font-normal">PT</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#2a2a2a] text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              US <span className="text-[10px] font-normal">EN</span>
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                lang === 'es'
                  ? 'bg-[#2a2a2a] text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ES <span className="text-[10px] font-normal">ES</span>
            </button>
          </div>

          {/* CRM Portal Entrance Button */}
          <button
            onClick={onOpenCRM}
            className="flex items-center space-x-2 bg-[#1b1b1b] hover:bg-[#252525] text-[#c8a24d] hover:text-[#e4be68] border border-[#c8a24d]/40 font-bold text-xs tracking-wider uppercase px-3.5 py-2 transition-all cursor-pointer shadow-sm group"
            title={currentUser ? `Conectado como ${currentUser.name}` : 'Acesso restrito à equipe'}
          >
            {currentUser ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span>CRM ({currentUser.name.split(' ')[0]})</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#c8a24d] group-hover:scale-110 transition-transform" />
                <span>Área VIP / CRM</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 xl:hidden">
          {/* Quick CRM Button Mobile */}
          <button
            onClick={onOpenCRM}
            className="flex items-center space-x-1.5 bg-[#1b1b1b] text-[#c8a24d] border border-[#c8a24d]/40 text-[10px] font-bold px-2.5 py-1.5 rounded uppercase"
          >
            {currentUser ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>CRM</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-[#c8a24d]" />
                <span>CRM</span>
              </>
            )}
          </button>

          {/* Mobile Language Switcher */}
          <div className="flex items-center space-x-1 text-[11px] font-semibold tracking-wider mr-1">
            <button
              onClick={() => setLang('pt')}
              className={`px-1.5 py-1 rounded ${
                lang === 'pt' ? 'bg-[#2a2a2a] text-white font-bold' : 'text-neutral-400'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-1 rounded ${
                lang === 'en' ? 'bg-[#2a2a2a] text-white font-bold' : 'text-neutral-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-1.5 py-1 rounded ${
                lang === 'es' ? 'bg-[#2a2a2a] text-white font-bold' : 'text-neutral-400'
              }`}
            >
              ES
            </button>
          </div>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-300 hover:text-white p-2 rounded-md focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#111111] border-b border-neutral-800 px-6 py-6 space-y-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCRM();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs uppercase tracking-wider py-3 mb-4 transition-colors"
          >
            {currentUser ? (
              <>
                <LayoutDashboard className="w-4 h-4" />
                <span>Entrar no CRM ({currentUser.name})</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Acessar CRM Imobiliário VIP (Equipe)</span>
              </>
            )}
          </button>

          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium tracking-widest text-neutral-300 hover:text-white uppercase py-2 border-b border-neutral-800/60"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

