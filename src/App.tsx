/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  UserProfile,
  Transaction,
  Account,
  CreditCard,
  Budget,
  Goal,
  RecurringTransaction,
  Subscription,
  SmartRule,
  NotificationItem,
  SupportTicket,
  TransactionType,
} from './types';
import { StorageService } from './lib/storage';

// Navigation Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { AddTransactionModal } from './components/common/AddTransactionModal';
import { QuickEntryModal } from './components/common/QuickEntryModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { AccountsView } from './components/accounts/AccountsView';
import { BudgetsView } from './components/budgets/BudgetsView';
import { GoalsView } from './components/goals/GoalsView';
import { CalendarView } from './components/calendar/CalendarView';
import { AssistantView } from './components/assistant/AssistantView';
import { CanIAffordView } from './components/tools/CanIAffordView';
import { WorthItView } from './components/tools/WorthItView';
import { ScenarioSimulatorView } from './components/tools/ScenarioSimulatorView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { RulesView } from './components/rules/RulesView';
import { ReportsView } from './components/reports/ReportsView';
import { CsvImportExportView } from './components/csv/CsvImportExportView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpCenterView } from './components/help/HelpCenterView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { PricingView } from './components/pricing/PricingView';
import { TrialExpiredPaywallModal } from './components/common/TrialExpiredPaywallModal';
import { getTrialStatus } from './lib/trial';
import { normalizeWhatsAppNumber } from './lib/whatsapp';

