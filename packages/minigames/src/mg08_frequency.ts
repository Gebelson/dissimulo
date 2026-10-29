// 08: Estabilizar Frequência
// Wave synthesizer tuning: frequency & amplitude sliders must match the target zone

export interface FrequencyChallenge {
  targetFreq: number; // e.g. 60 Hz
  targetAmp: number;  // e.g. 75 %
  tolerance: number;  // +/- 5
  initialFreq: number;
  initialAmp: number;
}

export class FrequencyGame {
  public static generate(): FrequencyChallenge {
    return {
      targetFreq: Math.floor(Math.random() * 40) + 40, // 40 - 80 Hz
      targetAmp: Math.floor(Math.random() * 40) + 50,  // 50 - 90 %
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
