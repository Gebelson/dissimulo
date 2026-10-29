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
  FileText,
  BadgeCheck,
  Search,
  CheckCircle2,
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
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* DOSSIER SUB-NAVIGATION CHIPS */}
      <div className="flex bg-surface-elevated/90 p-1 rounded-xl border border-border shadow-inner">
        {(["EVIDENCE", "SUSPECTS", "TIMELINE", "GRAPH"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playTap();
              setSubTab(tab);
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              subTab === tab
                ? "bg-investigation text-background shadow-md shadow-investigation/20"
                : "text-secondary hover:text-primary"
            }`}
          >
            {tab === "EVIDENCE"
              ? "Provas"
              : tab === "SUSPECTS"
              ? "Suspeitos"
              : tab === "TIMELINE"
              ? "Depoimentos"
              : "Mural"}
          </button>
        ))}
      </div>

      {/* SUBTAB: PROVAS FORENSES */}
      {subTab === "EVIDENCE" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-secondary px-1 font-mono">
            <span>PROVAS EM MÃOS ({privateState.privateEvidence.length})</span>
            <span className="text-investigation font-bold">AUTENTICAÇÃO PERICIAL</span>
          </div>

          {privateState.privateEvidence.length === 0 ? (
            <div className="p-10 text-center game-panel text-secondary text-xs space-y-2">
              <FolderLock className="w-8 h-8 text-muted mx-auto opacity-50" />
              <p className="font-bold text-primary">Nenhuma evidência recuperada ainda.</p>
              <p className="text-muted text-[11px] leading-relaxed">
                Vá até a aba <strong>Explorar</strong>, selecione um cômodo e toque em <strong>"Investigar Este Ambiente"</strong>.
              </p>
            </div>
          ) : (
            privateState.privateEvidence.map((ev) => (
              <div
                key={ev.id}
                className="game-panel p-4 space-y-2.5 border-border hover:border-investigation/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      ev.tier === "CORE"
                        ? "bg-investigation/20 text-investigation border border-investigation/40"
                        : ev.tier === "DISTRACTOR"
                        ? "bg-alert/20 text-alert border border-alert/40"
                        : "bg-surface-elevated text-secondary border border-border"
                    }`}
                  >
                    TIER: {ev.tier === "CORE" ? "NÚCLEO FORENSE" : ev.tier}
                  </span>

                  {ev.isSharedWithGroup ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-protection bg-protection/10 px-2 py-0.5 rounded border border-protection/30 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> PÚBLICA NO DOSSIÊ
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playTap();
                        onShareEvidence(ev.id);
                      }}
                      className="text-[10px] font-mono text-investigation hover:text-white flex items-center gap-1 bg-surface-elevated hover:bg-investigation/20 px-2 py-1 rounded-lg border border-border hover:border-investigation active:scale-95 transition-all"
                    >
                      <Share2 className="w-3 h-3" /> Revelar ao Grupo
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-primary font-display">{ev.title}</h4>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">{ev.detailedFindings}</p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted font-mono">
                  <span>CÔMODO: {ev.roomId.toUpperCase()}</span>
                  <span className={ev.authenticityVerified ? "text-protection" : "text-alert"}>
                    {ev.authenticityVerified ? "✓ Assinatura Digital Válida" : "⚠ Origem Não Autenticada"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBTAB: SUSPEITOS */}
      {subTab === "SUSPECTS" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-secondary px-1 font-mono">
            <span>SUSPEITOS NA CASA ({publicState.players.length})</span>
            <span className="text-investigation font-bold">ESTADO DE PRESENÇA</span>
          </div>

          {publicState.players.map((suspect) => {
            const isDead = suspect.status !== "ALIVE";
            const isMe = suspect.id === privateState.playerId;

            return (
              <div
                key={suspect.id}
                className={`game-panel p-3.5 flex items-center justify-between transition-all ${
                  isDead ? "opacity-50 border-danger/40" : isMe ? "border-investigation/60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                      isDead
                        ? "bg-danger/20 border-danger text-danger"
                        : "bg-surface-elevated border-border text-primary"
                    }`}
                  >
                    {isDead ? "💀" : suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary font-display flex items-center gap-1.5">
                      <span>{suspect.name}</span>
                      {isMe && <span className="text-[10px] text-investigation font-mono">(Você)</span>}
                      {suspect.isHost && (
                        <span className="text-[9px] font-mono text-investigation bg-investigation/10 px-1 py-0.2 rounded border border-investigation/30">
                          HOST
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-secondary font-mono">
                      Cômodo Atual: <strong className="capitalize">{suspect.currentRoomId.replace("_", " ")}</strong>
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold ${
                    suspect.status === "ALIVE"
                      ? "text-protection bg-protection/10 border border-protection/30"
                      : "text-danger bg-danger/10 border border-danger/30"
                  }`}
                >
                  {suspect.status === "ALIVE" ? "VIVO" : "ELIMINADO"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB: DEPOIMENTOS E ÁLIBIS */}
      {subTab === "TIMELINE" && (
        <div className="space-y-4">
          <form onSubmit={handleTestimonySubmit} className="game-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono text-primary uppercase">
                Registrar Declaração de Álibi
              </h4>
              <span className="text-[10px] font-mono text-muted">GRAVAÇÃO NO DOSSIÊ</span>
            </div>

            <textarea
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              placeholder="Descreva o que presenciou, com quem estava ou onde permaneceu..."
              className="w-full bg-background border border-border rounded-xl p-3 text-xs text-primary focus:border-investigation outline-none resize-none h-20 font-sans"
            />

            <div className="flex gap-2">
              <select
                value={testimonyRoom}
                onChange={(e) => setTestimonyRoom(e.target.value)}
                className="bg-surface-elevated border border-border rounded-xl px-2.5 py-2 text-xs text-secondary font-mono outline-none"
              >
                {publicState.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="flex-1 py-2 tactile-btn-primary rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publicar Depoimento
              </button>
            </div>
          </form>

          {/* Testimonies Archive */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-secondary px-1 block">
              REGISTRO DE DEPOIMENTOS ({privateState.testimonies.length})
            </span>

            {privateState.testimonies.length === 0 ? (
              <div className="p-6 text-center game-panel text-secondary text-xs">
                Nenhum depoimento formalizado. Use o formulário acima para registrar sua versão dos fatos.
              </div>
            ) : (
              privateState.testimonies.map((t) => (
                <div key={t.id} className="game-panel p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-secondary">
                    <span className="text-investigation font-bold">DEPOIMENTO #{t.id.slice(-4)}</span>
                    <span className="capitalize text-muted">{t.claimedRoomId.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs text-primary leading-relaxed font-sans">{t.statement}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: MURAL INVESTIGATIVO DE CONEXÕES */}
      {subTab === "GRAPH" && (
        <div className="space-y-4">
          <div className="p-3 bg-surface-elevated border border-border rounded-xl text-xs text-secondary leading-relaxed">
            Conecte pistas a suspeitos com uma hipótese explicativa para embasar sua acusação na reunião.
          </div>

          {/* Connection Builder */}
          <form onSubmit={handleCreateConnection} className="game-panel p-4 space-y-3">
            <h4 className="text-xs font-bold font-mono text-primary uppercase">
              Traçar Relação Investigativa
            </h4>

            <div>
              <label className="text-[10px] font-mono text-muted uppercase block mb-1">
                EVIDÊNCIA IDENTIFICADA:
              </label>
              <select
                value={selectedEvId}
                onChange={(e) => setSelectedEvId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-investigation"
              >
                <option value="">Selecione uma prova do dossiê...</option>
                {privateState.privateEvidence.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-muted uppercase block mb-1">
                SUSPEITO VINCULADO:
              </label>
              <select
                value={selectedSuspectId}
                onChange={(e) => setSelectedSuspectId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-investigation"
              >
                <option value="">Selecione o suspeito...</option>
                {publicState.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currentRoomId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-muted uppercase block mb-1">
                HIPÓTESE EXPLICATIVA:
              </label>
              <input
                type="text"
                value={newHypothesis}
                onChange={(e) => setNewHypothesis(e.target.value)}
                placeholder="Ex: Teve acesso à chave durante o blefe na varanda"
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-primary outline-none focus:border-investigation"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 tactile-btn-primary rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Fixar Fio de Investigação no Mural
            </button>
          </form>

          {/* Connections List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-secondary px-1 block">
              FIOS NO MURAL ({privateState.connections.length})
            </span>

            {privateState.connections.length === 0 ? (
              <div className="p-6 text-center game-panel text-secondary text-xs">
                Nenhuma conexão traçada. Use o formulário para associar fatos a suspeitos.
              </div>
            ) : (
              privateState.connections.map((c) => (
                <div key={c.id} className="game-panel p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-investigation font-mono text-[10px] font-bold">
                    <span>{c.fromEvidenceId}</span> ➔ <span>{c.toEvidenceOrSuspectId}</span>
                  </div>
                  <div className="text-primary font-medium">{c.hypothesisLabel}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
