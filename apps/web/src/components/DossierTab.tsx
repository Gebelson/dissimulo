import React, { useState } from "react";
import {
  PublicGameState,
  PlayerPrivateView,
  Evidence,
  Testimony,
} from "@alibi/contracts";
import {
  FolderLock,
  Share2,
  Users,
  MessageSquare,
  Network,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send,
  Plus,
} from "lucide-react";
import { sound } from "../lib/audio";

interface DossierTabProps {
  publicState: PublicGameState;
  privateState: PlayerPrivateView;
  onShareEvidence: (evidenceId: string) => void;
  onSubmitTestimony: (statement: string, claimedRoomId: string, targetSuspectId?: string) => void;
  onConnectEvidence: (fromEvidenceId: string, toTargetId: string, hypothesis: string) => void;
}

export const DossierTab: React.FC<DossierTabProps> = ({
  publicState,
  privateState,
  onShareEvidence,
  onSubmitTestimony,
  onConnectEvidence,
}) => {
  const [subTab, setSubTab] = useState<"EVIDENCE" | "SUSPECTS" | "TIMELINE" | "GRAPH">("EVIDENCE");
  const [newStatement, setNewStatement] = useState("");
  const [testimonyRoom, setTestimonyRoom] = useState(privateState.currentRoomId);
  const [newHypothesis, setNewHypothesis] = useState("");
  const [selectedEvId, setSelectedEvId] = useState("");
  const [selectedSuspectId, setSelectedSuspectId] = useState("");

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;
    sound.playTap();
    onSubmitTestimony(newStatement.trim(), testimonyRoom);
    setNewStatement("");
  };

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvId || !selectedSuspectId || !newHypothesis.trim()) return;
    sound.playTap();
    onConnectEvidence(selectedEvId, selectedSuspectId, newHypothesis.trim());
    setNewHypothesis("");
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Dossier Sub-nav */}
      <div className="flex bg-surface-elevated p-1 rounded-xl border border-border">
        {(["EVIDENCE", "SUSPECTS", "TIMELINE", "GRAPH"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playTap();
              setSubTab(tab);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === tab
                ? "bg-surface text-investigation shadow-sm border border-border"
                : "text-secondary hover:text-primary"
            }`}
          >
            {tab === "EVIDENCE"
              ? "Provas"
              : tab === "SUSPECTS"
              ? "Suspeitos"
              : tab === "TIMELINE"
              ? "Depoimentos"
              : "Quadro"}
          </button>
        ))}
      </div>

      {/* SUBTAB: EVIDENCE */}
      {subTab === "EVIDENCE" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-secondary">
            <span>Evidências Coletadas ({privateState.privateEvidence.length})</span>
            <span className="font-mono text-investigation">PROVAS FORENSES</span>
          </div>

          {privateState.privateEvidence.length === 0 ? (
            <div className="p-8 text-center forensic-panel text-secondary text-xs">
              Nenhuma evidência recuperada ainda. Vá a um ambiente da casa e toque em "Investigar Este Ambiente".
            </div>
          ) : (
            privateState.privateEvidence.map((ev) => (
              <div
                key={ev.id}
                className="forensic-panel p-4 space-y-2 border-border hover:border-investigation/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      ev.tier === "CORE"
                        ? "bg-investigation/10 text-investigation border border-investigation/30"
                        : "bg-surface-elevated text-secondary border border-border"
                    }`}
                  >
                    CLASSE: {ev.tier}
                  </span>
                  {ev.isSharedWithGroup ? (
                    <span className="text-[10px] text-protection font-mono bg-protection/10 px-2 py-0.5 rounded border border-protection/20">
                      COMPARTILHADA
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playTap();
                        onShareEvidence(ev.id);
                      }}
                      className="text-[10px] text-investigation flex items-center gap-1 bg-surface-elevated hover:bg-surface px-2 py-1 rounded border border-border active:scale-95"
                    >
                      <Share2 className="w-3 h-3" /> Compartilhar no Dossiê
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-bold text-primary font-display">{ev.title}</h4>
                <p className="text-xs text-secondary leading-relaxed">{ev.detailedFindings}</p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-secondary font-mono">
                  <span>Local: {ev.roomId}</span>
                  <span>{ev.authenticityVerified ? "✓ Autenticada" : "! Não autenticada"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBTAB: SUSPECTS */}
      {subTab === "SUSPECTS" && (
        <div className="space-y-2.5">
          <div className="text-xs text-secondary mb-1">
            Lista de Participantes ({publicState.players.length})
          </div>
          {publicState.players.map((suspect) => {
            const isDead = suspect.status !== "ALIVE";
            return (
              <div
                key={suspect.id}
                className={`forensic-panel p-3.5 flex items-center justify-between ${
                  isDead ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center font-bold text-sm border border-border">
                    {suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      {suspect.name}
                      {suspect.isHost && (
                        <span className="text-[9px] font-mono text-investigation border border-investigation/30 px-1 rounded">
                          HOST
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-secondary font-mono">
                      Ambiente: {suspect.currentRoomId}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-1 rounded font-bold ${
                    suspect.status === "ALIVE"
                      ? "text-protection bg-protection/10 border border-protection/20"
                      : "text-danger bg-danger/10 border border-danger/20"
                  }`}
                >
                  {suspect.status === "ALIVE" ? "VIVO" : "ELIMINADO"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB: TIMELINE & TESTIMONIES */}
      {subTab === "TIMELINE" && (
        <div className="space-y-4">
          {/* Submit Testimony Form */}
          <form onSubmit={handleTestimonySubmit} className="forensic-panel p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-primary uppercase">Registrar Declaração</h4>
            <textarea
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              placeholder="Descreva o que viu ou declare seu álibi de permanência..."
              className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary focus:border-investigation outline-none resize-none h-20"
            />
            <div className="flex gap-2">
              <select
                value={testimonyRoom}
                onChange={(e) => setTestimonyRoom(e.target.value)}
                className="bg-surface-elevated border border-border rounded-xl px-2 py-1.5 text-xs text-secondary outline-none"
              >
                {publicState.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-investigation text-background rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95"
              >
                <Send className="w-3 h-3" /> Publicar no Dossiê
              </button>
            </div>
          </form>

          {/* Testimonies List */}
          <div className="space-y-2">
            <span className="text-xs text-secondary block">Histórico de Depoimentos</span>
            {privateState.testimonies.length === 0 ? (
              <div className="p-6 text-center forensic-panel text-secondary text-xs">
                Nenhuma declaração registrada.
              </div>
            ) : (
              privateState.testimonies.map((t) => (
                <div key={t.id} className="forensic-panel p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-secondary font-mono">
                    <span className="text-investigation font-bold">DEPOIMENTO #{t.id.slice(-4)}</span>
                    <span>{t.claimedRoomId}</span>
                  </div>
                  <p className="text-xs text-primary">{t.statement}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: INVESTIGATION CONNECTION BOARD */}
      {subTab === "GRAPH" && (
        <div className="space-y-4">
          <div className="p-3 bg-surface-elevated border border-border rounded-xl text-xs text-secondary">
            Relacione pistas a suspeitos para construir a hipótese acusatória do dossiê.
          </div>

          {/* Create Connection Form */}
          <form onSubmit={handleCreateConnection} className="forensic-panel p-3.5 space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase">Criar Conexão Investigativa</h4>

            <div>
              <label className="text-[10px] text-secondary block mb-1">EVIDÊNCIA:</label>
              <select
                value={selectedEvId}
                onChange={(e) => setSelectedEvId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2 text-xs text-primary outline-none"
              >
                <option value="">Selecione uma evidência...</option>
                {privateState.privateEvidence.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-secondary block mb-1">SUSPEITO:</label>
              <select
                value={selectedSuspectId}
                onChange={(e) => setSelectedSuspectId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2 text-xs text-primary outline-none"
              >
                <option value="">Selecione o suspeito...</option>
                {publicState.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-secondary block mb-1">HIPÓTESE:</label>
              <input
                type="text"
                value={newHypothesis}
                onChange={(e) => setNewHypothesis(e.target.value)}
                placeholder="Ex: Teve acesso à chave durante o blefe"
                className="w-full bg-background border border-border rounded-xl p-2 text-xs text-primary outline-none"
              >
              </input>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-investigation text-background rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Relação ao Quadro
            </button>
          </form>

          {/* Active Connections List */}
          <div className="space-y-2">
            <span className="text-xs text-secondary block">
              Conexões Mapeadas ({privateState.connections.length})
            </span>
            {privateState.connections.map((c) => (
              <div key={c.id} className="forensic-panel p-3 text-xs space-y-1">
                <div className="flex items-center gap-2 text-investigation font-mono text-[10px] font-bold">
                  <span>{c.fromEvidenceId}</span> ➔ <span>{c.toEvidenceOrSuspectId}</span>
                </div>
                <div className="text-primary font-medium">{c.hypothesisLabel}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
