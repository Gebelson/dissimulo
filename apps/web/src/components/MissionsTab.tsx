import React, { useState } from "react";
import { MissionInstance, PlayerPrivateView } from "@alibi/contracts";
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Lock,
  MapPin,
  Clock,
  Info,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { sound } from "../lib/audio";

interface MissionsTabProps {
  privateState: PlayerPrivateView;
  onStartMission: (missionId: string) => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  privateState,
  onStartMission,
}) => {
  const [selectedMission, setSelectedMission] = useState<MissionInstance | null>(null);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "COMPLETED">("ALL");

  const filtered = privateState.missions.filter((m) => {
    if (filter === "AVAILABLE") return m.status === "AVAILABLE" || m.status === "IN_PROGRESS";
    if (filter === "COMPLETED") return m.status === "COMPLETED";
    return true;
  });

  const handleStart = (mission: MissionInstance) => {
    sound.playTap();
    onStartMission(mission.id);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* FILTER TABS WITH TACTICAL STYLE */}
      <div className="flex bg-surface-elevated/90 p-1 rounded-xl border border-border shadow-inner">
        {(["ALL", "AVAILABLE", "COMPLETED"] as const).map((tab) => {
          const count =
            tab === "ALL"
              ? privateState.missions.length
              : tab === "AVAILABLE"
              ? privateState.missions.filter((m) => m.status === "AVAILABLE" || m.status === "IN_PROGRESS").length
              : privateState.missions.filter((m) => m.status === "COMPLETED").length;

          return (
            <button
              key={tab}
              onClick={() => {
                sound.playTap();
                setFilter(tab);
              }}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                filter === tab
                  ? "bg-investigation text-background shadow-md shadow-investigation/20"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <span>{tab === "ALL" ? "Todas" : tab === "AVAILABLE" ? "Ativas" : "Concluídas"}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${filter === tab ? "bg-black/20 text-black" : "bg-border text-muted"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* MISSIONS TERMINAL LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-10 text-center game-panel text-secondary text-xs space-y-2">
            <Terminal className="w-8 h-8 text-muted mx-auto opacity-50" />
            <p className="font-bold text-primary">Nenhuma missão encontrada neste filtro.</p>
            <p className="text-muted text-[11px]">Verifique a aba 'Todas' para o histórico completo.</p>
          </div>
        ) : (
          filtered.map((mission) => {
            const isCompleted = mission.status === "COMPLETED";
            const roomMatches =
              !mission.requiredRoomId || mission.requiredRoomId === privateState.currentRoomId;

            return (
              <div
                key={mission.id}
                className={`game-panel p-4 transition-all relative overflow-hidden ${
                  isCompleted ? "opacity-60 border-border" : "hover:border-investigation/80"
                }`}
              >
                {/* Status Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-investigation uppercase font-bold tracking-widest bg-investigation/10 px-2 py-0.5 rounded border border-investigation/30">
                      ORDEM // {mission.category}
                    </span>
                    <h3 className="text-sm font-bold text-primary font-display mt-1">
                      {mission.title}
                    </h3>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-protection bg-protection/10 px-2 py-1 rounded-lg border border-protection/30 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CONCLUÍDA
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-0.5 rounded border border-border">
                      {mission.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-secondary mb-3.5 leading-relaxed font-sans">
                  {mission.description}
                </p>

                {/* Location requirement banner */}
                {mission.requiredRoomId && (
                  <div
                    className={`flex items-center gap-2 text-xs p-2.5 rounded-xl border mb-3 font-mono ${
                      roomMatches
                        ? "bg-protection/10 border-protection/30 text-protection"
                        : "bg-alert/10 border-alert/30 text-alert"
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Local:</span>
                    <strong className="capitalize">
                      {mission.requiredRoomId.replace("_", " ")}
                    </strong>
                    {!roomMatches && (
                      <span className="text-[10px] opacity-80">(Vá até lá)</span>
                    )}
                  </div>
                )}

                {/* Action Row */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/80">
                    <button
                      onClick={() => {
                        sound.playTap();
                        setSelectedMission(mission);
                      }}
                      className="px-3.5 py-2.5 bg-surface-elevated border border-border text-secondary hover:text-primary rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Info className="w-3.5 h-3.5" /> Detalhes
                    </button>

                    <button
                      onClick={() => handleStart(mission)}
                      disabled={!roomMatches}
                      className={`flex-1 py-2.5 text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        roomMatches
                          ? "tactile-btn-primary"
                          : "bg-surface-elevated text-muted border border-border opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {roomMatches ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Iniciar Missão
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Vá para o Ambiente
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CLASSIFIED DETAILS MODAL */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm game-panel p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[10px] font-mono text-investigation font-bold uppercase tracking-widest">
                INSTRUÇÕES PERICIAIS
              </span>
              <span className="text-[10px] font-mono text-muted">ID #{selectedMission.id.slice(-4)}</span>
            </div>

            <div>
              <h3 className="text-base font-bold font-display text-primary">
                {selectedMission.title}
              </h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                {selectedMission.description}
              </p>
            </div>

            <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>CATEGORIA:</span>
                <strong className="text-primary">{selectedMission.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>MINIGAME:</span>
                <strong className="text-investigation">{selectedMission.minigameId}</strong>
              </div>
              <div className="flex justify-between">
                <span>AMBIENTE:</span>
                <strong className="text-primary capitalize">
                  {selectedMission.requiredRoomId ? selectedMission.requiredRoomId.replace("_", " ") : "Qualquer Local"}
                </strong>
              </div>
            </div>

            <div className="p-2.5 bg-background border border-border rounded-xl text-[11px] text-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-protection shrink-0" />
              <span>A visualização dos detalhes é sempre 100% segura.</span>
            </div>

            <button
              onClick={() => setSelectedMission(null)}
              className="w-full py-2.5 bg-surface-elevated border border-border text-primary rounded-xl text-xs font-bold active:scale-95"
            >
              Fechar Instruções
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
