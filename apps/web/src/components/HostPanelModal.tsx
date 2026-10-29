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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-investigation/40 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-investigation">
            <Settings className="w-5 h-5" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-primary">
              Painel do Anfitrião
            </h3>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface-elevated p-1 rounded-xl border border-border">
          {(["CONTROLS", "ROOMS", "PLAYERS"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playTap();
                setTab(t);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === t
                  ? "bg-surface text-investigation shadow-sm border border-border"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {t === "CONTROLS" ? "Controle" : t === "ROOMS" ? "Cômodos" : "Conexões"}
            </button>
          ))}
        </div>

        {/* Controls */}
        {tab === "CONTROLS" && (
          <div className="space-y-3">
            <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-secondary space-y-1 font-mono">
              <div>SALA: {publicState.roomCode}</div>
              <div>FASE: {publicState.phase}</div>
              <div>DURAÇÃO MÁXIMA: {publicState.settings.matchDurationMinutes} min</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  onPause();
                }}
                className="p-3 bg-surface-elevated border border-border rounded-xl text-xs font-bold text-alert hover:border-alert active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Pause className="w-4 h-4" /> Pausar Partida
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  onResume();
                }}
                className="p-3 bg-surface-elevated border border-border rounded-xl text-xs font-bold text-protection hover:border-protection active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4" /> Retomar Partida
              </button>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                if (confirm("Deseja realmente reiniciar a partida para o Lobby?")) {
                  onRestart();
                  onClose();
                }
              }}
              className="w-full p-3 bg-danger/20 border border-danger/40 text-danger rounded-xl text-xs font-bold active:scale-95 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar Rodada (Lobby)
            </button>
          </div>
        )}

        {/* Rooms & Beacons */}
        {tab === "ROOMS" && (
          <div className="space-y-2">
            <span className="text-xs text-secondary block">Ambientes Cadastrados (A Casa)</span>
            {publicState.rooms.map((room) => (
              <div key={room.id} className="p-3 bg-background border border-border rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-primary">
                  <span>{room.name}</span>
                  <span className="text-[10px] font-mono text-investigation uppercase">{room.category}</span>
                </div>
                <div className="text-[10px] font-mono text-secondary">
                  Beacon UUID: {room.beaconConfig?.uuid.slice(0, 18)}... (M:{room.beaconConfig?.major}/m:{room.beaconConfig?.minor})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Players & Health */}
        {tab === "PLAYERS" && (
          <div className="space-y-2">
            <span className="text-xs text-secondary block">Saúde das Conexões</span>
            {publicState.players.map((p) => (
              <div key={p.id} className="p-2.5 bg-background border border-border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-primary block">{p.name}</span>
                  <span className="text-[10px] font-mono text-secondary">
                    Cômodo: {p.currentRoomId} ({p.locationReliability})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-protection font-mono text-[10px]">
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
