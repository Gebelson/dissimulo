// 07: Abrir Arquivo (Archive Lock) & Cronologia
// Mechanical rotating safe dial / file cabinet tumbler.
// Preserves legacy chronological ordering for compatibility.

export interface ArchiveLockChallenge {
  totalPositions: number; // default 8
  targetPosition: number; // e.g. 5
  initialPosition: number; // e.g. 1
  label: string;
  evidenceCode: string;
}

export class ArchiveLockGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): ArchiveLockChallenge {
    const totalPositions = 8;
    const target = Math.floor(Math.random() * totalPositions) + 1; // 1 to 8
    
    // Pick an initial position that is distinct from target
    let initial = Math.floor(Math.random() * totalPositions) + 1;
    if (initial === target) {
      initial = (target % totalPositions) + 1;
    }

    return {
      totalPositions,
      targetPosition: target,
      initialPosition: initial,
      label: "Arquivo de Laudos Forenses // Gaveta B-4",
      evidenceCode: `MARCAÇÃO PERICIAL: SEGREDOS [ ${target} ]`,
    };
  }

  public static step(current: number, direction: "LEFT" | "RIGHT", total = 8): number {
    if (direction === "RIGHT") {
      return (current % total) + 1;
    } else {
      return current === 1 ? total : current - 1;
    }
  }

  public static isUnlocked(current: number, target: number): boolean {
    return current === target;
  }
}

export interface ChronoEvent {
  id: number;
  timeStr: string;
  minutesTimestamp: number;
  description: string;
}

export interface ChronologyChallenge {
  events: ChronoEvent[]; // Scrambled
  correctOrderIds: number[];
}

export class ChronologyGame {
  public static generateDial(difficulty?: any): ArchiveLockChallenge {
    return ArchiveLockGame.generate(difficulty);
  }

  public static verifyDial(current: number, target: number): boolean {
    return ArchiveLockGame.isUnlocked(current, target);
  }

  public static generate(): ChronologyChallenge {
    const sortedEvents: ChronoEvent[] = [
      { id: 1, timeStr: "20:50", minutesTimestamp: 50, description: "Chegada dos participantes na Sala" },
      { id: 2, timeStr: "21:05", minutesTimestamp: 65, description: "Desligamento temporário da iluminação externa" },
      { id: 3, timeStr: "21:18", minutesTimestamp: 78, description: "Transmissão clandestina detectada na Varanda" },
      { id: 4, timeStr: "21:32", minutesTimestamp: 92, description: "Alarme do console do Escritório acionado" },
    ];

    const scrambled = [...sortedEvents].sort(() => Math.random() - 0.5);

    return {
      events: scrambled,
      correctOrderIds: [1, 2, 3, 4],
    };
  }

  public static verify(currentOrderIds: number[]): boolean {
    for (let i = 0; i < currentOrderIds.length; i++) {
      if (currentOrderIds[i] !== i + 1) return false;
    }
    return true;
  }
}
