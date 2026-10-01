import React, { useState } from 'react';
import { Target, Plus, Calculator, Calendar, ArrowRight, X, TrendingUp, Check } from 'lucide-react';
import { Goal } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'contributions'>) => void;
  onAddContribution: (goalId: string, amount: number, note?: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onAddContribution,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');

  // Add Goal Form State
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('2027-12-31');
  const [priority, setPriority] = useState<Goal['priority']>('medium');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  // Interactive Goal Calculator State
  const [calcTarget, setCalcTarget] = useState('10000');
  const [calcCurrent, setCalcCurrent] = useState('3000');
  const [calcMonths, setCalcMonths] = useState('12');

  const calcRemaining = Math.max(0, (parseFloat(calcTarget) || 0) - (parseFloat(calcCurrent) || 0));
  const calcRequiredMonthly =
    parseInt(calcMonths) > 0 ? calcRemaining / parseInt(calcMonths) : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount.replace(',', '.'));
    const current = parseFloat(currentAmount.replace(',', '.')) || 0;
    const monthly = parseFloat(monthlyContribution.replace(',', '.')) || 0;

    if (!goalName.trim() || isNaN(target) || target <= 0) return;

    onAddGoal({
      name: goalName.trim(),
      targetAmount: target,
      currentAmount: current,
      deadline,
      priority,
      monthlyContribution: monthly,
      category: 'Geral',
      color: '#7C5CFF',
      icon: 'Target',
    });

    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setMonthlyContribution('');
    setShowAddModal(false);
  };

  const handleExecuteContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    const amount = parseFloat(contributionAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    onAddContribution(selectedGoalId, amount, contributionNote.trim() || undefined);
    setContributionAmount('');
    setContributionNote('');
    setShowContributionModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Minhas Metas</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Planeje grandes conquistas, acompanhe seus aportes e monitore os prazos estipulados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Nova Meta</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#101613] border border-[#1F2B23] text-center space-y-4">
          <Target className="w-12 h-12 text-[#65796A] mx-auto" />
          <p className="text-sm text-[#9CAE9F]">
            Crie uma meta para começar a acompanhar seu progresso e planejar suas conquistas.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black"
          >
            Adicionar primeira meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-5 hover:border-[#00E676]/40 transition relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        goal.priority === 'high'
                          ? 'bg-[#FF5252]/10 text-[#FF5252]'
                          : goal.priority === 'medium'
                          ? 'bg-[#00E676]/15 text-[#00E676]'
                          : 'bg-[#69F0AE]/10 text-[#69F0AE]'
                      }`}
                    >
                      Prioridade {goal.priority}
                    </span>
                    <span className="text-[11px] text-[#65796A] flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {goal.deadline}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{goal.name}</h3>
                    <div className="text-xs text-[#707078] mt-0.5">{goal.category}</div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-mono font-bold">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-[#707078] font-mono">
                        de {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#151D18] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00E676] to-[#00B359] transition-all duration-300"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-[#00E676] font-mono font-bold">
                        {percent.toFixed(1)}% concluído
                      </span>
                      <span className="text-[#65796A]">
                        Falta: <strong className="text-white font-mono">{formatCurrency(remaining)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F2B23] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#65796A]">
                    Aporte mensal sugerido:{' '}
                    <span className="text-white font-mono font-semibold">
                      {formatCurrency(goal.monthlyContribution || (remaining / 12))}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setShowContributionModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#151D18] hover:bg-[#00E676] hover:text-[#050706] border border-[#1F2B23] text-xs font-semibold text-[#9CAE9F] transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Aportar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Goal Calculator Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#24242A] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#35D07F]/10 text-[#35D07F] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Calculadora Inteligente de Metas</h3>
            <p className="text-xs text-[#A5A5AD]">
              Descubra quanto você precisa guardar por mês para alcançar qualquer valor no prazo desejado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#707078] mb-1.5">Valor do Objetivo (R$)</label>
            <input
              type="number"
              value={calcTarget}
              onChange={(e) => setCalcTarget(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#707078] mb-1.5">Já acumulado (R$)</label>
            <input
              type="number"
              value={calcCurrent}
              onChange={(e) => setCalcCurrent(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#707078] mb-1.5">Prazo desejado (meses)</label>
            <input
              type="number"
              min={1}
              max={120}
              value={calcMonths}
              onChange={(e) => setCalcMonths(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
            />
          </div>
        </div>

        {/* Calculation Result */}
        <div className="p-4 rounded-2xl bg-[#16161A] border border-[#35D07F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#A5A5AD]">Aporte mensal estimado necessário:</div>
            <div className="text-2xl font-extrabold font-mono text-[#35D07F]">
              {formatCurrency(calcRequiredMonthly)} <span className="text-xs text-[#707078] font-normal">/ mês</span>
            </div>
          </div>
          <div className="text-xs text-[#707078] max-w-sm">
            Para alcançar {formatCurrency(parseFloat(calcTarget) || 0)} em {calcMonths} meses faltando {formatCurrency(calcRemaining)}. Estimativa matemática pura, sem rendimentos.
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#111114] border border-[#24242A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#24242A]">
              <h3 className="text-sm font-semibold text-white">Criar Nova Meta</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#707078] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs text-[#707078] mb-1">Nome da Meta</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Ex: Reserva 6 Meses, Viagem, Notebook..."
                  required
                  className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Valor Alvo (R$)</label>
                  <input
                    type="text"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="10000,00"
                    required
                    className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Já Guardado (R$)</label>
                  <input
                    type="text"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Data Limite (Prazo)</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#707078] mb-1">Aporte Mensal Planejado (R$)</label>
                <input
                  type="text"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500,00"
                  className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-[#A5A5AD]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Salvar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showContributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <h3 className="text-sm font-semibold text-white">Adicionar Aporte</h3>
              <button onClick={() => setShowContributionModal(false)} className="text-[#65796A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteContribution} className="space-y-4">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">Valor do Aporte (R$)</label>
                <input
                  type="text"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="0,00"
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Nota (opcional)</label>
                <input
                  type="text"
                  value={contributionNote}
                  onChange={(e) => setContributionNote(e.target.value)}
                  placeholder="Ex: Economia do mês, extra de freela..."
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContributionModal(false)}
                  className="px-4 py-2 text-xs text-[#9CAE9F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
