import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import { DissimuloLogo } from "./ui/DissimuloLogo";
import {
  Users,
  Play,
  CheckCircle2,
  Copy,
  BookOpen,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { sound } from "../lib/audio";

interface LobbyScreenProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onSetReady: (ready: boolean) => void;
  onStartGame: () => void;
  onOpenRules: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  publicState,
  privateState,
  onSetReady,
  onStartGame,
  onOpenRules,
}) => {
  const [copied, setCopied] = useState(false);
  const me = publicState.players.find((p) => p.id === privateState.playerId);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;
  const canStart = publicState.players.length >= 4;

  const handleCopyCode = () => {
    sound.playTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicState.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      {/* Brand Header */}
      <div className="space-y-4 pt-4 text-center">
        <DissimuloLogo size="lg" />

        {/* Room Code Card */}
        <div className="game-panel p-4 flex items-center justify-between mt-4">
          <div className="text-left">
            <span className="text-[9px] text-muted font-mono uppercase font-bold tracking-widest block">
              CÓDIGO DE ENTRADA NA SALA
            </span>
            <span className="text-3xl font-mono font-extrabold tracking-widest text-investigation">
              {publicState.roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-2 bg-surface-elevated hover:bg-surface border border-border rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 active:scale-95 text-secondary hover:text-primary transition-all"
          >
            <Copy className="w-4 h-4 text-investigation" />
            <span>{copied ? "Copiado!" : "Copiar"}</span>
          </button>
        </div>
      </div>

      {/* Connected Players List */}
      <div className="my-5 space-y-2.5 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-secondary px-1 font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <Users className="w-4 h-4 text-investigation" /> Participantes ({publicState.players.length}/8)
          </span>
          <span className="text-[10px] text-muted">MÍNIMO 4 JOGADORES</span>
        </div>

        <div className="space-y-2">
          {publicState.players.map((player) => {
            const isMe = player.id === privateState.playerId;
            return (
              <div
                key={player.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isMe
                    ? "bg-investigation/10 border-investigation/60 shadow-sm"
                    : "bg-surface border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-primary font-mono shadow-inner">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary font-display flex items-center gap-1.5">
                      {player.name} {isMe && <span className="text-[10px] text-investigation font-mono">(Você)</span>}
                      {player.isHost && (
                        <span className="text-[9px] font-mono text-investigation bg-investigation/10 px-1 py-0.2 rounded border border-investigation/30 font-bold">
                          HOST
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-muted font-mono block">
                      {player.isReady ? "Pronto para jogar" : "Aguardando confirmação"}
                    </span>
                  </div>
                </div>

                {player.isReady ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-protection bg-protection/15 px-2.5 py-1 rounded-lg border border-protection/30 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRONTO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted bg-surface-elevated px-2 py-0.5 rounded border border-border">
                    PENDENTE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => {
            sound.playTap();
            onOpenRules();
          }}
          className="w-full py-2.5 bg-surface-elevated border border-border hover:border-investigation/50 text-secondary hover:text-primary rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-investigation" /> Como Jogar (Briefing e Regras)
        </button>

        {/* Ready Toggle Button */}
        <button
          onClick={() => {
            sound.playTap();
            onSetReady(!isReady);
          }}
          className={`w-full py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
            isReady
              ? "tactile-btn-surface border-protection text-protection"
              : "tactile-btn-primary"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isReady ? "Você está Pronto!" : "Confirmar Que Estou Pronto"}</span>
        </button>

        {/* Host Start Game Button */}
        {isHost && (
          <button
            onClick={() => {
              sound.playTap();
              onStartGame();
            }}
            disabled={!canStart}
            className={`w-full py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl ${
              canStart
                ? "tactile-btn-primary"
                : "bg-surface-elevated text-muted border border-border opacity-50 cursor-not-allowed"
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {canStart
                ? "Iniciar Partida (Sortear Papéis)"
                : `Aguardando Mínimo de 4 Jogadores (${publicState.players.length}/4)`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
