import React, { useState } from 'react';
import {
  Wallet,
  CreditCard as CreditCardIcon,
  Plus,
  Repeat,
  ShieldCheck,
  Building2,
  Banknote,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { Account, CreditCard, Transaction } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface AccountsViewProps {
  accounts: Account[];
  cards: CreditCard[];
  onAddAccount: (acc: Omit<Account, 'id'>) => void;
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  cards,
  onAddAccount,
  onAddCard,
  onTransfer,
}) => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // New Account state
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState<Account['type']>('checking');
  const [accBalance, setAccBalance] = useState('');
  const [accColor, setAccColor] = useState('#00E676');

  // New Card state
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [cardClosing, setCardClosing] = useState('15');
  const [cardDue, setCardDue] = useState('22');
  const [cardColor, setCardColor] = useState('#00E676');

  // Transfer state
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferError, setTransferError] = useState('');

  const totalAssets = accounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalCardLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalCardUsage = cards.reduce((sum, c) => sum + c.currentUsage, 0);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(accBalance.replace(',', '.')) || 0;
    if (!accName.trim()) return;

    onAddAccount({
      name: accName.trim(),
      type: accType,
      balance: balanceNum,
      initialBalance: balanceNum,
      color: accColor,
      icon: 'Wallet',
    });

    setAccName('');
    setAccBalance('');
    setShowAddAccountModal(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(cardLimit.replace(',', '.')) || 0;
    if (!cardName.trim()) return;

    onAddCard({
      name: cardName.trim(),
      creditLimit: limitNum,
      availableLimit: limitNum,
      currentUsage: 0,
      closingDay: Number(cardClosing) || 15,
      dueDay: Number(cardDue) || 22,
      color: cardColor,
    });

    setCardName('');
    setCardLimit('');
    setShowAddCardModal(false);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    const amount = parseFloat(transferAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      setTransferError('Informe um valor válido maior que zero.');
      return;
    }
    if (fromAccount === toAccount) {
      setTransferError('Selecione contas diferentes para a transferência.');
      return;
    }

    onTransfer(fromAccount, toAccount, amount);
    setTransferAmount('');
    setShowTransferModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contas & Cartões</h1>
          <p className="text-xs text-[#9CAE9F] mt-1">
            Gestão patrimonial completa e controle de faturas de crédito.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTransferError('');
              setShowTransferModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] text-white text-xs font-semibold transition"
          >
            <Repeat className="w-4 h-4 text-[#00E676]" />
            <span>Transferir entre Contas</span>
          </button>

          <button
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Patrimony Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Patrimônio em Contas
          </span>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {formatCurrency(totalAssets)}
          </div>
          <p className="text-[11px] text-[#9CAE9F] mt-1">Somatório de todas as contas ativas</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Faturas em Aberto (Cartões)
          </span>
          <div className="text-2xl font-extrabold font-mono text-[#FF5252] mt-1">
            {formatCurrency(totalCardUsage)}
          </div>
          <p className="text-[11px] text-[#9CAE9F] mt-1">Limite utilizado no ciclo atual</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#101613] border border-[#1F2B23]">
          <span className="text-xs font-semibold text-[#65796A] uppercase tracking-wider">
            Limite Disponível Total
          </span>
          <div className="text-2xl font-extrabold font-mono text-[#00E676] mt-1">
            {formatCurrency(Math.max(0, totalCardLimit - totalCardUsage))}
          </div>
          <p className="text-[11px] text-[#9CAE9F] mt-1">De um limite global de {formatCurrency(totalCardLimit)}</p>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#00E676]" />
            <h2 className="text-base font-bold text-white">Minhas Contas</h2>
          </div>
          <span className="text-xs text-[#65796A] font-mono">{accounts.length} contas cadastradas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-4 hover:border-[#00E676]/40 transition"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: `${acc.color}20`, color: acc.color }}
                >
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151D18] text-[#65796A] uppercase font-mono">
                  {acc.type === 'checking'
                    ? 'Corrente'
                    : acc.type === 'savings'
                    ? 'Reserva'
                    : acc.type === 'investment'
                    ? 'Investimento'
                    : acc.type === 'cash'
                    ? 'Dinheiro'
                    : 'Digital'}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-white">{acc.name}</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {formatCurrency(acc.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-[#00E676]" />
            <h2 className="text-base font-bold text-white">Cartões de Crédito</h2>
          </div>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="text-xs text-[#00E676] hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Cartão</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const usagePercent = card.creditLimit > 0 ? (card.currentUsage / card.creditLimit) * 100 : 0;

            return (
              <div
                key={card.id}
                className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: `${card.color}30`, color: card.color }}
                    >
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{card.name}</div>
                      <div className="text-[11px] text-[#65796A]">{card.brand || 'Cartão de Crédito'}</div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-[#65796A]">
                    <div>Fecha dia {card.closingDay}</div>
                    <div className="text-white font-medium">Vence dia {card.dueDay}</div>
                  </div>
                </div>

                {/* Limit Progress */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9CAE9F]">Fatura atual: <strong className="text-white font-mono">{formatCurrency(card.currentUsage)}</strong></span>
                    <span className="text-[#65796A]">Limite: <strong className="text-white font-mono">{formatCurrency(card.creditLimit)}</strong></span>
                  </div>

                  <div className="w-full h-2.5 bg-[#151D18] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        usagePercent > 85 ? 'bg-[#FF5252]' : usagePercent > 60 ? 'bg-[#FFB300]' : 'bg-[#00E676]'
                      }`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-[#00E676] font-mono">
                    Disponível: {formatCurrency(card.availableLimit)} ({ (100 - usagePercent).toFixed(0)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Finance Information Section */}
      <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00E676]" />
          <h3 className="text-sm font-bold text-white">Conexão Bancária (Open Finance)</h3>
        </div>
        <p className="text-xs text-[#9CAE9F] leading-relaxed max-w-3xl">
          Em breve você poderá conectar instituições financeiras compatíveis com o padrão Open Finance brasileiro para importar saldos e extratos de forma segura e sincronizada. No momento, o controle é mantido através de cadastro manual e importação de planilhas/extratos CSV.
        </p>
      </div>

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <h3 className="text-sm font-semibold text-white">Criar Nova Conta</h3>
              <button onClick={() => setShowAddAccountModal(false)} className="text-[#65796A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">Nome da Conta / Banco</label>
                <input
                  type="text"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="Ex: Nubank, Itaú, Carteira, C6..."
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Tipo de Conta</label>
                <select
                  value={accType}
                  onChange={(e) => setAccType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Conta Poupança / Reserva</option>
                  <option value="investment">Conta de Investimentos</option>
                  <option value="digital_wallet">Carteira Digital</option>
                  <option value="cash">Dinheiro Físico</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Saldo Atual (R$)</label>
                <input
                  type="text"
                  value={accBalance}
                  onChange={(e) => setAccBalance(e.target.value)}
                  placeholder="0,00"
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none font-mono focus:border-[#00E676]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 text-xs text-[#9CAE9F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <h3 className="text-sm font-semibold text-white">Novo Cartão de Crédito</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-[#65796A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">Nome do Cartão</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ex: Nubank Ultravioleta, XP Infinite..."
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Limite Total (R$)</label>
                <input
                  type="text"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                  placeholder="5000,00"
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none font-mono focus:border-[#00E676]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#65796A] mb-1">Dia de Fechamento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={cardClosing}
                    onChange={(e) => setCardClosing(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#65796A] mb-1">Dia de Vencimento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={cardDue}
                    onChange={(e) => setCardDue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 text-xs text-[#9CAE9F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Between Accounts Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#00E676]" />
                <h3 className="text-sm font-semibold text-white">Transferência entre Contas</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-[#65796A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {transferError && (
              <div className="p-3 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 text-xs text-[#FF5252]">
                {transferError}
              </div>
            )}

            <p className="text-[11px] text-[#65796A]">
              Transferências movem fundos entre suas próprias contas sem alterar seu patrimônio líquido total.
            </p>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">De (Conta Origem)</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Para (Conta Destino)</label>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Valor a Transferir (R$)</label>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0,00"
                  required
                  className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 text-xs text-[#9CAE9F]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
                >
                  Concluir Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
