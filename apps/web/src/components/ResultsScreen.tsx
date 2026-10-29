import React from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import { AlibiLogo } from "./ui/AlibiLogo";
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
    <div className="min-h-screen bg-background p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      <div className="space-y-5 pt-4 text-center">
        <AlibiLogo size="md" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs text-investigation font-mono">
          <Trophy className="w-4 h-4 text-investigation" /> RECONSTITUIÇÃO FINAL DOS FATOS
        </div>

        <h1 className="text-3xl font-extrabold font-display text-primary tracking-tight">
          FIM DA INVESTIGAÇÃO
        </h1>

        {/* Verdict Card */}
        <div className="game-panel p-5 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-[10px] font-mono uppercase text-investigation font-bold">
              LAUDO PERICIAL DEFINITIVO
            </span>
            <span className="text-[10px] font-mono text-muted">SALA: {publicState.roomCode}</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed font-sans">
            A investigação na residência foi encerrada. Todos os registros de armadilhas, sabotagens virtuais e depoimentos foram consolidados no dossiê final.
          </p>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2 text-left font-mono">
          <div className="p-3.5 bg-surface-elevated border border-border rounded-xl">
            <span className="text-[9px] text-muted block uppercase">SOBREVIVENTES</span>
            <span className="text-2xl font-bold font-display text-protection">
              {publicState.aliveCount} VIVOS
            </span>
          </div>

          <div className="p-3.5 bg-surface-elevated border border-border rounded-xl">
            <span className="text-[9px] text-muted block uppercase">VÍTIMAS DIGITAIS</span>
            <span className="text-2xl font-bold font-display text-danger">
              {publicState.deadCount} ELIMINADOS
            </span>
          </div>
        </div>

        {/* Evidence Collected */}
        <div className="p-4 game-panel text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5 font-display">
              <FileSearch className="w-4 h-4 text-investigation" /> Dossiê Coletivo
            </span>
            <span className="text-xs font-mono text-investigation font-bold">
              {publicState.publicEvidence.length} Provas Coletadas
            </span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            As evidências recuperadas permitiram aos participantes reconstruir os passos do assassino na casa.
          </p>
        </div>
      </div>

      {/* Restart Button */}
      <div className="pt-4">
        {isHost ? (
          <button
            onClick={() => {
              sound.playTap();
              onRestart();
            }}
            className="w-full py-4 tactile-btn-primary flex items-center justify-center gap-2 text-xs font-display font-bold uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4" /> Iniciar Próxima Partida (Lobby)
          </button>
        ) : (
          <div className="text-center text-xs text-muted font-mono p-3">
            Aguarde o anfitrião reiniciar a próxima rodada no painel dele.
          </div>
        )}
      </div>
    </div>
  );
};
