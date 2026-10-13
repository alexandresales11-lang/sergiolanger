import { Property, SocialPost, InstagramAccountConfig, SocialCaptionTone } from '../types';
import { formatCurrency, formatRentalCurrency } from './crmData';

export const DEFAULT_INSTAGRAM_ACCOUNT: InstagramAccountConfig = {
  isConnected: true,
  username: 'sergiolanger.realestate',
  profileName: 'Sergio Langer | Luxury Real Estate',
  followersCount: 54200,
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  facebookPageId: '109849204918231',
  instagramAccountId: '17841405309204918',
  accessTokenMasked: 'EAAGNO...92xk8L (Token Ativo de Longa Duração)',
  lastSync: 'Hoje às 09:40',
  autoHashtags: true,
  includeWatermark: true,
};

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-soc-01',
    propertyId: 'prop-01',
    propertyTitle: 'Penthouse Suspensa Fasano Itaim',
    propertyCode: 'FAS-702',
    propertyNeighborhood: 'Itaim Bibi',
    propertyCity: 'São Paulo',
    propertyPrice: 38500000,
    format: 'feed_square',
    status: 'published',
    caption: `⚜️ Penthouse Suspensa Fasano Itaim | Exclusividade Absoluta\n\nUma obra-prima residencial no coração do Itaim Bibi. Com 680 m² privativos, piscina aquecida de borda infinita debruçada sobre o skyline paulistano e acabamentos importados que redefinem o conceito de sofisticação.\n\n▪ 680 m² privativos\n▪ 4 Suítes com mármore italiano\n▪ 6 Vagas cobertas\n▪ Concierge e serviços exclusivos Fasano\n\nDisponibilidade off-market para clientes selecionados. Contato confidencial via direct ou link na bio.`,
    hashtags: ['#SergioLanger', '#FasanoItaim', '#PenthouseSaoPaulo', '#ImoveisDeLuxo', '#OffMarketRealEstate', '#ArquiteturaDeLuxo', '#HighEndLiving'],
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    publishedAt: '2026-10-10 18:30',
    theme: 'dark_gold',
    showPrice: false,
    customBadge: 'OFF-MARKET EXCLUSIVO',
    agentName: 'Sergio Langer',
    agentCreci: 'CRECI 198420-F',
    likesCount: 1420,
    commentsCount: 68,
    createdAt: '2026-10-10T14:00:00Z',
    instagramPostId: 'IG_POST_1892048172',
  },
  {
    id: 'post-soc-02',
    propertyId: 'prop-02',
    propertyTitle: 'Mansão Contemporânea Cidade Jardim',
    propertyCode: 'CJ-104',
    propertyNeighborhood: 'Cidade Jardim',
    propertyCity: 'São Paulo',
    propertyPrice: 42000000,
    format: 'story_vertical',
    status: 'scheduled',
    scheduledFor: '2026-10-14T19:00',
    caption: `Arquitetura autoral e integração total com a natureza no ponto mais cobiçado de Cidade Jardim.\n\nAdega subterrânea climatizada para 1.500 garrafas, spa privativo e heliponto homologado.\n\nAgende sua visita privada com Sergio Langer.`,
    hashtags: ['#CidadeJardim', '#MansaoContemporanea', '#SergioLanger', '#UltraLuxury', '#ArquiteturaModerna'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    theme: 'dark_gold',
    showPrice: true,
    customBadge: 'HELIPONTO HOMOLOGADO',
    agentName: 'Sergio Langer',
    agentCreci: 'CRECI 198420-F',
    createdAt: '2026-10-12T11:20:00Z',
  },
  {
    id: 'post-soc-03',
    propertyId: 'prop-03',
    propertyTitle: 'Estância Haras Boa Vista',
    propertyCode: 'FBV-018',
    propertyNeighborhood: 'Fazenda Boa Vista',
    propertyCity: 'Porto Feliz',
    propertyPrice: 65000000,
    format: 'carousel',
    status: 'draft',
    caption: `O refúgio definitivo no campo: Haras privativo na Fazenda Boa Vista.\n\n32.000 m² de terreno com cocheiras climatizadas, pista hípica de areia de sílica e residência assinada por Studio MK27.\n\nDeslize para ver todos os detalhes dessa propriedade incomparável.`,
    hashtags: ['#FazendaBoaVista', '#HarasDeLuxo', '#StudioMK27', '#VidaNoCampo', '#RealEstateBrazil'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    theme: 'editorial_champagne',
    showPrice: false,
    customBadge: 'HARAS EXCLUSIVO',
    agentName: 'Sergio Langer',
    agentCreci: 'CRECI 198420-F',
    createdAt: '2026-10-12T16:45:00Z',
  },
];

/**
 * Gera legendas automáticas inteligentes para qualquer imóvel em 3 estilos diferentes
 */
export function generateCaptionForProperty(property: Property, tone: SocialCaptionTone, showPrice: boolean = false): { caption: string; hashtags: string[] } {
  const priceFormatted = property.purpose === 'aluguel' && property.rentalPrice
    ? formatRentalCurrency(property.rentalPrice)
    : formatCurrency(property.price);

  const priceClause = showPrice
    ? `\n💰 Investimento: ${priceFormatted}\n`
    : `\n🔒 Valores e condições confidenciais sob consulta.\n`;

  const commonHashtags = [
    '#SergioLanger',
    '#MercadoImobiliarioDeLuxo',
    '#AltoPadrao',
    `#${property.neighborhood.replace(/\s+/g, '')}`,
    `#${property.city.replace(/\s+/g, '')}`,
    '#ArquiteturaAutoral',
    '#OffMarket',
    '#LuxuryHomes',
    '#PrivateClients'
  ];

  if (tone === 'luxury') {
    const caption = `⚜️ ${property.title} | ${property.neighborhood}, ${property.city} (Ref: ${property.code})\n\nUma experiência residencial esculpida para os mais exigentes padrões globais. Localizado em um dos endereços mais valorizados do país, este imóvel combina privacidade cirúrgica, materiais nobres e amplitude sem precedentes.\n\n📐 ${property.areaM2} m² de área privativa\n🛏️ ${property.suites} Suítes master impecáveis\n🚗 ${property.parkingSpots} Vagas cobertas\n✨ Destaques: ${property.highlights.slice(0, 3).join(' • ')}${priceClause}\nAtendimento estritamente confidencial para investidores e compradores qualificados. Envie uma mensagem direta ou solicite o dossier completo via link na bio.`;
    return { caption, hashtags: [...commonHashtags, '#UltraLuxury', '#DesignExclusivo'] };
  }

  if (tone === 'storytelling') {
    const caption = `✨ Onde cada detalhe conta uma história de requinte: ${property.title}.\n\nImagine acordar com uma vista panorâmica inigualável em ${property.neighborhood}, usufruindo da tranquilidade de um refúgio planejado em cada milímetro. Da iluminação natural que invade os ambientes à curadoria dos acabamentos, esta propriedade transcende o morar.\n\n▪ Espaços integrados com ${property.areaM2} m²\n▪ ${property.suites} Suítes confortáveis com closet\n▪ ${property.highlights.join(' | ')}${priceClause}\nPermita-se viver o extraordinário. Agendamento de visita privativa e exclusiva disponível com Sergio Langer.`;
    return { caption, hashtags: [...commonHashtags, '#LifestyleLuxo', '#DreamHome', '#ViverBem'] };
  }

  // investment tone
  const caption = `📊 OPORTUNIDADE ESTRATÉGICA OFF-MARKET | Código: ${property.code}\n\nAtivo de altíssima liquidez e preservação de patrimônio em ${property.neighborhood}, ${property.city}.\n\nPara investidores sofisticados que buscam segurança jurídica, localização premium de escassez e sólida valorização do metro quadrado.\n\n▫ Área Útil: ${property.areaM2} m²\n▫ Configuração: ${property.suites} Suítes | ${property.parkingSpots} Vagas\n▫ IPTU: ${formatCurrency(property.iptu)} / ano | Cond.: ${formatCurrency(property.condoFee)} / mês${priceClause}\nDossiê técnico e análise comparativa de mercado disponíveis para due diligence imediata. Solicite via direct.`;
  return { caption, hashtags: [...commonHashtags, '#InvestimentoImobiliario', '#PatrimonioFamilia', '#RealEstateInvest', '#YieldImobiliario'] };
}
