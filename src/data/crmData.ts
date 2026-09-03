import { Property, ClientVIP, PipelineStageInfo, SmartMatchItem } from '../types';

export const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    id: 'lead_recebido',
    title: 'Lead Recebido / Indicação',
    subtitle: 'Primeiro contato e validação de fonte',
    color: '#9ca3af',
    badgeBg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  },
  {
    id: 'qualificacao',
    title: 'Qualificação & Perfil AAA',
    subtitle: 'Liquidez, orçamento e intenção real',
    color: '#38bdf8',
    badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
  },
  {
    id: 'curadoria',
    title: 'Curadoria & Apresentação',
    subtitle: 'Seleção restrita e book exclusivo',
    color: '#a855f7',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
  },
  {
    id: 'visita_tecnica',
    title: 'Visita Técnica / Experiência',
    subtitle: 'Imersão no imóvel e assessoria',
    color: '#f59e0b',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  },
  {
    id: 'proposta_due_diligence',
    title: 'Proposta & Due Diligence',
    subtitle: 'Negociação de minuta e auditoria jurídica',
    color: '#ec4899',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
  },
  {
    id: 'fechamento_escritura',
    title: 'Fechamento & Escritura',
    subtitle: 'Assinatura, repasse e comissão',
    color: '#10b981',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
  },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'IB-980',
    title: 'Penthouse Triplex Sky Lounge Itaim Bibi',
    type: 'Penthouse / Cobertura',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    price: 28500000,
    condoFee: 14200,
    iptu: 6800,
    areaM2: 740,
    suites: 5,
    parkingSpots: 8,
    status: 'exclusividade',
    description:
      'Triplex exclusivo assinado por arquiteto de renome internacional com piscina privativa suspensa em borda infinita, vista panorâmica de 360° para o skyline do Itaim e Parque do Povo. Automação Lutron completa e adega climatizada para 1.200 garrafas.',
    highlights: [
      'Piscina privativa aquecida',
      'Adega para 1.200 rótulos',
      '8 vagas demarcadas com carregador elétrico',
      'Elevador privativo biométrico',
      'Gerador full para 100% da unidade',
    ],
    imageUrl: '/images/luxury_penthouse_terrace_1787618010460.jpg',
    owner: {
      name: 'Dr. Roberto Faro e Silva',
      phone: '+55 11 98765-4321',
      email: 'faro.silva@holdings.com.br',
      confidentialNotes: 'Proprietário aberto a pagamento 50% em SP e 50% em conta no exterior (Offshore). Exige discrição total sem placa externa.',
    },
    smartKeywords: ['Itaim Bibi', 'Triplex', 'Piscina Privativa', 'Vista 360', 'Alto Padrão', 'Adega', 'Moderno'],
  },
  {
    id: 'prop-2',
    code: 'JD-450',
    title: 'Mansão Arquitetônica Contemporânea Jardim Europa',
    type: 'Mansão Urbana',
    neighborhood: 'Jardins / Jardim Europa',
    city: 'São Paulo',
    state: 'SP',
    price: 45000000,
    condoFee: 0,
    iptu: 18500,
    areaM2: 1250,
    suites: 6,
    parkingSpots: 10,
    status: 'disponivel',
    description:
      'Residência icônica em rua fechada com segurança privada 24h armada. Painéis em vidro curvo, mármore travertino navona importado, paisagismo assinado por Burle Marx Studio, spa integrado, cinema privativo e guarita blindada.',
    highlights: [
      'Rua fechada com guarita blindada',
      'Terreno plano de 1.800m²',
      'Cinema privativo com 14 poltronas',
      'Spa com sauna úmida e piscina aquecida',
      'Garagem subterrânea para coleção de carros',
    ],
    imageUrl: '/images/luxury_mansion_jardins_1787618022912.jpg',
    owner: {
      name: 'Família Mendonça Dias',
      phone: '+55 11 99123-8877',
      email: 'contato@mendoncaoffice.com',
      confidentialNotes: 'Imóvel em inventário já finalizado com alvará pronto para escritura imediata. Sem dívidas ou gravames.',
    },
    smartKeywords: ['Jardim Europa', 'Jardins', 'Mansão', 'Rua Fechada', 'Cinema Privativo', 'Travertino', 'Exclusivo'],
  },
  {
    id: 'prop-3',
    code: 'FBV-210',
    title: 'Villa Privativa de Campo Fazenda Boa Vista',
    type: 'Fazenda / Campo',
    neighborhood: 'Fazenda Boa Vista',
    city: 'Porto Feliz',
    state: 'SP',
    price: 34000000,
    condoFee: 7800,
    iptu: 3900,
    areaM2: 1100,
    suites: 7,
    parkingSpots: 6,
    status: 'em_negociacao',
    description:
      'Villa de alto luxo em lote privilegiado em frente ao Campo de Golfe Arnold Palmer. Estrutura de madeira engenheirada, fire pit ao ar livre, quadra de beach tennis privativa, heliponto a 3 minutos e serviços do Hotel Fasano Boa Vista disponíveis on-demand.',
    highlights: [
      'Vista perpétua para o Campo de Golfe',
      'Quadra privativa de Beach Tennis',
      'Piscina com prainha e raia de 25m',
      'Cozinha gourmet com churrasqueira Viking',
      'Totalmente decorada e mobiliada por designers',
    ],
    imageUrl: '/images/luxury_country_estate_1787618039456.jpg',
    owner: {
      name: 'Eduardo Guimarães',
      phone: '+55 11 97654-3210',
      email: 'eduardo@guimaraescap.com',
      confidentialNotes: 'Proprietário negociando proposta de compra de imóvel em Miami. Aceita parcelamento em 12x direto.',
    },
    smartKeywords: ['Fazenda Boa Vista', 'Campo', 'Golfe', 'Porto Feliz', 'Beach Tennis', 'Fasano', 'Mobiliado'],
  },
  {
    id: 'prop-4',
    code: 'BC-880',
    title: 'Branded Residence Ocean View Signature Tower',
    type: 'Branded Residence',
    neighborhood: 'Barra Sul',
    city: 'Balneário Camboriú',
    state: 'SC',
    price: 19800000,
    condoFee: 5400,
    iptu: 2800,
    areaM2: 420,
    suites: 4,
    parkingSpots: 5,
    status: 'disponivel',
    description:
      'Apartamento de altíssimo luxo frente mar com assinatura de grife automotiva italiana. Pé direito duplo no living, varanda com fechamento acústico europeu, heliponto homologado no edifício e marina privada integrada.',
    highlights: [
      'Frente mar definitiva',
      'Design e acabamentos italianos',
      'Vaga para iate de até 60 pés na marina',
      'Concierge internacional 24h',
      'Heliponto homologado no topo',
    ],
    imageUrl: '/images/luxury_beach_branded_residence_1787618051023.jpg',
    owner: {
      name: 'Grupo Prime Invest',
      phone: '+55 47 99988-1122',
      email: 'invest@primebc.com.br',
      confidentialNotes: 'Diretoria autoriza comissão de 6% cheia em caso de fechamento em até 30 dias.',
    },
    smartKeywords: ['Balneário Camboriú', 'Branded Residence', 'Frente Mar', 'Marina', 'Heliponto', 'Iate'],
  },
];

