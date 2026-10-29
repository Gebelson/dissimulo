import React, { useState, useEffect, useRef } from "react";
import {
  PublicGameState,
  PlayerPrivateView,
  ClientAction,
  MinigameChallengeData,
} from "@alibi/contracts";
import { sound } from "./lib/audio";
import { AlibiLogo } from "./components/ui/AlibiLogo";
import { RoleRevealModal } from "./components/ui/RoleRevealModal";
import { OnboardingOverlay } from "./components/ui/OnboardingOverlay";
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
  Radio,
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
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
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

  // 1. WELCOME / JOIN SCREEN
  if (!joined) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-sm game-panel p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <AlibiLogo size="lg" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!playerName.trim() || !roomCode.trim()) return;
              sound.playTap();
              localStorage.setItem("alibi_name", playerName);
              setJoined(true);
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <label className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block mb-1">
                SEU CODINOME DE CAMPO:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ex: Inspetor Arthur"
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-primary outline-none focus:border-investigation font-sans"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block mb-1">
                CÓDIGO DE ENTRADA NA RESIDÊNCIA:
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: CASA8"
                className="w-full bg-background border border-border rounded-xl p-3 text-sm font-mono font-bold text-investigation tracking-widest outline-none focus:border-investigation uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 tactile-btn-primary rounded-xl font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-investigation/20"
            >
              Conectar ao Terminal da Casa
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. CONNECTING STATE
  if (!publicState || !privateState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-4 select-none">
        <AlibiLogo size="sm" subtitle={false} />
        <div className="w-10 h-10 border-2 border-investigation border-t-transparent rounded-full animate-spin shadow-hud-cyan" />
        <span className="text-xs font-mono text-secondary tracking-widest">
          ESTABELECENDO CANAL SEGURO...
        </span>
      </div>
    );
  }

  // 3. LOBBY PHASE
  if (publicState.phase === "LOBBY") {
    return (
      <>
        <LobbyScreen
          publicState={publicState}
          privateState={privateState}
          onSetReady={(ready) => sendAction({ type: "SET_READY", ready })}
          onStartGame={() => sendAction({ type: "START_GAME" })}
          onOpenRules={() => setShowOnboarding(true)}
        />
        {showOnboarding && <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />}
      </>
    );
  }

  // 4. RESULTS PHASE
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
      {/* TOP DIEGETIC HUD BAR */}
      <header className="px-4 py-2.5 border-b border-border bg-surface/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <AlibiLogo size="sm" subtitle={false} />
          <span className="text-[9px] font-mono text-investigation bg-investigation/10 px-2 py-0.5 rounded border border-investigation/30 font-bold">
            {roomCode}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="p-2 text-secondary hover:text-primary rounded-xl active:scale-95 bg-surface-elevated border border-border"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-investigation" /> : <VolumeX className="w-4 h-4 text-danger" />}
          </button>

          {isHost && (
            <button
              onClick={() => {
                sound.playTap();
                setShowHostPanel(true);
              }}
              className="p-2 text-secondary hover:text-investigation rounded-xl active:scale-95 bg-surface-elevated border border-border"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* MAIN SCREEN BODY */}
      <main className="flex-1 p-4 overflow-y-auto">
        {currentTab === "HOME" && (
          <HomeTab
            publicState={publicState}
            privateState={privateState}
            onOpenKillerPanel={() => setShowKillerPanel(true)}
            onOpenRoleReveal={() => setShowRoleReveal(true)}
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

      {/* 4-TAB TACTICAL BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/98 backdrop-blur-xl border-t border-border z-40 max-w-md mx-auto shadow-2xl">
        <div className="grid grid-cols-4 h-16 items-center">
          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("HOME");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all ${
              currentTab === "HOME"
                ? "text-investigation font-bold scale-105"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wider">Início</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("MISSIONS");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all relative ${
              currentTab === "MISSIONS"
                ? "text-investigation font-bold scale-105"
                : "text-secondary hover:text-primary"
            }`}
          >
            <FileCheck2 className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wider">Missões</span>
            {privateState.missions.filter((m) => m.status === "AVAILABLE").length > 0 && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-investigation shadow-hud-cyan animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("EXPLORE");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all ${
              currentTab === "EXPLORE"
                ? "text-investigation font-bold scale-105"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wider">Explorar</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("DOSSIER");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all ${
              currentTab === "DOSSIER"
                ? "text-investigation font-bold scale-105"
                : "text-secondary hover:text-primary"
            }`}
          >
            <FolderSearch className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wider">Dossiê</span>
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
              completionTimeMs: 12000,
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

      {/* 2. Killer Secret Panel */}
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

      {/* 3. Role Reveal Secret Ceremony */}
      {showRoleReveal && (
        <RoleRevealModal
          role={privateState.role}
          playerName={playerName}
          onDismiss={() => setShowRoleReveal(false)}
        />
      )}

      {/* 4. Instant Death Screen */}
      {showDeathModal && (
        <DeathModal
          deathCode={privateState.victimDeathCode}
          onDismiss={() => setShowDeathModal(false)}
        />
      )}

      {/* 5. Emergency Meeting / Body Reported */}
      {publicState.activeMeeting && (
        <MeetingModal
          publicState={publicState}
          privateState={privateState}
          onCastVote={(target) => sendAction({ type: "CAST_VOTE", targetPlayerIdOrSkip: target })}
        />
      )}

      {/* 6. Host Admin Panel */}
      {showHostPanel && (
        <HostPanelModal
          publicState={publicState}
          onClose={() => setShowHostPanel(false)}
          onPause={() => sendAction({ type: "HOST_PAUSE" })}
          onResume={() => sendAction({ type: "HOST_RESUME" })}
          onRestart={() => sendAction({ type: "HOST_RESTART" })}
        />
      )}

      {/* 7. Onboarding Tutorial Walkthrough */}
      {showOnboarding && <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />}
    </div>
  );
}
