import { z } from "zod";

// ==========================================
// ROLES & PLAYERS
// ==========================================
export const RoleSchema = z.enum([
  "KILLER",
  "DETECTIVE",
  "MEDIC",
  "TECHNICIAN",
  "INFORMANT",
  "CIVILIAN",
]);
export type Role = z.infer<typeof RoleSchema>;

export const PlayerStatusSchema = z.enum([
  "ALIVE",
  "DEAD_UNDISCOVERED",
  "ECO",
]);
export type PlayerStatus = z.infer<typeof PlayerStatusSchema>;

export interface PlayerPublicInfo {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  status: PlayerStatus;
  currentRoomId: string;
  locationReliability: "declared" | "beacon" | "simulated";
}

// ==========================================
// HOUSE ROOMS
// ==========================================
export interface RoomConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "social" | "investigative" | "transit" | "private" | "external";
  isInvestigationAllowed: boolean;
  beaconConfig?: {
    uuid: string;
    major: number;
    minor: number;
    txPower?: number;
  };
  coordinates: { x: number; y: number };
  connectedRoomIds: string[];
}

export const DEFAULT_HOUSE_ROOMS: RoomConfig[] = [
  {
    id: "sala",
    name: "Sala Principal",
    icon: "Armchair",
    description: "Espaço central de convivência, depoimentos e reuniões do grupo.",
    category: "social",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 1 },
    coordinates: { x: 50, y: 50 },
    connectedRoomIds: ["varanda", "cozinha", "escritorio", "banheiro_social"],
  },
  {
    id: "escritorio",
    name: "Escritório",
    icon: "Briefcase",
    description: "Terminais, documentos corporativos e arquivos de segurança.",
    category: "investigative",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 2 },
    coordinates: { x: 25, y: 30 },
    connectedRoomIds: ["sala", "suite"],
  },
  {
    id: "varanda",
    name: "Varanda",
    icon: "Sun",
    description: "Área externa de recepção de sinais de rádio e mensagens.",
    category: "transit",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 3 },
    coordinates: { x: 80, y: 50 },
    connectedRoomIds: ["sala", "piscina"],
  },
  {
    id: "suite",
    name: "Suíte",
    icon: "KeyRound",
    description: "Zona confidencial. Ponto de checagem virtual na entrada.",
    category: "private",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 4 },
    coordinates: { x: 20, y: 80 },
    connectedRoomIds: ["escritorio"],
  },
  {
    id: "banheiro_social",
    name: "Banheiro Social",
    icon: "Bath",
    description: "Vestígios indiretos. Interação virtual realizada na entrada.",
    category: "private",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 5 },
    coordinates: { x: 45, y: 85 },
    connectedRoomIds: ["sala"],
  },
  {
    id: "cozinha",
    name: "Cozinha",
    icon: "Utensils",
    description: "Ambiente de suprimentos e dispositivos digitais (100% virtual).",
    category: "social",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 6 },
    coordinates: { x: 75, y: 25 },
    connectedRoomIds: ["sala", "piscina"],
  },
  {
    id: "piscina",
    name: "Área da Piscina",
    icon: "Waves",
    description: "Monitoramento e zona seca externa segura. Sem acesso à água.",
    category: "external",
    isInvestigationAllowed: true,
    beaconConfig: { uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0", major: 1, minor: 7 },
    coordinates: { x: 85, y: 80 },
    connectedRoomIds: ["varanda", "cozinha"],
  },
];

// ==========================================
// MINIGAMES
// ==========================================
export const MinigameIdSchema = z.enum([
  "circuit_reconnect",     // 01: Reconectar Circuitos
  "cipher_breaker",        // 02: Quebra de Cifra
  "doc_reconstruct",       // 03: Reconstruir Documento
  "log_audit",             // 04: Comparação de Registros
  "signal_memory",         // 05: Memória de Sinais
  "trace_pattern",         // 06: Análise de Vestígios
  "chronology_order",      // 07: Reconstruir Cronologia
  "frequency_tune",        // 08: Estabilizar Frequência
  "anomaly_detect",        // 09: Localizar Anomalia
  "seal_auth",             // 10: Autenticar Documento
  "terminal_sync",         // 11: Sincronizar Terminais
  "packet_reassembly",     // 12: Reconstruir Transmissão
]);
export type MinigameId = z.infer<typeof MinigameIdSchema>;

