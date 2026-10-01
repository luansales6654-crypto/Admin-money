import React, { useState } from 'react';
import { Sliders, TrendingUp, Sparkles, ArrowRight, DollarSign } from 'lucide-react';
import { Transaction } from '../../types';
import { calculatePeriodSummary, formatCurrency } from '../../lib/calculations';

interface ScenarioSimulatorViewProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  transactions,
  selectedMonth,
}) => {
  const summary = calculatePeriodSummary(transactions, selectedMonth);

  const baseSavings = Math.max(0, summary.savings);
  const [extraMonthlySave, setExtraMonthlySave] = useState(250);
  const [expenseCutCategory, setExpenseCutCategory] = useState(150);
  const [newExpenseAssumption, setNewExpenseAssumption] = useState(0);

  const simulatedMonthlySavings = Math.max(
    0,
    baseSavings + extraMonthlySave + expenseCutCategory - newExpenseAssumption
  );

  const diffSavings = simulatedMonthlySavings - baseSavings;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111114] border border-[#24242A] text-xs text-[#35D07F]">
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulador de Cenários Futuros</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          E se eu...
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A5AD] max-w-2xl leading-relaxed">
          Simule hipóteses práticas: e se você poupar mais R$ 200 por mês? E se cortar 15% de gastos com delivery? Veja a projeção matemática acumulada no tempo.
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Extra Savings */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="text-xs font-semibold text-white">E se eu guardar a mais por mês:</div>
          <div className="text-2xl font-bold font-mono text-[#35D07F]">
            +{formatCurrency(extraMonthlySave)}
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={extraMonthlySave}
            onChange={(e) => setExtraMonthlySave(Number(e.target.value))}
            className="w-full accent-[#35D07F] cursor-pointer"
          />
          <div className="text-[11px] text-[#707078]">
            Equivale a guardar +{formatCurrency(extraMonthlySave * 12)} ao ano.
          </div>
        </div>

        {/* Slider 2: Cut category */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="text-xs font-semibold text-white">E se eu economizar em saídas supérfluas:</div>
          <div className="text-2xl font-bold font-mono text-[#7C5CFF]">
            +{formatCurrency(expenseCutCategory)}
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={25}
            value={expenseCutCategory}
            onChange={(e) => setExpenseCutCategory(Number(e.target.value))}
            className="w-full accent-[#7C5CFF] cursor-pointer"
          />
          <div className="text-[11px] text-[#707078]">
            Economia gerada por reduzir gastos não essenciais.
          </div>
        </div>

        {/* Slider 3: New Expense */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
          <div className="text-xs font-semibold text-white">E se eu assumir uma nova despesa/parcela:</div>
          <div className="text-2xl font-bold font-mono text-[#FF5C6C]">
            -{formatCurrency(newExpenseAssumption)}
          </div>
          <input
            type="range"
            min={0}
            max={1500}
            step={50}
            value={newExpenseAssumption}
            onChange={(e) => setNewExpenseAssumption(Number(e.target.value))}
            className="w-full accent-[#FF5C6C] cursor-pointer"
          />
          <div className="text-[11px] text-[#707078]">
            Custo adicional que reduz sua capacidade mensal de poupar.
          </div>
        </div>
      </div>

      {/* Projection Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#35D07F]/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#24242A]">
          <div>
            <span className="text-xs text-[#707078]">Resultado do Cenário Simulado:</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
              {formatCurrency(simulatedMonthlySavings)} <span className="text-xs text-[#707078] font-normal">/ mês</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-[#707078]">Diferença vs Atual:</span>
            <div
              className={`text-xl font-bold font-mono ${
                diffSavings >= 0 ? 'text-[#35D07F]' : 'text-[#FF5C6C]'
              }`}
            >
              {diffSavings >= 0 ? `+${formatCurrency(diffSavings)}` : formatCurrency(diffSavings)} / mês
            </div>
          </div>
        </div>

        {/* Time horizon projections */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
            <span className="text-[11px] text-[#707078]">Em 6 Meses</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {formatCurrency(simulatedMonthlySavings * 6)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
            <span className="text-[11px] text-[#707078]">Em 1 Ano (12 meses)</span>
            <div className="text-lg font-bold font-mono text-[#35D07F] mt-1">
              {formatCurrency(simulatedMonthlySavings * 12)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
            <span className="text-[11px] text-[#707078]">Em 2 Anos (24 meses)</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {formatCurrency(simulatedMonthlySavings * 24)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
            <span className="text-[11px] text-[#707078]">Em 5 Anos (60 meses)</span>
            <div className="text-lg font-bold font-mono text-[#7C5CFF] mt-1">
              {formatCurrency(simulatedMonthlySavings * 60)}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#707078]">
          Cálculo puramente matemático para fins de simulação e planejamento pessoal. Não constitui conselho de investimento ou promessa de retorno.
        </p>
      </div>
    </div>
  );
};
