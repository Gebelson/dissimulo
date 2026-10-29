import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import {
  ShieldAlert,
  Clock,
  Skull,
  Radio,
  Eye,
  Crosshair,
  Sparkles,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { sound } from "../lib/audio";

interface HomeTabProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onOpenKillerPanel: () => void;
  onSelectMission: (missionId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  publicState,
  privateState,
  onOpenKillerPanel,
  onSelectMission,
}) => {
  const [showRoleSecret, setShowRoleSecret] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isKiller = privateState.role === "KILLER";
  const isEco = privateState.status === "ECO";
  const isDead = privateState.status === "DEAD_UNDISCOVERED";

  return (
    <div className="space-y-4 pb-20">
      {/* Match Status Header */}
      <div className="forensic-panel p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-investigation border border-border">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-secondary font-mono tracking-wider block">
              FASE ATUAL: {publicState.phase}
            </span>
            <span className="text-xl font-bold font-display text-primary">
              {formatTime(publicState.phaseTimeRemainingSeconds)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1 text-protection bg-protection/10 px-2 py-1 rounded-lg border border-protection/20">
            <span className="w-2 h-2 rounded-full bg-protection animate-ping" />
            {publicState.aliveCount} VIVOS
          </span>
          {publicState.deadCount > 0 && (
            <span className="flex items-center gap-1 text-danger bg-danger/10 px-2 py-1 rounded-lg border border-danger/20">
              <Skull className="w-3.5 h-3.5" />
              {publicState.deadCount} MORTOS
            </span>
          )}
        </div>
      </div>

      {/* Role Card with Secret Hold-to-Reveal */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isKiller
            ? "forensic-panel-danger"
            : isEco
            ? "forensic-panel-eco"
            : "forensic-panel-cyan"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
            Sua Identidade Secreta
          </span>
          <button
            onMouseDown={() => {
              sound.playTap();
              setShowRoleSecret(true);
            }}
            onMouseUp={() => setShowRoleSecret(false)}
            onTouchStart={() => {
              sound.playTap();
              setShowRoleSecret(true);
            }}
            onTouchEnd={() => setShowRoleSecret(false)}
            className="text-xs text-investigation flex items-center gap-1 bg-surface-elevated px-2.5 py-1 rounded-lg border border-border active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Segure para Ver</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center font-bold text-lg font-mono border border-border">
            {showRoleSecret ? (
              isKiller ? "🗡️" : isEco ? "👻" : "🔍"
            ) : (
              "🔒"
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-primary">
              {showRoleSecret ? privateState.role || "CIVILIAN" : "••••••••"}
            </h2>
            <p className="text-xs text-secondary">
              {showRoleSecret
                ? getRoleDescription(privateState.role)
                : "Mantenha seu papel protegido dos outros participantes."}
            </p>
          </div>
        </div>

        {/* Killer Action Button */}
        {isKiller && (
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-danger font-semibold flex items-center gap-1.5">
              <Crosshair className="w-4 h-4" /> Plano Clandestino
            </span>
            <button
              onClick={() => {
                sound.playTap();
                onOpenKillerPanel();
              }}
              className="px-3 py-1.5 bg-danger hover:bg-danger/90 text-white rounded-xl text-xs font-bold active:scale-95 shadow-md shadow-danger/20"
            >
              Armadilhas & Sabotagem
            </button>
          </div>
        )}
      </div>

      {/* Disarm Notification Banner */}
      {privateState.disarmAlertNotification && (
        <div className="p-3 bg-protection/20 border border-protection/40 rounded-xl text-protection flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{privateState.disarmAlertNotification.message}</span>
        </div>
      )}

      {/* Current Room Indicator */}
      <div className="forensic-panel p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-investigation" />
          <div>
            <span className="text-[10px] text-secondary uppercase font-bold block">
              Ambiente Detectado
            </span>
            <span className="text-sm font-semibold text-primary capitalize">
              {privateState.currentRoomId.replace("_", " ")}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-1 rounded border border-border">
          GPS: {privateState.status === "ALIVE" ? "ATIVO" : "INATIVO"}
        </span>
      </div>

      {/* Priority Missions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
            Missões Prioritárias
          </h3>
          <span className="text-[10px] text-investigation font-mono">
            {privateState.missions.filter((m) => m.status === "AVAILABLE").length} DISPONÍVEIS
          </span>
        </div>

        {privateState.missions.length === 0 ? (
          <div className="p-6 text-center forensic-panel text-secondary text-xs">
            Nenhuma missão pendente. Aguarde o agendador global.
          </div>
        ) : (
          <div className="space-y-2">
            {privateState.missions
              .filter((m) => m.status === "AVAILABLE" || m.status === "IN_PROGRESS")
              .slice(0, 3)
              .map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => {
                    sound.playTap();
                    onSelectMission(mission.id);
                  }}
                  className="forensic-panel p-3.5 hover:border-investigation active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-investigation font-bold block">
                      {mission.category}
                    </span>
                    <h4 className="text-sm font-bold text-primary">{mission.title}</h4>
                    <p className="text-xs text-secondary line-clamp-1">{mission.description}</p>
                  </div>
                  <div className="ml-3 shrink-0">
                    <span className="px-2.5 py-1 bg-surface-elevated border border-border text-[10px] font-bold rounded-lg text-primary">
                      {mission.status === "IN_PROGRESS" ? "Em Curso" : "Iniciar"}
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

function getRoleDescription(role?: string): string {
  switch (role) {
    case "KILLER":
      return "Elimine sobreviventes secretamente por meio de armadilhas digitais e desvie suspeitas.";
    case "DETECTIVE":
      return "Analise contradições em depoimentos e correlacione evidências periciais.";
    case "MEDIC":
      return "Conclua tarefas de proteção preventiva para neutralizar ameaças.";
    case "TECHNICIAN":
      return "Restaure circuitos auxiliares e inspecione anomalias de sistemas.";
    case "INFORMANT":
      return "Receba fragmentos de inteligência e decida com quem compartilhar.";
    default:
      return "Investigue a casa, resolva perícias e encontre o culpado antes do fim do tempo.";
  }
}
