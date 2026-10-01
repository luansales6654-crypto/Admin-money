import React, { useState } from 'react';
import { Lock, Sparkles, Check, MessageCircle, ArrowRight, ShieldAlert, KeyRound, Wrench } from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../../types';
import { formatWhatsAppLink, normalizeWhatsAppNumber, SALES_WHATSAPP_DISPLAY } from '../../lib/whatsapp';

interface TrialExpiredPaywallModalProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const TrialExpiredPaywallModal: React.FC<TrialExpiredPaywallModalProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activationKey, setActivationKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [keySuccess, setKeySuccess] = useState('');

  const salesPhone = normalizeWhatsAppNumber(user.whatsappSalesNumber);

  const pricePro = billingPeriod === 'monthly' ? '50,17' : '40,14';
  const pricePremium = billingPeriod === 'monthly' ? '96,90' : '77,52';

  const proMessage = `Olá! Meu teste gratuito de 3 dias no Admin Money encerrou. Quero assinar o Plano Pro (${billingPeriod === 'monthly' ? 'R$ 50,17/mês' : 'Anual R$ 40,14/mês'}). Como faço para liberar meu acesso?`;
  const premiumMessage = `Olá! Meu teste gratuito de 3 dias no Admin Money encerrou. Quero assinar o Plano Premium (${billingPeriod === 'monthly' ? 'R$ 96,90/mês' : 'Anual R$ 77,52/mês'}). Como faço para liberar meu acesso?`;

  const proUrl = formatWhatsAppLink(salesPhone, proMessage);
  const premiumUrl = formatWhatsAppLink(salesPhone, premiumMessage);

  const handleActivateManualKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError('');
    setKeySuccess('');

    const clean = activationKey.trim().toUpperCase();
    if (clean === 'PRO-2026' || clean === 'VIP-PRO' || clean === '5017') {
      const updated: UserProfile = {
        ...user,
        plan: 'pro',
        isSubscriptionActive: true,
      };
      onUpdateUser(updated);
      setKeySuccess('Plano Pro ativado com sucesso! Aproveite.');
    } else if (clean === 'PREMIUM-2026' || clean === 'VIP-PREMIUM' || clean === '9690') {
      const updated: UserProfile = {
        ...user,
        plan: 'premium',
        isSubscriptionActive: true,
      };
      onUpdateUser(updated);
      setKeySuccess('Plano Premium ativado com sucesso! Aproveite.');
    } else {
      setKeyError('Chave de ativação inválida. Verifique ou solicite sua chave no WhatsApp.');
    }
  };

  // Developer simulation helper for testing
  const handleSimulateExtend = () => {
    const now = new Date();
    const updated: UserProfile = {
      ...user,
      plan: 'trial',
      trialExpiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isSubscriptionActive: false,
    };
    onUpdateUser(updated);
  };

  const handleSimulateActivatePro = () => {
    const updated: UserProfile = {
      ...user,
      plan: 'pro',
      isSubscriptionActive: true,
    };
    onUpdateUser(updated);
  };

  const handleSimulateActivatePremium = () => {
    const updated: UserProfile = {
      ...user,
      plan: 'premium',
      isSubscriptionActive: true,
    };
    onUpdateUser(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#101613] border-2 border-[#FF5252]/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-auto relative animate-in fade-in zoom-in-95">
        
        {/* Header Alert */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5252]/15 border border-[#FF5252]/30 text-xs font-bold text-[#FF5252]">
            <ShieldAlert className="w-4 h-4" />
            <span>ACESSO TEMPORARIAMENTE BLOQUEADO</span>
          </div>

          <div className="flex justify-center pt-1">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF5252]/20 to-[#00E676]/20 border border-[#1F2B23] flex items-center justify-center text-[#00E676]">
              <Lock className="w-8 h-8 text-[#FF5252]" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Seu Período de Teste de 3 Dias Encerrou
          </h2>

          <p className="text-xs sm:text-sm text-[#9CAE9F] max-w-xl mx-auto leading-relaxed">
            Esperamos que tenha gostado de experimentar o <strong>Admin Money</strong>! O funcionamento da plataforma está suspenso. Para desbloquear imediatamente o uso completo e manter suas movimentações salvas, selecione um dos planos abaixo:
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs mt-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-xl font-bold transition ${
                billingPeriod === 'monthly' ? 'bg-[#00E676] text-[#050706]' : 'text-[#65796A] hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                billingPeriod === 'yearly' ? 'bg-[#00E676] text-[#050706]' : 'text-[#65796A] hover:text-white'
              }`}
            >
              <span>Anual (20% OFF)</span>
            </button>
          </div>
        </div>

        {/* 2 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Plano Pro */}
          <div className="p-6 rounded-3xl bg-[#151D18] border-2 border-[#00E676] flex flex-col justify-between space-y-5 relative shadow-xl shadow-[#00E676]/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#00E676] uppercase tracking-wider">Plano Pro</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] font-bold">
                  Mais Escolhido
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white">
                R$ {pricePro} <span className="text-xs text-[#65796A] font-normal">/mês</span>
              </div>
              <p className="text-xs text-[#9CAE9F]">
                Gestão completa de despesas, contas, metas e compras parceladas até 24x.
              </p>
              <ul className="space-y-2 text-xs text-white pt-1">
                <li className="flex items-center gap-2">✓ Todas as movimentações liberadas</li>
                <li className="flex items-center gap-2">✓ Controle de cartões e faturas</li>
                <li className="flex items-center gap-2">✓ Simulador "Posso Gastar?"</li>
                <li className="flex items-center gap-2">✓ Metas de economia com aportes</li>
                <li className="flex items-center gap-2">✓ Relatórios e exportação CSV</li>
              </ul>
            </div>

            <a
              href={proUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Desbloquear Plano Pro (R$ {pricePro})</span>
            </a>
          </div>

          {/* Plano Premium */}
          <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider">Premium AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151D18] text-[#9CAE9F] font-mono">
                  Completo
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white">
                R$ {pricePremium} <span className="text-xs text-[#65796A] font-normal">/mês</span>
              </div>
              <p className="text-xs text-[#65796A]">
                Tudo do Pro + Inteligência Artificial financeira e regras automáticas avançadas.
              </p>
              <ul className="space-y-2 text-xs text-[#9CAE9F] pt-1">
                <li className="flex items-center gap-2">✓ Tudo do Plano Pro</li>
                <li className="flex items-center gap-2">✓ Assistente IA Financeiro via Gemini</li>
                <li className="flex items-center gap-2">✓ Regras automáticas de segurança</li>
                <li className="flex items-center gap-2">✓ Detecção de assinaturas duplicadas</li>
                <li className="flex items-center gap-2">✓ Suporte prioritário via WhatsApp</li>
              </ul>
            </div>

            <a
              href={premiumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] text-[#00E676] text-xs font-black border border-[#00E676]/40 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Desbloquear Premium (R$ {pricePremium})</span>
            </a>
          </div>
        </div>

        {/* WhatsApp Support & Manual Activation */}
        <div className="p-4 rounded-2xl bg-[#151D18] border border-[#1F2B23] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#9CAE9F]">
              <MessageCircle className="w-4 h-4 text-[#00E676]" />
              <span>
                Dúvidas ou envio de comprovante: <strong>(21) 99658-9629</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[11px] text-[#00E676] hover:underline flex items-center gap-1 font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Tenho Chave de Ativação</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="text-[11px] text-[#65796A] hover:text-white"
              >
                Sair da Conta
              </button>
            </div>
          </div>

          {showKeyInput && (
            <form onSubmit={handleActivateManualKey} className="pt-2 border-t border-[#1F2B23] flex gap-2">
              <input
                type="text"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                placeholder="Digite sua chave de acesso (ex: PRO-2026)"
                className="flex-1 px-4 py-2 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black"
              >
                Ativar
              </button>
            </form>
          )}

          {keyError && (
            <p className="text-[11px] text-[#FF5252]">{keyError}</p>
          )}
          {keySuccess && (
            <p className="text-[11px] text-[#00E676] font-bold">{keySuccess}</p>
          )}
        </div>

        {/* Micro-SaaS Owner Testing Panel */}
        <div className="pt-2 border-t border-[#1F2B23]/40 flex flex-wrap items-center justify-between text-[11px] text-[#65796A] gap-2">
          <div className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Modo Administrador do Micro-SaaS (Testar fluxos):</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateExtend}
              className="px-2.5 py-1 rounded-lg bg-[#151D18] hover:bg-[#1E2822] text-[#00E676] transition"
              title="Restaura 3 dias completos de teste para simular novo usuário"
            >
              +3 Dias de Teste
            </button>
            <button
              onClick={handleSimulateActivatePro}
              className="px-2.5 py-1 rounded-lg bg-[#151D18] hover:bg-[#1E2822] text-white transition"
              title="Ativa o Plano Pro e destrava o micro-SaaS instantaneamente"
            >
              Liberar Pro
            </button>
            <button
              onClick={handleSimulateActivatePremium}
              className="px-2.5 py-1 rounded-lg bg-[#151D18] hover:bg-[#1E2822] text-white transition"
              title="Ativa o Plano Premium e destrava o micro-SaaS instantaneamente"
            >
              Liberar Premium
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
