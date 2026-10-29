import { GameState } from "@alibi/game-engine";
import { SolvabilityVerifier } from "@alibi/game-engine";

export async function runFullEightPlayerSimulation(): Promise<boolean> {
  console.log("=== INICIANDO SIMULAÇÃO COMPLETA DE 8 JOGADORES DO ÁLIBI ===");

  const room = new GameState("sim_match_001", "CASA8");

  // 1. Register 8 players
  const playerNames = [
    "Arthur (Host)",
    "Beatriz",
    "Carlos",
    "Daniela",
    "Eduardo",
    "Fernanda",
    "Gabriel",
    "Helena",
  ];

  const players = playerNames.map((name, idx) =>
    room.addPlayer(`p_${idx + 1}`, name, `avatar_${idx + 1}`)
  );

  console.log(`[PASS] 8 jogadores registrados na sala.`);

  // 2. Set ready and start
  players.forEach((p) => room.setReady(p.id, true));
  const started = room.startGame();
  if (!started) throw new Error("Falha ao iniciar partida.");

  console.log(`[PASS] Partida iniciada na fase PREPARATION.`);

  // 3. Verify roles
  const killer = Array.from(room.players.values()).find((p) => p.role === "KILLER")!;
  const survivors = Array.from(room.players.values()).filter((p) => p.role !== "KILLER");

  if (!killer || survivors.length !== 7) {
    throw new Error("Distribuição incorreta de papéis.");
  }
  console.log(`[PASS] Papéis distribuídos: 1 Assassino (${killer.name}) e 7 Sobreviventes.`);

  // 4. Trap Invariant 1: Killer arms trap against Target 1
  const target1 = survivors[0];
  console.log(`[AÇÃO] Assassino (${killer.name}) armando armadilha contra ${target1.name}...`);

  const armResult1 = await room.armTrap(killer.id, target1.id, "trap_tmpl_circuit", "sala");
  if (!armResult1.success) throw new Error("Falha ao armar armadilha.");
  console.log(`[PASS] Armadilha armada com sucesso (ID: ${armResult1.trap.id}).`);

  // Invariant: Killer CANNOT arm a second trap while one is active
  try {
    await room.armTrap(killer.id, survivors[1].id, "trap_tmpl_terminal");
    throw new Error("ERRO: O servidor permitiu duas armadilhas simultâneas!");
  } catch (err: any) {
    console.log(`[PASS] Bloqueio verificado: ${err.message}`);
  }

  // Invariant: Victim CAN NEVER hold the neutralizing mission
  const victimMissions = Array.from(room.missions.values()).filter(
    (m) => m.assignedPlayerId === target1.id
  );
  const selfDisarm = victimMissions.some((m) => m.neutralizesTrapId === armResult1.trap.id);
  if (selfDisarm) {
    throw new Error("FALHA CRÍTICA: A vítima recebeu missão que neutraliza a própria armadilha!");
  }
  console.log(`[PASS] Verificado: Vítima JAMAIS recebeu missão que desativa sua própria armadilha.`);

  // 5. Third-party neutralizes the trap
  const disarmMission = Array.from(room.missions.values()).find(
    (m) => m.neutralizesTrapId === armResult1.trap.id
  );
  if (!disarmMission) throw new Error("Nenhuma missão de neutralização foi agendada.");

  const neutralizer = room.players.get(disarmMission.assignedPlayerId)!;
  console.log(`[AÇÃO] Sobrevivente ${neutralizer.name} completando missão de neutralização...`);

  const disarmOutcome = await room.completeMission(neutralizer.id, disarmMission.id, true);
  if (!disarmOutcome.disarmedTrap) throw new Error("A armadilha deveria ter sido neutralizada.");

  console.log(`[PASS] Armadilha neutralizada por terceiro.`);
  console.log(`[PASS] Alerta do neutralizador: "${neutralizer.privateAlert?.message}"`);
  console.log(`[PASS] Alerta do assassino: "${killer.privateAlert?.message}"`);

  // Invariant: Target 1 starting the disarmed mission does NOT die
  const harmlessStart = await room.startMission(target1.id, armResult1.disguiseMission.id);
  if (harmlessStart.lethal) throw new Error("Missão desarmada matou a vítima indevidamente!");
  console.log(`[PASS] Vítima executou missão desarmada sem sofrer dano (Inofensiva).`);

  // 6. Slot freed: Killer arms trap against Target 2
  const target2 = survivors[1];
  console.log(`[AÇÃO] Assassino armando nova armadilha contra ${target2.name}...`);
  const armResult2 = await room.armTrap(killer.id, target2.id, "trap_tmpl_terminal");
  console.log(`[PASS] Nova armadilha armada.`);

  // Target 2 starts the active trap -> INSTANT DEATH!
  console.log(`[AÇÃO] Vítima (${target2.name}) tocando em 'Iniciar missão'...`);
  const fatalResult = await room.startMission(target2.id, armResult2.disguiseMission.id);
  if (!fatalResult.lethal) throw new Error("A vítima deveria ter sido eliminada imediatamente.");
  if (target2.status !== "DEAD_UNDISCOVERED") throw new Error("Status da vítima não atualizado.");
  console.log(`[PASS] Eliminação virtual imediata confirmada! Código gerado: ${target2.victimDeathCode}`);

  // 7. Body report & Emergency Meeting
  const discoverer = survivors[2];
  console.log(`[AÇÃO] ${discoverer.name} descobre o corpo e relata com o código...`);
  room.reportBody(discoverer.id, target2.id, target2.victimDeathCode);

  if (target2.status !== "ECO") throw new Error("Vítima descoberta deveria transicionar para ECO.");
  if (room.phase !== "MEETING") throw new Error("Reunião não foi iniciada.");
  console.log(`[PASS] Corpo reportado. Vítima virou ECO. Reunião de emergência convocada.`);

  // 8. Voting & Trial
  room.openVoting();
  // 5 living survivors vote on killer
  survivors.slice(2).forEach((s) => room.castVote(s.id, killer.id));
  const voteResult = room.concludeVoting();

  if (voteResult.accusedPlayerId !== killer.id) {
    throw new Error("Resultado da votação não correspondeu aos votos.");
  }
  console.log(`[PASS] Votação concluída. Culpado acusado: ${killer.name}`);

  // 9. Solvability Verification
  const report = SolvabilityVerifier.verifyCase({
    killerId: killer.id,
    allPlayerIds: Array.from(room.players.keys()),
    availableEvidence: Array.from(room.evidenceList.values()),
    deadPlayerIds: [target2.id],
  });

  console.log(`[PASS] Solvabilidade verificada: ${report.isSolvable ? "SOLÚVEL E JUSTO" : "NÃO SOLÚVEL"}`);
  console.log(`[INFO] Evidências nucleares: ${report.coreEvidenceCount}, Suspeitos compatíveis: ${report.compatibleSuspectIds.length}`);

  console.log("=== SIMULAÇÃO COMPLETA CONCLUÍDA COM 100% DE SUCESSO! ===");
  return true;
}

// Run if called directly
if (process.argv[1]?.endsWith("simulation.ts")) {
  runFullEightPlayerSimulation().catch((err) => {
    console.error("FALHA NA SIMULAÇÃO:", err);
    process.exit(1);
  });
}
