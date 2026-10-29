import {
  ClientAction,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_HOUSE_ROOMS,
  Evidence,
  GameEventLogEntry,
  GamePhase,
  GameSettings,
  MeetingState,
  MinigameChallengeData,
  MissionInstance,
  PlayerPrivateView,
  PlayerPublicInfo,
  PlayerStatus,
  Role,
  RoomConfig,
  Testimony,
  CaseDossierConnection,
  PublicGameState,
} from "@alibi/contracts";
import { TrapManager } from "./trap-manager.js";
import { MISSION_TEMPLATES, ECO_PUZZLE_TEMPLATES } from "./mission-templates.js";
import { SolvabilityVerifier } from "./solvability-verifier.js";

export interface InternalPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  role?: Role;
  status: PlayerStatus;
  currentRoomId: string;
  locationReliability: "declared" | "beacon" | "simulated";
  victimDeathCode?: string; // e.g. "8421"
  privateAlert?: { message: string; timestamp: number };
}

export class GameState {
  public matchId: string;
  public roomCode: string;
  public phase: GamePhase = "LOBBY";
  public phaseTimeRemainingSeconds: number = 2400; // 40 minutes default
  public settings: GameSettings = { ...DEFAULT_GAME_SETTINGS };
  public rooms: RoomConfig[] = [...DEFAULT_HOUSE_ROOMS];

  public players: Map<string, InternalPlayer> = new Map();
  public missions: Map<string, MissionInstance> = new Map();
  public evidenceList: Map<string, Evidence> = new Map();
  public testimonies: Testimony[] = [];
  public connections: CaseDossierConnection[] = [];
  public eventLogs: GameEventLogEntry[] = [];

  public trapManager: TrapManager = new TrapManager();
  public activeMeeting?: MeetingState;
  public killsCount: number = 0;
  public killerId?: string;

  constructor(matchId: string, roomCode: string) {
    this.matchId = matchId;
    this.roomCode = roomCode;
  }

