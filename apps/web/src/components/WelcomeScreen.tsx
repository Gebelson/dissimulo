import React, { useState } from "react";
import { DissimuloLogo } from "./ui/DissimuloLogo";
import { sound } from "../lib/audio";
import { KeyRound, User, HelpCircle, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  initialRoomCode: string;
  initialPlayerName: string;
  onJoin: (roomCode: string, playerName: string) => void;
  onOpenRules: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  initialRoomCode,
  initialPlayerName,
  onJoin,
  onOpenRules,
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [mode, setMode] = useState<"SELECT" | "JOIN" | "CREATE">("SELECT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;
    sound.playTypewriterClick();
    localStorage.setItem("dissimulo_name", playerName.trim());
    onJoin(roomCode.trim().toUpperCase(), playerName.trim());
  };

  const handleCreateQuickRoom = () => {
    const randomCode = `MANOR${Math.floor(10 + Math.random() * 90)}`;
    setRoomCode(randomCode);
    setMode("CREATE");
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] flex flex-col justify-between items-center p-4 max-w-md mx-auto select-none pt-safe pb-safe relative overflow-hidden">
      {/* Background Manor Silhouette & Moonlight Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          className="w-full h-48 absolute top-0 text-[#1C1814]"
          viewBox="0 0 400 160"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Distant Trees & Nocturnal Horizon */}
          <path
            d="M0 160V120C30 115 50 130 90 110C120 95 150 105 180 85L190 70L200 60L210 70L220 85C250 105 280 95 310 110C350 130 370 115 400 120V160H0Z"
            fill="currentColor"
          />
          {/* Victorian Manor Gable Silhouette */}
          <path
            d="M170 130V90H185V75L200 55L215 75V90H230V130H170Z"
            fill="#120F0D"
          />
          {/* Subtle warm amber window light */}
          <rect x="195" y="80" width="10" height="12" rx="2" fill="#B79A70" opacity="0.3" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C0B0A]/80 to-[#0C0B0A]" />
      </div>

      {/* Top Bar with Rules/Help */}
      <div className="w-full flex justify-end z-10 pt-2">
        <button
          onClick={() => {
            sound.playTap();
            onOpenRules();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1814] border border-[#4A3A32] text-xs text-[#C2B7AA] hover:text-[#F2EDE4] active:scale-95 transition-all shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#B79A70]" />
          <span className="font-serif">Manual do Caso</span>
        </button>
      </div>

      {/* Hero & Logo */}
      <div className="z-10 my-auto w-full flex flex-col items-center space-y-6 animate-fade-in-dramatic">
        <DissimuloLogo size="lg" />

        {/* MODE: INITIAL SELECT (ENTRAR OU CRIAR) */}
        {mode === "SELECT" && (
          <div className="w-full space-y-3 pt-4">
            <div className="p-4 rounded-xl bg-[#171411]/90 border border-[#4A3A32] text-center space-y-1.5 shadow-noir-card">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B79A70]">
                JOGO PRESENCIAL DE INVESTIGAÇÃO
              </span>
              <p className="text-xs text-[#C2B7AA] leading-relaxed">
                Um assassinato virtual ocorrerá nesta residência. Realize perícias nos cômodos reais, encontre provas e descubra quem mente.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setMode("JOIN");
              }}
              className="w-full py-4 noir-btn-primary flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold shadow-lg"
            >
              <KeyRound className="w-4 h-4 text-[#F1A8A4]" />
              <span>Entrar em Partida</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playTap();
                handleCreateQuickRoom();
              }}
              className="w-full py-3.5 noir-btn-secondary flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B79A70]" />
              <span>Criar Nova Partida (Anfitrião)</span>
            </button>
          </div>
        )}

        {/* MODE: JOIN OR CREATE FORM (FICHA POLICIAL) */}
        {(mode === "JOIN" || mode === "CREATE") && (
          <div className="w-full noir-card p-6 shadow-2xl space-y-5 border-[#4A3A32] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#4A3A32]/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="stamp-confidential text-[9px]">FICHA #01</span>
                <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                  {mode === "CREATE" ? "NOVO PROCESSO DE INVESTIGAÇÃO" : "IDENTIFICAÇÃO DO PARTICIPANTE"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMode("SELECT")}
                className="text-[11px] text-[#C2B7AA] hover:text-[#F2EDE4] font-mono underline"
              >
                Voltar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-[#C2B7AA] uppercase font-bold tracking-wider block mb-1.5">
                  SEU NOME / CODINOME:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#B79A70] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ex: Inspetor Arthur"
                    maxLength={20}
                    className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-xl pl-9 pr-3 py-3 text-sm text-[#F2EDE4] placeholder-[#C2B7AA]/40 outline-none focus:border-[#B79A70] font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#C2B7AA] uppercase font-bold tracking-wider block mb-1.5">
                  CÓDIGO DO CASO (SALA):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#B79A70] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Ex: CASA8"
                    maxLength={10}
                    className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-xl pl-9 pr-3 py-3 text-base font-mono font-bold text-[#F2EDE4] tracking-widest uppercase outline-none focus:border-[#B79A70]"
                    required
                  />
                </div>
                {mode === "CREATE" && (
                  <p className="text-[10px] text-[#B79A70] mt-1 font-mono">
                    Compartilhe este código com os outros 7 participantes.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 noir-btn-primary rounded-xl font-serif font-bold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <span>{mode === "CREATE" ? "Abrir Dossiê da Partida" : "Conectar ao Caso"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Metadata */}
      <div className="z-10 py-2 text-center">
        <span className="text-[10px] font-mono text-[#C2B7AA]/60 tracking-widest uppercase">
          REQUISITO: 8 JOGADORES NA MESMA RESIDÊNCIA
        </span>
      </div>
    </div>
  );
};
