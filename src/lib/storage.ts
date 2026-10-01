import {
  Account,
  CreditCard,
  Transaction,
  Budget,
  Goal,
  RecurringTransaction,
  Subscription,
  SmartRule,
  NotificationItem,
  UserProfile,
  SupportTicket,
  ChatMessage,
} from '../types';

const STORAGE_KEYS = {
  USER: 'admin_money_user_v3',
  ACCOUNTS: 'admin_money_accounts_v3',
  CARDS: 'admin_money_cards_v3',
  TRANSACTIONS: 'admin_money_transactions_v3',
  BUDGETS: 'admin_money_budgets_v3',
  GOALS: 'admin_money_goals_v3',
  RECURRING: 'admin_money_recurring_v3',
  SUBSCRIPTIONS: 'admin_money_subscriptions_v3',
  RULES: 'admin_money_rules_v3',
  NOTIFICATIONS: 'admin_money_notifications_v3',
  TICKETS: 'admin_money_tickets_v3',
  CHAT: 'admin_money_chat_v3',
};

// CLEAN ZEROED STATE (Ready for real production / customer usage)
const now = new Date();
const CLEAN_USER: UserProfile = {
  id: 'usr_owner_01',
  name: 'Luan Sales',
  email: 'luansales6654@gmail.com',
  currency: 'BRL',
  avatarUrl: '',
  plan: 'trial',
  trialStartedAt: now.toISOString(),
  trialExpiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  isSubscriptionActive: false,
  organizationScore: 50,
  monthlyIncomeTarget: 0,
  whatsappSalesNumber: '5521996589629',
  onboardingCompleted: true,
  createdAt: now.toISOString(),
  preferences: {
    notifyBudgetAlerts: true,
    notifyDueDates: true,
    notifyWeeklySummary: true,
    theme: 'dark',
  },
};

const CLEAN_ACCOUNTS: Account[] = [
  {
    id: 'acc_main_01',
    name: 'Conta Principal',
    type: 'checking',
    balance: 0.00,
    initialBalance: 0.00,
    color: '#00E676',
    icon: 'Wallet',
    institution: 'Banco Principal',
  },
];

const CLEAN_CARDS: CreditCard[] = [];
const CLEAN_TRANSACTIONS: Transaction[] = [];
const CLEAN_BUDGETS: Budget[] = [
  {
    id: 'bg_01',
    category: 'Alimentação',
    limitAmount: 800.00,
    period: new Date().toISOString().slice(0, 7),
    alertThreshold: 80,
  },
  {
    id: 'bg_02',
    category: 'Moradia',
    limitAmount: 1500.00,
    period: new Date().toISOString().slice(0, 7),
    alertThreshold: 85,
  },
  {
    id: 'bg_03',
    category: 'Transporte',
    limitAmount: 400.00,
    period: new Date().toISOString().slice(0, 7),
    alertThreshold: 80,
  },
];
const CLEAN_GOALS: Goal[] = [];
const CLEAN_RECURRING: RecurringTransaction[] = [];
const CLEAN_SUBSCRIPTIONS: Subscription[] = [];
const CLEAN_RULES: SmartRule[] = [
  {
    id: 'rule_01',
    name: 'Alerta de gasto alto (> R$ 200)',
    conditionType: 'single_transaction',
    thresholdAmount: 200.00,
    active: true,
  },
  {
    id: 'rule_02',
    name: 'Alerta de saldo mínimo de segurança',
    conditionType: 'balance_below',
    thresholdAmount: 500.00,
    active: true,
  },
];
const CLEAN_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_welcome',
    title: 'Bem-vindo ao Admin Money!',
    message: 'Seu painel está pronto para uso. Comece adicionando suas movimentações e contas.',
    type: 'success',
    date: new Date().toISOString(),
    read: false,
  },
];
const CLEAN_TICKETS: SupportTicket[] = [];
const CLEAN_CHAT: ChatMessage[] = [
  {
    id: 'chat_welcome',
    sender: 'assistant',
    text: 'Olá! Sou o assistente financeiro do Admin Money. Estou pronto para analisar seus gastos, contas e metas assim que você adicionar suas movimentações!',
    timestamp: new Date().toISOString(),
  },
];

// DEMO DATASET (Available anytime via "Carregar Dados de Demonstração" button)
const DEMO_ACCOUNTS: Account[] = [
  {
    id: 'acc_nubank',
    name: 'Nubank Conta Principal',
    type: 'checking',
    balance: 5420.50,
    initialBalance: 3200.00,
    color: '#00E676',
    icon: 'Wallet',
    institution: 'Nubank',
  },
  {
    id: 'acc_inter',
    name: 'Inter Reserva de Emergência',
    type: 'savings',
    balance: 15800.00,
    initialBalance: 12000.00,
    color: '#00B359',
    icon: 'ShieldCheck',
    institution: 'Banco Inter',
  },
  {
    id: 'acc_carteira',
    name: 'Carteira Física',
    type: 'cash',
    balance: 350.00,
    initialBalance: 350.00,
    color: '#69F0AE',
    icon: 'Banknote',
  },
];

