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
  ShieldAlert,
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
    <div className="relative w-full aspect-[4/3] bg-background-dark border border-border rounded-2xl overflow-hidden p-3 shadow-inner">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#142030_1px,transparent_1px),linear-gradient(to_bottom,#142030_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30" />

      {/* Decorative Blueprint Headers */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10 text-[9px] font-mono text-muted uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-investigation" />
        <span>PLANTA ESQUEMÁTICA // A CASA</span>
      </div>

      <div className="absolute top-2 right-3 z-10 text-[9px] font-mono text-muted">
        7 AMBIENTES MAPEADOS
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
          ? "bg-investigation/15 border-investigation shadow-hud-cyan text-primary"
          : "bg-surface/80 border-border hover:border-investigation/50 text-secondary"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted">
          {room.category}
        </span>
        {isCurrent ? (
          <span className="flex items-center gap-1 text-[9px] font-mono text-investigation font-bold">
            <span className="w-2 h-2 rounded-full bg-investigation animate-ping" />
            VOCÊ
          </span>
        ) : (
          <span className="text-[10px] text-muted opacity-60">●</span>
        )}
      </div>

      <div className="mt-1">
        <div className="flex items-center gap-1.5">
          {getRoomIcon(room.id, isCurrent)}
          <span
            className={`text-xs font-bold font-display truncate ${
              isCurrent ? "text-investigation" : "text-primary"
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
  const cls = `w-3.5 h-3.5 shrink-0 ${isCurrent ? "text-investigation" : "text-secondary"}`;
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
