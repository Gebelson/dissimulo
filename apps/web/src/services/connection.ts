/**
 * Centralized Connection and Backend Configuration Service
 * Handles WebSocket URL resolution across Localhost, LAN (Wi-Fi), and Production (HTTPS/WSS).
 */

export interface ServerConfig {
  customUrl: string | null;
  resolvedWsUrl: string;
  resolvedHttpUrl: string;
  source: "CUSTOM" | "ENV" | "LOCAL_DEV" | "LAN_DEV" | "PRODUCTION";
  isProductionWithoutBackend: boolean;
  isValid: boolean;
}

export interface HealthCheckResult {
  healthy: boolean;
  latencyMs?: number;
  details?: any;
  error?: string;
}

const STORAGE_KEY = "dissimulo_server_url";

export function getCustomServerUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setCustomServerUrl(url: string | null): void {
  if (typeof window === "undefined") return;
  if (!url || url.trim() === "") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, url.trim());
  }
}

/**
 * Normalizes any user-entered string into WS and HTTP base URLs.
 */
export function normalizeServerAddress(raw: string): { wsBase: string; httpBase: string } {
  let clean = raw.trim();
  // Strip trailing slashes and query strings
  clean = clean.split("?")[0].replace(/\/+$/, "");

  let isSecure = clean.startsWith("https://") || clean.startsWith("wss://");
  let hostAndPort = clean.replace(/^(http|ws)s?:\/\//, "");

  // If host contains /ws, strip it for base
  if (hostAndPort.endsWith("/ws")) {
    hostAndPort = hostAndPort.slice(0, -3);
  }

  const wsProto = isSecure ? "wss:" : "ws:";
  const httpProto = isSecure ? "https:" : "http:";

  return {
    wsBase: `${wsProto}//${hostAndPort}`,
    httpBase: `${httpProto}//${hostAndPort}`,
  };
}

/**
 * Resolves current server configuration based on priority hierarchy:
 * 1. User-configured custom server (localStorage)
 * 2. Environment variable VITE_WS_URL or VITE_SERVER_URL
 * 3. Localhost or Local Network (LAN Wi-Fi)
 * 4. Production HTTPS
 */
export function resolveServerConfig(): ServerConfig {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const { wsBase, httpBase } = normalizeServerAddress(custom);
      return {
        customUrl: custom,
        resolvedWsUrl: wsBase,
        resolvedHttpUrl: httpBase,
        source: "CUSTOM",
        isProductionWithoutBackend: false,
        isValid: true,
      };
    } catch {
      // Fall through if custom is malformed
    }
  }

  const envWs = (import.meta as any).env?.VITE_WS_URL;
  const envServer = (import.meta as any).env?.VITE_SERVER_URL;
  if (envWs || envServer) {
    const raw = envWs || envServer;
    const { wsBase, httpBase } = normalizeServerAddress(raw);
    return {
      customUrl: null,
      resolvedWsUrl: wsBase,
      resolvedHttpUrl: httpBase,
      source: "ENV",
      isProductionWithoutBackend: false,
      isValid: true,
    };
  }

  if (typeof window === "undefined") {
    return {
      customUrl: null,
      resolvedWsUrl: "ws://localhost:4000",
      resolvedHttpUrl: "http://localhost:4000",
      source: "LOCAL_DEV",
      isProductionWithoutBackend: false,
      isValid: true,
    };
  }

  const isHttps = window.location.protocol === "https:";
  const hostname = window.location.hostname || "localhost";
  const port = window.location.port;

  // Production check: running on Vercel or public HTTPS without backend env var configured
  const isVercel = hostname.endsWith("vercel.app") || hostname.includes("now.sh");
  if (isHttps && isVercel) {
    return {
      customUrl: null,
      resolvedWsUrl: `wss://${window.location.host}/ws`,
      resolvedHttpUrl: `https://${window.location.host}`,
      source: "PRODUCTION",
      isProductionWithoutBackend: true,
      isValid: false,
    };
  }

  // Production with custom domain behind proxy
  if (isHttps && !port) {
    return {
      customUrl: null,
      resolvedWsUrl: `wss://${window.location.host}/ws`,
      resolvedHttpUrl: `https://${window.location.host}`,
      source: "PRODUCTION",
      isProductionWithoutBackend: false,
      isValid: true,
    };
  }

  // Local development or LAN Wi-Fi
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const targetBackendPort = "4000";

  return {
    customUrl: null,
    // Connect directly to the game server port 4000 on the host machine
    resolvedWsUrl: `ws://${hostname}:${targetBackendPort}`,
    resolvedHttpUrl: `http://${hostname}:${targetBackendPort}`,
    source: isLocalhost ? "LOCAL_DEV" : "LAN_DEV",
    isProductionWithoutBackend: false,
    isValid: true,
  };
}

/**
 * Builds the full WebSocket connection URL for a player and room.
 */
export function buildWebSocketUrl(
  roomCode: string,
  playerId: string,
  playerName: string,
  avatar = "avatar_1"
): string {
  const config = resolveServerConfig();
  const sep = config.resolvedWsUrl.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    roomCode: roomCode.trim().toUpperCase(),
    playerId: playerId.trim(),
    name: playerName.trim(),
    avatar,
  });

  return `${config.resolvedWsUrl}${sep}${params.toString()}`;
}

/**
 * Checks connectivity to the backend via HTTP /health.
 */
export async function checkServerHealth(targetHttpUrl?: string): Promise<HealthCheckResult> {
  const url = targetHttpUrl || resolveServerConfig().resolvedHttpUrl;
  const healthEndpoint = `${url.replace(/\/+$/, "")}/health`;

  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(healthEndpoint, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json();
      return { healthy: true, latencyMs, details: data };
    }
    return { healthy: false, latencyMs, error: `HTTP ${res.status}: ${res.statusText}` };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);
    return {
      healthy: false,
      latencyMs,
      error: err.name === "AbortError" ? "Tempo limite esgotado (4s)" : (err.message || "Servidor inacessível"),
    };
  }
}
