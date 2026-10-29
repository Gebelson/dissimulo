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
import { NoirSectionHeader } from "./ui/NoirComponents";

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
    sound.playPaperRustle();
    setInvestigating(true);
    setTimeout(() => {
      onInvestigateRoom(privateState.currentRoomId);
      setInvestigating(false);
    }, 850);
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in-dramatic">
      <NoirSectionHeader
        title="Exploração da Casa"
        subtitle="Mapeamento de presença e perícia nos 7 ambientes"
        badge="LOCALIZAÇÃO & PERÍCIA"
      />

      {/* HOUSE BLUEPRINT SCHEMATIC */}
      <HouseMap
        rooms={publicState.rooms}
        currentRoomId={privateState.currentRoomId}
        onSelectRoom={onSetCurrentRoom}
      />

      {/* CURRENT LOCATION DOSSIER CARD */}
      <div className="noir-card p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#B79A70] text-xs font-mono font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>AMBIENTE SELECIONADO</span>
          </div>
          <span className="text-[10px] font-mono text-[#C2B7AA] bg-[#221D19] px-2 py-0.5 rounded border border-[#4A3A32]">
            CONFIABILIDADE: {privateState.locationReliability === "beacon" ? "BEACON BLUETOOTH" : "DECLARADO"}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold text-[#F2EDE4]">
            {currentRoom?.name || "Ambiente Desconhecido"}
          </h2>
          <p className="text-xs text-[#C2B7AA] mt-1 leading-relaxed">
            {currentRoom?.description}
          </p>
        </div>

        {/* PRIMARY ACTION: INVESTIGAR AMBIENTE */}
        <button
          onClick={handleInvestigate}
          disabled={investigating || !currentRoom?.isInvestigationAllowed}
          className="w-full py-3.5 noir-btn-primary flex items-center justify-center gap-2 text-xs font-serif font-bold uppercase tracking-widest active:scale-95 transition-all shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>
            {investigating ? "Examinando Vestígios..." : "Investigar Este Ambiente"}
          </span>
        </button>
      </div>

      {/* SAFETY & PHYSICAL PROTOCOL */}
      <div className="p-3 bg-[#1C1814] border border-[#4A3A32] rounded-xl text-[11px] text-[#C2B7AA] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#73917B] shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="text-[#F2EDE4] block font-mono text-[10px] uppercase">
            Protocolo de Segurança Presencial:
          </strong>
          A suíte e o banheiro social possuem checagem na porta (respeite a privacidade). Na área da piscina, permaneça na zona seca. Todas as ações e sabotagens são 100% digitais.
        </div>
      </div>

      {/* MANUAL ROOM SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold font-mono text-[#C2B7AA] uppercase tracking-wider flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-[#B79A70]" />
            <span>Mudar Cômodo Manualmente:</span>
          </h3>
          <span className="text-[10px] text-[#B79A70] font-mono">SELEÇÃO OFICIAL</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {publicState.rooms.map((room) => {
            const isSelected = room.id === privateState.currentRoomId;
            return (
              <button
                key={room.id}
                onClick={() => {
                  sound.playTap();
                  onSetCurrentRoom(room.id);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[#25201B] border-[#B79A70] shadow-sm text-[#F2EDE4]"
                    : "bg-[#171411] border-[#382B24] hover:border-[#B79A70]/40 text-[#C2B7AA]"
                }`}
              >
                <div className="truncate">
                  <span className="text-xs font-serif font-bold block truncate">
                    {room.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#B79A70]">
                    {room.category}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#B79A70] shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
