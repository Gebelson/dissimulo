import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import {
  Clock,
  Skull,
  Radio,
  Eye,
  Crosshair,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Activity,
  Zap,
} from "lucide-react";
import { sound } from "../lib/audio";

interface HomeTabProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onOpenKillerPanel: () => void;
  onOpenRoleReveal: () => void;
  onSelectMission: (missionId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  publicState,
  privateState,
  onOpenKillerPanel,
  onOpenRoleReveal,
  onSelectMission,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isKiller = privateState.role === "KILLER";
  const isEco = privateState.status === "ECO";
  const isDead = privateState.status === "DEAD_UNDISCOVERED";

  const availableMissions = privateState.missions.filter(
    (m) => m.status === "AVAILABLE" || m.status === "IN_PROGRESS"
  );

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* DIEGETIC TOP HUD: Time, Phase & Survivor Counter */}
      <div className="game-panel p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-investigation shadow-sm">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-widest text-secondary uppercase block">
              FASE // {publicState.phase}
            </span>
            <span className="text-xl font-display font-extrabold text-primary tracking-wider">
              {formatTime(publicState.phaseTimeRemainingSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-protection/10 border border-protection/30 text-protection font-bold">
            <span className="w-2 h-2 rounded-full bg-protection animate-ping" />
            <span>{publicState.aliveCount} VIVOS</span>
          </div>

          {publicState.deadCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-danger/10 border border-danger/30 text-danger font-bold">
              <Skull className="w-3.5 h-3.5" />
              <span>{publicState.deadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* TACTICAL IDENTITY CARD */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isKiller
            ? "game-panel-danger"
            : isEco
            ? "game-panel-eco"
            : "game-panel-cyan"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted">
            IDENTIDADE EM CAMPO
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onOpenRoleReveal();
            }}
            className="text-[10px] font-mono text-investigation hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border hover:border-investigation active:scale-95 transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>Examinar Credencial</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-xl border ${
                isKiller
                  ? "bg-danger/20 border-danger text-danger shadow-hud-crimson"
                  : isEco
                  ? "bg-eco/20 border-eco text-eco shadow-hud-eco"
                  : "bg-investigation/20 border-investigation text-investigation shadow-hud-cyan"
              }`}
            >
              {isKiller ? "🗡️" : isEco ? "👻" : "🔍"}
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-primary tracking-wide">
                {privateState.role || "CIVILIAN"}
              </h2>
              <span className="text-xs text-secondary font-mono">
                {isKiller
                  ? "Facção Clandestina (Elimine sem ser visto)"
                  : isEco
                  ? "Modo Espectro Ativo"
                  : "Facção dos Sobreviventes"}
              </span>
            </div>
          </div>
        </div>

        {/* KILLER OPERATIONS SHORTCUT */}
        {isKiller && (
          <div className="mt-4 pt-3 border-t border-danger/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-danger font-bold font-mono">
              <Crosshair className="w-4 h-4 animate-spin" />
              <span>SABOTAGENS & ARMADILHAS</span>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                onOpenKillerPanel();
              }}
              className="px-3.5 py-1.5 tactile-btn-danger text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Abrir Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* DISARM NOTIFICATION TOAST / BANNER */}
      {privateState.disarmAlertNotification && (
        <div className="p-3.5 bg-protection/15 border border-protection/40 rounded-xl text-protection flex items-center gap-2.5 text-xs font-semibold shadow-md animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{privateState.disarmAlertNotification.message}</span>
        </div>
      )}

      {/* CURRENT ROOM SENSOR BAR */}
      <div className="game-panel p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-investigation border border-border">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-muted uppercase font-bold block">
              LOCALIZAÇÃO ATUAL
            </span>
            <span className="text-sm font-bold text-primary font-display capitalize">
              {privateState.currentRoomId.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-protection bg-protection/10 px-2 py-0.5 rounded border border-protection/20 font-bold block">
            ● CONECTADO
          </span>
          <span className="text-[9px] font-mono text-muted uppercase mt-0.5 block">
            MODO {privateState.status === "ALIVE" ? "PRESENCIAL" : "ECO"}
          </span>
        </div>
      </div>

      {/* PRIORITY MISSIONS SECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-investigation" /> Missões de Campo ({availableMissions.length})
          </h3>
          <span className="text-[10px] text-muted font-mono">TOQUE PARA INSPECIONAR</span>
        </div>

        {availableMissions.length === 0 ? (
          <div className="game-panel p-6 text-center text-secondary text-xs space-y-1">
            <Shield className="w-6 h-6 text-muted mx-auto mb-1 opacity-60" />
            <p className="font-semibold text-primary">Nenhuma missão pendente.</p>
            <p className="text-muted text-[11px]">Aguarde o agendador pericial liberar novas tarefas.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableMissions.slice(0, 3).map((mission) => (
              <div
                key={mission.id}
                onClick={() => {
                  sound.playTap();
                  onSelectMission(mission.id);
                }}
                className="game-panel p-3.5 hover:border-investigation active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-investigation bg-investigation/10 px-1.5 py-0.5 rounded border border-investigation/20 font-bold">
                      {mission.category}
                    </span>
                    {mission.requiredRoomId && (
                      <span className="text-[9px] font-mono text-muted capitalize">
                        • {mission.requiredRoomId.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-primary font-display">{mission.title}</h4>
                  <p className="text-xs text-secondary line-clamp-1 leading-snug">
                    {mission.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="px-2.5 py-1.5 bg-surface-elevated border border-border text-xs font-mono font-bold rounded-xl text-investigation flex items-center gap-1">
                    <span>Acessar</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