export const INITIAL_CLIENTS: ClientVIP[] = [
  {
    id: 'cli-0',
    name: 'Alexandre Sales',
    email: 'alexandre_sales_11@hotmail.com',
    phone: '+55 74 98835-9752',
    profile: 'Investidor Familiar',
    targetBudgetMin: 20000000,
    targetBudgetMax: 40000000,
    preferredNeighborhoods: ['Itaim Bibi', 'Vila Nova Conceição', 'Jardins'],
    preferredTypes: ['Penthouse / Cobertura', 'Mansão Urbana'],
    stage: 'visita_tecnica',
    associatedPropertyId: 'prop-1',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 28500000,
    expectedCommission: 1710000,
    urgency: 'Alta',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Conta de teste oficial pareada com a Evolution API. Mensagens enviadas no chat chegam instantaneamente no WhatsApp real.',
    tags: ['WhatsApp Conectado', 'VIP', 'Itaim Bibi', 'Teste Real'],
    createdAt: '2026-08-25',
    chatHistory: [
      {
        id: 'msg-alex-1',
        sender: 'broker',
        senderName: 'Sergio Langer',
        text: 'Olá Alexandre! Confirmação de conexão real do WhatsApp Sergio Langer AI VIP.',
        timestamp: '02:55',
        status: 'read',
      },
    ],
    interactions: [
      {
        id: 'int-alex-1',
        date: '2026-08-25 02:55',
        type: 'whatsapp',
        author: 'Sergio Langer',
        content: 'Confirmação de envio e entrega via Evolution API real.',
      },
    ],
  },
  {
    id: 'cli-1',
    name: 'Henrique Villela',
    email: 'h.villela@vcapital.com.br',
    phone: '+55 11 99887-6655',
    profile: 'Empresário / C-Level',
    targetBudgetMin: 25000000,
    targetBudgetMax: 35000000,
    preferredNeighborhoods: ['Itaim Bibi', 'Vila Nova Conceição', 'Jardins'],
    preferredTypes: ['Penthouse / Cobertura', 'Apartamento Garden'],
    stage: 'visita_tecnica',
    associatedPropertyId: 'prop-1',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 28500000,
    expectedCommission: 1710000, // 6%
    urgency: 'Alta',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Busca cobertura para mudança nos próximos 60 dias. Exige privacidade absoluta, segurança blindada e vista livre para o parque.',
    tags: ['Comprador VIP', 'Liquidez Imediata', 'Itaim Bibi', 'Piscina Privativa'],
    createdAt: '2026-08-10',
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'client',
        senderName: 'Henrique Villela',
        text: 'Olá, Sergio! Vi seu podcast sobre coberturas off-market no Itaim. Estou em busca de uma penthouse para mudança nos próximos 60 dias.',
        timestamp: '14:10',
        status: 'read',
      },
      {
        id: 'msg-2',
        sender: 'broker',
        senderName: 'Sergio Langer',
        text: 'Prezado Henrique, excelente tarde! É um prazer conversar com você. No Itaim Bibi, temos a Penthouse Triplex Sky Lounge (IB-980), com 740m², piscina aquecida privativa e 8 vagas.',
        timestamp: '14:15',
        status: 'read',
        propertyCode: 'IB-980',
      },
      {
        id: 'msg-3',
        sender: 'client',
        senderName: 'Henrique Villela',
        text: 'Espetacular! A vista é livre para o Parque do Povo? Exijo segurança armada no edifício.',
        timestamp: '14:20',
        status: 'read',
      },
      {
        id: 'msg-4',
        sender: 'broker',
        senderName: 'Sergio Langer',
        text: 'Vista 360° perpétua e guarita blindada nível III-A com eclusa dupla. Gostaria de uma visita privada com sua arquiteta nesta semana?',
        timestamp: '14:25',
        status: 'read',
      },
      {
        id: 'msg-5',
        sender: 'client',
        senderName: 'Henrique Villela',
        text: 'Perfeito! Vamos agendar na quinta-feira às 16h.',
        timestamp: '14:32',
        status: 'read',
      }
    ],
    interactions: [
      {
        id: 'int-1',
        date: '2026-08-10 14:30',
        type: 'call',
        author: 'Sergio Langer',
        content: 'Primeira ligação de qualificação após recomendação do Dr. Faro. Alinhado orçamento de até R$ 35M e preferência por Itaim.',
      },
      {
        id: 'int-2',
        date: '2026-08-15 11:00',
        type: 'whatsapp',
        author: 'Sergio Langer',
        content: 'Enviado book confidencial da Penthouse Triplex Sky Lounge (IB-980). Cliente demonstrou alto interesse na adega e piscina.',
      },
      {
        id: 'int-3',
        date: '2026-08-20 16:00',
        type: 'visit',
        author: 'Sergio Langer',
        content: 'Visita técnica realizada com a esposa e arquiteta particular. Amaram o layout e solicitaram conferência da documentação de vagas.',
      },
    ],
  },
  {
    id: 'cli-2',
    name: 'Carolina e Rodrigo Albuquerque',
    email: 'rodrigo@albuquerquefamily.com',
    phone: '+55 11 98112-3344',
    profile: 'Investidor Familiar',
    targetBudgetMin: 35000000,
    targetBudgetMax: 50000000,
    preferredNeighborhoods: ['Jardins / Jardim Europa', 'Jardim América'],
    preferredTypes: ['Mansão Urbana'],
    stage: 'proposta_due_diligence',
    associatedPropertyId: 'prop-2',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 45000000,
    expectedCommission: 2700000,
    urgency: 'Média',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Family office tradicional. Fizeram proposta de R$ 42M, proprietário contrapropôs R$ 43.5M com mobília de arte. Jurídico revisando minuta.',
    tags: ['Family Office', 'Jardim Europa', 'Due Diligence', 'Alta Confidencialidade'],
    createdAt: '2026-07-28',
    chatHistory: [
      {
        id: 'msg-albu-1',
        sender: 'client',
        senderName: 'Rodrigo Albuquerque',
        text: 'Boa noite Sergio, o jurídico revisou a minuta da mansão do Jardim Europa (JD-450). Restam apenas duas cláusulas sobre o acervo de obras de arte.',
        timestamp: '18:40',
        status: 'read',
      },
      {
        id: 'msg-albu-2',
        sender: 'broker',
        senderName: 'Sergio Langer',
        text: 'Olá, Rodrigo! Excelente. Conversei hoje com o inventariante e as 4 obras catalogadas da sala de jantar já foram autorizadas na contraproposta de R$ 43.5M.',
        timestamp: '18:45',
        status: 'read',
        propertyCode: 'JD-450',
      },
      {
        id: 'msg-albu-3',
        sender: 'client',
        senderName: 'Rodrigo Albuquerque',
        text: 'Maravilha. Envie a versão revisada para o Dr. Marcelo dar o de acordo amanhã cedo.',
        timestamp: '18:50',
        status: 'read',
      }
    ],
    interactions: [
      {
        id: 'int-4',
        date: '2026-07-28 09:30',
        type: 'meeting',
        author: 'Sergio Langer',
        content: 'Reunião presencial no escritório de advocacia da família. Apresentadas 3 opções off-market no Jardim Europa.',
      },
      {
        id: 'int-5',
        date: '2026-08-04 15:00',
        type: 'visit',
        author: 'Sergio Langer',
        content: 'Segunda visita à Mansão JD-450 com engenheiro perito para vistoria estrutural e de segurança.',
      },
      {
        id: 'int-6',
        date: '2026-08-18 17:30',
        type: 'proposal',
        author: 'Sergio Langer',
        content: 'Formalizada minuta de compra e venda. Advogados em negociação dos termos finais de fechamento para assinatura da escritura.',
      },
    ],
  },
  {
    id: 'cli-3',
    name: 'Lucas Brandão',
    email: 'lucas@techunicorn.io',
    phone: '+55 11 97234-9988',
    profile: 'Empresário / C-Level',
    targetBudgetMin: 25000000,
    targetBudgetMax: 40000000,
    preferredNeighborhoods: ['Fazenda Boa Vista', 'Quinta da Baroneza'],
    preferredTypes: ['Fazenda / Campo'],
    stage: 'curadoria',
    associatedPropertyId: 'prop-3',
    assignedBroker: 'Gabriel Santos',
    estimatedDealValue: 34000000,
    expectedCommission: 2040000,
    urgency: 'Média',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Fundador de startup que realizou liquidez de equity. Quer refúgio de fim de semana na Fazenda Boa Vista com lazer completo para crianças.',
    tags: ['Tech Founder', 'Fazenda Boa Vista', 'Beach Tennis', 'Heliponto'],
    createdAt: '2026-08-18',
    interactions: [
      {
        id: 'int-7',
        date: '2026-08-18 10:15',
        type: 'whatsapp',
        author: 'Gabriel Santos',
        content: 'Lead vindo através de palestra sobre tendências de luxo do Sergio. Solicitou book de propriedades na Fazenda Boa Vista.',
      },
      {
        id: 'int-8',
        date: '2026-08-22 14:00',
        type: 'call',
        author: 'Gabriel Santos',
        content: 'Apresentadas as opções FBV-210 e FBV-105. Agendada visita de helicóptero para o próximo sábado pela manhã.',
      },
    ],
  },
  {
    id: 'cli-4',
    name: 'Dr. Fernando Vasconcellos',
    email: 'vasconcellos@medpremium.com.br',
    phone: '+55 47 98877-4433',
    profile: 'Investidor Familiar',
    targetBudgetMin: 15000000,
    targetBudgetMax: 22000000,
    preferredNeighborhoods: ['Barra Sul', 'Balneário Camboriú', 'Praia Brava'],
    preferredTypes: ['Branded Residence', 'Penthouse / Cobertura'],
    stage: 'qualificacao',
    associatedPropertyId: 'prop-4',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 19800000,
    expectedCommission: 1188000,
    urgency: 'Discreta / Sem Pressa',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Cirurgião e investidor com patrimônio diversificado no Sul. Quer apartamento branded residence com vaga para barco grande.',
    tags: ['Balneário Camboriú', 'Investidor', 'Branded Residence', 'Náutico'],
    createdAt: '2026-08-21',
    interactions: [
      {
        id: 'int-9',
        date: '2026-08-21 16:45',
        type: 'note',
        author: 'Sergio Langer',
        content: 'Lead cadastrado via formulário de consultoria do site. Confirmado interesse direto em Branded Residences no litoral.',
      },
    ],
  },
  {
    id: 'cli-5',
    name: 'Beatriz Montez',
    email: 'beatriz.montez@asset.com',
    phone: '+55 11 99655-2211',
    profile: 'Celebridade / Atleta',
    targetBudgetMin: 20000000,
    targetBudgetMax: 30000000,
    preferredNeighborhoods: ['Itaim Bibi', 'Vila Nova Conceição', 'Jardins'],
    preferredTypes: ['Penthouse / Cobertura', 'Mansão Urbana'],
    stage: 'lead_recebido',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 25000000,
    expectedCommission: 1500000,
    urgency: 'Alta',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Indicação direta de gestor de fundos de investimento. Solicita atendimento estritamente confidencial fora de horário comercial.',
    tags: ['Novo Lead', 'Indicação Direta', 'Sigilo Absoluto'],
    createdAt: '2026-08-24',
    interactions: [
      {
        id: 'int-10',
        date: '2026-08-24 11:20',
        type: 'whatsapp',
        author: 'Sergio Langer',
        content: 'Primeira mensagem enviada para agendamento de chamada executiva de briefing.',
      },
    ],
  },
  {
    id: 'cli-6',
    name: 'Marcio e Juliana Prado',
    email: 'marcio.prado@agrobrasil.com',
    phone: '+55 65 99911-0022',
    profile: 'Investidor Familiar',
    targetBudgetMin: 30000000,
    targetBudgetMax: 40000000,
    preferredNeighborhoods: ['Vila Nova Conceição', 'Jardins'],
    preferredTypes: ['Mansão Urbana', 'Penthouse / Cobertura'],
    stage: 'fechamento_escritura',
    associatedPropertyId: 'prop-1',
    assignedBroker: 'Sergio Langer',
    estimatedDealValue: 31000000,
    expectedCommission: 1860000,
    urgency: 'Alta',
    liquidityStatus: '100% Líquido / À Vista',
    notes: 'Família do agronegócio do MT comprando residência fixa em SP. Escritura pública lavrada no 14º Cartório de Notas agendada para sexta-feira.',
    tags: ['Fechamento', 'Agro', 'Escritura', 'Sucesso'],
    createdAt: '2026-06-15',
    interactions: [
      {
        id: 'int-11',
        date: '2026-08-23 18:00',
        type: 'proposal',
        author: 'Sergio Langer',
        content: 'Contrato assinado por ambas as partes com sinal de R$ 6.200.000 (20%) já transferido. Agendamento da escritura definitivo.',
      },
    ],
  },
];

