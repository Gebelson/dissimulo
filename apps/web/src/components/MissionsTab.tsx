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
    <div className="space-y-4 pb-20">
      {/* Filter Tabs */}
      <div className="flex bg-surface-elevated p-1 rounded-xl border border-border">
        {(["ALL", "AVAILABLE", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playTap();
              setFilter(tab);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === tab
                ? "bg-surface text-investigation shadow-sm border border-border"
                : "text-secondary hover:text-primary"
            }`}
          >
            {tab === "ALL" ? "Todas" : tab === "AVAILABLE" ? "Disponíveis" : "Concluídas"}
          </button>
        ))}
      </div>

      {/* Mission List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center forensic-panel text-secondary text-xs">
            Nenhuma missão nesta categoria.
          </div>
        ) : (
          filtered.map((mission) => {
            const isCompleted = mission.status === "COMPLETED";
            const roomMatches =
              !mission.requiredRoomId || mission.requiredRoomId === privateState.currentRoomId;

            return (
              <div
                key={mission.id}
                className={`forensic-panel p-4 transition-all ${
                  isCompleted ? "opacity-60 border-border" : "hover:border-investigation"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-investigation uppercase font-bold tracking-wider">
                      {mission.category}
                    </span>
                    <h3 className="text-sm font-bold text-primary">{mission.title}</h3>
                  </div>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-protection bg-protection/10 px-2 py-0.5 rounded border border-protection/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CONCLUÍDA
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-0.5 rounded border border-border">
                      {mission.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  {mission.description}
                </p>

                {/* Location indicator */}
                {mission.requiredRoomId && (
                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-3 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-investigation" />
                    <span>Ambiente exigido: </span>
                    <span
                      className={`font-bold capitalize ${
                        roomMatches ? "text-protection" : "text-alert"
                      }`}
                    >
                      {mission.requiredRoomId.replace("_", " ")}
                      {!roomMatches && " (Você está em outro cômodo)"}
                    </span>
                  </div>
                )}

                {/* Actions */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => {
                        sound.playTap();
                        setSelectedMission(mission);
                      }}
                      className="px-3 py-2 bg-surface-elevated border border-border text-secondary hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95"
                    >
                      <Info className="w-3.5 h-3.5" /> Detalhes
                    </button>

                    <button
                      onClick={() => handleStart(mission)}
                      disabled={!roomMatches}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
                        roomMatches
                          ? "bg-investigation text-background hover:bg-investigation/90 shadow-investigation/20"
                          : "bg-surface-elevated text-secondary border border-border opacity-50 cursor-not-allowed"
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

      {/* Details Modal (Viewing details NEVER causes elimination) */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-investigation font-bold uppercase">
                {selectedMission.category}
              </span>
              <h3 className="text-base font-bold text-primary font-display">
                {selectedMission.title}
              </h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              {selectedMission.description}
            </p>
            <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1">
              <div>
                <strong>Minigame associado:</strong> {selectedMission.minigameId}
              </div>
              <div>
                <strong>Ambiente:</strong>{" "}
                {selectedMission.requiredRoomId || "Qualquer local da casa"}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedMission(null)}
                className="w-full py-2 bg-surface-elevated border border-border text-primary rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
