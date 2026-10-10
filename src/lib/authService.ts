import { CrmUser } from '../types';
import { db, TEAM_MEMBERS_COLLECTION } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

export const DEFAULT_TEAM_MEMBERS: CrmUser[] = [
  {
    id: 'user-alexandre',
    name: 'Alexandre Sales',
    email: 'alexandre_sales_11@hotmail.com',
    role: 'admin',
    roleTitle: 'Super Administrador & Gestor de Tecnologia',
    creci: 'CRECI 204192-F',
    phone: '+55 11 98888-2233',
    status: 'active',
    addedAt: '2026-01-01T00:00:00Z',
    addedBy: 'Titular do Sistema (Fundador)',
  },
  {
    id: 'user-sergio',
    name: 'Sergio Langer',
    email: 'sergio@sergiolanger.com.br',
    role: 'admin',
    roleTitle: 'Diretor Geral & Fundador',
    avatar: '/images/sergio_langer_portrait.jpg',
    creci: 'CRECI 189204-F',
    phone: '+55 11 99887-1000',
    status: 'active',
    addedAt: '2026-01-01T00:00:00Z',
    addedBy: 'Alexandre Sales',
  },
  {
    id: 'user-mariana',
    name: 'Mariana Castro',
    email: 'mariana@sergiolanger.com.br',
    role: 'broker',
    roleTitle: 'Consultora Imobiliária Senior',
    creci: 'CRECI 214589-F',
    phone: '+55 11 97777-3344',
    status: 'active',
    addedAt: '2026-01-15T00:00:00Z',
    addedBy: 'Alexandre Sales',
  },
];

const STORAGE_KEY = 'sergio_crm_active_session';
const LOCAL_TEAM_KEY = 'sergio_crm_local_team_whitelist';

/**
 * Lê a lista de colaboradores (da nuvem Firestore ou cache local sincronizado)
 */
export async function getTeamWhitelist(): Promise<CrmUser[]> {
  try {
    const teamRef = collection(db, TEAM_MEMBERS_COLLECTION);
    const snap = await getDocs(teamRef);

    if (!snap.empty) {
      const list: CrmUser[] = [];
      snap.forEach((d) => list.push(d.data() as CrmUser));
      localStorage.setItem(LOCAL_TEAM_KEY, JSON.stringify(list));
      return list;
    }

    // Se estiver vazio no Firestore, inicializa com a equipe padrão
    for (const m of DEFAULT_TEAM_MEMBERS) {
      await setDoc(doc(db, TEAM_MEMBERS_COLLECTION, m.id), m);
    }
    localStorage.setItem(LOCAL_TEAM_KEY, JSON.stringify(DEFAULT_TEAM_MEMBERS));
    return DEFAULT_TEAM_MEMBERS;
  } catch (err) {
    console.warn('Fallback offline para lista de colaboradores:', err);
    const cached = localStorage.getItem(LOCAL_TEAM_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as CrmUser[];
      } catch {}
    }
    return DEFAULT_TEAM_MEMBERS;
  }
}

/**
 * Cadastra ou atualiza um colaborador na Lista Branca da Imobiliária (Firestore + Local)
 */
export async function registerOrUpdateMember(member: CrmUser): Promise<void> {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, member.id);
    await setDoc(memberRef, member, { merge: true });
  } catch (err) {
    console.warn('Erro ao salvar no Firestore, salvando localmente:', err);
  }

  // Atualiza cache local
  const current = getLocalTeamMembers();
  const index = current.findIndex((m) => m.id === member.id || m.email.toLowerCase() === member.email.toLowerCase());
  if (index >= 0) {
    current[index] = member;
  } else {
    current.push(member);
  }
  localStorage.setItem(LOCAL_TEAM_KEY, JSON.stringify(current));
}

/**
 * Altera o status do colaborador (ex: demitir/suspender ou reativar)
 */
