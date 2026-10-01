import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight, Award, Calendar } from 'lucide-react';
import { Transaction, Budget, Goal } from '../../types';
import { formatCurrency, calculatePeriodSummary, calculateCategoryBreakdown } from '../../lib/calculations';

interface ReportsViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  selectedMonth: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  budgets,
  goals,
  selectedMonth,
}) => {
  // Current month summary
  const currentSummary = calculatePeriodSummary(transactions, selectedMonth);

  // Previous month summary (calculate previous YYYY-MM)
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const prevDate = new Date(year, month - 2, 1);
  const prevYm = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
  const prevSummary = calculatePeriodSummary(transactions, prevYm);

  // Categories
  const categories = calculateCategoryBreakdown(transactions, selectedMonth, 'expense');

  // Top Expenses
  const topExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(selectedMonth))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const diffExpenses = currentSummary.expenses - prevSummary.expenses;
  const diffIncome = currentSummary.income - prevSummary.income;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relatórios Financeiros</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Análise aprofundada de receitas, despesas, fechamento mensal e evolução patrimonial.
          </p>
        </div>
      </div>

      {/* Monthly Closing Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111114] via-[#16161A] to-[#111114] border border-[#7C5CFF]/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7C5CFF] uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Fechamento Mensal Oficial</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <span className="text-[11px] text-[#707078]">Total Recebido</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#35D07F]">
              {formatCurrency(currentSummary.income)}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#707078]">Total Despesas</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FF5C6C]">
              {formatCurrency(currentSummary.expenses)}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#707078]">Economia Líquida</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {formatCurrency(currentSummary.savings)}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#707078]">Taxa de Poupança</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#7C5CFF]">
              {currentSummary.savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Period Comparison Grid (This Month vs Previous Month) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Comparativo de Despesas</h3>
            <span className="text-xs text-[#707078] font-mono">vs Mês Anterior</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#16161A]">
            <div>
              <span className="text-xs text-[#707078]">Mês Atual:</span>
              <div className="text-lg font-bold font-mono text-white">
                {formatCurrency(currentSummary.expenses)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#707078]">Mês Anterior:</span>
              <div className="text-lg font-bold font-mono text-[#A5A5AD]">
                {formatCurrency(prevSummary.expenses)}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#A5A5AD] flex items-center gap-2">
            {diffExpenses <= 0 ? (
              <>
                <ArrowDownRight className="w-4 h-4 text-[#35D07F]" />
                <span className="text-[#35D07F]">
                  Você gastou {formatCurrency(Math.abs(diffExpenses))} a menos que no mês anterior.
                </span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4 text-[#FF5C6C]" />
                <span className="text-[#FF5C6C]">
                  Seus gastos estão {formatCurrency(diffExpenses)} acima do mês anterior.
                </span>
              </>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Comparativo de Receitas</h3>
            <span className="text-xs text-[#707078] font-mono">vs Mês Anterior</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#16161A]">
            <div>
              <span className="text-xs text-[#707078]">Mês Atual:</span>
              <div className="text-lg font-bold font-mono text-[#35D07F]">
                {formatCurrency(currentSummary.income)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#707078]">Mês Anterior:</span>
              <div className="text-lg font-bold font-mono text-[#A5A5AD]">
                {formatCurrency(prevSummary.income)}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#A5A5AD] flex items-center gap-2">
            {diffIncome >= 0 ? (
              <>
                <ArrowUpRight className="w-4 h-4 text-[#35D07F]" />
                <span className="text-[#35D07F]">
                  Renda aumentou em {formatCurrency(diffIncome)} em relação ao mês passado.
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4 text-[#FFB84D]" />
                <span className="text-[#A5A5AD]">
                  Variação de {formatCurrency(Math.abs(diffIncome))} nas entradas registradas.
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Top Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Distribuição por Categorias</h3>
            <span className="text-xs text-[#707078] font-mono">{categories.length} categorias</span>
          </div>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{c.category}</span>
                  <span className="text-[#A5A5AD] font-mono">
                    {formatCurrency(c.total)} ({c.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#16161A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#5E8BFF]"
                    style={{ width: `${Math.min(100, c.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Highest Expenses */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Maiores Gastos do Mês</h3>
            <span className="text-xs text-[#707078] font-mono">Top 5 saídas</span>
          </div>

          <div className="divide-y divide-[#24242A]/50">
            {topExpenses.map((tx, idx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-lg bg-[#16161A] text-[#707078] font-mono font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold">{tx.description}</div>
                    <div className="text-[10px] text-[#707078]">{tx.category} • {tx.date}</div>
                  </div>
                </div>

                <div className="font-mono font-bold text-white">
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
