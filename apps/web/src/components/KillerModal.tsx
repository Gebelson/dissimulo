import React, { useState } from "react";
import { PublicGameState, PlayerPrivateView } from "@alibi/contracts";
import { DISGUISE_TRAP_TEMPLATES, MissionTemplate } from "@alibi/game-engine";
import {
  Skull,
  Crosshair,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Lock,
} from "lucide-react";
import { sound } from "../lib/audio";

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
      setErrorMsg("Você já possui uma armadilha ativa. Aguarde o acionamento ou neutralização.");
      return;
    }
    if (!targetId) {
      setErrorMsg("Selecione um sobrevivente como alvo.");
      return;
    }

    sound.playTap();
    onArmTrap(targetId, templateId, selectedRoom || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-danger/40 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-danger">
            <Skull className="w-5 h-5" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-primary">
              Console do Assassino
            </h3>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Live Slot Status: 1/1 Trap limit */}
        <div className="p-3 bg-surface-elevated rounded-xl border border-border flex items-center justify-between text-xs font-mono">
          <span>ARMADILHA ATIVA:</span>
          {hasActiveTrap ? (
            <span className="text-danger font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger animate-ping" /> 1/1 ARMADA
            </span>
          ) : (
            <span className="text-protection font-bold">0/1 DISPONÍVEL</span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-danger/20 border border-danger/40 text-danger rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {hasActiveTrap ? (
          <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-danger uppercase">Armadilha Fatal em Andamento</h4>
            <p className="text-secondary leading-relaxed">
              Sua missão disfarçada foi entregue à vítima. Se ela tocar em <strong>"Iniciar missão"</strong> no ambiente exigido, será eliminada virtualmente de forma instantânea.
            </p>
            <div className="pt-2 text-[10px] font-mono text-secondary">
              ID: {kd?.activeTrap?.id}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs text-secondary font-bold block mb-1">
                SELECIONE A VÍTIMA ALVO:
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-danger"
              >
                <option value="">Escolha um sobrevivente vivo...</option>
                {livingSurvivors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currentRoomId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-secondary font-bold block mb-1">
                DISFARCE DA MISSÃO FALSA:
              </label>
              <div className="space-y-1.5">
                {DISGUISE_TRAP_TEMPLATES.map((tmpl: MissionTemplate) => (
                  <label
                    key={tmpl.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      templateId === tmpl.id
                        ? "bg-danger/10 border-danger text-primary"
                        : "bg-background border-border text-secondary hover:border-border/80"
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-primary">{tmpl.title}</span>
                      <span className="text-[10px] opacity-75">{tmpl.description}</span>
                    </div>
                    <input
                      type="radio"
                      name="template"
                      value={tmpl.id}
                      checked={templateId === tmpl.id}
                      onChange={() => setTemplateId(tmpl.id)}
                      className="accent-danger"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-secondary font-bold block mb-1">
                EXIGÊNCIA DE AMBIENTE (OPCIONAL):
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none"
              >
                <option value="">Qualquer cômodo da casa</option>
                {publicState.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-danger text-white rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 shadow-lg shadow-danger/20"
            >
              Armar Armadilha Fatal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
