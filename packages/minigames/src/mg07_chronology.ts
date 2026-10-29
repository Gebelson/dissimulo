// 07: Reconstruir Cronologia
// Sorting scrambled event cards into strict chronological sequence

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
