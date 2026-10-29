import React, { useState } from "react";
import { MissionInstance, PlayerPrivateView } from "@alibi/contracts";
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Lock,
  MapPin,
  Clock,
  FileText,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";
import { sound } from "../lib/audio";
import { ConfidentialStamp, NoirSectionHeader } from "./ui/NoirComponents";

interface MissionsTabProps {
  privateState: PlayerPrivateView;
  onStartMission: (missionId: string) => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  privateState,
  onStartMission,
}) => {
  const [selectedMission, setSelectedMission] = useState<MissionInstance | null>(null);
  const [filter, setFilter] = useState<"AVAILABLE" | "ALL" | "COMPLETED">("AVAILABLE");

  const filtered = privateState.missions.filter((m) => {
    if (filter === "AVAILABLE") return m.status === "AVAILABLE" || m.status === "IN_PROGRESS";
    if (filter === "COMPLETED") return m.status === "COMPLETED";
    return true;
  });

  const handleStart = (mission: MissionInstance) => {
    sound.playTypewriterClick();
    onStartMission(mission.id);
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in-dramatic">
      <NoirSectionHeader
        title="Ordens & Perícias"
        subtitle="Tarefas e intervenções confidenciais do caso"
        badge="PROTOCOLO INVESTIGATIVO"
      />

      {/* FILTER TABS */}
      <div className="flex bg-[#171411] p-1 rounded-xl border border-[#4A3A32] shadow-inner">
        {(["AVAILABLE", "ALL", "COMPLETED"] as const).map((tab) => {
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
                  ? "bg-[#2A231C] text-[#F2EDE4] border border-[#B79A70]/50 shadow-sm"
                  : "text-[#C2B7AA] hover:text-[#F2EDE4]"
              }`}
            >
              <span>{tab === "AVAILABLE" ? "Ativas" : tab === "ALL" ? "Todas" : "Concluídas"}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  filter === tab ? "bg-[#B79A70] text-[#120F0D] font-bold" : "bg-[#25201C] text-[#C2B7AA]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* MISSIONS CARDS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center noir-card text-[#C2B7AA] text-xs space-y-2 border-dashed">
            <FileText className="w-8 h-8 text-[#B79A70] mx-auto opacity-40" />
            <p className="font-serif font-bold text-[#F2EDE4] text-sm">
              Nenhuma ordem pendente neste arquivo.
            </p>
            <p className="text-[11px] text-[#C2B7AA]">
              Consulte a aba 'Todas' para inspecionar registros arquivados.
            </p>
          </div>
        ) : (
          filtered.map((mission) => {
            const isCompleted = mission.status === "COMPLETED";
            const roomMatches =
              !mission.requiredRoomId || mission.requiredRoomId === privateState.currentRoomId;

            return (
              <div
                key={mission.id}
                className={`noir-card p-4 transition-all relative overflow-hidden ${
                  isCompleted ? "opacity-60 border-[#302621]" : "hover:border-[#B79A70]/70"
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#B79A70] uppercase font-bold tracking-widest bg-[#221D19] px-2 py-0.5 rounded border border-[#4A3A32]">
                      ORDEM // {mission.category}
                    </span>
                    {mission.neutralizesTrapId && (
                      <span className="text-[9px] font-mono text-[#73917B] font-bold tracking-wider">
                        • PROTEÇÃO
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      isCompleted
                        ? "bg-[#73917B]/10 text-[#73917B] border border-[#73917B]/30"
                        : "bg-[#2E2721] text-[#D8C8AC] border border-[#4A3A32]"
                    }`}
                  >
                    {isCompleted ? "CONCLUÍDA" : "DISPONÍVEL"}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif font-bold text-base text-[#F2EDE4] tracking-wide mb-1">
                  {mission.title}
                </h3>
                <p className="text-xs text-[#C2B7AA] line-clamp-2 leading-relaxed mb-3">
                  {mission.description}
                </p>

                {/* Room Requirement Notice */}
                {mission.requiredRoomId && (
                  <div className="flex items-center gap-1.5 text-[11px] mb-3 text-[#C2B7AA]">
                    <MapPin className="w-3.5 h-3.5 text-[#B79A70]" />
                    <span>Ambiente exigido: </span>
                    <strong
                      className={
                        roomMatches
                          ? "text-[#73917B] font-mono"
                          : "text-[#F1A8A4] font-mono underline"
                      }
                    >
                      {mission.requiredRoomId} {roomMatches ? "(Você está aqui)" : "(Vá até o cômodo)"}
                    </strong>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#4A3A32]/40">
                  <button
                    onClick={() => {
                      sound.playPaperRustle();
                      setSelectedMission(mission);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-[#221D19] hover:bg-[#2A231C] border border-[#4A3A32] text-xs font-serif text-[#F2EDE4] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#B79A70]" />
                    <span>Examinar Ordem</span>
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => handleStart(mission)}
                      disabled={!roomMatches}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        roomMatches
                          ? "noir-btn-primary"
                          : "bg-[#1E1915] text-[#C2B7AA]/50 border border-[#3A2E26] cursor-not-allowed"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{roomMatches ? "Executar" : "Cômodo Incorreto"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CONFIDENTIAL MISSION DETAILS MODAL (AGED PARCHMENT PAPER LOOK) */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm noir-paper p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Stamp */}
            <div className="flex items-start justify-between border-b border-[#30231C]/30 pb-3">
              <div>
                <span className="stamp-order">ORDEM RECEBIDA</span>
                <span className="text-[10px] font-mono text-[#5A4335] block mt-1">
                  PROTOCOLO: {selectedMission.id.toUpperCase().substring(0, 16)}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  setSelectedMission(null);
                }}
                className="text-[#30231C] hover:opacity-70 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-3 text-[#30231C]">
              <h2 className="font-serif font-bold text-xl leading-tight">
                {selectedMission.title}
              </h2>

              <p className="text-xs leading-relaxed font-sans opacity-90">
                {selectedMission.description}
              </p>

              <div className="p-3 bg-[#C8B89C] rounded border border-[#B09B7A] text-[11px] space-y-1">
                <span className="font-mono font-bold block uppercase tracking-wide">
                  Classificação da Tarefa:
                </span>
                <p className="opacity-80">
                  {selectedMission.category === "INVESTIGATION"
                    ? "Recuperação pericial: desbloqueia laudos e evidências ao ser resolvida."
                    : selectedMission.neutralizesTrapId
                    ? "Intervenção de segurança: neutraliza ameaças e protege os sobreviventes."
                    : selectedMission.category === "SURVIVAL"
                    ? "Sobrevivência: restauração de suporte e contenção de danos."
                    : "Manutenção: restabelece sistemas e registros da residência."}
                </p>
              </div>

              {selectedMission.requiredRoomId && (
                <div className="text-xs font-mono">
                  <span>Local de Execução: </span>
                  <strong className="underline font-bold">
                    {selectedMission.requiredRoomId}
                  </strong>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedMission(null)}
                className="flex-1 py-3 rounded-lg border border-[#30231C]/40 text-xs font-serif text-[#30231C] hover:bg-[#C8B89C] font-semibold"
              >
                Fechar Arquivo
              </button>

              {selectedMission.status !== "COMPLETED" && (
                <button
                  onClick={() => {
                    handleStart(selectedMission);
                    setSelectedMission(null);
                  }}
                  className="flex-1 py-3 noir-btn-paper text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Iniciar Ordem
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
