import React, { useState, useEffect } from "react";
import {
  MinigameChallengeData,
  MinigameId,
} from "@alibi/contracts";
import {
  CircuitGame,
  CircuitChallenge,
  CipherGame,
  CipherChallenge,
  DocReconstructGame,
  DocReconstructChallenge,
  LogAuditGame,
  LogAuditChallenge,
  SignalMemoryGame,
  SignalMemoryChallenge,
  TracePatternGame,
  TracePatternChallenge,
  ChronologyGame,
  ChronologyChallenge,
  FrequencyGame,
  FrequencyChallenge,
  AnomalyGame,
  AnomalyChallenge,
  SealAuthGame,
  SealAuthChallenge,
  TerminalSyncGame,
  TerminalSyncChallenge,
  PacketReassemblyGame,
  PacketReassemblyChallenge,
} from "@alibi/minigames";
import { sound } from "../lib/audio";
import { CheckCircle2, XCircle, RotateCcw, AlertTriangle } from "lucide-react";

interface MinigamePlayerProps {
  challenge: MinigameChallengeData;
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

export const MinigamePlayer: React.FC<MinigamePlayerProps> = ({
  challenge,
  onComplete,
  onCancel,
}) => {
  const [solved, setSolved] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSuccess = () => {
    sound.playEvidenceChime();
    setSolved(true);
    setTimeout(() => onComplete(true), 1200);
  };

  const handleFail = (msg = "Sequência incorreta.") => {
    sound.vibrate(100);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div>
            <span className="text-xs uppercase tracking-widest text-investigation font-bold">
              Desafio Pericial
            </span>
            <h3 className="text-lg font-bold text-primary font-display">
              {getMinigameTitle(challenge.minigameId)}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-secondary hover:text-primary rounded-lg active:scale-95"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Status overlay */}
        {solved && (
          <div className="p-4 bg-protection/20 text-protection border-b border-protection/40 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">DESAFIO CONCLUÍDO COM SUCESSO!</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-danger/20 text-danger border-b border-danger/40 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Minigame Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {challenge.minigameId === "circuit_reconnect" && (
            <CircuitComponent onSuccess={handleSuccess} />
          )}
          {challenge.minigameId === "cipher_breaker" && (
            <CipherComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "doc_reconstruct" && (
            <DocReconstructComponent onSuccess={handleSuccess} />
          )}
          {challenge.minigameId === "log_audit" && (
            <LogAuditComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "signal_memory" && (
            <SignalMemoryComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "trace_pattern" && (
            <TracePatternComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "chronology_order" && (
            <ChronologyComponent onSuccess={handleSuccess} />
          )}
          {challenge.minigameId === "frequency_tune" && (
            <FrequencyComponent onSuccess={handleSuccess} />
          )}
          {challenge.minigameId === "anomaly_detect" && (
            <AnomalyComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "seal_auth" && (
            <SealAuthComponent onSuccess={handleSuccess} />
          )}
          {challenge.minigameId === "terminal_sync" && (
            <TerminalSyncComponent onSuccess={handleSuccess} onFail={handleFail} />
          )}
          {challenge.minigameId === "packet_reassembly" && (
            <PacketReassemblyComponent onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

function getMinigameTitle(id: MinigameId): string {
  switch (id) {
    case "circuit_reconnect": return "01: Reconectar Circuitos";
    case "cipher_breaker": return "02: Quebra de Cifra";
    case "doc_reconstruct": return "03: Reconstruir Documento";
    case "log_audit": return "04: Comparação de Registros";
    case "signal_memory": return "05: Memória de Sinais";
    case "trace_pattern": return "06: Análise de Vestígios";
    case "chronology_order": return "07: Reconstruir Cronologia";
    case "frequency_tune": return "08: Estabilizar Frequência";
    case "anomaly_detect": return "09: Localizar Anomalia";
    case "seal_auth": return "10: Autenticar Documento";
    case "terminal_sync": return "11: Sincronizar Terminais";
    case "packet_reassembly": return "12: Reconstruir Transmissão";
    default: return "Terminal Pericial";
  }
}

// -------------------------------------------------------------
// 01: CIRCUIT RECONNECT
// -------------------------------------------------------------
const CircuitComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge, setChallenge] = useState<CircuitChallenge>(() => CircuitGame.generate(3));

  const handleTileClick = (index: number) => {
    sound.playTap();
    const updated = { ...challenge };
    CircuitGame.rotateTile(updated.tiles[index]);
    setChallenge({ ...updated });

    if (CircuitGame.isSolved(updated)) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-secondary mb-4 text-center">
        Toque nos segmentos para girá-los até formar um caminho contínuo da fonte (topo) ao destino (base).
      </p>
      <div className="grid grid-cols-3 gap-2 w-64 h-64 bg-background p-2 rounded-xl border border-border">
        {challenge.tiles.map((tile, i) => {
          const [top, right, bottom, left] = CircuitGame.getActiveConnections(tile);
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(i)}
              className="relative bg-surface border border-border rounded-lg flex items-center justify-center hover:border-investigation active:scale-95 transition-transform"
            >
              {/* Circuit wire representations */}
              {top && <div className="absolute top-0 w-1.5 h-1/2 bg-investigation" />}
              {bottom && <div className="absolute bottom-0 w-1.5 h-1/2 bg-investigation" />}
              {left && <div className="absolute left-0 h-1.5 w-1/2 bg-investigation" />}
              {right && <div className="absolute right-0 h-1.5 w-1/2 bg-investigation" />}
              <div className="w-3 h-3 rounded-full bg-investigation/80 z-10" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 02: CIPHER BREAKER
// -------------------------------------------------------------
const CipherComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<CipherChallenge>(() => CipherGame.generate(2));

  return (
    <div className="flex flex-col">
      <p className="text-xs text-secondary mb-3">
        Mensagem interceptada criptografada. Use a pista para selecionar a palavra correta:
      </p>
      <div className="bg-background p-3 rounded-xl border border-investigation/40 mb-3 text-center">
        <span className="text-xs text-secondary block mb-1">CÓDIGO CRIPTOGRAFADO (DESL. +{challenge.shift})</span>
        <span className="text-2xl font-mono font-bold tracking-widest text-investigation">
          {challenge.encryptedText}
        </span>
      </div>
      <div className="bg-surface-elevated p-3 rounded-xl border border-border mb-4 text-xs text-secondary">
        <strong className="text-primary block mb-0.5">Dica Forense:</strong> {challenge.clue}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {challenge.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              sound.playTap();
              if (CipherGame.verify(challenge, opt)) {
                onSuccess();
              } else {
                onFail("Chave incorreta.");
              }
            }}
            className="p-3 bg-surface border border-border rounded-xl font-bold font-mono text-sm hover:border-investigation active:scale-95 text-center text-primary"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 03: DOC RECONSTRUCT
// -------------------------------------------------------------
const DocReconstructComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge] = useState<DocReconstructChallenge>(() => DocReconstructGame.generate());
  const [order, setOrder] = useState<number[]>(() => challenge.fragments.map((f) => f.id));

  const moveUp = (index: number) => {
    if (index === 0) return;
    sound.playTap();
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);

    if (DocReconstructGame.isSolved(newOrder)) {
      onSuccess();
    }
  };

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Toque nos fragmentos para reordená-los na sequência correta do laudo:
      </p>
      <div className="space-y-2">
        {order.map((fragId, idx) => {
          const frag = challenge.fragments.find((f) => f.id === fragId)!;
          return (
            <button
              key={fragId}
              onClick={() => moveUp(idx)}
              className="w-full text-left p-3 bg-background border border-border rounded-xl font-mono text-xs text-primary hover:border-investigation active:scale-[0.98] flex items-center justify-between"
            >
              <span>{frag.textSnippet}</span>
              <span className="text-[10px] text-secondary ml-2 font-sans bg-surface px-1.5 py-0.5 rounded">
                ▲ Mover
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 04: LOG AUDIT
// -------------------------------------------------------------
const LogAuditComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<LogAuditChallenge>(() => LogAuditGame.generate());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggle = (id: number) => {
    sound.playTap();
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(updated);

    if (updated.length === challenge.tamperedLineIds.length) {
      if (LogAuditGame.verify(updated, challenge.tamperedLineIds)) {
        onSuccess();
      } else {
        onFail("Seleção incorreta de discrepâncias.");
      }
    }
  };

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Identifique as 2 linhas adulteradas no registro inspecionado:
      </p>
      <div className="space-y-1.5">
        {challenge.inspectedLogs.map((log) => {
          const isSelected = selectedIds.includes(log.id);
          return (
            <button
              key={log.id}
              onClick={() => toggle(log.id)}
              className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono flex items-center justify-between transition-colors ${
                isSelected
                  ? "bg-danger/20 border-danger text-danger"
                  : "bg-background border-border text-primary hover:border-investigation"
              }`}
            >
              <span>[{log.time}] {log.room} — {log.user} ({log.action})</span>
              <span className="text-[10px] opacity-75">{isSelected ? "MARCADO" : "TOCAR"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 05: SIGNAL MEMORY (Simon Says)
// -------------------------------------------------------------
const SignalMemoryComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<SignalMemoryChallenge>(() => SignalMemoryGame.generate(4, 4));
  const [activeRelay, setActiveRelay] = useState<number | null>(null);
  const [inputSeq, setInputSeq] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < challenge.sequence.length) {
        setActiveRelay(challenge.sequence[step]);
        sound.playTap();
        setTimeout(() => setActiveRelay(null), 350);
        step++;
      } else {
        clearInterval(interval);
        setShowingSequence(false);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handlePress = (relayIndex: number) => {
    if (showingSequence) return;
    sound.playTap();
    const updated = [...inputSeq, relayIndex];
    setInputSeq(updated);

    if (updated[updated.length - 1] !== challenge.sequence[updated.length - 1]) {
      onFail("Sequência incorreta. Tente novamente.");
      setInputSeq([]);
      return;
    }

    if (updated.length === challenge.sequence.length) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-secondary mb-4 text-center">
        {showingSequence ? "Memorize a sequência luminosa..." : "Repita a sequência tocando nos relés:"}
      </p>
      <div className="grid grid-cols-2 gap-3 w-56 h-56">
        {[0, 1, 2, 3].map((relay) => {
          const isLit = activeRelay === relay;
          return (
            <button
              key={relay}
              onClick={() => handlePress(relay)}
              disabled={showingSequence}
              className={`rounded-2xl border flex items-center justify-center font-bold text-lg font-mono transition-all ${
                isLit
                  ? "bg-investigation border-investigation text-background scale-105 shadow-lg shadow-investigation/40"
                  : "bg-surface border-border text-primary hover:border-investigation active:scale-95"
              }`}
            >
              RELÉ {relay + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 06: TRACE PATTERN
// -------------------------------------------------------------
const TracePatternComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<TracePatternChallenge>(() => TracePatternGame.generate());

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Compare a amostra pericial de referência com as candidatas e selecione a correspondência exata:
      </p>
      {/* Reference */}
      <div className="bg-background p-3 rounded-xl border border-investigation/40 mb-4">
        <span className="text-[10px] text-investigation uppercase font-bold block mb-1">
          {challenge.referenceSample.label}
        </span>
        <div className="flex items-end gap-1.5 h-12 bg-surface p-2 rounded-lg">
          {challenge.referenceSample.frequencyBars.map((val, i) => (
            <div key={i} className="flex-1 bg-investigation rounded-t" style={{ height: `${val}%` }} />
          ))}
        </div>
      </div>

      {/* Candidates */}
      <div className="space-y-2">
        {challenge.candidateSamples.map((candidate) => (
          <button
            key={candidate.id}
            onClick={() => {
              sound.playTap();
              if (TracePatternGame.verify(candidate.id, challenge.correctSampleId)) {
                onSuccess();
              } else {
                onFail("Amostra divergente.");
              }
            }}
            className="w-full p-2.5 bg-surface border border-border rounded-xl hover:border-investigation active:scale-[0.98] text-left"
          >
            <span className="text-xs font-semibold text-primary block mb-1">{candidate.label}</span>
            <div className="flex items-end gap-1 h-8 bg-background p-1.5 rounded">
              {candidate.frequencyBars.map((v, i) => (
                <div key={i} className="flex-1 bg-secondary/80 rounded-t" style={{ height: `${v}%` }} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 07: CHRONOLOGY ORDER
// -------------------------------------------------------------
const ChronologyComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge] = useState<ChronologyChallenge>(() => ChronologyGame.generate());
  const [currentOrder, setCurrentOrder] = useState<number[]>(() => challenge.events.map((e) => e.id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    sound.playTap();
    const copy = [...currentOrder];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setCurrentOrder(copy);

    if (ChronologyGame.verify(copy)) {
      onSuccess();
    }
  };

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Organize os eventos na ordem cronológica estrita:
      </p>
      <div className="space-y-2">
        {currentOrder.map((evId, idx) => {
          const ev = challenge.events.find((e) => e.id === evId)!;
          return (
            <button
              key={evId}
              onClick={() => moveUp(idx)}
              className="w-full p-3 bg-background border border-border rounded-xl text-left text-xs flex items-center justify-between hover:border-investigation active:scale-95"
            >
              <div>
                <span className="font-mono text-investigation font-bold block">{ev.timeStr}</span>
                <span className="text-primary">{ev.description}</span>
              </div>
              <span className="text-[10px] text-secondary bg-surface px-2 py-1 rounded">▲ Subir</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 08: FREQUENCY TUNE
// -------------------------------------------------------------
const FrequencyComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge] = useState<FrequencyChallenge>(() => FrequencyGame.generate());
  const [freq, setFreq] = useState(challenge.initialFreq);
  const [amp, setAmp] = useState(challenge.initialAmp);

  const check = (newF: number, newA: number) => {
    if (FrequencyGame.isTuned(challenge, newF, newA)) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-xs text-secondary mb-3">
        Ajuste a frequência e a amplitude até calibrar com a onda de emergência:
      </p>
      <div className="bg-background p-4 rounded-xl border border-investigation/40 mb-4 flex items-center justify-center">
        {/* Animated wave simulator */}
        <div className="w-full h-20 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full stroke-investigation" viewBox="0 0 300 80">
            <path
              d={`M 0 40 Q 75 ${40 - amp * 0.4} 150 40 T 300 40`}
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-secondary block mb-1 flex justify-between">
            <span>FREQUÊNCIA:</span> <span className="font-mono text-investigation">{freq} Hz (Alvo: ~{challenge.targetFreq})</span>
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={freq}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFreq(val);
              check(val, amp);
            }}
            className="w-full accent-investigation"
          />
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1 flex justify-between">
            <span>AMPLITUDE:</span> <span className="font-mono text-investigation">{amp} % (Alvo: ~{challenge.targetAmp})</span>
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={amp}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAmp(val);
              check(freq, val);
            }}
            className="w-full accent-investigation"
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 09: ANOMALY DETECT
// -------------------------------------------------------------
const AnomalyComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<AnomalyChallenge>(() => AnomalyGame.generate());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    sound.playTap();
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(updated);

    if (updated.length === challenge.tamperedZoneIds.length) {
      if (AnomalyGame.verify(updated, challenge.tamperedZoneIds)) {
        onSuccess();
      } else {
        onFail("Zonas incorretas.");
      }
    }
  };

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Identifique os 2 setores com adulterações no esquema de segurança:
      </p>
      <div className="space-y-2">
        {challenge.zones.map((zone) => {
          const isSelected = selectedIds.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => toggle(zone.id)}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                isSelected
                  ? "bg-danger/20 border-danger text-danger"
                  : "bg-background border-border text-primary hover:border-investigation"
              }`}
            >
              <span>{zone.name}</span>
              <span className="text-[10px] opacity-75">{isSelected ? "SELECIONADO" : "INSPECIONAR"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 10: SEAL AUTH
// -------------------------------------------------------------
const SealAuthComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge, setChallenge] = useState<SealAuthChallenge>(() => SealAuthGame.generate());

  const rotate = (index: number) => {
    sound.playTap();
    const copy = { ...challenge };
    SealAuthGame.rotateRing(copy.rings[index]);
    setChallenge({ ...copy });

    if (SealAuthGame.isAligned(copy.rings)) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-secondary mb-4 text-center">
        Toque nos anéis concêntricos até que todos os glifos fiquem no topo (0°):
      </p>
      <div className="flex gap-4">
        {challenge.rings.map((ring, idx) => (
          <button
            key={ring.id}
            onClick={() => rotate(idx)}
            className="w-16 h-16 rounded-full border-2 border-investigation flex items-center justify-center text-xl font-bold bg-surface active:scale-95 transition-transform"
            style={{ transform: `rotate(${ring.rotation}deg)` }}
          >
            {ring.glyph}
          </button>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 11: TERMINAL SYNC
// -------------------------------------------------------------
const TerminalSyncComponent: React.FC<{ onSuccess: () => void; onFail: (m: string) => void }> = ({
  onSuccess,
  onFail,
}) => {
  const [challenge] = useState<TerminalSyncChallenge>(() => TerminalSyncGame.generate());

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Sincronize os dois nós criptográficos selecionando a soma exata dos códigos de terminal:
      </p>
      <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-center">
        <div className="p-3 bg-background border border-border rounded-xl">
          <span className="text-[10px] text-secondary block">NÓ 1</span>
          <span className="text-sm font-bold text-investigation">{challenge.terminalCodeA}</span>
        </div>
        <div className="p-3 bg-background border border-border rounded-xl">
          <span className="text-[10px] text-secondary block">NÓ 2</span>
          <span className="text-sm font-bold text-investigation">{challenge.terminalCodeB}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {challenge.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              sound.playTap();
              if (TerminalSyncGame.verify(opt, challenge.expectedSumCode)) {
                onSuccess();
              } else {
                onFail("Código de sincronização incorreto.");
              }
            }}
            className="p-3 bg-surface border border-border rounded-xl font-mono font-bold text-sm text-primary hover:border-investigation active:scale-95 text-center"
          >
            HASH #{opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 12: PACKET REASSEMBLY
// -------------------------------------------------------------
const PacketReassemblyComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [challenge] = useState<PacketReassemblyChallenge>(() => PacketReassemblyGame.generate());
  const [order, setOrder] = useState<number[]>(() => challenge.scrambledPackets.map((p) => p.seqId));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    sound.playTap();
    const copy = [...order];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setOrder(copy);

    if (PacketReassemblyGame.isCorrect(copy)) {
      onSuccess();
    }
  };

  return (
    <div>
      <p className="text-xs text-secondary mb-3">
        Reconecte os pacotes interceptados na ordem sequencial correta (SEQ: 1 a 4):
      </p>
      <div className="space-y-2">
        {order.map((seqId, idx) => {
          const packet = challenge.scrambledPackets.find((p) => p.seqId === seqId)!;
          return (
            <button
              key={seqId}
              onClick={() => moveUp(idx)}
              className="w-full p-3 bg-background border border-border rounded-xl text-left text-xs font-mono flex items-center justify-between hover:border-investigation active:scale-95"
            >
              <div>
                <span className="text-investigation font-bold mr-2">[SEQ: 0{seqId}]</span>
                <span className="text-primary">{packet.payload}</span>
              </div>
              <span className="text-[10px] text-secondary bg-surface px-2 py-1 rounded font-sans">▲ Mover</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
