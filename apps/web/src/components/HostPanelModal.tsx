import React, { useState } from "react";
import { PublicGameState } from "@alibi/contracts";
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  FileText,
  Sliders,
  X,
  ShieldAlert,
} from "lucide-react";
import { sound } from "../lib/audio";
import { CharacterPortrait, NoirSectionHeader } from "./ui/NoirComponents";

interface HostPanelModalProps {
  publicState: PublicGameState;
  onClose: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export const HostPanelModal: React.FC<HostPanelModalProps> = ({
  publicState,
  onClose,
  onPause,
  onResume,
  onRestart,
}) => {
  const [tab, setTab] = useState<"CONTROLS" | "ROOMS" | "PLAYERS">("CONTROLS");

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md noir-card p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200 border-[#4A3A32]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#4A3A32]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B79A70]" />
            <h3 className="text-base font-serif font-bold uppercase tracking-wider text-[#F2EDE4]">
              Console do Anfitrião
            </h3>
          </div>
          <button onClick={onClose} className="text-[#C2B7AA] hover:text-[#F2EDE4] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#171411] p-1 rounded-xl border border-[#4A3A32]">
          {(["CONTROLS", "ROOMS", "PLAYERS"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playTap();
                setTab(t);
              }}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                tab === t
                  ? "bg-[#2A231C] text-[#F2EDE4] border border-[#B79A70]/60 shadow-sm"
                  : "text-[#C2B7AA] hover:text-[#F2EDE4]"
              }`}
            >
              {t === "CONTROLS" ? "Controles" : t === "ROOMS" ? "Cômodos" : "Rede"}
            </button>
          ))}
        </div>

        {/* TAB 1: CONTROLS */}
        {tab === "CONTROLS" && (
          <div className="space-y-3">
            <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#B79A70] uppercase font-bold block">
                  ESTADO ATUAL DO JOGO
                </span>
                <span className="text-sm font-serif font-bold text-[#F2EDE4]">
                  Fase: {publicState.phase}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    onPause();
                  }}
                  className="px-3 py-1.5 bg-[#25201C] hover:bg-[#2F2924] border border-[#4A3A32] rounded-lg text-xs font-serif font-bold text-[#C2B7AA] flex items-center gap-1 active:scale-95"
                >
                  <Pause className="w-3.5 h-3.5 text-[#B79A70]" />
                  <span>Pausar</span>
                </button>
                <button
                  onClick={() => {
                    sound.playTap();
                    onResume();
                  }}
                  className="px-3 py-1.5 bg-[#25201C] hover:bg-[#2F2924] border border-[#4A3A32] rounded-lg text-xs font-serif font-bold text-[#F2EDE4] flex items-center gap-1 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 text-[#73917B]" />
                  <span>Retomar</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32] space-y-2">
              <span className="text-[10px] font-mono text-[#F1A8A4] uppercase font-bold block">
                ZONA DE REINICIALIZAÇÃO
              </span>
              <p className="text-xs text-[#C2B7AA] leading-relaxed">
                Reiniciar encerra o caso em curso e redistribui novos papéis secretamente a todos os 8 participantes conectados.
              </p>
              <button
                onClick={() => {
                  sound.playMuffledBell();
                  onRestart();
                  onClose();
                }}
                className="w-full py-2.5 noir-btn-danger text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar Partida Agora</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROOMS */}
        {tab === "ROOMS" && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#C2B7AA] uppercase tracking-wider block px-1">
              STATUS DOS 7 AMBIENTES DA RESIDÊNCIA
            </span>
            <div className="space-y-1.5">
              {publicState.rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-2.5 bg-[#14110E] rounded-xl border border-[#4A3A32] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <strong className="text-[#F2EDE4] font-serif block">{room.name}</strong>
                    <span className="text-[10px] text-[#B79A70]">{room.category}</span>
                  </div>
                  <span className="text-[10px] text-[#73917B]">
                    {room.isInvestigationAllowed ? "PERÍCIA PERMITIDA" : "RESTRITO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLAYERS TELEMETRY */}
        {tab === "PLAYERS" && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#C2B7AA] uppercase tracking-wider block px-1">
              CONEXÕES DOS PARTICIPANTES ({publicState.players.length})
            </span>
            <div className="space-y-1.5">
              {publicState.players.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 bg-[#14110E] rounded-xl border border-[#4A3A32] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#73917B]" />
                    <span className="font-serif font-bold text-[#F2EDE4]">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#B79A70]">
                    {p.currentRoomId || "Aguardando"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
