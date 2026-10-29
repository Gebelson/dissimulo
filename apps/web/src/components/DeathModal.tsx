import React from "react";
import { Skull, AlertTriangle, KeyRound, EyeOff } from "lucide-react";
import { sound } from "../lib/audio";
import { ConfidentialStamp } from "./ui/NoirComponents";

interface DeathModalProps {
  deathCode?: string;
  onDismiss: () => void;
}

export const DeathModal: React.FC<DeathModalProps> = ({ deathCode, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#070605] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 select-none">
      {/* Background Red Stain / Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-[#4A1616]/30 via-transparent to-transparent pointer-events-none" />

      {/* Abstract Red Wax Lacre Symbol */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#2D0F12] border border-[#9F3D3D] flex items-center justify-center shadow-noir-crimson">
          <Skull className="w-9 h-9 text-[#F1A8A4]" />
        </div>
      </div>

      <span className="text-[10px] font-mono tracking-[0.25em] text-[#9F3D3D] uppercase font-bold mb-2 block">
        REGISTRO DE ÓBITO CONFIDENCIAL
      </span>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F2EDE4] mb-3 tracking-wide">
        VOCÊ FOI ASSASSINADO
      </h1>

      <p className="text-xs text-[#C2B7AA] max-w-xs leading-relaxed mb-6 font-sans">
        A tarefa que você iniciou era uma armadilha fatal meticulosamente armada pelo assassino.
      </p>

      {/* DISCOVERY CONFIRMATION CODE */}
      {deathCode && (
        <div className="noir-panel-threat p-5 rounded-2xl w-full max-w-xs mb-6 shadow-2xl border-[#9F3D3D]">
          <span className="text-[9px] font-mono text-[#F1A8A4] uppercase font-bold tracking-widest block mb-1">
            CÓDIGO DE IDENTIFICAÇÃO DO CORPO
          </span>
          <div className="flex justify-center gap-2 my-2.5">
            {deathCode.split("").map((digit, i) => (
              <span
                key={i}
                className="w-12 h-14 rounded-xl bg-[#0C0B0A] border border-[#9F3D3D] flex items-center justify-center text-3xl font-mono font-bold text-[#F1A8A4] shadow-inner"
              >
                {digit}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-[#C2B7AA] font-mono mt-1 block">
            Informe este código verbalmente ao primeiro participante que encontrar seu corpo.
          </span>
        </div>
      )}

      {/* NOIR DIRECTIVES */}
      <div className="p-4 bg-[#14110E] border border-[#4A3A32] rounded-xl text-left text-xs text-[#C2B7AA] max-w-xs space-y-2 mb-6 font-sans">
        <div className="flex items-start gap-2">
          <EyeOff className="w-4 h-4 text-[#B79A70] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Sigilo Absoluto:</strong> Não fale, não faça gestos e não revele quem você suspeita ter armado a armadilha.
          </p>
        </div>
        <p className="text-[11px] text-[#C2B7AA]/80 pl-6">
          Quando o corpo for periciado, você retornará como <strong>Eco Espectral</strong> para resolver enigmas silenciosos.
        </p>
      </div>

      <button
        onClick={() => {
          sound.playPaperRustle();
          onDismiss();
        }}
        className="w-full max-w-xs py-3.5 noir-btn-secondary text-xs uppercase tracking-widest font-serif font-bold"
      >
        Aguardar no Local
      </button>
    </div>
  );
};
