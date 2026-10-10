import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Award,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  KeyRound,
  Building,
  UserCheck,
} from 'lucide-react';
import { CrmUser, UserRole } from '../../types';

interface CrmTeamManagementProps {
  currentUser: CrmUser | null;
  teamMembers: CrmUser[];
  onAddMember: (member: CrmUser) => Promise<void>;
  onUpdateStatus: (memberId: string, status: 'active' | 'suspended' | 'terminated') => Promise<void>;
  onDeleteMember: (memberId: string) => Promise<void>;
  isCloudSynced: boolean;
}

export const CrmTeamManagement: React.FC<CrmTeamManagementProps> = ({
  currentUser,
  teamMembers,
  onAddMember,
  onUpdateStatus,
  onDeleteMember,
  isCloudSynced,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusConfirmModal, setStatusConfirmModal] = useState<{
    member: CrmUser;
    action: 'suspend' | 'terminate' | 'activate' | 'delete';
  } | null>(null);

  // Formulário de Novo Colaborador
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('broker');
  const [newRoleTitle, setNewRoleTitle] = useState('Consultor Imobiliário Associado');
  const [newCreci, setNewCreci] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('Langer@2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.creci && member.creci.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const activeCount = teamMembers.filter((m) => m.status === 'active').length;
  const suspendedCount = teamMembers.filter((m) => m.status === 'suspended').length;
  const terminatedCount = teamMembers.filter((m) => m.status === 'terminated').length;

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Nome e E-mail corporativo são obrigatórios.' });
      return;
    }

    // Verifica se já existe esse e-mail
    if (teamMembers.some((m) => m.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setFeedbackMsg({ type: 'error', text: 'Já existe um colaborador cadastrado com este e-mail.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const newMember: CrmUser = {
        id: `user-${Date.now()}`,
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        roleTitle: newRoleTitle.trim() || (newRole === 'admin' ? 'Gestor Administrativo' : 'Consultor Imobiliário'),
        creci: newCreci.trim() || undefined,
        phone: newPhone.trim() || undefined,
        status: 'active',
        passwordHash: newPassword,
        addedAt: new Date().toISOString(),
        addedBy: currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Diretoria',
      };

      await onAddMember(newMember);
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewCreci('');
      setNewPhone('');
      setFeedbackMsg({
        type: 'success',
        text: `Colaborador ${newMember.name} cadastrado com sucesso! O acesso ao CRM está liberado.`,
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Erro ao cadastrar novo colaborador.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeStatusChange = async () => {
    if (!statusConfirmModal) return;
    const { member, action } = statusConfirmModal;

    try {
      setIsSubmitting(true);
      if (action === 'delete') {
        await onDeleteMember(member.id);
        setFeedbackMsg({
          type: 'success',
          text: `Colaborador ${member.name} foi removido permanentemente da lista da imobiliária.`,
        });
      } else if (action === 'terminate') {
        await onUpdateStatus(member.id, 'terminated');
        setFeedbackMsg({
          type: 'success',
          text: `Acesso de ${member.name} foi REVOGADO (Demitido). Login bloqueado imediatamente.`,
        });
      } else if (action === 'suspend') {
        await onUpdateStatus(member.id, 'suspended');
        setFeedbackMsg({
          type: 'success',
          text: `Acesso de ${member.name} foi temporariamente suspenso.`,
        });
      } else if (action === 'activate') {
        await onUpdateStatus(member.id, 'active');
        setFeedbackMsg({
          type: 'success',
          text: `Acesso de ${member.name} reativado com sucesso!`,
        });
      }
      setStatusConfirmModal(null);
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Erro ao atualizar status do colaborador.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-[#141414] border border-neutral-800 p-6 rounded-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#c8a24d] mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-extrabold tracking-widest">
                Controle de Acessos & Equipe Privada
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Gestão de Colaboradores & Permissões
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Somente funcionários cadastrados e com status <strong>ATIVO</strong> conseguem fazer login no CRM. Em caso de contratação ou demissão, altere o status aqui para liberar ou revogar o acesso imediatamente em nuvem.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 transition-all shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Adicionar Colaborador</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="bg-[#0e0e0e] border border-neutral-800 p-3.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Total Cadastrados
            </span>
            <p className="text-xl font-extrabold text-white mt-1">
              {teamMembers.length}
            </p>
          </div>
          <div className="bg-[#0e0e0e] border border-[#22c55e]/20 p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#22c55e] tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>Acessos Ativos</span>
            </span>
            <p className="text-xl font-extrabold text-[#22c55e] mt-1">
              {activeCount}
            </p>
          </div>
          <div className="bg-[#0e0e0e] border border-[#eab308]/20 p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#eab308] tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#eab308]" />
              <span>Acessos Suspensos</span>
            </span>
            <p className="text-xl font-extrabold text-[#eab308] mt-1">
              {suspendedCount}
            </p>
          </div>
          <div className="bg-[#0e0e0e] border border-[#ef4444]/20 p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#ef4444] tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>Demitidos / Revogados</span>
            </span>
            <p className="text-xl font-extrabold text-[#ef4444] mt-1">
              {terminatedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 border flex items-center space-x-3 text-xs font-semibold ${
            feedbackMsg.type === 'success'
              ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
              : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111] p-3 border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail ou CRECI..."
            className="w-full bg-[#181818] border border-neutral-800 text-xs text-white pl-9 pr-3 py-2 focus:border-[#c8a24d] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="bg-[#181818] border border-neutral-800 text-xs text-neutral-300 px-3 py-2 focus:border-[#c8a24d] focus:outline-none"
          >
            <option value="all">Todos os Cargos</option>
            <option value="admin">Administrador / Diretor</option>
            <option value="broker">Corretor / Consultor</option>
            <option value="associate">Associado / SDR</option>
          </select>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-[#121212] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#0e0e0e] text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-bold">Colaborador</th>
                <th className="py-3.5 px-4 font-bold">Cargo & Nível</th>
                <th className="py-3.5 px-4 font-bold">Contato & CRECI</th>
                <th className="py-3.5 px-4 font-bold">Status do Acesso</th>
                <th className="py-3.5 px-4 font-bold">Último Acesso</th>
                <th className="py-3.5 px-4 font-bold text-right">Ações da Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredMembers.map((member) => {
                const isMemberAdmin = member.role === 'admin';
                const isCurrentSelf = currentUser?.id === member.id;
                const isTerminated = member.status === 'terminated';
                const isSuspended = member.status === 'suspended';
                const isActive = member.status === 'active';

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-neutral-900/60 transition-colors ${
                      isTerminated ? 'opacity-60 bg-red-950/10' : ''
                    }`}
                  >
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#1b1b1b] border border-[#c8a24d]/40 flex items-center justify-center text-xs font-bold text-[#c8a24d] flex-shrink-0">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white text-xs">
                              {member.name}
                            </span>
                            {isCurrentSelf && (
                              <span className="px-1.5 py-0.2 bg-[#c8a24d]/20 text-[#c8a24d] text-[9px] font-bold uppercase rounded">
                                Você
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400 block">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isMemberAdmin
                            ? 'bg-[#c8a24d]/10 text-[#c8a24d] border border-[#c8a24d]/30'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {isMemberAdmin && <ShieldCheck className="w-3 h-3 mr-0.5" />}
                        <span>{member.roleTitle}</span>
                      </span>
                    </td>

                    {/* CRECI & Phone */}
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div className="space-y-0.5">
                        <div className="font-mono text-[11px]">
                          {member.creci || <span className="text-neutral-600">Sem CRECI</span>}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {member.phone || <span className="text-neutral-600">—</span>}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isActive && (
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          <span>ATIVO (Permitido)</span>
                        </span>
                      )}
                      {isSuspended && (
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
                          <span>SUSPENSO</span>
                        </span>
                      )}
                      {isTerminated && (
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                          <span>DEMITIDO (Bloqueado)</span>
                        </span>
                      )}
                    </td>

                    {/* Last login */}
                    <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                      {member.lastLoginAt ? (
                        new Date(member.lastLoginAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      ) : (
                        <span className="text-neutral-600">Nunca acessou</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end space-x-2">
                          {/* Reativar se estiver suspenso ou demitido */}
                          {(isSuspended || isTerminated) && (
                            <button
                              onClick={() =>
                                setStatusConfirmModal({ member, action: 'activate' })
                              }
                              className="px-2 py-1 bg-[#22c55e]/15 hover:bg-[#22c55e]/30 text-[#22c55e] border border-[#22c55e]/40 font-bold text-[10px] uppercase transition-colors"
                              title="Reativar acesso do colaborador"
                            >
                              Reativar
                            </button>
                          )}

                          {/* Suspender */}
                          {isActive && !isCurrentSelf && (
                            <button
                              onClick={() =>
                                setStatusConfirmModal({ member, action: 'suspend' })
                              }
                              className="px-2 py-1 bg-[#eab308]/15 hover:bg-[#eab308]/30 text-[#eab308] border border-[#eab308]/40 font-bold text-[10px] uppercase transition-colors"
                              title="Suspender acesso temporariamente"
                            >
                              Pausar
                            </button>
                          )}

                          {/* Demitir / Revogar Acesso */}
                          {!isTerminated && !isCurrentSelf && (
                            <button
                              onClick={() =>
                                setStatusConfirmModal({ member, action: 'terminate' })
                              }
                              className="px-2 py-1 bg-[#ef4444]/15 hover:bg-[#ef4444]/30 text-[#ef4444] border border-[#ef4444]/40 font-bold text-[10px] uppercase transition-colors"
                              title="Revogar acesso imediato (Demitido)"
                            >
                              Demitir
                            </button>
                          )}

                          {/* Excluir da base */}
                          {!isCurrentSelf && (
                            <button
                              onClick={() =>
                                setStatusConfirmModal({ member, action: 'delete' })
                              }
                              className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Remover permanentemente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-600 text-[10px] italic">
                          Apenas Administrador
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Adicionar Novo Colaborador */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center space-x-2 text-[#c8a24d]">
                <UserPlus className="w-5 h-5" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Contratar / Liberar Novo Colaborador
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-400 text-xs mt-3">
              Cadastre o e-mail oficial do colaborador. Assim que você salvar, este colaborador estará autorizado a acessar o CRM com a senha configurada.
            </p>

            <form onSubmit={handleCreateMember} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Rafael Bittencourt"
                  className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  E-mail de Acesso (Login) *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex: rafael@sergiolanger.com.br ou email@gmail.com"
                  className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Apenas este e-mail exato conseguirá passar pela tela de login do CRM.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Nível de Permissão
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setNewRole(r);
                      if (r === 'admin') setNewRoleTitle('Gestor Administrativo');
                      else if (r === 'broker') setNewRoleTitle('Consultor Imobiliário Senior');
                      else setNewRoleTitle('Assistente / SDR');
                    }}
                    className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                  >
                    <option value="broker">Corretor / Consultor</option>
                    <option value="admin">Administrador / Diretor</option>
                    <option value="associate">Associado / SDR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Título / Cargo
                  </label>
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="Ex: Consultor Imobiliário Senior"
                    className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Registro CRECI
                  </label>
                  <input
                    type="text"
                    value={newCreci}
                    onChange={(e) => setNewCreci(e.target.value)}
                    placeholder="Ex: CRECI 245910-F"
                    className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Ex: +55 11 99999-8888"
                    className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 focus:border-[#c8a24d] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Senha Inicial de Acesso
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Defina a senha do colaborador"
                  className="w-full bg-[#1b1b1b] border border-neutral-800 text-white text-xs px-3 py-2.5 font-mono focus:border-[#c8a24d] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Liberar Acesso ao CRM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmação de Alteração de Status / Demissão */}
      {statusConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 w-full max-w-md p-6">
            <div className="flex items-center space-x-3 text-red-500 mb-3">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {statusConfirmModal.action === 'terminate' && 'Confirmar Demissão / Revogação'}
                {statusConfirmModal.action === 'suspend' && 'Pausar Acesso Temporário'}
                {statusConfirmModal.action === 'activate' && 'Reativar Acesso do Colaborador'}
                {statusConfirmModal.action === 'delete' && 'Excluir da Base de Dados'}
              </h3>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed">
              {statusConfirmModal.action === 'terminate' && (
                <>
                  Deseja realmente revogar o acesso de <strong>{statusConfirmModal.member.name}</strong> ({statusConfirmModal.member.email})? <br /><br />
                  <span className="text-red-400">
                    O colaborador não conseguirá mais entrar no CRM imediatamente. Todos os clientes e imóveis cadastrados permanecem salvos em nuvem para serem redistribuídos.
                  </span>
                </>
              )}
              {statusConfirmModal.action === 'suspend' && (
                <>
                  O acesso de <strong>{statusConfirmModal.member.name}</strong> será temporariamente suspenso até que você decida reativá-lo.
                </>
              )}
              {statusConfirmModal.action === 'activate' && (
                <>
                  O colaborador <strong>{statusConfirmModal.member.name}</strong> voltará a ter acesso normal ao CRM usando seu e-mail corporativo.
                </>
              )}
              {statusConfirmModal.action === 'delete' && (
                <>
                  Atenção: remover <strong>{statusConfirmModal.member.name}</strong> apagará o registro dele definitivamente da lista de colaboradores autorizados.
                </>
              )}
            </p>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStatusConfirmModal(null)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-bold uppercase cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={executeStatusChange}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider cursor-pointer ${
                  statusConfirmModal.action === 'activate'
                    ? 'bg-[#22c55e] hover:bg-[#16a34a] text-black'
                    : 'bg-[#ef4444] hover:bg-[#dc2626] text-white'
                }`}
              >
                {isSubmitting ? 'Processando...' : 'Confirmar Alteração'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
