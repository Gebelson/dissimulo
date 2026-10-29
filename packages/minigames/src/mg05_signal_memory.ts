// 05: Memória de Sinais
// Sequential light/relay memory test (Simon Says pattern)

export interface SignalMemoryChallenge {
  sequence: number[]; // e.g. [0, 2, 1, 3, 0]
  relayCount: number;
}

export class SignalMemoryGame {
  public static generate(steps = 4, relayCount = 4): SignalMemoryChallenge {
    const sequence: number[] = [];
    for (let i = 0; i < steps; i++) {
      sequence.push(Math.floor(Math.random() * relayCount));
    }
    return {
      sequence,
      relayCount,
    };
  }

  public static verify(playerSequence: number[], targetSequence: number[]): boolean {
    if (playerSequence.length !== targetSequence.length) return false;
    return targetSequence.every((val, idx) => playerSequence[idx] === val);
  }
}
