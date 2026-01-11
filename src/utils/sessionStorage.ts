import { logger } from "./logger";
import type { Room, PlayerView } from "../types";

interface GameSession {
  roomId: string;
  playerId: string;
  playerName: string;
  timestamp?: number;
  roomData?: Room;
  playerViewData?: PlayerView;
  gameState?: string;
  isGameActive?: boolean;
}

const SESSION_KEY = "whoami:game-session";
const SESSION_HEARTBEAT_KEY = "whoami:session-heartbeat";

export const gameSession = {
  save(data: GameSession) {
    try {
      const sessionData: GameSession = {
        ...data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      sessionStorage.setItem(SESSION_HEARTBEAT_KEY, String(Date.now()));
      logger.info("💾 Session saved:", {
        roomId: data.roomId,
        playerId: data.playerId,
        gameState: data.gameState,
      });
    } catch (e) {
      logger.warn("Failed to save session:", e);
    }
  },

  restore(): GameSession | null {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored) as GameSession;

      const sessionAge = Date.now() - (session.timestamp || 0);
      const MAX_SESSION_AGE = 30 * 60 * 1000;

      if (sessionAge > MAX_SESSION_AGE) {
        logger.warn("⏰ Sessão expirada por inatividade");
        this.clear();
        return null;
      }

      logger.info("♻️  Session restored:", {
        roomId: session.roomId,
        playerId: session.playerId,
        age: Math.round(sessionAge / 1000) + "s",
      });
      return session;
    } catch (e) {
      logger.warn("Failed to restore session:", e);
      return null;
    }
  },

  updateRoom(room: Room) {
    const session = this.restore();
    if (session) {
      this.save({
        ...session,
        roomData: room,
        gameState: room.gameState,
        isGameActive:
          room.gameState === "playing" || room.gameState === "assigning",
      });
    }
  },

  updatePlayerView(playerView: PlayerView) {
    const session = this.restore();
    if (session) {
      this.save({ ...session, playerViewData: playerView });
    }
  },

  getFullSession(): GameSession | null {
    return this.restore();
  },

  isActive(): boolean {
    const session = this.restore();
    if (!session) return false;
    const age = Date.now() - (session.timestamp || 0);
    return age < 30 * 60 * 1000;
  },

  getLastHeartbeat(): number | null {
    try {
      const heartbeat = sessionStorage.getItem(SESSION_HEARTBEAT_KEY);
      return heartbeat ? parseInt(heartbeat, 10) : null;
    } catch (e) {
      return null;
    }
  },

  isGameActive(): boolean {
    const session = this.restore();
    return session?.isGameActive === true;
  },

  clear() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_HEARTBEAT_KEY);
      logger.info("🗑️  Session cleared");
    } catch (e) {
      logger.warn("Failed to clear session:", e);
    }
  },
};
