import { describe, it, expect, beforeEach } from "vitest";
import { GameState } from "@alibi/game-engine";
import {
  CircuitGame,
  CipherGame,
  DocReconstructGame,
  LogAuditGame,
  SignalMemoryGame,
  TracePatternGame,
  ChronologyGame,
  FrequencyGame,
  AnomalyGame,
  SealAuthGame,
  TerminalSyncGame,
  PacketReassemblyGame,
} from "@alibi/minigames";
import { ManualRoomProvider } from "@alibi/location";

describe("Dissimulo — Invariantes Críticas de Regras e Armadilhas", () => {
  let room: GameState;
  let killerId: string;
  let survivorIds: string[];

  beforeEach(() => {
    room = new GameState("test_match", "TEST8");
    for (let i = 1; i <= 8; i++) {
      room.addPlayer(`p_${i}`, `Jogador ${i}`, `avatar_${i}`);
      room.setReady(`p_${i}`, true);
    }
    room.startGame();

    const killer = Array.from(room.players.values()).find((p) => p.role === "KILLER")!;
    killerId = killer.id;
    survivorIds = Array.from(room.players.values())
      .filter((p) => p.role !== "KILLER")
      .map((p) => p.id);
  });

  it("1. O assassino só consegue criar exatamente uma armadilha ativa por vez", async () => {
    const target1 = survivorIds[0];
    const target2 = survivorIds[1];

    const res1 = await room.armTrap(killerId, target1, "trap_tmpl_circuit");
    expect(res1.success).toBe(true);

    // Second trap must be rejected by server
    await expect(room.armTrap(killerId, target2, "trap_tmpl_terminal")).rejects.toThrow(
      "O assassino já possui uma armadilha ativa no servidor."
    );
  });

  it("2. A vítima NUNCA recebe ou mantém missão que neutralize sua própria armadilha", async () => {
    const target = survivorIds[0];
    const armRes = await room.armTrap(killerId, target, "trap_tmpl_circuit");
    expect(armRes.success).toBe(true);

    const victimMissions = Array.from(room.missions.values()).filter(
      (m) => m.assignedPlayerId === target
    );

    const hasSelfDisarm = victimMissions.some(
      (m) => m.neutralizesTrapId === armRes.trap.id
    );
    expect(hasSelfDisarm).toBe(false);
  });

  it("3. Tocar em 'Iniciar missão' elimina a vítima IMEDIATAMENTE quando a armadilha está ativa", async () => {
    const target = survivorIds[0];
    const armRes = await room.armTrap(killerId, target, "trap_tmpl_circuit");
    expect(armRes.success).toBe(true);

    const trigger = await room.startMission(target, armRes.disguiseMission.id);
    expect(trigger.lethal).toBe(true);

    const victim = room.players.get(target)!;
    expect(victim.status).toBe("DEAD_UNDISCOVERED");
    expect(victim.victimDeathCode).toBeDefined();
  });

  it("4. Terceiro sobrevivente pode neutralizar a armadilha e liberar o slot do assassino", async () => {
    const target = survivorIds[0];
    const armRes = await room.armTrap(killerId, target, "trap_tmpl_circuit");
    expect(armRes.success).toBe(true);

    const disarmMission = Array.from(room.missions.values()).find(
      (m) => m.neutralizesTrapId === armRes.trap.id
    )!;
    expect(disarmMission).toBeDefined();
    expect(disarmMission.assignedPlayerId).not.toBe(target);
    expect(disarmMission.assignedPlayerId).not.toBe(killerId);

    const neutralizerId = disarmMission.assignedPlayerId;
    const neutralizer = room.players.get(neutralizerId)!;
    const killer = room.players.get(killerId)!;

    const outcome = await room.completeMission(neutralizerId, disarmMission.id, true);
    expect(outcome.disarmedTrap).toBe(true);

    // Private notifications verified
    expect(neutralizer.privateAlert?.message).toContain("Ameaça neutralizada");
    expect(killer.privateAlert?.message).toContain("Sua armadilha foi neutralizada");

    // Slot is freed: killer can arm again!
    const secondArm = await room.armTrap(killerId, survivorIds[1], "trap_tmpl_terminal");
    expect(secondArm.success).toBe(true);
  });

  it("5. Missão falsa desarmada se torna inofensiva e não elimina a vítima", async () => {
    const target = survivorIds[0];
    const armRes = await room.armTrap(killerId, target, "trap_tmpl_circuit");

    const disarmMission = Array.from(room.missions.values()).find(
      (m) => m.neutralizesTrapId === armRes.trap.id
    )!;

    await room.completeMission(disarmMission.assignedPlayerId, disarmMission.id, true);

    // Target starts the disarmed mission -> NOT lethal!
    const startResult = await room.startMission(target, armRes.disguiseMission.id);
    expect(startResult.lethal).toBe(false);
    expect(room.players.get(target)!.status).toBe("ALIVE");
  });

  it("6. Jogadores eliminados não conseguem votar", async () => {
    const target = survivorIds[0];
    const armRes = await room.armTrap(killerId, target, "trap_tmpl_circuit");
    await room.startMission(target, armRes.disguiseMission.id); // victim is dead

    room.startMeeting(survivorIds[1], "EMERGENCY_BUTTON");
    room.openVoting();

    // Dead player attempts to vote -> must be rejected
    expect(() => room.castVote(target, killerId)).toThrow(
      "Jogadores eliminados ou Ecos não possuem direito a voto."
    );
  });

  it("7. Provedor manual de localização funciona perfeitamente sem beacons", () => {
    const manual = new ManualRoomProvider("sala");
    expect(manual.getCurrentReading().roomId).toBe("sala");
    expect(manual.getCurrentReading().providerType).toBe("declared");

    manual.setRoom("escritorio");
    expect(manual.getCurrentReading().roomId).toBe("escritorio");
  });
});

