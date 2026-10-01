import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PieChart,
  Target,
  CalendarDays,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Repeat,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  Flame,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  onSwitchToLanding: () => void;
  onResetToZero: () => void;
  onLoadDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  onSwitchToLanding,
  onResetToZero,
  onLoadDemo,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'accounts', label: 'Contas & Cartões', icon: Wallet },
    { id: 'budgets', label: 'Meus Limites', icon: PieChart },
    { id: 'goals', label: 'Minhas Metas', icon: Target },
    { id: 'calendar', label: 'Planejamento & Agenda', icon: CalendarDays },
  ];

  const intelligenceNavItems = [
    { id: 'assistant', label: 'Converse com seu dinheiro', icon: Sparkles, badge: 'IA' },
    { id: 'can_i_afford', label: 'Posso gastar?', icon: HelpCircle },
    { id: 'worth_it', label: 'Vale a pena?', icon: TrendingDown },
    { id: 'scenarios', label: 'E se eu...', icon: Sliders },
    { id: 'subscriptions', label: 'Assinaturas', icon: Repeat },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'rules', label: 'Regras Inteligentes', icon: ShieldAlert },
  ];

  const toolNavItems = [
    { id: 'csv', label: 'Importar / Exportar', icon: FileSpreadsheet },
    { id: 'pricing', label: 'Planos & Upgrade', icon: Flame },
    { id: 'help', label: 'Ajuda & Suporte', icon: HelpCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#050706] border-r border-[#1F2B23] select-none flex-shrink-0">
      {/* Brand Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[#1F2B23]">
        <Logo size="md" />
      </div>

      {/* Navigation Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Main Section */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#65796A] px-3">
            Principal
          </span>
          <nav className="mt-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#151D18] text-white border border-[#00E676]/30 shadow-sm shadow-black/40'
                      : 'text-[#9CAE9F] hover:text-white hover:bg-[#101613]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#00E676]' : 'text-[#65796A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Section */}
        <div>
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#65796A]">
              Inteligência Financeira
            </span>
          </div>
          <nav className="mt-2 space-y-1">
            {intelligenceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#151D18] text-white border border-[#00E676]/30 shadow-sm shadow-black/40'
                      : 'text-[#9CAE9F] hover:text-white hover:bg-[#101613]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-[#00E676]' : 'text-[#65796A]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tools Section */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#65796A] px-3">
            Ferramentas
          </span>
          <nav className="mt-2 space-y-1">
            {toolNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#151D18] text-white border border-[#00E676]/30 shadow-sm shadow-black/40'
                      : 'text-[#9CAE9F] hover:text-white hover:bg-[#101613]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#00E676]' : 'text-[#65796A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Presentation Controls: Demo & Zerar */}
        <div className="pt-2 border-t border-[#1F2B23]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#65796A] px-3 block mb-2">
            Demonstração & Vendas
          </span>
          <div className="space-y-1.5">
            <button
              onClick={onLoadDemo}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#00E676] bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/25 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carregar Demo (Vendas)</span>
            </button>
            <button
              onClick={onResetToZero}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#9CAE9F] hover:text-white hover:bg-[#151D18] border border-[#1F2B23] transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF5252]" />
              <span>Zerar Tudo (Limpo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Card & Footer */}
      <div className="p-4 border-t border-[#1F2B23] bg-[#0A0E0C]">
        <div className="p-3 rounded-2xl bg-[#101613] border border-[#1F2B23] mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-white font-bold">Plano {user.plan.toUpperCase()}</span>
            <span className="text-[10px] text-[#00E676] font-mono font-bold">Ativo</span>
          </div>
          <p className="text-[11px] text-[#65796A]">
            Acesso ilimitado à inteligência financeira.
          </p>
        </div>

        <button
          onClick={onSwitchToLanding}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#9CAE9F] hover:text-white hover:bg-[#151D18] rounded-xl transition"
        >
          <Globe className="w-3.5 h-3.5 text-[#00E676]" />
          <span>Ver Landing Page</span>
        </button>
      </div>
    </aside>
  );
};
