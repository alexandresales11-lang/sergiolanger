import React, { useRef, useState } from 'react';
import {
  Download,
  Check,
  Maximize2,
  Sparkles,
  MapPin,
  BedDouble,
  Car,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Share2,
} from 'lucide-react';
import { Property, SocialPostFormat, SocialArtTheme } from '../../types';
import { formatCurrency, formatRentalCurrency } from '../../data/crmData';

interface CrmSocialArtPreviewProps {
  property: Property;
  format: SocialPostFormat;
  theme: SocialArtTheme;
  showPrice: boolean;
  customBadge: string;
  agentName: string;
  agentCreci: string;
  selectedPhotoUrl: string;
  carouselSlide?: number;
  onSelectPhotoUrl?: (url: string) => void;
}

export const CrmSocialArtPreview: React.FC<CrmSocialArtPreviewProps> = ({
  property,
  format,
  theme,
  showPrice,
  customBadge,
  agentName,
  agentCreci,
  selectedPhotoUrl,
  carouselSlide = 0,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const artContainerRef = useRef<HTMLDivElement>(null);

  const priceFormatted = property.purpose === 'aluguel' && property.rentalPrice
    ? formatRentalCurrency(property.rentalPrice)
    : formatCurrency(property.price);

  // Background style & color scheme
  const isDarkGold = theme === 'dark_gold';
  const isMinimalWhite = theme === 'minimal_white';
  const isChampagne = theme === 'editorial_champagne';

  const themeClasses = isDarkGold
    ? 'bg-neutral-950 text-white border-neutral-800'
    : isMinimalWhite
    ? 'bg-[#f8f8f8] text-neutral-900 border-neutral-300'
    : 'bg-[#14120e] text-[#f4ecd8] border-[#c8a24d]/30';

  const goldAccent = isMinimalWhite ? '#9c7b2b' : '#c8a24d';

  // Function to render HTML5 canvas and trigger PNG download
  const handleDownloadArt = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isStory = format === 'story_vertical';
      const width = 1080;
      const height = isStory ? 1920 : 1080;

      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = isDarkGold ? '#0a0a0a' : isMinimalWhite ? '#fcfcfc' : '#14120e';
      ctx.fillRect(0, 0, width, height);

      // Load Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedPhotoUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => {
          // If CORS fails on direct download, draw stylized luxury placeholder
          resolve();
        };
      });

      // Draw property image in top section
      try {
        if (img.complete && img.naturalWidth > 0) {
          const imgHeight = isStory ? height * 0.58 : height * 0.62;
          ctx.drawImage(img, 0, 0, width, imgHeight);

          // Gradient overlay over image
          const gradient = ctx.createLinearGradient(0, imgHeight * 0.45, 0, imgHeight);
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, isDarkGold ? '#0a0a0a' : isMinimalWhite ? '#fcfcfc' : '#14120e');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, imgHeight * 0.45, width, imgHeight * 0.55);
        } else {
          // Fallback banner
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 0, width, height * 0.6);
        }
      } catch {
        // Fallback banner
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, width, height * 0.6);
      }

      // Draw Gold Border / Frame
      ctx.strokeStyle = '#c8a24d';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Top Tag Badge
      ctx.fillStyle = '#c8a24d';
      ctx.fillRect(70, 70, 360, 52);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(customBadge.toUpperCase(), 90, 105);

      // Property Reference Code
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`REF: ${property.code}`, width - 260, 105);

      // Content section starting point
      const startY = isStory ? height * 0.62 : height * 0.66;

      // Location
      ctx.fillStyle = '#c8a24d';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`📍 ${property.neighborhood.toUpperCase()}, ${property.city.toUpperCase()}`, 70, startY);

      // Title
      ctx.fillStyle = isMinimalWhite ? '#111111' : '#ffffff';
      ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
      const truncatedTitle = property.title.length > 42 ? property.title.slice(0, 40) + '...' : property.title;
      ctx.fillText(truncatedTitle, 70, startY + 60);

      // Specs row
      ctx.fillStyle = isMinimalWhite ? '#555' : '#cccccc';
      ctx.font = 'normal 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`📐 ${property.areaM2} m²   •   🛏️ ${property.suites} Suítes   •   🚗 ${property.parkingSpots} Vagas`, 70, startY + 120);

      // Price or Confidential
      if (showPrice) {
        ctx.fillStyle = '#c8a24d';
        ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(priceFormatted, 70, startY + 195);
      } else {
        ctx.fillStyle = '#c8a24d';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('DISPONIBILIDADE CONFIDENCIAL SOB CONSULTA', 70, startY + 195);
      }

      // Footer: Agent / Branding
      ctx.strokeStyle = 'rgba(200, 162, 77, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, height - 140);
      ctx.lineTo(width - 70, height - 140);
      ctx.stroke();

      ctx.fillStyle = isMinimalWhite ? '#111' : '#fff';
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SERGIO LANGER', 70, height - 90);

      ctx.fillStyle = '#c8a24d';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('PRIVATE REAL ESTATE', 70, height - 60);

      ctx.fillStyle = isMinimalWhite ? '#444' : '#aaaaaa';
      ctx.font = 'normal 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${agentName} | ${agentCreci}`, width - 420, height - 80);

      // Export canvas to download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `arte-instagram-${property.code}-${format}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Erro ao renderizar arte:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Visual Canvas Display Frame */}
      <div
        ref={artContainerRef}
        className={`relative overflow-hidden shadow-2xl transition-all duration-300 border ${
          format === 'feed_square'
            ? 'w-full max-w-[420px] aspect-square'
            : format === 'story_vertical'
            ? 'w-full max-w-[320px] aspect-[9/16]'
            : 'w-full max-w-[420px] aspect-square'
        } ${themeClasses}`}
      >
        {/* Subtle Luxury Outer Framing */}
        <div className="absolute inset-2 border border-[#c8a24d]/30 pointer-events-none z-20" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <span className="bg-[#c8a24d] text-black font-extrabold text-[10px] sm:text-[11px] px-2.5 py-1 tracking-widest uppercase shadow-md">
            {customBadge}
          </span>
          <span className="bg-black/75 backdrop-blur-sm border border-[#c8a24d]/40 text-[#c8a24d] font-bold text-[10px] px-2 py-0.5 tracking-wider uppercase">
            REF: {property.code}
          </span>
        </div>

        {/* Carousel Multi-Slide Header when in carousel mode */}
        {format === 'carousel' && (
          <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-20 text-[10px] text-white/80">
            <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
              Slide {carouselSlide + 1} de 4
            </span>
            <span className="text-[#c8a24d] font-bold text-[9px] uppercase tracking-wider">
              {carouselSlide === 0
                ? 'Capa Principal'
                : carouselSlide === 1
                ? 'Ficha Técnica'
                : carouselSlide === 2
                ? 'Diferenciais'
                : 'Agendamento VIP'}
            </span>
          </div>
        )}

        {/* Main Visual Image Area */}
        {format === 'carousel' && carouselSlide > 0 ? (
          // Inner Slides for Carousel
          <div className="h-full flex flex-col justify-between p-7 pt-16 relative z-10">
            {carouselSlide === 1 && (
              <div className="space-y-4 my-auto">
                <span className="text-xs font-bold text-[#c8a24d] uppercase tracking-widest">
                  FICHA TÉCNICA EXCLUSIVA
                </span>
                <h3 className="text-xl font-black text-white">{property.title}</h3>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-neutral-900/90 border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">ÁREA PRIVATIVA</span>
                    <span className="font-extrabold text-[#c8a24d] text-base">{property.areaM2} m²</span>
                  </div>
                  <div className="p-3 bg-neutral-900/90 border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">SUÍTES MASTER</span>
                    <span className="font-extrabold text-[#c8a24d] text-base">{property.suites} Suítes</span>
                  </div>
                  <div className="p-3 bg-neutral-900/90 border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">VAGAS COBERTAS</span>
                    <span className="font-extrabold text-[#c8a24d] text-base">{property.parkingSpots} Vagas</span>
                  </div>
                  <div className="p-3 bg-neutral-900/90 border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">LOCALIZAÇÃO</span>
                    <span className="font-extrabold text-white text-xs">{property.neighborhood}</span>
                  </div>
                </div>
              </div>
            )}

            {carouselSlide === 2 && (
              <div className="space-y-4 my-auto">
                <span className="text-xs font-bold text-[#c8a24d] uppercase tracking-widest">
                  DESTAQUES & REQUINTE
                </span>
                <h3 className="text-lg font-black text-white">Diferenciais da Propriedade</h3>
                <div className="space-y-2 pt-1 text-xs">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2.5 p-2 bg-neutral-900/90 border border-[#c8a24d]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8a24d]" />
                      <span className="text-neutral-200 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {carouselSlide === 3 && (
              <div className="space-y-5 my-auto text-center px-2">
                <span className="text-xs font-bold text-[#c8a24d] uppercase tracking-widest">
                  EXPERIÊNCIA EXCLUSIVA
                </span>
                <h3 className="text-2xl font-black text-white">Pronto para Conhecer?</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Visitas confidenciais e apresentação privativa do imóvel para investidores qualificados.
                </p>
                <div className="pt-2">
                  <span className="inline-block bg-[#c8a24d] text-black font-extrabold text-xs px-5 py-2.5 uppercase tracking-wider shadow-lg">
                    Envie um Direct no Instagram
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-white font-extrabold block">SERGIO LANGER</span>
                <span className="text-[#c8a24d] text-[9px] font-bold">PRIVATE REAL ESTATE</span>
              </div>
              <span className="text-neutral-400">{agentName}</span>
            </div>
          </div>
        ) : (
          // Standard Photo Card (Feed, Story, Slide 0)
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Background Property Image with Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={selectedPhotoUrl}
                alt={property.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div
                className={`absolute inset-0 ${
                  isDarkGold
                    ? 'bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent'
                    : isMinimalWhite
                    ? 'bg-gradient-to-t from-white via-white/80 to-transparent'
                    : 'bg-gradient-to-t from-[#14120e] via-[#14120e]/60 to-transparent'
                }`}
                style={{ height: '100%', top: '0%' }}
              />
            </div>

            {/* Spacer */}
            <div className="h-1/3" />

            {/* Bottom Content Information Overlay */}
            <div className="relative z-10 p-5 sm:p-6 space-y-3">
              {/* Location pin */}
              <div className="flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-[#c8a24d] uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.neighborhood}, {property.city}</span>
              </div>

              {/* Title */}
              <h2 className={`font-black tracking-tight leading-tight line-clamp-2 ${
                format === 'story_vertical' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              } ${isMinimalWhite ? 'text-neutral-900' : 'text-white'}`}>
                {property.title}
              </h2>

              {/* Specs Badge Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
                <span className="bg-black/60 backdrop-blur-sm border border-neutral-700/80 px-2 py-0.5 text-neutral-300">
                  {property.areaM2} m²
                </span>
                <span className="bg-black/60 backdrop-blur-sm border border-neutral-700/80 px-2 py-0.5 text-neutral-300">
                  {property.suites} Suítes
                </span>
                <span className="bg-black/60 backdrop-blur-sm border border-neutral-700/80 px-2 py-0.5 text-neutral-300">
                  {property.parkingSpots} Vagas
                </span>
              </div>

              {/* Price / Confidential Statement */}
              <div className="pt-1">
                {showPrice ? (
                  <div className="text-base sm:text-lg font-black text-[#c8a24d]">
                    {priceFormatted}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[#c8a24d] uppercase tracking-wider flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Sob Consulta / Off-Market</span>
                  </div>
                )}
              </div>

              {/* Brand Footer */}
              <div className="pt-3 border-t border-[#c8a24d]/30 flex items-center justify-between text-[10px]">
                <div className="leading-none">
                  <span className={`font-black uppercase tracking-wider block ${isMinimalWhite ? 'text-black' : 'text-white'}`}>
                    SERGIO LANGER
                  </span>
                  <span className="text-[#c8a24d] font-bold text-[8px] tracking-widest uppercase">
                    PRIVATE REAL ESTATE
                  </span>
                </div>
                <div className="text-right leading-none">
                  <span className={`font-semibold text-[10px] ${isMinimalWhite ? 'text-neutral-800' : 'text-neutral-300'}`}>
                    {agentName}
                  </span>
                  <span className="text-neutral-500 text-[8px] block mt-0.5">
                    {agentCreci}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direct Action Toolbar Below Preview */}
      <div className="flex items-center justify-between w-full max-w-[420px] mt-4 px-1 gap-2">
        <button
          onClick={handleDownloadArt}
          disabled={downloading}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c8a24d] to-[#e8cb7d] text-black font-extrabold text-xs py-2.5 px-4 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-900" />
              <span>Imagem Baixada!</span>
            </>
          ) : downloading ? (
            <span>Gerando PNG HD...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Baixar Arte em Alta (PNG)</span>
            </>
          )}
        </button>
      </div>
      <p className="text-[11px] text-neutral-500 mt-2 text-center">
        Arte gerada com proporção 1080px otimizada para o feed do Instagram & Meta Ads.
      </p>
    </div>
  );
};
