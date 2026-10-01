import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  ChevronRight,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  Account,
  Budget,
  CreditCard,
  Goal,
  RecurringTransaction,
  Transaction,
  UserProfile,
} from '../../types';
import {
  formatCurrency,
  calculatePeriodSummary,
  calculateCategoryBreakdown,
  calculateOrganizationScore,
  analyzeCanIAfford,
  detectDuplicateTransactions,
  calculateEstimatedMonthlyForecast,
} from '../../lib/calculations';

interface DashboardViewProps {
  user: UserProfile;
  selectedMonth: string;
  transactions: Transaction[];
  accounts: Account[];
  cards: CreditCard[];
  budgets: Budget[];
  goals: Goal[];
  recurring: RecurringTransaction[];
  onNavigate: (view: string) => void;
  onOpenAddModal: (type?: 'income' | 'expense' | 'transfer') => void;
  onOpenQuickEntry: () => void;
  onSelectAskQuestion: (question: string) => void;
  onLoadDemo: () => void;
  onResetToZero: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  selectedMonth,
  transactions,
  accounts,
  cards,
  budgets,
  goals,
  recurring,
  onNavigate,
  onOpenAddModal,
  onOpenQuickEntry,
  onSelectAskQuestion,
  onLoadDemo,
  onResetToZero,
}) => {
  const [quickSpendInput, setQuickSpendInput] = useState('');
  const [quickSpendResult, setQuickSpendResult] = useState<ReturnType<typeof analyzeCanIAfford> | null>(null);

  const summary = calculatePeriodSummary(transactions, selectedMonth);
  const categories = calculateCategoryBreakdown(transactions, selectedMonth, 'expense');
  const orgScore = calculateOrganizationScore(transactions, budgets, goals, recurring);

  const totalLiquidBalance = accounts
    .filter((a) => a.type !== 'investment' && a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const upcomingBills = transactions.filter(
    (t) => t.status === 'scheduled' || (t.isRecurring && t.type === 'expense')
  ).slice(0, 3);

  const duplicates = detectDuplicateTransactions(transactions);

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const upcomingTotal = upcomingBills.reduce((s, b) => s + b.amount, 0);
  const monthlyForecast = calculateEstimatedMonthlyForecast(
    currentDay,
    daysInMonth,
    summary.expenses,
    upcomingTotal
  );

  const handleSimulateQuickSpend = (e: React.FormEvent) => {
    e.preventDefault();
    const match = quickSpendInput.match(/(\d+([.,]\d{1,2})?)/);
    if (!match) return;
    const amount = parseFloat(match[0].replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    const res = analyzeCanIAfford(
      amount,
      accounts,
      upcomingBills,
      summary.expenses,
      summary.income
    );
    setQuickSpendResult(res);
  };

  const smartQuestions = [
    'Quanto gastei com alimentação este mês?',
    'Qual foi minha maior despesa?',
    'Quais contas tenho para pagar?',
    'Quanto economizei neste mês?',
  ];

  const isZeroedState = transactions.length === 0 && totalLiquidBalance === 0;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Welcome & Organization Score Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Olá, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#9CAE9F] mt-1">
            Veja como estão suas finanças em tempo real hoje.
          </p>
        </div>

        {/* Organization Score Badge */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#101613] border border-[#1F2B23] hover:border-[#00E676]/40 cursor-pointer transition"
            title="Índice interno de organização pessoal baseado nos seus hábitos de registro"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center font-mono font-black text-sm">
              {orgScore}
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">Organização Financeira</div>
              <div className="text-[10px] text-[#65796A]">
                {orgScore >= 80 ? 'Excelente controle' : orgScore >= 50 ? 'Bom ritmo' : 'Começando'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Zero State Welcome Banner */}
      {isZeroedState && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101613] via-[#151D18] to-[#101613] border-2 border-[#00E676]/30 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00E676] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Sistema Pronto para Uso</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Seu painel está limpo e zerado.
            </h2>
            <p className="text-xs sm:text-sm text-[#9CAE9F] max-w-2xl leading-relaxed">
              Você pode começar cadastrando sua primeira movimentação real (receita ou despesa) ou carregar a base de demonstração para apresentar a potenciais clientes deste micro-SaaS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAddModal('income')}
              className="px-5 py-3 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Adicionar Primeira Receita</span>
            </button>

            <button
              onClick={onOpenQuickEntry}
              className="px-5 py-3 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] text-white text-xs font-bold transition flex items-center gap-2"
            >
              <span>Texto Rápido ("Salário 5000")</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="px-5 py-3 rounded-2xl bg-[#101613] hover:bg-[#151D18] border border-[#00E676]/40 text-[#00E676] text-xs font-bold transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Carregar Demo para Vendas</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Liquid Balance */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00E676]/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65796A] uppercase tracking-wider">
              Saldo Líquido Total
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#151D18] text-[#00E676] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {formatCurrency(totalLiquidBalance)}
            </div>
            <div className="text-xs text-[#00E676] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {summary.savings >= 0
                  ? `+${formatCurrency(summary.savings)} este mês`
                  : `${formatCurrency(summary.savings)} este mês`}
              </span>
            </div>
          </div>
        </div>

        {/* Receitas */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65796A] uppercase tracking-wider">
              Receitas
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#00E676] tracking-tight">
              {formatCurrency(summary.income)}
            </div>
            <div className="text-xs text-[#65796A] mt-1">
              Total recebido no período
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65796A] uppercase tracking-wider">
              Despesas
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5252]/10 text-[#FF5252] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#FF5252] tracking-tight">
              {formatCurrency(summary.expenses)}
            </div>
            <div className="text-xs text-[#65796A] mt-1">
              {summary.transactionCount} saídas registradas
            </div>
          </div>
        </div>

        {/* Taxa de Economia */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#65796A] uppercase tracking-wider">
              Taxa de Economia
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {summary.savingsRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[#9CAE9F] mt-1">
              Economia: <span className="text-white font-mono">{formatCurrency(summary.savings)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Posso Gastar?" Feature Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#101613] to-[#151D18] border border-[#00E676]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Posso gastar?</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] font-mono font-bold">
                  Simulador
                </span>
              </h2>
              <p className="text-xs text-[#9CAE9F]">
                Antes de fazer uma nova compra, confira o impacto na sua margem de segurança.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('can_i_afford')}
            className="text-xs text-[#00E676] hover:text-white font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver análise avançada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSimulateQuickSpend} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={quickSpendInput}
            onChange={(e) => setQuickSpendInput(e.target.value)}
            placeholder="Ex: Posso comprar um celular de R$ 1.500? Ou digite: 350"
            className="flex-1 px-4 py-3 bg-[#0A0E0C] border border-[#1F2B23] focus:border-[#00E676] rounded-2xl text-xs text-white placeholder-[#65796A] outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md transition"
          >
            Calcular Impacto
          </button>
        </form>

        {quickSpendResult && (
          <div className="p-4 rounded-2xl bg-[#0A0E0C] border border-[#1F2B23] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Análise de Impacto:</span>
              <span
                className={`text-xs font-mono font-bold ${
                  quickSpendResult.canAffordSafely ? 'text-[#00E676]' : 'text-[#FF5252]'
                }`}
              >
                {quickSpendResult.canAffordSafely
                  ? 'Margem permanece positiva'
                  : 'Atenção: Margem negativa ou apertada'}
              </span>
            </div>
            <p className="text-xs text-[#9CAE9F] leading-relaxed">
              {quickSpendResult.explanation}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#1F2B23]">
              {quickSpendResult.contextPoints.slice(0, 4).map((pt, i) => (
                <div key={i} className="text-[11px] text-[#65796A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: What Deserves Attention & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* "Vale Olhar Isso" (What Deserves Attention) */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FFB300]" />
                <h3 className="text-sm font-bold text-white">Vale olhar isso</h3>
              </div>
              <span className="text-[10px] text-[#65796A] font-mono">Destaques automáticos</span>
            </div>

            <div className="space-y-2.5">
              {/* Duplicate check */}
              {duplicates.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#FF5252]/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#FF5252] font-semibold">
                    <span>Possível cobrança duplicada</span>
                    <span className="font-mono">{formatCurrency(duplicates[0].amount)}</span>
                  </div>
                  <p className="text-[#9CAE9F] text-[11px]">
                    "{duplicates[0].description}" registrada em datas próximas ({duplicates[0].date1} e {duplicates[0].date2}).
                  </p>
                </div>
              )}

              {/* Upcoming Bill Attention */}
              {upcomingBills.length > 0 ? (
                <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-xs space-y-1">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                      Próxima conta: {upcomingBills[0].description}
                    </span>
                    <span className="font-mono text-[#FF5252] font-semibold">
                      {formatCurrency(upcomingBills[0].amount)}
                    </span>
                  </div>
                  <p className="text-[#65796A] text-[11px]">
                    Vencimento programado em {upcomingBills[0].date}.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-xs text-[#65796A]">
                  Sem contas pendentes agendadas para os próximos dias.
                </div>
              )}

              {/* Monthly Forecast Alert */}
              <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-xs space-y-1">
                <div className="flex items-center justify-between text-white font-medium">
                  <span>Estimativa para o fim do mês</span>
                  <span className="font-mono text-white font-semibold">
                    ~{formatCurrency(monthlyForecast)}
                  </span>
                </div>
                <p className="text-[#65796A] text-[11px]">
                  Baseado no ritmo de gastos dos {currentDay} dias e contas previstas.
                </p>
              </div>

              {/* Goal progress highlight */}
              {goals.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-xs space-y-1">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span>{goals[0].name}</span>
                    <span className="text-[#00E676] font-mono font-bold">
                      {((goals[0].currentAmount / goals[0].targetAmount) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0A0E0C] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#00E676]"
                      style={{
                        width: `${Math.min(100, (goals[0].currentAmount / goals[0].targetAmount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="w-full py-2.5 rounded-xl bg-[#151D18] hover:bg-[#1E2822] text-xs text-[#9CAE9F] hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <span>Ver planejamento e agenda</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* "Para Onde Foi Meu Dinheiro" (Category Breakdown) */}
        <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Para onde foi meu dinheiro?</h3>
              <span className="text-[10px] text-[#65796A] font-mono">Total {formatCurrency(summary.expenses)}</span>
            </div>

            {categories.length === 0 ? (
              <p className="text-xs text-[#65796A] py-8 text-center">
                Nenhuma despesa registrada neste período.
              </p>
            ) : (
              <div className="space-y-2.5">
                {categories.slice(0, 5).map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-medium">{cat.category}</span>
                      <span className="font-mono text-[#9CAE9F]">
                        {formatCurrency(cat.total)} ({cat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#151D18] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00E676] to-[#00B359]"
                        style={{ width: `${Math.min(100, cat.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="w-full py-2.5 rounded-xl bg-[#151D18] hover:bg-[#1E2822] text-xs text-[#9CAE9F] hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <span>Ver relatório completo por categoria</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Smart Questions -> Assistant */}
      <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E676]" />
            <h3 className="text-sm font-bold text-white">Perguntas Rápidas ao Assistente</h3>
          </div>
          <button
            onClick={() => onNavigate('assistant')}
            className="text-xs text-[#00E676] hover:underline font-semibold"
          >
            Abrir chat completo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {smartQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectAskQuestion(q)}
              className="p-3 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] hover:border-[#00E676]/40 text-left text-xs text-[#9CAE9F] hover:text-white transition flex items-center justify-between group"
            >
              <span>{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#65796A] group-hover:text-[#00E676] flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Últimas Movimentações</h3>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs text-[#00E676] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-xs text-[#65796A]">Nenhuma movimentação cadastrada ainda.</p>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="px-4 py-2 rounded-xl bg-[#00E676] text-[#050706] text-xs font-bold"
            >
              Cadastrar Movimentação
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2B23]/50">
            {transactions.slice(0, 6).map((tx) => {
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              const account = accounts.find((a) => a.id === tx.accountId);

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-[#00E676]/10 text-[#00E676]'
                          : isTransfer
                          ? 'bg-[#00E676]/10 text-[#00E676]'
                          : 'bg-[#FF5252]/10 text-[#FF5252]'
                      }`}
                    >
                      {isIncome ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : isTransfer ? (
                        <ArrowRight className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{tx.description}</div>
                      <div className="text-[11px] text-[#65796A] flex items-center gap-2">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{account?.name || 'Conta'}</span>
                        {tx.installments && (
                          <>
                            <span>•</span>
                            <span className="text-[#00E676] font-mono">
                              {tx.installments.current}/{tx.installments.total}x
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-semibold font-mono ${
                        isIncome
                          ? 'text-[#00E676]'
                          : isTransfer
                          ? 'text-white'
                          : 'text-white'
                      }`}
                    >
                      {isIncome ? '+' : isTransfer ? '↔' : '-'} {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] text-[#65796A]">{tx.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
