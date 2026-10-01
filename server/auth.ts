import { sendVerificationCodeEmail } from './email.ts';

interface VerificationEntry {
  code: string;
  name: string;
  expiresAt: number;
  attempts: number;
}

// In-memory verification codes store with email as key (lowercase)
const verificationCodes = new Map<string, VerificationEntry>();

export async function requestVerificationCode(
  email: string,
  name: string
): Promise<{ success: boolean; message: string; debugCode?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate random 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  verificationCodes.set(normalizedEmail, {
    code,
    name: name || 'Usuário',
    expiresAt,
    attempts: 0,
  });

  // Attempt real email dispatch via nodemailer
  const sendResult = await sendVerificationCodeEmail(normalizedEmail, name, code);

  return {
    success: true,
    message: `Código de verificação enviado para ${normalizedEmail}! Verifique sua caixa de entrada e spam.`,
    debugCode: sendResult.simulated ? code : undefined,
  };
}

export function verifyCode(
  email: string,
  code: string
): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  const entry = verificationCodes.get(normalizedEmail);

  if (!entry) {
    return {
      success: false,
      error: 'Nenhum código encontrado para este e-mail. Solicite um novo código.',
    };
  }

  if (Date.now() > entry.expiresAt) {
    verificationCodes.delete(normalizedEmail);
    return {
      success: false,
      error: 'O código de verificação expirou. Solicite um novo código.',
    };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    verificationCodes.delete(normalizedEmail);
    return {
      success: false,
      error: 'Muitas tentativas incorretas. Por segurança, solicite um novo código.',
    };
  }

  if (entry.code !== cleanCode) {
    return {
      success: false,
      error: 'Código de verificação incorreto. Verifique o número enviado para o seu e-mail.',
    };
  }

  // Code is strictly valid! Remove from map so it cannot be reused
  verificationCodes.delete(normalizedEmail);
  return { success: true };
}
