import React, { useState, useEffect } from "react";
import { Role } from "@alibi/contracts";
import { sound } from "../../lib/audio";
import {
  Fingerprint,
  Shield,
  Skull,
  Search,
  Crosshair,
  Radio,
  Wrench,
  HeartPulse,
  Lock,
  CheckCircle,
} from "lucide-react";

interface RoleRevealModalProps {
  role?: Role;
  playerName: string;
  onDismiss: () => void;
}

export const RoleRevealModal: React.FC<RoleRevealModalProps> = ({
  role = "CIVILIAN",
  playerName,
  onDismiss,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (holding && !revealed) {
      sound.playScanHum();
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setRevealed(true);
            if (role === "KILLER") {
              sound.playHeartbeat();
            } else {
              sound.playEvidenceChime();
            }
            return 100;
          }
          sound.vibrate(20);
          return prev + 10;
        });
      }, 100);
    } else if (!revealed) {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [holding, revealed, role]);

  const isKiller = role === "KILLER";

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {!revealed ? (
          /* Scanning Phase */
          <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-investigation uppercase font-bold block">
                AUTENTICAÇÃO BIOMÉTRICA CONFIDENCIAL
              </span>
              <h2 className="text-xl font-bold font-display text-primary">
                Identidade de {playerName}
              </h2>
              <p className="text-xs text-secondary leading-relaxed px-4">
                Pressione e segure o leitor biométrico abaixo para decodificar o seu papel secreto na casa.
              </p>
            </div>

            {/* Fingerprint Interactive Pad */}
            <div className="flex flex-col items-center justify-center my-8">
              <button
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                className={`relative w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all duration-200 active:scale-95 ${
                  holding
                    ? "border-investigation bg-investigation/10 shadow-hud-cyan"
                    : "border-border bg-surface hover:border-investigation/60"
                }`}
              >
                <Fingerprint
                  className={`w-14 h-14 transition-colors ${
                    holding ? "text-investigation animate-pulse" : "text-muted"
                  }`}
                />

                {/* Laser scan line while holding */}
                {holding && (
                  <div
                    className="absolute inset-x-2 h-1 bg-investigation shadow-lg shadow-investigation rounded-full animate-bounce"
                    style={{ top: `${progress}%` }}
                  />
                )}

                {/* Circular Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="56"
                    cy="56"
                    r="52"
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="52"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="4"
                    strokeDasharray={326}
                    strokeDashoffset={326 - (326 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
              </button>
              <span className="text-[10px] font-mono text-secondary mt-3 uppercase tracking-wider">
                {holding ? `Escaneando... ${progress}%` : "Mantenha o polegar pressionado"}
              </span>
            </div>

            <div className="p-3 bg-surface-elevated/80 border border-border rounded-xl text-[11px] text-muted flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-alert" />
              <span>Proteja a tela contra a visão dos outros participantes.</span>
            </div>
          </div>
        ) : (
          /* Role Revealed Card */
          <div
            className={`w-full p-5 rounded-2xl border text-left space-y-4 animate-in zoom-in-90 fade-in duration-300 ${
              isKiller ? "game-panel-danger" : "game-panel-cyan"
            }`}
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span
                className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                  isKiller
                    ? "bg-danger/20 text-danger border border-danger/40"
                    : "bg-investigation/20 text-investigation border border-investigation/40"
                }`}
              >
                {isKiller ? "CLASSIFIED // ALVO PRIORITÁRIO" : "DOSSIÊ OFICIAL // PERÍCIA"}
              </span>
              <span className="text-[10px] font-mono text-muted">ID #{role.slice(0, 3)}</span>
            </div>

            {/* Role Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${
                  isKiller
                    ? "bg-danger/20 border-danger/60 text-danger shadow-hud-crimson"
                    : "bg-investigation/20 border-investigation/60 text-investigation shadow-hud-cyan"
                }`}
              >
                {getRoleIcon(role)}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-primary tracking-wide">
                  {getRoleTitle(role)}
                </h3>
                <span className="text-xs font-mono text-secondary uppercase font-semibold">
                  {isKiller ? "Facção Clandestina" : "Facção Sobrevivente"}
                </span>
              </div>
            </div>

            {/* Directive Instructions */}
            <div className="p-3 bg-background/60 border border-border/80 rounded-xl space-y-1.5 text-xs">
              <strong className="text-primary block font-mono text-[10px] uppercase tracking-wider">
                Diretrizes de Campo:
              </strong>
              <p className="text-secondary leading-relaxed">
                {getRoleDirectives(role)}
              </p>
            </div>

            {/* Prohibitions */}
            <div className="p-2.5 bg-surface-elevated/60 border border-border rounded-xl text-[11px] text-muted space-y-1">
              <strong className="text-alert block text-[10px] uppercase font-mono">
                Regra Inegociável:
              </strong>
              <p>{getRoleProhibitions(role)}</p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                onDismiss();
              }}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
                isKiller
                  ? "tactile-btn-danger"
                  : "tactile-btn-primary"
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Entendido (Entrar na Partida)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function getRoleIcon(role: Role) {
  switch (role) {
    case "KILLER": return <Crosshair className="w-8 h-8 text-danger" />;
    case "DETECTIVE": return <Search className="w-8 h-8 text-investigation" />;
    case "MEDIC": return <HeartPulse className="w-8 h-8 text-protection" />;
    case "TECHNICIAN": return <Wrench className="w-8 h-8 text-alert" />;
    case "INFORMANT": return <Radio className="w-8 h-8 text-investigation" />;
    default: return <Shield className="w-8 h-8 text-primary" />;
  }
}

function getRoleTitle(role: Role): string {
  switch (role) {
    case "KILLER": return "O ASSASSINO";
    case "DETECTIVE": return "O DETETIVE";
    case "MEDIC": return "O MÉDICO";
    case "TECHNICIAN": return "O TÉCNICO";
    case "INFORMANT": return "O INFORMANTE";
    default: return "CIVIL / INVESTIGADOR";
  }
}

function getRoleDirectives(role: Role): string {
  switch (role) {
    case "KILLER":
      return "Arme missões disfarçadas no seu painel secreto contra sobreviventes isolados. Se o alvo tocar em Iniciar missão, ele será eliminado virtualmente de forma instantânea.";
    case "DETECTIVE":
      return "Você possui perícia investigativa para encontrar contradições em depoimentos e correlacionar credenciais no dossiê. Busque pistas nas salas da casa.";
    case "MEDIC":
      return "Suas tarefas de proteção preventiva possuem a capacidade de neutralizar armadilhas clandestinas antes que a vítima as acione.";
    case "TECHNICIAN":
      return "Especialista em circuitos elétricos e sensores perimetrais. Restaure sistemas e audite diagramas para reabilitar o monitoramento da casa.";
    case "INFORMANT":
      return "Você recebe fragmentos de dados e mensagens de rádio interceptadas na varanda. Negocie pistas com outros participantes com cautela.";
    default:
      return "Cumpra suas missões forenses nos cômodos da casa, acumule evidências materiais no dossiê coletivo e desmascare o assassino na reunião.";
  }
}

function getRoleProhibitions(role: Role): string {
  switch (role) {
    case "KILLER":
      return "Você só pode manter 1 armadilha armada por vez e nunca pode matar fisicamente (100% virtual).";
    case "DETECTIVE":
      return "Você não recebe a identidade do assassino de graça; precisa prová-la com evidências.";
    default:
      return "Nunca toque fisicamente em outros participantes ou equipamentos elétricos reais.";
  }
}
