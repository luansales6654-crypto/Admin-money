import { GoogleGenAI } from '@google/genai';

export interface FinancialContext {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  topCategories: { category: string; amount: number }[];
  upcomingBills: { description: string; amount: number; date: string }[];
  goals: { name: string; target: number; current: number }[];
}

export async function askGeminiFinancialAssistant(
  prompt: string,
  context: FinancialContext
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateDeterministicAssistantReply(prompt, context);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Você é o assistente financeiro inteligente do ADMIN MONEY.
Personalidade: Calmo, objetivo, simpático, acolhedor e transparente. Nunca seja julgador ou faça a pessoa se sentir envergonhada por gastos. Nunca diga "você gastou demais", prefira "seu gasto está acima da média recente".
Nunca tome decisões financeiras no lugar do usuário e não dê conselhos de investimento regulamentados.
Responda sempre em português do Brasil com clareza e números exatos baseados no contexto fornecido.
Se a informação não existir no contexto, diga honestamente: "Não encontrei dados suficientes para responder com precisão."

Contexto financeiro atual do usuário:
- Saldo líquido total: R$ ${context.totalBalance.toFixed(2)}
- Receitas do mês: R$ ${context.monthlyIncome.toFixed(2)}
- Despesas do mês: R$ ${context.monthlyExpenses.toFixed(2)}
- Taxa de economia: ${context.savingsRate.toFixed(1)}%
- Maiores categorias de gastos: ${context.topCategories.map((c) => `${c.category}: R$ ${c.amount.toFixed(2)}`).join(', ') || 'Nenhuma registrada'}
- Próximos pagamentos/contas agendadas: ${context.upcomingBills.map((b) => `${b.description} (R$ ${b.amount.toFixed(2)} em ${b.date})`).join(', ') || 'Nenhum próximo'}
- Metas financeiras: ${context.goals.map((g) => `${g.name} (${((g.current / (g.target || 1)) * 100).toFixed(0)}% concluído)`).join(', ') || 'Nenhuma meta ativa'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || generateDeterministicAssistantReply(prompt, context);
  } catch (error) {
    console.warn('Gemini API call failed, falling back to deterministic reply:', error);
    return generateDeterministicAssistantReply(prompt, context);
  }
}

export function generateDeterministicAssistantReply(
  prompt: string,
  context: FinancialContext
): string {
  const p = prompt.toLowerCase();

  if (p.includes('comida') || p.includes('alimentação') || p.includes('restaurante') || p.includes('ifood')) {
    const foodCat = context.topCategories.find((c) => c.category.toLowerCase().includes('aliment') || c.category.toLowerCase().includes('comida'));
    if (foodCat) {
      return `Neste mês, seus gastos registrados com Alimentação somam R$ ${foodCat.amount.toFixed(2)}. Esse valor representa uma das suas principais categorias de despesas.`;
    }
    return `Até o momento, não identifiquei despesas registradas especificamente sob a categoria Alimentação neste período.`;
  }

  if (p.includes('quanto gastei') || p.includes('despesas') || p.includes('gasto total')) {
    return `No período atual selecionado, o total de despesas registradas é de R$ ${context.monthlyExpenses.toFixed(2)}, contra R$ ${context.monthlyIncome.toFixed(2)} de receitas cadastradas.`;
  }

  if (p.includes('quanto economizei') || p.includes('taxa de economia') || p.includes('guardei')) {
    const diff = context.monthlyIncome - context.monthlyExpenses;
    return `Sua economia no mês atual é de R$ ${diff.toFixed(2)}, o que representa uma taxa de poupança de ${context.savingsRate.toFixed(1)}% sobre as suas receitas informadas.`;
  }

  if (p.includes('maior gasto') || p.includes('maiores gastos') || p.includes('categoria')) {
    if (context.topCategories.length > 0) {
      const top = context.topCategories[0];
      return `Sua principal categoria de gasto este mês é ${top.category}, somando R$ ${top.amount.toFixed(2)}. Em seguida: ${context.topCategories.slice(1, 3).map((c) => `${c.category} (R$ ${c.amount.toFixed(2)})`).join(', ')}.`;
    }
    return `Ainda não há dados suficientes de categorias para listar os maiores gastos.`;
  }

  if (p.includes('contas') || p.includes('pagamentos') || p.includes('a pagar') || p.includes('vencendo')) {
    if (context.upcomingBills.length > 0) {
      const billsText = context.upcomingBills
        .map((b) => `• ${b.description}: R$ ${b.amount.toFixed(2)} (vencimento: ${b.date})`)
        .join('\n');
      return `Você possui os seguintes pagamentos futuros cadastrados:\n\n${billsText}\n\nTotal previsto: R$ ${context.upcomingBills.reduce((s, b) => s + b.amount, 0).toFixed(2)}.`;
    }
    return `Não constam contas com vencimento pendente cadastradas para os próximos dias.`;
  }

  if (p.includes('meta') || p.includes('reserva') || p.includes('guardar')) {
    if (context.goals.length > 0) {
      const g = context.goals[0];
      const pct = ((g.current / (g.target || 1)) * 100).toFixed(1);
      return `Para a meta "${g.name}", você tem R$ ${g.current.toFixed(2)} acumulados de um objetivo de R$ ${g.target.toFixed(2)} (${pct}% concluído). Faltam R$ ${(g.target - g.current).toFixed(2)}.`;
    }
    return `Você ainda não possui metas cadastradas. Você pode criar metas na aba "Metas" para acompanhar seu progresso!`;
  }

  if (p.includes('posso gastar') || p.includes('comprar')) {
    const safeMargin = context.totalBalance - context.upcomingBills.reduce((s, b) => s + b.amount, 0);
    return `Seu saldo líquido disponível é de R$ ${context.totalBalance.toFixed(2)}. Descontando as contas já agendadas (R$ ${context.upcomingBills.reduce((s, b) => s + b.amount, 0).toFixed(2)}), sua margem de segurança atual é de aproximadamente R$ ${safeMargin.toFixed(2)}. Para simular compras específicas com impacto detalhado, use o simulador "Posso gastar?".`;
  }

  // General helpful fintech response
  return `Com base nos seus dados no Admin Money: seu saldo total é de R$ ${context.totalBalance.toFixed(2)}, com R$ ${context.monthlyExpenses.toFixed(2)} em despesas e R$ ${context.monthlyIncome.toFixed(2)} em receitas neste mês. Fique à vontade para perguntar sobre categorias específicas, contas a vencer ou metas!`;
}
