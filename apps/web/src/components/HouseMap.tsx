import React from "react";
import { RoomConfig } from "@alibi/contracts";
import { sound } from "../lib/audio";
import {
  Armchair,
  Briefcase,
  Sun,
  KeyRound,
  Bath,
  Utensils,
  Waves,
  MapPin,
  Pin,
} from "lucide-react";

interface HouseMapProps {
  rooms: RoomConfig[];
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const HouseMap: React.FC<HouseMapProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
}) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-[#0F0D0B] border border-[#4A3A32] rounded-2xl overflow-hidden p-3 shadow-noir-card">
      {/* Antique architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#261F1A_1px,transparent_1px),linear-gradient(to_bottom,#261F1A_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 pointer-events-none" />

      {/* Decorative Blueprint Headers */}
      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 z-10 text-[9px] font-mono text-[#B79A70] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B79A70]" />
        <span>PLANTA DA MANSÃO // 7 AMBIENTES</span>
      </div>

      <div className="absolute top-2.5 right-3 z-10 text-[9px] font-mono text-[#C2B7AA]/70">
        ESQUEMA RESIDENCIAL
      </div>

      {/* Rooms Floorplan Layout Grid */}
      <div className="relative w-full h-full pt-6 grid grid-cols-3 grid-rows-3 gap-2">
        {/* Row 1 */}
        {renderRoomTile(rooms.find((r) => r.id === "escritorio"), currentRoomId, onSelectRoom, "col-span-1")}
        {renderRoomTile(rooms.find((r) => r.id === "sala"), currentRoomId, onSelectRoom, "col-span-1")}
        {renderRoomTile(rooms.find((r) => r.id === "cozinha"), currentRoomId, onSelectRoom, "col-span-1")}

        {/* Row 2 */}
        {renderRoomTile(rooms.find((r) => r.id === "suite"), currentRoomId, onSelectRoom, "col-span-1")}
        {renderRoomTile(rooms.find((r) => r.id === "banheiro_social"), currentRoomId, onSelectRoom, "col-span-1")}
        {renderRoomTile(rooms.find((r) => r.id === "varanda"), currentRoomId, onSelectRoom, "col-span-1")}

        {/* Row 3 - Outdoor Pool spanning row */}
        {renderRoomTile(rooms.find((r) => r.id === "piscina"), currentRoomId, onSelectRoom, "col-span-3")}
      </div>
    </div>
  );
};

function renderRoomTile(
  room: RoomConfig | undefined,
  currentRoomId: string,
  onSelectRoom: (id: string) => void,
  spanClass: string
) {
  if (!room) return <div className={spanClass} />;
  const isCurrent = room.id === currentRoomId;

  return (
    <button
      key={room.id}
      onClick={() => {
        sound.playTap();
        onSelectRoom(room.id);
      }}
      className={`relative rounded-xl p-2 flex flex-col justify-between text-left transition-all active:scale-95 border ${spanClass} ${
        isCurrent
          ? "bg-[#25201B] border-[#B79A70] shadow-noir-brass text-[#F2EDE4]"
          : "bg-[#14110E] border-[#382B24] hover:border-[#B79A70]/50 text-[#C2B7AA]"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[8px] font-mono uppercase tracking-wider text-[#B79A70]">
          {room.category}
        </span>
        {isCurrent ? (
          <span className="flex items-center gap-1 text-[8px] font-mono text-[#F2EDE4] bg-[#B79A70]/30 px-1.5 py-0.2 rounded border border-[#B79A70]/50 font-bold">
            <Pin className="w-2.5 h-2.5 text-[#B79A70] fill-current" />
            VOCÊ
          </span>
        ) : (
          <span className="text-[8px] text-[#4A3A32]">●</span>
        )}
      </div>

      <div className="mt-1">
        <div className="flex items-center gap-1.5">
          {getRoomIcon(room.id, isCurrent)}
          <span
            className={`text-xs font-serif font-bold truncate ${
              isCurrent ? "text-[#F2EDE4]" : "text-[#C2B7AA]"
            }`}
          >
            {room.name}
          </span>
        </div>
      </div>
    </button>
  );
}

function getRoomIcon(roomId: string, isCurrent: boolean) {
  const cls = `w-3.5 h-3.5 shrink-0 ${isCurrent ? "text-[#B79A70]" : "text-[#C2B7AA]/70"}`;
  switch (roomId) {
    case "sala": return <Armchair className={cls} />;
    case "escritorio": return <Briefcase className={cls} />;
    case "varanda": return <Sun className={cls} />;
    case "suite": return <KeyRound className={cls} />;
    case "banheiro_social": return <Bath className={cls} />;
    case "cozinha": return <Utensils className={cls} />;
    case "piscina": return <Waves className={cls} />;
    default: return <MapPin className={cls} />;
  }
}
