import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PieChart,
  HelpCircle,
  Repeat,
  Calendar,
  CheckCircle2,
  DollarSign,
  Zap,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { formatWhatsAppLink, SALES_WHATSAPP_NUMBER } from '../../lib/whatsapp';

interface LandingPageProps {
  onStartFree: () => void;
  onLogin: () => void;
  onExploreDemo: () => void;
  salesPhone?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onLogin,
  onExploreDemo,
  salesPhone = SALES_WHATSAPP_NUMBER,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#050706] text-white selection:bg-[#00E676]/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#050706]/90 backdrop-blur-md border-b border-[#1F2B23]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#9CAE9F]">
            <a href="#features" className="hover:text-white transition">Recursos</a>
            <a href="#posso-gastar" className="hover:text-white transition">Posso Gastar?</a>
            <a href="#pricing" className="hover:text-white transition">Planos</a>
            <a href="#faq" className="hover:text-white transition">Dúvidas Frequentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-bold text-[#9CAE9F] hover:text-white hover:bg-[#101613] rounded-xl border border-transparent hover:border-[#1F2B23] transition"
            >
              Entrar
            </button>
            <button
              onClick={onStartFree}
              className="px-5 py-2.5 text-xs font-black text-[#050706] bg-[#00E676] hover:bg-[#00C853] rounded-xl shadow-lg shadow-[#00E676]/25 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar Gratuitamente
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden px-6">
        {/* Subtle Ambient Money Green Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#00E676]/15 to-[#00B359]/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101613] border border-[#1F2B23] text-xs text-[#9CAE9F]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span>Admin Money Micro-SaaS • Inteligência & Gestão Financeira</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Entenda para onde seu <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-[#69F0AE] to-[#00E676] bg-clip-text text-transparent">
              dinheiro está indo.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#9CAE9F] leading-relaxed">
            Organize seus gastos, acompanhe suas contas, planeje seus próximos pagamentos e receba
            insights inteligentes sobre sua vida financeira — sem a complicação de planilhas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-sm font-black shadow-xl shadow-[#00E676]/30 transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Começar Gratuitamente</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] hover:border-[#00E676]/40 text-white text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              <span>Ver Demonstração Interativa</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview Frame with Money Green Accents */}
        <div className="max-w-6xl mx-auto mt-16 relative">
          <div className="rounded-3xl bg-[#0A0E0C] border border-[#1F2B23] p-2.5 sm:p-4 shadow-2xl shadow-black/90">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-[#1F2B23]/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5252]/60" />
                <span className="w-3 h-3 rounded-full bg-[#FFB300]/60" />
                <span className="w-3 h-3 rounded-full bg-[#00E676]/60" />
              </div>
              <span className="text-[11px] font-mono text-[#65796A]">
                adminmoney.app • Plataforma Fintech Comercial
              </span>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] font-mono font-bold">
                Online
              </div>
            </div>

            {/* Simulated Live UI inside Hero */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 sm:p-6 bg-[#050706] rounded-2xl mt-3">
              {/* Card 1: Balance */}
              <div className="p-4 rounded-2xl bg-[#101613] border border-[#1F2B23]">
                <div className="text-xs text-[#65796A] font-bold">Saldo Total Disponível</div>
                <div className="text-2xl font-black font-mono text-white mt-1">R$ 21.570,50</div>
                <div className="text-xs text-[#00E676] font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +R$ 2.450 este mês
                </div>
              </div>

              {/* Card 2: Income */}
              <div className="p-4 rounded-2xl bg-[#101613] border border-[#1F2B23]">
                <div className="text-xs text-[#65796A] font-bold">Receitas do Mês</div>
                <div className="text-2xl font-black font-mono text-[#00E676] mt-1">R$ 9.850,00</div>
                <div className="text-xs text-[#65796A] mt-2">Salário + Consultorias</div>
              </div>

              {/* Card 3: Expenses */}
              <div className="p-4 rounded-2xl bg-[#101613] border border-[#1F2B23]">
                <div className="text-xs text-[#65796A] font-bold">Despesas Registradas</div>
                <div className="text-2xl font-black font-mono text-[#FF5252] mt-1">R$ 3.840,00</div>
                <div className="text-xs text-[#65796A] mt-2">Dentro dos limites</div>
              </div>

              {/* Card 4: Savings Rate */}
              <div className="p-4 rounded-2xl bg-[#101613] border border-[#1F2B23]">
                <div className="text-xs text-[#65796A] font-bold">Taxa de Poupança</div>
                <div className="text-2xl font-black font-mono text-[#00E676] mt-1">61,0%</div>
                <div className="text-xs text-[#00E676] mt-2">Excelente controle</div>
              </div>

              {/* Wide preview item: Posso gastar preview */}
              <div className="md:col-span-4 p-4 rounded-2xl bg-[#151D18] border border-[#00E676]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Diferencial Exclusivo: "Posso gastar?"</div>
                    <div className="text-xs text-[#9CAE9F]">
                      "Posso comprar um tênis de R$ 380?" • Análise transparente do saldo líquido descontando contas agendadas.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onExploreDemo}
                  className="px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black transition"
                >
                  Testar no App
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 border-y border-[#1F2B23] bg-[#0A0E0C]/60 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-white">Seu dinheiro. Sua visão. Seu controle.</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#101613] border border-[#1F2B23]">
              <ShieldCheck className="w-6 h-6 text-[#00E676] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Seus Dados Protegidos</div>
              <div className="text-[11px] text-[#65796A] mt-1">Armazenamento isolado e privado</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101613] border border-[#1F2B23]">
              <CheckCircle2 className="w-6 h-6 text-[#00E676] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Controle Total da Conta</div>
              <div className="text-[11px] text-[#65796A] mt-1">Você decide o que cadastrar</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101613] border border-[#1F2B23]">
              <PieChart className="w-6 h-6 text-[#00E676] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Tudo em um só lugar</div>
              <div className="text-[11px] text-[#65796A] mt-1">Contas, cartões, despesas e metas</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101613] border border-[#1F2B23]">
              <HelpCircle className="w-6 h-6 text-[#FFB300] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Sem decisões automáticas</div>
              <div className="text-[11px] text-[#65796A] mt-1">Transparência em cada número</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Breakdown */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto space-y-24">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101613] border border-[#1F2B23] text-xs text-[#00E676]">
              <PieChart className="w-3.5 h-3.5" />
              <span>Visão Clara</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Veja seu dinheiro com clareza</h2>
            <p className="text-[#9CAE9F] text-sm leading-relaxed">
              Tenha uma visão simples de receitas, despesas, contas, cartões e metas. Saiba
              exatamente quanto sobrou no mês sem precisar fazer contas de cabeça ou abrir múltiplos
              aplicativos de banco.
            </p>
            <ul className="space-y-2.5 text-xs text-[#9CAE9F] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                <span>Cálculo automático de taxa de economia</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                <span>Divisão percentual por categorias e histórico</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                <span>Gráficos objetivos sem poluição visual</span>
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-3 shadow-xl">
            <span className="text-xs font-bold text-white block">Para onde foi meu dinheiro:</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#151D18]">
                <span className="text-white">Moradia</span>
                <span className="font-mono text-white">R$ 1.950,00 (50%)</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#151D18]">
                <span className="text-white">Alimentação</span>
                <span className="font-mono text-white">R$ 682,70 (17%)</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#151D18]">
                <span className="text-white">Transporte</span>
                <span className="font-mono text-white">R$ 220,00 (6%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Posso Gastar? */}
        <div id="posso-gastar" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="p-6 rounded-3xl bg-[#101613] border border-[#1F2B23] space-y-4 shadow-xl order-2 md:order-1">
            <div className="p-4 rounded-2xl bg-[#151D18] border border-[#00E676]/30">
              <div className="text-[11px] text-[#00E676] font-bold mb-1">Simulação do usuário:</div>
              <div className="text-sm font-bold text-white">"Posso comprar um tênis de R$ 380 agora?"</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0E0C] border border-[#1F2B23] text-xs text-[#9CAE9F] space-y-2">
              <div className="text-white font-medium">Resposta do Admin Money:</div>
              <p>
                Hoje você tem R$ 5.420 disponíveis, com R$ 690 em contas agendadas para vencer até o fim do mês.
                Uma compra de R$ 380 representaria 9,8% das suas despesas mensais, mantendo sua margem de segurança
                confortável em R$ 4.350.
              </p>
            </div>
          </div>

          <div className="space-y-4 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101613] border border-[#1F2B23] text-xs text-[#00E676]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Diferencial Exclusivo</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Antes de gastar, confira o impacto</h2>
            <p className="text-[#9CAE9F] text-sm leading-relaxed">
              O recurso "Posso gastar?" analisa seu saldo líquido, receitas esperadas, contas agendadas
              e metas ativas para mostrar com clareza se uma nova compra cabe com folga ou se vai apertar seu mês.
            </p>
            <div className="text-xs text-[#65796A]">
              Sem dizer o que você deve fazer. Você é quem decide com base em números reais.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Commercial Micro-SaaS) */}
      <section id="pricing" className="py-24 px-6 border-t border-[#1F2B23] bg-[#0A0E0C]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101613] border border-[#00E676]/30 text-xs font-bold text-[#00E676]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Dias de Teste Gratuito Sem Compromisso</span>
            </div>

            <h2 className="text-3xl font-black text-white">Planos simples para seu controle total</h2>
            <p className="text-[#9CAE9F] text-sm leading-relaxed">
              Experimente <strong>3 dias grátis</strong> com acesso a todas as funcionalidades. Após os 3 dias, ative o Plano Pro ou Premium via WhatsApp para continuar no controle.
            </p>

            {/* Billing Toggle (Monthly / Yearly) */}
            <div className="inline-flex items-center p-1 bg-[#101613] border border-[#1F2B23] rounded-2xl text-xs">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  billingPeriod === 'monthly' ? 'bg-[#151D18] text-white' : 'text-[#65796A] hover:text-white'
                }`}
              >
                Cobrança Mensal
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pro (Most Popular) */}
            <div className="p-8 rounded-3xl bg-[#151D18] border-2 border-[#00E676] flex flex-col justify-between space-y-6 relative shadow-2xl shadow-[#00E676]/15">
              <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#00E676] text-[#050706] text-[10px] font-black uppercase tracking-wider">
                Mais Escolhido
              </div>
              <div className="space-y-4">
                <div className="text-xs font-black text-[#00E676] uppercase tracking-wider">Plano Pro</div>
                <div className="text-4xl font-black font-mono text-white">
                  {billingPeriod === 'monthly' ? 'R$ 50,17' : 'R$ 40,14'}{' '}
                  <span className="text-xs text-[#65796A] font-normal">/mês</span>
                </div>
                <p className="text-xs text-[#9CAE9F]">Controle financeiro avançado com parcelas e assistente.</p>
                <ul className="space-y-2.5 text-xs text-white">
                  <li className="flex items-center gap-2">✓ Lançamentos e extratos ilimitados</li>
                  <li className="flex items-center gap-2">✓ Compras parceladas (cartão até 24x)</li>
                  <li className="flex items-center gap-2">✓ Gestão de assinaturas e despesas fixas</li>
                  <li className="flex items-center gap-2">✓ Simulador de compra "Posso gastar?"</li>
                  <li className="flex items-center gap-2">✓ Calendário de vencimentos e faturas</li>
                  <li className="flex items-center gap-2">✓ Relatórios avançados e exportação CSV</li>
                </ul>
              </div>
              <a
                href={formatWhatsAppLink(
                  salesPhone,
                  `Olá! Quero assinar o plano Pro do Admin Money por R$ ${
                    billingPeriod === 'monthly' ? '50,17' : '40,14'
                  }/mês. Como faço para liberar meu acesso?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
              >
                <span>Assinar Pro no WhatsApp (R$ 50,17)</span>
              </a>
            </div>

