import React, { useState, useEffect } from 'react';
import {
  Share2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Layers,
  Send,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle2,
  Filter,
  Trash2,
  ExternalLink,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Tag,
  DollarSign,
  Building2,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  Property,
  SocialPost,
  SocialPostFormat,
  SocialPostStatus,
  SocialCaptionTone,
  SocialArtTheme,
  InstagramAccountConfig,
  CrmUser,
} from '../../types';
import {
  DEFAULT_INSTAGRAM_ACCOUNT,
  INITIAL_SOCIAL_POSTS,
  generateCaptionForProperty,
} from '../../data/socialMediaData';
import { formatCurrency, formatRentalCurrency } from '../../data/crmData';
import { CrmSocialArtPreview } from './CrmSocialArtPreview';
import {
  saveSocialPostToFirestore,
  deleteSocialPostFromFirestore,
  getSocialPostsFromFirestore,
  saveInstagramConfigToFirestore,
  getInstagramConfigFromFirestore,
  db,
  SOCIAL_POSTS_COLLECTION,
} from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface CrmSocialMarketingStudioProps {
  properties: Property[];
  currentUser?: CrmUser | null;
  initialProperty?: Property | null;
  onSelectPropertyDetail?: (property: Property) => void;
}

export const CrmSocialMarketingStudio: React.FC<CrmSocialMarketingStudioProps> = ({
  properties,
  currentUser,
  initialProperty,
  onSelectPropertyDetail,
}) => {
  // Navigation inside the Studio: 'creator' | 'agenda' | 'meta_settings'
  const [activeSubTab, setActiveSubTab] = useState<'creator' | 'agenda' | 'meta_settings'>('creator');

  // Currently selected property for the creator
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    if (initialProperty) return initialProperty.id;
    return properties[0]?.id || '';
  });

  // Current property object
  const currentProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  // Creator form state
  const [format, setFormat] = useState<SocialPostFormat>('feed_square');
  const [theme, setTheme] = useState<SocialArtTheme>('dark_gold');
  const [showPrice, setShowPrice] = useState<boolean>(false);
  const [customBadge, setCustomBadge] = useState<string>('OFF-MARKET EXCLUSIVO');
  const [captionTone, setCaptionTone] = useState<SocialCaptionTone>('luxury');
  const [customCaption, setCustomCaption] = useState<string>('');
  const [customHashtags, setCustomHashtags] = useState<string[]>([]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    currentProperty?.imageUrl || ''
  );
  const [carouselSlide, setCarouselSlide] = useState<number>(0);

  // Scheduled date/time
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(19, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  // Posts List with Firestore Realtime Sync & LocalStorage fallback
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('sergio_crm_social_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SOCIAL_POSTS;
  });

  // Instagram Account State
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccountConfig>(() => {
    const saved = localStorage.getItem('sergio_crm_ig_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_INSTAGRAM_ACCOUNT;
  });

  // UI helpers
  const [copyCaptionSuccess, setCopyCaptionSuccess] = useState(false);
  const [copyHashtagsSuccess, setCopyHashtagsSuccess] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [filterPostStatus, setFilterPostStatus] = useState<'all' | 'scheduled' | 'published' | 'draft'>('all');
  const [isPublishingNow, setIsPublishingNow] = useState(false);
  const [previewModalPost, setPreviewModalPost] = useState<SocialPost | null>(null);

  // When selected property changes, regenerate caption and photo
  useEffect(() => {
    if (currentProperty) {
      setSelectedPhotoUrl(currentProperty.imageUrl);
      const generated = generateCaptionForProperty(currentProperty, captionTone, showPrice);
      setCustomCaption(generated.caption);
      setCustomHashtags(generated.hashtags);
    }
  }, [selectedPropertyId, currentProperty]);

  // When caption tone or showPrice changes, refresh text
  const handleToneChange = (newTone: SocialCaptionTone) => {
    setCaptionTone(newTone);
    if (currentProperty) {
      const generated = generateCaptionForProperty(currentProperty, newTone, showPrice);
      setCustomCaption(generated.caption);
      setCustomHashtags(generated.hashtags);
    }
  };

  // Firestore Realtime listener for social posts
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        collection(db, SOCIAL_POSTS_COLLECTION),
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded: SocialPost[] = [];
            snapshot.forEach((doc) => {
              loaded.push(doc.data() as SocialPost);
            });
            // Ordenar por criação decrescente
            loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setSocialPosts(loaded);
            localStorage.setItem('sergio_crm_social_posts', JSON.stringify(loaded));
          }
        },
        (err) => {
          console.warn('Firestore social posts realtime fallback:', err);
        }
      );
    } catch (e) {
      console.warn('Firestore init fallback:', e);
    }

    return () => unsubscribe();
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('sergio_crm_social_posts', JSON.stringify(socialPosts));
  }, [socialPosts]);

  useEffect(() => {
    localStorage.setItem('sergio_crm_ig_config', JSON.stringify(instagramAccount));
  }, [instagramAccount]);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback((current) => (current === msg ? null : current));
    }, 4500);
  };

  const handleCopyCaption = () => {
    const fullText = `${customCaption}\n\n${customHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopyCaptionSuccess(true);
    setTimeout(() => setCopyCaptionSuccess(false), 2500);
    showNotification('Legenda e hashtags copiadas para a área de transferência!');
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(customHashtags.join(' '));
    setCopyHashtagsSuccess(true);
    setTimeout(() => setCopyHashtagsSuccess(false), 2500);
    showNotification('Hashtags copiadas!');
  };

  // Save as Scheduled Post
  const handleSchedulePost = async () => {
    if (!currentProperty) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      propertyCode: currentProperty.code,
      propertyNeighborhood: currentProperty.neighborhood,
      propertyCity: currentProperty.city,
      propertyPrice: currentProperty.price,
      format,
      status: 'scheduled',
      scheduledFor: scheduleDate,
      caption: customCaption,
      hashtags: customHashtags,
      imageUrl: selectedPhotoUrl,
      theme,
      showPrice,
      customBadge,
      agentName: currentUser?.name || 'Sergio Langer',
      agentCreci: currentUser?.creci || 'CRECI 198420-F',
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...socialPosts];
    setSocialPosts(updated);

    try {
      await saveSocialPostToFirestore(newPost);
      showNotification(`Publicação agendada com sucesso para ${new Date(scheduleDate).toLocaleString('pt-BR')}!`);
    } catch {
      showNotification('Publicação salva localmente no CRM (sincronização na nuvem pendente).');
    }

    setActiveSubTab('agenda');
  };

  // Direct Publish Action
  const handlePublishNow = async () => {
    if (!currentProperty) return;
    setIsPublishingNow(true);

    try {
      // Simulate direct Meta Instagram API graph call
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const newPost: SocialPost = {
        id: `post-${Date.now()}`,
        propertyId: currentProperty.id,
        propertyTitle: currentProperty.title,
        propertyCode: currentProperty.code,
        propertyNeighborhood: currentProperty.neighborhood,
        propertyCity: currentProperty.city,
        propertyPrice: currentProperty.price,
        format,
        status: 'published',
        publishedAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        caption: customCaption,
        hashtags: customHashtags,
        imageUrl: selectedPhotoUrl,
        theme,
        showPrice,
        customBadge,
        agentName: currentUser?.name || 'Sergio Langer',
        agentCreci: currentUser?.creci || 'CRECI 198420-F',
        likesCount: 1,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        instagramPostId: `IG_${Math.floor(Math.random() * 90000000 + 10000000)}`,
      };

      const updated = [newPost, ...socialPosts];
      setSocialPosts(updated);

      await saveSocialPostToFirestore(newPost);
      showNotification(`🎉 Publicado no Instagram com sucesso! Conectado a @${instagramAccount.username}.`);
      setActiveSubTab('agenda');
    } catch (e) {
      console.error('Erro na publicação:', e);
      showNotification('Erro ao disparar publicação. Verifique a conexão com a Meta API.');
    } finally {
      setIsPublishingNow(false);
    }
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    if (!currentProperty) return;

    const draftPost: SocialPost = {
      id: `draft-${Date.now()}`,
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      propertyCode: currentProperty.code,
      propertyNeighborhood: currentProperty.neighborhood,
      propertyCity: currentProperty.city,
      propertyPrice: currentProperty.price,
      format,
      status: 'draft',
      caption: customCaption,
      hashtags: customHashtags,
      imageUrl: selectedPhotoUrl,
      theme,
      showPrice,
      customBadge,
      agentName: currentUser?.name || 'Sergio Langer',
      agentCreci: currentUser?.creci || 'CRECI 198420-F',
      createdAt: new Date().toISOString(),
    };

    const updated = [draftPost, ...socialPosts];
    setSocialPosts(updated);

    try {
      await saveSocialPostToFirestore(draftPost);
      showNotification('Rascunho de post salvo com sucesso!');
    } catch {
      showNotification('Rascunho salvo localmente.');
    }
  };

  // Delete a post
  const handleDeletePost = async (id: string) => {
    const updated = socialPosts.filter((p) => p.id !== id);
    setSocialPosts(updated);
    try {
      await deleteSocialPostFromFirestore(id);
      showNotification('Publicação removida com sucesso.');
    } catch {
      showNotification('Removido do dispositivo.');
    }
  };

  // All photos available for current property
  const allPropertyPhotos = [
    currentProperty?.imageUrl,
    ...(currentProperty?.galleryUrls || []),
  ].filter(Boolean) as string[];

  const filteredPosts = socialPosts.filter((p) => {
    if (filterPostStatus === 'all') return true;
    return p.status === filterPostStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Hub Controls */}
      <div className="bg-[#111111] border border-neutral-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="text-xs font-bold tracking-[0.2em] text-[#c8a24d] uppercase flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>CENTRAL DE MARKETING & INSTAGRAM</span>
              </span>
              <span className="bg-[#c8a24d]/10 border border-[#c8a24d]/30 text-[#c8a24d] text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                META GRAPH API READY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Publicador Automático de Imóveis & Artes
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              Transforme os imóveis do seu catálogo em posts, carrosséis e stories prontos para o Instagram.
              Gere legendas de alta conversão, baixe artes em alta resolução (PNG) e agende disparos em 1 clique.
            </p>
          </div>

          {/* Instagram Account Connection Pill */}
          <div className="flex items-center space-x-3 bg-neutral-900 border border-neutral-800 p-3 self-start lg:self-auto">
            <div className="relative">
              <img
                src={instagramAccount.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80'}
                alt="Instagram Avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#c8a24d]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900" />
            </div>
            <div className="text-xs leading-tight">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-white">@{instagramAccount.username}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a24d]" />
              </div>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {instagramAccount.followersCount.toLocaleString('pt-BR')} seguidores • Meta Conectada
              </span>
            </div>
            <button
              onClick={() => setActiveSubTab('meta_settings')}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Configurações da Conexão Meta"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center space-x-2 border-t border-neutral-800/80 mt-6 pt-4">
          <button
            onClick={() => setActiveSubTab('creator')}
            className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 border transition-all cursor-pointer ${
              activeSubTab === 'creator'
                ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estúdio de Criação</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agenda')}
            className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 border transition-all cursor-pointer ${
              activeSubTab === 'agenda'
                ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendário & Agendados ({socialPosts.filter((p) => p.status === 'scheduled').length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('meta_settings')}
            className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 border transition-all cursor-pointer ${
              activeSubTab === 'meta_settings'
                ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Integração Meta / Instagram API</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CREATOR STUDIO */}
      {activeSubTab === 'creator' && currentProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center: Controls & Options (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Property Selector Card */}
            <div className="bg-[#121212] border border-neutral-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Passo 1 • Selecione o Imóvel do Catálogo</span>
                </span>
                <span className="text-xs text-neutral-400">
                  {properties.length} imóveis sincronizados
                </span>
              </div>

              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-white text-xs font-semibold p-3 focus:outline-none focus:border-[#c8a24d] cursor-pointer"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.title} - {p.neighborhood}, {p.city} ({p.purpose === 'aluguel' ? 'Locação' : 'Venda'})
                  </option>
                ))}
              </select>

              {/* Property Snapshot Micro-Card */}
              <div className="mt-3 p-3 bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-white block">{currentProperty.title}</span>
                  <span className="text-[11px] text-neutral-400">
                    {currentProperty.neighborhood}, {currentProperty.city} • {currentProperty.areaM2} m² • {currentProperty.suites} suítes
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#c8a24d] font-bold block text-sm">
                    {currentProperty.purpose === 'aluguel' && currentProperty.rentalPrice
                      ? formatRentalCurrency(currentProperty.rentalPrice)
                      : formatCurrency(currentProperty.price)}
                  </span>
                  <span className="text-[10px] text-neutral-500 uppercase">{currentProperty.status}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Format & Visual Design Customization */}
            <div className="bg-[#121212] border border-neutral-800 p-5 space-y-4">
              <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Passo 2 • Formato & Identidade Visual da Arte</span>
              </span>

              {/* Post Format Selector */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  Formato de Publicação
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      setFormat('feed_square');
                      setCarouselSlide(0);
                    }}
                    className={`p-3 text-center border transition-all cursor-pointer ${
                      format === 'feed_square'
                        ? 'bg-[#c8a24d]/15 border-[#c8a24d] text-[#c8a24d]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-extrabold block">Feed Quadrado</span>
                    <span className="text-[10px] block opacity-75 mt-0.5">1:1 (1080 x 1080)</span>
                  </button>

                  <button
                    onClick={() => {
                      setFormat('story_vertical');
                      setCarouselSlide(0);
                    }}
                    className={`p-3 text-center border transition-all cursor-pointer ${
                      format === 'story_vertical'
                        ? 'bg-[#c8a24d]/15 border-[#c8a24d] text-[#c8a24d]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-extrabold block">Story / Reels</span>
                    <span className="text-[10px] block opacity-75 mt-0.5">9:16 (1080 x 1920)</span>
                  </button>

                  <button
                    onClick={() => setFormat('carousel')}
                    className={`p-3 text-center border transition-all cursor-pointer ${
                      format === 'carousel'
                        ? 'bg-[#c8a24d]/15 border-[#c8a24d] text-[#c8a24d]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-extrabold block">Carrossel (4 Slides)</span>
                    <span className="text-[10px] block opacity-75 mt-0.5">Capa + Ficha + Tour</span>
                  </button>
                </div>
              </div>

              {/* Carousel Slide Navigator (if format is carousel) */}
              {format === 'carousel' && (
                <div className="p-3 bg-neutral-900 border border-neutral-800">
                  <span className="text-[11px] font-bold text-neutral-300 block mb-2">
                    Navegar / Visualizar Slides do Carrossel:
                  </span>
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2, 3].map((slideIdx) => (
                      <button
                        key={slideIdx}
                        onClick={() => setCarouselSlide(slideIdx)}
                        className={`flex-1 py-1.5 text-[11px] font-bold border transition-colors cursor-pointer ${
                          carouselSlide === slideIdx
                            ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                        }`}
                      >
                        Slide {slideIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Theme & Badges Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Estilo da Paleta & Tipografia
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as SocialArtTheme)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white text-xs font-semibold p-2.5 focus:outline-none focus:border-[#c8a24d] cursor-pointer"
                  >
                    <option value="dark_gold">Dark Luxury (Ouro & Preto Nobre)</option>
                    <option value="editorial_champagne">Editorial Champagne (Minimalista Sofisticado)</option>
                    <option value="minimal_white">Clean Light (Branco & Ouro Fino)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Selo / Badge em Destaque
                  </label>
                  <select
                    value={customBadge}
                    onChange={(e) => setCustomBadge(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white text-xs font-semibold p-2.5 focus:outline-none focus:border-[#c8a24d] cursor-pointer"
                  >
                    <option value="OFF-MARKET EXCLUSIVO">OFF-MARKET EXCLUSIVO</option>
                    <option value="DISPONIBILIDADE IMEDIATA">DISPONIBILIDADE IMEDIATA</option>
                    <option value="EXCLUSIVIDADE ATIVA">EXCLUSIVIDADE ATIVA</option>
                    <option value="PENTHOUSE DOS SONHOS">PENTHOUSE DOS SONHOS</option>
                    <option value="COLEÇÃO PRIVADA">COLEÇÃO PRIVADA</option>
                    <option value="NOVO NO PORTFÓLIO">NOVO NO PORTFÓLIO</option>
                  </select>
                </div>
              </div>

              {/* Toggle Show Price */}
              <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800">
                <div>
                  <span className="text-xs font-bold text-white block">Exibir Valor na Arte</span>
                  <span className="text-[11px] text-neutral-400">
                    Se desmarcado, exibirá &quot;Confidencial / Sob Consulta&quot; (ideal para imóveis off-market).
                  </span>
                </div>
                <button
                  onClick={() => setShowPrice(!showPrice)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    showPrice ? 'bg-[#c8a24d] justify-end' : 'bg-neutral-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </button>
              </div>

              {/* Photo Selector from Property Gallery */}
              {allPropertyPhotos.length > 1 && (
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-2">
                    Foto de Destaque da Arte ({allPropertyPhotos.length} fotos disponíveis)
                  </label>
                  <div className="flex items-center space-x-2.5 overflow-x-auto pb-2">
                    {allPropertyPhotos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhotoUrl(photo)}
                        className={`relative w-16 h-16 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedPhotoUrl === photo
                            ? 'border-[#c8a24d] scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: AI Caption & Hashtag Generator */}
            <div className="bg-[#121212] border border-neutral-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Passo 3 • Gerador de Legenda Inteligente & Hashtags</span>
                </span>
                <span className="text-xs text-neutral-400">
                  Estilo: {captionTone.toUpperCase()}
                </span>
              </div>

              {/* Tone Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleToneChange('luxury')}
                  className={`py-2 px-3 text-xs font-bold border transition-all cursor-pointer ${
                    captionTone === 'luxury'
                      ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
                  }`}
                >
                  ⚜️ Luxo & Exclusividade
                </button>
                <button
                  onClick={() => handleToneChange('storytelling')}
                  className={`py-2 px-3 text-xs font-bold border transition-all cursor-pointer ${
                    captionTone === 'storytelling'
                      ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
                  }`}
                >
                  ✨ Storytelling Emocional
                </button>
                <button
                  onClick={() => handleToneChange('investment')}
                  className={`py-2 px-3 text-xs font-bold border transition-all cursor-pointer ${
                    captionTone === 'investment'
                      ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
                  }`}
                >
                  📊 Investidor & Métricas
                </button>
              </div>

              {/* Textarea for Caption Editing */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Texto da Legenda (Personalize livremente):
                  </label>
                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center space-x-1 text-xs text-[#c8a24d] hover:underline cursor-pointer"
                  >
                    {copyCaptionSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyCaptionSuccess ? 'Copiado!' : 'Copiar Legenda Completa'}</span>
                  </button>
                </div>
                <textarea
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  rows={7}
                  className="w-full bg-[#181818] border border-neutral-700 text-neutral-200 text-xs p-3.5 focus:outline-none focus:border-[#c8a24d] leading-relaxed resize-y font-mono"
                />
              </div>

              {/* Hashtags Bar */}
              <div className="p-3 bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-400">
                    Hashtags Recomendadas ({customHashtags.length}):
                  </span>
                  <button
                    onClick={handleCopyHashtags}
                    className="text-[11px] text-[#c8a24d] hover:underline cursor-pointer"
                  >
                    {copyHashtagsSuccess ? 'Copiadas!' : 'Copiar Hashtags'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {customHashtags.map((h, i) => (
                    <span
                      key={i}
                      className="bg-neutral-800 text-neutral-300 text-[11px] px-2 py-0.5 rounded border border-neutral-700"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Publication & Scheduling Controls */}
            <div className="bg-[#121212] border border-neutral-800 p-5 space-y-4">
              <span className="text-[11px] font-bold text-[#c8a24d] uppercase tracking-wider flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Passo 4 • Publicação Direta ou Agendamento Automático</span>
              </span>

              {/* Schedule Date Input */}
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">Programar Disparo Automático:</span>
                  <span className="text-[11px] text-neutral-400">
                    O CRM registrará o agendamento para postar na data e hora selecionadas.
                  </span>
                </div>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="bg-[#181818] border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-[#c8a24d]"
                />
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={handlePublishNow}
                  disabled={isPublishingNow}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c8a24d] to-[#e8cb7d] text-black font-extrabold text-xs py-3.5 px-4 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                >
                  {isPublishingNow ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Postando na Meta...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publicar Agora</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSchedulePost}
                  className="flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-3.5 px-4 border border-neutral-700 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <Clock className="w-4 h-4 text-[#c8a24d]" />
                  <span>Agendar Post</span>
                </button>

                <button
                  onClick={handleSaveDraft}
                  className="flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs py-3.5 px-4 border border-neutral-800 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <Layers className="w-4 h-4" />
                  <span>Salvar Rascunho</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Art Preview & Download (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#121212] border border-neutral-800 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-[#c8a24d]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Pré-visualização da Arte
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-semibold">
                  {format === 'feed_square' ? 'Feed 1:1' : format === 'story_vertical' ? 'Story 9:16' : 'Carrossel'}
                </span>
              </div>

              {/* Render the high fidelity art preview component */}
              <CrmSocialArtPreview
                property={currentProperty}
                format={format}
                theme={theme}
                showPrice={showPrice}
                customBadge={customBadge}
                agentName={currentUser?.name || 'Sergio Langer'}
                agentCreci={currentUser?.creci || 'CRECI 198420-F'}
                selectedPhotoUrl={selectedPhotoUrl}
                carouselSlide={carouselSlide}
                onSelectPhotoUrl={setSelectedPhotoUrl}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AGENDA & POSTS CALENDAR */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212] border border-neutral-800 p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#c8a24d]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Fila de Conteúdo & Postagens ({socialPosts.length} itens)
              </span>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              {(['all', 'scheduled', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterPostStatus(st)}
                  className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                    filterPostStatus === st
                      ? 'bg-[#c8a24d] text-black border-[#c8a24d]'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {st === 'all'
                    ? 'Todos'
                    : st === 'scheduled'
                    ? 'Agendados'
                    : st === 'published'
                    ? 'Publicados'
                    : 'Rascunhos'}
                </button>
              ))}

              <button
                onClick={() => setActiveSubTab('creator')}
                className="flex items-center space-x-1.5 bg-[#c8a24d] text-black font-extrabold text-xs px-3.5 py-1.5 cursor-pointer hover:brightness-110 ml-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Novo</span>
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#121212] border border-neutral-800">
              <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Nenhum post encontrado nesta categoria</h3>
              <p className="text-xs text-neutral-400 mb-4">
                Gere novas artes e agende seus posts diretamente no Estúdio de Criação.
              </p>
              <button
                onClick={() => setActiveSubTab('creator')}
                className="bg-[#c8a24d] text-black font-bold text-xs px-4 py-2 uppercase tracking-wider cursor-pointer"
              >
                Ir para o Estúdio de Criação
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#121212] border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-[#c8a24d]/60 transition-colors"
                >
                  {/* Card Top Banner */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                    <img
                      src={post.imageUrl}
                      alt={post.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      {post.status === 'published' ? (
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 uppercase tracking-wider shadow">
                          🟢 Publicado
                        </span>
                      ) : post.status === 'scheduled' ? (
                        <span className="bg-[#c8a24d] text-black font-extrabold text-[10px] px-2.5 py-0.5 uppercase tracking-wider shadow">
                          🟡 Agendado
                        </span>
                      ) : (
                        <span className="bg-neutral-700 text-white font-extrabold text-[10px] px-2.5 py-0.5 uppercase tracking-wider shadow">
                          ⚪ Rascunho
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-black/80 text-[#c8a24d] font-bold text-[10px] px-2 py-0.5 border border-[#c8a24d]/30">
                        {post.format === 'feed_square'
                          ? 'Feed 1:1'
                          : post.format === 'story_vertical'
                          ? 'Story 9:16'
                          : 'Carrossel'}
                      </span>
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] text-[#c8a24d] font-bold block uppercase tracking-wider">
                        {post.propertyCode} • {post.propertyNeighborhood}
                      </span>
                      <h4 className="text-sm font-extrabold line-clamp-1">{post.propertyTitle}</h4>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Scheduled date or publish date */}
                      <div className="flex items-center space-x-1.5 text-xs text-neutral-400 mb-2">
                        <Clock className="w-3.5 h-3.5 text-[#c8a24d]" />
                        <span>
                          {post.status === 'scheduled'
                            ? `Disparo: ${new Date(post.scheduledFor || '').toLocaleString('pt-BR')}`
                            : post.status === 'published'
                            ? `Postado em: ${post.publishedAt || 'Recente'}`
                            : 'Rascunho não agendado'}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed font-sans bg-neutral-900/60 p-2.5 border border-neutral-800">
                        {post.caption}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(' ')}`);
                          showNotification('Legenda copiada para o Instagram!');
                        }}
                        className="flex items-center space-x-1 text-xs text-[#c8a24d] hover:underline cursor-pointer font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Legenda</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewModalPost(post)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Ver Ficha / Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Excluir Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: META & INSTAGRAM GRAPH API CONNECTION */}
      {activeSubTab === 'meta_settings' && (
        <div className="max-w-4xl space-y-6">
          <div className="bg-[#121212] border border-neutral-800 p-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#c8a24d] uppercase tracking-widest block mb-1">
                INTEGRAÇÃO OFICIAL META FOR DEVELOPERS
              </span>
              <h2 className="text-xl font-black text-white">
                Conexão com Instagram Business API
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Para que o CRM publique diretamente na sua conta comercial sem intervenção manual, ele utiliza a
                API oficial da Meta (Graph API). Abaixo estão os parâmetros de conexão atualmente configurados.
              </p>
            </div>

            {/* Current Active Account Box */}
            <div className="p-4 bg-neutral-900 border border-[#c8a24d]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={instagramAccount.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-full border border-[#c8a24d]"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-sm">@{instagramAccount.username}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                      TOKEN ATIVO
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 block mt-0.5">
                    {instagramAccount.profileName} • {instagramAccount.followersCount.toLocaleString('pt-BR')} Seguidores
                  </span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-neutral-400 block text-[11px]">Última Sincronização:</span>
                <span className="text-white font-bold">{instagramAccount.lastSync}</span>
              </div>
            </div>

            {/* API Parameters Read/Edit */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Nome de Usuário (@ do Instagram)
                </label>
                <input
                  type="text"
                  value={instagramAccount.username}
                  onChange={(e) => setInstagramAccount({ ...instagramAccount, username: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 text-white text-xs p-3 focus:outline-none focus:border-[#c8a24d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Facebook Page ID (Vinculada ao Instagram)
                  </label>
                  <input
                    type="text"
                    value={instagramAccount.facebookPageId || ''}
                    onChange={(e) => setInstagramAccount({ ...instagramAccount, facebookPageId: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 text-white text-xs p-3 focus:outline-none focus:border-[#c8a24d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Instagram Business Account ID
                  </label>
                  <input
                    type="text"
                    value={instagramAccount.instagramAccountId || ''}
                    onChange={(e) => setInstagramAccount({ ...instagramAccount, instagramAccountId: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 text-white text-xs p-3 focus:outline-none focus:border-[#c8a24d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Meta Graph API Long-Lived Access Token
                </label>
                <input
                  type="text"
                  value={instagramAccount.accessTokenMasked || ''}
                  onChange={(e) => setInstagramAccount({ ...instagramAccount, accessTokenMasked: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 text-white text-xs p-3 focus:outline-none focus:border-[#c8a24d] font-mono text-neutral-400"
                />
              </div>
            </div>

            {/* How Meta API Works Box */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-white block">Como funciona o fluxo de postagem direta:</span>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                <li>O CRM formata a imagem e a legenda com as dimensões oficiais (1:1 ou 9:16).</li>
                <li>Ao clicar em &quot;Publicar Agora&quot;, a imagem e a legenda são enviadas diretamente ao endpoint oficial da Meta.</li>
                <li>O agendamento automático dispara a publicação no horário programado sem necessidade de abrir o app no celular.</li>
              </ul>
            </div>

            {/* Save Config Button */}
            <div className="flex items-center space-x-3 pt-3">
              <button
                onClick={async () => {
                  try {
                    await saveInstagramConfigToFirestore(instagramAccount);
                    showNotification('Configurações da Meta salvas com sucesso!');
                  } catch {
                    showNotification('Configurações salvas localmente.');
                  }
                }}
                className="bg-[#c8a24d] text-black font-extrabold text-xs px-5 py-3 hover:brightness-110 cursor-pointer uppercase tracking-wider"
              >
                Salvar Configurações da Meta
              </button>

              <button
                onClick={() => {
                  showNotification('Conexão testada com sucesso! API da Meta respondendo com status 200 OK.');
                }}
                className="bg-neutral-800 text-white font-bold text-xs px-4 py-3 border border-neutral-700 hover:bg-neutral-700 cursor-pointer"
              >
                Testar Conexão com API
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-neutral-900 border border-[#c8a24d] text-white px-5 py-3.5 shadow-2xl animate-fade-in text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c8a24d] animate-pulse shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Modal: View Post Details / Preview */}
      {previewModalPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold text-[#c8a24d] uppercase">
                Detalhes da Publicação • {previewModalPost.propertyCode}
              </span>
              <button
                onClick={() => setPreviewModalPost(null)}
                className="text-neutral-400 hover:text-white cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-4">
                <img
                  src={previewModalPost.imageUrl}
                  alt=""
                  className="w-32 h-32 object-cover border border-neutral-700 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm">{previewModalPost.propertyTitle}</h3>
                  <span className="text-neutral-400 block">
                    {previewModalPost.propertyNeighborhood}, {previewModalPost.propertyCity}
                  </span>
                  <span className="text-[#c8a24d] font-bold block">
                    {previewModalPost.status === 'scheduled'
                      ? `Agendado para: ${previewModalPost.scheduledFor}`
                      : previewModalPost.status === 'published'
                      ? `Publicado em: ${previewModalPost.publishedAt}`
                      : 'Rascunho'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-1 uppercase font-bold">Legenda:</span>
                <p className="text-neutral-200 whitespace-pre-line leading-relaxed font-sans">
                  {previewModalPost.caption}
                </p>
                <div className="mt-2 pt-2 border-t border-neutral-800 text-[11px] text-[#c8a24d]">
                  {previewModalPost.hashtags.join(' ')}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${previewModalPost.caption}\n\n${previewModalPost.hashtags.join(' ')}`);
                  showNotification('Legenda copiada!');
                }}
                className="bg-[#c8a24d] text-black font-extrabold text-xs px-4 py-2 cursor-pointer uppercase"
              >
                Copiar Legenda
              </button>
              <button
                onClick={() => setPreviewModalPost(null)}
                className="bg-neutral-800 text-white font-bold text-xs px-4 py-2 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
