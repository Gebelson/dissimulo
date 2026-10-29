// 10: Autenticar Documento
// Digital stamp concentric rings rotation alignment

export interface SealRing {
  id: number;
  rotation: number; // 0, 90, 180, 270
  targetRotation: number;
  glyph: string;
}

export interface SealAuthChallenge {
  rings: SealRing[];
}

export class SealAuthGame {
  public static generate(): SealAuthChallenge {
    const glyphs = ["◆", "▲", "●"];
    const rings: SealRing[] = glyphs.map((glyph, idx) => ({
      id: idx,
      rotation: [90, 180, 270][Math.floor(Math.random() * 3)],
      targetRotation: 0,
      glyph,
    }));

    return { rings };
  }

  public static rotateRing(ring: SealRing): void {
    ring.rotation = (ring.rotation + 90) % 360;
  }

  public static isAligned(rings: SealRing[]): boolean {
    return rings.every((r) => r.rotation === r.targetRotation);
  }
}
