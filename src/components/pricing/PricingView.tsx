import React, { useState } from 'react';
import { Flame, Check, MessageCircle, ShieldCheck, X, ArrowRight, Phone, Sparkles, Clock } from 'lucide-react';
import { UserProfile } from '../../types';
import { getTrialStatus } from '../../lib/trial';
import { formatWhatsAppLink, normalizeWhatsAppNumber, SALES_WHATSAPP_NUMBER, SALES_WHATSAPP_DISPLAY } from '../../lib/whatsapp';

interface PricingViewProps {
  user: UserProfile;
  onSelectPlan: (plan: 'pro' | 'premium') => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ user, onSelectPlan, onUpdateUser }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<'pro' | 'premium'>('pro');
  const [salesPhone, setSalesPhone] = useState(() => normalizeWhatsAppNumber(user.whatsappSalesNumber));
  const [successMsg, setSuccessMsg] = useState('');

  const trialInfo = getTrialStatus(user);

  // Exact prices requested by user
  const priceProMonthly = 50.17;
  const pricePremiumMonthly = 96.90;

  // Annual calculation with 20% discount
  const priceProYearly = 40.14;
  const pricePremiumYearly = 77.52;

  const getPlanPrice = (plan: 'pro' | 'premium') => {
    if (plan === 'pro') return billingPeriod === 'monthly' ? priceProMonthly : priceProYearly;
    return billingPeriod === 'monthly' ? pricePremiumMonthly : pricePremiumYearly;
  };

  const getPlanWhatsAppMessage = (plan: 'pro' | 'premium') => {
    const price = getPlanPrice(plan).toFixed(2).replace('.', ',');
    const name = plan === 'pro' ? 'Pro' : 'Premium';
    if (billingPeriod === 'yearly') {
      return `Olá! Quero assinar o plano ${name} ANUAL do Admin Money por R$ ${price}/mês. Como faço para liberar meu acesso?`;
    }
    return `Olá! Quero assinar o plano ${name} do Admin Money por R$ ${price}/mês. Como faço para liberar meu acesso?`;
  };

  const getPlanWhatsAppUrl = (plan: 'pro' | 'premium') => {
    return formatWhatsAppLink(salesPhone, getPlanWhatsAppMessage(plan));
  };

  const currentPrice = getPlanPrice(selectedPlanForPurchase);
  const planName = selectedPlanForPurchase === 'pro' ? 'Pro' : 'Premium';

  const getWhatsAppMessage = () => getPlanWhatsAppMessage(selectedPlanForPurchase);
  const getWhatsAppUrl = () => getPlanWhatsAppUrl(selectedPlanForPurchase);

  const handleOpenPurchase = (plan: 'pro' | 'premium') => {
    setSelectedPlanForPurchase(plan);
    setShowWhatsAppModal(true);
  };

  const handleSavePhone = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        whatsappSalesNumber: salesPhone.trim(),
      });
      setSuccessMsg('Número de WhatsApp de vendas atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101613] border border-[#1F2B23] text-xs text-[#00E676]">
          <Flame className="w-3.5 h-3.5" />
          <span>Micro-SaaS • Planos Comerciais</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Escolha seu Plano de Acesso
        </h1>
        <p className="text-xs sm:text-sm text-[#9CAE9F]">
          Controle financeiro descomplicado e inteligente. A liberação do seu plano é feita diretamente via WhatsApp.
        </p>

        {/* 3-day Trial Banner */}
        <div className="p-4 rounded-2xl bg-[#101613] border border-[#00E676]/30 flex items-center justify-between gap-3 text-xs text-left">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#00E676] shrink-0" />
            <div>
              <span className="font-bold text-white block">Período de Teste Gratuito de 3 Dias</span>
              <span className="text-[11px] text-[#9CAE9F]">
                {trialInfo.isPaid
                  ? `Seu ${trialInfo.formattedRemaining} está liberado!`
                  : trialInfo.isExpired
                  ? 'Seus 3 dias de teste expiraram. Ative um plano para continuar.'
                  : `Você possui ${trialInfo.formattedRemaining} para degustação.`}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-lg bg-[#00E676]/15 text-[#00E676] font-mono font-bold shrink-0">
            {trialInfo.isPaid ? 'ASSINATURA ATIVA' : trialInfo.isExpired ? 'TESTE EXPIRADO' : 'DEGUSTAÇÃO'}
          </span>
        </div>

        {/* Toggle Billing */}
        <div className="inline-flex items-center p-1 bg-[#101613] border border-[#1F2B23] rounded-2xl text-xs mt-2">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              billingPeriod === 'monthly' ? 'bg-[#151D18] text-white' : 'text-[#65796A] hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              billingPeriod === 'yearly' ? 'bg-[#00E676] text-[#050706]' : 'text-[#65796A] hover:text-white'
            }`}
          >
            <span>Anual</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-black">20% OFF</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 text-xs text-[#00E676] text-center font-bold">
          {successMsg}
        </div>
      )}

      {/* 2 Official Paid Plans (Free Plan completely removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Pro Plan (R$ 50,17) */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-[#151D18] border-2 flex flex-col justify-between space-y-6 relative shadow-2xl ${
          user.plan === 'pro' && user.isSubscriptionActive ? 'border-[#00E676] shadow-[#00E676]/20' : 'border-[#00E676]/60 shadow-[#00E676]/10'
        }`}>
          <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#00E676] text-[#050706] text-[10px] font-black uppercase tracking-wider">
            Recomendado
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#00E676] uppercase tracking-wider">Plano Pro</span>
              {user.plan === 'pro' && user.isSubscriptionActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] font-bold">
                  Plano Atual
                </span>
              )}
            </div>

            <div className="text-4xl font-black font-mono text-white">
              {billingPeriod === 'monthly' ? 'R$ 50,17' : 'R$ 40,14'}{' '}
              <span className="text-xs text-[#65796A] font-normal">/mês</span>
            </div>

            <p className="text-xs text-[#9CAE9F]">
              Controle avançado com suporte a compras parceladas, limites de cartões e exportação.
            </p>

            <ul className="space-y-3 text-xs text-white">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Lançamentos e extrato ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Gestão de múltiplos bancos e carteiras</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Compras parceladas (cartão até 24x)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Simulador de compra "Posso Gastar?"</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Calendário de vencimentos e contas a pagar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Metas de economia com cálculo de progresso</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Exportação e importação de extratos CSV</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleOpenPurchase('pro')}
              className="w-full py-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Assinar no WhatsApp (R$ 50,17)</span>
            </button>
            <p className="text-[10px] text-center text-[#65796A]">
              Liberação rápida direto com o vendedor pelo WhatsApp
            </p>
          </div>
        </div>

        {/* Premium Plan (R$ 96,90) */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-[#101613] border flex flex-col justify-between space-y-6 ${
          user.plan === 'premium' && user.isSubscriptionActive ? 'border-[#00E676]' : 'border-[#1F2B23]'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider">Premium AI</span>
              {user.plan === 'premium' && user.isSubscriptionActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] font-bold">
                  Plano Atual
                </span>
              )}
            </div>

            <div className="text-4xl font-black font-mono text-white">
              {billingPeriod === 'monthly' ? 'R$ 96,90' : 'R$ 77,52'}{' '}
              <span className="text-xs text-[#65796A] font-normal">/mês</span>
            </div>

            <p className="text-xs text-[#65796A]">
              Inteligência Artificial completa, consultoria em dados e regras financeiras automáticas.
            </p>

            <ul className="space-y-3 text-xs text-[#9CAE9F]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span className="text-white font-medium">Tudo do Plano Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Chat inteligente de finanças com Gemini AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Regras inteligentes customizadas de economia</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Detecção de assinaturas duplicadas ou abusivas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Simulador de cenários ("E se eu economizar X...")</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00E676]" />
                <span>Suporte prioritário exclusivo no WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleOpenPurchase('premium')}
              className="w-full py-3.5 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] text-[#00E676] text-xs font-black border border-[#00E676]/40 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Assinar no WhatsApp (R$ 96,90)</span>
            </button>
            <p className="text-[10px] text-center text-[#65796A]">
              Liberação rápida direto com o vendedor pelo WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Sales Number Configuration for Micro-SaaS Owner */}
      <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#00E676]" />
          <h3 className="text-sm font-bold text-white">Número de WhatsApp de Vendas do Micro-SaaS</h3>
        </div>
        <p className="text-xs text-[#9CAE9F]">
          As mensagens de compra dos clientes são encaminhadas para este número configurado com a mensagem pronta na barra de texto.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={salesPhone}
            onChange={(e) => setSalesPhone(e.target.value)}
            placeholder="Ex: 5521996589629"
            className="flex-1 px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white font-mono outline-none focus:border-[#00E676]"
          />
          <button
            onClick={handleSavePhone}
            className="px-6 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black transition"
          >
            Salvar Número
          </button>
        </div>
      </div>

      {/* Modal WhatsApp Purchase */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="absolute top-5 right-5 text-[#65796A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Contratação do Plano {planName}
              </h3>
              <p className="text-xs text-[#9CAE9F]">
                Valor: <strong className="text-white font-mono">R$ {currentPrice.toFixed(2).replace('.', ',')}</strong>
                {billingPeriod === 'yearly' ? ' /mês (cobrado anualmente)' : ' /mês'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151D18] border border-[#1F2B23] space-y-2">
              <span className="text-[11px] font-bold text-[#65796A] uppercase tracking-wider block">
                Mensagem que será enviada:
              </span>
              <p className="text-xs text-white italic bg-[#101613] p-3 rounded-xl border border-[#1F2B23]/50">
                "{getWhatsAppMessage()}"
              </p>
              <p className="text-[10px] text-[#65796A]">
                Número de atendimento: <strong>(21) 99658-9629</strong>
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onSelectPlan(selectedPlanForPurchase);
                  setTimeout(() => setShowWhatsAppModal(false), 500);
                }}
                className="w-full py-3.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continuar para o WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full py-2.5 text-xs text-[#65796A] hover:text-white"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
