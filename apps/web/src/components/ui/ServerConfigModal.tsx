import React, { useState, useEffect } from "react";
import {
  resolveServerConfig,
  setCustomServerUrl,
  checkServerHealth,
  HealthCheckResult,
} from "../../services/connection";
import { sound } from "../../lib/audio";
import { Server, CheckCircle2, XCircle, RefreshCw, RotateCcw, X, Shield, Globe } from "lucide-react";

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServerChanged?: () => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  isOpen,
  onClose,
  onServerChanged,
}) => {
  const [config, setConfig] = useState(resolveServerConfig());
  const [inputUrl, setInputUrl] = useState(config.customUrl || "");
  const [isTesting, setIsTesting] = useState(false);
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = resolveServerConfig();
      setConfig(current);
      setInputUrl(current.customUrl || "");
      setHealthResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    sound.playTap();
    setIsTesting(true);
    setHealthResult(null);
    try {
      const res = await checkServerHealth();
      setHealthResult(res);
      if (res.healthy) {
        sound.playEvidenceChime();
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    sound.playTypewriterClick();
    setCustomServerUrl(inputUrl.trim() || null);
    const updated = resolveServerConfig();
    setConfig(updated);
    if (onServerChanged) onServerChanged();
    onClose();
  };

  const handleResetDefault = () => {
    sound.playTap();
    setCustomServerUrl(null);
    setInputUrl("");
    const updated = resolveServerConfig();
    setConfig(updated);
    setHealthResult(null);
    if (onServerChanged) onServerChanged();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0B0A]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-[#171411] border-2 border-[#B79A70]/60 rounded-2xl shadow-2xl p-5 space-y-4 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#4A3A32]/60 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#B79A70]" />
            <h3 className="text-sm font-serif font-bold text-[#F2EDE4] tracking-wide">
              CENTRAL DO SERVIDOR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#C2B7AA] hover:text-[#F2EDE4] hover:bg-[#221D19]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status Box */}
        <div className="p-3 bg-[#0C0B0A] rounded-xl border border-[#4A3A32] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8C8074] uppercase">ENDEREÇO ATIVO:</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#221D19] border border-[#4A3A32] text-[#B79A70]">
              {config.source}
            </span>
          </div>
          <p className="font-mono text-xs text-[#F2EDE4] break-all">
            {config.resolvedWsUrl}
          </p>

          {config.isProductionWithoutBackend && (
            <div className="p-2 bg-[#2A1114] border border-[#9F3D3D] rounded-lg text-[11px] text-[#F1A8A4] space-y-1">
              <strong className="block font-semibold">Aviso de Produção:</strong>
              <span>
                Este aplicativo está hospedado na Vercel (serviço estático). Um servidor backend dedicado WebSocket (ex: Render, Railway ou IP local) deve ser informado abaixo para permitir partidas online.
              </span>
            </div>
          )}
        </div>

        {/* Custom Server Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-[#C2B7AA] font-bold">
            DEFINIR SERVIDOR CUSTOMIZADO (OPCIONAL):
          </label>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Ex: 192.168.1.15:4000 ou wss://meu-servidor.up.railway.app"
            className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-xl px-3 py-2.5 text-xs text-[#F2EDE4] placeholder-[#8C8074] font-mono outline-none focus:border-[#B79A70]"
          />
          <p className="text-[10px] text-[#8C8074] font-sans">
            Insira o IP do computador anfitrião na rede Wi-Fi ou a URL do backend hospedado.
          </p>
        </div>

        {/* Health Test Result */}
        {healthResult && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
              healthResult.healthy
                ? "bg-[#142319] border-[#3D9F60] text-[#A4F1BF]"
                : "bg-[#2A1114] border-[#9F3D3D] text-[#F1A8A4]"
            }`}
          >
            {healthResult.healthy ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#3D9F60]" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#9F3D3D]" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold block">
                {healthResult.healthy ? "Servidor Conectado" : "Falha na Verificação"}
              </span>
              <p className="text-[11px] font-mono opacity-90">
                {healthResult.healthy
                  ? `Resposta em ${healthResult.latencyMs}ms • ${healthResult.details?.activeRooms ?? 0} salas ativas`
                  : healthResult.error}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="w-full py-2.5 bg-[#221D19] hover:bg-[#2A2420] text-[#B79A70] border border-[#4A3A32] rounded-xl font-serif text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Testando..." : "Testar Conexão com Servidor"}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleResetDefault}
              className="flex-1 py-2.5 bg-[#171411] hover:bg-[#221D19] text-[#8C8074] hover:text-[#C2B7AA] border border-[#4A3A32] rounded-xl font-sans text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Automático</span>
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-2.5 noir-btn-primary rounded-xl font-serif text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
