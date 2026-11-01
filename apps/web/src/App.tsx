import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PublicGameState,
  PlayerPrivateView,
  ClientAction,
  MinigameChallengeData,
} from "@alibi/contracts";
import { sound } from "./lib/audio";
import { DissimuloLogo } from "./components/ui/DissimuloLogo";
import { RoleRevealModal } from "./components/ui/RoleRevealModal";
import { OnboardingOverlay } from "./components/ui/OnboardingOverlay";
import { WelcomeScreen } from "./components/WelcomeScreen";
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
import { ServerConfigModal } from "./components/ui/ServerConfigModal";
import {
  buildWebSocketUrl,
  resolveServerConfig,
} from "./services/connection";
import {
  Home,
  FileCheck2,
  Compass,
  FolderSearch,
  Settings,
  Volume2,
  VolumeX,
  ShieldAlert,
  RotateCcw,
  ArrowLeft,
  Server,
} from "lucide-react";

type ConnectionState = "IDLE" | "CONNECTING" | "CONNECTED" | "ERROR";

export function App() {
  const [roomCode, setRoomCode] = useState(() => {
    return new URLSearchParams(window.location.search).get("room") || "CASA8";
  });
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("dissimulo_name") || localStorage.getItem("alibi_name") || "Investigador";
  });
  const [playerId, setPlayerId] = useState(() => {
    let id = sessionStorage.getItem("dissimulo_player_id") || sessionStorage.getItem("alibi_player_id");
    if (!id) {
      id = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem("dissimulo_player_id", id);
    }
    return id;
  });

  const [joined, setJoined] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("IDLE");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

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
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset to welcome screen cleanly
  const handleBackToWelcome = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    setJoined(false);
    setConnectionStatus("IDLE");
    setConnectionError(null);
    setPublicState(null);
    setPrivateState(null);
  }, []);

  // Retry connection
  const handleRetry = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    setConnectionStatus("CONNECTING");
    setConnectionError(null);
    setPublicState(null);
    setPrivateState(null);
    setRetryTrigger((prev) => prev + 1);
  }, []);

  // Connect WebSocket when joined is true
  useEffect(() => {
    if (!joined) {
      setConnectionStatus("IDLE");
      return;
    }

    setConnectionStatus("CONNECTING");
    setConnectionError(null);

    const cfg = resolveServerConfig();

    if (cfg.isProductionWithoutBackend) {
      setConnectionStatus("ERROR");
      setConnectionError(
        "Ambiente de produção (Vercel) detectado sem backend multiplayer configurado. O Vercel hospeda a interface estática, mas WebSockets requerem um servidor dedicado (Render, Railway, Fly.io ou IP da sua máquina). Clique em 'Configurar Servidor' abaixo para definir o endereço."
      );
      return;
    }

    const wsUrl = buildWebSocketUrl(roomCode, playerId, playerName);
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;
    } catch (err: any) {
      setConnectionStatus("ERROR");
      setConnectionError(`Erro de sintaxe ou segurança ao conectar a ${wsUrl}: ${err.message || "URL inválida"}`);
      return;
    }

    // Set connection timeout (8 seconds) to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (!publicState || !privateState) {
        setConnectionStatus("ERROR");
        setConnectionError(`Tempo de conexão esgotado ao tentar alcançar ${cfg.resolvedWsUrl}. Verifique se o servidor do caso está ativo.`);
        try {
          ws.close();
        } catch {}
      }
    }, 8000);

    ws.onopen = () => {
      // Start ping heartbeat every 20s to keep connection alive across mobile NAT/Wi-Fi
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: "PING", timestamp: Date.now() }));
          } catch {}
        }
      }, 20000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "SYNC_STATE") {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setPublicState(msg.public);
          setPrivateState(msg.private);
          setConnectionStatus("CONNECTED");
          setConnectionError(null);

          // If victim received instant death notification
          if (msg.private?.status === "DEAD_UNDISCOVERED") {
            setShowDeathModal(true);
          }
        } else if (msg.type === "PONG") {
          // Pong received, latency tracking can be used if needed
        } else if (msg.type === "ERROR") {
          setConnectionStatus("ERROR");
          setConnectionError(msg.message || "Erro retornado pela central de investigação.");
        } else if (msg.type === "DEATH_SCREEN") {
          sound.playEliminationSound();
          setShowDeathModal(true);
        } else if (msg.type === "CHALLENGE_DATA") {
          setActiveChallenge(msg.challenge);
        } else if (msg.type === "EVIDENCE_UNLOCKED") {
          sound.playEvidenceChime();
        }
      } catch (err) {
        console.error("[Dissimulo WS Parse Error]:", err);
      }
    };

    ws.onerror = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setConnectionStatus("ERROR");
      if (cfg.isProductionWithoutBackend) {
        setConnectionError("Ambiente de produção (Vercel) detectado sem backend multiplayer configurado. Configure a URL do backend nas opções abaixo.");
      } else {
        setConnectionError(
          `Não foi possível alcançar o servidor do caso em ${cfg.resolvedWsUrl}. Verifique se o servidor backend está em execução na porta 4000 ou configure o IP correto do anfitrião.`
        );
      }
    };

    ws.onclose = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      // If we hadn't received sync yet, treat as an initial connection failure
      if (connectionStatus === "CONNECTING") {
        setConnectionStatus("ERROR");
        setConnectionError(`A conexão com o servidor (${cfg.resolvedWsUrl}) foi encerrada antes da sincronização.`);
      }
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      ws.close();
    };
  }, [joined, roomCode, playerId, playerName, retryTrigger]);

  // Dispatch Action
  const sendAction = (action: ClientAction) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(action));
    }
  };

  const toggleSound = () => {
    sound.isSoundEnabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // 1. WELCOME / JOIN SCREEN (NOIR HERO WITH MANOR ATMOSPHERE)
  if (!joined) {
    return (
      <>
        <WelcomeScreen
          initialRoomCode={roomCode}
          initialPlayerName={playerName}
          onJoin={(code, name) => {
            setRoomCode(code);
            setPlayerName(name);
            setJoined(true);
          }}
          onOpenRules={() => setShowOnboarding(true)}
          onOpenServerConfig={() => setShowServerConfig(true)}
        />
        {showOnboarding && <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />}
        <ServerConfigModal
          isOpen={showServerConfig}
          onClose={() => setShowServerConfig(false)}
          onServerChanged={handleRetry}
        />
      </>
    );
  }

  // 2. ERROR STATE (NEVER SHOW AN EMPTY BLACK SCREEN)
  if (connectionStatus === "ERROR") {
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex flex-col items-center justify-center p-6 text-center select-none max-w-sm mx-auto animate-fade-in-dramatic">
        <DissimuloLogo size="sm" subtitle={false} />

        <div className="my-6 p-6 rounded-2xl bg-[#171411] border-2 border-[#9F3D3D] shadow-noir-crimson space-y-4 w-full text-left">
          <div className="w-12 h-12 rounded-full bg-[#2A1114] border border-[#9F3D3D] flex items-center justify-center text-[#F1A8A4] mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1 text-center">
            <span className="stamp-confidential text-[9px]">COMUNICADO DE FALHA</span>
            <h2 className="text-base font-serif font-bold text-[#F2EDE4] leading-snug">
              FALHA NA CONEXÃO COM A MANSÃO
            </h2>
            <p className="text-xs font-sans text-[#C2B7AA] leading-relaxed pt-1">
              {connectionError || "O servidor da partida não está acessível no momento. Verifique sua conexão e tente novamente."}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleRetry}
              className="w-full py-3.5 noir-btn-primary rounded-xl font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-[#F1A8A4]" />
              <span>Tentar Novamente</span>
            </button>

            <button
              onClick={() => setShowServerConfig(true)}
              className="w-full py-3 bg-[#221D19] hover:bg-[#2A2420] text-[#B79A70] border border-[#4A3A32] rounded-xl font-serif font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Server className="w-4 h-4 text-[#B79A70]" />
              <span>Configurar Servidor</span>
            </button>

            <button
              onClick={handleBackToWelcome}
              className="w-full py-2.5 noir-btn-secondary rounded-xl font-serif font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#C2B7AA]" />
              <span>Voltar ao Início</span>
            </button>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#8C8074] uppercase tracking-widest">
          SALA: {roomCode} // PROTOCOLO DE RECUPERAÇÃO
        </span>

        <ServerConfigModal
          isOpen={showServerConfig}
          onClose={() => setShowServerConfig(false)}
          onServerChanged={handleRetry}
        />
      </div>
    );
  }

  // 3. CONNECTING STATE (STYLIZED NOIR CRIMINAL LOADING SCREEN)
  if (connectionStatus === "CONNECTING" || !publicState || !privateState) {
    const currentCfg = resolveServerConfig();
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex flex-col items-center justify-center p-6 text-center space-y-6 select-none max-w-sm mx-auto animate-fade-in-dramatic">
        <DissimuloLogo size="md" subtitle={false} />

        <div className="w-12 h-12 border-2 border-[#B79A70] border-t-transparent rounded-full animate-spin shadow-noir-brass" />

        <div className="space-y-1.5">
          <span className="stamp-confidential text-[9px]">SESSÃO EM ANDAMENTO</span>
          <h2 className="text-xl font-serif font-bold text-[#F2EDE4] tracking-widest uppercase">
            CONECTANDO AO CASO
          </h2>
          <p className="text-xs font-serif italic text-[#C2B7AA]">
            "Preparando sua investigação..."
          </p>
        </div>

        <div className="p-3 bg-[#171411] rounded-xl border border-[#4A3A32] text-[11px] font-mono text-[#8C8074] w-full space-y-1">
          <div>
            <span>CASO: </span>
            <strong className="text-[#B79A70] font-bold">{roomCode}</strong>
            <span className="mx-2">•</span>
            <span>INVESTIGADOR: </span>
            <strong className="text-[#F2EDE4] font-medium">{playerName}</strong>
          </div>
          <div className="text-[10px] text-[#8C8074] truncate">
            Alvo: {currentCfg.resolvedWsUrl}
          </div>
        </div>

        <button
          onClick={handleBackToWelcome}
          className="text-xs font-mono text-[#C2B7AA] hover:text-[#F2EDE4] underline opacity-80 pt-2"
        >
          Cancelar e voltar
        </button>
      </div>
    );
  }

  // 4. LOBBY PHASE
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

  // 5. RESULTS PHASE
  if (publicState.phase === "RESULTS") {
    return (
      <ResultsScreen
        publicState={publicState}
        privateState={privateState}
        onRestart={() => sendAction({ type: "HOST_RESTART" })}
      />
    );
  }

  const me = (publicState.players || []).find((p) => p.id === privateState.playerId);
  const isHost = me?.isHost || false;

  return (
    <div className="min-h-screen bg-[#0C0B0A] flex flex-col justify-between max-w-md mx-auto pt-safe pb-safe select-none">
      {/* TOP EDITORIAL HUD BAR */}
      <header className="px-4 py-2.5 border-b border-[#4A3A32] bg-[#14110E]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <DissimuloLogo size="sm" subtitle={false} />
          <span className="text-[9px] font-mono text-[#B79A70] bg-[#221D19] px-2 py-0.5 rounded border border-[#4A3A32] font-bold">
            CASO: {roomCode}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="p-2 text-[#C2B7AA] hover:text-[#F2EDE4] rounded-xl active:scale-95 bg-[#221D19] border border-[#4A3A32]"
            title="Alternar Áudio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#B79A70]" /> : <VolumeX className="w-4 h-4 text-[#9F3D3D]" />}
          </button>

          {isHost && (
            <button
              onClick={() => {
                sound.playTap();
                setShowHostPanel(true);
              }}
              className="p-2 text-[#C2B7AA] hover:text-[#B79A70] rounded-xl active:scale-95 bg-[#221D19] border border-[#4A3A32]"
              title="Painel do Anfitrião"
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

      {/* 4-TAB EDITORIAL NOIR BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#14110E]/98 backdrop-blur-md border-t border-[#4A3A32] z-40 max-w-md mx-auto shadow-2xl">
        <div className="grid grid-cols-4 h-16 items-center">
          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("HOME");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all ${
              currentTab === "HOME"
                ? "text-[#B79A70] font-bold"
                : "text-[#C2B7AA] hover:text-[#F2EDE4]"
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
                ? "text-[#B79A70] font-bold"
                : "text-[#C2B7AA] hover:text-[#F2EDE4]"
            }`}
          >
            <FileCheck2 className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wider">Missões</span>
            {(privateState.missions || []).filter((m) => m.status === "AVAILABLE").length > 0 && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-[#9F3D3D] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentTab("EXPLORE");
            }}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all ${
              currentTab === "EXPLORE"
                ? "text-[#B79A70] font-bold"
                : "text-[#C2B7AA] hover:text-[#F2EDE4]"
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
                ? "text-[#B79A70] font-bold"
                : "text-[#C2B7AA] hover:text-[#F2EDE4]"
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
