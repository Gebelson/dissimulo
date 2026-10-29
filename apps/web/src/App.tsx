import React, { useState, useEffect, useRef } from "react";
import {
  PublicGameState,
  PlayerPrivateView,
  ClientAction,
  MinigameChallengeData,
} from "@alibi/contracts";
import { sound } from "./lib/audio";
import { HomeTab } from "./components/HomeTab";
import { MissionsTab } from "./components/MissionsTab";
import { ExploreTab } from "./components/ExploreTab";
import { DossierTab } from "./components/DossierTab";
import { LobbyScreen } from "./components/LobbyScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { MinigamePlayer } from "./components/MinigamePlayer";
import { KillerModal } from "./components/KillerModal";
import { DeathModal } from "./components/DeathModal";
import { MeetingModal } from "./components/MeetingModal";
import { HostPanelModal } from "./components/HostPanelModal";
import { RulesModal } from "./components/RulesModal";
import {
  Home,
  FileCheck2,
  Compass,
  FolderSearch,
  Settings,
  Volume2,
  VolumeX,
  Skull,
} from "lucide-react";

export function App() {
  const [roomCode, setRoomCode] = useState(() => {
    return new URLSearchParams(window.location.search).get("room") || "CASA8";
  });
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("alibi_name") || "Investigador";
  });
  const [playerId] = useState(() => {
    let id = sessionStorage.getItem("alibi_player_id");
    if (!id) {
      id = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem("alibi_player_id", id);
    }
    return id;
  });

  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);

  const [publicState, setPublicState] = useState<PublicGameState | null>(null);
  const [privateState, setPrivateState] = useState<PlayerPrivateView | null>(null);

  // Tab navigation: HOME | MISSIONS | EXPLORE | DOSSIER
  const [currentTab, setCurrentTab] = useState<"HOME" | "MISSIONS" | "EXPLORE" | "DOSSIER">("HOME");

  // Overlays
  const [activeChallenge, setActiveChallenge] = useState<MinigameChallengeData | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [showKillerPanel, setShowKillerPanel] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [showHostPanel, setShowHostPanel] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);

  // Connect WebSocket
  useEffect(() => {
    if (!joined) return;

    const host = window.location.hostname || "localhost";
    const port = 4000;
    const wsUrl = `ws://${host}:${port}?roomCode=${roomCode}&playerId=${playerId}&name=${encodeURIComponent(
      playerName
    )}&avatar=avatar_1`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "SYNC_STATE") {
          setPublicState(msg.public);
          setPrivateState(msg.private);

          // If victim received instant death notification
          if (msg.private.status === "DEAD_UNDISCOVERED") {
            setShowDeathModal(true);
          }
        } else if (msg.type === "DEATH_SCREEN") {
          sound.playEliminationSound();
          setShowDeathModal(true);
        } else if (msg.type === "CHALLENGE_DATA") {
          setActiveChallenge(msg.challenge);
        } else if (msg.type === "EVIDENCE_UNLOCKED") {
          sound.playEvidenceChime();
        }
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [joined, roomCode, playerId, playerName]);

  const sendAction = (action: ClientAction) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(action));
    }
  };

  const toggleSound = () => {
    sound.isSoundEnabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Join match form
  if (!joined) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-investigation font-bold">
              INVESTIGAÇÃO CRIMINAL PRESENCIAL
            </span>
            <h1 className="text-3xl font-bold font-display text-primary">ÁLIBI</h1>
            <p className="text-xs text-secondary italic">Ninguém tem a história inteira.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!playerName.trim() || !roomCode.trim()) return;
              sound.playTap();
              localStorage.setItem("alibi_name", playerName);
              setJoined(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs text-secondary font-bold block mb-1">SEU NOME:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ex: Arthur"
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-primary outline-none focus:border-investigation"
                required
              />
            </div>

            <div>
              <label className="text-xs text-secondary font-bold block mb-1">CÓDIGO DA SALA:</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: CASA8"
                className="w-full bg-background border border-border rounded-xl p-3 text-xs font-mono font-bold text-investigation tracking-widest outline-none focus:border-investigation"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-investigation text-background rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 shadow-lg shadow-investigation/20"
            >
              Entrar na Casa
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state while syncing
  if (!publicState || !privateState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-investigation border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-secondary">Conectando ao ÁLIBI Server...</span>
      </div>
    );
  }

  // LOBBY PHASE
  if (publicState.phase === "LOBBY") {
    return (
      <>
        <LobbyScreen
          publicState={publicState}
          privateState={privateState}
          onSetReady={(ready) => sendAction({ type: "SET_READY", ready })}
          onStartGame={() => sendAction({ type: "START_GAME" })}
          onOpenRules={() => setShowRules(true)}
        />
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </>
    );
  }

  // RESULTS PHASE
  if (publicState.phase === "RESULTS") {
    return (
      <ResultsScreen
        publicState={publicState}
        privateState={privateState}
        onRestart={() => sendAction({ type: "HOST_RESTART" })}
      />
    );
  }

  const me = publicState.players.find((p) => p.id === privateState.playerId);
  const isHost = me?.isHost || false;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      {/* Top Header */}
      <header className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm text-primary tracking-wide">ÁLIBI</span>
          <span className="text-[9px] font-mono text-investigation bg-investigation/10 px-1.5 py-0.5 rounded border border-investigation/30">
            {roomCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1.5 text-secondary hover:text-primary rounded-lg active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-danger" />}
          </button>

          {isHost && (
            <button
              onClick={() => {
                sound.playTap();
                setShowHostPanel(true);
              }}
              className="p-1.5 text-secondary hover:text-investigation rounded-lg active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {currentTab === "HOME" && (
          <HomeTab
            publicState={publicState}
            privateState={privateState}
            onOpenKillerPanel={() => setShowKillerPanel(true)}
            onSelectMission={(mId) => {
              setCurrentTab("MISSIONS");
            }}
          />
        )}
        {currentTab === "MISSIONS" && (
          <MissionsTab
            privateState={privateState}
            onStartMission={(mId) => {
              setActiveMissionId(mId);
              sendAction({
                type: "START_MISSION",
                missionId: mId,
                idempotencyKey: `idemp_${Date.now()}`,
              });
            }}
          />
        )}
        {currentTab === "EXPLORE" && (
          <ExploreTab
            publicState={publicState}
            privateState={privateState}
            onSetCurrentRoom={(roomId) =>
              sendAction({ type: "SET_CURRENT_ROOM", roomId, reliability: "declared" })
            }
            onInvestigateRoom={(roomId) => sendAction({ type: "INVESTIGATE_ROOM", roomId })}
          />
        )}
        {currentTab === "DOSSIER" && (
          <DossierTab
            publicState={publicState}
            privateState={privateState}
            onShareEvidence={(evidenceId) => sendAction({ type: "SHARE_EVIDENCE", evidenceId })}
            onSubmitTestimony={(statement, claimedRoomId, targetSuspectId) =>
              sendAction({ type: "SUBMIT_TESTIMONY", statement, claimedRoomId, targetSuspectId })
            }
            onConnectEvidence={(fromEvidenceId, toTargetId, hypothesis) =>
              sendAction({ type: "CONNECT_EVIDENCE", fromEvidenceId, toTargetId, hypothesis })
            }
          />
        )}
      </main>

      {/* 4-Tab Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-40 max-w-md mx-auto">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("HOME");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-colors ${
              currentTab === "HOME" ? "text-investigation font-bold" : "text-secondary"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Início</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("MISSIONS");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-colors relative ${
              currentTab === "MISSIONS" ? "text-investigation font-bold" : "text-secondary"
            }`}
          >
            <FileCheck2 className="w-5 h-5" />
            <span className="text-[10px]">Missões</span>
            {privateState.missions.filter((m) => m.status === "AVAILABLE").length > 0 && (
              <span className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-investigation animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("EXPLORE");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-colors ${
              currentTab === "EXPLORE" ? "text-investigation font-bold" : "text-secondary"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Explorar</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("DOSSIER");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-colors ${
              currentTab === "DOSSIER" ? "text-investigation font-bold" : "text-secondary"
            }`}
          >
            <FolderSearch className="w-5 h-5" />
            <span className="text-[10px]">Dossiê</span>
          </button>
        </div>
      </nav>

      {/* OVERLAYS & MODALS */}
      {/* 1. Minigame Modal */}
      {activeChallenge && activeMissionId && (
        <MinigamePlayer
          challenge={activeChallenge}
          onComplete={(success) => {
            sendAction({
              type: "SUBMIT_MINIGAME",
              missionId: activeMissionId,
              resultToken: "token_verified",
              success,
              completionTimeMs: 15000,
            });
            setActiveChallenge(null);
            setActiveMissionId(null);
          }}
          onCancel={() => {
            setActiveChallenge(null);
            setActiveMissionId(null);
          }}
        />
      )}

      {/* 2. Killer Dashboard Modal */}
      {showKillerPanel && (
        <KillerModal
          publicState={publicState}
          privateState={privateState}
          onClose={() => setShowKillerPanel(false)}
          onArmTrap={(targetPlayerId, templateId, requiredRoomId) =>
            sendAction({
              type: "ARM_TRAP",
              targetPlayerId,
              templateId,
              requiredRoomId,
              idempotencyKey: `trap_${Date.now()}`,
            })
          }
        />
      )}

      {/* 3. Instant Death Screen */}
      {showDeathModal && (
        <DeathModal
          deathCode={privateState.victimDeathCode}
          onDismiss={() => setShowDeathModal(false)}
        />
      )}

      {/* 4. Emergency Meeting / Body Reported Modal */}
      {publicState.activeMeeting && (
        <MeetingModal
          publicState={publicState}
          privateState={privateState}
          onCastVote={(target) => sendAction({ type: "CAST_VOTE", targetPlayerIdOrSkip: target })}
        />
      )}

      {/* 5. Host Admin Panel */}
      {showHostPanel && (
        <HostPanelModal
          publicState={publicState}
          onClose={() => setShowHostPanel(false)}
          onPause={() => sendAction({ type: "HOST_PAUSE" })}
          onResume={() => sendAction({ type: "HOST_RESUME" })}
          onRestart={() => sendAction({ type: "HOST_RESTART" })}
        />
      )}
    </div>
  );
}
