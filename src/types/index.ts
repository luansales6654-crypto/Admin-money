export type TransactionType = 'income' | 'expense' | 'transfer';

export type AccountType = 
  | 'checking' 
  | 'savings' 
  | 'investment' 
  | 'credit_card' 
  | 'digital_wallet' 
  | 'cash' 
  | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  initialBalance: number;
  color: string;
  icon: string;
  institution?: string;
  isCreditCard?: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  creditLimit: number;
  availableLimit: number;
  currentUsage: number;
  closingDay: number;
  dueDay: number;
  color: string;
  brand?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;
  destinationAccountId?: string; // For transfers
  date: string; // YYYY-MM-DD
  notes?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  installments?: {
    current: number;
    total: number;
    installmentId: string;
  };
  tags?: string[];
  status?: 'completed' | 'pending' | 'scheduled';
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  period: string; // YYYY-MM
  alertThreshold: number; // e.g. 80 (%)
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  monthlyContribution: number;
  category: string;
  color: string;
  icon: string;
  contributions: {
    id: string;
    amount: number;
    date: string;
    note?: string;
  }[];
}

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
  status: 'active' | 'paused' | 'cancelled';
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  billingDay: number;
  category: string;
  status: 'active' | 'cancelled' | 'trial';
  detectedAutomatically?: boolean;
  serviceUrl?: string;
  lastCharged?: string;
}

export interface SmartRule {
  id: string;
  name: string;
  conditionType: 'category_exceeded' | 'single_transaction' | 'balance_below' | 'spending_spike';
  category?: string;
  thresholdAmount: number;
  percentage?: number;
  active: boolean;
  lastTriggered?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: string;
  avatarUrl?: string;
  plan: 'trial' | 'pro' | 'premium';
  trialStartedAt: string;
  trialExpiresAt: string;
  isSubscriptionActive?: boolean;
  organizationScore: number;
  monthlyIncomeTarget?: number;
  whatsappSalesNumber?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  preferences: {
    notifyBudgetAlerts: boolean;
    notifyDueDates: boolean;
    notifyWeeklySummary: boolean;
    theme: 'dark' | 'light' | 'system';
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  userEmail: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataBreakdown?: {
    label: string;
    value: string;
  }[];
}