  // ==========================================
  // EVENT LOGGING (Append-only)
  // ==========================================
  public logEvent(
    type: GameEventLogEntry["type"],
    actorPlayerId?: string,
    targetPlayerId?: string,
    roomId?: string,
    payload: Record<string, any> = {}
  ): GameEventLogEntry {
    const entry: GameEventLogEntry = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      matchId: this.matchId,
      type,
      actorPlayerId,
      targetPlayerId,
      roomId,
      payload,
      timestamp: Date.now(),
    };
    this.eventLogs.push(entry);
    return entry;
  }

  // ==========================================
  // PLAYER REGISTRATION & LOBBY
  // ==========================================
  public addPlayer(id: string, name: string, avatar: string): InternalPlayer {
    const isFirst = this.players.size === 0;
    const player: InternalPlayer = {
      id,
      name,
      avatar,
      isHost: isFirst,
      isReady: false,
      status: "ALIVE",
      currentRoomId: "sala",
      locationReliability: "declared",
    };
    this.players.set(id, player);
    this.logEvent("ROOM_CHANGED", id, undefined, "sala", { reason: "joined_lobby" });
    return player;
  }

  public removePlayer(playerId: string): void {
    const p = this.players.get(playerId);
    if (!p) return;
    this.players.delete(playerId);
    // If host left, pass host to next player
    if (p.isHost && this.players.size > 0) {
      const next = Array.from(this.players.values())[0];
      next.isHost = true;
    }
  }

  public setReady(playerId: string, ready: boolean): void {
    const p = this.players.get(playerId);
    if (p) p.isReady = ready;
  }

  public setCurrentRoom(
    playerId: string,
    roomId: string,
    reliability: "declared" | "beacon" | "simulated"
  ): void {
    const p = this.players.get(playerId);
    if (!p) return;
    p.currentRoomId = roomId;
    p.locationReliability = reliability;
    this.logEvent("ROOM_CHANGED", playerId, undefined, roomId, { reliability });
  }

  // ==========================================
  // GAME START & ROLE DISTRIBUTION
  // ==========================================
  public startGame(): boolean {
    if (this.phase !== "LOBBY") return false;
    if (this.players.size < 4) {
      throw new Error("Mínimo de 4 jogadores para iniciar a partida.");
    }

    const playerList = Array.from(this.players.values());
    const shuffled = [...playerList].sort(() => Math.random() - 0.5);

    // Roles for 8 players: 1 Killer, 1 Detective, 1 Medic, 1 Tech, 1 Informant, rest Civilians
    const rolesToAssign: Role[] = ["KILLER", "DETECTIVE", "MEDIC", "TECHNICIAN", "INFORMANT"];
    while (rolesToAssign.length < shuffled.length) {
      rolesToAssign.push("CIVILIAN");
    }

    shuffled.forEach((player, idx) => {
      player.role = rolesToAssign[idx] || "CIVILIAN";
      if (player.role === "KILLER") {
        this.killerId = player.id;
      }
    });

    this.phase = "PREPARATION";
    this.phaseTimeRemainingSeconds = this.settings.matchDurationMinutes * 60;

    // Seed initial missions and room evidence based on participants
    this.generateInitialContent();

    this.logEvent("ROOM_CHANGED", undefined, undefined, undefined, {
      phase: "PREPARATION",
      playerCount: this.players.size,
    });

    return true;
  }

  // Generate initial missions and clues based on real players & rooms
  private generateInitialContent(): void {
    const living = Array.from(this.players.values());

    // Generate initial legitimate missions for survivors
    living.forEach((p) => {
      // 2 initial missions per player
      const tmpl1 = MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
      const mission1: MissionInstance = {
        id: `mission_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        templateId: tmpl1.id,
        title: tmpl1.title,
        description: tmpl1.description,
        category: tmpl1.category,
        minigameId: tmpl1.minigameId,
        requiredRoomId: tmpl1.requiredRoomId,
        assignedPlayerId: p.id,
        status: "AVAILABLE",
        createdAt: Date.now(),
      };
      this.missions.set(mission1.id, mission1);
    });

    // Seed case evidence distributed in rooms
    this.seedCaseEvidence();
  }

  private seedCaseEvidence(): void {
    if (!this.killerId) return;
    const killer = this.players.get(this.killerId)!;
    const living = Array.from(this.players.values());
    const innocent1 = living.find((p) => p.id !== this.killerId)!;
    const innocent2 = living.find((p) => p.id !== this.killerId && p.id !== innocent1.id) || innocent1;

    // 4 CORE evidence items pointing to the killer through intersecting clues
    const core1: Evidence = {
      id: "ev_core_badge",
      caseId: "case_01",
      title: "Registro de Acesso Criptografado",
      shortDescription: "Log do terminal do escritório com assinatura digital do terminal.",
      detailedFindings: `O console registrou acesso com credencial vinculada ao terminal usado por ${killer.name} ou ${innocent1.name}.`,
      tier: "CORE",
      category: "access_log",
      roomId: "escritorio",
      suspectIds: [this.killerId, innocent1.id],
      isSharedWithGroup: false,
      authenticityVerified: true,
    };

    const core2: Evidence = {
      id: "ev_core_frequency",
      caseId: "case_01",
      title: "Espectro de Frequência de Rádio",
      shortDescription: "Transmissão clandestina detectada na varanda.",
      detailedFindings: `A modulação interceptada coincide com o perfil operacional de ${killer.name} ou ${innocent2.name}.`,
      tier: "CORE",
      category: "intercept",
      roomId: "varanda",
      suspectIds: [this.killerId, innocent2.id],
      isSharedWithGroup: false,
      authenticityVerified: true,
    };

    // Notice: Intersection of core1 [killer, innocent1] and core2 [killer, innocent2] uniquely isolates KILLER!

    const core3: Evidence = {
      id: "ev_core_timeline",
      caseId: "case_01",
      title: "Fragmento de Deslocamento",
      shortDescription: "Histórico de presença em corredor.",
      detailedFindings: `Contradição no tempo de permanência na área externa durante o preparo dos sistemas.`,
      tier: "CORE",
      category: "timeline_fragment",
      roomId: "piscina",
      suspectIds: [this.killerId],
      isSharedWithGroup: false,
      authenticityVerified: true,
    };

    // Contextual evidence
    const ctx1: Evidence = {
      id: "ev_ctx_circuit",
      caseId: "case_01",
      title: "Placa de Circuito Sabotada",
      shortDescription: "Vestígio de sobretensão no painel da cozinha.",
      detailedFindings: "Cabo de derivação inserido manualmente para alterar o sinal de presença.",
      tier: "CONTEXTUAL",
      category: "forensic_stamp",
      roomId: "cozinha",
      suspectIds: [this.killerId, innocent1.id, innocent2.id],
      isSharedWithGroup: false,
      authenticityVerified: true,
    };

    const ctx2: Evidence = {
      id: "ev_ctx_memo",
      caseId: "case_01",
      title: "Memorando Confidencial Rasgado",
      shortDescription: "Trecho recuperado da lixeira da suíte.",
      detailedFindings: "Instruções sobre o protocolo de emergência da casa.",
      tier: "CONTEXTUAL",
      category: "access_log",
      roomId: "suite",
      suspectIds: [this.killerId, innocent1.id],
      isSharedWithGroup: false,
      authenticityVerified: true,
    };

    // Distractor
    const dist1: Evidence = {
      id: "ev_dist_badge",
      caseId: "case_01",
      title: "Crachá de Visitante Esquecido",
      shortDescription: "Pertence a um técnico de manutenção externa anterior.",
      detailedFindings: "Não possui carimbo de segurança ativo durante a partida.",
      tier: "DISTRACTOR",
      category: "forensic_stamp",
      roomId: "banheiro_social",
      suspectIds: [innocent1.id, innocent2.id],
      isSharedWithGroup: false,
      authenticityVerified: false,
    };

    [core1, core2, core3, ctx1, ctx2, dist1].forEach((ev) => {
      this.evidenceList.set(ev.id, ev);
    });
  }

  // ==========================================
  // TRAP CREATION & LETHAL EXECUTION
  // ==========================================
  public async armTrap(killerId: string, targetPlayerId: string, templateId: string, requiredRoomId?: string) {
    const killer = this.players.get(killerId);
    if (!killer || killer.role !== "KILLER") {
      throw new Error("Apenas o assassino pode criar armadilhas.");
    }
    if (this.killsCount >= this.settings.maxKillsAllowed) {
      throw new Error("Limite máximo de assassinatos da partida atingido.");
    }

    const livingSurvivors = Array.from(this.players.values())
      .filter((p) => p.status === "ALIVE" && p.role !== "KILLER")
      .map((p) => p.id);

    const existingMissions = Array.from(this.missions.values());

    const result = await this.trapManager.armTrap({
      killerId,
      targetPlayerId,
      templateId,
      requiredRoomId,
      livingSurvivorIds: livingSurvivors,
      existingSurvivorMissions: existingMissions,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    // Register disguise mission
    this.missions.set(result.disguiseMission.id, result.disguiseMission);

    // Register neutralizing mission for another survivor if generated
    if (result.neutralizingMission) {
      this.missions.set(result.neutralizingMission.id, result.neutralizingMission);
    }

    this.logEvent("TRAP_ARMED", killerId, targetPlayerId, requiredRoomId, {
      trapId: result.trap.id,
      templateId,
    });

    return result;
  }

  // ==========================================
  // MISSION EXECUTION (START & SUBMIT)
  // ==========================================
  public async startMission(playerId: string, missionId: string): Promise<{ lethal: boolean; challenge?: MinigameChallengeData }> {
    const player = this.players.get(playerId);
    if (!player) throw new Error("Jogador não encontrado.");
    if (player.status !== "ALIVE" && player.status !== "ECO") {
      throw new Error("Jogador eliminado não pode iniciar missões regulares.");
    }

    const mission = this.missions.get(missionId);
    if (!mission) throw new Error("Missão não encontrada.");
    if (mission.assignedPlayerId !== playerId) {
      throw new Error("Esta missão pertence a outro participante.");
    }

    // Check location requirement
    if (mission.requiredRoomId && mission.requiredRoomId !== player.currentRoomId) {
      throw new Error(`Esta missão requer estar no ambiente: ${mission.requiredRoomId}`);
    }

    // Check trap interaction (CRITICAL ATOMIC INVARIANT)
    const triggerResult = await this.trapManager.handleStartMission({
      actorPlayerId: playerId,
      mission,
      currentRoomId: player.currentRoomId,
    });

    if (triggerResult.error) {
      throw new Error(triggerResult.error);
    }

    // If victim touched start on an active disguise trap -> INSTANT DEATH!
    if (triggerResult.lethal) {
      player.status = "DEAD_UNDISCOVERED";
      player.victimDeathCode = Math.floor(1000 + Math.random() * 9000).toString();
      this.killsCount += 1;

      this.logEvent("TRAP_TRIGGERED", triggerResult.trapId, playerId, player.currentRoomId, {
        victimId: playerId,
      });

      return { lethal: true };
    }

    mission.status = "IN_PROGRESS";
    this.logEvent("MISSION_STARTED", playerId, undefined, player.currentRoomId, { missionId });

    // Generate minigame challenge with signed seed
    const challenge: MinigameChallengeData = {
      minigameId: mission.minigameId,
      seed: `${missionId}_${Date.now()}`,
      difficulty: 2,
      timeLimitSeconds: 35,
      params: { roomId: player.currentRoomId },
    };

    return { lethal: false, challenge };
  }

  public async completeMission(playerId: string, missionId: string, success: boolean): Promise<{ disarmedTrap: boolean }> {
    const player = this.players.get(playerId);
    if (!player) throw new Error("Jogador não encontrado.");
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error("Missão não encontrada.");

    if (!success) {
      mission.status = "FAILED";
      return { disarmedTrap: false };
    }

    mission.status = "COMPLETED";
    let disarmed = false;

    // Check if this mission disarms a trap
    if (mission.neutralizesTrapId) {
      const disarmResult = await this.trapManager.handleNeutralizeMission({
        actorPlayerId: playerId,
        mission,
      });

      if (disarmResult.success && disarmResult.killerId) {
        disarmed = true;
        // Notify neutralizer privately
        player.privateAlert = {
          message: "Ameaça neutralizada. Você impediu um assassinato.",
          timestamp: Date.now(),
        };

        // Notify killer privately that their trap was disarmed
        const killer = this.players.get(disarmResult.killerId);
        if (killer) {
          killer.privateAlert = {
            message: "Sua armadilha foi neutralizada por um sobrevivente.",
            timestamp: Date.now(),
          };
        }

        this.logEvent("TRAP_DISARMED", playerId, undefined, player.currentRoomId, {
          trapId: disarmResult.trapId,
        });
      }
    }

    this.logEvent("MISSION_COMPLETED", playerId, undefined, player.currentRoomId, {
      missionId,
      disarmed,
    });

    return { disarmedTrap: disarmed };
  }

  // ==========================================
  // INVESTIGATION & EVIDENCE DISCOVERY
  // ==========================================
  public searchRoom(playerId: string, roomId: string): Evidence | undefined {
    const player = this.players.get(playerId);
    if (!player) throw new Error("Jogador não encontrado.");
    if (player.status !== "ALIVE") {
      throw new Error("Apenas sobreviventes vivos podem conduzir perícia em ambientes.");
    }

    // Find evidence in this room not yet discovered by this player
    for (const ev of this.evidenceList.values()) {
      if (ev.roomId === roomId && (!ev.discoveredByPlayerId || ev.discoveredByPlayerId === playerId)) {
        ev.discoveredByPlayerId = playerId;
        ev.discoveredAt = Date.now();
        this.logEvent("EVIDENCE_DISCOVERED", playerId, undefined, roomId, { evidenceId: ev.id });
        return ev;
      }
    }
    return undefined;
  }

  public shareEvidence(playerId: string, evidenceId: string): void {
    const ev = this.evidenceList.get(evidenceId);
    if (ev && ev.discoveredByPlayerId === playerId) {
      ev.isSharedWithGroup = true;
      this.logEvent("EVIDENCE_DISCOVERED", playerId, undefined, ev.roomId, {
        evidenceId,
        shared: true,
      });
    }
  }

  public submitTestimony(authorPlayerId: string, statement: string, claimedRoomId: string, targetSuspectId?: string): Testimony {
    const t: Testimony = {
      id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorPlayerId,
      targetSuspectId,
      claimedRoomId,
      timestampMinutes: Math.floor((2400 - this.phaseTimeRemainingSeconds) / 60),
      statement,
      createdAt: Date.now(),
    };
    this.testimonies.push(t);
    return t;
  }

  public connectDossier(authorId: string, fromEvidenceId: string, toTargetId: string, hypothesis: string): CaseDossierConnection {
    const conn: CaseDossierConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fromEvidenceId,
      toEvidenceOrSuspectId: toTargetId,
      hypothesisLabel: hypothesis,
      createdByPlayerId: authorId,
    };
    this.connections.push(conn);
    return conn;
  }

  // ==========================================
  // BODY REPORT & EMERGENCY MEETINGS
  // ==========================================
  public reportBody(reporterPlayerId: string, victimPlayerId: string, confirmationCode?: string): void {
    const victim = this.players.get(victimPlayerId);
    if (!victim || victim.status !== "DEAD_UNDISCOVERED") {
      throw new Error("Nenhum corpo encontrado para este participante.");
    }

    // Validate confirmation code if present
    if (victim.victimDeathCode && confirmationCode && victim.victimDeathCode !== confirmationCode) {
      throw new Error("Código de confirmação de corpo inválido.");
    }

    victim.status = "ECO"; // Victim becomes Eco!
    this.logEvent("BODY_REPORTED", reporterPlayerId, victimPlayerId, victim.currentRoomId);

    // Call meeting immediately
    this.startMeeting(reporterPlayerId, "BODY_REPORTED", victimPlayerId);
  }

  public startMeeting(callerPlayerId: string, reason: MeetingState["reason"], discoveredBodyId?: string): void {
    this.activeMeeting = {
      id: `meet_${Date.now()}`,
      calledByPlayerId: callerPlayerId,
      reason,
      discoveredBodyPlayerId: discoveredBodyId,
      timeRemainingSeconds: 90, // 90 seconds for discussion
      isVotingOpen: false,
      votes: {},
    };
    this.phase = "MEETING";
    this.logEvent("MEETING_STARTED", callerPlayerId, discoveredBodyId, undefined, { reason });
  }

  public openVoting(): void {
    if (this.activeMeeting) {
      this.activeMeeting.isVotingOpen = true;
      this.phase = "VOTING";
      this.activeMeeting.timeRemainingSeconds = 45; // 45 seconds for voting
    }
  }

  public castVote(voterPlayerId: string, targetPlayerIdOrSkip: string): void {
    const voter = this.players.get(voterPlayerId);
    if (!voter || voter.status !== "ALIVE") {
      throw new Error("Jogadores eliminados ou Ecos não possuem direito a voto.");
    }
    if (!this.activeMeeting || !this.activeMeeting.isVotingOpen) {
      throw new Error("A votação não está aberta no momento.");
    }

    this.activeMeeting.votes[voterPlayerId] = targetPlayerIdOrSkip;
    this.logEvent("VOTE_CAST", voterPlayerId, targetPlayerIdOrSkip);
  }

  public concludeVoting(): { accusedPlayerId?: string; isTie: boolean; isSkip: boolean } {
    if (!this.activeMeeting) throw new Error("Nenhuma reunião ativa.");

    const tally: Record<string, number> = {};
    Object.values(this.activeMeeting.votes).forEach((target) => {
      tally[target] = (tally[target] || 0) + 1;
    });

    let topTarget: string | undefined = undefined;
    let maxVotes = 0;
    let isTie = false;

    for (const [target, count] of Object.entries(tally)) {
      if (count > maxVotes) {
        maxVotes = count;
        topTarget = target;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    }

    this.phase = "TRIAL";
    this.activeMeeting = undefined;

    if (isTie || !topTarget || topTarget === "SKIP") {
      this.phase = "INVESTIGATION";
      return { isTie: true, isSkip: topTarget === "SKIP" };
    }

    return { accusedPlayerId: topTarget, isTie: false, isSkip: false };
  }

  // ==========================================
  // SANITIZED CLIENT PROJECTIONS (ANTI-CHEAT)
  // ==========================================
  public getPublicState(): PublicGameState {
    const playersPublic: PlayerPublicInfo[] = Array.from(this.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isHost: p.isHost,
      isReady: p.isReady,
      status: p.status,
      currentRoomId: p.currentRoomId,
      locationReliability: p.locationReliability,
    }));

    const aliveCount = playersPublic.filter((p) => p.status === "ALIVE").length;
    const deadCount = playersPublic.filter((p) => p.status !== "ALIVE").length;

    // Only public/shared evidence
    const publicEvidence = Array.from(this.evidenceList.values()).filter((e) => e.isSharedWithGroup);

    return {
      matchId: this.matchId,
      roomCode: this.roomCode,
      phase: this.phase,
      phaseTimeRemainingSeconds: this.phaseTimeRemainingSeconds,
      players: playersPublic,
      rooms: this.rooms,
      aliveCount,
      deadCount,
      activeMeeting: this.activeMeeting,
      publicEvidence,
      publicAnnouncements: [],
      settings: this.settings,
    };
  }

  public getPlayerPrivateView(playerId: string): PlayerPrivateView {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error("Jogador não encontrado na sala.");
    }

    // Sanitized missions: STRIP isDisguiseTrap and trapId from victim view!
    const playerMissions = Array.from(this.missions.values())
      .filter((m) => m.assignedPlayerId === playerId)
      .map((m) => ({
        id: m.id,
        templateId: m.templateId,
        title: m.title,
        description: m.description,
        category: m.category,
        minigameId: m.minigameId,
        requiredRoomId: m.requiredRoomId,
        assignedPlayerId: m.assignedPlayerId,
        status: m.status,
        createdAt: m.createdAt,
      }));

    // Evidence discovered by player or shared
    const privateEvidence = Array.from(this.evidenceList.values()).filter(
      (e) => e.discoveredByPlayerId === playerId || e.isSharedWithGroup
    );

    const isKiller = player.role === "KILLER";
    let killerDashboard = undefined;

    if (isKiller) {
      const activeTrap = this.trapManager.getActiveTrapForKiller(playerId);
      const eligibleVictims = Array.from(this.players.values())
        .filter((p) => p.status === "ALIVE" && p.id !== playerId)
        .map((p) => p.id);

      killerDashboard = {
        activeTrap: activeTrap
          ? {
              id: activeTrap.id,
              targetPlayerId: activeTrap.targetPlayerId,
              status: activeTrap.status,
              templateTitle: "Dispositivo de Sabotagem Ativo",
            }
          : undefined,
        cooldownSecondsRemaining: 0,
        eligibleVictimIds: eligibleVictims,
        killsRemaining: Math.max(0, this.settings.maxKillsAllowed - this.killsCount),
      };
    }

    // Eco Dashboard
    let ecoDashboard = undefined;
    if (player.status === "ECO") {
      const ecoPuzzles: MissionInstance[] = ECO_PUZZLE_TEMPLATES.map((tmpl, idx) => ({
        id: `eco_puzzle_${idx}_${playerId}`,
        templateId: tmpl.id,
        title: tmpl.title,
        description: tmpl.description,
        category: "ECO",
        minigameId: tmpl.minigameId,
        assignedPlayerId: playerId,
        status: "AVAILABLE",
        createdAt: Date.now(),
      }));

      ecoDashboard = {
        ecoEnergy: 100,
        availableEchoPuzzles: ecoPuzzles,
      };
    }

    return {
      playerId: player.id,
      role: player.role,
      status: player.status,
      currentRoomId: player.currentRoomId,
      missions: playerMissions,
      privateEvidence,
      connections: this.connections,
      testimonies: this.testimonies,
      killerDashboard,
      ecoDashboard,
      disarmAlertNotification: player.privateAlert,
      victimDeathCode: player.status === "DEAD_UNDISCOVERED" ? player.victimDeathCode : undefined,
    };
  }
}
