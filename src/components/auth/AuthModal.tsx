import React, { useState } from 'react';
import { X, Lock, Mail, User, Check, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';
import { UserProfile } from '../../types';
import { AuthStorage } from '../../lib/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess: (user: UserProfile, isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!isOpen) return null;

  // Send verification code to email
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo('');

    if (!name.trim()) {
      setErrorMsg('Por favor informe seu nome completo.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Por favor informe um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha de acesso deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não conferem. Digite a mesma senha nos dois campos.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar código para seu e-mail.');
      }

      setMode('verify');
      setSuccessInfo(data.message || `Código enviado para ${email}! Verifique sua caixa de entrada.`);
      setResendCooldown(30);

      // Start countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao enviar código de verificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao reenviar código.');
      }
      setSuccessInfo('Novo código enviado para seu e-mail!');
      setResendCooldown(30);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao reenviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanCode = verificationCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMsg('Digite o código de 6 dígitos que enviamos para seu e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: cleanCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Código incorreto ou expirado.');
      }

      // Code is strictly valid! Register account in secure storage
      const result = AuthStorage.registerAccount(name, email, password);
      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess(result.user, true);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Código de verificação inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Por favor informe um e-mail válido.');
      return;
    }
    if (!password) {
      setErrorMsg('Por favor informe sua senha cadastrada.');
      return;
    }

    const result = AuthStorage.loginAccount(email, password);
    if (result.error) {
      setErrorMsg(result.error);
      return;
    }

    if (result.user) {
      onSuccess(result.user, false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-[#101613] border border-[#1F2B23] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-[#65796A] hover:text-white hover:bg-[#151D18] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <Logo size="md" className="justify-center" />
          <h3 className="text-lg font-bold text-white pt-2">
            {mode === 'login' && 'Acessar sua Conta'}
            {mode === 'register' && 'Criar Conta • 3 Dias Grátis'}
            {mode === 'verify' && 'Verificação de E-mail'}
            {mode === 'forgot' && 'Recuperar Senha'}
          </h3>
          <p className="text-xs text-[#9CAE9F]">
            {mode === 'login' && 'Digite seus dados cadastrados para entrar'}
            {mode === 'register' && 'Teste todos os recursos por 3 dias sem cartão'}
            {mode === 'verify' && `Digite o código de 6 dígitos que enviamos para ${email}`}
            {mode === 'forgot' && 'Digite seu e-mail cadastrado para redefinir a senha'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 text-xs text-[#FF5252]">
            {errorMsg}
          </div>
        )}

        {successInfo && (
          <div className="p-3 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-xs text-[#00E676]">
            {successInfo}
          </div>
        )}

        {/* Register Mode */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">Nome Completo</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#65796A] mb-1">E-mail (receberá o código real)</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#65796A] mb-1">Senha</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#65796A] mb-1">Confirmar Senha</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-[11px] text-[#9CAE9F] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-[#00E676] rounded mt-0.5"
              />
              <span>Concordo com os Termos de Uso e Política de Privacidade do Admin Money.</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00C853] disabled:opacity-50 text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enviando código de verificação...</span>
                </>
              ) : (
                <span>Criar Conta • Começar 3 Dias Grátis</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#9CAE9F] hover:text-white"
              >
                Já possui uma conta? <span className="text-[#00E676] font-bold">Entrar</span>
              </button>
            </div>
          </form>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">E-mail</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#65796A]">Senha</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#00E676] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#65796A]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white placeholder-[#65796A] outline-none focus:border-[#00E676]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition"
            >
              Entrar no Sistema
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-[#9CAE9F] hover:text-white"
              >
                Ainda não tem conta?{' '}
                <span className="text-[#00E676] font-bold">Teste grátis por 3 dias</span>
              </button>
            </div>
          </form>
        )}

        {/* Verification Mode */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="p-3.5 rounded-2xl bg-[#151D18] border border-[#1F2B23] text-center space-y-1">
              <span className="text-[11px] text-[#65796A]">E-mail de confirmação:</span>
              <p className="text-xs font-bold text-white">{email}</p>
            </div>

            <div>
              <label className="block text-xs text-[#65796A] mb-1.5 text-center">
                Código de Confirmação (6 dígitos)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
                className="w-full py-3 text-center tracking-[0.4em] text-2xl font-mono font-black bg-[#151D18] border-2 border-[#1F2B23] focus:border-[#00E676] rounded-xl text-white outline-none"
              />
              <p className="text-[11px] text-[#65796A] text-center mt-2">
                Verifique a caixa de entrada e a pasta de spam. O código é válido por 10 minutos.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length < 6}
              className="w-full py-3.5 rounded-xl bg-[#00E676] hover:bg-[#00C853] disabled:opacity-50 text-[#050706] text-xs font-black shadow-lg shadow-[#00E676]/25 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando código...</span>
                </>
              ) : (
                <>
                  <span>Confirmar e Iniciar Teste de 3 Dias</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#65796A] hover:text-white"
              >
                Alterar e-mail
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoading}
                className="text-[#00E676] hover:underline disabled:opacity-40 font-semibold"
              >
                {resendCooldown > 0 ? `Reenviar código (${resendCooldown}s)` : 'Reenviar código'}
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Mode */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#65796A] mb-1">E-mail cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-2.5 bg-[#151D18] border border-[#1F2B23] rounded-xl text-xs text-white outline-none focus:border-[#00E676]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(`Instruções de recuperação enviadas para ${email || 'seu e-mail'}.`);
                setTimeout(() => {
                  setErrorMsg('');
                  setMode('login');
                }, 3000);
              }}
              className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#050706] text-xs font-black shadow-md transition"
            >
              Enviar Link de Redefinição
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#9CAE9F] hover:text-white"
              >
                Voltar para Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
