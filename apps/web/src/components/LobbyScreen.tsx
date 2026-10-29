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
import { CharacterPortrait, ConfidentialStamp, NoirSectionHeader } from "./ui/NoirComponents";

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
    <div className="min-h-screen bg-[#0C0B0A] p-4 flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      {/* Brand Header */}
      <div className="space-y-4 pt-2 text-center animate-fade-in-dramatic">
        <DissimuloLogo size="md" />

        {/* Room Code Card (Ficha do Caso) */}
        <div className="noir-card p-4 flex items-center justify-between mt-2">
          <div className="text-left">
            <span className="text-[9px] text-[#B79A70] font-mono uppercase font-bold tracking-[0.2em] block">
              CÓDIGO DE ACESSO AO CASO
            </span>
            <span className="text-2xl font-mono font-bold tracking-widest text-[#F2EDE4]">
              {publicState.roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2.5 bg-[#25201C] hover:bg-[#2F2924] border border-[#4A3A32] rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 active:scale-95 text-[#F2EDE4] transition-all shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-[#B79A70]" />
            <span>{copied ? "Copiado!" : "Copiar"}</span>
          </button>
        </div>
      </div>

      {/* Connected Players Grid 2xN (Retratos da Galeria) */}
      <div className="my-4 space-y-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-[#C2B7AA] px-1 font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <Users className="w-3.5 h-3.5 text-[#B79A70]" /> Participantes Presentes ({publicState.players.length}/8)
          </span>
          <span className="text-[10px] text-[#B79A70]">MÍNIMO 4</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {publicState.players.map((player) => {
            const isMe = player.id === privateState.playerId;
            return (
              <div
                key={player.id}
                className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                  isMe
                    ? "bg-[#221D19] border-[#B79A70]/70 shadow-noir-card"
                    : "bg-[#171411] border-[#4A3A32]"
                }`}
              >
                <CharacterPortrait
                  name={player.name}
                  status="ALIVE"
                  size="md"
                  isReady={player.isReady}
                />

                <div className="w-full flex items-center justify-between px-1 text-[9px] font-mono border-t border-[#4A3A32]/40 pt-1">
                  <span className="text-[#C2B7AA]">
                    {player.isHost ? "ANFITRIÃO" : "INVESTIGADOR"}
                  </span>
                  <span className={player.isReady ? "text-[#73917B] font-bold" : "text-[#C2B7AA]/60"}>
                    {player.isReady ? "CONFIRMADO" : "AGUARDANDO"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {publicState.players.length < 4 && (
          <div className="p-3 rounded-xl border border-dashed border-[#4A3A32] text-center space-y-1 bg-[#12100E]">
            <Clock className="w-4 h-4 text-[#B79A70] mx-auto animate-pulse" />
            <p className="text-xs text-[#C2B7AA] font-serif">
              Aguardando mais participantes para formar quórum (mínimo 4).
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="space-y-3 pt-2 border-t border-[#4A3A32]/60">
        <div className="flex gap-2">
          <button
            onClick={() => {
              sound.playTap();
              onOpenRules();
            }}
            className="flex-1 py-3 noir-btn-secondary text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#B79A70]" />
            <span>Regras do Caso</span>
          </button>

          <button
            onClick={() => {
              sound.playTypewriterClick();
              onSetReady(!isReady);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
              isReady
                ? "bg-[#73917B]/20 text-[#73917B] border-[#73917B]"
                : "bg-[#25201C] text-[#F2EDE4] border-[#4A3A32]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isReady ? "Pronto ✓" : "Confirmar Presença"}</span>
          </button>
        </div>

        {isHost && (
          <button
            onClick={() => {
              sound.playMuffledBell();
              onStartGame();
            }}
            disabled={!canStart}
            className={`w-full py-4 text-sm font-serif font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
              canStart
                ? "noir-btn-primary"
                : "bg-[#1E1915] text-[#C2B7AA]/40 border border-[#3A2E26] cursor-not-allowed"
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{canStart ? "Iniciar o Caso Penal" : "Aguardando Quórum (4+)"}</span>
          </button>
        )}

        {!isHost && (
          <p className="text-center text-[10px] font-mono text-[#C2B7AA]">
            Aguardando o anfitrião dar a ordem de início da partida.
          </p>
        )}
      </div>
    </div>
  );
};
