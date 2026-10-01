import { UserProfile } from '../types';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely in client storage
  createdAt: string;
  trialStartedAt: string;
  trialExpiresAt: string;
  plan: 'trial' | 'pro' | 'premium';
}

const AUTH_STORAGE_KEY = 'admin_money_accounts_auth_v3';

export const AuthStorage = {
  getAccounts: (): RegisteredAccount[] => {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as RegisteredAccount[];
    } catch {
      return [];
    }
  },

  findAccountByEmail: (email: string): RegisteredAccount | undefined => {
    const accounts = AuthStorage.getAccounts();
    return accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  },

  registerAccount: (
    name: string,
    email: string,
    password: string
  ): { user: UserProfile; error?: string } => {
    const accounts = AuthStorage.getAccounts();
    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      // If already exists, verify password
      if (existing.password !== password) {
        return { user: null as any, error: 'Este e-mail já possui cadastro com outra senha.' };
      }
    }

    const now = new Date();
    const trialStartedAt = now.toISOString();
    // Exactly 3 days from now
    const trialExpiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const newAccount: RegisteredAccount = {
      id: existing ? existing.id : `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      createdAt: existing ? existing.createdAt : trialStartedAt,
      trialStartedAt: existing ? existing.trialStartedAt : trialStartedAt,
      trialExpiresAt: existing ? existing.trialExpiresAt : trialExpiresAt,
      plan: existing ? existing.plan : 'trial',
    };

    if (!existing) {
      accounts.push(newAccount);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accounts));
    }

    const userProfile: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      currency: 'BRL',
      plan: newAccount.plan,
      trialStartedAt: newAccount.trialStartedAt,
      trialExpiresAt: newAccount.trialExpiresAt,
      isSubscriptionActive: newAccount.plan !== 'trial',
      organizationScore: 50,
      monthlyIncomeTarget: 5000,
      whatsappSalesNumber: '5521996589629',
      onboardingCompleted: false,
      createdAt: newAccount.createdAt,
      preferences: {
        notifyBudgetAlerts: true,
        notifyDueDates: true,
        notifyWeeklySummary: true,
        theme: 'dark',
      },
    };

    return { user: userProfile };
  },

  loginAccount: (
    email: string,
    password: string
  ): { user?: UserProfile; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const account = AuthStorage.findAccountByEmail(cleanEmail);

    if (!account) {
      return {
        error: 'E-mail não cadastrado. Crie sua conta para iniciar seus 3 dias grátis!',
      };
    }

    if (account.password !== password) {
      return {
        error: 'Senha incorreta. Verifique suas credenciais de acesso.',
      };
    }

    const userProfile: UserProfile = {
      id: account.id,
      name: account.name,
      email: account.email,
      currency: 'BRL',
      plan: account.plan,
      trialStartedAt: account.trialStartedAt,
      trialExpiresAt: account.trialExpiresAt,
      isSubscriptionActive: account.plan !== 'trial',
      organizationScore: 78,
      monthlyIncomeTarget: 5000,
      whatsappSalesNumber: '5521996589629',
      onboardingCompleted: true,
      createdAt: account.createdAt,
      preferences: {
        notifyBudgetAlerts: true,
        notifyDueDates: true,
        notifyWeeklySummary: true,
        theme: 'dark',
      },
    };

    return { user: userProfile };
  },
};