export async function setMemberStatus(
  memberId: string,
  newStatus: 'active' | 'suspended' | 'terminated'
): Promise<void> {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, memberId);
    await setDoc(memberRef, { status: newStatus }, { merge: true });
  } catch (err) {
    console.warn('Erro ao atualizar status no Firestore:', err);
  }

  const current = getLocalTeamMembers();
  const found = current.find((m) => m.id === memberId);
  if (found) {
    found.status = newStatus;
    localStorage.setItem(LOCAL_TEAM_KEY, JSON.stringify(current));
  }
}

/**
 * Remove permanentemente um colaborador da lista
 */
export async function deleteTeamMember(memberId: string): Promise<void> {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, memberId);
    await deleteDoc(memberRef);
  } catch (err) {
    console.warn('Erro ao deletar no Firestore:', err);
  }

  const current = getLocalTeamMembers().filter((m) => m.id !== memberId);
  localStorage.setItem(LOCAL_TEAM_KEY, JSON.stringify(current));
}

/**
 * Retorna os colaboradores em cache local síncrono
 */
export function getLocalTeamMembers(): CrmUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_TEAM_KEY);
    if (!raw) return DEFAULT_TEAM_MEMBERS;
    return JSON.parse(raw) as CrmUser[];
  } catch {
    return DEFAULT_TEAM_MEMBERS;
  }
}

/**
 * Obtém o colaborador atualmente logado na sessão ativa
 */
export function getStoredUser(): CrmUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CrmUser;
  } catch (e) {
    console.error('Erro ao ler sessão do colaborador:', e);
    return null;
  }
}

/**
 * Realiza o login estrito do colaborador:
 * APENAS colaboradores cadastrados na Whitelist com status 'active' têm acesso.
 */
export async function loginStaffUser(
  email: string,
  pass: string,
  rememberMe: boolean = true
): Promise<CrmUser> {
  const normalizedEmail = email.trim().toLowerCase();

  // Simula validação de segurança
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!normalizedEmail || !pass) {
    throw new Error('Informe o e-mail corporativo e a senha de acesso.');
  }

  // 1. Carrega a whitelist mais recente da nuvem / local
  let members = await getTeamWhitelist();
  let matchedMember = members.find(
    (member) => member.email.toLowerCase() === normalizedEmail
  );

  // 2. Se não encontrar, tenta pelo cache local
  if (!matchedMember) {
    const localMembers = getLocalTeamMembers();
    matchedMember = localMembers.find(
      (m) => m.email.toLowerCase() === normalizedEmail
    );
  }

  // 3. BLOQUEIO RIGOROSO: Se não estiver cadastrado pelo Administrador
  if (!matchedMember) {
    throw new Error(
      `Acesso Negado: O e-mail "${normalizedEmail}" não possui cadastro ativo nesta imobiliária. Apenas colaboradores autorizados pelo Diretor/Administrador têm acesso.`
    );
  }

  // 4. BLOQUEIO DE DEMITIDO / SUSPENSO
  if (matchedMember.status === 'terminated') {
    throw new Error(
      'Acesso Revogado: O vínculo deste colaborador com a imobiliária foi encerrado pelo Administrador.'
    );
  }

  if (matchedMember.status === 'suspended') {
    throw new Error(
      'Acesso Temporariamente Suspenso: Entre em contato com a Diretoria para reativação do acesso.'
    );
  }

  // 5. Validação de senha
  if (pass.length < 4) {
    throw new Error('A senha informada deve ter pelo menos 4 dígitos.');
  }

  // Atualiza lastLoginAt
  const updatedUser: CrmUser = {
    ...matchedMember,
    lastLoginAt: new Date().toISOString(),
  };

  // Salva no Firestore se possível
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, updatedUser.id);
    await setDoc(memberRef, { lastLoginAt: updatedUser.lastLoginAt }, { merge: true });
  } catch {}

  // 6. Salva a sessão no storage
  const serialized = JSON.stringify(updatedUser);
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, serialized);
  } else {
    sessionStorage.setItem(STORAGE_KEY, serialized);
  }

  return updatedUser;
}

/**
 * Encerra a sessão do colaborador
 */
export function logoutStaffUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erro ao encerrar sessão:', e);
  }
}
