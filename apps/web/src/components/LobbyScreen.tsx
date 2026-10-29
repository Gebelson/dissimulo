import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
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
    <div className="min-h-screen bg-background p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe">
      {/* Brand Header */}
      <div className="space-y-4 pt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs text-investigation font-mono">
          <Shield className="w-3.5 h-3.5" /> ÁLIBI // FORENSIC NOIR
        </div>

        <h1 className="text-3xl font-bold font-display tracking-tight text-primary">
          ÁLIBI
        </h1>
        <p className="text-xs text-secondary italic">
          "Ninguém tem a história inteira."
        </p>

        {/* Room Code Banner */}
        <div className="forensic-panel p-4 flex items-center justify-between mt-4">
          <div className="text-left">
            <span className="text-[10px] text-secondary font-mono uppercase block">
              CÓDIGO DE ACESSO DA SALA
            </span>
            <span className="text-2xl font-mono font-bold tracking-widest text-investigation">
              {publicState.roomCode}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2.5 bg-surface-elevated hover:bg-surface border border-border rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 text-secondary hover:text-primary"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copiado!" : "Copiar"}</span>
          </button>
        </div>
      </div>

      {/* Players List */}
      <div className="my-6 space-y-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-secondary">
          <span className="flex items-center gap-1.5 font-bold">
            <Users className="w-4 h-4 text-investigation" /> Participantes na Casa (
            {publicState.players.length}/8)
          </span>
          <span className="font-mono text-[10px]">MÍNIMO 4 JOGADORES</span>
        </div>

        <div className="space-y-2">
          {publicState.players.map((player) => {
            const isMe = player.id === privateState.playerId;
            return (
              <div
                key={player.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isMe
                    ? "bg-surface-elevated border-investigation/60 shadow-sm"
                    : "bg-surface border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-xs text-primary font-mono">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      {player.name} {isMe && "(Você)"}
                      {player.isHost && (
                        <span className="text-[9px] font-mono text-investigation bg-investigation/10 px-1 py-0.5 rounded border border-investigation/30">
                          HOST
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-secondary font-mono">
                      {player.isReady ? "Pronto para jogar" : "Aguardando confirmação"}
                    </span>
                  </div>
                </div>

                {player.isReady ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-protection bg-protection/10 px-2 py-1 rounded-lg border border-protection/20 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRONTO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-1 rounded-lg border border-border">
                    PENDENTE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              sound.playTap();
              onOpenRules();
            }}
            className="flex-1 py-2.5 bg-surface-elevated border border-border hover:border-investigation/50 text-secondary hover:text-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-investigation" /> Como Jogar (Tutorial)
          </button>
        </div>

        {/* Ready toggle */}
        <button
          onClick={() => {
            sound.playTap();
            onSetReady(!isReady);
          }}
          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
            isReady
              ? "bg-protection text-background shadow-protection/20"
              : "bg-surface-elevated border border-investigation text-investigation hover:bg-investigation/10"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isReady ? "Você está Pronto!" : "Confirmar Que Estou Pronto"}</span>
        </button>

        {/* Host Start Game button */}
        {isHost && (
          <button
            onClick={() => {
              sound.playTap();
              onStartGame();
            }}
            disabled={!canStart}
            className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-xl transition-all ${
              canStart
                ? "bg-investigation text-background hover:bg-investigation/90 shadow-investigation/20 cursor-pointer"
                : "bg-surface-elevated text-secondary border border-border opacity-50 cursor-not-allowed"
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
