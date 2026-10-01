import { Transaction, Budget, Goal, RecurringTransaction, Account, Subscription } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export interface PeriodSummary {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  transactionCount: number;
}

export function calculatePeriodSummary(
  transactions: Transaction[],
  yearMonth: string // "YYYY-MM"
): PeriodSummary {
  const filtered = transactions.filter((t) => t.date.startsWith(yearMonth));

  let income = 0;
  let expenses = 0;

  for (const t of filtered) {
    if (t.type === 'income') {
      income += t.amount;
    } else if (t.type === 'expense') {
      expenses += t.amount;
    }
  }

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    expenses,
    savings,
    savingsRate,
    transactionCount: filtered.length,
  };
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export function calculateCategoryBreakdown(
  transactions: Transaction[],
  yearMonth: string,
  type: 'expense' | 'income' = 'expense'
): CategoryBreakdown[] {
  const filtered = transactions.filter((t) => t.date.startsWith(yearMonth) && t.type === type);
  const totalAmount = filtered.reduce((acc, t) => acc + t.amount, 0);

  const map = new Map<string, { total: number; count: number }>();

  for (const t of filtered) {
    const existing = map.get(t.category) || { total: 0, count: 0 };
    existing.total += t.amount;
    existing.count += 1;
    map.set(t.category, existing);
  }

  const results: CategoryBreakdown[] = [];
  map.forEach((val, cat) => {
    results.push({
      category: cat,
      total: val.total,
      percentage: totalAmount > 0 ? (val.total / totalAmount) * 100 : 0,
      count: val.count,
    });
  });

  return results.sort((a, b) => b.total - a.total);
}

export interface CanIAffordAnalysis {
  purchaseAmount: number;
  currentAvailableBalance: number;
  upcomingExpensesTotal: number;
  safeMarginBeforePurchase: number;
  remainingMarginAfterPurchase: number;
  budgetImpactPercent: number;
  canAffordSafely: boolean;
  explanation: string;
  contextPoints: string[];
}

