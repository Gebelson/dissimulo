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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-alert/40 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-alert">
            <Siren className="w-6 h-6 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono text-secondary uppercase block">
                {meeting.reason === "BODY_REPORTED" ? "CORPO ENCONTRADO" : "REUNIÃO DE EMERGÊNCIA"}
              </span>
              <h2 className="text-base font-bold text-primary font-display">
                {meeting.isVotingOpen ? "ETAPA DE VOTAÇÃO" : "DISCUSSÃO PRESENCIAL"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono text-sm text-alert bg-alert/10 px-2.5 py-1 rounded-xl border border-alert/30">
            <Clock className="w-4 h-4" />
            <span>{meeting.timeRemainingSeconds}s</span>
          </div>
        </div>

        {/* Meeting context */}
        <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1">
          <div>
            <strong>Convocado por:</strong> {caller?.name || "Sistema"}
          </div>
          {victim && (
            <div className="text-danger flex items-center gap-1">
              <Skull className="w-3.5 h-3.5" />
              <span>
                <strong>Vítima descoberta:</strong> {victim.name}
              </span>
            </div>
          )}
        </div>

        {/* Warning for dead players */}
        {isDead && (
          <div className="p-3 bg-eco/10 border border-eco/30 rounded-xl text-eco text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Você está no Modo Eco. Acompanhe a reunião, mas você não possui direito a voto.</span>
          </div>
        )}

        {/* Voting Booth */}
        {meeting.isVotingOpen && !isDead && (
          <div className="space-y-2">
            <span className="text-xs text-secondary uppercase font-bold block">
              Escolha seu voto formal:
            </span>

            {hasVoted ? (
              <div className="p-4 bg-protection/10 border border-protection/30 rounded-xl text-center text-xs text-protection font-bold">
                ✓ Seu voto foi registrado com sigilo no servidor.
              </div>
            ) : (
              <div className="space-y-1.5">
                {publicState.players
                  .filter((p) => p.status === "ALIVE")
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleVote(player.id)}
                      className="w-full p-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-primary hover:border-alert active:scale-95 flex items-center justify-between"
                    >
                      <span>Votar em: {player.name}</span>
                      <Vote className="w-4 h-4 text-secondary" />
                    </button>
                  ))}

                <button
                  onClick={() => handleVote("SKIP")}
                  className="w-full p-2.5 bg-surface-elevated border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary active:scale-95 text-center mt-2"
                >
                  Pular Voto (Abstenção)
                </button>
              </div>
            )}
          </div>
        )}

        {!meeting.isVotingOpen && (
          <div className="p-4 text-center text-xs text-secondary leading-relaxed bg-background/50 rounded-xl border border-border">
            Discutam os álibis e as contradições presencialmente. A votação abrirá automaticamente em instantes.
          </div>
        )}
      </div>
    </div>
  );
};
