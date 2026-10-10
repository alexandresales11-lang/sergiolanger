import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { CrmUser } from '../../types';
import {
  DEFAULT_TEAM_MEMBERS,
  loginStaffUser,
  getTeamWhitelist,
} from '../../lib/authService';

interface CrmLoginScreenProps {
  onSuccess: (user: CrmUser) => void;
  onBackToSite: () => void;
}

export const CrmLoginScreen: React.FC<CrmLoginScreenProps> = ({
  onSuccess,
  onBackToSite,
}) => {
  const [email, setEmail] = useState('alexandre_sales_11@hotmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMembers, setActiveMembers] = useState<CrmUser[]>(DEFAULT_TEAM_MEMBERS);

  useEffect(() => {
    // Carrega membros da lista branca (Firestore ou local)
    getTeamWhitelist()
      .then((members) => {
        const onlyActive = members.filter((m) => m.status !== 'terminated');
        if (onlyActive.length > 0) {
          setActiveMembers(onlyActive);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail corporativo cadastrado.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, informe sua senha de acesso.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginStaffUser(email, password, rememberMe);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (member: CrmUser) => {
    setEmail(member.email);
    setPassword('admin123');
    setErrorMessage(null);
    try {
      setIsLoading(true);
      const user = await loginStaffUser(member.email, 'admin123', true);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro no login rápido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-[#c8a24d] selection:text-black">
      {/* Top Header Bar */}
      <header className="border-b border-neutral-900 bg-[#0e0e0e]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-neutral-400 hover:text-white uppercase transition-colors px-3.5 py-2 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#c8a24d]" />
          <span>Voltar ao Site Oficial</span>
        </button>

        <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#c8a24d]" />
          <span>Ambiente Seguro • Acesso Restrito</span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Brand Presentation */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#181818] border border-[#c8a24d]/40 mb-2 shadow-lg shadow-black/50">
              <Lock className="w-6 h-6 text-[#c8a24d]" />
            </div>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-white font-extrabold text-2xl tracking-[0.2em] uppercase">
                SERGIO LANGER
              </span>
              <span className="text-[#c8a24d] font-bold text-xs tracking-[0.3em] uppercase mt-1">
                PRIVATE REAL ESTATE CRM
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto pt-2">
              Portal exclusivo de gestão de clientes VIP, pipeline de vendas e curadoria imobiliária.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#121212] border border-neutral-800 shadow-2xl p-6 sm:p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1b1b1b] border border-[#c8a24d]/50 text-[#c8a24d] text-[10px] font-extrabold tracking-widest uppercase px-3 py-0.5">
              Identificação de Colaborador
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-950/60 border border-red-800/80 p-3 flex items-start space-x-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-neutral-300 uppercase">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.nome@sergiolanger.com.br"
                    className="w-full bg-[#181818] border border-neutral-800 focus:border-[#c8a24d] text-white text-sm pl-10 pr-4 py-2.5 focus:outline-none transition-colors placeholder:text-neutral-600"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold tracking-wider text-neutral-300 uppercase">
                    Senha de Acesso
                  </label>
                  <span className="text-[10px] text-neutral-500">
                    Mínimo de 4 caracteres
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-800 focus:border-[#c8a24d] text-white text-sm pl-10 pr-10 py-2.5 focus:outline-none transition-colors placeholder:text-neutral-600"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#c8a24d] w-3.5 h-3.5 bg-neutral-900 border-neutral-700"
                  />
                  <span className="text-neutral-400 text-xs">Lembrar meu acesso neste aparelho</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center space-x-2 bg-[#c8a24d] hover:bg-[#b8933e] text-black font-extrabold text-xs uppercase tracking-widest py-3 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Autenticando Colaborador...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no CRM Privado</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Access / Demo Team Profiles */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  Acesso Rápido para a Equipe
                </span>
                <span className="text-[9px] text-[#c8a24d] font-semibold uppercase">
                  1-Clique
                </span>
              </div>

              <div className="space-y-2">
                {activeMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleQuickLogin(member)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-2.5 rounded bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 hover:border-[#c8a24d]/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#c8a24d]/30 flex items-center justify-center text-xs font-bold text-[#c8a24d] group-hover:border-[#c8a24d]">
                        {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white group-hover:text-[#c8a24d] transition-colors">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {member.roleTitle} {member.creci ? `• ${member.creci}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 group-hover:text-white flex items-center space-x-1">
                      <span>Entrar</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-neutral-900 bg-[#0a0a0a] py-4 text-center px-4">
        <p className="text-[11px] text-neutral-400 max-w-xl mx-auto">
          Ambiente restrito e protegido por autenticação em nuvem Google Firebase. O acesso indevido é monitorado e proibido pela legislação vigente.
        </p>
      </footer>
    </div>
  );
};
