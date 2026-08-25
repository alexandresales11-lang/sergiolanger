import { Language, TranslationContent } from '../types';

export const translations: Record<Language, TranslationContent> = {
  pt: {
    nav: {
      home: 'INÍCIO',
      consulting: 'CONSULTORIA',
      acceleration: 'ACELERAÇÃO',
      mission: 'MISSÃO ALTO PADRÃO',
      keynotes: 'PALESTRAS',
      podcast: 'VEM PRA MESA',
      contact: 'CONTATO',
    },
    hero: {
      title: 'O mercado imobiliário não é mais o mesmo',
      subtitle:
        'Incorporadores vendem mais. Corretores sobem de nível. É isso que acontece quando você entende de verdade o mercado de luxo.',
      btnConsulting: 'SOLICITAR CONSULTORIA',
      btnMission: 'MISSÃO ALTO PADRÃO',
      btnKeynotes: 'CONTRATAR PALESTRA',
    },
    about: {
      tag: 'SOBRE',
      title: 'Referência em estratégia no mercado imobiliário de alto padrão',
      description:
        'Sergio Langer atua com incorporadores, corretores e empresas do setor imobiliário desenvolvendo estratégias de posicionamento, vendas e leitura de mercado voltadas ao segmento premium.',
      bullets: [
        'Host do podcast Vem Pra Mesa',
        'Criador da Missão Alto Padrão',
        'Consultor para incorporadoras',
        'Palestrante e escritor best-seller',
      ],
    },
    consulting: {
      tag: 'CONSULTORIA',
      title: 'Consultoria estratégica para incorporadores que atuam no mercado imobiliário de luxo',
      description:
        'Consultoria voltada para incorporadoras que desejam melhorar posicionamento, acelerar vendas e estruturar estratégias comerciais no segmento de alto padrão.',
      subheading: 'SERVIÇOS INCLUEM',
      services: [
        { id: '01', name: 'Diagnóstico comercial' },
        { id: '02', name: 'Posicionamento de produto imobiliário' },
        { id: '03', name: 'Estratégia de lançamento' },
        { id: '04', name: 'Treinamento de equipes' },
        { id: '05', name: 'Estruturação de narrativa de vendas' },
        { id: '06', name: 'Acompanhamento estratégico' },
      ],
      btnCta: 'SOLICITAR CONVERSA ESTRATÉGICA',
    },
    acceleration: {
      tag: 'ACELERAÇÃO',
      title: 'Programa para corretores que querem dominar o mercado imobiliário de alto padrão',
      description:
        'Programa de desenvolvimento profissional voltado para corretores que querem entrar ou crescer no segmento de alto padrão com posicionamento estratégico, método comprovado e acesso à rede certa.',
      pillars: [
        {
          id: '01',
          title: 'Marca pessoal',
          desc: 'Posicionamento que faz o mercado lembrar o seu nome',
        },
        {
          id: '02',
          title: 'Presença digital',
          desc: 'Como aparecer, falar e atrair o cliente AAA',
        },
        {
          id: '03',
          title: 'Networking estratégico',
          desc: 'Acesso às incorporadoras, investidores e corretores de referência',
        },
        {
          id: '04',
          title: 'Método de vendas',
          desc: 'Prospecção, atendimento e fechamento no alto padrão',
        },
        {
          id: '05',
          title: 'Inteligência de mercado',
          desc: 'Lançamentos, tendências e movimentos antes da concorrência',
        },
      ],
      btnCta: 'ENTRAR NA PRÓXIMA TURMA',
    },
    mission: {
      tag: 'MISSÃO ALTO PADRÃO',
      title: 'Missão Alto Padrão: imersão estratégica no mercado imobiliário premium',
      description:
        'Experiência presencial com visitas técnicas, análise de empreendimentos e leitura estratégica do mercado imobiliário de alto padrão.',
      subheading: 'VOLTADA PARA',
      audience: [
        { id: '01', name: 'Corretores' },
        { id: '02', name: 'Gestores comerciais' },
        { id: '03', name: 'Incorporadores' },
        { id: '04', name: 'Profissionais do setor imobiliário' },
      ],
      btnCta: 'PARTICIPAR DA PRÓXIMA EDIÇÃO',
    },
    keynotes: {
      tag: 'PALESTRAS',
      title: 'Palestras sobre mercado imobiliário, vendas e tendências do alto padrão',
      description:
        'Sergio Langer realiza palestras para eventos, incorporadoras, imobiliárias e encontros do setor apresentando tendências do mercado imobiliário premium, estratégias de posicionamento e movimentos do setor no Brasil e no exterior.',
      btnCta: 'CONTRATAR PALESTRA',
      topicsTitle: 'TEMAS',
      topics: [
        'Tendências do mercado imobiliário de luxo',
        'Comportamento do comprador de alto padrão',
        'Branded residences no Brasil e no mundo',
        'Estratégias de vendas imobiliárias',
        'O Novo Luxo: Serviço e Experiência como diferencial',
      ],
      diffTitle: 'DIFERENCIAIS',
      differentials: [
        'Conteúdo aplicado ao mercado real',
        'Experiência prática com incorporadores',
        'Leitura atualizada do mercado premium',
        'Referências internacionais',
        'Visão estratégica e comercial integrada',
      ],
    },
    content: {
      tag: 'CONTEÚDOS & REFERÊNCIAS',
      title: 'Conteúdo sobre mercado imobiliário premium e tendências globais',
      cards: [
        {
          icon: 'podcast',
          title: 'Podcast Vem Pra Mesa',
          desc: 'Conversas com líderes do mercado imobiliário premium',
        },
        {
          icon: 'chart',
          title: 'Análises de mercado',
          desc: 'Leitura estratégica de movimentos e tendências do setor',
        },
        {
          icon: 'globe',
          title: 'Eventos internacionais',
          desc: 'Presença nos principais palcos do mercado imobiliário global',
        },
        {
          icon: 'file',
          title: 'Relatórios estratégicos',
          desc: 'Dados e insights para decisões fundamentadas',
        },
        {
          icon: 'pin',
          title: 'Visitas técnicas',
          desc: 'Avaliação presencial de empreendimentos de alto padrão',
        },
        {
          icon: 'users',
          title: 'Missões imobiliárias',
          desc: 'Imersões estratégicas com profissionais do setor premium',
        },
      ],
    },
    indicators: {
      tag: 'INDICADORES',
      title: 'Atuação no mercado imobiliário',
      stats: [
        { value: '12.500+', label: 'Profissionais impactados em todo o Brasil' },
        { value: '320+', label: 'Projetos com incorporadores' },
        { value: '135+', label: 'Palestras realizadas' },
        { value: '30', label: 'Missões presenciais concluídas' },
      ],
    },
    bottomCta: {
      title: 'Conecte-se com o mercado imobiliário premium',
      btnConsulting: 'SOLICITAR CONSULTORIA',
      btnMission: 'MISSÃO ALTO PADRÃO',
      btnKeynotes: 'CONTRATAR PALESTRA',
    },
    contact: {
      tag: 'CONTATO',
      title: 'Vamos conversar',
      description: 'Clique no botão abaixo e agende uma conversa.',
      btnWhatsapp: 'Falar pelo WhatsApp',
    },
    footer: {
      copyright: '© 2026 Sergio Langer. Todos os direitos reservados.',
    },
    modal: {
      title: 'Agende uma conversa estratégica',
      subtitle: 'Preencha os campos abaixo ou entre em contato direto pelo WhatsApp oficial.',
      nameLabel: 'Nome completo',
      emailLabel: 'E-mail profissional',
      phoneLabel: 'WhatsApp / Telefone com DDD',
      roleLabel: 'Seu perfil / atuação',
      messageLabel: 'Como a equipe do Sergio Langer pode te ajudar?',
      submitBtn: 'Enviar solicitação',
      directWhatsappBtn: 'Falar agora pelo WhatsApp',
      successMessage: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      consulting: 'CONSULTING',
      acceleration: 'ACCELERATION',
      mission: 'HIGH-END MISSION',
      keynotes: 'KEYNOTES',
      podcast: 'VEM PRA MESA',
      contact: 'CONTACT',
    },
    hero: {
      title: 'The real estate market is no longer the same',
      subtitle:
        'Developers sell more. Brokers elevate their game. That is what happens when you truly master the luxury real estate market.',
      btnConsulting: 'REQUEST CONSULTING',
      btnMission: 'HIGH-END MISSION',
      btnKeynotes: 'BOOK A KEYNOTE',
    },
    about: {
      tag: 'ABOUT',
      title: 'Strategic reference in high-end real estate',
      description:
        'Sergio Langer works alongside developers, brokers, and real estate corporations developing positioning strategies, sales acceleration, and market intelligence for the premium segment.',
      bullets: [
        'Host of Vem Pra Mesa Podcast',
        'Founder of High-End Mission',
        'Advisor for real estate developers',
        'Keynote speaker & best-selling author',
      ],
    },
    consulting: {
      tag: 'CONSULTING',
      title: 'Strategic consulting for developers operating in luxury real estate',
      description:
        'Specialized consulting designed for developers seeking refined market positioning, faster sales velocity, and high-performance commercial strategies in the luxury segment.',
      subheading: 'SERVICES INCLUDE',
      services: [
        { id: '01', name: 'Commercial diagnosis' },
        { id: '02', name: 'Real estate product positioning' },
        { id: '03', name: 'Launch & go-to-market strategy' },
        { id: '04', name: 'Sales team training' },
        { id: '05', name: 'Sales narrative structuring' },
        { id: '06', name: 'Executive strategic advisory' },
      ],
      btnCta: 'REQUEST STRATEGIC CONSULTATION',
    },
    acceleration: {
      tag: 'ACCELERATION',
      title: 'Accelerating top brokers to dominate luxury real estate',
      description:
        'Executive development program for real estate brokers who want to enter or scale in the high-end market with proven methodology, strategic authority, and top-tier access.',
      pillars: [
        {
          id: '01',
          title: 'Personal branding',
          desc: 'Positioning that makes the industry remember and trust your name',
        },
        {
          id: '02',
          title: 'Digital presence',
          desc: 'How to show up, speak, and attract ultra-high-net-worth clients',
        },
        {
          id: '03',
          title: 'Strategic networking',
          desc: 'Direct access to major developers, investors, and elite brokers',
        },
        {
          id: '04',
          title: 'Sales methodology',
          desc: 'Prospecting, elite consultation, and closing luxury deals',
        },
        {
          id: '05',
          title: 'Market intelligence',
          desc: 'Launches, macro trends, and movements before the competition',
        },
      ],
      btnCta: 'JOIN NEXT COHORT',
    },
    mission: {
      tag: 'HIGH-END MISSION',
      title: 'High-End Mission: strategic immersion in premium real estate',
      description:
        'An in-person immersion experience featuring technical visits, project architectural analysis, and luxury market trend decryption.',
      subheading: 'DESIGNED FOR',
      audience: [
        { id: '01', name: 'Brokers & Realtors' },
        { id: '02', name: 'Commercial directors' },
        { id: '03', name: 'Real estate developers' },
        { id: '04', name: 'Industry professionals' },
      ],
      btnCta: 'JOIN NEXT EDITION',
    },
    keynotes: {
      tag: 'KEYNOTES',
      title: 'Keynotes on real estate market, sales dynamics, and luxury trends',
      description:
        'Sergio Langer delivers impactful keynote speeches for summits, developers, and corporate gatherings, unveiling global luxury trends, strategic branding, and market shifts.',
      btnCta: 'BOOK A KEYNOTE',
      topicsTitle: 'KEY TOPICS',
      topics: [
        'Trends in luxury real estate',
        'High-net-worth buyer psychology & behavior',
        'Branded residences across the globe',
        'Advanced real estate sales strategies',
        'The New Luxury: Service & Experience as differentiators',
      ],
      diffTitle: 'DIFFERENTIATORS',
      differentials: [
        'Real-world actionable insights',
        'Deep practical experience with developers',
        'Up-to-the-minute premium market intelligence',
        'Global benchmarks and references',
        'Integrated strategic and commercial vision',
      ],
    },
    content: {
      tag: 'CONTENT & REFERENCES',
      title: 'Insights into luxury real estate and global market trends',
      cards: [
        {
          icon: 'podcast',
          title: 'Vem Pra Mesa Podcast',
          desc: 'In-depth interviews with leaders of premium real estate',
        },
        {
          icon: 'chart',
          title: 'Market analyses',
          desc: 'Strategic reading of industry trends and macroeconomic shifts',
        },
        {
          icon: 'globe',
          title: 'Global summits',
          desc: 'Keynote presence on the primary international stages',
        },
        {
          icon: 'file',
          title: 'Strategic reports',
          desc: 'High-conviction data and insights for boardroom decisions',
        },
        {
          icon: 'pin',
          title: 'Technical site visits',
          desc: 'In-person evaluation of iconic architectural developments',
        },
        {
          icon: 'users',
          title: 'Real estate missions',
          desc: 'Strategic luxury immersions with top industry executives',
        },
      ],
    },
    indicators: {
      tag: 'METRICS',
      title: 'Track record in real estate',
      stats: [
        { value: '12,500+', label: 'Professionals impacted nationwide' },
        { value: '320+', label: 'Projects advised with developers' },
        { value: '135+', label: 'Keynotes and lectures delivered' },
        { value: '30', label: 'In-person missions completed' },
      ],
    },
    bottomCta: {
      title: 'Connect with the premium real estate market',
      btnConsulting: 'REQUEST CONSULTING',
      btnMission: 'HIGH-END MISSION',
      btnKeynotes: 'BOOK A KEYNOTE',
    },
    contact: {
      tag: 'CONTACT',
      title: "Let's talk",
      description: 'Click the button below to schedule a direct conversation.',
      btnWhatsapp: 'Chat on WhatsApp',
    },
    footer: {
      copyright: '© 2026 Sergio Langer. All rights reserved.',
    },
    modal: {
      title: 'Schedule a strategic consultation',
      subtitle: 'Fill in your details below or contact our team directly via WhatsApp.',
      nameLabel: 'Full name',
      emailLabel: 'Work email',
      phoneLabel: 'WhatsApp / Phone number',
      roleLabel: 'Professional profile / Role',
      messageLabel: 'How can Sergio Langer help you?',
      submitBtn: 'Submit request',
      directWhatsappBtn: 'Talk on WhatsApp now',
      successMessage: 'Request sent successfully! Our team will get in touch shortly.',
    },
  },
  es: {
    nav: {
      home: 'INICIO',
      consulting: 'CONSULTORÍA',
      acceleration: 'ACELERACIÓN',
      mission: 'MISIÓN ALTO PADRÓN',
      keynotes: 'CONFERENCIAS',
      podcast: 'VEM PRA MESA',
      contact: 'CONTACTO',
    },
    hero: {
      title: 'El mercado inmobiliario ya no es el mismo',
      subtitle:
        'Los desarrolladores venden más. Los corredores suben de nivel. Eso es lo que sucede cuando entiendes de verdad el mercado de lujo.',
      btnConsulting: 'SOLICITAR CONSULTORÍA',
      btnMission: 'MISIÓN ALTO PADRÓN',
      btnKeynotes: 'CONTRATAR CONFERENCIA',
    },
    about: {
      tag: 'SOBRE',
      title: 'Referencia en estrategia en el mercado inmobiliario de alto nivel',
      description:
        'Sergio Langer trabaja con desarrolladores, corredores y empresas inmobiliarias diseñando estrategias de posicionamiento, ventas e inteligencia de mercado para el segmento premium.',
      bullets: [
        'Host del podcast Vem Pra Mesa',
        'Creador de la Misión Alto Padrón',
        'Consultor para desarrolladoras',
        'Conferencista y autor best-seller',
      ],
    },
    consulting: {
      tag: 'CONSULTORÍA',
      title: 'Consultoría estratégica para desarrolladores que operan en bienes raíces de lujo',
      description:
        'Consultoría orientada a empresas inmobiliarias que buscan posicionamiento exclusivo, acelerar ventas y estructurar operaciones comerciales de alto estándar.',
      subheading: 'SERVICIOS INCLUYEN',
      services: [
        { id: '01', name: 'Diagnóstico comercial' },
        { id: '02', name: 'Posicionamiento de producto inmobiliario' },
        { id: '03', name: 'Estrategia de lanzamientos' },
        { id: '04', name: 'Capacitación de equipos comerciales' },
        { id: '05', name: 'Estructuración de narrativa de ventas' },
        { id: '06', name: 'Acompañamiento estratégico' },
      ],
      btnCta: 'SOLICITAR CONVERSACIÓN ESTRATÉGICA',
    },
    acceleration: {
      tag: 'ACELERACIÓN',
      title: 'Programa para asesores que quieren dominar el mercado inmobiliario de lujo',
      description:
        'Programa de desarrollo profesional para corredores inmobiliarios que desean posicionarse, escalar en el segmento de alto estándar con metodología probada y acceso a la red adecuada.',
      pillars: [
        {
          id: '01',
          title: 'Marca personal',
          desc: 'Posicionamiento que hace que el mercado recuerde su nombre',
        },
        {
          id: '02',
          title: 'Presencia digital',
          desc: 'Cómo proyectarse, comunicar y atraer al cliente AAA',
        },
        {
          id: '03',
          title: 'Networking estratégico',
          desc: 'Acceso a desarrolladoras, inversionistas y brokers de referencia',
        },
        {
          id: '04',
          title: 'Método de ventas',
          desc: 'Prospección, atención y cierre en el segmento de lujo',
        },
        {
          id: '05',
          title: 'Inteligencia de mercado',
          desc: 'Lanzamientos, tendencias y movimientos antes que la competencia',
        },
      ],
      btnCta: 'INGRESAR A LA PRÓXIMA EDICIÓN',
    },
    mission: {
      tag: 'MISIÓN ALTO PADRÓN',
      title: 'Misión Alto Padrón: inmersión estratégica en bienes raíces premium',
      description:
        'Experiencia presencial con visitas técnicas, análisis de proyectos emblemáticos y lectura estratégica del mercado inmobiliario de lujo.',
      subheading: 'DIRIGIDO A',
      audience: [
        { id: '01', name: 'Corredores y asesores' },
        { id: '02', name: 'Directores comerciales' },
        { id: '03', name: 'Desarrolladores inmobiliarios' },
        { id: '04', name: 'Profesionales del sector' },
      ],
      btnCta: 'PARTICIPAR EN LA PRÓXIMA EDICIÓN',
    },
    keynotes: {
      tag: 'CONFERENCIAS',
      title: 'Conferencias sobre mercado inmobiliario, ventas y tendencias de lujo',
      description:
        'Sergio Langer imparte conferencias magistrales para eventos, desarrolladoras y congresos del sector, presentando tendencias de bienes raíces premium y estrategias comerciales en Brasil y el exterior.',
      btnCta: 'CONTRATAR CONFERENCIA',
      topicsTitle: 'TEMAS',
      topics: [
        'Tendencias del mercado inmobiliario de lujo',
        'Comportamiento del comprador de alto poder adquisitivo',
        'Branded residences en Brasil y el mundo',
        'Estrategias de ventas inmobiliarias de alto nivel',
        'El Nuevo Lujo: Servicio y Experiencia como factor diferencial',
      ],
      diffTitle: 'DIFERENCIALES',
      differentials: [
        'Contenido aplicado al mercado real',
        'Experiencia práctica con desarrolladores',
        'Lectura actualizada del mercado premium',
        'Referencias y benchmarks internacionales',
        'Visión estratégica y comercial integral',
      ],
    },
    content: {
      tag: 'CONTENIDOS & REFERENCIAS',
      title: 'Contenido sobre mercado inmobiliario premium y tendencias globales',
      cards: [
        {
          icon: 'podcast',
          title: 'Podcast Vem Pra Mesa',
          desc: 'Conversaciones con líderes del mercado inmobiliario premium',
        },
        {
          icon: 'chart',
          title: 'Análisis de mercado',
          desc: 'Lectura estratégica de movimientos y tendencias del sector',
        },
        {
          icon: 'globe',
          title: 'Eventos internacionales',
          desc: 'Presencia en los principales escenarios del sector inmobiliario global',
        },
        {
          icon: 'file',
          title: 'Informes estratégicos',
          desc: 'Datos e insights para la toma de decisiones fundamentadas',
        },
        {
          icon: 'pin',
          title: 'Visitas técnicas',
          desc: 'Evaluación presencial de proyectos inmobiliarios de alto nivel',
        },
        {
          icon: 'users',
          title: 'Misiones inmobiliarias',
          desc: 'Inmersiones estratégicas con profesionales del sector premium',
        },
      ],
    },
    indicators: {
      tag: 'INDICADORES',
      title: 'Trayectoria en el mercado inmobiliario',
      stats: [
        { value: '12.500+', label: 'Profesionales impactados en todo el país' },
        { value: '320+', label: 'Proyectos con desarrolladores' },
        { value: '135+', label: 'Conferencias realizadas' },
        { value: '30', label: 'Misiones presenciales concluidas' },
      ],
    },
    bottomCta: {
      title: 'Conéctese con el mercado inmobiliario premium',
      btnConsulting: 'SOLICITAR CONSULTORÍA',
      btnMission: 'MISIÓN ALTO PADRÓN',
      btnKeynotes: 'CONTRATAR CONFERENCIA',
    },
    contact: {
      tag: 'CONTACTO',
      title: 'Conversemos',
      description: 'Haga clic en el botón de abajo y coordine una conversación.',
      btnWhatsapp: 'Hablar por WhatsApp',
    },
    footer: {
      copyright: '© 2026 Sergio Langer. Todos los derechos reservados.',
    },
    modal: {
      title: 'Coordinar una conversación estratégica',
      subtitle: 'Complete sus datos o comuníquese directamente por WhatsApp.',
      nameLabel: 'Nombre completo',
      emailLabel: 'Correo electrónico corporativo',
      phoneLabel: 'WhatsApp / Teléfono',
      roleLabel: 'Perfil profesional / Actividad',
      messageLabel: '¿Cómo podemos ayudarle?',
      submitBtn: 'Enviar solicitud',
      directWhatsappBtn: 'Hablar ahora por WhatsApp',
      successMessage: '¡Solicitud enviada con éxito! Nos comunicaremos a la brevedad.',
    },
  },
};
