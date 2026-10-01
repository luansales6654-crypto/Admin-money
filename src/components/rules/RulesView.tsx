import React, { useState } from 'react';
import { ShieldAlert, Plus, CheckCircle2, AlertTriangle, X, Trash2 } from 'lucide-react';
import { SmartRule, Transaction, Account } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface RulesViewProps {
  rules: SmartRule[];
  transactions: Transaction[];
  accounts: Account[];
  onAddRule: (rule: Omit<SmartRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  transactions,
  accounts,
  onAddRule,
  onDeleteRule,
  onToggleRule,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [conditionType, setConditionType] = useState<SmartRule['conditionType']>('single_transaction');
  const [category, setCategory] = useState('Alimentação');
  const [thresholdAmount, setThresholdAmount] = useState('100');

  // Check which rules are triggered right now
  const totalBalance = accounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const checkTrigger = (rule: SmartRule): { triggered: boolean; message: string } => {
    if (!rule.active) return { triggered: false, message: 'Regra desativada' };

    if (rule.conditionType === 'single_transaction') {
      const match = transactions.find(
        (t) => t.type === 'expense' && t.amount >= rule.thresholdAmount && (!rule.category || t.category === rule.category)
      );
      if (match) {
        return {
          triggered: true,
          message: `Disparada por: "${match.description}" (${formatCurrency(match.amount)} em ${match.date})`,
        };
      }
      return { triggered: false, message: 'Nenhuma despesa individual ultrapassou o teto' };
    }

    if (rule.conditionType === 'category_exceeded') {
      const sum = transactions
        .filter((t) => t.type === 'expense' && t.category === rule.category)
        .reduce((s, t) => s + t.amount, 0);
      if (sum >= rule.thresholdAmount) {
        return {
          triggered: true,
          message: `Total na categoria atingiu ${formatCurrency(sum)} (limite: ${formatCurrency(rule.thresholdAmount)})`,
        };
      }
      return { triggered: false, message: `Acumulado atual: ${formatCurrency(sum)}` };
    }

    if (rule.conditionType === 'balance_below') {
      if (totalBalance < rule.thresholdAmount) {
        return {
          triggered: true,
          message: `Saldo atual (${formatCurrency(totalBalance)}) abaixo do piso de ${formatCurrency(rule.thresholdAmount)}`,
        };
      }
      return { triggered: false, message: `Saldo seguro (${formatCurrency(totalBalance)})` };
    }

    return { triggered: false, message: 'Monitorando movimentações' };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const threshold = parseFloat(thresholdAmount.replace(',', '.'));
    if (!ruleName.trim() || isNaN(threshold) || threshold <= 0) return;

    onAddRule({
      name: ruleName.trim(),
      conditionType,
      category: conditionType === 'category_exceeded' || conditionType === 'single_transaction' ? category : undefined,
      thresholdAmount: threshold,
      active: true,
    });

    setRuleName('');
    setThresholdAmount('100');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Regras Inteligentes</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Configure guardiões automáticos para avisar quando despesas ou saldos atingirem limites definidos por você.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Nova Regra</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          const status = checkTrigger(rule);

          return (
            <div
              key={rule.id}
              className={`p-6 rounded-3xl bg-[#111114] border transition flex flex-col justify-between space-y-4 ${
                status.triggered
                  ? 'border-[#FFB84D]/50 shadow-md shadow-[#FFB84D]/5'
                  : 'border-[#24242A]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      rule.active ? 'bg-[#35D07F]/10 text-[#35D07F]' : 'bg-[#16161A] text-[#707078]'
                    }`}
                  >
                    {rule.active ? 'Ativa' : 'Pausada'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className="text-xs text-[#A5A5AD] hover:text-white"
                    >
                      {rule.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1 text-[#707078] hover:text-[#FF5C6C]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{rule.name}</h3>

                <p className="text-xs text-[#707078]">
                  Condição: {rule.conditionType === 'single_transaction' && `Gasto único > ${formatCurrency(rule.thresholdAmount)}`}
                  {rule.conditionType === 'category_exceeded' && `Total em ${rule.category} > ${formatCurrency(rule.thresholdAmount)}`}
                  {rule.conditionType === 'balance_below' && `Saldo total < ${formatCurrency(rule.thresholdAmount)}`}
                </p>
              </div>

              {/* Status info */}
              <div className="pt-3 border-t border-[#24242A] text-xs">
                {status.triggered ? (
                  <div className="flex items-start gap-2 text-[#FFB84D]">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#35D07F]">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{status.message}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#111114] border border-[#24242A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#24242A]">
              <h3 className="text-sm font-semibold text-white">Criar Regra Inteligente</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#707078] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#707078] mb-1">Título da Regra</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="Ex: Alerta de Delivery > R$ 100"
                  required
                  className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#707078] mb-1">Tipo de Gatilho</label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                >
                  <option value="single_transaction">Gasto único acima de um valor</option>
                  <option value="category_exceeded">Gasto total acumulado na categoria</option>
                  <option value="balance_below">Saldo em conta abaixo de um piso</option>
                </select>
              </div>

              {(conditionType === 'single_transaction' || conditionType === 'category_exceeded') && (
                <div>
                  <label className="block text-xs text-[#707078] mb-1">Categoria a monitorar</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white outline-none"
                  >
                    <option value="Alimentação">Alimentação / Delivery</option>
                    <option value="Transporte">Transporte / Carro</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs text-[#707078] mb-1">Valor de Gatilho (R$)</label>
                <input
                  type="text"
                  value={thresholdAmount}
                  onChange={(e) => setThresholdAmount(e.target.value)}
                  placeholder="100,00"
                  required
                  className="w-full px-4 py-2.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white font-mono outline-none"
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
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
