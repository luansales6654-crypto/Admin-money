import React, { useState } from 'react';
import { User, Bell, Shield, Trash2, RefreshCw, Check, AlertTriangle, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../lib/storage';
import { normalizeWhatsAppNumber } from '../../lib/whatsapp';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetDemo: () => void;
  onDeleteAccount: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetDemo,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [incomeTarget, setIncomeTarget] = useState(
    user.monthlyIncomeTarget?.toString() || '7200'
  );
  const [whatsappPhone, setWhatsappPhone] = useState(() => normalizeWhatsAppNumber(user.whatsappSalesNumber));
  const [notifyBudget, setNotifyBudget] = useState(user.preferences.notifyBudgetAlerts);
  const [notifyDue, setNotifyDue] = useState(user.preferences.notifyDueDates);
  const [notifyWeekly, setNotifyWeekly] = useState(user.preferences.notifyWeeklySummary);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      monthlyIncomeTarget: parseFloat(incomeTarget) || 5000,
      whatsappSalesNumber: whatsappPhone.trim(),
      preferences: {
        ...user.preferences,
        notifyBudgetAlerts: notifyBudget,
        notifyDueDates: notifyDue,
        notifyWeeklySummary: notifyWeekly,
      },
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações & Perfil</h1>
        <p className="text-xs text-[#A5A5AD]">
          Gerencie seus dados cadastrais, preferências de notificação e privacidade.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 text-xs text-[#00E676] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1F2B23]">
          <User className="w-4 h-4 text-[#00E676]" />
          <h2 className="text-sm font-bold text-white">Dados do Usuário & Micro-SaaS</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#65796A] mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">WhatsApp de Vendas (DDD + Número)</label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="Ex: 5521996589629"
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E676]"
              />
              <p className="text-[10px] text-[#65796A] mt-1">
                Número que receberá as mensagens dos clientes na contratação dos planos Pro e Premium.
              </p>
            </div>

            <div>
              <label className="block text-xs text-[#65796A] mb-1">Meta de Renda Mensal (R$)</label>
              <input
                type="number"
                value={incomeTarget}
                onChange={(e) => setIncomeTarget(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E676]"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="pt-4 border-t border-[#1F2B23] space-y-3">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Notificações & Alertas</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3 text-xs text-[#9CAE9F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyBudget}
                  onChange={(e) => setNotifyBudget(e.target.checked)}
                  className="w-4 h-4 accent-[#00E676] rounded"
                />
                <span>Alertar quando uma categoria atingir 85% do teto</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#9CAE9F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDue}
                  onChange={(e) => setNotifyDue(e.target.checked)}
                  className="w-4 h-4 accent-[#00E676] rounded"
                />
                <span>Lembrar de contas vencendo nos próximos 3 dias</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#9CAE9F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyWeekly}
                  onChange={(e) => setNotifyWeekly(e.target.checked)}
                  className="w-4 h-4 accent-[#00E676] rounded"
                />
                <span>Habilitar resumo semanal de despesas</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Demo reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#00E676]" />
          <span>Gestão de Dados do Micro-SaaS</span>
        </h3>
        <p className="text-xs text-[#9CAE9F]">
          Alterne entre o modo de demonstração comercial (para vender e apresentar aos clientes) e o modo limpo (zerar tudo para uso real).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onResetDemo}
            className="px-4 py-2.5 rounded-xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] text-xs font-semibold text-white transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Carregar Dados de Demonstração (Vendas)</span>
          </button>

          <button
            onClick={onDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-[#FF5252]/10 hover:bg-[#FF5252] text-[#FF5252] hover:text-white border border-[#FF5252]/30 text-xs font-semibold transition flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Zerar Tudo (Começar com R$ 0,00)</span>
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101613] border border-[#FF5252]/20 space-y-4">
        <h3 className="text-sm font-bold text-[#FF5252] flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>Zona de Perigo</span>
        </h3>
        <p className="text-xs text-[#65796A]">
          A exclusão da conta é permanente e removerá todas as movimentações, contas, metas e histórico vinculados a este perfil.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF5252]/10 hover:bg-[#FF5252] text-[#FF5252] hover:text-white border border-[#FF5252]/30 text-xs font-semibold transition"
        >
          Excluir Minha Conta Permanentemente
        </button>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#FF5252]/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#FF5252]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Confirmação de Exclusão</h3>
            </div>

            <p className="text-xs text-[#9CAE9F] leading-relaxed">
              Tem certeza de que deseja apagar sua conta? Esta ação é irreversível e excluirá todos os seus dados cadastrados.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs text-[#9CAE9F]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteAccount();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF5252] hover:bg-[#D32F2F] text-white text-xs font-bold transition"
              >
                Sim, Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
