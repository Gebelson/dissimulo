import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import {
  Siren,
  Clock,
  Vote,
  Skull,
  UserCheck,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { sound } from "../lib/audio";

interface MeetingModalProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onCastVote: (targetIdOrSkip: string) => void;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  publicState,
  privateState,
  onCastVote,
}) => {
  const meeting = publicState.activeMeeting;
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  if (!meeting) return null;

  const isDead = privateState.status !== "ALIVE";
  const caller = publicState.players.find((p) => p.id === meeting.calledByPlayerId);
  const victim = meeting.discoveredBodyPlayerId
    ? publicState.players.find((p) => p.id === meeting.discoveredBodyPlayerId)
    : null;

  const handleVote = (target: string) => {
    if (isDead || hasVoted) return;
    sound.playTap();
    setSelectedVote(target);
    onCastVote(target);
    setHasVoted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md game-panel p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200">
        {/* Urgent Emergency Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5 text-alert">
            <div className="w-9 h-9 rounded-xl bg-alert/15 border border-alert/30 flex items-center justify-center shadow-hud-amber">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-secondary uppercase font-bold tracking-widest block">
                {meeting.reason === "BODY_REPORTED" ? "ALERTA // CORPO REPORTADO" : "CONVOCAÇÃO EXTRAORDINÁRIA"}
              </span>
              <h2 className="text-base font-bold font-display text-primary">
                {meeting.isVotingOpen ? "SESSÃO DE VOTAÇÃO" : "DEBATE PRESENCIAL"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm text-alert bg-alert/15 px-3 py-1.5 rounded-xl border border-alert/30 font-bold">
            <Clock className="w-4 h-4 animate-spin" />
            <span>{meeting.timeRemainingSeconds}s</span>
          </div>
        </div>

        {/* Discovery Context */}
        <div className="p-3.5 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1 font-mono">
          <div>
            <strong>CONVOCADO POR:</strong> <span className="text-primary">{caller?.name || "Sistema Automático"}</span>
          </div>
          {victim && (
            <div className="text-danger flex items-center gap-1.5 pt-1">
              <Skull className="w-4 h-4" />
              <span>
                <strong>VÍTIMA ENCONTRADA:</strong> {victim.name}
              </span>
            </div>
          )}
        </div>

        {/* Eco / Spectator Notice */}
        {isDead && (
          <div className="p-3 bg-eco/10 border border-eco/30 rounded-xl text-eco text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Você está em Modo Eco. Seu direito de voto formal está suspenso.</span>
          </div>
        )}

        {/* Voting Session */}
        {meeting.isVotingOpen && !isDead && (
          <div className="space-y-2.5">
            <span className="text-xs font-mono text-secondary uppercase font-bold tracking-wider block">
              Selecione o Suspeito para Acusação:
            </span>

            {hasVoted ? (
              <div className="p-4 bg-protection/15 border border-protection/40 rounded-xl text-center text-xs text-protection font-bold font-mono space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                <p>VOTO REGISTRADO COM SIGILO NA URNA DIGITAL</p>
                <p className="text-[11px] text-muted">Aguarde o encerramento do tempo da sessão.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {publicState.players
                  .filter((p) => p.status === "ALIVE")
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleVote(player.id)}
                      className="w-full p-3 bg-surface-elevated border border-border hover:border-alert active:scale-95 rounded-xl text-xs font-bold text-primary flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center font-mono text-[11px]">
                          {player.name.charAt(0)}
                        </div>
                        <span className="font-display">{player.name}</span>
                      </div>
                      <Vote className="w-4 h-4 text-alert" />
                    </button>
                  ))}

                <button
                  onClick={() => handleVote("SKIP")}
                  className="w-full py-2.5 bg-background border border-border text-secondary hover:text-primary rounded-xl text-xs font-mono font-bold active:scale-95 text-center mt-2"
                >
                  Abster-se de Votar (Pular)
                </button>
              </div>
            )}
          </div>
        )}

        {!meeting.isVotingOpen && (
          <div className="p-5 text-center text-xs text-secondary leading-relaxed bg-background/50 rounded-xl border border-border space-y-2">
            <p className="font-semibold text-primary">Discutam os álibis e as contradições presencialmente na Sala.</p>
            <p className="text-muted text-[11px]">A urna de votação secreta será aberta automaticamente assim que o cronômetro zerar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
