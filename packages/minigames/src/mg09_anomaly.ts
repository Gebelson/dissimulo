// 09: Analisar Evidência (Spot Differences) & Localizar Anomalia
// Spotting discrepancies between Original vs Tampered crime scene photograph.
// Preserves legacy sensor anomaly detection for compatibility.

export interface EvidenceDiscrepancy {
  id: string;
  name: string;
  description: string;
  xPercent: number; // 0 to 100 on photo
  yPercent: number; // 0 to 100 on photo
  radiusPercent: number;
}

export interface EvidenceAnalysisChallenge {
  title: string;
  subtitle: string;
  differences: EvidenceDiscrepancy[];
  totalDifferences: number;
}

export const EVIDENCE_SCENARIOS = [
  {
    title: "Cena do Crime // Salão Principal",
    subtitle: "Compare a perícia preliminar com a cena encontrada às 23:40.",
    discrepancies: [
      { id: "diff_wine", name: "Cálice de Cristal", description: "Resíduo de veneno no fundo da taça", xPercent: 32, yPercent: 48, radiusPercent: 16 },
      { id: "diff_clock", name: "Relógio Carrilhão", description: "Ponteiro atrasado em 45 minutos", xPercent: 74, yPercent: 28, radiusPercent: 16 },
      { id: "diff_key", name: "Cinzeiro de Prata", description: "Chave do arquivo foi subtraída", xPercent: 54, yPercent: 74, radiusPercent: 16 },
    ],
  },
  {
    title: "Gabinete // Documento Confidencial",
    subtitle: "Analise as rasuras e adulterações no laudo de presença.",
    discrepancies: [
      { id: "diff_seal", name: "Selo Notarial", description: "Chancela violada e recomposta", xPercent: 26, yPercent: 36, radiusPercent: 16 },
      { id: "diff_sig", name: "Assinatura do Host", description: "Traçado trêmulo e falsificado", xPercent: 70, yPercent: 68, radiusPercent: 16 },
      { id: "diff_stamp", name: "Carimbo de Entrada", description: "Horário adulterado com tinta fresca", xPercent: 50, yPercent: 82, radiusPercent: 16 },
    ],
  },
];

export class EvidenceAnalysisGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): EvidenceAnalysisChallenge {
    const scenario = EVIDENCE_SCENARIOS[Math.floor(Math.random() * EVIDENCE_SCENARIOS.length)];
    let count = 2;
    if (difficulty === "CASUAL" || difficulty === 1) count = 1;
    if (difficulty === "TENSION" || (typeof difficulty === "number" && difficulty >= 3)) count = 3;

    const selectedDiffs = scenario.discrepancies.slice(0, count);

    return {
      title: scenario.title,
      subtitle: scenario.subtitle,
      differences: selectedDiffs,
      totalDifferences: selectedDiffs.length,
    };
  }

  public static isDifferenceHit(
    clickXPercent: number,
    clickYPercent: number,
    diff: EvidenceDiscrepancy
  ): boolean {
    const dx = clickXPercent - diff.xPercent;
    const dy = clickYPercent - diff.yPercent;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= diff.radiusPercent;
  }

  public static isComplete(foundIds: string[], challenge: EvidenceAnalysisChallenge): boolean {
    return challenge.differences.every((d) => foundIds.includes(d.id));
  }
}

export interface AnomalyZone {
  id: string;
  name: string;
  isTampered: boolean;
  tamperingDescription: string;
}

export interface AnomalyChallenge {
  zones: AnomalyZone[];
  tamperedZoneIds: string[];
}

export class AnomalyGame {
  public static generatePhotoAnalysis(difficulty?: any): EvidenceAnalysisChallenge {
    return EvidenceAnalysisGame.generate(difficulty);
  }

  public static generate(): AnomalyChallenge {
    const zones: AnomalyZone[] = [
      { id: "z1", name: "Setor A: Sensor Perimetral Sala", isTampered: false, tamperingDescription: "Normal" },
      { id: "z2", name: "Setor B: Trava Eletromagnética Escritório", isTampered: true, tamperingDescription: "Circuito derivado manualmente" },
      { id: "z3", name: "Setor C: Microfone da Varanda", isTampered: false, tamperingDescription: "Normal" },
      { id: "z4", name: "Setor D: Monitor da Cozinha", isTampered: true, tamperingDescription: "Registro de alimentação adulterado" },
      { id: "z5", name: "Setor E: Câmera Área Piscina", isTampered: false, tamperingDescription: "Normal" },
    ];

    return {
      zones,
      tamperedZoneIds: ["z2", "z4"],
    };
  }

  public static verify(selectedIds: string[], expectedIds: string[]): boolean {
    if (selectedIds.length !== expectedIds.length) return false;
    return expectedIds.every((id) => selectedIds.includes(id));
  }
}
