import React, { useState } from 'react';
import { TrendingDown, Calculator, Sparkles, Check, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { analyzeWorthIt, formatCurrency } from '../../lib/calculations';

interface WorthItViewProps {
  user: UserProfile;
}

export const WorthItView: React.FC<WorthItViewProps> = ({ user }) => {
  const [serviceName, setServiceName] = useState('Streaming de Filmes');
  const [costInput, setCostInput] = useState('49.90');
  const [customIncome, setCustomIncome] = useState(
    user.monthlyIncomeTarget?.toString() || '7200'
  );
  const [result, setResult] = useState<ReturnType<typeof analyzeWorthIt> | null>(() =>
    analyzeWorthIt(49.9, parseFloat(user.monthlyIncomeTarget?.toString() || '7200'))
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(costInput.replace(',', '.'));
    const income = parseFloat(customIncome.replace(',', '.')) || 4500;
    if (isNaN(cost) || cost <= 0) return;

    setResult(analyzeWorthIt(cost, income));
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111114] border border-[#24242A] text-xs text-[#5E8BFF]">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Calculadora de Custo Acumulado</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Vale a pena?
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A5AD] max-w-2xl leading-relaxed">
          Descubra o verdadeiro peso de assinaturas e pequenas despesas recorrentes no seu ano. Veja quanto uma mensalidade de R$ 50 ou R$ 100 acumula ao longo do tempo.
        </p>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#24242A] space-y-6">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#707078] mb-1.5 font-medium">
              Serviço ou Assinatura
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Ex: Netflix, Academia, Clube..."
              className="w-full px-4 py-3 bg-[#16161A] border border-[#24242A] focus:border-[#7C5CFF] rounded-2xl text-xs text-white placeholder-[#707078] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#707078] mb-1.5 font-medium">
              Custo Mensal (R$)
            </label>
            <input
              type="text"
              value={costInput}
              onChange={(e) => setCostInput(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="0,00"
              required
              className="w-full px-4 py-3 bg-[#16161A] border border-[#24242A] focus:border-[#7C5CFF] rounded-2xl text-sm font-bold font-mono text-white placeholder-[#707078] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#707078] mb-1.5 font-medium">
              Sua Renda Mensal Base (R$)
            </label>
            <input
              type="text"
              value={customIncome}
              onChange={(e) => setCustomIncome(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="Ex: 5000"
              required
              className="w-full px-4 py-3 bg-[#16161A] border border-[#24242A] focus:border-[#7C5CFF] rounded-2xl text-sm font-bold font-mono text-white placeholder-[#707078] outline-none"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#5E8BFF] hover:bg-[#4E7BEF] text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calcular Impacto no Longo Prazo</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#5E8BFF]/30 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#24242A]">
            <div>
              <span className="text-xs text-[#707078]">Análise de Recorrência:</span>
              <h3 className="text-lg font-bold text-white">{serviceName}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#707078]">Mensalidade:</span>
              <div className="text-2xl font-mono font-bold text-white">
                {formatCurrency(result.monthlyCost)} <span className="text-xs text-[#707078] font-normal">/mês</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#16161A] border border-[#24242A] text-xs text-[#A5A5AD] leading-relaxed">
            {result.explanation}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Custo em 12 Meses</span>
              <div className="text-xl font-bold font-mono text-[#FF5C6C] mt-1">
                {formatCurrency(result.annualCost)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Custo em 24 Meses (2 Anos)</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {formatCurrency(result.annualCost * 2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A]">
              <span className="text-[11px] text-[#707078]">Compromisso da Renda</span>
              <div className="text-xl font-bold font-mono text-[#7C5CFF] mt-1">
                {result.incomePercentage.toFixed(1)}% ao mês
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-white">Perspectiva Prática:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#707078]">
              {result.comparisonPoints.map((pt, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#16161A] border border-[#24242A] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
