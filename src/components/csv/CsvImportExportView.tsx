import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Download, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Transaction, Account } from '../../types';
import { formatCurrency } from '../../lib/calculations';

interface CsvImportExportViewProps {
  transactions: Transaction[];
  accounts: Account[];
  onImportTransactions: (txs: Omit<Transaction, 'id' | 'createdAt'>[]) => void;
}

export const CsvImportExportView: React.FC<CsvImportExportViewProps> = ({
  transactions,
  accounts,
  onImportTransactions,
}) => {
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [targetAccount, setTargetAccount] = useState(accounts[0]?.id || '');
  const [importSuccess, setImportSuccess] = useState(false);

  const sampleCsv = `Data;Descrição;Valor;Categoria;Tipo
2026-09-01;Supermercado Extra;184.50;Alimentação;expense
2026-09-03;Farmácia Panvel;62.00;Saúde;expense
2026-09-05;Freelance Design;850.00;Freelance;income`;

  const handleParse = () => {
    if (!csvRawText.trim()) return;

    const lines = csvRawText.trim().split('\n');
    if (lines.length < 2) return;

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const header = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map((p) => p.trim());
      if (parts.length >= 3) {
        const date = parts[0] || new Date().toISOString().split('T')[0];
        const description = parts[1] || 'Item importado';
        const amount = parseFloat(parts[2].replace(',', '.')) || 0;
        const category = parts[3] || 'Outros';
        const type = parts[4]?.toLowerCase() === 'income' ? 'income' : 'expense';

        rows.push({
          date,
          description,
          amount,
          category,
          type,
        });
      }
    }

    setParsedRows(rows);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    const newTransactions = parsedRows.map((r) => ({
      date: r.date,
      description: r.description,
      amount: r.amount,
      category: r.category,
      type: r.type,
      accountId: targetAccount,
      status: 'completed' as const,
    }));

    onImportTransactions(newTransactions);
    setImportSuccess(true);
    setParsedRows([]);
    setCsvRawText('');
    setTimeout(() => setImportSuccess(false), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Data', 'Descricao', 'Valor', 'Tipo', 'Categoria', 'Conta'];
    const rows = transactions.map((t) => {
      const acc = accounts.find((a) => a.id === t.accountId);
      return [
        t.id,
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        t.type,
        t.category,
        acc?.name || '',
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `admin_money_extrato_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Importação & Exportação</h1>
        <p className="text-xs text-[#A5A5AD]">
          Exporte suas movimentações para planilhas ou importe dados de outros bancos em formato CSV.
        </p>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-[#35D07F]/10 border border-[#35D07F]/30 text-xs text-[#35D07F] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Movimentações importadas com sucesso para a conta selecionada!</span>
        </div>
      )}

      {/* Export Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#24242A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Exportar Histórico Completo (CSV)</h3>
          <p className="text-xs text-[#707078] mt-1">
            Gera um arquivo compatível com Excel, Google Planilhas e softwares contábeis.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-3 rounded-2xl bg-[#16161A] hover:bg-[#202026] border border-[#24242A] text-white text-xs font-semibold flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-[#35D07F]" />
          <span>Baixar Planilha CSV</span>
        </button>
      </div>

      {/* Import Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111114] border border-[#24242A] space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white">Importar Dados (CSV)</h3>
          <p className="text-xs text-[#707078] mt-1">
            Cole os dados do seu arquivo CSV com colunas: Data, Descrição, Valor, Categoria, Tipo.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#65796A]">Conteúdo CSV:</span>
            <button
              onClick={() => setCsvRawText(sampleCsv)}
              className="text-[#00E676] hover:underline"
            >
              Inserir modelo de exemplo
            </button>
          </div>

          <textarea
            rows={5}
            value={csvRawText}
            onChange={(e) => setCsvRawText(e.target.value)}
            placeholder={`Data;Descrição;Valor;Categoria;Tipo\n2026-09-01;Supermercado;180.00;Alimentação;expense`}
            className="w-full p-4 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs font-mono text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleParse}
              className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
            >
              Processar e Pré-visualizar
            </button>
          </div>
        </div>

        {/* Parsed Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#24242A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-white">
                {parsedRows.length} itens identificados para importação:
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#707078]">Creditar na Conta:</span>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="px-3 py-1.5 bg-[#16161A] border border-[#24242A] rounded-xl text-xs text-white"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-[#24242A]/50 max-h-48 overflow-y-auto rounded-2xl bg-[#16161A] p-2 text-xs">
              {parsedRows.map((r, i) => (
                <div key={i} className="py-2 px-2 flex justify-between items-center text-white">
                  <span>{r.description} ({r.category})</span>
                  <span className="font-mono">{formatCurrency(r.amount)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setParsedRows([])}
                className="px-4 py-2 text-xs text-[#A5A5AD]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md"
              >
                Confirmar Importação Definitiva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
