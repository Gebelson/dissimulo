// 01: Reconectar Circuitos // Fios de Emergência
// Left-to-right wire connection in vintage brass fusebox.
// Also maintains grid rotation challenge for legacy compatibility.

export interface WirePin {
  id: string;
  colorKey: "crimson" | "brass" | "slate" | "copper";
  name: string;
  color: string;
  glow: string;
}

export interface WireChallenge {
  wireCount: number;
  difficulty: "CASUAL" | "STANDARD" | "TENSION";
  leftPins: WirePin[];
  rightPins: WirePin[];
}

export const WIRE_COLOR_PRESETS: WirePin[] = [
  { id: "wire_crimson", colorKey: "crimson", name: "Carmesim", color: "#9F3D3D", glow: "rgba(159, 61, 61, 0.6)" },
  { id: "wire_brass", colorKey: "brass", name: "Latão", color: "#B79A70", glow: "rgba(183, 154, 112, 0.6)" },
  { id: "wire_slate", colorKey: "slate", name: "Ardósia", color: "#7B849D", glow: "rgba(123, 132, 157, 0.6)" },
  { id: "wire_copper", colorKey: "copper", name: "Cobre", color: "#C47246", glow: "rgba(196, 114, 70, 0.6)" },
];

export class WireGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): WireChallenge {
    let wireCount = 3;
    let diffName: "CASUAL" | "STANDARD" | "TENSION" = "STANDARD";

    if (difficulty === "CASUAL" || difficulty === 1) {
      wireCount = 2;
      diffName = "CASUAL";
    } else if (difficulty === "TENSION" || (typeof difficulty === "number" && difficulty >= 3)) {
      wireCount = 4;
      diffName = "TENSION";
    }

    const selectedColors = WIRE_COLOR_PRESETS.slice(0, wireCount);
    const leftPins: WirePin[] = selectedColors.map((w, idx) => ({ ...w, id: `left_${w.colorKey}_${idx}` }));
    
    // Shuffle for right pins, ensuring not identical order if wireCount > 1
    let rightPins = selectedColors.map((w, idx) => ({ ...w, id: `right_${w.colorKey}_${idx}` })).sort(() => Math.random() - 0.5);
    if (wireCount > 1 && rightPins.every((p, i) => p.colorKey === leftPins[i].colorKey)) {
      rightPins = [rightPins[1], rightPins[0], ...rightPins.slice(2)];
    }

    return {
      wireCount,
      difficulty: diffName,
      leftPins,
      rightPins,
    };
  }

  public static verify(connections: Record<string, string>, challenge: WireChallenge): boolean {
    // connections maps leftPin.id -> rightPin.id
    if (Object.keys(connections).length < challenge.wireCount) return false;
    
    for (const leftPin of challenge.leftPins) {
      const rightPinId = connections[leftPin.id];
      if (!rightPinId) return false;
      const rightPin = challenge.rightPins.find((p) => p.id === rightPinId);
      if (!rightPin || rightPin.colorKey !== leftPin.colorKey) {
        return false;
      }
    }
    return true;
  }
}

export interface CircuitTile {
  id: number;
  baseConnections: [boolean, boolean, boolean, boolean];
  rotation: number;
}

export interface CircuitChallenge {
  gridSize: number;
  tiles: CircuitTile[];
  sourceTileId: number;
  sinkTileId: number;
}

export class CircuitGame {
  public static generateWires(difficulty?: "CASUAL" | "STANDARD" | "TENSION" | number): WireChallenge {
    return WireGame.generate(difficulty);
  }

  public static verifyWires(connections: Record<string, string>, challenge: WireChallenge): boolean {
    return WireGame.verify(connections, challenge);
  }

  public static generate(gridSize = 3): CircuitChallenge {
    const count = gridSize * gridSize;
    const tiles: CircuitTile[] = [];

    for (let i = 0; i < count; i++) {
      let base: [boolean, boolean, boolean, boolean] = [false, true, true, false];
      if (i % 2 === 0) base = [true, false, true, false];
      if (i === count - 1) base = [true, false, false, true];

      const randomRot = [90, 180, 270][Math.floor(Math.random() * 3)];
      tiles.push({
        id: i,
        baseConnections: base,
        rotation: randomRot,
      });
    }

    return {
      gridSize,
      tiles,
      sourceTileId: 0,
      sinkTileId: count - 1,
    };
  }

  public static getActiveConnections(tile: CircuitTile): [boolean, boolean, boolean, boolean] {
    const steps = (tile.rotation / 90) % 4;
    const b = tile.baseConnections;
    const rotated: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      rotated[(i + steps) % 4] = b[i];
    }
    return rotated;
  }

  public static rotateTile(tile: CircuitTile): void {
    tile.rotation = (tile.rotation + 90) % 360;
  }

  public static isSolved(challenge: CircuitChallenge): boolean {
    const { gridSize, tiles, sourceTileId, sinkTileId } = challenge;
    const visited = new Set<number>();
    const queue: number[] = [sourceTileId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === sinkTileId) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      const r = Math.floor(current / gridSize);
      const c = current % gridSize;
      const [top, right, bottom, left] = this.getActiveConnections(tiles[current]);

      if (top && r > 0) {
        const neighborId = (r - 1) * gridSize + c;
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nBottom && !visited.has(neighborId)) queue.push(neighborId);
      }
      if (right && c < gridSize - 1) {
        const neighborId = r * gridSize + (c + 1);
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nLeft && !visited.has(neighborId)) queue.push(neighborId);
      }
      if (bottom && r < gridSize - 1) {
        const neighborId = (r + 1) * gridSize + c;
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nTop && !visited.has(neighborId)) queue.push(neighborId);
      }
      if (left && c > 0) {
        const neighborId = r * gridSize + (c - 1);
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nRight && !visited.has(neighborId)) queue.push(neighborId);
      }
    }

    return false;
  }
}
