import { MissionInstance, TrapState, TrapStatus } from "@alibi/contracts";
import { DISGUISE_TRAP_TEMPLATES, MISSION_TEMPLATES } from "./mission-templates.js";

export interface TrapArmResult {
  success: boolean;
  trap: TrapState;
  disguiseMission: MissionInstance;
  neutralizingMission?: MissionInstance;
  error?: string;
}

export interface TrapTriggerResult {
  lethal: boolean;
  victimId: string;
  trapId?: string;
  error?: string;
}

export interface TrapDisarmResult {
  success: boolean;
  trapId?: string;
  killerId?: string;
  targetId?: string;
  neutralizerId?: string;
  message?: string;
}

export class TrapManager {
  private traps: Map<string, TrapState> = new Map();
  // Lock mechanism for compare-and-swap concurrency
  private lockPromise: Promise<void> = Promise.resolve();

  private async acquireLock<T>(fn: () => Promise<T> | T): Promise<T> {
    const prev = this.lockPromise;
    let release: () => void;
    this.lockPromise = new Promise((resolve) => {
      release = resolve;
    });
    await prev;
    try {
      return await fn();
    } finally {
      release!();
    }
  }

  public getActiveTrapForKiller(killerId: string): TrapState | undefined {
    for (const trap of this.traps.values()) {
      if (trap.killerId === killerId && trap.status === "ARMED") {
        return trap;
      }
    }
    return undefined;
  }

  public getTrapById(trapId: string): TrapState | undefined {
    return this.traps.get(trapId);
  }

