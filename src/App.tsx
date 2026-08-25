import { useState } from 'react';
import { Language } from './types';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ConsultingSection } from './components/ConsultingSection';
import { AccelerationSection } from './components/AccelerationSection';
import { MissionSection } from './components/MissionSection';
import { KeynotesSection } from './components/KeynotesSection';
import { ContentSection } from './components/ContentSection';
import { IndicatorsSection } from './components/IndicatorsSection';
import { BottomCtaSection } from './components/BottomCtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ModalForm } from './components/ModalForm';
import { CrmApp } from './components/crm/CrmApp';

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'crm'>('website');
  const [lang, setLang] = useState<Language>('pt');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>(undefined);

  const t = translations[lang];

  const handleOpenModal = (subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalSubject(undefined);
  };

  if (viewMode === 'crm') {
    return <CrmApp onBackToSite={() => setViewMode('website')} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#c8a24d] selection:text-black">
      {/* Fixed Navigation Bar */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenModal={handleOpenModal}
        onOpenCRM={() => setViewMode('crm')}
      />

      {/* Main Sections matching screenshots in exact order */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection t={t} onOpenModal={handleOpenModal} />

        {/* 2. Sobre Section (White) */}
        <AboutSection t={t} />

        {/* 3. Consultoria Section (Black) */}
        <ConsultingSection t={t} onOpenModal={handleOpenModal} />

        {/* 4. Aceleração Section (White) */}
        <AccelerationSection t={t} onOpenModal={handleOpenModal} />

        {/* 5. Missão Alto Padrão Section (Black) */}
        <MissionSection t={t} onOpenModal={handleOpenModal} />

        {/* 6. Palestras Section (White) */}
        <KeynotesSection t={t} onOpenModal={handleOpenModal} />

        {/* 7. Conteúdos & Referências Section (Black) */}
        <ContentSection t={t} />

        {/* 8. Indicadores Section (White) */}
        <IndicatorsSection t={t} />

        {/* 9. Conecte-se CTA Section (Black) */}
        <BottomCtaSection t={t} onOpenModal={handleOpenModal} />

        {/* 10. Contato Section (White) */}
        <ContactSection t={t} />
      </main>

      {/* Footer (Black) */}
      <Footer t={t} />

      {/* Interactive Modal Form */}
      <ModalForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        subject={modalSubject}
        t={t}
      />
    </div>
  );
}

