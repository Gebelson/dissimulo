import { RoomConfig } from "@alibi/contracts";

export interface LocationReading {
  roomId: string;
  confidence: number; // 0.0 to 1.0
  providerType: "declared" | "beacon" | "simulated";
  timestamp: number;
  rawSignalDbm?: number;
}

export type LocationListener = (reading: LocationReading) => void;

export interface LocationProvider {
  start(): Promise<void>;
  stop(): Promise<void>;
  getCurrentReading(): LocationReading;
  subscribe(listener: LocationListener): () => void;
}

// ==========================================
// 1. MANUAL ROOM PROVIDER (WEB & PWA FALLBACK)
// ==========================================
export class ManualRoomProvider implements LocationProvider {
  private currentRoomId: string;
  private listeners: Set<LocationListener> = new Set();

  constructor(initialRoomId = "sala") {
    this.currentRoomId = initialRoomId;
  }

  public async start(): Promise<void> {}
  public async stop(): Promise<void> {}

  public setRoom(roomId: string): void {
    this.currentRoomId = roomId;
    const reading = this.getCurrentReading();
    this.listeners.forEach((fn) => fn(reading));
  }

  public getCurrentReading(): LocationReading {
    return {
      roomId: this.currentRoomId,
      confidence: 1.0,
      providerType: "declared",
      timestamp: Date.now(),
    };
  }

  public subscribe(listener: LocationListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentReading());
    return () => this.listeners.delete(listener);
  }
}

// ==========================================
// 2. BEACON ROOM PROVIDER (BLE / CAPACITOR)
// ==========================================
export interface RawBeaconSignal {
  uuid: string;
  major: number;
  minor: number;
  rssi: number;
  txPower?: number;
}

export class BeaconRoomProvider implements LocationProvider {
  private rooms: RoomConfig[];
  private currentRoomId: string = "sala";
  private confidence: number = 0.5;
  private listeners: Set<LocationListener> = new Set();

  // RSSI smoothing with Exponential Moving Average (EMA)
  private emaRssiByRoom: Map<string, number> = new Map();
  private readonly alpha = 0.35; // Smoothing factor
  private readonly hysteresisThresholdDbm = 4.0; // Must exceed winner by 4 dBm to trigger switch

  constructor(rooms: RoomConfig[], initialRoomId = "sala") {
    this.rooms = rooms;
    this.currentRoomId = initialRoomId;
  }

  public async start(): Promise<void> {
    // In native runtime, this starts Capacitor iBeacon scanning
  }

  public async stop(): Promise<void> {
    // In native runtime, this stops scanning
  }

  /**
   * Process raw BLE scan packet from mobile Bluetooth antenna
   */
  public processBeaconSignal(signal: RawBeaconSignal): void {
    // Match beacon to registered room
    const matchingRoom = this.rooms.find(
      (r) =>
        r.beaconConfig &&
        r.beaconConfig.uuid.toLowerCase() === signal.uuid.toLowerCase() &&
        r.beaconConfig.major === signal.major &&
        r.beaconConfig.minor === signal.minor
    );

    if (!matchingRoom) return;

    // Apply EMA filter
    const prevEma = this.emaRssiByRoom.get(matchingRoom.id) ?? signal.rssi;
    const smoothed = this.alpha * signal.rssi + (1 - this.alpha) * prevEma;
    this.emaRssiByRoom.set(matchingRoom.id, smoothed);

    // Evaluate room with highest smoothed RSSI
    let bestRoomId = this.currentRoomId;
    let highestRssi = this.emaRssiByRoom.get(this.currentRoomId) ?? -100;

    for (const [roomId, rssi] of this.emaRssiByRoom.entries()) {
      if (roomId !== this.currentRoomId && rssi > highestRssi + this.hysteresisThresholdDbm) {
        bestRoomId = roomId;
        highestRssi = rssi;
      }
    }

    if (bestRoomId !== this.currentRoomId) {
      this.currentRoomId = bestRoomId;
      // Calculate confidence based on RSSI strength (-60 dBm is strong, -90 dBm is weak)
      this.confidence = Math.min(1.0, Math.max(0.2, (highestRssi + 95) / 35));
      const reading = this.getCurrentReading();
      this.listeners.forEach((fn) => fn(reading));
    }
  }

  public getCurrentReading(): LocationReading {
    return {
      roomId: this.currentRoomId,
      confidence: this.confidence,
      providerType: "beacon",
      timestamp: Date.now(),
      rawSignalDbm: this.emaRssiByRoom.get(this.currentRoomId),
    };
  }

  public subscribe(listener: LocationListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentReading());
    return () => this.listeners.delete(listener);
  }
}

// ==========================================
// 3. DEV LOCATION SIMULATOR
// ==========================================
export class DevLocationSimulator implements LocationProvider {
  private currentRoomId: string;
  private listeners: Set<LocationListener> = new Set();
  private intervalTimer?: NodeJS.Timeout;

  constructor(initialRoomId = "sala") {
    this.currentRoomId = initialRoomId;
  }

  public async start(): Promise<void> {}
  public async stop(): Promise<void> {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  }

  public simulateMoveTo(roomId: string): void {
    this.currentRoomId = roomId;
    const reading = this.getCurrentReading();
    this.listeners.forEach((fn) => fn(reading));
  }

  public getCurrentReading(): LocationReading {
    return {
      roomId: this.currentRoomId,
      confidence: 0.95,
      providerType: "simulated",
      timestamp: Date.now(),
    };
  }

  public subscribe(listener: LocationListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentReading());
    return () => this.listeners.delete(listener);
  }
}
