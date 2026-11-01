import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { GameState } from "@alibi/game-engine";
import { ClientAction } from "@alibi/contracts";

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

export class DissimuloServer {
  private server: http.Server;
  private wss: WebSocketServer;
  private rooms: Map<string, GameState> = new Map();
  // Map of client sockets: playerId -> WebSocket
  private clientSockets: Map<string, WebSocket> = new Map();
  // Map of socket to metadata
  private socketMetadata: Map<WebSocket, { roomCode: string; playerId: string; isAlive: boolean }> = new Map();
  private tickerInterval?: NodeJS.Timeout;
  private heartbeatInterval?: NodeJS.Timeout;

  constructor() {
    this.server = http.createServer((req, res) => {
      // Robust CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const host = req.headers.host || `localhost:${PORT}`;
      let url: URL;
      try {
        url = new URL(req.url || "/", `http://${host}`);
      } catch {
        url = new URL("http://localhost/");
      }

      // Root informational endpoint
      if (url.pathname === "/" || url.pathname === "") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            name: "Dissimulo Multiplayer Game Server",
            status: "online",
            version: "1.0.0",
            port: PORT,
            host: HOST,
            activeRooms: this.rooms.size,
            connectedClients: this.clientSockets.size,
            endpoints: {
              health: "/health",
              rooms: "/api/rooms",
              ws: "/?roomCode=CASA8&playerId=...&name=...",
              wsProxy: "/ws?roomCode=CASA8&playerId=...&name=...",
            },
            timestamp: Date.now(),
          })
        );
        return;
      }

      // Health check endpoint
      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "healthy",
            activeRooms: this.rooms.size,
            connectedClients: this.clientSockets.size,
            timestamp: Date.now(),
          })
        );
        return;
      }

      // Active rooms list endpoint
      if (url.pathname === "/api/rooms" && req.method === "GET") {
        const list = Array.from(this.rooms.values()).map((r) => ({
          roomCode: r.roomCode,
          phase: r.phase,
          playerCount: r.players.size,
        }));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(list));
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint not found" }));
    });

    this.wss = new WebSocketServer({ server: this.server });
    this.setupWebSocket();
    this.startTicker();
    this.startHeartbeat();
  }

  public getOrCreateRoom(roomCode: string): GameState {
    const code = roomCode.toUpperCase().trim();
    let room = this.rooms.get(code);
    if (!room) {
      room = new GameState(`match_${Date.now()}`, code);
      this.rooms.set(code, room);
    }
    return room;
  }

  private setupWebSocket() {
    this.wss.on("connection", (ws, req) => {
      const host = req.headers.host || `localhost:${PORT}`;
      let url: URL;
      try {
        url = new URL(req.url || "/", `http://${host}`);
      } catch {
        url = new URL("http://localhost/");
      }

      const roomCode = (url.searchParams.get("roomCode") || "CASA8").toUpperCase().trim();
      const playerId = url.searchParams.get("playerId") || `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const name = url.searchParams.get("name") || "Investigador";
      const avatar = url.searchParams.get("avatar") || "avatar_1";

      const room = this.getOrCreateRoom(roomCode);
      this.socketMetadata.set(ws, { roomCode, playerId, isAlive: true });
      this.clientSockets.set(playerId, ws);

      // Handle pong keepalive response
      ws.on("pong", () => {
        const meta = this.socketMetadata.get(ws);
        if (meta) meta.isAlive = true;
      });

      // Add player if not present (supports reconnection)
      if (!room.players.has(playerId)) {
        room.addPlayer(playerId, name, avatar);
      }

      // Send initial state sync to this client immediately
      this.syncRoom(roomCode);

      ws.on("message", async (data) => {
        try {
          const raw = data.toString();
          const action = JSON.parse(raw) as ClientAction | { type: "PING"; timestamp?: number };

          // Client-level ping for latency measurement
          if ((action as any).type === "PING") {
            const meta = this.socketMetadata.get(ws);
            if (meta) meta.isAlive = true;
            ws.send(JSON.stringify({ type: "PONG", clientTimestamp: (action as any).timestamp, serverTimestamp: Date.now() }));
            return;
          }

          await this.handleClientAction(roomCode, playerId, action as ClientAction, ws);
        } catch (err: any) {
          ws.send(JSON.stringify({ type: "ERROR", message: err.message || "Erro ao processar ação." }));
        }
      });

      ws.on("close", () => {
        this.socketMetadata.delete(ws);
        this.clientSockets.delete(playerId);
        // Do not remove player from room to support seamless reconnection
      });

      ws.on("error", (err) => {
        console.error(`[WS ERROR] Player ${playerId} in ${roomCode}:`, err.message);
      });
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const meta = this.socketMetadata.get(ws);
        if (!meta) {
          ws.terminate();
          return;
        }

        if (meta.isAlive === false) {
          this.socketMetadata.delete(ws);
          this.clientSockets.delete(meta.playerId);
          return ws.terminate();
        }

        meta.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  private async handleClientAction(roomCode: string, playerId: string, action: ClientAction, ws: WebSocket) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    switch (action.type) {
      case "SET_READY":
        room.setReady(playerId, action.ready);
        this.syncRoom(roomCode);
        break;

      case "START_GAME": {
        const player = room.players.get(playerId);
        if (!player?.isHost) throw new Error("Apenas o anfitrião pode iniciar a partida.");
        room.startGame();
        this.syncRoom(roomCode);
        break;
      }

      case "SET_CURRENT_ROOM":
        room.setCurrentRoom(playerId, action.roomId, action.reliability);
        this.syncRoom(roomCode);
        break;

      case "ARM_TRAP": {
        await room.armTrap(playerId, action.targetPlayerId, action.templateId, action.requiredRoomId);
        this.syncRoom(roomCode);
        break;
      }

      case "START_MISSION": {
        const result = await room.startMission(playerId, action.missionId);
        if (result.lethal) {
          // Send instant death notification to victim
          ws.send(JSON.stringify({ type: "DEATH_SCREEN", message: "Você ativou uma armadilha fatal." }));
        } else if (result.challenge) {
          ws.send(JSON.stringify({ type: "CHALLENGE_DATA", challenge: result.challenge }));
        }
        this.syncRoom(roomCode);
        break;
      }

      case "SUBMIT_MINIGAME": {
        await room.completeMission(playerId, action.missionId, action.success);
        this.syncRoom(roomCode);
        break;
      }

      case "INVESTIGATE_ROOM": {
        const ev = room.searchRoom(playerId, action.roomId);
        if (ev) {
          ws.send(JSON.stringify({ type: "EVIDENCE_UNLOCKED", evidence: ev }));
        }
        this.syncRoom(roomCode);
        break;
      }

      case "REPORT_BODY":
        room.reportBody(playerId, action.victimPlayerId, action.confirmationCode);
        this.syncRoom(roomCode);
        break;

      case "CALL_MEETING":
        room.startMeeting(playerId, "EMERGENCY_BUTTON");
        this.syncRoom(roomCode);
        break;

      case "CAST_VOTE":
        room.castVote(playerId, action.targetPlayerIdOrSkip);
        this.syncRoom(roomCode);
        break;

      case "SHARE_EVIDENCE":
        room.shareEvidence(playerId, action.evidenceId);
        this.syncRoom(roomCode);
        break;

      case "SUBMIT_TESTIMONY":
        room.submitTestimony(playerId, action.statement, action.claimedRoomId, action.targetSuspectId);
        this.syncRoom(roomCode);
        break;

      case "CONNECT_EVIDENCE":
        room.connectDossier(playerId, action.fromEvidenceId, action.toTargetId, action.hypothesis);
        this.syncRoom(roomCode);
        break;

      case "HOST_PAUSE":
        this.syncRoom(roomCode);
        break;

      case "HOST_RESUME":
        this.syncRoom(roomCode);
        break;

      case "HOST_RESTART":
        room.phase = "LOBBY";
        this.syncRoom(roomCode);
        break;

      default:
        break;
    }
  }

  // Sends public state to all, and customized private state to each socket
  public syncRoom(roomCode: string) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    const publicState = room.getPublicState();

    room.players.forEach((player, pId) => {
      const socket = this.clientSockets.get(pId);
      if (socket && socket.readyState === WebSocket.OPEN) {
        const privateView = room.getPlayerPrivateView(pId);
        socket.send(
          JSON.stringify({
            type: "SYNC_STATE",
            public: publicState,
            private: privateView,
          })
        );
      }
    });
  }

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.rooms.forEach((room, roomCode) => {
        if (room.phase === "LOBBY" || room.phase === "RESULTS") return;

        if (room.activeMeeting) {
          room.activeMeeting.timeRemainingSeconds -= 1;
          if (room.activeMeeting.timeRemainingSeconds <= 0) {
            if (!room.activeMeeting.isVotingOpen) {
              room.openVoting();
            } else {
              room.concludeVoting();
            }
          }
          this.syncRoom(roomCode);
        } else {
          room.phaseTimeRemainingSeconds -= 1;
          if (room.phaseTimeRemainingSeconds <= 0) {
            room.phase = "RESULTS";
          }
        }
      });
    }, 1000);
  }

  public listen(port = PORT, host = HOST): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, host, () => {
        console.log(`[DISSIMULO SERVER] Listening on http://${host}:${port} (Bound to all network interfaces)`);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => resolve());
      });
    });
  }
}

// Backwards compatibility alias
export { DissimuloServer as AlibiServer };

// Start standalone if executed directly
if (process.argv[1]?.endsWith("server.ts") || process.argv[1]?.endsWith("server.js")) {
  const s = new DissimuloServer();
  s.listen();
}
