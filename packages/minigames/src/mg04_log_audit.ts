// 04: Comparação de Registros
// Two security logs compared side-by-side. Spot the 3 altered lines.

export interface LogLine {
  id: number;
  time: string;
  room: string;
  user: string;
  action: string;
  isTampered: boolean;
  alteredText?: string;
}

export interface LogAuditChallenge {
  originalLogs: LogLine[];
  inspectedLogs: LogLine[];
  tamperedLineIds: number[];
}

export class LogAuditGame {
  public static generate(): LogAuditChallenge {
    const base: Omit<LogLine, "isTampered">[] = [
      { id: 1, time: "20:45", room: "Sala", user: "Convidado_01", action: "Entrada" },
      { id: 2, time: "21:02", room: "Escritório", user: "Técnico", action: "Leitura de Log" },
      { id: 3, time: "21:14", room: "Varanda", user: "Informante", action: "Recepção de Sinal" },
      { id: 4, time: "21:28", room: "Cozinha", user: "Convidado_02", action: "Acesso" },
      { id: 5, time: "21:40", room: "Suíte", user: "Anfitrião", action: "Fechamento de Porta" },
    ];

    // Pick 2 lines to tamper
    const tamperedIndices = [1, 3]; // line 2 and 4
    const original: LogLine[] = [];
    const inspected: LogLine[] = [];

    base.forEach((item, idx) => {
      const isTampered = tamperedIndices.includes(idx);
      original.push({ ...item, isTampered: false });

      if (isTampered) {
        inspected.push({
          ...item,
          time: idx === 1 ? "21:42" : item.time, // Altered time
          user: idx === 3 ? "DESCONHECIDO" : item.user, // Altered user
          isTampered: true,
        });
      } else {
        inspected.push({ ...item, isTampered: false });
      }
    });

    return {
      originalLogs: original,
      inspectedLogs: inspected,
      tamperedLineIds: tamperedIndices.map((idx) => base[idx].id),
    };
  }

  public static verify(selectedIds: number[], expectedTamperedIds: number[]): boolean {
    if (selectedIds.length !== expectedTamperedIds.length) return false;
    return expectedTamperedIds.every((id) => selectedIds.includes(id));
  }
}
