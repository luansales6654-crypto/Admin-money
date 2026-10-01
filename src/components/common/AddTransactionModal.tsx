import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp, Repeat, Calendar, Layers, Clock } from 'lucide-react';
import { Account, Transaction, TransactionType } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  accounts: Account[];
  initialType?: TransactionType;
}

const CATEGORIES = {
  expense: [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Lazer',
    'Educação',
    'Assinaturas',
    'Eletrônicos',
    'Vestuário',
    'Serviços',
    'Outros',
  ],
  income: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Reembolso',
    'Presente',
    'Outros',
  ],
  transfer: ['Transferência'],
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accounts,
  initialType = 'expense',
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [destinationAccountId, setDestinationAccountId] = useState(
    accounts[1]?.id || accounts[0]?.id || ''
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Installments state
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState(3);
  const [currentInstallment, setCurrentInstallment] = useState(1);

  // Recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const parsed = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) {
      setFormError('Por favor insira um valor válido maior que zero.');
      return;
    }
    if (!description.trim()) {
      setFormError('Por favor insira uma descrição para a movimentação.');
      return;
    }

    const payload: Omit<Transaction, 'id' | 'createdAt'> = {
      description: description.trim(),
      amount: parsed,
      type,
      category,
      accountId,
      destinationAccountId: type === 'transfer' ? destinationAccountId : undefined,
      date,
      notes: notes.trim() || undefined,
      isRecurring: isRecurring && type !== 'transfer',
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      installments:
        isInstallment && type === 'expense'
          ? {
              current: currentInstallment,
              total: totalInstallments,
              installmentId: `inst_${Date.now()}`,
            }
          : undefined,
      status: 'completed',
    };

    onSave(payload);
    onClose();
  };

  const parsedAmount = parseFloat(amountStr.replace(',', '.')) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-[#101613] border border-[#1F2B23] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1F2B23]">
          <span className="text-base font-bold text-white">Nova Movimentação</span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#65796A] hover:text-white hover:bg-[#151D18] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 text-xs text-[#FF5252] font-semibold">
              {formError}
            </div>
          )}

          {/* Transaction Type Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#151D18] rounded-2xl border border-[#1F2B23]">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                type === 'expense'
                  ? 'bg-[#FF5252] text-white shadow-sm'
                  : 'text-[#9CAE9F] hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Despesa</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition ${
                type === 'income'
                  ? 'bg-[#00E676] text-[#050706] shadow-sm'
                  : 'text-[#9CAE9F] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Receita</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('transfer')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                type === 'transfer'
                  ? 'bg-[#1F2B23] text-[#00E676] border border-[#00E676]/40 shadow-sm'
                  : 'text-[#9CAE9F] hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>Transferir</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-[#65796A] mb-1.5">
              Valor da movimentação
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xl font-extrabold text-[#00E676]">R$</span>
              <input
                type="text"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder="0,00"
                autoFocus
                required
                className="w-full pl-13 pr-4 py-3.5 bg-[#151D18] border border-[#1F2B23] focus:border-[#00E676] rounded-2xl text-2xl font-black text-white placeholder-[#65796A] outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#65796A] mb-1.5">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado, Aluguel, Salário..."
              required
              className="w-full px-4 py-3 bg-[#151D18] border border-[#1F2B23] focus:border-[#00E676] rounded-2xl text-xs text-white placeholder-[#65796A] outline-none transition"
            />
          </div>

          {/* Accounts Selection */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#65796A] mb-1.5">Conta de Origem</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#65796A] mb-1.5">Conta de Destino</label>
                <select
                  value={destinationAccountId}
                  onChange={(e) => setDestinationAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#65796A] mb-1.5">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none"
                >
                  {CATEGORIES[type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#65796A] mb-1.5">Conta</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-[#65796A] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Data da Movimentação</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none"
            />
          </div>

          {/* Brazilian Installment Option */}
          {type === 'expense' && (
            <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00E676]" />
                  <span className="text-xs font-semibold text-white">Compra Parcelada?</span>
                </div>
                <input
                  type="checkbox"
                  checked={isInstallment}
                  onChange={(e) => {
                    setIsInstallment(e.target.checked);
                    if (e.target.checked) setIsRecurring(false);
                  }}
                  className="w-4 h-4 accent-[#00E676] rounded cursor-pointer"
                />
              </div>

              {isInstallment && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1F2B23]">
                  <div>
                    <label className="block text-[11px] text-[#65796A] mb-1">Total de parcelas</label>
                    <select
                      value={totalInstallments}
                      onChange={(e) => setTotalInstallments(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs text-white"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24].map((n) => (
                        <option key={n} value={n}>
                          {n}x de {formatCurrency(parsedAmount / n)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#65796A] mb-1">Parcela atual</label>
                    <input
                      type="number"
                      min={1}
                      max={totalInstallments}
                      value={currentInstallment}
                      onChange={(e) => setCurrentInstallment(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recurring Option */}
          {type !== 'transfer' && !isInstallment && (
            <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00E676]" />
                  <span className="text-xs font-semibold text-white">Despesa/Receita Recorrente?</span>
                </div>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 accent-[#00E676] rounded cursor-pointer"
                />
              </div>

              {isRecurring && (
                <div className="pt-2 border-t border-[#1F2B23]">
                  <label className="block text-[11px] text-[#65796A] mb-1">Frequência</label>
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs text-white"
                  >
                    <option value="monthly">Mensal (todo mês)</option>
                    <option value="weekly">Semanal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#65796A] mb-1.5">Notas opcionais</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Detalhes, observações..."
              className="w-full px-4 py-2 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white placeholder-[#65796A] outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Salvar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
