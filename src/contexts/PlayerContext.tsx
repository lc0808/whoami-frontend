import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { gameSession } from "../utils/sessionStorage";

interface PlayerContextType {
  playerId: string | null;
  playerName: string | null;
  setPlayerData: (id: string, name: string) => void;
  clearPlayerData: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const session = gameSession.restore();
    if (session) {
      setPlayerId(session.playerId);
      setPlayerName(session.playerName);
    }
  }, []);

  const setPlayerData = (id: string, name: string) => {
    setPlayerId(id);
    setPlayerName(name);
    const session = gameSession.restore();
    gameSession.save({
      playerId: id,
      playerName: name,
      roomId: session?.roomId || "",
    });
  };

  const clearPlayerData = () => {
    setPlayerId(null);
    setPlayerName(null);
    gameSession.clear();
  };

  return (
    <PlayerContext.Provider
      value={{ playerId, playerName, setPlayerData, clearPlayerData }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayerContext must be used within PlayerProvider");
  return context;
}
