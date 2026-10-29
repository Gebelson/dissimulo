import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import {
  Clock,
  Vote,
  Skull,
  UserCheck,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { sound } from "../lib/audio";
import { CharacterPortrait, ConfidentialStamp } from "./ui/NoirComponents";

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
    sound.playTypewriterClick();
    setSelectedVote(target);
    onCastVote(target);
    setHasVoted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md noir-card p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200 border-[#9F3D3D]">
        {/* Urgent Meeting Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#4A3A32]">
          <div>
            <span className="text-[10px] font-mono text-[#F1A8A4] uppercase font-bold tracking-[0.2em] block">
              {meeting.reason === "BODY_REPORTED" ? "ALERTA // CORPO REPORTADO" : "CONVOCAÇÃO DE EMERGÊNCIA"}
            </span>
            <h2 className="text-xl font-serif font-bold text-[#F2EDE4]">
              {meeting.isVotingOpen ? "Sessão de Votação" : "Debate Presencial"}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm text-[#F1A8A4] bg-[#2A1114] px-3 py-1.5 rounded-xl border border-[#9F3D3D] font-bold shadow-sm">
            <Clock className="w-4 h-4" />
            <span>{meeting.timeRemainingSeconds}s</span>
          </div>
        </div>

        {/* Discovery Context */}
        <div className="p-3.5 bg-[#14110E] rounded-xl border border-[#4A3A32] text-xs text-[#C2B7AA] space-y-1 font-mono">
          <div>
            <strong>CONVOCADO POR:</strong> <span className="text-[#F2EDE4] font-bold">{caller?.name || "Sistema"}</span>
          </div>
          {victim && (
            <div className="text-[#F1A8A4] flex items-center gap-1.5 pt-1">
              <Skull className="w-4 h-4" />
              <span>VÍTIMA ENCONTRADA: <strong>{victim.name}</strong></span>
            </div>
          )}
        </div>

        {/* Directives for Real House Deliberation */}
        <div className="p-3 bg-[#1C1814] border border-[#B79A70]/40 rounded-xl text-xs space-y-1 text-[#C2B7AA]">
          <p className="font-serif font-bold text-[#F2EDE4] text-sm">
            Discutam os álibis e as contradições presencialmente na Sala.
          </p>
          <p className="text-[11px] leading-relaxed">
            Consulte seu Dossiê para cruzar depoimentos de horários antes de selar seu voto na urna.
          </p>
        </div>

        {/* Voting Ballot */}
        {meeting.isVotingOpen ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#C2B7AA] px-1">
              <span className="font-bold text-[#F2EDE4] flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-[#B79A70]" /> Urna de Acusação
              </span>
              <span className="text-[#B79A70]">
                {hasVoted ? "VOTO PROTOCOLADO" : isDead ? "ECOS NÃO VOTAM" : "ESCOLHA UM SUSPEITO"}
              </span>
            </div>

            {isDead && (
              <div className="p-3 bg-[#161A22] rounded-xl border border-[#7B849D] text-center text-xs text-[#7B849D] font-serif">
                Participantes no modo Eco acompanham a sessão de julgamento sem direito a voto.
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {publicState.players
                .filter((p) => p.status === "ALIVE")
                .map((candidate) => {
                  const isSelected = selectedVote === candidate.id;
                  return (
                    <button
                      key={candidate.id}
                      onClick={() => handleVote(candidate.id)}
                      disabled={isDead || hasVoted}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all ${
                        isSelected
                          ? "bg-[#3D1418] border-[#F1A8A4] ring-2 ring-[#9F3D3D] shadow-noir-crimson"
                          : "bg-[#171411] border-[#4A3A32] hover:border-[#B79A70]/70"
                      } ${isDead || hasVoted ? "cursor-default" : "cursor-pointer active:scale-95"}`}
                    >
                      <CharacterPortrait name={candidate.name} status="ALIVE" size="md" />

                      <span className="text-xs font-serif font-bold text-[#F2EDE4] truncate max-w-full">
                        {candidate.name}
                      </span>

                      {!hasVoted && !isDead && (
                        <span className="text-[10px] font-mono text-[#B79A70] underline">
                          Votar neste suspeito
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Skip Option */}
            {!isDead && !hasVoted && (
              <button
                onClick={() => handleVote("SKIP")}
                className="w-full py-3 rounded-xl border border-[#4A3A32] bg-[#221D19] hover:bg-[#2A231C] text-xs font-serif text-[#C2B7AA] uppercase tracking-wider font-semibold active:scale-95 transition-all"
              >
                Pular Votação (Provas Insuficientes)
              </button>
            )}

            {hasVoted && (
              <div className="p-3 bg-[#14231A] rounded-xl border border-[#73917B] text-center text-xs font-serif text-[#73917B]">
                Seu voto confidencial foi lacrado na urna. Aguarde os demais participantes.
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#C2B7AA] space-y-2 noir-card">
            <Clock className="w-8 h-8 text-[#B79A70] mx-auto animate-pulse" />
            <p className="font-serif font-bold text-[#F2EDE4] text-sm">
              Fase de Debate Oral Presencial em Andamento
            </p>
            <p className="text-[11px]">
              A votação formal será liberada automaticamente assim que o cronômetro de discussão expirar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