export interface MinigameChallengeData {
  minigameId: MinigameId;
  seed: string;
  difficulty: number;
  timeLimitSeconds: number;
  params: Record<string, any>;
}

// ==========================================
// MISSIONS & TRAPS
// ==========================================
export type MissionCategory =
  | "INVESTIGATION"
  | "SURVIVAL"
  | "CLANDESTINE"
  | "DISGUISE_TRAP"
  | "ECO";

export interface MissionInstance {
  id: string;
  templateId: string;
  title: string;
  description: string;
  category: MissionCategory;
  minigameId: MinigameId;
  requiredRoomId?: string; // If undefined, can be started anywhere
  assignedPlayerId: string;
  status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "DISARMED";
  rewardEvidenceId?: string;
  neutralizesTrapId?: string; // If set, completing this disarms a trap!
  isDisguiseTrap?: boolean; // NEVER sent to the victim client!
  trapId?: string; // NEVER sent to the victim client!
  createdAt: number;
}

export type TrapStatus = "NONE" | "ARMED" | "TRIGGERED" | "DISARMED" | "EXPIRED" | "CANCELLED";

export interface TrapState {
  id: string;
  killerId: string;
  targetPlayerId: string;
  disguiseMissionId: string;
  templateId: string;
  requiredRoomId?: string;
  status: TrapStatus;
  createdAt: number;
  triggeredAt?: number;
  disarmedAt?: number;
  disarmedByPlayerId?: string;
}

// ==========================================
// EVIDENCE & DOSSIER
// ==========================================
export type EvidenceTier = "CORE" | "CONTEXTUAL" | "DISTRACTOR" | "TAMPERED";

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  shortDescription: string;
  detailedFindings: string;
  tier: EvidenceTier;
  category: "access_log" | "intercept" | "credential" | "forensic_stamp" | "timeline_fragment";
  roomId: string;
  suspectIds: string[]; // Suspects this evidence implicates or relates to
  discoveredByPlayerId?: string;
  discoveredAt?: number;
  isSharedWithGroup: boolean;
  authenticityVerified: boolean;
  metadata?: Record<string, any>;
}

export interface Testimony {
  id: string;
  authorPlayerId: string;
  targetSuspectId?: string;
  claimedRoomId: string;
  timestampMinutes: number;
  statement: string;
  createdAt: number;
}

export interface CaseDossierConnection {
  id: string;
  fromEvidenceId: string;
  toEvidenceOrSuspectId: string;
  hypothesisLabel: string;
  createdByPlayerId: string;
}

// ==========================================
// GAME PHASES & MEETINGS
// ==========================================
export const GamePhaseSchema = z.enum([
  "LOBBY",
  "BRIEFING",
  "PREPARATION",
  "INVESTIGATION",
  "MEETING",
  "VOTING",
  "TRIAL",
  "RESULTS",
]);
export type GamePhase = z.infer<typeof GamePhaseSchema>;

export interface MeetingState {
  id: string;
  calledByPlayerId: string;
  reason: "BODY_REPORTED" | "EMERGENCY_BUTTON" | "SYSTEM_ALARM";
  discoveredBodyPlayerId?: string;
  timeRemainingSeconds: number;
  isVotingOpen: boolean;
  votes: Record<string, string>; // voterPlayerId -> accusedPlayerId or "SKIP"
}

export interface GameSettings {
  maxPlayers: number;
  matchDurationMinutes: number;
  maxKillsAllowed: number;
  rolesConfig: {
    killer: number;
    detective: number;
    medic: number;
    technician: number;
    informant: number;
    civilian: number;
  };
  enableAudio: boolean;
  enableVibration: boolean;
  manualLocationAllowed: boolean;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPlayers: 8,
  matchDurationMinutes: 40,
  maxKillsAllowed: 2,
  rolesConfig: {
    killer: 1,
    detective: 1,
    medic: 1,
    technician: 1,
    informant: 1,
    civilian: 3,
  },
  enableAudio: true,
  enableVibration: true,
  manualLocationAllowed: true,
};

