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
  XCircle,
  ShieldAlert,
} from "lucide-react";
import { sound } from "../lib/audio";

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
      <div className="w-full max-w-md game-panel p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-investigation">
            <Settings className="w-5 h-5 animate-spin" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-primary">
              Console de Administração
            </h3>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-surface-elevated/90 p-1 rounded-xl border border-border">
          {(["CONTROLS", "ROOMS", "PLAYERS"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playTap();
                setTab(t);
              }}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                tab === t
                  ? "bg-investigation text-background shadow-md shadow-investigation/20"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {t === "CONTROLS" ? "Controle" : t === "ROOMS" ? "Ambientes" : "Conexões"}
            </button>
          ))}
        </div>

        {/* CONTROLS TAB */}
        {tab === "CONTROLS" && (
          <div className="space-y-3">
            <div className="p-3.5 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>CÓDIGO DA SALA:</span>
                <strong className="text-investigation">{publicState.roomCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>FASE DA PARTIDA:</span>
                <strong className="text-primary">{publicState.phase}</strong>
              </div>
              <div className="flex justify-between">
                <span>DURAÇÃO MÁXIMA:</span>
                <strong className="text-primary">{publicState.settings.matchDurationMinutes} min</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  onPause();
                }}
                className="p-3 bg-surface-elevated border border-border rounded-xl text-xs font-bold text-alert hover:border-alert active:scale-95 flex items-center justify-center gap-1.5 font-display uppercase"
              >
                <Pause className="w-4 h-4" /> Pausar Partida
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  onResume();
                }}
                className="p-3 bg-surface-elevated border border-border rounded-xl text-xs font-bold text-protection hover:border-protection active:scale-95 flex items-center justify-center gap-1.5 font-display uppercase"
              >
                <Play className="w-4 h-4" /> Retomar Partida
              </button>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                if (confirm("Deseja realmente reiniciar a partida e voltar todos para o Lobby?")) {
                  onRestart();
                  onClose();
                }
              }}
              className="w-full py-3 tactile-btn-danger text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar Rodada (Lobby)
            </button>
          </div>
        )}

        {/* ROOMS & BEACONS TAB */}
        {tab === "ROOMS" && (
          <div className="space-y-2">
            <span className="text-xs font-mono text-secondary px-1 block">
              CÔMODOS DA RESIDÊNCIA ({publicState.rooms.length})
            </span>
            {publicState.rooms.map((room) => (
              <div key={room.id} className="p-3 bg-background border border-border rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold font-display text-primary">
                  <span>{room.name}</span>
                  <span className="text-[9px] font-mono text-investigation uppercase px-1.5 py-0.5 rounded bg-investigation/10 border border-investigation/30">
                    {room.category}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted">
                  Beacon: UUID {room.beaconConfig?.uuid.slice(0, 15)}... (M:{room.beaconConfig?.major} m:{room.beaconConfig?.minor})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PARTICIPANTS & CONNECTION HEALTH TAB */}
        {tab === "PLAYERS" && (
          <div className="space-y-2">
            <span className="text-xs font-mono text-secondary px-1 block">
              DIAGNÓSTICO DE REDE ({publicState.players.length})
            </span>
            {publicState.players.map((p) => (
              <div key={p.id} className="p-2.5 bg-background border border-border rounded-xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-primary block">{p.name}</span>
                  <span className="text-[10px] text-muted">
                    {p.currentRoomId} ({p.locationReliability})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-protection font-bold text-[10px]">
                  <Wifi className="w-3.5 h-3.5" /> ONLINE
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
