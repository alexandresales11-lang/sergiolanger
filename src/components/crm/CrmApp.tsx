import React, { useState, useEffect } from 'react';
import {
  Property,
  ClientVIP,
  PipelineStageId,
  ClientInteraction,
  SmartMatchItem,
  WhatsAppChatMessage,
  CrmUser,
} from '../../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_CLIENTS,
} from '../../data/crmData';
import {
  seedDatabaseIfEmpty,
  saveClientToFirestore,
  savePropertyToFirestore,
  deletePropertyFromFirestore,
  db,
  CLIENTS_COLLECTION,
  PROPERTIES_COLLECTION,
  TEAM_MEMBERS_COLLECTION,
} from '../../lib/firebase';
import {
  getTeamWhitelist,
  registerOrUpdateMember,
  setMemberStatus,
  deleteTeamMember,
  DEFAULT_TEAM_MEMBERS,
} from '../../lib/authService';
import { collection, onSnapshot } from 'firebase/firestore';
import { CrmHeader } from './CrmHeader';
import { CrmDashboard } from './CrmDashboard';
import { CrmPipelineKanban } from './CrmPipelineKanban';
import { CrmPropertiesPortfolio } from './CrmPropertiesPortfolio';
import { CrmClientsList } from './CrmClientsList';
import { CrmSmartMatchStudio } from './CrmSmartMatchStudio';
import { CrmAiCopilot } from './CrmAiCopilot';
import { CrmWhatsAppBotStudio } from './CrmWhatsAppBotStudio';
import { CrmTeamManagement } from './CrmTeamManagement';
import {
  ClientDetailModal,
  PropertyDetailModal,
  NewPropertyModal,
  NewLeadModal,
  WhatsAppGeneratorModal,
} from './CrmModals';
import { ClientWhatsAppLiveModal } from './ClientWhatsAppLiveModal';
import { Sparkles, Bot, Move, Smartphone } from 'lucide-react';

interface CrmAppProps {
  onBackToSite: () => void;
  currentUser?: CrmUser | null;
  onLogout?: () => void;
}

