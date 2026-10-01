import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, CornerDownLeft, Shield } from 'lucide-react';
import { ChatMessage, Transaction, Account, Budget, Goal, RecurringTransaction } from '../../types';
import { askFinancialAssistantClient } from '../../lib/gemini';
import { calculatePeriodSummary, calculateCategoryBreakdown } from '../../lib/calculations';
import { StorageService } from '../../lib/storage';

interface AssistantViewProps {
  initialQuestion?: string;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  recurring: RecurringTransaction[];
  selectedMonth: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  initialQuestion,
  transactions,
  accounts,
  budgets,
  goals,
  recurring,
  selectedMonth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => StorageService.getChat());
  const [input, setInput] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Quanto gastei com comida este mês?',
    'Qual foi minha maior despesa?',
    'Quanto posso gastar até o fim do mês?',
    'Quais contas tenho para pagar?',
    'Quanto economizei neste mês?',
    'Mostre o andamento das minhas metas',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const summary = calculatePeriodSummary(transactions, selectedMonth);
    const topCats = calculateCategoryBreakdown(transactions, selectedMonth, 'expense').slice(0, 5).map(c => ({
      category: c.category,
      amount: c.total,
    }));
    const totalLiquid = accounts
      .filter(a => a.type !== 'credit_card' && a.type !== 'investment')
      .reduce((s, a) => s + a.balance, 0);

    const upcomingBills = transactions
      .filter(t => t.status === 'scheduled' || (t.isRecurring && t.type === 'expense'))
      .map(b => ({ description: b.description, amount: b.amount, date: b.date }));

    const goalList = goals.map(g => ({
      name: g.name,
      target: g.targetAmount,
      current: g.currentAmount,
    }));

    try {
      const reply = await askFinancialAssistantClient(prompt, {
        totalBalance: totalLiquid,
        monthlyIncome: summary.income,
        monthlyExpenses: summary.expenses,
        savingsRate: summary.savingsRate,
        topCategories: topCats,
        upcomingBills,
        goals: goalList,
      });

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      StorageService.saveChat(finalMessages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F2B23]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E676] to-[#00B359] text-[#050706] flex items-center justify-center shadow-lg shadow-[#00E676]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Converse com seu dinheiro</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] font-mono font-bold">
                IA & Dados Reais
              </span>
            </h1>
            <p className="text-xs text-[#65796A]">
              Pergunte qualquer dúvida sobre seus gastos, contas, sobras e metas.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            StorageService.saveChat([]);
          }}
          className="text-xs text-[#65796A] hover:text-[#FF5252] transition"
        >
          Limpar histórico
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 sm:p-4 rounded-3xl bg-[#101613] border border-[#1F2B23]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#00E676] text-[#050706]'
                    : 'bg-[#151D18] text-[#00E676] border border-[#1F2B23]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#151D18] text-white border border-[#00E676]/40 rounded-tr-none'
                    : 'bg-[#151D18] text-white border border-[#1F2B23] rounded-tl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1.5 ${
                    isUser ? 'text-[#00E676] text-right' : 'text-[#65796A]'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#151D18] border border-[#1F2B23] text-[#00E676] flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-xs text-[#65796A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
              <span>Analisando suas informações financeiras...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] hover:border-[#00E676]/40 text-[#9CAE9F] hover:text-white whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-[#101613] border border-[#1F2B23] focus-within:border-[#00E676] transition"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre seus gastos, contas ou metas..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-[#65796A] outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] disabled:opacity-30 disabled:cursor-not-allowed text-[#050706] transition flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