export default function App() {
  // State Initialization from Persistent Storage
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());
  const [accounts, setAccounts] = useState<Account[]>(() => StorageService.getAccounts());
  const [cards, setCards] = useState<CreditCard[]>(() => StorageService.getCards());
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    StorageService.getTransactions()
  );
  const [budgets, setBudgets] = useState<Budget[]>(() => StorageService.getBudgets());
  const [goals, setGoals] = useState<Goal[]>(() => StorageService.getGoals());
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(() =>
    StorageService.getRecurring()
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    StorageService.getSubscriptions()
  );
  const [rules, setRules] = useState<SmartRule[]>(() => StorageService.getRules());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets());

  // App Navigation & Modal States
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [toastMsg, setToastMsg] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // 3-Day Trial Status
  const trialStatus = getTrialStatus(user);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('expense');
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [assistantInitialQuestion, setAssistantInitialQuestion] = useState<string | undefined>();

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Transactions
  const handleSaveTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update account balances
    const updatedAccounts = accounts.map((acc) => {
      if (txData.type === 'expense' && acc.id === txData.accountId) {
        return { ...acc, balance: acc.balance - txData.amount };
      }
      if (txData.type === 'income' && acc.id === txData.accountId) {
        return { ...acc, balance: acc.balance + txData.amount };
      }
      if (txData.type === 'transfer') {
        if (acc.id === txData.accountId) {
          return { ...acc, balance: acc.balance - txData.amount };
        }
        if (acc.id === txData.destinationAccountId) {
          return { ...acc, balance: acc.balance + txData.amount };
        }
      }
      return acc;
    });

    const updatedTransactions = [newTx, ...transactions];

    setTransactions(updatedTransactions);
    setAccounts(updatedAccounts);
    StorageService.saveTransactions(updatedTransactions);
    StorageService.saveAccounts(updatedAccounts);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  // Handlers for Accounts & Cards
  const handleAddAccount = (accData: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...accData,
      id: `acc_${Date.now()}`,
    };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    StorageService.saveAccounts(updated);
  };

  const handleAddCard = (cardData: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...cardData,
      id: `card_${Date.now()}`,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    StorageService.saveCards(updated);
  };

  const handleTransfer = (fromId: string, toId: string, amount: number) => {
    const fromAcc = accounts.find((a) => a.id === fromId);
    const toAcc = accounts.find((a) => a.id === toId);
    if (!fromAcc || !toAcc) return;

    handleSaveTransaction({
      description: `Transferência: ${fromAcc.name} → ${toAcc.name}`,
      amount,
      type: 'transfer',
      category: 'Transferência',
      accountId: fromId,
      destinationAccountId: toId,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });
  };

  // Handlers for Budgets
  const handleAddBudget = (bData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...bData,
      id: `bg_${Date.now()}`,
    };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    StorageService.saveBudgets(updated);
  };

  const handleDeleteBudget = (id: string) => {
    const updated = budgets.filter((b) => b.id !== id);
    setBudgets(updated);
    StorageService.saveBudgets(updated);
  };

  // Handlers for Goals
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'contributions'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      contributions: [],
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    StorageService.saveGoals(updated);
  };

  const handleAddGoalContribution = (goalId: string, amount: number, note?: string) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
          contributions: [
            ...g.contributions,
            {
              id: `c_${Date.now()}`,
              amount,
              date: new Date().toISOString().split('T')[0],
              note,
            },
          ],
        };
      }
      return g;
    });

    setGoals(updated);
    StorageService.saveGoals(updated);
  };

  // Handlers for Subscriptions
  const handleAddSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub_${Date.now()}`,
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    StorageService.saveSubscriptions(updated);
  };

  const handleDeleteSubscription = (id: string) => {
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    StorageService.saveSubscriptions(updated);
  };

  const handleToggleSubscription = (id: string) => {
    const updated = subscriptions.map((s) =>
      s.id === id ? { ...s, status: s.status === 'active' ? ('cancelled' as const) : ('active' as const) } : s
    );
    setSubscriptions(updated);
    StorageService.saveSubscriptions(updated);
  };

  // Handlers for Rules
  const handleAddRule = (rData: Omit<SmartRule, 'id'>) => {
    const newRule: SmartRule = {
      ...rData,
      id: `rule_${Date.now()}`,
    };
    const updated = [...rules, newRule];
    setRules(updated);
    StorageService.saveRules(updated);
  };

  const handleDeleteRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    StorageService.saveRules(updated);
  };

  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    setRules(updated);
    StorageService.saveRules(updated);
  };

  // Handlers for CSV Import
  const handleImportTransactions = (imported: Omit<Transaction, 'id' | 'createdAt'>[]) => {
    const withIds: Transaction[] = imported.map((item, idx) => ({
      ...item,
      id: `tx_imp_${Date.now()}_${idx}`,
      createdAt: new Date().toISOString(),
    }));

    const updated = [...withIds, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  // Handlers for Support Tickets
  const handleAddTicket = (tData: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...tData,
      id: `tkt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    StorageService.saveTickets(updated);
  };

  // Handlers for User / Reset
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    StorageService.saveUser(updated);
  };

  // ZERAR TUDO (Clean Slate) - Abre Modal de Confirmação Seguro
  const handleResetToZero = () => {
    setShowResetModal(true);
  };

  const executeResetToZero = () => {
    StorageService.clearAllToZero();
    setUser(StorageService.getUser());
    setAccounts(StorageService.getAccounts());
    setCards([]);
    setTransactions([]);
    setBudgets(StorageService.getBudgets());
    setGoals([]);
    setRecurring([]);
    setSubscriptions([]);
    setRules(StorageService.getRules());
    setNotifications(StorageService.getNotifications());
    setTickets([]);
    setCurrentView('dashboard');
    setShowResetModal(false);
    setToastMsg('Painel zerado com sucesso! Saldo R$ 0,00.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  // CARREGAR DADOS DE DEMONSTRAÇÃO (Demo para Vendas)
  const handleLoadDemo = () => {
    StorageService.loadDemoData();
    setUser(StorageService.getUser());
    setAccounts(StorageService.getAccounts());
    setCards(StorageService.getCards());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setGoals(StorageService.getGoals());
    setRecurring(StorageService.getRecurring());
    setSubscriptions(StorageService.getSubscriptions());
    setRules(StorageService.getRules());
    setNotifications(StorageService.getNotifications());
    setTickets(StorageService.getTickets());
    setCurrentView('dashboard');
    setToastMsg('Dados de demonstração carregados com sucesso!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleLogout = () => {
    setIsLandingPage(true);
  };

  const handleStartFree = () => {
    setAuthInitialMode('register');
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    setAuthInitialMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile, isNewUser: boolean) => {
    setUser(authenticatedUser);
    StorageService.saveUser(authenticatedUser);
    setIsLandingPage(false);

    if (!isNewUser) {
      setCurrentView('dashboard');
    }
  };

  // If user is viewing Landing Page
  if (isLandingPage) {
    return (
      <>
        <LandingPage
          onStartFree={handleStartFree}
          onLogin={handleLoginClick}
          onExploreDemo={() => setIsLandingPage(false)}
          salesPhone={normalizeWhatsAppNumber(user.whatsappSalesNumber)}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authInitialMode}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // If user needs onboarding
  if (!user.onboardingCompleted) {
    return (
      <OnboardingFlow
        user={user}
        onComplete={(updated) => {
          handleUpdateUser(updated);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#050706] text-white overflow-hidden selection:bg-[#00E676]/30">
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onSwitchToLanding={() => setIsLandingPage(true)}
        onResetToZero={handleResetToZero}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          user={user}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onOpenAddModal={(t) => {
            setAddModalType(t || 'expense');
            setShowAddModal(true);
          }}
          onOpenQuickEntry={() => setShowQuickEntry(true)}
          onSearchClick={() => setShowSearchModal(true)}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          notifications={notifications}
          onNotificationsChange={setNotifications}
          onResetToZero={handleResetToZero}
          onLoadDemo={handleLoadDemo}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              selectedMonth={selectedMonth}
              transactions={transactions}
              accounts={accounts}
              cards={cards}
              budgets={budgets}
              goals={goals}
              recurring={recurring}
              onNavigate={setCurrentView}
              onOpenAddModal={(t) => {
                setAddModalType(t || 'expense');
                setShowAddModal(true);
              }}
              onOpenQuickEntry={() => setShowQuickEntry(true)}
              onSelectAskQuestion={(q) => {
                setAssistantInitialQuestion(q);
                setCurrentView('assistant');
              }}
              onLoadDemo={handleLoadDemo}
              onResetToZero={handleResetToZero}
            />
          )}

          {currentView === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              accounts={accounts}
              selectedMonth={selectedMonth}
              onAddTransaction={(t) => {
                setAddModalType(t || 'expense');
                setShowAddModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {currentView === 'accounts' && (
            <AccountsView
              accounts={accounts}
              cards={cards}
              onAddAccount={handleAddAccount}
              onAddCard={handleAddCard}
              onTransfer={handleTransfer}
            />
          )}

          {currentView === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              transactions={transactions}
              selectedMonth={selectedMonth}
              onAddBudget={handleAddBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {currentView === 'goals' && (
            <GoalsView
              goals={goals}
              onAddGoal={handleAddGoal}
              onAddContribution={handleAddGoalContribution}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              transactions={transactions}
              recurring={recurring}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              onOpenAddModal={() => {
                setAddModalType('expense');
                setShowAddModal(true);
              }}
            />
          )}

          {currentView === 'assistant' && (
            <AssistantView
              initialQuestion={assistantInitialQuestion}
              transactions={transactions}
              accounts={accounts}
              budgets={budgets}
              goals={goals}
              recurring={recurring}
              selectedMonth={selectedMonth}
            />
          )}

          {currentView === 'can_i_afford' && (
            <CanIAffordView
              accounts={accounts}
              transactions={transactions}
              user={user}
            />
          )}

          {currentView === 'worth_it' && <WorthItView user={user} />}

          {currentView === 'scenarios' && (
            <ScenarioSimulatorView
              transactions={transactions}
              selectedMonth={selectedMonth}
            />
          )}

          {currentView === 'subscriptions' && (
            <SubscriptionsView
              subscriptions={subscriptions}
              onAddSubscription={handleAddSubscription}
              onDeleteSubscription={handleDeleteSubscription}
              onToggleStatus={handleToggleSubscription}
            />
          )}

          {currentView === 'rules' && (
            <RulesView
              rules={rules}
              transactions={transactions}
              accounts={accounts}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
              onToggleRule={handleToggleRule}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              selectedMonth={selectedMonth}
            />
          )}

          {currentView === 'csv' && (
            <CsvImportExportView
              transactions={transactions}
              accounts={accounts}
              onImportTransactions={handleImportTransactions}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={handleUpdateUser}
              onResetDemo={handleLoadDemo}
              onDeleteAccount={handleResetToZero}
            />
          )}

          {currentView === 'help' && (
            <HelpCenterView
              user={user}
              tickets={tickets}
              onSubmitTicket={handleAddTicket}
            />
          )}

          {currentView === 'pricing' && (
            <PricingView
              user={user}
              onSelectPlan={(plan) => handleUpdateUser({ ...user, plan, isSubscriptionActive: true })}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {currentView === 'admin' && <AdminPanelView tickets={tickets} />}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          onOpenAddModal={(t) => {
            setAddModalType(t);
            setShowAddModal(true);
          }}
          onOpenQuickEntry={() => setShowQuickEntry(true)}
        />
      </div>

      {/* Global Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveTransaction}
        accounts={accounts}
        initialType={addModalType}
      />

      <QuickEntryModal
        isOpen={showQuickEntry}
        onClose={() => setShowQuickEntry(false)}
        onSave={handleSaveTransaction}
        accounts={accounts}
      />

      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        transactions={transactions}
        accounts={accounts}
        goals={goals}
        budgets={budgets}
        onNavigate={setCurrentView}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authInitialMode}
        onSuccess={handleAuthSuccess}
      />

      {/* In-app Zerar Tudo Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#101613] border border-[#FF5252]/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-[#FF5252]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5252]/10 flex items-center justify-center text-[#FF5252]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Zerar Dados do Painel?</h3>
                <p className="text-[11px] text-[#65796A]">Comece do zero com saldo limpo</p>
              </div>
            </div>

            <p className="text-xs text-[#9CAE9F] leading-relaxed">
              Esta ação irá remover todas as movimentações de teste, contas secundárias e cartões, deixando o seu painel 100% limpo com <strong>R$ 0,00</strong> para você ou seu cliente utilizar no mundo real.
            </p>

            <div className="p-3 rounded-xl bg-[#151D18] border border-[#1F2B23] text-[11px] text-[#9CAE9F]">
              💡 Você poderá recarregar os dados de demonstração a qualquer momento clicando em <strong>Demo Vendas</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-[#9CAE9F] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeResetToZero}
                className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition"
              >
                Sim, Zerar Tudo Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#00E676] text-[#050706] font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 3-Day Trial Expiration Paywall Modal (Blocks all usage when trial ends) */}
      {trialStatus.isExpired && (
        <TrialExpiredPaywallModal
          user={user}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
