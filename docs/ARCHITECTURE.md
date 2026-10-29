# Arquitetura Técnica do Dissimulo

## 1. Princípios de Arquitetura

O **Dissimulo** segue o padrão de **servidor autoritativo estrito**. O cliente smartphone é uma interface de apresentação e coleta de comandos; nenhuma decisão crítica de jogo (eliminação, neutralização, distribuição de papéis, descoberta de pistas ou resultado de votação) é aceita pelo servidor sem validação prévia.

### Invariante Anti-Cheat
O servidor **nunca** envia no payload público ou nas mensagens privadas de sobreviventes campos como:
- `isDisguiseTrap`
- `trapId`
- `killerId`
- Respostas ocultas ou seeds de validação de minigames

As missões falsas recebidas pela vítima são projetadas como missões investigativas legítimas normais. Somente a memória interna do servidor associa a missão à armadilha fatal.

---

## 2. Máquina de Estados do Servidor

A partida transiciona entre os seguintes estados discretos:

```
[LOBBY] ────────> [PREPARATION] ────────> [INVESTIGATION] ────────> [MEETING]
   │                     │                       │                     │
(Entrada & Ready) (Sorteio de Papéis)     (Missões & Armadilhas)   (Debate Presencial)
                                                 │                     │
                                                 ▼                     ▼
                                            [TRIAL / VOTO] <──────── [VOTING]
                                                 │
                                                 ▼
                                            [RESULTS]
```

---

## 3. Concorrência Atômica no Sistema de Armadilhas

Para impedir condições de corrida (por exemplo: a vítima inicia a missão fatal no mesmo instante em que outro sobrevivente conclui a missão neutralizadora), o `TrapManager` utiliza uma trava atômica sequencial (Compare-and-Swap - CAS):

```typescript
public async handleStartMission(...) {
  return this.acquireLock(() => {
    if (trap.status === "ARMED" && trap.targetPlayerId === actorPlayerId) {
      trap.status = "TRIGGERED"; // CAS imediato
      return { lethal: true };
    }
    if (trap.status === "DISARMED") {
      return { lethal: false }; // Inofensiva
    }
  });
}
```

- Se o início ocorrer primeiro: a vítima morre imediatamente, o status vai para `TRIGGERED`, e uma tentativa posterior de neutralização falha pacificamente com `"Ação tardia: armadilha já acionada"`.
- Se a neutralização ocorrer primeiro: o status vai para `DISARMED`, a vítima permanece viva e a missão falsa continua como um minigame inofensivo.

---

## 4. Projeções de Estado Sanitizadas

Cada socket conectado recebe atualizações em duas camadas:
1. `public`: Visão comum a todos (tempo restante, cômodos, lista de jogadores, quórum de vivos/mortos, reuniões em andamento, pistas tornadas públicas).
2. `private`: Visão exclusiva daquele participante gerada por `getPlayerPrivateView(playerId)`:
   - Papel secreto (somente o assassino recebe `role: 'KILLER'`)
   - Missões atribuídas (com remoção de metadados de armadilha)
   - Painel exclusivo do assassino (somente se `role === 'KILLER'`)
   - Painel Eco (somente se `status === 'ECO'`)
   - Alertas privados de neutralização (sem revelar a identidade de terceiros)

---

## 5. Event Sourcing e Log Append-Only

Cada ação relevante na casa gera uma entrada imutável no log de eventos:
- `ROOM_CHANGED`: Mudança de ambiente do participante.
- `TRAP_ARMED`: Registro confidencial de criação de armadilha.
- `TRAP_TRIGGERED`: Momento exato da eliminação da vítima.
- `TRAP_DISARMED`: Neutralização por terceiro sobrevivente.
- `EVIDENCE_DISCOVERED`: Coleta de prova material no cômodo.
- `BODY_REPORTED`: Relato de vítima por código de confirmação.
- `MEETING_STARTED`: Abertura de debate presencial.
- `VOTE_CAST`: Voto registrado com sigilo.
- `GAME_ENDED`: Reconstituição cronológica completa da partida.
