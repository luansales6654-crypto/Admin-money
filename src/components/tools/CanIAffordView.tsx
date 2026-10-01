import React, { useState } from 'react';
import { HelpCircle, Calculator, ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Account, Transaction, UserProfile } from '../../types';
import { analyzeCanIAfford, formatCurrency } from '../../lib/calculations';

interface CanIAffordViewProps {
  accounts: Account[];
  transactions: Transaction[];
  user: UserProfile;
}

export const CanIAffordView: React.FC<CanIAffordViewProps> = ({
  accounts,
  transactions,
  user,
}) => {
  const [purchaseName, setPurchaseName] = useState('Tênis Esportivo');
  const [amountInput, setAmountInput] = useState('350');
  const [result, setResult] = useState<ReturnType<typeof analyzeCanIAfford> | null>(null);

  const upcomingBills = transactions.filter(
    (t) => t.status === 'scheduled' || (t.isRecurring && t.type === 'expense')
  );

  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    const res = analyzeCanIAfford(
      amount,
      accounts,
      upcomingBills,
      monthlyExpenses,
      monthlyIncome || user.monthlyIncomeTarget || 4000
    );
    setResult(res);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111114] border border-[#24242A] text-xs text-[#7C5CFF]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Simulador Transparente de Compras</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Posso gastar?
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A5AD] max-w-2xl leading-relaxed">
          Antes de tomar uma decisão de compra, veja o impacto real no seu saldo disponível, nas contas que ainda vão vencer neste mês e na sua margem de segurança.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#24242A] space-y-6">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#707078] mb-1.5 font-medium">
              O que você deseja comprar?
            </label>
            <input
              type="text"
              value={purchaseName}
              onChange={(e) => setPurchaseName(e.target.value)}
              placeholder="Ex: Tênis, Celular novo, Jantar..."
              className="w-full px-4 py-3 bg-[#16161A] border border-[#24242A] focus:border-[#7C5CFF] rounded-2xl text-xs text-white placeholder-[#707078] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#707078] mb-1.5 font-medium">
              Valor estimado da compra (R$)
            </label>
            <input
              type="text"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="0,00"
              required
              className="w-full px-4 py-3 bg-[#16161A] border border-[#24242A] focus:border-[#7C5CFF] rounded-2xl text-sm font-bold text-white font-mono placeholder-[#707078] outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C5CFF] hover:bg-[#6847F5] text-white text-xs font-bold shadow-lg shadow-[#7C5CFF]/25 transition flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Simular Impacto no Orçamento</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#7C5CFF]/30 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#24242A]">
            <div>
              <span className="text-xs text-[#707078]">Simulação para:</span>
              <h3 className="text-lg font-bold text-white">{purchaseName || 'Compra pretendida'}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#707078]">Valor informado:</span>
              <div className="text-2xl font-mono font-bold text-white">
                {formatCurrency(result.purchaseAmount)}
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-5 rounded-2xl bg-[#16161A] border border-[#24242A] space-y-3">
            <div className="flex items-center gap-2">
              {result.canAffordSafely ? (
                <CheckCircle2 className="w-5 h-5 text-[#35D07F]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#FFB84D]" />
              )}
              <span className="text-sm font-bold text-white">
                {result.canAffordSafely
                  ? 'Margem de segurança permanece confortável'
                  : 'Atenção ao fluxo de caixa previsto'}
              </span>
            </div>

            <p className="text-xs text-[#A5A5AD] leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Detailed Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Saldo Líquido Imediato</span>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {formatCurrency(result.currentAvailableBalance)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Contas com Vencimento Próximo</span>
              <div className="text-lg font-bold font-mono text-[#FF5C6C] mt-1">
                {formatCurrency(result.upcomingExpensesTotal)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Margem Restante Pós-Compra</span>
              <div
                className={`text-lg font-bold font-mono mt-1 ${
                  result.remainingMarginAfterPurchase >= 0 ? 'text-[#35D07F]' : 'text-[#FF5C6C]'
                }`}
              >
                {formatCurrency(result.remainingMarginAfterPurchase)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0D] border border-[#24242A] text-xs text-[#707078]">
            <strong className="text-white">Lembre-se:</strong> O Admin Money não toma decisões por você nem proíbe gastos. Essa análise é um cálculo objetivo para que você decida com total transparência e tranquilidade.
          </div>
        </div>
      )}
    </div>
  );
};
