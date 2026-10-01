import { UserProfile } from '../types';

export interface TrialStatus {
  isExpired: boolean;
  isPaid: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  formattedRemaining: string;
}

export function getTrialStatus(user: UserProfile): TrialStatus {
  // If user has an active paid plan, they are not expired
  if ((user.plan === 'pro' || user.plan === 'premium') && user.isSubscriptionActive !== false) {
    return {
      isExpired: false,
      isPaid: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      formattedRemaining: user.plan === 'premium' ? 'Plano Premium Ativo' : 'Plano Pro Ativo',
    };
  }

  const now = Date.now();
  const expiresAt = user.trialExpiresAt ? new Date(user.trialExpiresAt).getTime() : now;
  const diffMs = expiresAt - now;

  if (diffMs <= 0) {
    return {
      isExpired: true,
      isPaid: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      formattedRemaining: 'Teste Gratuito Expirado',
    };
  }

  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(diffMs / (1000 * 60));

  let formatted = '';
  if (daysRemaining > 1) {
    formatted = `${daysRemaining} dias de teste grátis`;
  } else if (hoursRemaining > 0) {
    formatted = `${hoursRemaining}h de teste restantes`;
  } else {
    formatted = `${Math.max(1, minutesRemaining)}m de teste restantes`;
  }

  return {
    isExpired: false,
    isPaid: false,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    formattedRemaining: formatted,
  };
}