describe("Dissimulo — Validação dos 12 Minigames", () => {
  it("MG01: Reconectar Circuitos — resolve quando conexões alinham fonte e sumidouro", () => {
    const challenge = CircuitGame.generate(3);
    expect(challenge.tiles.length).toBe(9);
    // Rotating tile changes rotation
    const t = challenge.tiles[0];
    const rBefore = t.rotation;
    CircuitGame.rotateTile(t);
    expect(t.rotation).toBe((rBefore + 90) % 360);
  });

  it("MG02: Quebra de Cifra — decodifica corretamente com deslocamento", () => {
    const challenge = CipherGame.generate(2);
    expect(challenge.options).toContain(challenge.targetSolution);
    expect(CipherGame.verify(challenge, challenge.targetSolution)).toBe(true);
    expect(CipherGame.verify(challenge, "ERRADA")).toBe(false);
  });

  it("MG03: Reconstruir Documento — valida ordem dos fragmentos", () => {
    const challenge = DocReconstructGame.generate();
    expect(challenge.fragments.length).toBeGreaterThan(0);
    expect(DocReconstructGame.isSolved([1, 2, 3, 4])).toBe(true);
    expect(DocReconstructGame.isSolved([2, 1, 3, 4])).toBe(false);
  });

  it("MG04: Comparação de Registros — identifica discrepâncias adulteradas", () => {
    const challenge = LogAuditGame.generate();
    expect(LogAuditGame.verify(challenge.tamperedLineIds, challenge.tamperedLineIds)).toBe(true);
    expect(LogAuditGame.verify([99], challenge.tamperedLineIds)).toBe(false);
  });

  it("MG05: Memória de Sinais — valida repetição de sequência", () => {
    const challenge = SignalMemoryGame.generate(4);
    expect(SignalMemoryGame.verify(challenge.sequence, challenge.sequence)).toBe(true);
    expect(SignalMemoryGame.verify([9, 9, 9], challenge.sequence)).toBe(false);
  });

  it("MG06: Análise de Vestígios — identifica a amostra idêntica", () => {
    const challenge = TracePatternGame.generate();
    expect(TracePatternGame.verify(challenge.correctSampleId, challenge.correctSampleId)).toBe(true);
    expect(TracePatternGame.verify("wrong", challenge.correctSampleId)).toBe(false);
  });

  it("MG07: Reconstruir Cronologia — valida ordenação cronológica", () => {
    const challenge = ChronologyGame.generate();
    expect(ChronologyGame.verify([1, 2, 3, 4])).toBe(true);
    expect(ChronologyGame.verify([4, 3, 2, 1])).toBe(false);
  });

  it("MG08: Estabilizar Frequência — valida convergência de onda", () => {
    const challenge = FrequencyGame.generate();
    expect(FrequencyGame.isTuned(challenge, challenge.targetFreq, challenge.targetAmp)).toBe(true);
    expect(FrequencyGame.isTuned(challenge, 0, 0)).toBe(false);
  });

  it("MG09: Localizar Anomalia — detecta zonas adulteradas", () => {
    const challenge = AnomalyGame.generate();
    expect(AnomalyGame.verify(challenge.tamperedZoneIds, challenge.tamperedZoneIds)).toBe(true);
  });

  it("MG10: Autenticar Documento — alinha anéis concêntricos", () => {
    const challenge = SealAuthGame.generate();
    challenge.rings.forEach((r) => (r.rotation = 0));
    expect(SealAuthGame.isAligned(challenge.rings)).toBe(true);
  });

  it("MG11: Sincronizar Terminais — valida handshake de segurança", () => {
    const challenge = TerminalSyncGame.generate();
    expect(TerminalSyncGame.verify(challenge.expectedSumCode, challenge.expectedSumCode)).toBe(true);
    expect(TerminalSyncGame.verify(0, challenge.expectedSumCode)).toBe(false);
  });

  it("MG12: Reconstruir Transmissão — valida reconstrução de pacotes", () => {
    const challenge = PacketReassemblyGame.generate();
    expect(PacketReassemblyGame.isCorrect([1, 2, 3, 4])).toBe(true);
    expect(PacketReassemblyGame.isCorrect([3, 1, 2, 4])).toBe(false);
  });
});
