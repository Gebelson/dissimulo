import React from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import { DissimuloLogo } from "./ui/DissimuloLogo";
import {
  Trophy,
  Skull,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  FileSearch,
} from "lucide-react";
import { sound } from "../lib/audio";
import { CharacterPortrait, ConfidentialStamp, EvidenceStamp } from "./ui/NoirComponents";

interface ResultsScreenProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  publicState,
  privateState,
  onRestart,
}) => {
  const me = publicState.players.find((p) => p.id === privateState.playerId);
  const isHost = me?.isHost || false;

  return (
    <div className="min-h-screen bg-[#0C0B0A] p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      <div className="space-y-4 pt-2 text-center animate-fade-in-dramatic">
        <DissimuloLogo size="md" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1814] border border-[#4A3A32] text-xs text-[#B79A70] font-mono">
          <FileSearch className="w-4 h-4 text-[#B79A70]" /> RECONSTITUIÇÃO FINAL DOS FATOS
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#F2EDE4] tracking-wide">
          CASO ENCERRADO
        </h1>

        {/* Verdict Card */}
        <div className="noir-card p-5 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#4A3A32] pb-2.5">
            <span className="stamp-confidential text-[9px]">LAUDO PERICIAL DEFINITIVO</span>
            <span className="text-[10px] font-mono text-[#C2B7AA]">SALA: {publicState.roomCode}</span>
          </div>

          <p className="text-xs text-[#C2B7AA] leading-relaxed font-sans">
            A perícia na residência foi concluída. Os acontecimentos, contradições de horários e armadilhas foram completamente decodificados pelos investigadores.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 text-left font-mono">
          <div className="p-3.5 bg-[#171411] border border-[#4A3A32] rounded-xl">
            <span className="text-[9px] text-[#C2B7AA] block uppercase">SOBREVIVENTES</span>
            <span className="text-2xl font-bold text-[#73917B]">
              {publicState.aliveCount}
            </span>
          </div>

          <div className="p-3.5 bg-[#171411] border border-[#4A3A32] rounded-xl">
            <span className="text-[9px] text-[#C2B7AA] block uppercase">VÍTIMAS FATAIS</span>
            <span className="text-2xl font-bold text-[#F1A8A4]">
              {publicState.deadCount}
            </span>
          </div>
        </div>

        {/* Suspects Final Status */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-mono text-[#C2B7AA] uppercase tracking-wider block px-1">
            ESTADO FINAL DOS PARTICIPANTES:
          </span>

          <div className="grid grid-cols-4 gap-2">
            {publicState.players.map((p) => (
              <div key={p.id} className="noir-card p-2 text-center flex flex-col items-center">
                <CharacterPortrait name={p.name} status={p.status} size="sm" />
                <span className="text-[10px] font-serif font-bold text-[#F2EDE4] truncate max-w-full mt-1">
                  {p.name}
                </span>
                <span
                  className={`text-[8px] font-mono uppercase font-bold mt-0.5 ${
                    p.status === "ALIVE" ? "text-[#73917B]" : "text-[#9F3D3D]"
                  }`}
                >
                  {p.status === "ALIVE" ? "VIVO" : "FALECIDO"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Host Restart Action */}
      <div className="pt-4 border-t border-[#4A3A32]/60">
        {isHost ? (
          <button
            onClick={() => {
              sound.playMuffledBell();
              onRestart();
            }}
            className="w-full py-4 noir-btn-primary rounded-xl font-serif font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Iniciar Novo Caso (Reiniciar)</span>
          </button>
        ) : (
          <p className="text-center text-xs font-mono text-[#C2B7AA]">
            Aguardando o anfitrião reiniciar o caso para uma nova partida.
          </p>
        )}
      </div>
    </div>
  );
};
