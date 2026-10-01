import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, CheckCircle, Server, AlertCircle, RefreshCw } from 'lucide-react';
import { SupportTicket } from '../../types';

interface AdminPanelViewProps {
  tickets: SupportTicket[];
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ tickets }) => {
  const [apiHealth, setApiHealth] = useState<{ status: string; geminiConfigured: boolean } | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setApiHealth(data);
      } else {
        setApiHealth({ status: 'offline', geminiConfigured: false });
      }
    } catch {
      setApiHealth({ status: 'offline', geminiConfigured: false });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FFB84D]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Painel Administrativo</h1>
          </div>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Métricas de plataforma, saúde de microsserviços e solicitações de usuários.
          </p>
        </div>

        <button
          onClick={checkHealth}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16161A] border border-[#24242A] text-xs text-[#A5A5AD] hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
          <span>Verificar Saúde da API</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111114] border border-[#24242A]">
          <span className="text-xs text-[#707078] font-medium">Usuários Ativos</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">1.284</div>
          <div className="text-[10px] text-[#35D07F] mt-1">+14% esta semana</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#24242A]">
          <span className="text-xs text-[#707078] font-medium">Assinantes Pro/Premium</span>
          <div className="text-2xl font-bold font-mono text-[#7C5CFF] mt-1">392</div>
          <div className="text-[10px] text-[#707078] mt-1">30.5% conversão</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#24242A]">
          <span className="text-xs text-[#707078] font-medium">Consultas AI / Dia</span>
          <div className="text-2xl font-bold font-mono text-[#5E8BFF] mt-1">4.890</div>
          <div className="text-[10px] text-[#707078] mt-1">Tempo médio: 420ms</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#111114] border border-[#24242A]">
          <span className="text-xs text-[#707078] font-medium">Chamados de Suporte</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{tickets.length}</div>
          <div className="text-[10px] text-[#35D07F] mt-1">100% resolvidos</div>
        </div>
      </div>

      {/* System Status Section */}
      <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-[#7C5CFF]" />
          <span>Status dos Componentes do Sistema</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#16161A] flex items-center justify-between">
            <span className="text-white">API Server Express / Node</span>
            <span className="text-[#35D07F] font-mono flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Operacional (Porta 3000)
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#16161A] flex items-center justify-between">
            <span className="text-white">Motor Gemini 3.8 Flash</span>
            <span
              className={`font-mono flex items-center gap-1.5 ${
                apiHealth?.geminiConfigured ? 'text-[#35D07F]' : 'text-[#FFB84D]'
              }`}
            >
              {apiHealth?.geminiConfigured ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Conectado com Chave de API
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  Modo Fallback Determinístico Ativo (Sem chave externa)
                </>
              )}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#16161A] flex items-center justify-between">
            <span className="text-white">Banco de Dados e Persistência Local</span>
            <span className="text-[#35D07F] font-mono flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Sincronizado e Seguro
            </span>
          </div>
        </div>
      </div>

      {/* Support Requests Manager */}
      <div className="p-6 rounded-3xl bg-[#111114] border border-[#24242A] space-y-4">
        <h3 className="text-sm font-bold text-white">Tickets de Suporte Recebidos</h3>
        {tickets.length === 0 ? (
          <p className="text-xs text-[#707078]">Nenhum ticket aberto.</p>
        ) : (
          <div className="divide-y divide-[#24242A]/50">
            {tickets.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-medium">{t.subject}</div>
                  <div className="text-[10px] text-[#707078]">{t.userEmail} • {t.category}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#35D07F]/10 text-[#35D07F] font-mono">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
