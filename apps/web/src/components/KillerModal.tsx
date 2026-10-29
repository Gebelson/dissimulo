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
  Radio,
  Flame,
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
    sound.playHeartbeat();
    onArmTrap(targetId, templateId, selectedRoom || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md game-panel-danger p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-danger/30">
          <div className="flex items-center gap-2 text-danger">
            <Skull className="w-5 h-5 animate-pulse" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-primary">
              Console Clandestino
            </h3>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Live Trap Slot: 1/1 Limit */}
        <div className="p-3 bg-background/80 rounded-xl border border-danger/40 flex items-center justify-between text-xs font-mono">
          <span className="text-secondary">SLOT DE ARMADILHA:</span>
          {hasActiveTrap ? (
            <span className="text-danger font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
              1/1 ARMADA
            </span>
          ) : (
            <span className="text-protection font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 0/1 LIVRE PARA ARMAR
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-danger/20 border border-danger/40 text-danger rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {hasActiveTrap ? (
          <div className="p-4 bg-background/60 border border-danger/40 rounded-xl space-y-2.5 text-xs">
            <h4 className="font-bold text-danger uppercase font-mono flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Armadilha Fatal em Execução
            </h4>
            <p className="text-secondary leading-relaxed font-sans">
              A missão falsa foi entregue ao alvo. O visual é 100% idêntico a uma tarefa comum. Se o alvo tocar em <strong>"Iniciar missão"</strong> no cômodo exigido, morrerá no mesmo instante.
            </p>
            <div className="pt-2 text-[10px] font-mono text-muted border-t border-border/40">
              ID DA OPERAÇÃO: {kd?.activeTrap?.id}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs text-secondary font-bold font-mono block mb-1">
                SELECIONE A VÍTIMA:
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-danger font-sans"
              >
                <option value="">Escolha um sobrevivente vivo...</option>
                {livingSurvivors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Cômodo: {p.currentRoomId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-secondary font-bold font-mono block mb-1">
                DISFARCE DA MISSÃO FALSA:
              </label>
              <div className="space-y-1.5">
                {DISGUISE_TRAP_TEMPLATES.map((tmpl: MissionTemplate) => (
                  <label
                    key={tmpl.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      templateId === tmpl.id
                        ? "bg-danger/20 border-danger text-primary"
                        : "bg-background border-border text-secondary hover:border-danger/40"
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-primary font-display">{tmpl.title}</span>
                      <span className="text-[10px] text-muted">{tmpl.description}</span>
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
              <label className="text-xs text-secondary font-bold font-mono block mb-1">
                EXIGÊNCIA DE AMBIENTE:
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-danger font-sans"
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
              className="w-full py-3.5 tactile-btn-danger text-xs font-bold font-display uppercase tracking-wider active:scale-95 transition-all shadow-xl"
            >
              Armar Armadilha Fatal (1/1)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
