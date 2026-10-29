// 09: Localizar Anomalia
// Spot discrepancy in architectural sensor grid

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
