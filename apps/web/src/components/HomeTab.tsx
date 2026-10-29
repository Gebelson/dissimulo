import React from "react";
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
  FileText,
  UserCheck,
} from "lucide-react";
import { sound } from "../lib/audio";
import { ConfidentialStamp, NoirSectionHeader } from "./ui/NoirComponents";

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
    <div className="space-y-4 pb-28 animate-fade-in-dramatic">
      {/* CASE TELEMETRY HEADER: Timer, Phase, Survivors */}
      <div className="noir-card p-3.5 flex items-center justify-between border-[#4A3A32]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#221D19] border border-[#4A3A32] flex items-center justify-center text-[#B79A70] shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#B79A70] uppercase block font-semibold">
              RODADA // {publicState.phase === "INVESTIGATION" ? "INVESTIGAÇÃO" : publicState.phase}
            </span>
            <span className="text-xl font-mono font-bold text-[#F2EDE4] tracking-wider">
              {formatTime(publicState.phaseTimeRemainingSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#221D19] border border-[#73917B]/40 text-[#73917B] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#73917B]" />
            <span>{publicState.aliveCount} VIVOS</span>
          </div>

          {publicState.deadCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2A1114] border border-[#9F3D3D]/60 text-[#F1A8A4] font-bold">
              <Skull className="w-3.5 h-3.5" />
              <span>{publicState.deadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* CLASSIFIED DOSSIER IDENTITY BADGE */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          isKiller
            ? "noir-panel-threat border-[#9F3D3D]/80"
            : isEco
            ? "noir-panel-eco border-[#7B849D]/80"
            : "noir-card border-[#4A3A32]"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#B79A70]">
            SEU PAPEL NO CASO
          </span>
          <button
            onClick={() => {
              sound.playPaperRustle();
              onOpenRoleReveal();
            }}
            className="text-[10px] font-mono text-[#F2EDE4] hover:text-[#B79A70] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#221D19] border border-[#4A3A32] active:scale-95 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#B79A70]" />
            <span>Ver Dossiê Secreto</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#F2EDE4] leading-tight">
              {isKiller
                ? "O Assassino"
                : isEco
                ? "Modo Eco (Espectro)"
                : privateState.role === "DETECTIVE"
                ? "O Detetive"
                : privateState.role === "MEDIC"
                ? "O Médico Legista"
                : privateState.role === "TECHNICIAN"
                ? "O Técnico de Sistemas"
                : "Investigador / Sobrevivente"}
            </h3>
            <p className="text-xs text-[#C2B7AA] mt-0.5">
              {isKiller
                ? "Elimine os demais criando armadilhas falsas."
                : isEco
                ? "Você foi eliminado. Ajude resolvendo enigmas sem direito a voto."
                : "Colete evidências e descubra o assassino."}
            </p>
          </div>

          <div className="ml-3">
            {isKiller ? (
              <span className="stamp-confidential text-[9px]">INFRATOR</span>
            ) : isEco ? (
              <span className="stamp-evidence text-[9px]">ESPECTRO</span>
            ) : (
              <span className="stamp-order text-[9px]">OFICIAL</span>
            )}
          </div>
        </div>
      </div>

      {/* KILLER COVERT ACCESS BUTTON (ONLY VISIBLE TO KILLER) */}
      {isKiller && (
        <button
          onClick={() => {
            sound.playHeartbeat();
            onOpenKillerPanel();
          }}
          className="w-full py-3.5 px-4 rounded-xl noir-btn-danger flex items-center justify-between font-serif text-sm uppercase tracking-wider font-bold shadow-noir-crimson"
        >
          <div className="flex items-center gap-2.5">
            <Skull className="w-5 h-5 text-[#F1A8A4]" />
            <span>Operações do Assassino</span>
          </div>
          <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded border border-[#F1A8A4]/30">
            {privateState.killerDashboard?.activeTrap ? "1/1 ARMADA" : "0/1 LIVRE"}
          </span>
        </button>
      )}

      {/* PRIVATE DISARM NOTIFICATION (IF SURVIVOR NEUTRALIZED A TRAP) */}
      {privateState.disarmAlertNotification && (
        <div className="p-3.5 rounded-xl bg-[#14231A] border border-[#73917B] text-xs text-[#F2EDE4] space-y-1 shadow-md">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#73917B]" />
            <strong className="font-serif text-sm text-[#73917B]">
              Intervenção Bem-Sucedida
            </strong>
          </div>
          <p className="text-[#C2B7AA] text-[11px] leading-relaxed">
            {privateState.disarmAlertNotification.message}
          </p>
        </div>
      )}

      {/* RESIDENCE CURRENT AMBIENCE */}
      <div className="noir-card p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#221D19] border border-[#4A3A32] flex items-center justify-center text-[#B79A70]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#B79A70] uppercase block">
              SUA LOCALIZAÇÃO ATUAL
            </span>
            <span className="text-sm font-serif font-bold text-[#F2EDE4]">
              {privateState.currentRoomId || "Ambiente Não Informado"}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#C2B7AA] bg-[#25201C] px-2 py-1 rounded border border-[#4A3A32]">
          {privateState.locationReliability === "beacon" ? "Sinal Beacon" : "Declarado"}
        </span>
      </div>

      {/* PRIORITY MISSIONS PREVIEW */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#C2B7AA] px-1 font-mono">
          <span className="font-bold text-[#F2EDE4] flex items-center gap-1.5 font-serif text-sm">
            <FileText className="w-4 h-4 text-[#B79A70]" /> Ordens Prioritárias ({availableMissions.length})
          </span>
          <span className="text-[10px] text-[#B79A70]">ABORDAGEM IMEDIATA</span>
        </div>

        {availableMissions.length === 0 ? (
          <div className="noir-card p-6 text-center text-xs text-[#C2B7AA] space-y-1">
            <CheckCircle className="w-6 h-6 text-[#73917B] mx-auto opacity-70" />
            <p className="font-serif font-bold text-[#F2EDE4]">
              Todas as ordens ativas foram concluídas.
            </p>
            <p className="text-[11px]">
              Vá até outros cômodos na aba <strong>Explorar</strong> para investigar vestígios.
            </p>
          </div>
        ) : (
          availableMissions.slice(0, 2).map((mission) => {
            const roomMatches =
              !mission.requiredRoomId || mission.requiredRoomId === privateState.currentRoomId;

            return (
              <div
                key={mission.id}
                onClick={() => {
                  sound.playPaperRustle();
                  onSelectMission(mission.id);
                }}
                className="noir-card p-4 hover:border-[#B79A70]/70 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#B79A70] uppercase font-bold tracking-widest bg-[#221D19] px-1.5 py-0.5 rounded border border-[#4A3A32]">
                      {mission.category}
                    </span>
                    {mission.requiredRoomId && (
                      <span className="text-[10px] font-mono text-[#C2B7AA] truncate">
                        • {mission.requiredRoomId}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#F2EDE4] truncate">
                    {mission.title}
                  </h4>
                  <p className="text-[11px] text-[#C2B7AA] line-clamp-1">
                    {mission.description}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#B79A70] flex-shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