            {/* Premium */}
            <div className="p-8 rounded-3xl bg-[#101613] border border-[#1F2B23] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#00E676] uppercase tracking-wider">Premium AI</div>
                <div className="text-4xl font-black font-mono text-white">
                  {billingPeriod === 'monthly' ? 'R$ 96,90' : 'R$ 77,52'}{' '}
                  <span className="text-xs text-[#65796A] font-normal">/mês</span>
                </div>
                <p className="text-xs text-[#65796A]">Inteligência artificial completa e consultoria em dados.</p>
                <ul className="space-y-2.5 text-xs text-[#9CAE9F]">
                  <li className="flex items-center gap-2">✓ Tudo do plano Pro</li>
                  <li className="flex items-center gap-2">✓ Chat financeiro com Gemini AI</li>
                  <li className="flex items-center gap-2">✓ Regras inteligentes personalizadas</li>
                  <li className="flex items-center gap-2">✓ Detecção de cobranças duplicadas</li>
                  <li className="flex items-center gap-2">✓ Simulador de cenários ("E se eu...")</li>
                  <li className="flex items-center gap-2">✓ Suporte prioritário via WhatsApp</li>
                </ul>
              </div>
              <a
                href={formatWhatsAppLink(
                  salesPhone,
                  `Olá! Quero assinar o plano Premium do Admin Money por R$ ${
                    billingPeriod === 'monthly' ? '96,90' : '77,52'
                  }/mês. Como faço para liberar meu acesso?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#151D18] hover:bg-[#1E2822] text-[#00E676] text-xs font-black border border-[#00E676]/40 transition flex items-center justify-center gap-2"
              >
                <span>Assinar Premium no WhatsApp (R$ 96,90)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Dúvidas Frequentes</h2>
          <p className="text-xs text-[#65796A]">Respostas claras e transparentes sobre o Admin Money.</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Como o Admin Money funciona?',
              a: 'O Admin Money é uma plataforma SaaS que organiza suas receitas, despesas, contas bancárias, cartões de crédito e metas financeiras em um painel simples e inteligente.',
            },
            {
              q: 'Posso cadastrar compras parceladas?',
              a: 'Sim! Você pode cadastrar compras parceladas em até 24 vezes, acompanhando a evolução mensal (ex: 3/10) e o impacto nos meses futuros.',
            },
            {
              q: 'Como funciona o recurso "Posso gastar?"',
              a: 'Ele calcula seu saldo líquido disponível, desconta as contas agendadas e metas do mês, e mostra se uma compra desejada compromete sua margem de segurança.',
            },
            {
              q: 'Meus dados ficam seguros?',
              a: 'Sim. Seus dados são salvos de forma isolada para sua conta, com validação e sem compartilhamento com terceiros.',
            },
            {
              q: 'Posso exportar meus dados?',
              a: 'Sim, a qualquer momento você pode exportar seu histórico de movimentações em formato CSV para usar onde desejar.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#101613] border border-[#1F2B23]">
              <div className="text-sm font-semibold text-white mb-2">{item.q}</div>
              <p className="text-xs text-[#9CAE9F] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 border-t border-[#1F2B23] bg-gradient-to-b from-[#050706] to-[#0A0E0C]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Pronto para ter controle real do seu dinheiro?
          </h2>
          <p className="text-sm text-[#9CAE9F]">
            Leva menos de 1 minuto para começar. Sem burocracia.
          </p>
          <button
            onClick={onStartFree}
            className="px-8 py-4 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-sm font-black shadow-xl shadow-[#00E676]/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Criar Minha Conta Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1F2B23] text-xs text-[#65796A]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 Admin Money Micro-SaaS. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Termos de Uso</span>
            <span className="hover:text-white cursor-pointer">Privacidade</span>
            <span className="hover:text-white cursor-pointer">Segurança</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
