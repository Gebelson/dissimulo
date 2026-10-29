// 01: Reconectar Circuitos
// Grid of pipe/circuit segments that can be rotated (0, 90, 180, 270)
// Must form a connected path from Top-Left (Source) to Bottom-Right (Sink).

export interface CircuitTile {
  id: number;
  // Connections in 0 deg orientation: [top, right, bottom, left]
  baseConnections: [boolean, boolean, boolean, boolean];
  rotation: number; // 0, 90, 180, 270
}

export interface CircuitChallenge {
  gridSize: number;
  tiles: CircuitTile[];
  sourceTileId: number;
  sinkTileId: number;
}

export class CircuitGame {
  public static generate(gridSize = 3): CircuitChallenge {
    // 3x3 default
    const count = gridSize * gridSize;
    const tiles: CircuitTile[] = [];

    // Predefined solvable configurations with randomized initial rotations
    // Type 1: Straight line [top, 0, bottom, 0]
    // Type 2: Elbow corner [0, right, bottom, 0]
    // Type 3: T-junction [0, right, bottom, left]
    for (let i = 0; i < count; i++) {
      let base: [boolean, boolean, boolean, boolean] = [false, true, true, false]; // default corner
      if (i % 2 === 0) base = [true, false, true, false]; // straight
      if (i === count - 1) base = [true, false, false, true];

      // Random initial rotation (90, 180, 270)
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
    // Rotate array clockwise by `steps`
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

      // Check Top neighbor
      if (top && r > 0) {
        const neighborId = (r - 1) * gridSize + c;
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nBottom && !visited.has(neighborId)) queue.push(neighborId);
      }
      // Check Right neighbor
      if (right && c < gridSize - 1) {
        const neighborId = r * gridSize + (c + 1);
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nLeft && !visited.has(neighborId)) queue.push(neighborId);
      }
      // Check Bottom neighbor
      if (bottom && r < gridSize - 1) {
        const neighborId = (r + 1) * gridSize + c;
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nTop && !visited.has(neighborId)) queue.push(neighborId);
      }
      // Check Left neighbor
      if (left && c > 0) {
        const neighborId = r * gridSize + (c - 1);
        const [nTop, nRight, nBottom, nLeft] = this.getActiveConnections(tiles[neighborId]);
        if (nRight && !visited.has(neighborId)) queue.push(neighborId);
      }
    }

    return false;
  }
}