export const CrmApp: React.FC<CrmAppProps> = ({ onBackToSite, currentUser, onLogout }) => {
  // Tabs: 'dashboard' | 'pipeline' | 'properties' | 'clients' | 'smart_match' | 'ai_copilot' | 'whatsapp_bot' | 'team'
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'pipeline' | 'properties' | 'clients' | 'smart_match' | 'ai_copilot' | 'whatsapp_bot' | 'team'
  >('dashboard');

  // Team Members State for Access Control & Whitelist
  const [teamMembers, setTeamMembers] = useState<CrmUser[]>(() => {
    const saved = localStorage.getItem('sergio_crm_local_team_whitelist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_TEAM_MEMBERS;
  });

  // Properties State with Local Storage fallback
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('sergio_langer_crm_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved properties:', e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  // Clients State with Local Storage fallback
  const [clients, setClients] = useState<ClientVIP[]>(() => {
    const saved = localStorage.getItem('sergio_langer_crm_clients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved clients:', e);
      }
    }
    return INITIAL_CLIENTS;
  });

  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Firestore Seed & Real-Time Sync
  useEffect(() => {
    let unsubClients = () => {};
    let unsubProps = () => {};
    let unsubTeam = () => {};

    const initCloud = async () => {
      try {
        await seedDatabaseIfEmpty();
        setIsCloudSynced(true);

        // Listen for clients updates in real-time
        unsubClients = onSnapshot(
          collection(db, CLIENTS_COLLECTION),
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedClients: ClientVIP[] = [];
              snapshot.forEach((doc) => {
                loadedClients.push(doc.data() as ClientVIP);
              });
              setClients(loadedClients);
              localStorage.setItem('sergio_langer_crm_clients', JSON.stringify(loadedClients));
            }
          },
          (err) => {
            console.warn('Firestore clients realtime sync fallback to local:', err);
          }
        );

        // Listen for properties updates in real-time
        unsubProps = onSnapshot(
          collection(db, PROPERTIES_COLLECTION),
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedProps: Property[] = [];
              snapshot.forEach((doc) => {
                loadedProps.push(doc.data() as Property);
              });
              setProperties(loadedProps);
              localStorage.setItem('sergio_langer_crm_properties', JSON.stringify(loadedProps));
            }
          },
          (err) => {
            console.warn('Firestore properties realtime sync fallback to local:', err);
          }
        );

        // Listen for team members updates in real-time
        unsubTeam = onSnapshot(
          collection(db, TEAM_MEMBERS_COLLECTION),
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedTeam: CrmUser[] = [];
              snapshot.forEach((doc) => {
                loadedTeam.push(doc.data() as CrmUser);
              });
              setTeamMembers(loadedTeam);
              localStorage.setItem('sergio_crm_local_team_whitelist', JSON.stringify(loadedTeam));
            } else {
              // Inicializa whitelist padrão no banco
              getTeamWhitelist().then(setTeamMembers);
            }
          },
          (err) => {
            console.warn('Firestore team realtime sync fallback:', err);
          }
        );
      } catch (error) {
        console.warn('Firebase init fallback to local storage:', error);
      }
    };

    initCloud();

    return () => {
      unsubClients();
      unsubProps();
      unsubTeam();
    };
  }, []);

  // Save to LocalStorage on state change
  useEffect(() => {
    localStorage.setItem('sergio_langer_crm_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('sergio_langer_crm_clients', JSON.stringify(clients));
  }, [clients]);

  // Modals state
  const [selectedClient, setSelectedClient] = useState<ClientVIP | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [newLeadPrefillStage, setNewLeadPrefillStage] = useState<PipelineStageId>('lead_recebido');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppClientTarget, setWhatsAppClientTarget] = useState<ClientVIP | null>(null);
  const [whatsAppPropertyTarget, setWhatsAppPropertyTarget] = useState<Property | null>(null);
  const [liveChatClient, setLiveChatClient] = useState<ClientVIP | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Send WhatsApp message from within CRM and update client history
  const handleSendLiveChatMessage = async (clientId: string, message: WhatsAppChatMessage) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const existingChat = client.chatHistory || [];
    const updatedHistory = [...existingChat, message];

    // Also register an interaction event if broker sent a message
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    let updatedInteractions = client.interactions || [];
    if (message.sender === 'broker') {
      const newInteraction: ClientInteraction = {
        id: `int-wa-${Date.now()}`,
        date: dateStr,
        type: 'whatsapp',
        author: 'Sergio Langer',
        content: `Mensagem enviada via CRM: "${message.text.length > 80 ? message.text.slice(0, 80) + '...' : message.text}"`,
      };
      updatedInteractions = [newInteraction, ...updatedInteractions];
    }

    const updatedClient: ClientVIP = {
      ...client,
      chatHistory: updatedHistory,
      interactions: updatedInteractions,
    };

    setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
    if (liveChatClient && liveChatClient.id === clientId) {
      setLiveChatClient(updatedClient);
    }
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updatedClient);
    }

    try {
      await saveClientToFirestore(updatedClient);
    } catch (e) {
      console.warn('Fallback: Chat message persisted locally');
    }
  };

  // Sync entire WhatsApp history fetched from Evolution API
  const handleSyncLiveChatHistory = async (clientId: string, messages: WhatsAppChatMessage[]) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const updatedClient: ClientVIP = {
      ...client,
      chatHistory: messages,
    };

    setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
    if (liveChatClient && liveChatClient.id === clientId) {
      setLiveChatClient(updatedClient);
    }
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updatedClient);
    }

    try {
      await saveClientToFirestore(updatedClient);
    } catch (e) {
      console.warn('Fallback: Chat history persisted locally');
    }
  };

  // Update client stage
  const handleUpdateClientStage = async (clientId: string, newStage: PipelineStageId) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newInteraction: ClientInteraction = {
      id: `int-${Date.now()}`,
      date: dateStr,
      type: 'note',
      author: 'Sergio Langer',
      content: `Estágio atualizado para ${newStage.replace(/_/g, ' ').toUpperCase()}`,
    };

    const updatedClient: ClientVIP = {
      ...client,
      stage: newStage,
      interactions: [newInteraction, ...(client.interactions || [])],
    };

    // Optimistic local state update
    setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));

    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updatedClient);
    }

    // Persist in Firestore
    try {
      await saveClientToFirestore(updatedClient);
    } catch (e) {
      console.warn('Fallback: Client saved locally only');
    }
  };

  // Add interaction
  const handleAddInteraction = async (clientId: string, interaction: Omit<ClientInteraction, 'id'>) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const fullInteraction: ClientInteraction = {
      ...interaction,
      id: `int-${Date.now()}`,
    };

    const updatedClient: ClientVIP = {
      ...client,
      interactions: [fullInteraction, ...(client.interactions || [])],
    };

    setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));

    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updatedClient);
    }

    try {
      await saveClientToFirestore(updatedClient);
    } catch (e) {
      console.warn('Fallback: Interaction saved locally only');
    }
  };

  // Save new lead
  const handleSaveLead = async (leadData: Omit<ClientVIP, 'id' | 'createdAt' | 'interactions'>) => {
    const newId = `cli-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const initialInteraction: ClientInteraction = {
      id: `int-${Date.now()}`,
      date: dateStr,
      type: 'note',
      author: leadData.assignedBroker,
      content: `Lead cadastrado na plataforma. Orçamento: R$ ${(leadData.targetBudgetMin / 1000000).toFixed(1)}M - R$ ${(leadData.targetBudgetMax / 1000000).toFixed(1)}M`,
    };

    const newClient: ClientVIP = {
      ...leadData,
      id: newId,
      createdAt: now.toISOString().slice(0, 10),
      interactions: [initialInteraction],
    };

    setClients((prev) => [newClient, ...prev]);

    try {
      await saveClientToFirestore(newClient);
    } catch (e) {
      console.warn('Fallback: Lead saved locally only');
    }
  };

  // Save new property
  const handleSaveProperty = async (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);

    try {
      await savePropertyToFirestore(newProperty);
    } catch (e) {
      console.warn('Fallback: Property saved locally only');
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }

    try {
      await deletePropertyFromFirestore(propertyId);
    } catch (e) {
      console.warn('Fallback: Property deleted locally only');
    }
  };

  // Update property status
  const handleUpdatePropertyStatus = async (propertyId: string, status: Property['status']) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const updatedProp: Property = { ...prop, status };
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? updatedProp : p)));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(updatedProp);
    }

    try {
      await savePropertyToFirestore(updatedProp);
    } catch (e) {
      console.warn('Fallback: Property status updated locally only');
    }
  };

  // Direct WhatsApp Triggers
  const handleTriggerClientWhatsApp = (client: ClientVIP) => {
    setWhatsAppClientTarget(client);
    const associatedProp = properties.find((p) => p.id === client.associatedPropertyId) || properties[0];
    setWhatsAppPropertyTarget(associatedProp);
    setIsWhatsAppOpen(true);
  };

  const handleTriggerPropertyWhatsApp = (property: Property) => {
    setWhatsAppPropertyTarget(property);
    setWhatsAppClientTarget(clients[0] || null);
    setIsWhatsAppOpen(true);
  };

  const handleTriggerSmartMatchWhatsApp = (match: SmartMatchItem) => {
    setWhatsAppClientTarget(match.client);
    setWhatsAppPropertyTarget(match.property);
    setIsWhatsAppOpen(true);
  };

  // Team Management Handlers (Acessos, Contratação e Demissão)
  const handleAddMember = async (newMember: CrmUser) => {
    await registerOrUpdateMember(newMember);
    setTeamMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === newMember.id || m.email.toLowerCase() === newMember.email.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newMember;
        return copy;
      }
      return [newMember, ...prev];
    });
  };

  const handleUpdateMemberStatus = async (
    memberId: string,
    status: 'active' | 'suspended' | 'terminated'
  ) => {
    await setMemberStatus(memberId, status);
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status } : m))
    );
  };

  const handleDeleteMember = async (memberId: string) => {
    await deleteTeamMember(memberId);
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  // Export Data Backup Handler (JSON / CSV)
  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      system: 'Sergio Langer VIP Real Estate CRM',
      stats: {
        totalClients: clients.length,
        totalProperties: properties.length,
        totalVgv: clients.reduce((acc, c) => acc + c.estimatedDealValue, 0),
        totalCommission: clients.reduce((acc, c) => acc + c.expectedCommission, 0),
      },
      clients,
      properties,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-backup-sergiolanger-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalVGV = clients.reduce((acc, c) => acc + c.estimatedDealValue, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#c8a24d] selection:text-black relative">
      {/* CRM Navigation Header */}
      <CrmHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onBackToSite={onBackToSite}
        totalVGV={totalVGV}
        totalClients={clients.length}
        totalProperties={properties.length}
        onNewLead={() => {
          setNewLeadPrefillStage('lead_recebido');
          setIsNewLeadOpen(true);
        }}
        onNewProperty={() => {
          setCurrentTab('properties');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExportData={handleExportData}
        isCloudSynced={isCloudSynced}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main CRM Content View */}
      <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <CrmDashboard
            properties={properties}
            clients={clients}
            onOpenClientDetail={setSelectedClient}
            onOpenPropertyDetail={setSelectedProperty}
            onGoToPipeline={() => setCurrentTab('pipeline')}
            onGoToSmartMatch={() => setCurrentTab('smart_match')}
            onDirectWhatsApp={handleTriggerClientWhatsApp}
          />
        )}

        {currentTab === 'pipeline' && (
          <CrmPipelineKanban
            clients={clients}
            properties={properties}
            onUpdateClientStage={handleUpdateClientStage}
            onOpenClientDetail={setSelectedClient}
            onOpenNewLead={(prefill) => {
              setNewLeadPrefillStage(prefill || 'lead_recebido');
              setIsNewLeadOpen(true);
            }}
            onDirectWhatsApp={handleTriggerClientWhatsApp}
            onOpenLiveWhatsAppChat={setLiveChatClient}
          />
        )}

        {currentTab === 'properties' && (
          <CrmPropertiesPortfolio
            properties={properties}
            onOpenPropertyDetail={setSelectedProperty}
            onOpenNewProperty={() => {
              setIsNewPropertyOpen(true);
            }}
            onTriggerSmartMatchForProperty={(property) => {
              setSelectedProperty(property);
              setCurrentTab('smart_match');
            }}
            onSharePropertyWhatsApp={handleTriggerPropertyWhatsApp}
          />
        )}

        {currentTab === 'clients' && (
          <CrmClientsList
            clients={clients}
            properties={properties}
            onOpenClientDetail={setSelectedClient}
            onOpenNewLead={() => {
              setNewLeadPrefillStage('lead_recebido');
              setIsNewLeadOpen(true);
            }}
            onDirectWhatsApp={handleTriggerClientWhatsApp}
            onOpenLiveWhatsAppChat={setLiveChatClient}
            onUpdateClientStage={handleUpdateClientStage}
          />
        )}

        {currentTab === 'team' && (
          <CrmTeamManagement
            currentUser={currentUser || null}
            teamMembers={teamMembers}
            onAddMember={handleAddMember}
            onUpdateStatus={handleUpdateMemberStatus}
            onDeleteMember={handleDeleteMember}
            isCloudSynced={isCloudSynced}
          />
        )}

        {currentTab === 'smart_match' && (
          <CrmSmartMatchStudio
            properties={properties}
            clients={clients}
            onOpenClientDetail={setSelectedClient}
            onOpenPropertyDetail={setSelectedProperty}
            onSendSmartMatchWhatsApp={handleTriggerSmartMatchWhatsApp}
          />
        )}

        {currentTab === 'whatsapp_bot' && (
          <CrmWhatsAppBotStudio
            clients={clients}
            properties={properties}
            onOpenClientDetail={setSelectedClient}
          />
        )}

        {currentTab === 'ai_copilot' && (
          <CrmAiCopilot
            clients={clients}
            properties={properties}
            onOpenClientDetail={setSelectedClient}
            onOpenPropertyDetail={setSelectedProperty}
          />
        )}
      </main>

      {/* Floating Copilot Launcher Button when on other tabs */}
      {currentTab !== 'ai_copilot' && (
        <div className="fixed bottom-6 right-6 z-30 flex items-center space-x-2">
          <button
            onClick={() => setCurrentTab('ai_copilot')}
            className="flex items-center space-x-2.5 bg-gradient-to-r from-[#c8a24d] to-[#e8cb7d] text-black font-black text-xs px-4 py-3 shadow-[0_4px_25px_rgba(200,162,77,0.4)] hover:shadow-[0_6px_30px_rgba(200,162,77,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider group"
          >
            <Bot className="w-4 h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
            <span>Copiloto IA Gemini</span>
            <span className="bg-black text-[#c8a24d] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
              ONLINE
            </span>
          </button>
        </div>
      )}

      {/* Modals */}
      <ClientDetailModal
        client={selectedClient}
        properties={properties}
        onClose={() => setSelectedClient(null)}
        onUpdateStage={handleUpdateClientStage}
        onAddInteraction={handleAddInteraction}
        onOpenWhatsApp={handleTriggerClientWhatsApp}
        onOpenLiveWhatsAppChat={(client) => {
          setSelectedClient(null);
          setLiveChatClient(client);
        }}
      />

      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onTriggerSmartMatch={(property) => {
          setSelectedProperty(null);
          setCurrentTab('smart_match');
        }}
        onShareWhatsApp={handleTriggerPropertyWhatsApp}
        onDeleteProperty={handleDeleteProperty}
        onUpdateStatus={handleUpdatePropertyStatus}
      />

      <NewPropertyModal
        isOpen={isNewPropertyOpen}
        onClose={() => setIsNewPropertyOpen(false)}
        onSaveProperty={handleSaveProperty}
      />

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSaveLead={handleSaveLead}
        prefillStage={newLeadPrefillStage}
      />

      <WhatsAppGeneratorModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        client={whatsAppClientTarget}
        property={whatsAppPropertyTarget}
      />

      <ClientWhatsAppLiveModal
        client={liveChatClient}
        properties={properties}
        onClose={() => setLiveChatClient(null)}
        onSendMessage={handleSendLiveChatMessage}
        onSyncHistory={handleSyncLiveChatHistory}
      />
    </div>
  );
};
