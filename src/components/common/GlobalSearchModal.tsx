import React, { useState } from 'react';
import { Search, X, ArrowRight, Tag, Wallet, Target } from 'lucide-react';
import { Transaction, Account, Goal, Budget } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  accounts: Account[];
  goals: Goal[];
  budgets: Budget[];
  onSelectTransaction?: (tx: Transaction) => void;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  transactions,
  accounts,
  goals,
  budgets,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const term = searchTerm.trim().toLowerCase();

  const matchingTransactions = term
    ? transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.amount.toString().includes(term)
      ).slice(0, 6)
    : [];

  const matchingAccounts = term
    ? accounts.filter((a) => a.name.toLowerCase().includes(term))
    : [];

  const matchingGoals = term
    ? goals.filter((g) => g.name.toLowerCase().includes(term))
    : [];

  const totalResults =
    matchingTransactions.length + matchingAccounts.length + matchingGoals.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-[#111114] border border-[#24242A] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#24242A]">
          <Search className="w-5 h-5 text-[#7C5CFF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, valor, categoria, conta ou meta..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-[#707078] outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-[#707078] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-[#707078] hover:text-white px-2 py-1 rounded-lg bg-[#16161A] border border-[#24242A]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!searchTerm ? (
            <div className="py-8 text-center text-xs text-[#707078]">
              Digite algo para buscar em todas as movimentações, contas e metas cadastradas.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-[#707078]">
              Nenhum resultado encontrado para "{searchTerm}".
            </div>
          ) : (
            <>
              {/* Transactions Result */}
              {matchingTransactions.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#707078] px-2 block mb-2">
                    Movimentações ({matchingTransactions.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => {
                          onClose();
                          onNavigate('transactions');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161A] hover:bg-[#202026] border border-[#24242A] cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Tag className="w-3.5 h-3.5 text-[#7C5CFF]" />
                          <div>
                            <div className="text-white font-medium">{tx.description}</div>
                            <div className="text-[10px] text-[#707078]">
                              {tx.category} • {tx.date}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-semibold font-mono ${
                            tx.type === 'income' ? 'text-[#35D07F]' : 'text-[#FF5C6C]'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accounts Result */}
              {matchingAccounts.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#707078] px-2 block mb-2">
                    Contas ({matchingAccounts.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => {
                          onClose();
                          onNavigate('accounts');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161A] hover:bg-[#202026] border border-[#24242A] cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Wallet className="w-3.5 h-3.5 text-[#5E8BFF]" />
                          <span className="text-white font-medium">{acc.name}</span>
                        </div>
                        <div className="font-mono text-white">
                          {formatCurrency(acc.balance)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals Result */}
              {matchingGoals.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#707078] px-2 block mb-2">
                    Metas ({matchingGoals.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingGoals.map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => {
                          onClose();
                          onNavigate('goals');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161A] hover:bg-[#202026] border border-[#24242A] cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Target className="w-3.5 h-3.5 text-[#35D07F]" />
                          <span className="text-white font-medium">{goal.name}</span>
                        </div>
                        <div className="font-mono text-white text-right">
                          <div>{formatCurrency(goal.currentAmount)}</div>
                          <div className="text-[10px] text-[#707078]">
                            de {formatCurrency(goal.targetAmount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
