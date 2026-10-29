// 06: Análise de Vestígios & Digital (Fingerprint Alignment)
// Forensic biometric fingerprint alignment with 3 slices.
// Preserves legacy trace pattern matching for compatibility.

export interface FingerprintSlice {
  id: number;
  label: string;
  currentVariant: number; // 0, 1, 2
  targetVariant: number;
  totalVariants: number;
}

export interface FingerprintChallenge {
  slices: FingerprintSlice[];
  targetId: string;
  suspectName: string;
}

export class FingerprintGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): FingerprintChallenge {
    const suspectNames = ["Beatriz Ramos", "Carlos Valente", "Arthur Mendes", "Helena Duarte"];
    const suspect = suspectNames[Math.floor(Math.random() * suspectNames.length)];

    // 3 slices: Top, Center, Base
    const sliceLabels = ["Parte Superior (Núcleo)", "Parte Central (Espirais)", "Parte Inferior (Base)"];
    
    const slices: FingerprintSlice[] = sliceLabels.map((label, idx) => {
      // Pick a random initial offset other than 0 for at least one slice
      const initOffset = idx === 0 ? 1 : Math.floor(Math.random() * 2) + 1;
      return {
        id: idx,
        label,
        currentVariant: initOffset,
        targetVariant: 0,
        totalVariants: 3,
      };
    });

    return {
      slices,
      targetId: "fp_ref_842",
      suspectName: suspect,
    };
  }

  public static cycleSlice(currentVariant: number, total = 3): number {
    return (currentVariant + 1) % total;
  }

  public static isAligned(slices: { currentVariant: number; targetVariant: number }[]): boolean {
    return slices.every((s) => s.currentVariant === s.targetVariant);
  }
}

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
  public static generateFingerprint(difficulty?: any): FingerprintChallenge {
    return FingerprintGame.generate(difficulty);
  }

  public static verifyFingerprint(slices: any[]): boolean {
    return FingerprintGame.isAligned(slices);
  }

  public static generate(): TracePatternChallenge {
    const generateBars = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 20);

    const ref: PatternSample = {
      id: "ref_sample",
      ridgeCount: 14,
      frequencyBars: generateBars(),
      label: "Vestígio Coletado na Maçaneta",
    };

    const correct: PatternSample = {
      id: "candidate_correct",
      ridgeCount: ref.ridgeCount,
      frequencyBars: [...ref.frequencyBars],
      label: "Amostra Pericial Alpha",
    };

    const dist1: PatternSample = {
      id: "candidate_dist1",
      ridgeCount: ref.ridgeCount + 2,
      frequencyBars: ref.frequencyBars.map((v, i) => (i % 2 === 0 ? v + 15 : v)),
      label: "Amostra Pericial Beta",
    };

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
