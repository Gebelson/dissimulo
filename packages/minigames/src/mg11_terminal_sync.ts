// 11: Sincronizar Terminais
// Cryptographic mutual handshake synchronization

export interface TerminalSyncChallenge {
  terminalCodeA: string;
  terminalCodeB: string;
  expectedSumCode: number;
  options: number[];
}

export class TerminalSyncGame {
  public static generate(): TerminalSyncChallenge {
    const valA = Math.floor(Math.random() * 400) + 100;
    const valB = Math.floor(Math.random() * 400) + 100;
    const sum = valA + valB;

    const options = [sum, sum + 12, sum - 18, sum + 25].sort(() => Math.random() - 0.5);

    return {
      terminalCodeA: `TRM-01:${valA}`,
      terminalCodeB: `TRM-02:${valB}`,
      expectedSumCode: sum,
      options,
    };
  }

  public static verify(selectedCode: number, expected: number): boolean {
    return selectedCode === expected;
  }
}
