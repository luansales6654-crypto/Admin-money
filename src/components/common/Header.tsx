import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  Zap,
  User,
  LogOut,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../../types';
import { StorageService } from '../../lib/storage';
import { getTrialStatus } from '../../lib/trial';

interface HeaderProps {
  user: UserProfile;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  onOpenAddModal: (type?: 'income' | 'expense' | 'transfer') => void;
  onOpenQuickEntry: () => void;
  onSearchClick: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onNotificationsChange: (notes: NotificationItem[]) => void;
  onResetToZero: () => void;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  selectedMonth,
  onMonthChange,
  onOpenAddModal,
  onOpenQuickEntry,
  onSearchClick,
  onNavigate,
  onLogout,
  notifications,
  onNotificationsChange,
  onResetToZero,
  onLoadDemo,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatMonthDisplay = (ym: string) => {
    const [year, month] = ym.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prev = new Date(year, month - 2, 1);
    const newYm = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newYm);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month, 1);
    const newYm = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newYm);
  };

  const currentYm = new Date().toISOString().slice(0, 7);
  const trialInfo = getTrialStatus(user);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    onNotificationsChange(updated);
    StorageService.saveNotifications(updated);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#050706]/95 backdrop-blur-md border-b border-[#1F2B23]">
      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#101613] border border-[#1F2B23] rounded-xl px-2 py-1 shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-[#151D18] text-[#9CAE9F] hover:text-white transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            className="flex items-center gap-2 px-2.5 py-0.5 text-xs font-semibold text-white cursor-pointer"
            onClick={() => onMonthChange(currentYm)}
          >
            <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
            <span>{formatMonthDisplay(selectedMonth)}</span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-[#151D18] text-[#9CAE9F] hover:text-white transition-colors"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {selectedMonth !== currentYm && (
          <button
            onClick={() => onMonthChange(currentYm)}
            className="hidden sm:inline-flex text-[11px] px-2.5 py-1 rounded-lg bg-[#151D18] border border-[#1F2B23] text-[#9CAE9F] hover:text-white hover:border-[#00E676]/40 transition font-medium"
          >
            Hoje
          </button>
        )}

        {/* 3-day Trial Indicator */}
        {!trialInfo.isPaid && (
          <button
            onClick={() => onNavigate('pricing')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              trialInfo.isExpired
                ? 'bg-[#FF5252]/15 border-[#FF5252]/40 text-[#FF5252]'
                : 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676] hover:bg-[#00E676]/20'
            }`}
            title="Clique para assinar e manter acesso ilimitado"
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{trialInfo.formattedRemaining}</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Demo & Zerar Tools (Great for sales presentations) */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#101613] border border-[#1F2B23] rounded-xl text-xs">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#151D18] text-[#00E676] font-semibold transition"
            title="Carregar dados realistas para demonstração a clientes"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Demo Vendas</span>
          </button>
          <span className="text-[#1F2B23]">|</span>
          <button
            onClick={onResetToZero}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#151D18] text-[#9CAE9F] hover:text-[#FF5252] font-semibold transition"
            title="Zerar todas as movimentações e começar limpo com R$ 0,00"
          >
            <RotateCcw className="w-3 h-3 text-[#FF5252]" />
            <span>Zerar Tudo</span>
          </button>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] text-[#9CAE9F] hover:text-white text-xs transition"
          title="Buscar movimentação (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-[#00E676]" />
          <span className="hidden md:inline">Buscar...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-[#151D18] border border-[#1F2B23] rounded text-[#65796A] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Fast Quick Entry Button */}
        <button
          onClick={onOpenQuickEntry}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] text-xs font-semibold text-[#00E676] hover:border-[#00E676]/40 transition"
          title="Entrada rápida por texto (Ex: Almoço 35)"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Texto rápido</span>
        </button>

        {/* Primary Add Transaction Button (Vibrant Money Green) */}
        <button
          onClick={() => onOpenAddModal('expense')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-extrabold shadow-lg shadow-[#00E676]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] text-[#9CAE9F] hover:text-white transition"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00E676] text-[#050706] text-[10px] font-extrabold flex items-center justify-center border-2 border-[#050706]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#101613] border border-[#1F2B23] shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2B23]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] font-semibold">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#9CAE9F] hover:text-[#00E676] flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Lidas
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-[#151D18] text-[#65796A] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-[#1F2B23]/50 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-[#65796A] py-8">Nenhuma notificação por aqui.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`py-3 px-2 rounded-xl transition ${
                        item.read ? 'opacity-70' : 'bg-[#151D18]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-white">{item.title}</span>
                        <span className="text-[10px] text-[#65796A]">
                          {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CAE9F] mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#101613] hover:bg-[#151D18] border border-[#1F2B23] transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00E676] to-[#00B359] flex items-center justify-center text-[#050706] text-xs font-black">
              {user.name.charAt(0)}
            </div>
            <span className="hidden md:inline text-xs font-medium text-white max-w-[90px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101613] border border-[#1F2B23] shadow-2xl z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-[#1F2B23]">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-[#65796A] truncate">{user.email}</p>
                <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  trialInfo.isPaid
                    ? 'bg-[#00E676]/10 text-[#00E676]'
                    : trialInfo.isExpired
                    ? 'bg-[#FF5252]/15 text-[#FF5252]'
                    : 'bg-[#00E676]/15 text-[#00E676]'
                }`}>
                  <span>{trialInfo.isPaid ? `PLANO ${user.plan.toUpperCase()}` : trialInfo.formattedRemaining.toUpperCase()}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9CAE9F] hover:text-white hover:bg-[#151D18] transition text-left"
                >
                  <User className="w-4 h-4 text-[#00E676]" />
                  <span>Configurações & Perfil</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('pricing');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9CAE9F] hover:text-white hover:bg-[#151D18] transition text-left"
                >
                  <Sparkles className="w-4 h-4 text-[#00E676]" />
                  <span>Gerenciar Assinatura</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLoadDemo();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#00E676] hover:bg-[#151D18] transition text-left font-medium"
                >
                  <Sparkles className="w-4 h-4 text-[#00E676]" />
                  <span>Carregar Demo (Vendas)</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onResetToZero();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#FF5252] hover:bg-[#FF5252]/10 transition text-left font-medium"
                >
                  <RotateCcw className="w-4 h-4 text-[#FF5252]" />
                  <span>Zerar Tudo (R$ 0,00)</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#1F2B23]">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#FF5252] hover:bg-[#FF5252]/10 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