const DEMO_CARDS: CreditCard[] = [
  {
    id: 'card_nubank',
    name: 'Cartão Black Ultravioleta',
    creditLimit: 12000,
    availableLimit: 9150,
    currentUsage: 2850,
    closingDay: 18,
    dueDay: 25,
    color: '#00E676',
    brand: 'Mastercard Black',
  },
];

const currentYearMonth = new Date().toISOString().slice(0, 7);

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_demo_01',
    description: 'Salário Mensal Tech',
    amount: 8200.00,
    type: 'income',
    category: 'Salário',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-05`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_02',
    description: 'Freelance Consultoria Web',
    amount: 1650.00,
    type: 'income',
    category: 'Freelance',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-12`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_03',
    description: 'Aluguel do Apartamento',
    amount: 1950.00,
    type: 'expense',
    category: 'Moradia',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-08`,
    isRecurring: true,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_04',
    description: 'Supermercado Mensal',
    amount: 540.20,
    type: 'expense',
    category: 'Alimentação',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-10`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_05',
    description: 'iFood & Restaurantes',
    amount: 142.50,
    type: 'expense',
    category: 'Alimentação',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-14`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_06',
    description: 'Internet Fibra 600Mb',
    amount: 129.90,
    type: 'expense',
    category: 'Serviços',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-11`,
    isRecurring: true,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_07',
    description: 'Posto de Combustível',
    amount: 220.00,
    type: 'expense',
    category: 'Transporte',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-15`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_demo_08',
    description: 'Notebook Dell M3 (Parcela 3/10)',
    amount: 329.00,
    type: 'expense',
    category: 'Eletrônicos',
    accountId: 'acc_nubank',
    date: `${currentYearMonth}-18`,
    installments: {
      current: 3,
      total: 10,
      installmentId: 'inst_dell',
    },
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

const DEMO_GOALS: Goal[] = [
  {
    id: 'goal_reserva',
    name: 'Reserva de Emergência (6 Meses)',
    targetAmount: 30000,
    currentAmount: 15800,
    deadline: '2027-06-30',
    priority: 'high',
    monthlyContribution: 1000,
    category: 'Segurança',
    color: '#00E676',
    icon: 'Shield',
    contributions: [
      { id: 'c1', amount: 1000, date: `${currentYearMonth}-06`, note: 'Aporte regular' },
    ],
  },
];

const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_netflix',
    name: 'Netflix Premium 4K',
    monthlyCost: 55.90,
    billingDay: 20,
    category: 'Streaming',
    status: 'active',
    detectedAutomatically: true,
  },
  {
    id: 'sub_spotify',
    name: 'Spotify Family',
    monthlyCost: 34.90,
    billingDay: 14,
    category: 'Música',
    status: 'active',
    detectedAutomatically: true,
  },
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set failed', e);
  }
}

export const StorageService = {
  getUser: (): UserProfile => {
    const user = getFromStorage(STORAGE_KEYS.USER, CLEAN_USER);
    // Auto-migrate old stored placeholder phone number to 5521996589629
    if (
      !user.whatsappSalesNumber ||
      user.whatsappSalesNumber.includes('11999999999') ||
      user.whatsappSalesNumber.includes('5511999999999')
    ) {
      user.whatsappSalesNumber = '5521996589629';
      setToStorage(STORAGE_KEYS.USER, user);
    }
    return user;
  },
  saveUser: (user: UserProfile) => setToStorage(STORAGE_KEYS.USER, user),

  getAccounts: (): Account[] => getFromStorage(STORAGE_KEYS.ACCOUNTS, CLEAN_ACCOUNTS),
  saveAccounts: (accounts: Account[]) => setToStorage(STORAGE_KEYS.ACCOUNTS, accounts),

  getCards: (): CreditCard[] => getFromStorage(STORAGE_KEYS.CARDS, CLEAN_CARDS),
  saveCards: (cards: CreditCard[]) => setToStorage(STORAGE_KEYS.CARDS, cards),

  getTransactions: (): Transaction[] => getFromStorage(STORAGE_KEYS.TRANSACTIONS, CLEAN_TRANSACTIONS),
  saveTransactions: (txs: Transaction[]) => setToStorage(STORAGE_KEYS.TRANSACTIONS, txs),

  getBudgets: (): Budget[] => getFromStorage(STORAGE_KEYS.BUDGETS, CLEAN_BUDGETS),
  saveBudgets: (budgets: Budget[]) => setToStorage(STORAGE_KEYS.BUDGETS, budgets),

  getGoals: (): Goal[] => getFromStorage(STORAGE_KEYS.GOALS, CLEAN_GOALS),
  saveGoals: (goals: Goal[]) => setToStorage(STORAGE_KEYS.GOALS, goals),

  getRecurring: (): RecurringTransaction[] => getFromStorage(STORAGE_KEYS.RECURRING, CLEAN_RECURRING),
  saveRecurring: (rec: RecurringTransaction[]) => setToStorage(STORAGE_KEYS.RECURRING, rec),

  getSubscriptions: (): Subscription[] => getFromStorage(STORAGE_KEYS.SUBSCRIPTIONS, CLEAN_SUBSCRIPTIONS),
  saveSubscriptions: (subs: Subscription[]) => setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs),

  getRules: (): SmartRule[] => getFromStorage(STORAGE_KEYS.RULES, CLEAN_RULES),
  saveRules: (rules: SmartRule[]) => setToStorage(STORAGE_KEYS.RULES, rules),

  getNotifications: (): NotificationItem[] => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, CLEAN_NOTIFICATIONS),
  saveNotifications: (notes: NotificationItem[]) => setToStorage(STORAGE_KEYS.NOTIFICATIONS, notes),

  getTickets: (): SupportTicket[] => getFromStorage(STORAGE_KEYS.TICKETS, CLEAN_TICKETS),
  saveTickets: (tickets: SupportTicket[]) => setToStorage(STORAGE_KEYS.TICKETS, tickets),

  getChat: (): ChatMessage[] => getFromStorage(STORAGE_KEYS.CHAT, CLEAN_CHAT),
  saveChat: (chat: ChatMessage[]) => setToStorage(STORAGE_KEYS.CHAT, chat),

  // ZERA TUDO COMPLETAMENTE (Clean Slate)
  clearAllToZero: () => {
    setToStorage(STORAGE_KEYS.USER, CLEAN_USER);
    setToStorage(STORAGE_KEYS.ACCOUNTS, CLEAN_ACCOUNTS);
    setToStorage(STORAGE_KEYS.CARDS, []);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, []);
    setToStorage(STORAGE_KEYS.BUDGETS, CLEAN_BUDGETS);
    setToStorage(STORAGE_KEYS.GOALS, []);
    setToStorage(STORAGE_KEYS.RECURRING, []);
    setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, []);
    setToStorage(STORAGE_KEYS.RULES, CLEAN_RULES);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, CLEAN_NOTIFICATIONS);
    setToStorage(STORAGE_KEYS.TICKETS, []);
    setToStorage(STORAGE_KEYS.CHAT, CLEAN_CHAT);
  },

  // CARREGA DADOS DE DEMONSTRAÇÃO (Para vendas / pitches)
  loadDemoData: () => {
    setToStorage(STORAGE_KEYS.USER, { ...CLEAN_USER, monthlyIncomeTarget: 9850, organizationScore: 88 });
    setToStorage(STORAGE_KEYS.ACCOUNTS, DEMO_ACCOUNTS);
    setToStorage(STORAGE_KEYS.CARDS, DEMO_CARDS);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, DEMO_TRANSACTIONS);
    setToStorage(STORAGE_KEYS.BUDGETS, [
      { id: 'bg_01', category: 'Moradia', limitAmount: 2200, period: currentYearMonth, alertThreshold: 85 },
      { id: 'bg_02', category: 'Alimentação', limitAmount: 1200, period: currentYearMonth, alertThreshold: 80 },
      { id: 'bg_03', category: 'Transporte', limitAmount: 500, period: currentYearMonth, alertThreshold: 75 },
    ]);
    setToStorage(STORAGE_KEYS.GOALS, DEMO_GOALS);
    setToStorage(STORAGE_KEYS.RECURRING, [
      { id: 'r1', title: 'Aluguel Apartamento', amount: 1950, type: 'expense', category: 'Moradia', accountId: 'acc_nubank', frequency: 'monthly', nextDueDate: `${currentYearMonth}-08`, status: 'active' },
      { id: 'r2', title: 'Internet Fibra', amount: 129.90, type: 'expense', category: 'Serviços', accountId: 'acc_nubank', frequency: 'monthly', nextDueDate: `${currentYearMonth}-11`, status: 'active' },
    ]);
    setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, DEMO_SUBSCRIPTIONS);
    setToStorage(STORAGE_KEYS.RULES, CLEAN_RULES);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, [
      { id: 'n1', title: 'Meta em Andamento', message: 'Você já completou 52,6% da Reserva de Emergência!', type: 'success', date: new Date().toISOString(), read: false },
    ]);
    setToStorage(STORAGE_KEYS.CHAT, [
      { id: 'c1', sender: 'assistant', text: 'Olá! Carregamos os dados de demonstração. Você pode perguntar sobre gastos, orçamentos ou simular novas compras!', timestamp: new Date().toISOString() },
    ]);
  },
};
