import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { SupportTicket, UserProfile } from '../../types';

interface HelpCenterViewProps {
  user: UserProfile;
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({
  user,
  tickets,
  onSubmitTicket,
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Transações');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Como o Admin Money calcula a taxa de economia?',
      a: 'A taxa de economia é calculada dividindo a quantia guardada (Receitas menos Despesas) pelo total de Receitas do período selecionado, multiplicando por 100.',
    },
    {
      q: 'Como funciona o cálculo do "Posso gastar?"',
      a: 'O simulador soma o saldo líquido atual em contas, deduz as contas com vencimento agendado para os próximos dias e calcula se a compra cabe com margem positiva.',
    },
    {
      q: 'Compras parceladas somam o valor total de uma vez?',
      a: 'Não. Ao cadastrar uma despesa com parcelamento (ex: 10x), o sistema agenda as parcelas mês a mês para que seu orçamento mensal reflita exatamente o que é debitado.',
    },
    {
      q: 'O que são as Regras Inteligentes?',
      a: 'São guardiões configurados por você que disparam alertas caso um gasto ultrapasse certo valor ou se uma categoria atingir determinado montante.',
    },
    {
      q: 'Posso exportar meu histórico financeiro?',
      a: 'Sim, na aba "Importar / Exportar" você pode baixar uma planilha completa em formato CSV a qualquer momento.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    onSubmitTicket({
      subject: subject.trim(),
      category,
      message: message.trim(),
      userEmail: user.email,
      status: 'open',
    });

    setSubject('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Central de Ajuda & Suporte</h1>
        <p className="text-xs text-[#A5A5AD]">
          Tire dúvidas frequentes ou envie uma solicitação direta para a nossa equipe de suporte.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00E676]" />
          <span>Perguntas Frequentes (FAQ)</span>
        </h2>

        <div className="space-y-2.5">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#151D18] border border-[#1F2B23] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-white hover:text-[#00E676] transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#65796A] transition-transform ${
                      isOpen ? 'rotate-180 text-[#00E676]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#9CAE9F] leading-relaxed border-t border-[#1F2B23]/40 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#00E676]" />
          <h2 className="text-base font-bold text-white">Abrir Chamado de Suporte</h2>
        </div>

        {submitted && (
          <div className="p-4 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 text-xs text-[#00E676] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Chamado registrado com sucesso! Nossa equipe responderá em seu e-mail cadastrado.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">Assunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Dúvida sobre conciliação de faturas..."
                required
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#65796A] mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
              >
                <option value="Transações">Transações & Parcelamentos</option>
                <option value="Orçamentos">Orçamentos & Metas</option>
                <option value="Contas">Contas & Cartões</option>
                <option value="Conta/Perfil">Conta e Acesso</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#65796A] mb-1">Mensagem detalhada</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explique o que você precisa ou como podemos ajudar..."
              required
              className="w-full p-4 bg-[#151D18] border border-[#1F2B23] rounded-2xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md transition flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Solicitação</span>
          </button>
        </form>

        {/* Existing User Tickets */}
        {tickets.length > 0 && (
          <div className="pt-6 border-t border-[#24242A] space-y-3">
            <h3 className="text-xs font-semibold text-white">Seus Chamados Anteriores</h3>
            <div className="divide-y divide-[#24242A]/50">
              {tickets.map((t) => (
                <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-white font-medium">{t.subject}</div>
                    <div className="text-[10px] text-[#707078]">{t.category} • {new Date(t.createdAt).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16161A] text-[#35D07F] font-mono">
                    {t.status === 'resolved' ? 'Resolvido' : 'Em análise'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
