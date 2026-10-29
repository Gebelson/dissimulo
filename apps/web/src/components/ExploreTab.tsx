import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView, RoomConfig } from "@alibi/contracts";
import {
  MapPin,
  Search,
  ShieldCheck,
  Radio,
  Eye,
  Check,
  AlertTriangle,
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
    setInvestigating(true);
    setTimeout(() => {
      onInvestigateRoom(privateState.currentRoomId);
      setInvestigating(false);
    }, 800);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Current Room Banner */}
      <div className="forensic-panel p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-investigation text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Presença Indoor</span>
          </div>
          <span className="text-[10px] font-mono text-secondary bg-surface-elevated px-2 py-0.5 rounded border border-border">
            CONFIABILIDADE: {privateState.status === "ALIVE" ? "DECLARADA" : "INATIVA"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary font-display">
              {currentRoom?.name || "Ambiente Desconhecido"}
            </h2>
            <p className="text-xs text-secondary mt-0.5">{currentRoom?.description}</p>
          </div>
        </div>

        {/* Action Button: Perícia no Ambiente */}
        <button
          onClick={handleInvestigate}
          disabled={investigating || !currentRoom?.isInvestigationAllowed}
          className="w-full py-2.5 bg-investigation text-background hover:bg-investigation/90 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shadow-investigation/20"
        >
          <Search className="w-4 h-4" />
          <span>
            {investigating ? "Escaneando ambiente..." : "Investigar Este Ambiente"}
          </span>
        </button>
      </div>

      {/* House Safety Guidelines Note */}
      <div className="p-3 bg-surface-elevated border border-border rounded-xl text-[11px] text-secondary flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-protection shrink-0 mt-0.5" />
        <div>
          <strong className="text-primary block">Regra de Convivência Presencial:</strong>
          Suíte e Banheiro Social têm interações virtuais na porta. Área da Piscina apenas em zona seca. Não toque em equipamentos elétricos reais.
        </div>
      </div>

      {/* Room Selector & Schematic Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
          Mudar de Ambiente (Modo Manual Oficial)
        </h3>
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
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 ${
                  isCurrent
                    ? "bg-surface-elevated border-investigation shadow-md shadow-investigation/10"
                    : "bg-surface border-border hover:border-investigation/50 active:scale-95"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-secondary uppercase">
                    {room.category}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-investigation animate-ping" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold leading-tight ${
                      isCurrent ? "text-investigation" : "text-primary"
                    }`}
                  >
                    {room.name}
                  </h4>
                  <span className="text-[10px] text-secondary block mt-0.5">
                    {isCurrent ? "Você está aqui" : "Tocar para entrar"}
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
