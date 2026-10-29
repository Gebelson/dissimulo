// 06: Análise de Vestígios
// Forensic biometric/spectrogram ridge pattern matching

export interface PatternSample {
  id: string;
  ridgeCount: number;
  frequencyBars: number[];
  label: string;
}

export interface TracePatternChallenge {
  referenceSample: PatternSample;
  candidateSamples: PatternSample[];
  correctSampleId: string;
}

export class TracePatternGame {
  public static generate(): TracePatternChallenge {
    const generateBars = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 20);

    const ref: PatternSample = {
      id: "ref_sample",
      ridgeCount: 14,
      frequencyBars: generateBars(),
      label: "Vestígio Coletado na Maçaneta",
    };

    // Correct clone candidate
    const correct: PatternSample = {
      id: "candidate_correct",
      ridgeCount: ref.ridgeCount,
      frequencyBars: [...ref.frequencyBars],
      label: "Amostra Pericial Alpha",
    };

    // Distractor 1
    const dist1: PatternSample = {
      id: "candidate_dist1",
      ridgeCount: ref.ridgeCount + 2,
      frequencyBars: ref.frequencyBars.map((v, i) => (i % 2 === 0 ? v + 15 : v)),
      label: "Amostra Pericial Beta",
    };

    // Distractor 2
    const dist2: PatternSample = {
      id: "candidate_dist2",
      ridgeCount: ref.ridgeCount - 3,
      frequencyBars: ref.frequencyBars.map((v, i) => (i % 2 !== 0 ? v - 20 : v)),
      label: "Amostra Pericial Gamma",
    };

    const candidates = [correct, dist1, dist2].sort(() => Math.random() - 0.5);

    return {
      referenceSample: ref,
      candidateSamples: candidates,
      correctSampleId: correct.id,
    };
  }

  public static verify(selectedId: string, correctId: string): boolean {
    return selectedId === correctId;
  }
}
