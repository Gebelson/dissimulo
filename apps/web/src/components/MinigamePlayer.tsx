import React, { useState, useEffect, useRef } from "react";
import {
  MinigameChallengeData,
  MinigameId,
  MinigameDifficulty,
} from "@alibi/contracts";
import {
  WireGame,
  WireChallenge,
  WirePin,
  FingerprintGame,
  FingerprintChallenge,
  ArchiveLockGame,
  ArchiveLockChallenge,
  TimingPowerGame,
  TimingPowerChallenge,
  DocReconstructGame,
  DocReconstructChallenge,
  DocFragment,
  CodeDecipherGame,
  CodeDecipherChallenge,
  SignalMemoryGame,
  SignalMemoryChallenge,
  EvidenceAnalysisGame,
  EvidenceAnalysisChallenge,
  EvidenceDiscrepancy,
  CircuitGame,
  CipherGame,
  LogAuditGame,
  TracePatternGame,
  ChronologyGame,
  FrequencyGame,
  AnomalyGame,
  SealAuthGame,
  TerminalSyncGame,
  PacketReassemblyGame,
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
  Fingerprint,
  FileText,
  KeyRound,
  Radio,
  Eye,
  ShieldCheck,
  SlidersHorizontal,
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
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds || 30);
  const [difficulty, setDifficulty] = useState<MinigameDifficulty>(
    challenge.difficultyLevel || "STANDARD"
  );

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

  const handleFail = (msg = "Ação incorreta. Tente novamente.") => {
    sound.vibrate([100, 50, 100]);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* NOIR CRIMINAL INVESTIGATION FRAME */}
      <div className="w-full max-w-md noir-card border-[#4A3A32] flex flex-col overflow-hidden shadow-2xl relative max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-[#4A3A32] bg-[#14110E] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#221D19] border border-[#4A3A32] flex items-center justify-center text-[#B79A70] shadow-sm flex-shrink-0">
              {getMinigameIcon(challenge.minigameId)}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-widest text-[#B79A70] uppercase font-bold block truncate">
                PERÍCIA // {difficulty}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F2EDE4] leading-tight truncate">
                {getMinigameTitle(challenge.minigameId)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Difficulty Pill */}
            <div className="hidden sm:flex items-center gap-1 bg-[#1D1814] p-0.5 rounded-lg border border-[#4A3A32] text-[9px] font-mono">
              {(["CASUAL", "STANDARD", "TENSION"] as MinigameDifficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    sound.playTap();
                    setDifficulty(d);
                  }}
                  className={`px-1.5 py-0.5 rounded ${
                    difficulty === d
                      ? "bg-[#B79A70] text-[#0C0B0A] font-bold"
                      : "text-[#8C8074] hover:text-[#C2B7AA]"
                  }`}
                >
                  {d === "CASUAL" ? "Fácil" : d === "STANDARD" ? "Médio" : "Tensão"}
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1 font-mono text-xs text-[#F2EDE4] bg-[#221D19] px-2 py-1 rounded-lg border border-[#4A3A32] font-bold">
              <Clock className="w-3.5 h-3.5 text-[#B79A70]" />
              <span className={timeLeft <= 5 ? "text-[#F1A8A4] animate-pulse" : ""}>
                {timeLeft}s
              </span>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="p-1 text-[#C2B7AA] hover:text-[#F2EDE4] rounded-lg active:scale-95"
              title="Cancelar Perícia"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1-Line Tutorial Banner */}
        <div className="px-4 py-1.5 bg-[#1F1915] border-b border-[#4A3A32]/60 flex items-center gap-2 text-[11px] font-mono text-[#D8C8AC]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B79A70] animate-pulse" />
          <span className="truncate">{getMinigameInstruction(challenge.minigameId)}</span>
        </div>

        {/* Display Area */}
        <div className="relative bg-[#0C0B0A] p-3 sm:p-4 flex-1 overflow-y-auto min-h-[360px] flex flex-col justify-center">
          {/* Status Overlay Banners */}
          {solved && (
            <div className="absolute inset-x-4 top-4 z-40 p-3.5 bg-[#14231A] text-[#73917B] border border-[#73917B] rounded-xl flex items-center justify-center gap-2 text-xs font-serif font-bold shadow-lg animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-[#73917B]" />
              <span className="tracking-wide">LAUDO HOMOLOGADO // PROVA RECUPERADA</span>
            </div>
          )}

          {errorMsg && (
            <div className="absolute inset-x-4 top-4 z-40 p-3 bg-[#241113] text-[#F1A8A4] border border-[#9F3D3D] rounded-xl flex items-center justify-center gap-2 text-xs font-serif font-bold shadow-noir-crimson animate-in shake">
              <AlertTriangle className="w-4 h-4 text-[#F1A8A4]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 8 MINIGAMES NOIR ROUTER */}
          {(challenge.minigameId === "circuit_reconnect") && (
            <WireConnectComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "fingerprint_match" || challenge.minigameId === "trace_pattern") && (
            <FingerprintComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "archive_lock" || challenge.minigameId === "chronology_order" || challenge.minigameId === "seal_auth") && (
            <ArchiveLockComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "timing_power" || challenge.minigameId === "frequency_tune" || challenge.minigameId === "terminal_sync") && (
            <TimingPowerComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "doc_reconstruct" || challenge.minigameId === "packet_reassembly") && (
            <DocReconstructComponent difficulty={difficulty} onSuccess={handleSuccess} />
          )}

          {(challenge.minigameId === "cipher_breaker") && (
            <CodeDecipherComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "signal_memory") && (
            <SignalMemoryComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}

          {(challenge.minigameId === "evidence_analysis" || challenge.minigameId === "anomaly_detect" || challenge.minigameId === "log_audit") && (
            <EvidenceAnalysisComponent difficulty={difficulty} onSuccess={handleSuccess} onFail={handleFail} />
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// HELPER TITLES & INSTRUCTIONS
// =========================================================================

function getMinigameTitle(id: MinigameId): string {
  switch (id) {
    case "circuit_reconnect": return "Reconectar Fios de Emergência";
    case "fingerprint_match":
    case "trace_pattern": return "Analisar Impressão Digital";
    case "archive_lock":
    case "chronology_order":
    case "seal_auth": return "Abrir Arquivo Confidencial";
    case "timing_power":
    case "frequency_tune":
    case "terminal_sync": return "Restaurar Energia do Painel";
    case "doc_reconstruct":
    case "packet_reassembly": return "Recuperar Documento Rasgado";
    case "cipher_breaker": return "Decifrar Código da Chave";
    case "signal_memory": return "Interceptar Sinal do Telégrafo";
    case "evidence_analysis":
    case "anomaly_detect":
    case "log_audit": return "Analisar Evidência Pericial";
    default: return "Terminal Pericial";
  }
}

function getMinigameInstruction(id: MinigameId): string {
  switch (id) {
    case "circuit_reconnect": return "Toque no pino esquerdo e conecte ao terminal da mesma cor.";
    case "fingerprint_match":
    case "trace_pattern": return "Toque nas fatias para alinhar os sulcos da impressão digital.";
    case "archive_lock":
    case "chronology_order":
    case "seal_auth": return "Gire o disco de latão até a posição indicada no laudo.";
    case "timing_power":
    case "frequency_tune":
    case "terminal_sync": return "Toque no botão quando o ponteiro estiver na área marcada.";
    case "doc_reconstruct":
    case "packet_reassembly": return "Toque nos fragmentos na ordem numérica para recompor o laudo.";
    case "cipher_breaker": return "Digite a senha curta impressa no carimbo pericial.";
    case "signal_memory": return "Observe e repita a sequência de pulsos do telégrafo.";
    case "evidence_analysis":
    case "anomaly_detect":
    case "log_audit": return "Toque nas diferenças entre a foto original e a adulterada.";
    default: return "Complete o laudo pericial para avançar na investigação.";
  }
}

function getMinigameIcon(id: MinigameId) {
  switch (id) {
    case "circuit_reconnect": return <Zap className="w-4 h-4 text-[#B79A70]" />;
    case "fingerprint_match":
    case "trace_pattern": return <Fingerprint className="w-4 h-4 text-[#B79A70]" />;
    case "archive_lock":
    case "chronology_order":
    case "seal_auth": return <KeyRound className="w-4 h-4 text-[#B79A70]" />;
    case "timing_power":
    case "frequency_tune":
    case "terminal_sync": return <SlidersHorizontal className="w-4 h-4 text-[#B79A70]" />;
    case "doc_reconstruct":
    case "packet_reassembly": return <FileText className="w-4 h-4 text-[#B79A70]" />;
    case "cipher_breaker": return <Terminal className="w-4 h-4 text-[#B79A70]" />;
    case "signal_memory": return <Radio className="w-4 h-4 text-[#B79A70]" />;
    case "evidence_analysis":
    case "anomaly_detect":
    case "log_audit": return <Eye className="w-4 h-4 text-[#B79A70]" />;
    default: return <Terminal className="w-4 h-4 text-[#B79A70]" />;
  }
}

// =========================================================================
// 1. RECONECTAR CIRCUITO (WIRES)
// =========================================================================

interface WireConnectProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const WireConnectComponent: React.FC<WireConnectProps> = ({ difficulty, onSuccess, onFail }) => {
  const [challenge, setChallenge] = useState<WireChallenge>(() => WireGame.generate(difficulty));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});

  useEffect(() => {
    setChallenge(WireGame.generate(difficulty));
    setConnections({});
    setSelectedLeft(null);
  }, [difficulty]);

  const handleLeftPinClick = (pin: WirePin) => {
    sound.playTap();
    if (connections[pin.id]) {
      // Disconnect if already connected
      const next = { ...connections };
      delete next[pin.id];
      setConnections(next);
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(pin.id);
  };

  const handleRightPinClick = (pin: WirePin) => {
    if (!selectedLeft) return;
    const leftPin = challenge.leftPins.find((p) => p.id === selectedLeft);
    if (!leftPin) return;

    sound.playElectricRelay();

    // Check if right pin is already taken by another left pin
    const updated = { ...connections };
    for (const [k, v] of Object.entries(updated)) {
      if (v === pin.id) delete updated[k];
    }
    updated[selectedLeft] = pin.id;
    setConnections(updated);
    setSelectedLeft(null);

    // If all wires connected, verify!
    if (Object.keys(updated).length === challenge.wireCount) {
      if (WireGame.verify(updated, challenge)) {
        onSuccess();
      } else {
        onFail("Curto-circuito! Fios de cores incompatíveis.");
        setTimeout(() => setConnections({}), 600);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      {/* Vintage Fuse Box Container */}
      <div className="w-full bg-[#171411] p-4 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card relative">
        <div className="flex items-center justify-between mb-3 border-b border-[#4A3A32]/60 pb-2">
          <span className="text-[10px] font-mono text-[#B79A70] uppercase font-bold tracking-wider">
            CAIXA DE RELÉS // {challenge.wireCount} CIRCUITOS
          </span>
          <span className="text-[10px] font-mono text-[#C2B7AA]">
            {Object.keys(connections).length} / {challenge.wireCount} LIGADOS
          </span>
        </div>

        <div className="flex justify-between items-center relative py-2 px-1">
          {/* Left Pins */}
          <div className="flex flex-col gap-4 z-10">
            {challenge.leftPins.map((left) => {
              const isSelected = selectedLeft === left.id;
              const isConnected = !!connections[left.id];
              return (
                <button
                  key={left.id}
                  onClick={() => handleLeftPinClick(left)}
                  className={`flex items-center gap-2 p-2 rounded-xl transition-all border ${
                    isSelected
                      ? "border-[#B79A70] bg-[#2E2721] scale-105 shadow-noir-brass"
                      : isConnected
                      ? "border-[#4A3A32] bg-[#1E1915] opacity-90"
                      : "border-[#4A3A32] bg-[#221D19] hover:border-[#B79A70]"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#171411] shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: left.color }}
                  >
                    {isConnected && <div className="w-1.5 h-1.5 bg-[#F2EDE4] rounded-full" />}
                  </div>
                  <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                    {left.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center Visual Status */}
          <div className="flex-1 flex flex-col items-center justify-center px-2 text-center">
            <span className="text-[10px] font-mono text-[#8C8074] uppercase block">
              {selectedLeft ? "SELECIONE O DESTINO" : "SELECIONE A ORIGEM"}
            </span>
          </div>

          {/* Right Pins */}
          <div className="flex flex-col gap-4 z-10">
            {challenge.rightPins.map((right) => {
              const isConnected = Object.values(connections).includes(right.id);
              return (
                <button
                  key={right.id}
                  onClick={() => handleRightPinClick(right)}
                  className={`flex items-center gap-2 p-2 rounded-xl transition-all border ${
                    isConnected
                      ? "border-[#73917B]/60 bg-[#17221A]"
                      : selectedLeft
                      ? "border-[#B79A70] bg-[#221D19] hover:scale-105 shadow-sm"
                      : "border-[#4A3A32] bg-[#1E1915]"
                  }`}
                >
                  <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                    {right.name}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#171411] shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: right.color }}
                  >
                    {isConnected && <div className="w-1.5 h-1.5 bg-[#73917B] rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. ANALISAR DIGITAL (FINGERPRINT ALIGNMENT)
// =========================================================================

interface FingerprintProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const FingerprintComponent: React.FC<FingerprintProps> = ({ difficulty, onSuccess }) => {
  const [challenge] = useState<FingerprintChallenge>(() => FingerprintGame.generate(difficulty));
  const [slices, setSlices] = useState(challenge.slices);

  const handleSliceClick = (index: number) => {
    sound.playTap();
    const updated = [...slices];
    updated[index].currentVariant = FingerprintGame.cycleSlice(updated[index].currentVariant);
    setSlices(updated);

    if (FingerprintGame.isAligned(updated)) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-3">
      {/* Forensic Document Header */}
      <div className="w-full noir-paper p-3 rounded-xl border border-[#B09B7A] flex items-center justify-between text-[#30231C]">
        <div>
          <span className="stamp-evidence text-[8px]">LAUDO PAPILOSCÓPICO</span>
          <h4 className="font-serif font-bold text-sm leading-tight mt-0.5">
            Suspeito: {challenge.suspectName}
          </h4>
        </div>
        <Fingerprint className="w-6 h-6 text-[#5A4335]" />
      </div>

      {/* 3 Strips Biometric Scanner */}
      <div className="w-full bg-[#171411] p-3 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card space-y-2">
        <span className="text-[10px] font-mono text-[#B79A70] uppercase font-bold tracking-wider block text-center">
          LUPA PERICIAL // TOQUE PARA ALINHAR CADA FATIA
        </span>

        <div className="space-y-2">
          {slices.map((slice, idx) => {
            const isMatch = slice.currentVariant === slice.targetVariant;
            return (
              <button
                key={slice.id}
                onClick={() => handleSliceClick(idx)}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all active:scale-98 ${
                  isMatch
                    ? "bg-[#18231C] border-[#73917B]/80 shadow-sm"
                    : "bg-[#221D19] border-[#4A3A32] hover:border-[#B79A70]"
                }`}
              >
                <div className="text-left">
                  <span className="text-[9px] font-mono uppercase text-[#C2B7AA] block">
                    {slice.label}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#F2EDE4]">
                    Alinhamento #{slice.currentVariant + 1}
                  </span>
                </div>

                {/* Visual Ridge Lines Representation */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0C0B0A] rounded-lg border border-[#4A3A32]/60">
                  <div
                    className={`h-4 w-1.5 rounded-sm transition-all ${
                      isMatch ? "bg-[#73917B]" : "bg-[#B79A70]"
                    }`}
                    style={{ transform: `translateX(${slice.currentVariant * 4}px)` }}
                  />
                  <div
                    className={`h-5 w-1.5 rounded-sm transition-all ${
                      isMatch ? "bg-[#73917B]" : "bg-[#B79A70]"
                    }`}
                  />
                  <div
                    className={`h-4 w-1.5 rounded-sm transition-all ${
                      isMatch ? "bg-[#73917B]" : "bg-[#B79A70]"
                    }`}
                    style={{ transform: `translateX(-${slice.currentVariant * 4}px)` }}
                  />
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isMatch
                      ? "text-[#73917B] bg-[#73917B]/10"
                      : "text-[#B79A70] bg-[#2E2721]"
                  }`}
                >
                  {isMatch ? "OK" : "GIRAR"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. ABRIR ARQUIVO (ROTARY ARCHIVE LOCK)
// =========================================================================

interface ArchiveLockProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const ArchiveLockComponent: React.FC<ArchiveLockProps> = ({ difficulty, onSuccess }) => {
  const [challenge] = useState<ArchiveLockChallenge>(() => ArchiveLockGame.generate(difficulty));
  const [currentPos, setCurrentPos] = useState(challenge.initialPosition);

  const step = (direction: "LEFT" | "RIGHT") => {
    sound.playTumblerClick();
    const next = ArchiveLockGame.step(currentPos, direction, challenge.totalPositions);
    setCurrentPos(next);

    if (ArchiveLockGame.isUnlocked(next, challenge.targetPosition)) {
      setTimeout(() => onSuccess(), 400);
    }
  };

  const angle = ((currentPos - 1) / challenge.totalPositions) * 360;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      {/* Evidence Tag */}
      <div className="w-full noir-paper p-3 rounded-xl border border-[#B09B7A] text-center text-[#30231C]">
        <span className="stamp-confidential text-[8px] block mb-0.5">ORDEM DO GABINETE</span>
        <h4 className="font-serif font-bold text-base leading-tight">
          Destravar na Marcação Pericial:{" "}
          <strong className="underline text-lg font-mono">[{challenge.targetPosition}]</strong>
        </h4>
      </div>

      {/* Rotary Dial Graphic */}
      <div className="relative w-48 h-48 rounded-full bg-[#171411] border-4 border-[#B79A70] shadow-noir-brass flex items-center justify-center">
        {/* Rotating Dial Disk */}
        <div
          className="w-36 h-36 rounded-full bg-[#221D19] border-2 border-[#4A3A32] flex items-center justify-center transition-transform duration-200 relative shadow-inner"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Top Indicator Pip */}
          <div className="absolute top-1.5 w-3 h-3 bg-[#9F3D3D] rounded-full border border-[#F2EDE4]" />
          <div className="w-10 h-10 rounded-full bg-[#171411] border border-[#B79A70] flex items-center justify-center font-mono font-bold text-sm text-[#F2EDE4]">
            {currentPos}
          </div>
        </div>

        {/* Dial Numbers around perimeter */}
        {Array.from({ length: challenge.totalPositions }).map((_, i) => {
          const num = i + 1;
          const numAngle = ((i / challenge.totalPositions) * 360) - 90;
          const rad = (numAngle * Math.PI) / 180;
          const x = 76 * Math.cos(rad);
          const y = 76 * Math.sin(rad);
          const isTarget = num === challenge.targetPosition;

          return (
            <div
              key={num}
              className={`absolute text-xs font-mono font-bold ${
                isTarget ? "text-[#F1A8A4] scale-110" : "text-[#B79A70]"
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => step("LEFT")}
          className="flex-1 py-3 bg-[#221D19] hover:bg-[#2E2721] active:scale-95 rounded-xl border border-[#4A3A32] text-xs font-serif font-bold text-[#F2EDE4] shadow-sm flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4 text-[#B79A70]" />
          <span>GIRAR ESQUERDA</span>
        </button>

        <button
          onClick={() => step("RIGHT")}
          className="flex-1 py-3 bg-[#221D19] hover:bg-[#2E2721] active:scale-95 rounded-xl border border-[#4A3A32] text-xs font-serif font-bold text-[#F2EDE4] shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>GIRAR DIREITA</span>
          <RotateCcw className="w-4 h-4 text-[#B79A70] scale-x-[-1]" />
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 4. RESTAURAR ENERGIA (TIMING SKILLBAR)
// =========================================================================

interface TimingPowerProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const TimingPowerComponent: React.FC<TimingPowerProps> = ({ difficulty, onSuccess, onFail }) => {
  const [challenge] = useState<TimingPowerChallenge>(() => TimingPowerGame.generate(difficulty));
  const [markerPos, setMarkerPos] = useState(10);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let forward = true;
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = (elapsed % challenge.durationSeconds) / challenge.durationSeconds;
      
      // Ping pong between 5% and 95%
      const pos = Math.sin(progress * Math.PI) * 90 + 5;
      setMarkerPos(pos);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [challenge.durationSeconds]);

  const handleTrigger = () => {
    sound.playTap();
    if (TimingPowerGame.isHit(markerPos, challenge)) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      sound.playElectricRelay();
      onSuccess();
    } else {
      onFail("Fora de sincronia! Tente novamente no momento exato.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-5">
      {/* Galvanometer Meter Box */}
      <div className="w-full bg-[#171411] p-4 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#B79A70]">
          <span className="uppercase font-bold tracking-wider">GALVANÔMETRO PERICIAL</span>
          <span>ESTÁVEL: {challenge.zoneStart}% – {challenge.zoneEnd}%</span>
        </div>

        {/* Oscillating Bar Gauge */}
        <div className="relative h-12 bg-[#0C0B0A] rounded-xl border border-[#4A3A32] overflow-hidden flex items-center px-1">
          {/* Sweet Spot Zone */}
          <div
            className="absolute top-0 bottom-0 bg-[#73917B]/30 border-x-2 border-[#73917B] flex items-center justify-center shadow-inner"
            style={{
              left: `${challenge.zoneStart}%`,
              width: `${challenge.zoneEnd - challenge.zoneStart}%`,
            }}
          >
            <span className="text-[9px] font-mono text-[#73917B] uppercase font-bold tracking-widest opacity-80">
              ALVO
            </span>
          </div>

          {/* Moving Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-[#F2EDE4] border border-[#0C0B0A] rounded shadow-noir-brass z-20 transition-all duration-75"
            style={{ left: `${markerPos}%` }}
          >
            <div className="w-full h-full bg-[#B79A70] rounded-sm" />
          </div>
        </div>

        <p className="text-[11px] font-mono text-[#C2B7AA] text-center">
          Acione o contato no instante em que o ponteiro entrar na zona verde.
        </p>
      </div>

      {/* Massive Tactile Button */}
      <button
        onClick={handleTrigger}
        className="w-full py-4 rounded-xl bg-[#9F3D3D] hover:bg-[#832F2F] active:scale-95 text-[#F2EDE4] font-serif font-bold text-base tracking-widest uppercase shadow-tactile-primary border border-[#F1A8A4]/30"
      >
        ACIONAR CONTATO
      </button>
    </div>
  );
};

// =========================================================================
// 5. RECUPERAR DOCUMENTO (TORN DOCUMENT)
// =========================================================================

interface DocReconstructProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
}

const DocReconstructComponent: React.FC<DocReconstructProps> = ({ onSuccess }) => {
  const [challenge] = useState<DocReconstructChallenge>(() => DocReconstructGame.generate());
  const [placedIds, setPlacedIds] = useState<number[]>([]);

  const handleFragmentClick = (id: number) => {
    sound.playPaperRustle();
    const updated = [...placedIds, id];
    setPlacedIds(updated);

    if (updated.length === challenge.fragments.length) {
      if (DocReconstructGame.isSolved(updated)) {
        onSuccess();
      } else {
        // Reset if wrong order
        setTimeout(() => setPlacedIds([]), 800);
      }
    }
  };

  const remainingFragments = challenge.fragments.filter((f) => !placedIds.includes(f.id));

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-3">
      {/* Target Document Board */}
      <div className="w-full noir-paper p-3.5 rounded-xl border border-[#B09B7A] shadow-noir-paper text-[#30231C] space-y-2">
        <div className="flex items-center justify-between border-b border-[#30231C]/30 pb-1">
          <span className="stamp-confidential text-[8px]">RECONSTITUIÇÃO PERICIAL</span>
          <span className="text-[10px] font-mono">
            {placedIds.length} / {challenge.fragments.length} FRAGMENTOS
          </span>
        </div>

        {/* Placed Pieces Slots */}
        <div className="space-y-1.5 min-h-[110px]">
          {placedIds.map((id) => {
            const fragment = challenge.fragments.find((f) => f.id === id);
            return (
              <div
                key={id}
                className="p-2 bg-[#F2EDE4] rounded border border-[#B09B7A] text-xs font-serif text-[#30231C] shadow-sm animate-in fade-in"
              >
                {fragment?.textSnippet}
              </div>
            );
          })}

          {placedIds.length < challenge.fragments.length && (
            <div className="p-3 border-2 border-dashed border-[#B09B7A] rounded text-center text-[10px] font-mono text-[#5A4335] opacity-70">
              [ AGUARDANDO PRÓXIMO FRAGMENTO ]
            </div>
          )}
        </div>
      </div>

      {/* Available Fragments at Bottom */}
      <div className="w-full space-y-2">
        <span className="text-[10px] font-mono text-[#B79A70] uppercase font-bold block text-center">
          PEDAÇOS PICOTADOS (TOQUE NA ORDEM)
        </span>

        <div className="space-y-1.5">
          {remainingFragments.map((fragment) => (
            <button
              key={fragment.id}
              onClick={() => handleFragmentClick(fragment.id)}
              className="w-full p-2.5 bg-[#221D19] hover:bg-[#2E2721] active:scale-98 rounded-xl border border-[#4A3A32] text-left text-xs font-serif text-[#F2EDE4] shadow-sm flex items-center justify-between"
            >
              <span className="line-clamp-1">{fragment.textSnippet}</span>
              <span className="text-[10px] font-mono text-[#B79A70] ml-2 flex-shrink-0">
                Pedaço #{fragment.id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. DECIFRAR CÓDIGO (KEYPAD PIN ENTRY)
// =========================================================================

interface CodeDecipherProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const CodeDecipherComponent: React.FC<CodeDecipherProps> = ({ difficulty, onSuccess, onFail }) => {
  const [challenge] = useState<CodeDecipherChallenge>(() => CodeDecipherGame.generate(difficulty));
  const [entered, setEntered] = useState("");

  const handleDigit = (digit: string) => {
    sound.playTypewriterClick();
    if (entered.length >= challenge.codeLength) return;

    const next = entered + digit;
    setEntered(next);

    if (next.length === challenge.codeLength) {
      if (CodeDecipherGame.verify(next, challenge.code)) {
        onSuccess();
      } else {
        onFail("Código incorreto!");
        setTimeout(() => setEntered(""), 600);
      }
    }
  };

  const handleClear = () => {
    sound.playTap();
    setEntered("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto space-y-3">
      {/* Evidence Telegram Note */}
      <div className="w-full noir-paper p-2.5 rounded-xl border border-[#B09B7A] text-center text-[#30231C]">
        <span className="stamp-evidence text-[8px] block mb-0.5">TELEGRAMA PERICIAL</span>
        <span className="font-mono font-bold text-sm tracking-widest">
          SENHA DO COFRE: <strong className="underline text-base text-[#9F3D3D]">{challenge.code}</strong>
        </span>
      </div>

      {/* Screen Display */}
      <div className="w-full bg-[#171411] p-3 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card">
        <div className="bg-[#0C0B0A] p-2.5 rounded-xl border border-[#4A3A32] flex items-center justify-center gap-2 mb-3">
          {Array.from({ length: challenge.codeLength }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-10 rounded-lg bg-[#221D19] border border-[#4A3A32] flex items-center justify-center font-mono font-bold text-lg text-[#F2EDE4]"
            >
              {entered[i] || "_"}
            </div>
          ))}
        </div>

        {/* 3x4 Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0"].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === "C" ? handleClear() : handleDigit(btn))}
              className={`py-3 rounded-xl border font-mono font-bold text-base active:scale-95 transition-all ${
                btn === "C"
                  ? "bg-[#2A181A] border-[#9F3D3D]/50 text-[#F1A8A4]"
                  : "bg-[#221D19] border-[#4A3A32] text-[#F2EDE4] hover:border-[#B79A70]"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7. INTERCEPTAR SINAL (TELEGRAPH SEQUENCE)
// =========================================================================

interface SignalMemoryProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const SignalMemoryComponent: React.FC<SignalMemoryProps> = ({ difficulty, onSuccess, onFail }) => {
  const steps = difficulty === "CASUAL" ? 3 : difficulty === "TENSION" ? 5 : 4;
  const [challenge] = useState<SignalMemoryChallenge>(() => SignalMemoryGame.generate(steps, 4));
  const [activeLamp, setActiveLamp] = useState<number | null>(null);
  const [playerSteps, setPlayerSteps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Play sequence on mount
  useEffect(() => {
    let index = 0;
    setIsPlaying(true);
    setPlayerSteps([]);

    const interval = setInterval(() => {
      if (index < challenge.sequence.length) {
        const lamp = challenge.sequence[index];
        setActiveLamp(lamp);
        sound.playTelegraphBeep(500 + lamp * 150);
        setTimeout(() => setActiveLamp(null), 350);
        index++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [challenge]);

  const handleLampClick = (idx: number) => {
    if (isPlaying) return;
    sound.playTelegraphBeep(500 + idx * 150);
    setActiveLamp(idx);
    setTimeout(() => setActiveLamp(null), 250);

    const nextSteps = [...playerSteps, idx];
    setPlayerSteps(nextSteps);

    // Verify current step
    const currentStepIdx = nextSteps.length - 1;
    if (nextSteps[currentStepIdx] !== challenge.sequence[currentStepIdx]) {
      onFail("Sequência rompida! Tente novamente.");
      setPlayerSteps([]);
      return;
    }

    if (nextSteps.length === challenge.sequence.length) {
      onSuccess();
    }
  };

  const lampLabels = [
    { name: "Rubi (▲)", color: "#9F3D3D" },
    { name: "Latão (●)", color: "#B79A70" },
    { name: "Marfim (■)", color: "#F2EDE4" },
    { name: "Ardósia (◆)", color: "#7B849D" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto space-y-4">
      <div className="w-full bg-[#171411] p-4 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card text-center space-y-3">
        <span className="text-[10px] font-mono text-[#B79A70] uppercase font-bold tracking-wider block">
          {isPlaying ? "TRANSMITINDO PULSOS..." : "REPRODUZA A TRANSMISSÃO"}
        </span>

        {/* 2x2 Lamps */}
        <div className="grid grid-cols-2 gap-3 p-2">
          {lampLabels.map((lamp, idx) => {
            const isActive = activeLamp === idx;
            return (
              <button
                key={idx}
                disabled={isPlaying}
                onClick={() => handleLampClick(idx)}
                className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isActive
                    ? "scale-105 shadow-noir-brass"
                    : "bg-[#221D19] border-[#4A3A32] hover:border-[#B79A70]"
                }`}
                style={{
                  backgroundColor: isActive ? lamp.color : "#1C1714",
                  borderColor: isActive ? "#F2EDE4" : "#4A3A32",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border border-[#0C0B0A]"
                  style={{ backgroundColor: lamp.color }}
                />
                <span
                  className="text-xs font-serif font-bold"
                  style={{ color: isActive ? "#0C0B0A" : "#F2EDE4" }}
                >
                  {lamp.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-[#C2B7AA]">
          Progresso: {playerSteps.length} / {challenge.sequence.length}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 8. ANALISAR EVIDÊNCIA (SPOT DIFFERENCES)
// =========================================================================

interface EvidenceAnalysisProps {
  difficulty: MinigameDifficulty;
  onSuccess: () => void;
  onFail: (msg: string) => void;
}

const EvidenceAnalysisComponent: React.FC<EvidenceAnalysisProps> = ({
  difficulty,
  onSuccess,
}) => {
  const [challenge] = useState<EvidenceAnalysisChallenge>(() =>
    EvidenceAnalysisGame.generate(difficulty)
  );
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    for (const diff of challenge.differences) {
      if (foundIds.includes(diff.id)) continue;

      if (EvidenceAnalysisGame.isDifferenceHit(clickX, clickY, diff)) {
        sound.playEvidenceChime();
        const updated = [...foundIds, diff.id];
        setFoundIds(updated);

        if (EvidenceAnalysisGame.isComplete(updated, challenge)) {
          onSuccess();
        }
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-3">
      {/* Header Info */}
      <div className="w-full noir-paper p-2.5 rounded-xl border border-[#B09B7A] flex items-center justify-between text-[#30231C]">
        <div>
          <span className="stamp-evidence text-[8px]">{challenge.title}</span>
          <p className="text-[11px] font-serif mt-0.5 leading-snug">{challenge.subtitle}</p>
        </div>
        <span className="text-xs font-mono font-bold text-[#9F3D3D]">
          {foundIds.length} / {challenge.totalDifferences}
        </span>
      </div>

      {/* Photo Comparison Display (Stacked on Mobile) */}
      <div className="w-full bg-[#171411] p-3 rounded-2xl border-2 border-[#4A3A32] shadow-noir-card space-y-3">
        {/* Tampered Scene Photo (Interactive) */}
        <div className="relative">
          <span className="text-[9px] font-mono text-[#F1A8A4] uppercase font-bold tracking-wider block mb-1">
            FOTOGRAFIA CENA ADULTERADA (TOQUE NAS DISCREPÂNCIAS)
          </span>

          <div
            onClick={handlePhotoClick}
            className="w-full h-48 bg-[#0C0B0A] rounded-xl border border-[#4A3A32] relative overflow-hidden cursor-crosshair shadow-inner"
          >
            {/* Architectural Scene Artwork (Stylized Crime Scene) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714] to-[#0C0B0A] opacity-90 p-3 flex flex-col justify-between">
              <div className="flex justify-between items-start text-[10px] font-mono text-[#8C8074]">
                <span>RELÓGIO DE PAREDE</span>
                <span>CRISTALEIRA</span>
              </div>
              <div className="flex justify-between items-end text-[10px] font-mono text-[#8C8074]">
                <span>MESA DE CENTRO</span>
                <span>CINZEIRO DE PRATA</span>
              </div>
            </div>

            {/* Target Discrepancy Clues Visualized */}
            {challenge.differences.map((diff) => {
              const isFound = foundIds.includes(diff.id);
              return (
                <div
                  key={diff.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${diff.xPercent}%`,
                    top: `${diff.yPercent}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {isFound ? (
                    <div className="w-10 h-10 rounded-full border-2 border-[#9F3D3D] bg-[#9F3D3D]/20 animate-in zoom-in-75 flex items-center justify-center">
                      <span className="text-[8px] font-mono text-[#F2EDE4] font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-[#B79A70]/40 opacity-50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Found List */}
        <div className="space-y-1">
          {challenge.differences.map((diff) => {
            const isFound = foundIds.includes(diff.id);
            return (
              <div
                key={diff.id}
                className={`text-[10px] font-mono px-2 py-1 rounded flex items-center justify-between ${
                  isFound
                    ? "bg-[#18231C] text-[#73917B] border border-[#73917B]/40"
                    : "text-[#8C8074] bg-[#120F0D]"
                }`}
              >
                <span>{diff.name}: {diff.description}</span>
                <span>{isFound ? "EVIDENCIADO" : "PENDENTE"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