export function analyzeCanIAfford(
  purchaseAmount: number,
  accounts: Account[],
  upcomingTransactions: Transaction[],
  monthlyExpensesTotal: number,
  monthlyIncomeTotal: number
): CanIAffordAnalysis {
  // Available liquid balance (checking, digital wallet, cash)
  const liquidBalance = accounts
    .filter((a) => a.type !== 'investment' && a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const upcomingTotal = upcomingTransactions.reduce((sum, t) => sum + t.amount, 0);
  const safeMarginBefore = liquidBalance - upcomingTotal;
  const remainingMarginAfter = safeMarginBefore - purchaseAmount;
  const canAffordSafely = remainingMarginAfter > 0;

  const budgetBase = monthlyExpensesTotal > 0 ? monthlyExpensesTotal : (monthlyIncomeTotal > 0 ? monthlyIncomeTotal : 2000);
  const budgetImpactPercent = (purchaseAmount / budgetBase) * 100;

  const explanation = `Hoje você possui ${formatCurrency(liquidBalance)} em saldo líquido disponível e tem cerca de ${formatCurrency(upcomingTotal)} em compromissos previstos. Uma compra de ${formatCurrency(purchaseAmount)} representaria ${budgetImpactPercent.toFixed(1)}% do seu padrão de gastos mensal, deixando sua margem de segurança em aproximadamente ${formatCurrency(remainingMarginAfter)}.`;

  const contextPoints = [
    `Saldo líquido imediato: ${formatCurrency(liquidBalance)}`,
    `Pagamentos previstos para os próximos dias: ${formatCurrency(upcomingTotal)}`,
    `Margem de segurança estimada após a compra: ${formatCurrency(remainingMarginAfter)}`,
    `Impacto no orçamento mensal: ${budgetImpactPercent.toFixed(1)}%`,
    remainingMarginAfter < 0
      ? 'Atenção: essa despesa pode exigir o uso de reserva ou comprometer pagamentos futuros.'
      : 'Sua margem estimada permanece positiva após esta despesa.',
  ];

  return {
    purchaseAmount,
    currentAvailableBalance: liquidBalance,
    upcomingExpensesTotal: upcomingTotal,
    safeMarginBeforePurchase: safeMarginBefore,
    remainingMarginAfterPurchase: remainingMarginAfter,
    budgetImpactPercent,
    canAffordSafely,
    explanation,
    contextPoints,
  };
}

export interface WorthItAnalysis {
  monthlyCost: number;
  annualCost: number;
  incomePercentage: number;
  explanation: string;
  comparisonPoints: string[];
}

export function analyzeWorthIt(
  monthlyCost: number,
  monthlyIncome: number
): WorthItAnalysis {
  const annualCost = monthlyCost * 12;
  const income = monthlyIncome > 0 ? monthlyIncome : 4500;
  const incomePercentage = (monthlyCost / income) * 100;

  const explanation = `Essa despesa recorrente de ${formatCurrency(monthlyCost)} ao mês representa aproximadamente ${incomePercentage.toFixed(1)}% da sua renda mensal informada e totaliza ${formatCurrency(annualCost)} no acumulado de 1 ano.`;

  const comparisonPoints = [
    `Custo em 12 meses: ${formatCurrency(annualCost)}`,
    `Custo em 24 meses: ${formatCurrency(annualCost * 2)}`,
    `Compromisso mensal da renda: ${incomePercentage.toFixed(1)}%`,
    `Equivalente a investir ${formatCurrency(monthlyCost)}/mês numa meta financeira.`,
  ];

  return {
    monthlyCost,
    annualCost,
    incomePercentage,
    explanation,
    comparisonPoints,
  };
}

export function detectDuplicateTransactions(transactions: Transaction[]): {
  id1: string;
  id2: string;
  description: string;
  amount: number;
  date1: string;
  date2: string;
}[] {
  const duplicates: {
    id1: string;
    id2: string;
    description: string;
    amount: number;
    date1: string;
    date2: string;
  }[] = [];

  const seen = new Set<string>();

  for (let i = 0; i < transactions.length; i++) {
    const t1 = transactions[i];
    if (t1.type !== 'expense') continue;

    for (let j = i + 1; j < transactions.length; j++) {
      const t2 = transactions[j];
      if (t2.type !== 'expense') continue;

      if (
        t1.accountId === t2.accountId &&
        Math.abs(t1.amount - t2.amount) < 0.01 &&
        t1.description.trim().toLowerCase() === t2.description.trim().toLowerCase()
      ) {
        const d1 = new Date(t1.date).getTime();
        const d2 = new Date(t2.date).getTime();
        const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

        if (diffDays <= 3) {
          const pairKey = `${t1.id}_${t2.id}`;
          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            duplicates.push({
              id1: t1.id,
              id2: t2.id,
              description: t1.description,
              amount: t1.amount,
              date1: t1.date,
              date2: t2.date,
            });
          }
        }
      }
    }
  }

  return duplicates;
}

export function calculateOrganizationScore(
  transactions: Transaction[],
  budgets: Budget[],
  goals: Goal[],
  recurring: RecurringTransaction[]
): number {
  let score = 30; // base starting score

  // Has recent transactions logged
  if (transactions.length > 5) score += 20;
  else if (transactions.length > 0) score += 10;

  // Has category budgets defined
  if (budgets.length >= 3) score += 20;
  else if (budgets.length > 0) score += 10;

  // Has at least one financial goal with progress
  if (goals.length > 0) {
    score += 15;
    const hasProgress = goals.some((g) => g.currentAmount > 0);
    if (hasProgress) score += 5;
  }

  // Has planned recurring expenses
  if (recurring.length >= 2) score += 10;

  return Math.min(100, score);
}

export function calculateEstimatedMonthlyForecast(
  currentDay: number,
  daysInMonth: number,
  spentSoFar: number,
  upcomingExpensesTotal: number
): number {
  if (currentDay <= 0) return spentSoFar + upcomingExpensesTotal;
  const dailyAverage = spentSoFar / currentDay;
  const remainingDays = Math.max(0, daysInMonth - currentDay);
  const estimatedPace = spentSoFar + dailyAverage * remainingDays;
  return Math.max(estimatedPace, spentSoFar + upcomingExpensesTotal);
}
