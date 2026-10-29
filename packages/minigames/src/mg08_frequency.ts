// 08: Restaurar Energia (Timing Skillbar) & Estabilizar Frequência
// Needle oscillating across a vintage galvanometer. Player taps within the target zone.
// Preserves legacy frequency tuning for compatibility.

export interface TimingPowerChallenge {
  zoneStart: number; // in percent (0 to 100)
  zoneEnd: number;   // in percent (0 to 100)
  durationSeconds: number; // oscillation speed
  label: string;
}

export class TimingPowerGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): TimingPowerChallenge {
    let zoneStart = 42;
    let zoneEnd = 64;
    let durationSeconds = 2.2;

    if (difficulty === "CASUAL" || difficulty === 1) {
      zoneStart = 35;
      zoneEnd = 70;
      durationSeconds = 2.8;
    } else if (difficulty === "TENSION" || (typeof difficulty === "number" && difficulty >= 3)) {
      zoneStart = 46;
      zoneEnd = 60;
      durationSeconds = 1.7;
    }

    return {
      zoneStart,
      zoneEnd,
      durationSeconds,
      label: "Painel de Distribuição // Relé de Cobre",
    };
  }

  public static isHit(markerPercent: number, challenge: TimingPowerChallenge): boolean {
    return markerPercent >= challenge.zoneStart && markerPercent <= challenge.zoneEnd;
  }
}

export interface FrequencyChallenge {
  targetFreq: number;
  targetAmp: number;
  tolerance: number;
  initialFreq: number;
  initialAmp: number;
}

export class FrequencyGame {
  public static generateSkillbar(difficulty?: any): TimingPowerChallenge {
    return TimingPowerGame.generate(difficulty);
  }

  public static verifySkillbar(markerPercent: number, challenge: TimingPowerChallenge): boolean {
    return TimingPowerGame.isHit(markerPercent, challenge);
  }

  public static generate(): FrequencyChallenge {
    return {
      targetFreq: Math.floor(Math.random() * 40) + 40,
      targetAmp: Math.floor(Math.random() * 40) + 50,
      tolerance: 6,
      initialFreq: 20,
      initialAmp: 30,
    };
  }

  public static isTuned(challenge: FrequencyChallenge, currentFreq: number, currentAmp: number): boolean {
    const freqDiff = Math.abs(currentFreq - challenge.targetFreq);
    const ampDiff = Math.abs(currentAmp - challenge.targetAmp);
    return freqDiff <= challenge.tolerance && ampDiff <= challenge.tolerance;
  }
}
