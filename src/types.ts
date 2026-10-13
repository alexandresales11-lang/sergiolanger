export type Language = 'pt' | 'en' | 'es';

export interface TranslationContent {
  nav: {
    home: string;
    portfolio?: string;
    consulting: string;
    acceleration: string;
    mission: string;
    keynotes: string;
    podcast: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    btnConsulting: string;
    btnMission: string;
    btnKeynotes: string;
  };
  about: {
    tag: string;
    title: string;
    description: string;
    bullets: string[];
  };
  consulting: {
    tag: string;
    title: string;
    description: string;
    subheading: string;
    services: { id: string; name: string }[];
    btnCta: string;
  };
  acceleration: {
    tag: string;
    title: string;
    description: string;
    pillars: { id: string; title: string; desc: string }[];
    btnCta: string;
  };
  mission: {
    tag: string;
    title: string;
    description: string;
    subheading: string;
    audience: { id: string; name: string }[];
    btnCta: string;
  };
  keynotes: {
    tag: string;
    title: string;
    description: string;
    btnCta: string;
    topicsTitle: string;
    topics: string[];
    diffTitle: string;
    differentials: string[];
  };
  content: {
    tag: string;
    title: string;
    cards: { icon: string; title: string; desc: string }[];
  };
  indicators: {
    tag: string;
    title: string;
    stats: { value: string; label: string }[];
  };
  bottomCta: {
    title: string;
    btnConsulting: string;
    btnMission: string;
    btnKeynotes: string;
  };
  contact: {
    tag: string;
    title: string;
    description: string;
    btnWhatsapp: string;
  };
  footer: {
    copyright: string;
  };
  modal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    roleLabel: string;
    messageLabel: string;
    submitBtn: string;
    directWhatsappBtn: string;
    successMessage: string;
  };
}

// ==========================================
// LUXURY REAL ESTATE CRM TYPES
// ==========================================

export type PipelineStageId =
  | 'lead_recebido'
  | 'qualificacao'
  | 'curadoria'
  | 'visita_tecnica'
  | 'proposta_due_diligence'
  | 'fechamento_escritura';

export interface PipelineStageInfo {
  id: PipelineStageId;
  title: string;
  subtitle: string;
  color: string;
  badgeBg: string;
}

export type PropertyStatus =
  | 'disponivel'
  | 'exclusividade'
  | 'em_negociacao'
  | 'vendido';

export type PropertyType =
  | 'Penthouse / Cobertura'
  | 'Mansão Urbana'
  | 'Fazenda / Campo'
  | 'Branded Residence'
  | 'Apartamento Garden'
  | 'Terreno Exclusivo';

export type PropertyPurpose = 'venda' | 'aluguel' | 'ambos';

export interface Property {
  id: string;
  title: string;
  code: string;
  type: PropertyType;
  purpose?: PropertyPurpose; // 'venda' | 'aluguel' | 'ambos'
  rentalPrice?: number; // Valor mensal de aluguel em BRL
  neighborhood: string;
  city: string;
  state: string;
  price: number; // Preço de venda em BRL
  condoFee: number;
  iptu: number;
  areaM2: number;
  suites: number;
  parkingSpots: number;
  status: PropertyStatus;
  description: string;
  highlights: string[];
  imageUrl: string;
  galleryUrls?: string[];
  videoTourUrl?: string;
  owner: {
    name: string;
    phone: string;
    email: string;
    confidentialNotes: string;
  };
  smartKeywords: string[];
  createdAt?: string;
}

export interface WhatsAppChatMessage {
  id: string;
  sender: 'client' | 'broker' | 'ai_concierge';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  propertyCode?: string;
}

export interface ClientInteraction {
  id: string;
  date: string;
  type: 'whatsapp' | 'call' | 'meeting' | 'visit' | 'proposal' | 'note';
  author: string;
  content: string;
}

export interface ClientVIP {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: 'Investidor Familiar' | 'Empresário / C-Level' | 'Celebridade / Atleta' | 'Incorporador' | 'Comprador Final';
  targetBudgetMin: number;
  targetBudgetMax: number;
  preferredNeighborhoods: string[];
  preferredTypes: PropertyType[];
  stage: PipelineStageId;
  associatedPropertyId?: string;
  assignedBroker: string;
  estimatedDealValue: number;
  expectedCommission: number;
  urgency: 'Alta' | 'Média' | 'Discreta / Sem Pressa';
  liquidityStatus: '100% Líquido / À Vista' | 'Financiamento Private' | 'Permuta de Ativos';
  notes: string;
  tags: string[];
  interactions: ClientInteraction[];
  chatHistory?: WhatsAppChatMessage[];
  createdAt: string;
}

export interface SmartMatchItem {
  property: Property;
  client: ClientVIP;
  matchScore: number;
  reasons: string[];
}

export type UserRole = 'admin' | 'broker' | 'associate';

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar?: string;
  creci?: string;
  phone?: string;
  status: 'active' | 'suspended' | 'terminated';
  passwordHash?: string;
  addedAt?: string;
  addedBy?: string;
  lastLoginAt?: string;
}

