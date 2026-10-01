import React, { useState } from 'react';
import { X, Zap, Check, ArrowRight } from 'lucide-react';
import { Account, Transaction, TransactionType } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  accounts: Account[];
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accounts,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  if (!isOpen) return null;

  // Parser logic: Extract numbers and text
  const parseEntry = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const match = trimmed.match(/(\d+([.,]\d{1,2})?)/);
    if (!match) return null;

    const amountStr = match[0].replace(',', '.');
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return null;

    let description = trimmed.replace(match[0], '').trim();
    if (!description) description = 'Movimentação rápida';

    const descLower = description.toLowerCase();
    let type: TransactionType = 'expense';
    let category = 'Outros';

    if (descLower.includes('salario') || descLower.includes('salário') || descLower.includes('freela') || descLower.includes('recebi') || descLower.includes('deposito')) {
      type = 'income';
      category = 'Salário';
    } else if (descLower.includes('almoço') || descLower.includes('jantar') || descLower.includes('lanche') || descLower.includes('ifood') || descLower.includes('restaurante') || descLower.includes('mercado') || descLower.includes('padaria')) {
      category = 'Alimentação';
    } else if (descLower.includes('uber') || descLower.includes('gasolina') || descLower.includes('combustivel') || descLower.includes('posto') || descLower.includes('onibus') || descLower.includes('metro')) {
      category = 'Transporte';
    } else if (descLower.includes('farmacia') || descLower.includes('farmácia') || descLower.includes('remedio') || descLower.includes('medico') || descLower.includes('consulta')) {
      category = 'Saúde';
    } else if (descLower.includes('cinema') || descLower.includes('show') || descLower.includes('jogo') || descLower.includes('bar') || descLower.includes('festa')) {
      category = 'Lazer';
    } else if (descLower.includes('aluguel') || descLower.includes('luz') || descLower.includes('agua') || descLower.includes('energia') || descLower.includes('condominio')) {
      category = 'Moradia';
    }

    return {
      description,
      amount,
      type,
      category,
    };
  };

  const parsed = parseEntry(inputText);

  const handleConfirm = () => {
    if (!parsed) return;

    onSave({
      description: parsed.description,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      accountId: selectedAccountId || (accounts[0]?.id || ''),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });

    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2B23]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Texto Rápido</h3>
              <p className="text-[10px] text-[#65796A]">Digite o que gastou ou recebeu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#65796A] hover:text-white hover:bg-[#151D18] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs text-[#65796A] mb-1.5 font-medium">
            Exemplos: "Almoço 35", "Gasolina 150", "Salário 4000"
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Almoço 35"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && parsed) {
                handleConfirm();
              }
            }}
            className="w-full px-4 py-3 bg-[#151D18] border border-[#1F2B23] focus:border-[#00E676] rounded-2xl text-base text-white placeholder-[#65796A] outline-none"
          />
        </div>

        {/* Live Parsed Preview */}
        {parsed ? (
          <div className="p-4 rounded-2xl bg-[#151D18] border border-[#00E676]/30 space-y-3">
            <span className="text-[11px] font-extrabold text-[#00E676] uppercase tracking-wider">
              Identificado com Sucesso
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#65796A] block">Descrição:</span>
                <span className="text-white font-medium">{parsed.description}</span>
              </div>
              <div>
                <span className="text-[#65796A] block">Valor:</span>
                <span className="text-white font-bold font-mono">
                  {formatCurrency(parsed.amount)}
                </span>
              </div>
              <div>
                <span className="text-[#65796A] block">Categoria:</span>
                <span className="text-white">{parsed.category}</span>
              </div>
              <div>
                <span className="text-[#65796A] block">Tipo:</span>
                <span
                  className={parsed.type === 'income' ? 'text-[#00E676] font-bold' : 'text-[#FF5252] font-bold'}
                >
                  {parsed.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[#65796A] block text-[11px] mb-1">Debitar / Creditar na Conta:</span>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs text-white"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatCurrency(acc.balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : inputText.trim() ? (
          <div className="p-3 rounded-xl bg-[#151D18] border border-[#1F2B23] text-xs text-[#65796A]">
            Inclua o nome e um número (ex: "Café 12" ou "Uber 28,50")
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#9CAE9F] hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!parsed}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] disabled:opacity-40 disabled:cursor-not-allowed text-[#050706] text-xs font-black shadow-md transition"
          >
            <span>Confirmar e Salvar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
