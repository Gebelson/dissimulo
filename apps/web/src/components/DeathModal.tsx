import React from "react";
import { Skull, AlertTriangle, KeyRound } from "lucide-react";
import { sound } from "../lib/audio";

interface DeathModalProps {
  deathCode?: string;
  onDismiss: () => void;
}

export const DeathModal: React.FC<DeathModalProps> = ({ deathCode, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-full bg-danger/20 border-2 border-danger flex items-center justify-center mb-6 shadow-2xl shadow-danger/50 animate-pulse">
        <Skull className="w-10 h-10 text-danger" />
      </div>

      <span className="text-xs font-mono tracking-widest text-danger uppercase font-bold mb-2">
        SISTEMA PERICIAL — FALHA CRÍTICA
      </span>

      <h1 className="text-2xl font-bold font-display text-primary mb-3">
        VOCÊ FOI ELIMINADO
      </h1>

      <p className="text-xs text-secondary max-w-xs leading-relaxed mb-6">
        A missão que você iniciou continha uma armadilha digital fatal armada pelo assassino.
      </p>

      {/* Code to show to body discoverer */}
      {deathCode && (
        <div className="bg-surface border border-danger/40 p-4 rounded-2xl w-full max-w-xs mb-6">
          <span className="text-[10px] text-secondary uppercase font-bold block mb-1">
            CÓDIGO DE CONFIRMAÇÃO DO CORPO
          </span>
          <span className="text-3xl font-mono font-bold tracking-widest text-danger block">
            {deathCode}
          </span>
          <span className="text-[10px] text-secondary mt-1 block">
            Mostre este código para quem encontrar você.
          </span>
        </div>
      )}

      <div className="p-4 bg-surface-elevated border border-border rounded-xl text-left text-xs text-secondary max-w-xs space-y-2 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
          <span>Não revele como ou onde morreu. Apenas permaneça no local.</span>
        </div>
        <div className="flex items-start gap-2">
          <KeyRound className="w-4 h-4 text-investigation shrink-0 mt-0.5" />
          <span>Após o relato do corpo, você continuará na partida como ECO.</span>
        </div>
      </div>

      <button
        onClick={() => {
          sound.playTap();
          onDismiss();
        }}
        className="w-full max-w-xs py-3 bg-surface-elevated border border-border text-primary hover:border-danger rounded-xl text-xs font-bold active:scale-95"
      >
        Entendido (Continuar em Silêncio)
      </button>
    </div>
  );
};