  /**
   * INVARIANT 1: Only 1 active trap per killer at any time.
   * INVARIANT 2: Target can be any living non-killer survivor.
   * INVARIANT 3: Victim CAN NEVER receive a mission capable of neutralizing their own trap.
   */
  public async armTrap(params: {
    killerId: string;
    targetPlayerId: string;
    templateId: string;
    requiredRoomId?: string;
    livingSurvivorIds: string[]; // does not include killer
    existingSurvivorMissions: MissionInstance[];
  }): Promise<TrapArmResult> {
    return this.acquireLock(() => {
      const {
        killerId,
        targetPlayerId,
        templateId,
        requiredRoomId,
        livingSurvivorIds,
        existingSurvivorMissions,
      } = params;

      // 1. Check if killer already has an ARMED trap
      const existing = this.getActiveTrapForKiller(killerId);
      if (existing) {
        return {
          success: false,
          trap: existing,
          disguiseMission: null as any,
          error: "O assassino já possui uma armadilha ativa no servidor.",
        };
      }

      // 2. Validate target is eligible living survivor
      if (!livingSurvivorIds.includes(targetPlayerId)) {
        return {
          success: false,
          trap: null as any,
          disguiseMission: null as any,
          error: "O alvo selecionado não é um sobrevivente válido ou já foi eliminado.",
        };
      }

      if (targetPlayerId === killerId) {
        return {
          success: false,
          trap: null as any,
          disguiseMission: null as any,
          error: "O assassino não pode criar uma armadilha contra si mesmo.",
        };
      }

      // 3. INVARIANT 3: Check if target currently holds any active mission that could disarm this trap.
      // If the target has an active/available disarm-capable mission, reject or reroute before activation.
      const targetDisarmMission = existingSurvivorMissions.find(
        (m) =>
          m.assignedPlayerId === targetPlayerId &&
          m.neutralizesTrapId !== undefined &&
          m.status !== "COMPLETED" &&
          m.status !== "FAILED"
      );
      if (targetDisarmMission) {
        return {
          success: false,
          trap: null as any,
          disguiseMission: null as any,
          error: "Conflito de agendamento de missão. Escolha outro alvo ou aguarde a rodada.",
        };
      }

      // Find template
      const template =
        DISGUISE_TRAP_TEMPLATES.find((t) => t.id === templateId) ||
        DISGUISE_TRAP_TEMPLATES[0];

      const trapId = `trap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const missionId = `mission_trap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newTrap: TrapState = {
        id: trapId,
        killerId,
        targetPlayerId,
        disguiseMissionId: missionId,
        templateId: template.id,
        requiredRoomId,
        status: "ARMED",
        createdAt: Date.now(),
      };

      this.traps.set(trapId, newTrap);

      // Create disguise mission for victim
      const disguiseMission: MissionInstance = {
        id: missionId,
        templateId: template.id,
        title: template.title,
        description: template.description,
        category: "INVESTIGATION", // Shows as normal investigation to target
        minigameId: template.minigameId,
        requiredRoomId,
        assignedPlayerId: targetPlayerId,
        status: "AVAILABLE",
        isDisguiseTrap: true, // stripped in client view
        trapId, // stripped in client view
        createdAt: Date.now(),
      };

      // Select another living survivor (EXCLUDING VICTIM AND KILLER) to receive a neutralizing mission
      const eligibleNeutralizers = livingSurvivorIds.filter(
        (id) => id !== targetPlayerId && id !== killerId
      );

      let neutralizingMission: MissionInstance | undefined = undefined;
      if (eligibleNeutralizers.length > 0) {
        const neutralizerId =
          eligibleNeutralizers[Math.floor(Math.random() * eligibleNeutralizers.length)];
        const disarmTemplate =
          MISSION_TEMPLATES.find((t) => t.isDisarmCapable) || MISSION_TEMPLATES[0];

        neutralizingMission = {
          id: `mission_disarm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          templateId: disarmTemplate.id,
          title: disarmTemplate.title,
          description: disarmTemplate.description,
          category: disarmTemplate.category,
          minigameId: disarmTemplate.minigameId,
          requiredRoomId: disarmTemplate.requiredRoomId,
          assignedPlayerId: neutralizerId,
          status: "AVAILABLE",
          neutralizesTrapId: trapId,
          createdAt: Date.now(),
        };
      }

      return {
        success: true,
        trap: newTrap,
        disguiseMission,
        neutralizingMission,
      };
    });
  }

  /**
   * INVARIANT 4: Starting the mission triggers instant death if trap is ARMED.
   * INVARIANT 5: Viewing details does NOT call this method!
   * INVARIANT 6: If already DISARMED, does not kill.
   * Atomic CAS operation.
   */
  public async handleStartMission(params: {
    actorPlayerId: string;
    mission: MissionInstance;
    currentRoomId: string;
  }): Promise<TrapTriggerResult> {
    return this.acquireLock(() => {
      const { actorPlayerId, mission, currentRoomId } = params;

      if (!mission.isDisguiseTrap || !mission.trapId) {
        return { lethal: false, victimId: actorPlayerId };
      }

      const trap = this.traps.get(mission.trapId);
      if (!trap) {
        return { lethal: false, victimId: actorPlayerId };
      }

      // Check room requirement
      if (trap.requiredRoomId && trap.requiredRoomId !== currentRoomId) {
        return {
          lethal: false,
          victimId: actorPlayerId,
          error: "Você precisa estar no ambiente correto para iniciar esta missão.",
        };
      }

      // Compare-and-swap on trap status
      if (trap.status === "ARMED" && trap.targetPlayerId === actorPlayerId) {
        trap.status = "TRIGGERED";
        trap.triggeredAt = Date.now();
        mission.status = "FAILED";

        return {
          lethal: true,
          victimId: actorPlayerId,
          trapId: trap.id,
        };
      }

      // If trap was already disarmed, mission is harmless
      if (trap.status === "DISARMED") {
        mission.status = "IN_PROGRESS";
        return { lethal: false, victimId: actorPlayerId };
      }

      return { lethal: false, victimId: actorPlayerId };
    });
  }

  /**
   * INVARIANT 7: Third party disarms trap through legitimate mission.
   * INVARIANT 8: Atomic CAS: If triggered first, disarm fails. If armed, becomes disarmed.
   * INVARIANT 9: Slot is freed so killer can arm again!
   */
  public async handleNeutralizeMission(params: {
    actorPlayerId: string;
    mission: MissionInstance;
  }): Promise<TrapDisarmResult> {
    return this.acquireLock(() => {
      const { actorPlayerId, mission } = params;
      const trapId = mission.neutralizesTrapId;
      if (!trapId) {
        return { success: false, message: "A missão não possui armadilha vinculada." };
      }

      const trap = this.traps.get(trapId);
      if (!trap) {
        return { success: false, message: "Armadilha não encontrada." };
      }

      // Victim cannot neutralize their own trap
      if (actorPlayerId === trap.targetPlayerId) {
        return {
          success: false,
          message: "A vítima não pode neutralizar sua própria armadilha.",
        };
      }

      // Killer cannot neutralize their own trap
      if (actorPlayerId === trap.killerId) {
        return {
          success: false,
          message: "O assassino não pode neutralizar sua própria armadilha.",
        };
      }

      // Compare-and-swap
      if (trap.status === "ARMED") {
        trap.status = "DISARMED";
        trap.disarmedAt = Date.now();
        trap.disarmedByPlayerId = actorPlayerId;

        return {
          success: true,
          trapId: trap.id,
          killerId: trap.killerId,
          targetId: trap.targetPlayerId,
          neutralizerId: actorPlayerId,
          message: "Armadilha neutralizada com sucesso.",
        };
      }

      if (trap.status === "TRIGGERED") {
        return {
          success: false,
          message: "Ação tardia: a armadilha já havia sido acionada.",
        };
      }

      return {
        success: false,
        message: `Armadilha já se encontra no estado ${trap.status}.`,
      };
    });
  }
}
