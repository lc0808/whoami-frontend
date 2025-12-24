import { logger } from "./logger";

interface GameSession {
  roomId: string;
  playerId: string;
  playerName: string;
}

const SESSION_KEY = "whoami:game-session";

export const gameSession = {
  save(data: GameSession) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
      logger.info("💾 Session saved:", data);
    } catch (e) {
      logger.warn("Failed to save session:", e);
    }
  },

  restore(): GameSession | null {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored) as GameSession;
      logger.info("♻️  Session restored:", session);
      return session;
    } catch (e) {
      logger.warn("Failed to restore session:", e);
      return null;
    }
  },

  clear() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      logger.info("🗑️  Session cleared");
    } catch (e) {
      logger.warn("Failed to clear session:", e);
    }
  },

  isActive(): boolean {
    return this.restore() !== null;
  },
};
