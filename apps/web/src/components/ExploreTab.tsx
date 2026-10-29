import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView, RoomConfig } from "@alibi/contracts";
import { HouseMap } from "./HouseMap";
import {
  MapPin,
  Search,
  ShieldCheck,
  Radio,
  Eye,
  Check,
  AlertTriangle,
  Compass,
  Footprints,
} from "lucide-react";
import { sound } from "../lib/audio";

interface ExploreTabProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onSetCurrentRoom: (roomId: string) => void;
  onInvestigateRoom: (roomId: string) => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  publicState,
  privateState,
  onSetCurrentRoom,
  onInvestigateRoom,
}) => {
  const [investigating, setInvestigating] = useState(false);
  const currentRoom = publicState.rooms.find((r) => r.id === privateState.currentRoomId);

  const handleInvestigate = () => {
    sound.playTap();
    sound.playScanHum();
    setInvestigating(true);
    setTimeout(() => {
      onInvestigateRoom(privateState.currentRoomId);
      setInvestigating(false);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* TACTICAL HOUSE BLUEPRINT SCHEMATIC */}
      <HouseMap
        rooms={publicState.rooms}
        currentRoomId={privateState.currentRoomId}
        onSelectRoom={onSetCurrentRoom}
      />

      {/* CURRENT LOCATION STATUS CARD */}
      <div className="game-panel p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-investigation text-xs font-mono font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>SENSOR DE PROXIMIDADE</span>
          </div>
          <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-0.5 rounded border border-border">
            CONFIABILIDADE: {privateState.locationReliability.toUpperCase()}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold font-display text-primary">
            {currentRoom?.name || "Ambiente Desconhecido"}
          </h2>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            {currentRoom?.description}
          </p>
        </div>

        {/* PRIMARY ACTION: INVESTIGAR AMBIENTE */}
        <button
          onClick={handleInvestigate}
          disabled={investigating || !currentRoom?.isInvestigationAllowed}
          className="w-full py-3.5 tactile-btn-primary flex items-center justify-center gap-2 text-xs font-display font-bold uppercase tracking-wider active:scale-95 transition-all shadow-lg"
        >
          <Search className="w-4 h-4" />
          <span>
            {investigating ? "Escaneando Ambiente..." : "Investigar Este Ambiente"}
          </span>
        </button>
      </div>

      {/* SAFETY PROTOCOL CARD */}
      <div className="p-3 bg-surface-elevated/80 border border-border rounded-xl text-[11px] text-muted flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-protection shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="text-primary block font-mono text-[10px] uppercase">
            Diretrizes de Segurança Presencial:
          </strong>
          A suíte e o banheiro social possuem checagem na porta (respeite a privacidade). Na área da piscina, mantenha-se em zona seca e segura. 100% digital.
        </div>
      </div>

      {/* MANUAL ROOM SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold font-mono text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-investigation" /> Mudar de Cômodo (Modo Oficial)
          </h3>
          <span className="text-[10px] text-muted font-mono">SELEÇÃO MANUAL</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {publicState.rooms.map((room) => {
            const isCurrent = room.id === privateState.currentRoomId;
            return (
              <button
                key={room.id}
                onClick={() => {
                  sound.playTap();
                  onSetCurrentRoom(room.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-20 active:scale-95 ${
                  isCurrent
                    ? "bg-investigation/15 border-investigation text-primary shadow-hud-cyan"
                    : "bg-surface border-border hover:border-investigation/50 text-secondary"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] font-mono text-muted uppercase">
                    {room.category}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-investigation animate-ping" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold leading-tight font-display truncate ${
                      isCurrent ? "text-investigation" : "text-primary"
                    }`}
                  >
                    {room.name}
                  </h4>
                  <span className="text-[9px] font-mono text-muted block mt-0.5">
                    {isCurrent ? "Presente" : "Mover até aqui"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
