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
  Pin,
  X,
} from "lucide-react";
import { sound } from "../lib/audio";
import { CharacterPortrait, ConfidentialStamp, EvidenceStamp, NoirSectionHeader } from "./ui/NoirComponents";

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
  const [inspectEvidence, setInspectEvidence] = useState<Evidence | null>(null);

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;
    sound.playTypewriterClick();
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
    <div className="space-y-4 pb-28 animate-fade-in-dramatic">
      <NoirSectionHeader
        title="Dossiê do Caso"
        subtitle="Mesa pericial, arquivo de provas e depoimentos"
        badge="PROCESSO Nº 08-MANOR"
      />

      {/* SUB-NAVIGATION TABS */}
      <div className="flex bg-[#171411] p-1 rounded-xl border border-[#4A3A32] shadow-inner">
        {(["EVIDENCE", "SUSPECTS", "TIMELINE", "GRAPH"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playTap();
              setSubTab(tab);
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              subTab === tab
                ? "bg-[#2A231C] text-[#F2EDE4] border border-[#B79A70]/60 shadow-sm"
                : "text-[#C2B7AA] hover:text-[#F2EDE4]"
            }`}
          >
            {tab === "EVIDENCE"
              ? "Evidências"
              : tab === "SUSPECTS"
              ? "Suspeitos"
              : tab === "TIMELINE"
              ? "Álibis"
              : "Mural"}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: EVIDÊNCIAS COLETADAS */}
      {subTab === "EVIDENCE" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#C2B7AA] px-1 font-mono">
            <span>PEÇAS REGISTRADAS ({privateState.privateEvidence.length})</span>
            <span className="text-[#B79A70] font-semibold">LAUDOS FORENSES</span>
          </div>

          {privateState.privateEvidence.length === 0 ? (
            <div className="p-8 text-center noir-card text-[#C2B7AA] text-xs space-y-2 border-dashed">
              <FolderLock className="w-8 h-8 text-[#B79A70] mx-auto opacity-40" />
              <p className="font-serif font-bold text-[#F2EDE4] text-sm">
                Nenhuma evidência recolhida até o momento.
              </p>
              <p className="text-[11px]">
                Desloque-se aos cômodos da residência na aba <strong>Explorar</strong> e investigue vestígios para recuperar laudos periciais reais.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {privateState.privateEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="noir-card p-4 space-y-2.5 hover:border-[#B79A70]/70 transition-all cursor-pointer relative"
                  onClick={() => {
                    sound.playPaperRustle();
                    setInspectEvidence(ev);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="stamp-evidence text-[9px]">{ev.id.substring(0, 6)}</span>
                    <span className="text-[10px] font-mono text-[#B79A70] uppercase">
                      {ev.roomId}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#F2EDE4] leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-[#C2B7AA] line-clamp-2 leading-relaxed">
                    {ev.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#4A3A32]/40 text-[10px] font-mono text-[#C2B7AA]">
                    <span>FONTE: PERÍCIA REAL</span>
                    <span className="text-[#B79A70] hover:underline font-serif">Examinar &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SUSPEITOS & RETRATOS */}
      {subTab === "SUSPECTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#C2B7AA] px-1 font-mono">
            <span>TODOS OS PARTICIPANTES ({publicState.players.length})</span>
            <span className="text-[#B79A70]">ESTADO OFICIAL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {publicState.players.map((p) => {
              const isMe = p.id === privateState.playerId;
              return (
                <div
                  key={p.id}
                  className={`noir-card p-3 flex flex-col items-center text-center space-y-2 ${
                    isMe ? "border-[#B79A70]/80 bg-[#221D19]" : ""
                  }`}
                >
                  <CharacterPortrait name={p.name} status={p.status} size="lg" />

                  <div>
                    <span className="text-xs font-serif font-bold text-[#F2EDE4] block truncate max-w-[120px]">
                      {p.name} {isMe && "(Você)"}
                    </span>
                    <span className="text-[10px] font-mono text-[#B79A70]">
                      {p.currentRoomId || "Local não declarado"}
                    </span>
                  </div>

                  <div className="w-full pt-1 border-t border-[#4A3A32]/40 flex justify-center">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        p.status === "ALIVE"
                          ? "bg-[#73917B]/20 text-[#73917B]"
                          : p.status === "ECO"
                          ? "bg-[#7B849D]/20 text-[#7B849D]"
                          : "bg-[#9F3D3D]/20 text-[#F1A8A4]"
                      }`}
                    >
                      {p.status === "ALIVE" ? "VIVO" : p.status === "ECO" ? "ECO" : "FALECIDO"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DEPOIMENTOS E DECLARAÇÃO DE ÁLIBI */}
      {subTab === "TIMELINE" && (
        <div className="space-y-4">
          {/* Formulário de Registro de Álibi */}
          <form onSubmit={handleTestimonySubmit} className="noir-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#4A3A32]/60 pb-1.5">
              <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                Registrar Declaração de Álibi
              </span>
              <span className="text-[10px] font-mono text-[#B79A70]">TESTEMUNHO OFICIAL</span>
            </div>

            <textarea
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              placeholder="Ex: Eu estava na Cozinha às 20h15 preparando café com a Daniela..."
              rows={2}
              className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-xl p-2.5 text-xs text-[#F2EDE4] placeholder-[#C2B7AA]/40 outline-none focus:border-[#B79A70] font-sans"
              required
            />

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-[#C2B7AA]">
                Cômodo declarado: <strong>{testimonyRoom}</strong>
              </span>

              <button
                type="submit"
                className="py-2 px-4 noir-btn-primary rounded-lg text-xs font-serif font-bold flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Send className="w-3 h-3" />
                <span>Protocolar</span>
              </button>
            </div>
          </form>

          {/* Lista de Depoimentos */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#C2B7AA] uppercase tracking-wider block px-1">
              DEPOIMENTOS DOS SOBREVIVENTES ({privateState.testimonies.length})
            </span>

            {privateState.testimonies.length === 0 ? (
              <div className="p-6 text-center noir-card text-xs text-[#C2B7AA]">
                Nenhum álibi foi registrado pelos investigadores ainda.
              </div>
            ) : (
              privateState.testimonies.map((testimony) => {
                const author = publicState.players.find((p) => p.id === testimony.authorPlayerId);
                return (
                  <div key={testimony.id} className="noir-card p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-serif text-[#B79A70]">
                        {author?.name || "Investigador Desconhecido"}
                      </strong>
                      <span className="text-[10px] font-mono text-[#C2B7AA]">
                        {new Date(testimony.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-[#F2EDE4] italic font-serif leading-relaxed">
                      "{testimony.statement}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#C2B7AA] pt-1 border-t border-[#4A3A32]/30">
                      <span>Ambiente afirmado: {testimony.claimedRoomId}</span>
                      <span className="text-[#73917B]">DECLARAÇÃO REGISTRADA</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MURAL DO CRIME (CORKBOARD WITH RED THREADS) */}
      {subTab === "GRAPH" && (
        <div className="space-y-4">
          <div className="noir-card p-4 space-y-3 bg-[#14110E] border-[#4A3A32]">
            <div className="flex items-center justify-between border-b border-[#4A3A32]/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Pin className="w-4 h-4 text-[#9F3D3D]" />
                <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                  Fixar Linha de Conexão no Mural
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#B79A70]">HIPÓTESE</span>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-[#C2B7AA] uppercase block mb-1">
                    PEÇA / PROVA:
                  </label>
                  <select
                    value={selectedEvId}
                    onChange={(e) => setSelectedEvId(e.target.value)}
                    className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-lg p-2 text-xs text-[#F2EDE4] outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {privateState.privateEvidence.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-[#C2B7AA] uppercase block mb-1">
                    SUSPEITO ALVO:
                  </label>
                  <select
                    value={selectedSuspectId}
                    onChange={(e) => setSelectedSuspectId(e.target.value)}
                    className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-lg p-2 text-xs text-[#F2EDE4] outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {publicState.players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  placeholder="Por que este fato incrimina ou contradiz o suspeito?"
                  className="w-full bg-[#0C0B0A] border border-[#4A3A32] rounded-lg p-2.5 text-xs text-[#F2EDE4] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 noir-btn-secondary rounded-lg text-xs font-serif font-bold text-[#F2EDE4] uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#B79A70]" />
                <span>Fixar Conexão com Fio Vermelho</span>
              </button>
            </form>
          </div>

          {/* Lista de Fios / Conexões */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#C2B7AA] uppercase tracking-wider block px-1">
              CONEXÕES FIXADAS ({privateState.connections.length})
            </span>

            {privateState.connections.length === 0 ? (
              <div className="p-6 text-center noir-card text-xs text-[#C2B7AA]">
                Nenhuma linha de dedução traçada no mural ainda.
              </div>
            ) : (
              privateState.connections.map((conn) => {
                const target = publicState.players.find((p) => p.id === conn.toEvidenceOrSuspectId);
                return (
                  <div key={conn.id} className="noir-card p-3 space-y-2 border-l-4 border-l-[#9F3D3D]">
                    <div className="flex items-center justify-between text-xs font-serif">
                      <strong className="text-[#F2EDE4]">
                        Suspeito associado: <span className="text-[#B79A70]">{target?.name || conn.toEvidenceOrSuspectId}</span>
                      </strong>
                      <span className="stamp-confidential text-[8px]">LINHA #{conn.id.substring(0, 4)}</span>
                    </div>

                    <p className="text-xs text-[#C2B7AA] italic font-serif">
                      "{conn.hypothesisLabel}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* INSPECT EVIDENCE MODAL (AGED PAPER DOSSIER) */}
      {inspectEvidence && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm noir-paper p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#30231C]/30 pb-2">
              <div>
                <EvidenceStamp code={inspectEvidence.id.substring(0, 6)} />
                <span className="text-[10px] font-mono text-[#5A4335] block mt-1">
                  LOCAL: {inspectEvidence.roomId}
                </span>
              </div>
              <button
                onClick={() => setInspectEvidence(null)}
                className="text-[#30231C] hover:opacity-70 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-[#30231C]">
              <h2 className="font-serif font-bold text-xl leading-tight">
                {inspectEvidence.title}
              </h2>
              <p className="text-xs font-sans leading-relaxed">
                {inspectEvidence.shortDescription}
              </p>
              {inspectEvidence.detailedFindings && (
                <p className="text-xs font-serif italic text-[#4A3A32] bg-[#D4C4A8] p-2.5 rounded border border-[#B09B7A]/60">
                  {inspectEvidence.detailedFindings}
                </p>
              )}
              <div className="p-3 bg-[#C8B89C] rounded border border-[#B09B7A] text-[11px] font-mono">
                <span>CONFIABILIDADE PERICIAL: </span>
                <strong>100% REGISTRADO NO MOTOR</strong>
              </div>
            </div>

            <button
              onClick={() => setInspectEvidence(null)}
              className="w-full py-3 rounded-lg border border-[#30231C]/50 text-xs font-serif text-[#30231C] font-bold uppercase tracking-wider hover:bg-[#C8B89C]"
            >
              Guardar no Dossiê
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
