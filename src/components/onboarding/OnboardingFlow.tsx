import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Wallet, Target, TrendingUp, FileSpreadsheet, Shield } from 'lucide-react';
import { Logo } from '../common/Logo';
import { UserProfile } from '../../types';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Controlar gastos']);
  const [incomeSource, setIncomeSource] = useState('Salário');
  const [trackingPreference, setTrackingPreference] = useState('Manualmente');

  const goalsOptions = [
    'Controlar gastos',
    'Guardar mais dinheiro',
    'Organizar contas do mês',
    'Quitar dívidas',
    'Criar reserva de emergência',
    'Entender para onde vai meu dinheiro',
  ];

  const incomeOptions = [
    'Salário formal (CLT/PJ fixo)',
    'Autônomo / Freelancer',
    'Empresário / Pró-labore',
    'Múltiplas fontes de renda',
    'Outras rendas',
  ];

  const trackingOptions = [
    {
      title: 'Manualmente',
      desc: 'Cadastre suas despesas e receitas pelo app no seu ritmo.',
      badge: 'Disponível agora',
    },
    {
      title: 'Importar dados (CSV)',
      desc: 'Importe extratos bancários e planilhas em poucos cliques.',
      badge: 'Disponível agora',
    },
    {
      title: 'Conectar contas (Open Finance)',
      desc: 'Em breve: sincronização automática com bancos compatíveis.',
      badge: 'Em desenvolvimento',
    },
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...user,
      onboardingCompleted: true,
      organizationScore: 50,
    };
    onComplete(updated);
  };

  return (
    <div className="min-h-screen bg-[#050706] flex items-center justify-center p-6 text-white selection:bg-[#00E676]/30">
      <div className="w-full max-w-lg bg-[#101613] border border-[#1F2B23] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative">
        {/* Header Progress */}
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-1.5 text-xs text-[#65796A] font-mono">
            <span>Passo {step} de 4</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#151D18] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00E676] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs text-[#00E676] font-semibold uppercase tracking-wider">
                Bem-vindo ao Admin Money
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Vamos organizar seu dinheiro.
              </h2>
              <p className="text-xs sm:text-sm text-[#9CAE9F] leading-relaxed">
                Olá, {user.name.split(' ')[0]}! Em menos de um minuto vamos calibrar seu painel
                para que você tenha clareza total sobre suas finanças sem complicações.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151D18] border border-[#1F2B23] space-y-3">
              <div className="flex items-center gap-3 text-xs text-white">
                <Shield className="w-4 h-4 text-[#00E676]" />
                <span>Privacidade total: seus dados pertencem a você</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white">
                <Target className="w-4 h-4 text-[#00E676]" />
                <span>Análises financeiras sem termos técnicos difíceis</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Step 2: What do you want to improve? */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs text-[#00E676] font-semibold uppercase tracking-wider">
                Seus Objetivos
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                O que você mais quer melhorar?
              </h2>
              <p className="text-xs text-[#65796A]">
                Selecione as prioridades principais para o seu momento atual.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {goalsOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium text-left transition ${
                      isSelected
                        ? 'bg-[#151D18] border-[#00E676] text-white shadow-sm'
                        : 'bg-[#151D18]/40 border-[#1F2B23] text-[#9CAE9F] hover:border-[#2E4236]'
                    }`}
                  >
                    <span>{goal}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-[#00E676] border-[#00E676] text-[#050706]'
                          : 'border-[#65796A]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl bg-[#151D18] text-[#9CAE9F] text-xs font-semibold hover:text-white"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black transition flex items-center justify-center gap-2"
              >
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Income source */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs text-[#00E676] font-semibold uppercase tracking-wider">
                Fontes de Renda
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Como você recebe seu dinheiro?
              </h2>
              <p className="text-xs text-[#65796A]">
                Isso ajuda a calcular previsões e sua taxa de economia com precisão.
              </p>
            </div>

            <div className="space-y-2">
              {incomeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIncomeSource(opt)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium text-left transition ${
                    incomeSource === opt
                      ? 'bg-[#151D18] border-[#00E676] text-white'
                      : 'bg-[#151D18]/40 border-[#1F2B23] text-[#9CAE9F] hover:border-[#2E4236]'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      incomeSource === opt
                        ? 'border-[#00E676] bg-[#00E676]'
                        : 'border-[#65796A]'
                    }`}
                  >
                    {incomeSource === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#050706]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl bg-[#151D18] text-[#9CAE9F] text-xs font-semibold hover:text-white"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black transition flex items-center justify-center gap-2"
              >
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Tracking method */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs text-[#00E676] font-semibold uppercase tracking-wider">
                Estilo de Controle
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Como prefere registrar suas movimentações?
              </h2>
              <p className="text-xs text-[#65796A]">
                Você pode alternar entre métodos a qualquer instante.
              </p>
            </div>

            <div className="space-y-2.5">
              {trackingOptions.map((opt) => (
                <div
                  key={opt.title}
                  onClick={() => setTrackingPreference(opt.title)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    trackingPreference === opt.title
                      ? 'bg-[#151D18] border-[#00E676]'
                      : 'bg-[#151D18]/40 border-[#1F2B23] hover:border-[#2E4236]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{opt.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F2B23] text-[#9CAE9F] font-mono">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#65796A]">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-2xl bg-[#151D18] text-[#9CAE9F] text-xs font-semibold hover:text-white"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3.5 rounded-2xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-[#00E676]/25"
              >
                <span>Acessar Meu Painel</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
