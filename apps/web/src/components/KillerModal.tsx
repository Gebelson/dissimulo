import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import { DISGUISE_TRAP_TEMPLATES, MissionTemplate } from "@alibi/game-engine";
import {
  Skull,
  Crosshair,
  AlertTriangle,
  X,
  CheckCircle,
  Lock,
  Radio,
  Flame,
} from "lucide-react";
import { sound } from "../lib/audio";
import { CharacterPortrait, ConfidentialStamp } from "./ui/NoirComponents";

interface KillerModalProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onClose: () => void;
  onArmTrap: (targetPlayerId: string, templateId: string, requiredRoomId?: string) => void;
}

export const KillerModal: React.FC<KillerModalProps> = ({
  publicState,
  privateState,
  onClose,
  onArmTrap,
}) => {
  const [targetId, setTargetId] = useState("");
  const [templateId, setTemplateId] = useState(DISGUISE_TRAP_TEMPLATES[0].id);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const kd = privateState.killerDashboard;
  const hasActiveTrap = kd?.activeTrap && kd.activeTrap.status === "ARMED";

  const livingSurvivors = publicState.players.filter(
    (p) => p.status === "ALIVE" && p.id !== privateState.playerId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActiveTrap) {
      setErrorMsg("Você já possui uma armadilha ativa no servidor. Aguarde o acionamento ou neutralização.");
      return;
    }
    if (!targetId) {
      setErrorMsg("Selecione um sobrevivente como alvo.");
      return;
    }

    sound.playHeartbeat();
    onArmTrap(targetId, templateId, selectedRoom || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md noir-panel-threat p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border-[#9F3D3D] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#9F3D3D]/40">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-[#F1A8A4]" />
            <h3 className="text-base font-serif font-bold uppercase tracking-widest text-[#F2EDE4]">
              Plano de Assassinato
            </h3>
          </div>
          <button onClick={onClose} className="text-[#C2B7AA] hover:text-[#F2EDE4] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Trap Slot: 1/1 Limit */}
        <div className="p-3 bg-[#110B0D] rounded-xl border border-[#9F3D3D]/40 flex items-center justify-between text-xs font-mono">
          <span className="text-[#C2B7AA]">SLOT DE ARMADILHA:</span>
          {hasActiveTrap ? (
            <span className="text-[#F1A8A4] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9F3D3D] animate-ping" />
              1/1 EM ANDAMENTO
            </span>
          ) : (
            <span className="text-[#73917B] font-bold">
              0/1 DISPONÍVEL
            </span>
          )}
        </div>

        {/* Invariant Info Notice */}
        <div className="p-3 bg-[#1A0C0E] border border-[#9F3D3D]/30 rounded-xl text-[11px] text-[#C2B7AA] space-y-1">
          <strong className="text-[#F1A8A4] font-mono block text-[10px] uppercase">
            Regra Crítica do Servidor:
          </strong>
          A vítima não morre ao abrir os detalhes. A eliminação virtual é disparada no exato momento em que ela toca em <strong>"Iniciar Ordem"</strong>. Um sobrevivente terceiro pode neutralizá-la antes.
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-[#4A1616] border border-[#F1A8A4] text-xs text-[#F2EDE4] rounded-lg">
            {errorMsg}
          </div>
        )}

        {hasActiveTrap ? (
          /* ACTIVE TRAP STATUS CARD */
          <div className="p-4 bg-[#14080A] rounded-xl border border-[#9F3D3D] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#F1A8A4] font-mono font-bold uppercase">
                ARMADILHA ATIVA
              </span>
              <span className="text-[10px] font-mono text-[#C2B7AA]">
                ALVO: {publicState.players.find((p) => p.id === kd?.activeTrap?.targetPlayerId)?.name || "Alvo"}
              </span>
            </div>
            <p className="text-xs text-[#F2EDE4] font-serif italic">
              "Aguardando a vítima iniciar a tarefa disfarçada na tela dela..."
            </p>
          </div>
        ) : (
          /* ARM TRAP FORM */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Step 1: Target Selection */}
            <div>
              <label className="text-[10px] font-mono text-[#C2B7AA] uppercase font-bold tracking-wider block mb-2">
                1. ESCOLHA SUA PRÓXIMA VÍTIMA:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {livingSurvivors.map((survivor) => {
                  const isSelected = survivor.id === targetId;
                  return (
                    <button
                      type="button"
                      key={survivor.id}
                      onClick={() => setTargetId(survivor.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? "bg-[#3D1418] border-[#F1A8A4] ring-2 ring-[#9F3D3D] shadow-noir-crimson"
                          : "bg-[#1B0B0D] border-[#4A3A32] text-[#C2B7AA]"
                      }`}
                    >
                      <CharacterPortrait name={survivor.name} status={survivor.status} size="sm" />
                      <span className="text-[10px] font-serif font-bold text-[#F2EDE4] truncate max-w-full mt-1">
                        {survivor.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Disguise Mission Template */}
            <div>
              <label className="text-[10px] font-mono text-[#C2B7AA] uppercase font-bold tracking-wider block mb-1.5">
                2. SELECIONE A MISSÃO DISFARÇADA (ISCA):
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full bg-[#110B0D] border border-[#9F3D3D]/50 rounded-xl p-3 text-xs text-[#F2EDE4] outline-none font-sans"
              >
                {DISGUISE_TRAP_TEMPLATES.map((tmpl: MissionTemplate) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.title} ({tmpl.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Required Room Constraint */}
            <div>
              <label className="text-[10px] font-mono text-[#C2B7AA] uppercase font-bold tracking-wider block mb-1.5">
                3. EXIGIR CÔMODO OBRIGATÓRIO (OPCIONAL):
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-[#110B0D] border border-[#9F3D3D]/50 rounded-xl p-3 text-xs text-[#F2EDE4] outline-none font-sans"
              >
                <option value="">Qualquer cômodo da residência</option>
                {publicState.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!targetId}
              className={`w-full py-3.5 rounded-xl font-serif font-bold text-xs uppercase tracking-widest transition-all ${
                targetId
                  ? "noir-btn-danger"
                  : "bg-[#251012] text-[#C2B7AA]/40 border border-[#4A1616] cursor-not-allowed"
              }`}
            >
              Armar Armadilha Fatal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
