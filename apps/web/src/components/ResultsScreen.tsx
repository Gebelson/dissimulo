import React from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import {
  Trophy,
  Skull,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
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
    <div className="min-h-screen bg-background p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe">
      <div className="space-y-6 pt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs text-investigation font-mono">
          <Trophy className="w-4 h-4 text-investigation" /> RECONSTITUIÇÃO FINAL
        </div>

        <h1 className="text-3xl font-bold font-display text-primary">
          FIM DA PARTIDA
        </h1>

        {/* Victory/Defeat Card */}
        <div className="forensic-panel p-5 space-y-3">
          <span className="text-[10px] font-mono uppercase text-secondary font-bold block">
            VEREDITO PERICIAL
          </span>
          <p className="text-xs text-secondary leading-relaxed">
            A investigação na casa foi concluída. Todos os registros de armadilhas, mortes e perícias foram revelados no dossiê final.
          </p>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2 text-left font-mono">
          <div className="p-3 bg-surface-elevated border border-border rounded-xl">
            <span className="text-[10px] text-secondary block">SOBREVIVENTES</span>
            <span className="text-xl font-bold text-protection">
              {publicState.aliveCount}
            </span>
          </div>
          <div className="p-3 bg-surface-elevated border border-border rounded-xl">
            <span className="text-[10px] text-secondary block">ELIMINADOS</span>
            <span className="text-xl font-bold text-danger">
              {publicState.deadCount}
            </span>
          </div>
        </div>

        {/* Evidence Discovered count */}
        <div className="p-4 bg-surface border border-border rounded-xl text-left text-xs space-y-1">
          <div className="font-bold text-primary">Dossiê Criminal Consolidado</div>
          <div className="text-secondary text-[11px]">
            {publicState.publicEvidence.length} provas compartilhadas no relatório coletivo.
          </div>
        </div>
      </div>

      {/* Restart */}
      <div className="pt-4">
        {isHost ? (
          <button
            onClick={() => {
              sound.playTap();
              onRestart();
            }}
            className="w-full py-3.5 bg-investigation text-background font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-investigation/20"
          >
            <RotateCcw className="w-4 h-4" /> Iniciar Nova Rodada
          </button>
        ) : (
          <div className="text-center text-xs text-secondary p-3">
            Aguarde o anfitrião reiniciar a próxima rodada.
          </div>
        )}
      </div>
    </div>
  );
};
