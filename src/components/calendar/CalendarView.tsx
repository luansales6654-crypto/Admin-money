import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { RecurringTransaction, Transaction } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface CalendarViewProps {
  transactions: Transaction[];
  recurring: RecurringTransaction[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenAddModal: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  transactions,
  recurring,
  selectedMonth,
  onMonthChange,
  onOpenAddModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr); // 1-12

  // Days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 is Sunday

  // Group transactions by day
  const eventsByDay = new Map<number, Transaction[]>();

  for (const t of transactions) {
    if (t.date.startsWith(selectedMonth)) {
      const dayNum = parseInt(t.date.split('-')[2]);
      const list = eventsByDay.get(dayNum) || [];
      list.push(t);
      eventsByDay.set(dayNum, list);
    }
  }

  // Upcoming bills in future dates
  const upcomingBills = transactions.filter(
    (t) => t.status === 'scheduled' || (t.isRecurring && t.type === 'expense')
  );

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 2, 1);
    const newYm = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newYm);
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month, 1);
    const newYm = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newYm);
    setSelectedDay(null);
  };

  const selectedDayEvents = selectedDay ? eventsByDay.get(selectedDay) || [] : [];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Planejamento & Calendário
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Visualize o fluxo diário de entradas, saídas, parcelamentos e contas a pagar.
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111114] border border-[#24242A] rounded-2xl px-2 py-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-xl text-[#A5A5AD] hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-white">
              {new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-xl text-[#A5A5AD] hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Agendar Conta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#65796A] pb-2 border-b border-[#1F2B23]">
            <span>DOM</span>
            <span>SEG</span>
            <span>TER</span>
            <span>QUA</span>
            <span>QUI</span>
            <span>SEX</span>
            <span>SÁB</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank_${i}`} className="min-h-[64px] sm:min-h-[80px] p-1.5 rounded-xl bg-transparent opacity-20" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsByDay.get(day) || [];
              const hasIncome = dayEvents.some((e) => e.type === 'income');
              const hasExpense = dayEvents.some((e) => e.type === 'expense');
              const hasScheduled = dayEvents.some((e) => e.status === 'scheduled');
              const isSelected = selectedDay === day;

              const totalDayExpense = dayEvents
                .filter((e) => e.type === 'expense')
                .reduce((s, e) => s + e.amount, 0);

              return (
                <div
                  key={`day_${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[64px] sm:min-h-[80px] p-2 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#151D18] border-[#00E676] shadow-md shadow-[#00E676]/15'
                      : 'bg-[#101613] border-[#1F2B23] hover:border-[#00E676]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-[#00E676] font-bold' : 'text-white'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-1">
                      {hasIncome && <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />}
                      {hasExpense && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5252]" />}
                      {hasScheduled && <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300]" />}
                    </div>
                  </div>

                  {totalDayExpense > 0 && (
                    <div className="text-[10px] text-[#FF5C6C] font-mono font-medium truncate">
                      -{formatCurrency(totalDayExpense)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#24242A]">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedDay ? `Dia ${selectedDay} de ${new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}` : 'Selecione um dia'}
                </h3>
                <span className="text-[11px] text-[#707078]">
                  {selectedDayEvents.length} eventos registrados
                </span>
              </div>
            </div>

            {selectedDay ? (
              selectedDayEvents.length === 0 ? (
                <p className="text-xs text-[#707078] py-8 text-center">
                  Nenhuma movimentação ou conta agendada para este dia.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                  {selectedDayEvents.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-[#16161A] border border-[#24242A] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{tx.description}</span>
                        <span
                          className={`font-bold font-mono ${
                            tx.type === 'income' ? 'text-[#35D07F]' : 'text-[#FF5C6C]'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#65796A] flex items-center gap-2">
                        <span>{tx.category}</span>
                        {tx.installments && (
                          <span className="text-[#00E676] font-mono font-bold">
                            {tx.installments.current}/{tx.installments.total}x
                          </span>
                        )}
                        {tx.status === 'scheduled' && (
                          <span className="text-[#FFB300] font-medium">Agendado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-xs text-[#707078] py-12 text-center">
                Clique em qualquer dia do calendário para ver todos os pagamentos e recebimentos dessa data.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-[#24242A] text-[11px] text-[#707078] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#35D07F]" />
              <span>Receitas do dia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5C6C]" />
              <span>Despesas executadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB84D]" />
              <span>Contas futuras agendadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Payments List */}
      <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFB84D]" />
            <h2 className="text-base font-bold text-white">Próximos Pagamentos Agendados</h2>
          </div>
          <span className="text-xs text-[#707078] font-mono">{upcomingBills.length} agendamentos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingBills.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#16161A] border border-[#24242A] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{b.description}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] font-mono">
                    Vencimento: {b.date}
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-[#FF5C6C] mt-2">
                  {formatCurrency(b.amount)}
                </div>
              </div>

              <div className="text-[10px] text-[#707078] pt-2 border-t border-[#24242A]">
                Categoria: {b.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
