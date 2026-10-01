import React, { useState } from 'react';
import { PieChart, Plus, AlertCircle, CheckCircle, X, Trash2 } from 'lucide-react';
import { Budget, Transaction } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface BudgetsViewProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
  onAddBudget: (b: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  transactions,
  selectedMonth,
  onAddBudget,
  onDeleteBudget,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState('Alimentação');
  const [limitAmount, setLimitAmount] = useState('');

  // Calculate spent amount for each budget category in the current selected month
  const budgetsWithSpent = budgets.map((b) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === b.category && t.date.startsWith(selectedMonth))
      .reduce((sum, t) => sum + t.amount, 0);

    const percent = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
    const remaining = b.limitAmount - spent;

    return {
      ...b,
      spent,
      percent,
      remaining,
    };
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(limitAmount.replace(',', '.'));
    if (isNaN(limit) || limit <= 0) return;

    onAddBudget({
      category,
      limitAmount: limit,
      period: selectedMonth,
      alertThreshold: 80,
    });

    setLimitAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Meus Limites de Gastos</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Defina tetos por categoria para saber exatamente quando você pode gastar sem surpresas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Definir Limite de Categoria</span>
        </button>
      </div>

      {/* Budgets Grid */}
      {budgetsWithSpent.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#101613] border border-[#1F2B23] text-center space-y-4">
          <PieChart className="w-12 h-12 text-[#65796A] mx-auto" />
          <p className="text-sm text-[#9CAE9F]">
            Defina um limite para saber quanto você pode gastar em cada categoria.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black"
          >
            Criar primeiro limite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetsWithSpent.map((b) => {
            const isExceeded = b.percent > 100;
            const isWarning = b.percent >= 85 && b.percent <= 100;
            const isNotice = b.percent >= 70 && b.percent < 85;

            return (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 hover:border-[#00E676]/40 transition relative group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{b.category}</h3>
                    <div className="text-[11px] text-[#65796A] mt-0.5">
                      Limite estabelecido: <strong className="text-white font-mono">{formatCurrency(b.limitAmount)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl ${
                        isExceeded
                          ? 'bg-[#FF5252]/10 text-[#FF5252] border border-[#FF5252]/30'
                          : isWarning
                          ? 'bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/30'
                          : 'bg-[#00E676]/15 text-[#00E676]'
                      }`}
                    >
                      {b.percent.toFixed(0)}%
                    </span>
                    <button
                      onClick={() => onDeleteBudget(b.id)}
                      className="p-1 rounded-lg text-[#65796A] hover:text-[#FF5252] opacity-0 group-hover:opacity-100 transition"
                      title="Excluir limite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-[#151D18] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-[#FF5252]'
                          : isWarning
                          ? 'bg-[#FFB300]'
                          : isNotice
                          ? 'bg-[#69F0AE]'
                          : 'bg-[#00E676]'
                      }`}
                      style={{ width: `${Math.min(100, b.percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9CAE9F]">
                      Gasto: <strong className="text-white font-mono">{formatCurrency(b.spent)}</strong>
                    </span>
                    <span className="font-mono">
                      {isExceeded ? (
                        <span className="text-[#FF5252]">
                          Excedido em {formatCurrency(Math.abs(b.remaining))}
                        </span>
                      ) : (
                        <span className="text-[#00E676]">
                          Resta {formatCurrency(b.remaining)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Feedback badge */}
                <div className="text-[11px] pt-1">
                  {isExceeded && (
                    <div className="flex items-center gap-1.5 text-[#FF5C6C]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Limite mensal ultrapassado. Reduza saídas não essenciais nesta categoria.</span>
                    </div>
                  )}
                  {isWarning && (
                    <div className="flex items-center gap-1.5 text-[#FFB84D]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Atenção: mais de 85% do teto já foi consumido.</span>
                    </div>
                  )}
                  {!isExceeded && !isWarning && (
                    <div className="flex items-center gap-1.5 text-[#35D07F]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Dentro do planejado para este mês.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#111114] border border-[#24242A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#24242A]">
              <h3 className="text-sm font-semibold text-white">Definir Limite de Categoria</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#65796A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                >
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Educação">Educação</option>
                  <option value="Assinaturas">Assinaturas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Limite Máximo Mensal (R$)</label>
                <input
                  type="text"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  placeholder="Ex: 800,00"
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none font-mono focus:border-[#00E676]"
                />
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
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black"
                >
                  Salvar Limite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
