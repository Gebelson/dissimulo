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
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Zap,
  Terminal,
  Clock,
  Sparkles,
} from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds || 35);

  useEffect(() => {
    if (solved) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFail("Tempo esgotado!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [solved]);

  const handleSuccess = () => {
    sound.playEvidenceChime();
    setSolved(true);
    setTimeout(() => onComplete(true), 1100);
  };

  const handleFail = (msg = "Sequência incorreta.") => {
    sound.vibrate([100, 50, 100]);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-4 select-none">
      {/* TACTICAL HARDWARE FIELD CONSOLE CASING */}
      <div className="w-full max-w-md bg-surface-elevated border-2 border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Hardware Corner Rivets / Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-border shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-border shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-border shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-border shadow-inner" />

        {/* Console Header Bar */}
        <div className="px-5 py-3.5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-investigation/10 border border-investigation/30 flex items-center justify-center text-investigation shadow-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-investigation uppercase font-extrabold block">
                TERMINAL PERICIAL // CAMPO
              </span>
              <h3 className="text-sm font-bold text-primary font-display">
                {getMinigameTitle(challenge.minigameId)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-xs text-alert bg-alert/10 px-2 py-1 rounded-lg border border-alert/20 font-bold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>{timeLeft}s</span>
            </div>

            <button
              onClick={onCancel}
              className="p-1 text-secondary hover:text-primary rounded-lg active:scale-95"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CRT Scanline Bezel Display Area */}
        <div className="relative bg-background p-4 flex-1 overflow-y-auto min-h-[340px] flex flex-col justify-center">
          {/* Status Overlay Banners */}
          {solved && (
            <div className="absolute inset-x-4 top-4 z-30 p-3.5 bg-protection/25 text-protection border border-protection/50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold font-mono shadow-hud-cyan animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5" />
              <span>HOMOLOGADO // PERÍCIA CONCLUÍDA</span>
            </div>
          )}

          {errorMsg && (
            <div className="absolute inset-x-4 top-4 z-30 p-3 bg-danger/25 text-danger border border-danger/50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold font-mono shadow-hud-crimson animate-in shake">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Minigame Components */}
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
    case "circuit_reconnect": return "MG01: Reconectar Circuitos";
    case "cipher_breaker": return "MG02: Quebra de Cifra";
    case "doc_reconstruct": return "MG03: Reconstruir Documento";
    case "log_audit": return "MG04: Comparação de Registros";
    case "signal_memory": return "MG05: Memória de Sinais";
    case "trace_pattern": return "MG06: Análise de Vestígios";
    case "chronology_order": return "MG07: Reconstruir Cronologia";
    case "frequency_tune": return "MG08: Estabilizar Frequência";
    case "anomaly_detect": return "MG09: Localizar Anomalia";
    case "seal_auth": return "MG10: Autenticar Documento";
    case "terminal_sync": return "MG11: Sincronizar Terminais";
    case "packet_reassembly": return "MG12: Reconstruir Transmissão";
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
      <p className="text-xs text-secondary mb-3 text-center font-mono">
        Gire os relés de cobre até conectar a entrada (topo) à saída (base):
      </p>
      <div className="grid grid-cols-3 gap-2.5 w-64 h-64 bg-surface p-2.5 rounded-2xl border-2 border-border shadow-inner">
        {challenge.tiles.map((tile, i) => {
          const [top, right, bottom, left] = CircuitGame.getActiveConnections(tile);
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(i)}
              className="relative bg-background rounded-xl border border-border/80 flex items-center justify-center hover:border-investigation active:scale-90 transition-transform shadow-md"
            >
              {/* Glowing Conductive Traces */}
              {top && <div className="absolute top-0 w-2 h-1/2 bg-investigation shadow-sm shadow-investigation" />}
              {bottom && <div className="absolute bottom-0 w-2 h-1/2 bg-investigation shadow-sm shadow-investigation" />}
              {left && <div className="absolute left-0 h-2 w-1/2 bg-investigation shadow-sm shadow-investigation" />}
              {right && <div className="absolute right-0 h-2 w-1/2 bg-investigation shadow-sm shadow-investigation" />}
              <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-investigation z-10 shadow-hud-cyan" />
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
    <div className="flex flex-col space-y-3">
      <p className="text-xs text-secondary font-mono">
        Decifre o trecho criptografado utilizando a pista forense:
      </p>

      <div className="bg-surface p-4 rounded-2xl border border-investigation/40 text-center shadow-hud-cyan">
        <span className="text-[10px] text-muted font-mono block mb-1">
          CARIMBO CRIPTOGRÁFICO // DESLOCAMENTO +{challenge.shift}
        </span>
        <span className="text-3xl font-mono font-extrabold tracking-widest text-investigation block">
          {challenge.encryptedText}
        </span>
      </div>

      <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-secondary leading-relaxed">
        <strong className="text-primary font-mono block text-[10px] uppercase">Pista Pericial:</strong>
        {challenge.clue}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {challenge.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              sound.playTap();
              if (CipherGame.verify(challenge, opt)) {
                onSuccess();
              } else {
                onFail("Chave criptográfica incorreta.");
              }
            }}
            className="p-3 bg-surface border border-border hover:border-investigation rounded-xl font-mono font-bold text-sm text-primary active:scale-95 text-center shadow-md transition-all"
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Reordene os fragmentos picotados para reconstituir o laudo:
      </p>
      <div className="space-y-2">
        {order.map((fragId, idx) => {
          const frag = challenge.fragments.find((f) => f.id === fragId)!;
          return (
            <button
              key={fragId}
              onClick={() => moveUp(idx)}
              className="w-full text-left p-3 bg-surface border border-border hover:border-investigation rounded-xl font-mono text-xs text-primary active:scale-[0.98] flex items-center justify-between shadow-sm transition-all"
            >
              <span>{frag.textSnippet}</span>
              <span className="text-[10px] text-investigation font-mono bg-surface-elevated px-2 py-0.5 rounded border border-border shrink-0 ml-2">
                ▲ Subir
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
        onFail("Seleção divergente das linhas alteradas.");
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Marque as 2 linhas adulteradas no registro de auditoria:
      </p>
      <div className="space-y-1.5">
        {challenge.inspectedLogs.map((log) => {
          const isSelected = selectedIds.includes(log.id);
          return (
            <button
              key={log.id}
              onClick={() => toggle(log.id)}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-danger/20 border-danger text-danger shadow-hud-crimson"
                  : "bg-surface border-border text-primary hover:border-investigation"
              }`}
            >
              <span>[{log.time}] {log.room} — {log.user} ({log.action})</span>
              <span className="text-[10px] font-bold">{isSelected ? "ALVO" : "TAG"}</span>
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
    }, 650);

    return () => clearInterval(interval);
  }, []);

  const handlePress = (relayIndex: number) => {
    if (showingSequence) return;
    sound.playTap();
    const updated = [...inputSeq, relayIndex];
    setInputSeq(updated);

    if (updated[updated.length - 1] !== challenge.sequence[updated.length - 1]) {
      onFail("Sequência rompida. Tente novamente.");
      setInputSeq([]);
      return;
    }

    if (updated.length === challenge.sequence.length) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <p className="text-xs text-secondary font-mono text-center">
        {showingSequence ? "Memorize o pulso dos relés..." : "Repita a sequência luminosa exata:"}
      </p>
      <div className="grid grid-cols-2 gap-3.5 w-60 h-60">
        {[0, 1, 2, 3].map((relay) => {
          const isLit = activeRelay === relay;
          return (
            <button
              key={relay}
              onClick={() => handlePress(relay)}
              disabled={showingSequence}
              className={`rounded-2xl border-2 flex items-center justify-center font-bold text-sm font-mono transition-all duration-150 ${
                isLit
                  ? "bg-investigation border-investigation text-background scale-105 shadow-hud-cyan"
                  : "bg-surface border-border text-primary hover:border-investigation active:scale-90"
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Selecione a amostra com o espectro idêntico à referência:
      </p>

      {/* Reference Spectrogram */}
      <div className="bg-surface p-3.5 rounded-2xl border border-investigation/40 shadow-hud-cyan">
        <span className="text-[10px] text-investigation font-mono font-bold block mb-1.5 uppercase">
          {challenge.referenceSample.label}
        </span>
        <div className="flex items-end gap-2 h-14 bg-background p-2 rounded-xl">
          {challenge.referenceSample.frequencyBars.map((val, i) => (
            <div key={i} className="flex-1 bg-investigation rounded-t shadow-sm shadow-investigation" style={{ height: `${val}%` }} />
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
                onFail("Divergência de frequência na amostra.");
              }
            }}
            className="w-full p-2.5 bg-surface border border-border hover:border-investigation rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <span className="text-xs font-semibold text-primary block mb-1 font-display">{candidate.label}</span>
            <div className="flex items-end gap-1.5 h-8 bg-background p-1.5 rounded-lg">
              {candidate.frequencyBars.map((v, i) => (
                <div key={i} className="flex-1 bg-secondary rounded-t" style={{ height: `${v}%` }} />
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Ordene os acontecimentos em sequência cronológica crescente:
      </p>
      <div className="space-y-2">
        {currentOrder.map((evId, idx) => {
          const ev = challenge.events.find((e) => e.id === evId)!;
          return (
            <button
              key={evId}
              onClick={() => moveUp(idx)}
              className="w-full p-3 bg-surface border border-border hover:border-investigation rounded-xl text-left text-xs flex items-center justify-between active:scale-95 transition-all shadow-sm"
            >
              <div>
                <span className="font-mono text-investigation font-bold block">{ev.timeStr}</span>
                <span className="text-primary font-medium">{ev.description}</span>
              </div>
              <span className="text-[10px] font-mono text-muted bg-surface-elevated px-2 py-1 rounded">▲ Subir</span>
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Calibre a portadora com a onda de emergência:
      </p>

      {/* Phosphor Oscilloscope Visualizer */}
      <div className="bg-background-dark p-4 rounded-2xl border-2 border-border shadow-inner flex items-center justify-center">
        <svg className="w-full h-24 stroke-investigation" viewBox="0 0 300 80">
          <path
            d={`M 0 40 Q 75 ${40 - amp * 0.45} 150 40 T 300 40`}
            fill="none"
            strokeWidth="3"
            className="filter drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
          />
        </svg>
      </div>

      <div className="space-y-3.5 pt-1">
        <div>
          <label className="text-xs text-secondary font-mono flex justify-between mb-1">
            <span>FREQUÊNCIA:</span> <strong className="text-investigation">{freq} Hz (Alvo: ~{challenge.targetFreq})</strong>
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
          <label className="text-xs text-secondary font-mono flex justify-between mb-1">
            <span>AMPLITUDE:</span> <strong className="text-investigation">{amp} % (Alvo: ~{challenge.targetAmp})</strong>
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Isole os 2 setores com anomalias de sensor na planta:
      </p>
      <div className="space-y-2">
        {challenge.zones.map((zone) => {
          const isSelected = selectedIds.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => toggle(zone.id)}
              className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                isSelected
                  ? "bg-danger/20 border-danger text-danger shadow-hud-crimson"
                  : "bg-surface border-border text-primary hover:border-investigation"
              }`}
            >
              <span>{zone.name}</span>
              <span className="text-[10px] font-bold">{isSelected ? "ISOLADO" : "TESTAR"}</span>
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
    <div className="flex flex-col items-center space-y-4">
      <p className="text-xs text-secondary font-mono text-center">
        Toque nos anéis de segurança até alinhar todos os glifos no topo (0°):
      </p>
      <div className="flex gap-4 my-2">
        {challenge.rings.map((ring, idx) => (
          <button
            key={ring.id}
            onClick={() => rotate(idx)}
            className="w-16 h-16 rounded-full border-2 border-investigation flex items-center justify-center text-2xl font-bold bg-surface active:scale-90 transition-transform shadow-hud-cyan"
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Sincronize os nós criptográficos informando a soma de verificação:
      </p>

      <div className="grid grid-cols-2 gap-2 font-mono text-center">
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-[9px] text-muted block uppercase">TERMINAL 01</span>
          <span className="text-sm font-bold text-investigation">{challenge.terminalCodeA}</span>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl">
          <span className="text-[9px] text-muted block uppercase">TERMINAL 02</span>
          <span className="text-sm font-bold text-investigation">{challenge.terminalCodeB}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {challenge.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              sound.playTap();
              if (TerminalSyncGame.verify(opt, challenge.expectedSumCode)) {
                onSuccess();
              } else {
                onFail("Soma de sincronização incompatível.");
              }
            }}
            className="p-3 bg-surface border border-border hover:border-investigation rounded-xl font-mono font-bold text-sm text-primary active:scale-95 text-center shadow-md transition-all"
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
    <div className="space-y-3">
      <p className="text-xs text-secondary font-mono">
        Conecte os pacotes TCP na ordem de protocolo sequencial:
      </p>
      <div className="space-y-2">
        {order.map((seqId, idx) => {
          const packet = challenge.scrambledPackets.find((p) => p.seqId === seqId)!;
          return (
            <button
              key={seqId}
              onClick={() => moveUp(idx)}
              className="w-full p-3 bg-surface border border-border hover:border-investigation rounded-xl text-left text-xs font-mono flex items-center justify-between active:scale-95 transition-all shadow-sm"
            >
              <div>
                <span className="text-investigation font-bold mr-2">[SEQ: 0{seqId}]</span>
                <span className="text-primary">{packet.payload}</span>
              </div>
              <span className="text-[10px] font-mono text-muted bg-surface-elevated px-2 py-1 rounded">▲ Subir</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