// Helper functions for CRM operations
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `R$ ${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return `R$ ${value}`;
}

// Calculate Smart Matches between Properties and VIP Clients
export function calculateSmartMatches(properties: Property[], clients: ClientVIP[]): SmartMatchItem[] {
  const matches: SmartMatchItem[] = [];

  for (const property of properties) {
    for (const client of clients) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Budget Match (40% weight)
      if (property.price >= client.targetBudgetMin && property.price <= client.targetBudgetMax * 1.1) {
        score += 40;
        reasons.push(`Preço (${formatCompactCurrency(property.price)}) dentro da faixa de liquidez do cliente (${formatCompactCurrency(client.targetBudgetMin)} - ${formatCompactCurrency(client.targetBudgetMax)})`);
      } else if (property.price <= client.targetBudgetMax * 1.25) {
        score += 20;
        reasons.push(`Preço compatível com pequena flexibilização de orçamento`);
      }

      // 2. Neighborhood Match (30% weight)
      const neighborhoodMatch = client.preferredNeighborhoods.some(
        (n) => property.neighborhood.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(property.neighborhood.toLowerCase())
      );
      if (neighborhoodMatch) {
        score += 30;
        reasons.push(`Localização exata com o desejo do cliente (${property.neighborhood})`);
      }

      // 3. Property Type Match (20% weight)
      if (client.preferredTypes.includes(property.type)) {
        score += 20;
        reasons.push(`Tipologia de preferência (${property.type})`);
      }

      // 4. Keyword / Lifestyle Affinity (10% weight)
      const clientTagsLower = client.tags.map((t) => t.toLowerCase());
      const matchingKeywords = property.smartKeywords.filter((k) =>
        clientTagsLower.some((t) => t.includes(k.toLowerCase()) || k.toLowerCase().includes(t))
      );
      if (matchingKeywords.length > 0) {
        score += 10;
        reasons.push(`Afinidade de perfil: ${matchingKeywords.join(', ')}`);
      }

      if (score >= 50) {
        matches.push({
          property,
          client,
          matchScore: Math.min(score, 100),
          reasons,
        });
      }
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