// ==========================================
// AUDIT EVENT LOG (Append-only)
// ==========================================
export interface GameEventLogEntry {
  id: string;
  matchId: string;
  type:
    | "ROOM_CHANGED"
    | "TRAP_ARMED"
    | "TRAP_TRIGGERED"
    | "TRAP_DISARMED"
    | "MISSION_STARTED"
    | "MISSION_COMPLETED"
    | "EVIDENCE_DISCOVERED"
    | "BODY_REPORTED"
    | "MEETING_STARTED"
    | "VOTE_CAST"
    | "TRIAL_DECIDED"
    | "GAME_ENDED";
  actorPlayerId?: string;
  targetPlayerId?: string;
  roomId?: string;
  payload: Record<string, any>;
  timestamp: number;
}

// ==========================================
// CLIENT <-> SERVER PROTOCOL
// ==========================================
export interface PublicGameState {
  matchId: string;
  roomCode: string;
  phase: GamePhase;
  phaseTimeRemainingSeconds: number;
  players: PlayerPublicInfo[];
  rooms: RoomConfig[];
  aliveCount: number;
  deadCount: number;
  activeMeeting?: MeetingState;
  publicEvidence: Evidence[];
  publicAnnouncements: Array<{ id: string; message: string; timestamp: number; type: "info" | "alert" | "danger" }>;
  settings: GameSettings;
}

export interface PlayerPrivateView {
  playerId: string;
  role?: Role;
  status: PlayerStatus;
  currentRoomId: string;
  locationReliability: "declared" | "beacon" | "simulated";
  missions: MissionInstance[]; // Sanitized!
  privateEvidence: Evidence[];
  connections: CaseDossierConnection[];
  testimonies: Testimony[];
  // Killer sub-interface (ONLY if role === KILLER)
  killerDashboard?: {
    activeTrap?: {
      id: string;
      targetPlayerId: string;
      status: TrapStatus;
      templateTitle: string;
    };
    cooldownSecondsRemaining: number;
    eligibleVictimIds: string[];
    killsRemaining: number;
  };
  // Eco view (ONLY if status === ECO)
  ecoDashboard?: {
    ecoEnergy: number;
    availableEchoPuzzles: MissionInstance[];
  };
  // Alerts
  disarmAlertNotification?: {
    message: string;
    timestamp: number;
  };
  victimDeathCode?: string; // If dead, code shown to body reporter
}

// Client action messages
export type ClientAction =
  | { type: "JOIN_ROOM"; name: string; avatar: string; roomCode?: string }
  | { type: "SET_READY"; ready: boolean }
  | { type: "START_GAME" }
  | { type: "SET_CURRENT_ROOM"; roomId: string; reliability: "declared" | "beacon" | "simulated" }
  | { type: "START_MISSION"; missionId: string; idempotencyKey: string }
  | { type: "SUBMIT_MINIGAME"; missionId: string; resultToken: string; success: boolean; completionTimeMs: number }
  | { type: "INVESTIGATE_ROOM"; roomId: string }
  | { type: "ARM_TRAP"; targetPlayerId: string; templateId: string; requiredRoomId?: string; idempotencyKey: string }
  | { type: "REPORT_BODY"; victimPlayerId: string; confirmationCode?: string }
  | { type: "CALL_MEETING" }
  | { type: "CAST_VOTE"; targetPlayerIdOrSkip: string }
  | { type: "SHARE_EVIDENCE"; evidenceId: string }
  | { type: "SUBMIT_TESTIMONY"; statement: string; claimedRoomId: string; targetSuspectId?: string }
  | { type: "CONNECT_EVIDENCE"; fromEvidenceId: string; toTargetId: string; hypothesis: string }
  | { type: "HOST_PAUSE" }
  | { type: "HOST_RESUME" }
  | { type: "HOST_RESTART" }
  | { type: "HOST_UPDATE_ROOM"; room: RoomConfig };
