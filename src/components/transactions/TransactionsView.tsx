import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Repeat,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Account, Transaction, TransactionType } from '../../types';
import { formatCurrency, detectDuplicateTransactions } from '../../lib/calculations';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  selectedMonth: string;
  onAddTransaction: (type?: TransactionType) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  selectedMonth,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const duplicates = detectDuplicateTransactions(transactions);

  // Extract all unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Type filter
    if (filterType !== 'all' && tx.type !== filterType) return false;
    // Category filter
    if (filterCategory !== 'all' && tx.category !== filterCategory) return false;
    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(term);
      const matchCat = tx.category.toLowerCase().includes(term);
      const matchAmt = tx.amount.toString().includes(term);
      if (!matchDesc && !matchCat && !matchAmt) return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Movimentações</h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Histórico completo de entradas, saídas, parcelamentos e transferências.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTransaction('expense')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Adicionar Movimentação</span>
          </button>
        </div>
      </div>

      {/* Duplicate Alert Banner if found */}
      {duplicates.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#151D18] border border-[#FF5252]/40 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-[#FF5252] flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-semibold text-white">Possível cobrança duplicada detectada</div>
            <p className="text-[#9CAE9F]">
              Identificamos 2 despesas com mesma descrição e valor idêntico ({formatCurrency(duplicates[0].amount)}) registradas em {duplicates[0].date1} e {duplicates[0].date2}.
              Verifique se foi intencional ou cobrança indevida no cartão/banco.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por descrição, valor ou categoria..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none focus:border-[#00E676]"
            >
              <option value="all">Todos os tipos</option>
              <option value="expense">Apenas Despesas</option>
              <option value="income">Apenas Receitas</option>
              <option value="transfer">Apenas Transferências</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white outline-none focus:border-[#00E676]"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-[#65796A] pt-1">
          <span>{filtered.length} movimentações encontradas</span>
          {(searchTerm || filterType !== 'all' || filterCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCategory('all');
                setCurrentPage(1);
              }}
              className="text-[#00E676] hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table / Cards */}
      <div className="rounded-3xl bg-[#101613] border border-[#1F2B23] overflow-hidden">
        {paginatedTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#151D18] text-[#65796A] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-[#00E676]" />
            </div>
            <p className="text-sm text-[#9CAE9F]">
              Seu dinheiro ainda não tem movimentações aqui.
            </p>
            <button
              onClick={() => onAddTransaction('expense')}
              className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
            >
              Adicionar primeira movimentação
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2B23]/50">
            {paginatedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              const account = accounts.find((a) => a.id === tx.accountId);
              const destAccount = tx.destinationAccountId
                ? accounts.find((a) => a.id === tx.destinationAccountId)
                : null;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#16161A]/50 transition text-xs group"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-[#35D07F]/10 text-[#35D07F]'
                          : isTransfer
                          ? 'bg-[#5E8BFF]/10 text-[#5E8BFF]'
                          : 'bg-[#FF5C6C]/10 text-[#FF5C6C]'
                      }`}
                    >
                      {isIncome ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : isTransfer ? (
                        <Repeat className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-[#707078] flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#16161A] text-[#A5A5AD]">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>
                          {isTransfer
                            ? `${account?.name} → ${destAccount?.name}`
                            : account?.name || 'Conta'}
                        </span>
                        {tx.installments && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#00E676] font-mono">
                              <Layers className="w-3 h-3" />
                              Parcela {tx.installments.current}/{tx.installments.total}
                            </span>
                          </>
                        )}
                        {tx.isRecurring && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#00E676]">
                              <Clock className="w-3 h-3" />
                              Recorrente
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount, Date and Action */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold font-mono ${
                          isIncome
                            ? 'text-[#00E676]'
                            : isTransfer
                            ? 'text-[#69F0AE]'
                            : 'text-white'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '↔' : '-'} {formatCurrency(tx.amount)}
                      </div>
                      <div className="text-[10px] text-[#65796A] mt-0.5">{tx.date}</div>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-2 rounded-xl text-[#65796A] hover:text-[#FF5252] hover:bg-[#FF5252]/10 opacity-70 group-hover:opacity-100 transition"
                      title="Excluir movimentação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#24242A] flex items-center justify-between text-xs text-[#A5A5AD]">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-[#16161A] border border-[#24242A] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-[#16161A] border border-[#24242A] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
