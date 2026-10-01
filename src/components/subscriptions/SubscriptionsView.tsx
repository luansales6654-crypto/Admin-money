import React, { useState } from 'react';
import { Repeat, Plus, AlertCircle, CheckCircle, X, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { Subscription } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  onAddSubscription: (sub: Omit<Subscription, 'id'>) => void;
  onDeleteSubscription: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  onAddSubscription,
  onDeleteSubscription,
  onToggleStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [billingDay, setBillingDay] = useState('15');
  const [category, setCategory] = useState('Streaming');

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(monthlyCost.replace(',', '.'));
    if (!name.trim() || isNaN(cost) || cost <= 0) return;

    onAddSubscription({
      name: name.trim(),
      monthlyCost: cost,
      billingDay: Number(billingDay) || 10,
      category,
      status: 'active',
      detectedAutomatically: false,
    });

    setName('');
    setMonthlyCost('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assinaturas & Recorrências</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Monitore serviços recorrentes, streamings, mensalidades e seu impacto no ano.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Assinatura</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Total Mensal em Assinaturas
          </span>
          <div className="text-2xl font-extrabold font-mono text-[#FF5252] mt-1">
            {formatCurrency(totalMonthly)}
          </div>
          <p className="text-[11px] text-[#65796A] mt-1">
            {activeSubscriptions.length} serviços ativos
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Custo Acumulado em 1 Ano
          </span>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {formatCurrency(totalAnnual)}
          </div>
          <p className="text-[11px] text-[#65796A] mt-1">
            Valor debitado ao longo de 12 meses
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Média por Serviço
          </span>
          <div className="text-2xl font-extrabold font-mono text-[#00E676] mt-1">
            {formatCurrency(activeSubscriptions.length > 0 ? totalMonthly / activeSubscriptions.length : 0)}
          </div>
          <p className="text-[11px] text-[#65796A] mt-1">Por mensalidade cadastrada</p>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`p-6 rounded-3xl bg-[#101613] border transition flex flex-col justify-between space-y-4 ${
              sub.status === 'active' ? 'border-[#1F2B23]' : 'border-[#1F2B23]/40 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#151D18] text-[#65796A] font-mono">
                  {sub.category}
                </span>

                <div className="flex items-center gap-2">
                  {sub.detectedAutomatically && (
                    <span className="text-[10px] text-[#00E676] font-medium bg-[#00E676]/10 px-2 py-0.5 rounded-full">
                      Detectada
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteSubscription(sub.id)}
                    className="p-1 text-[#65796A] hover:text-[#FF5252]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {formatCurrency(sub.monthlyCost)}
                  <span className="text-xs text-[#65796A] font-normal"> / mês</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#24242A] flex items-center justify-between text-xs text-[#707078]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#5E8BFF]" />
                Cobrança todo dia {sub.billingDay}
              </span>

              <button
                onClick={() => onToggleStatus(sub.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition ${
                  sub.status === 'active'
                    ? 'text-[#FF5C6C] hover:bg-[#FF5C6C]/10'
                    : 'text-[#35D07F] hover:bg-[#35D07F]/10'
                }`}
              >
                {sub.status === 'active' ? 'Pausar' : 'Reativar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#111114] border border-[#24242A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#24242A]">
              <h3 className="text-sm font-semibold text-white">Cadastrar Assinatura</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#707078] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#707078] mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Spotify, Netflix, Chat GPT..."
                  required
                  className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Valor Mensal (R$)</label>
                  <input
                    type="text"
                    value={monthlyCost}
                    onChange={(e) => setMonthlyCost(e.target.value)}
                    placeholder="39,90"
                    required
                    className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Dia do Vencimento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={billingDay}
                    onChange={(e) => setBillingDay(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#707078] mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                >
                  <option value="Streaming">Streaming de Vídeo</option>
                  <option value="Música">Música & Áudio</option>
                  <option value="Cloud">Armazenamento / Cloud</option>
                  <option value="Software">Software / Apps</option>
                  <option value="Fitness">Academia & Bem-estar</option>
                  <option value="Serviços">Outros Serviços</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-[#9CAE9F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Salvar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
