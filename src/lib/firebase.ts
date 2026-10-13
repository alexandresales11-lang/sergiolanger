import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { ClientVIP, Property, CrmUser } from '../types';
import { INITIAL_PROPERTIES, INITIAL_CLIENTS } from '../data/crmData';

// Configuração do Firebase carregada de forma segura
const firebaseConfig = {
  projectId: "gen-lang-client-0889025894",
  appId: "1:238318088561:web:0f4bcd0738eed1501b06d0",
  apiKey: "AIzaSyC1lq4GTNsdUOVjjZGye6-vHQMzmrJVUE4",
  authDomain: "gen-lang-client-0889025894.firebaseapp.com",
  storageBucket: "gen-lang-client-0889025894.firebasestorage.app",
  messagingSenderId: "238318088561",
};

// Inicialização única do Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-sergiolanger-b2b93f75-7b21-4296-99c2-d78aeceb7a08");

// Coleções
export const CLIENTS_COLLECTION = 'vip_clients';
export const PROPERTIES_COLLECTION = 'luxury_properties';
export const AI_MESSAGES_COLLECTION = 'ai_chat_history';
export const TEAM_MEMBERS_COLLECTION = 'team_members';

/**
 * Inicializa os dados no Firestore se as coleções estiverem vazias
 */
export async function seedDatabaseIfEmpty(): Promise<{ seeded: boolean; clientsCount: number; propertiesCount: number }> {
  try {
    const clientsRef = collection(db, CLIENTS_COLLECTION);
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);

    const [clientsSnap, propsSnap] = await Promise.all([
      getDocs(clientsRef),
      getDocs(propertiesRef)
    ]);

    let seeded = false;

    if (propsSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_PROPERTIES.forEach((prop) => {
        const propDoc = doc(db, PROPERTIES_COLLECTION, prop.id);
        batch.set(propDoc, prop);
      });
      await batch.commit();
      seeded = true;
    }

    if (clientsSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_CLIENTS.forEach((client) => {
        const clientDoc = doc(db, CLIENTS_COLLECTION, client.id);
        batch.set(clientDoc, client);
      });
      await batch.commit();
      seeded = true;
    }

    return {
      seeded,
      clientsCount: clientsSnap.empty ? INITIAL_CLIENTS.length : clientsSnap.size,
      propertiesCount: propsSnap.empty ? INITIAL_PROPERTIES.length : propsSnap.size
    };
  } catch (error) {
    console.warn('Firebase Firestore offline or seed fallback:', error);
    return { seeded: false, clientsCount: INITIAL_CLIENTS.length, propertiesCount: INITIAL_PROPERTIES.length };
  }
}

/**
 * Remove recursivamente todas as chaves com valor undefined
 * para evitar erros do Firestore (Unsupported field value: undefined)
 */
export function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Salva ou atualiza um cliente no Firestore
 */
export async function saveClientToFirestore(client: ClientVIP): Promise<void> {
  try {
    const cleaned = cleanForFirestore(client);
    const clientRef = doc(db, CLIENTS_COLLECTION, client.id);
    await setDoc(clientRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Erro ao salvar cliente no Firestore:', err);
    throw err;
  }
}

/**
 * Salva ou atualiza um imóvel no Firestore
 */
export async function savePropertyToFirestore(property: Property): Promise<void> {
  try {
    const cleaned = cleanForFirestore(property);
    const propRef = doc(db, PROPERTIES_COLLECTION, property.id);
    await setDoc(propRef, cleaned, { merge: true });
    console.log(`[Firestore] Imóvel salvo na nuvem com sucesso: ${property.id} (${property.title})`);
  } catch (err) {
    console.error('Erro ao salvar imóvel no Firestore:', err);
    throw err;
  }
}

/**
 * Remove um cliente do Firestore
 */
export async function deleteClientFromFirestore(clientId: string): Promise<void> {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await deleteDoc(clientRef);
  } catch (err) {
    console.error('Erro ao excluir cliente no Firestore:', err);
    throw err;
  }
}

/**
 * Remove um imóvel do Firestore
 */
export async function deletePropertyFromFirestore(propertyId: string): Promise<void> {
  try {
    const propRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await deleteDoc(propRef);
    console.log(`[Firestore] Imóvel excluído na nuvem: ${propertyId}`);
  } catch (err) {
    console.error('Erro ao excluir imóvel no Firestore:', err);
    throw err;
  }
}

/**
 * Salva ou atualiza um colaborador no Firestore
 */
export async function saveTeamMemberToFirestore(member: CrmUser): Promise<void> {
  try {
    const cleaned = cleanForFirestore(member);
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, member.id);
    await setDoc(memberRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Erro ao salvar colaborador no Firestore:', err);
    throw err;
  }
}

/**
 * Remove um colaborador do Firestore
 */
export async function deleteTeamMemberFromFirestore(memberId: string): Promise<void> {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, memberId);
    await deleteDoc(memberRef);
  } catch (err) {
    console.error('Erro ao excluir colaborador no Firestore:', err);
    throw err;
  }
}

/**
 * Busca todos os colaboradores cadastrados no Firestore
 */
export async function getTeamMembersFromFirestore(): Promise<CrmUser[]> {
  try {
    const membersRef = collection(db, TEAM_MEMBERS_COLLECTION);
    const snap = await getDocs(membersRef);
    if (snap.empty) return [];
    const members: CrmUser[] = [];
    snap.forEach((docSnap) => {
      members.push(docSnap.data() as CrmUser);
    });
    return members;
  } catch (err) {
    console.warn('Fallback ao ler colaboradores do Firestore:', err);
    return [];
  }
}
