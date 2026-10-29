import React from "react";
import { Skull, AlertTriangle, KeyRound, ShieldAlert } from "lucide-react";
import { sound } from "../lib/audio";

interface DeathModalProps {
  deathCode?: string;
  onDismiss: () => void;
}

export const DeathModal: React.FC<DeathModalProps> = ({ deathCode, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300 select-none">
      {/* Glitch Skull Avatar */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-danger/20 border-2 border-danger flex items-center justify-center shadow-hud-crimson animate-pulse">
          <Skull className="w-12 h-12 text-danger" />
        </div>
        <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded bg-danger text-black text-[9px] font-mono font-extrabold uppercase">
          FATAL
        </span>
      </div>

      <span className="text-[10px] font-mono tracking-widest text-danger uppercase font-extrabold mb-1">
        SISTEMA DE SEGURANÇA // PERÍCIA FORENSE
      </span>

      <h1 className="text-3xl font-extrabold font-display text-primary mb-2 tracking-tight">
        VOCÊ FOI ELIMINADO
      </h1>

      <p className="text-xs text-secondary max-w-xs leading-relaxed mb-6 font-sans">
        A tarefa que você iniciou era uma armadilha digital criada pelo assassino.
      </p>

      {/* DISCOVERY CONFIRMATION CODE */}
      {deathCode && (
        <div className="game-panel-danger p-4 rounded-2xl w-full max-w-xs mb-6 shadow-2xl">
          <span className="text-[9px] font-mono text-secondary uppercase font-bold tracking-widest block mb-1">
            CÓDIGO DE CONFIRMAÇÃO DO CORPO
          </span>
          <div className="flex justify-center gap-2 my-2">
            {deathCode.split("").map((digit, i) => (
              <span
                key={i}
                className="w-12 h-14 rounded-xl bg-background border border-danger/60 flex items-center justify-center text-3xl font-mono font-extrabold text-danger shadow-inner"
              >
                {digit}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-muted font-mono mt-1 block">
            Mostre este código para o participante que encontrar você.
          </span>
        </div>
      )}

      {/* TACTICAL DIRECTIVES */}
      <div className="p-3.5 bg-surface-elevated border border-border rounded-xl text-left text-xs text-secondary max-w-xs space-y-2 mb-6 font-sans">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
          <span>Permaneça em silêncio. Não revele quem é o assassino ou onde foi eliminado.</span>
        </div>
        <div className="flex items-start gap-2">
          <KeyRound className="w-4 h-4 text-investigation shrink-0 mt-0.5" />
          <span>Após o relato do corpo, você continuará na partida como <strong>ECO</strong>.</span>
        </div>
      </div>

      <button
        onClick={() => {
          sound.playTap();
          onDismiss();
        }}
        className="w-full max-w-xs py-3.5 tactile-btn-surface text-xs font-bold font-display uppercase tracking-wider active:scale-95 transition-all"
      >
        Silenciar Terminal (Permanecer no Local)
      </button>
    </div>
  );
};
