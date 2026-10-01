import React, { useState } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  CalendarDays,
  Menu,
  TrendingUp,
  TrendingDown,
  Repeat,
  Zap,
  X,
  Target,
  PieChart,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAddModal: (type: 'income' | 'expense' | 'transfer') => void;
  onOpenQuickEntry: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenAddModal,
  onOpenQuickEntry,
}) => {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* Floating Action Menu Modal / Sheet */}
      {showFabMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#101613] border border-[#1F2B23] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <span className="text-sm font-semibold text-white">Nova Movimentação</span>
              <button
                onClick={() => setShowFabMenu(false)}
                className="p-1 rounded-full text-[#65796A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setShowFabMenu(false);
                  onOpenAddModal('expense');
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] text-left transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FF5252]/10 text-[#FF5252] flex items-center justify-center">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Nova Despesa</div>
                  <div className="text-[10px] text-[#65796A]">Gasto do dia a dia</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowFabMenu(false);
                  onOpenAddModal('income');
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] text-left transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Nova Receita</div>
                  <div className="text-[10px] text-[#65796A]">Salário, freela, etc.</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowFabMenu(false);
                  onOpenAddModal('transfer');
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#151D18] hover:bg-[#1E2822] border border-[#1F2B23] text-left transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Transferência</div>
                  <div className="text-[10px] text-[#65796A]">Entre contas próprias</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowFabMenu(false);
                  onOpenQuickEntry();
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-left transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Texto Rápido</div>
                  <div className="text-[10px] text-[#9CAE9F]">Ex: "Almoço 35"</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile "More" Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#101613] border border-[#1F2B23] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2B23]">
              <span className="text-sm font-semibold text-white">Mais Opções</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full text-[#65796A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('assistant');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <Sparkles className="w-4 h-4 text-[#00E676]" />
                <span>Chat IA</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('budgets');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <PieChart className="w-4 h-4 text-[#00E676]" />
                <span>Limites</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('goals');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <Target className="w-4 h-4 text-[#00E676]" />
                <span>Metas</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('can_i_afford');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <HelpCircle className="w-4 h-4 text-[#FFB300]" />
                <span>Posso Gastar?</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('subscriptions');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <Repeat className="w-4 h-4 text-[#9CAE9F]" />
                <span>Assinaturas</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('settings');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#151D18] text-white"
              >
                <Settings className="w-4 h-4 text-[#65796A]" />
                <span>Configurações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E0C]/95 backdrop-blur-md border-t border-[#1F2B23] px-2 py-2">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Home */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              currentView === 'dashboard' ? 'text-[#00E676]' : 'text-[#65796A] hover:text-[#9CAE9F]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Movements */}
          <button
            onClick={() => onNavigate('transactions')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              currentView === 'transactions' ? 'text-[#00E676]' : 'text-[#65796A] hover:text-[#9CAE9F]'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-medium">Movimentos</span>
          </button>

          {/* Center Floating Plus Button with Money Green Surge */}
          <button
            onClick={() => setShowFabMenu(true)}
            className="relative -top-4 w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E676] to-[#00B359] text-[#050706] flex items-center justify-center shadow-lg shadow-[#00E676]/30 active:scale-95 transition"
            aria-label="Adicionar movimentação"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Planning */}
          <button
            onClick={() => onNavigate('calendar')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              currentView === 'calendar' ? 'text-[#00E676]' : 'text-[#65796A] hover:text-[#9CAE9F]'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[10px] font-medium">Planejar</span>
          </button>

          {/* More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              showMoreMenu ? 'text-[#00E676]' : 'text-[#65796A] hover:text-[#9CAE9F]'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
};
