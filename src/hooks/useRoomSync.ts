import { useEffect, useRef } from "react";
import { useRoomContext } from "../contexts/RoomContext";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useSocket } from "./useSocket";
import { gameSession } from "../utils/sessionStorage";
import { logger } from "../utils/logger";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useRoomSync() {
  const { room, setRoom } = useRoomContext();
  const { playerId } = usePlayerContext();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncRef = useRef<number>(0);
  const syncInProgressRef = useRef(false);

  useEffect(() => {
    if (!socket || !room || !playerId) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    const isActiveGameState =
      room.gameState === "assigning" ||
      room.gameState === "playing" ||
      room.gameState === "finished";

    if (!isActiveGameState) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    const performSync = () => {
      const now = Date.now();
      if (now - lastSyncRef.current < 5000) return;
      if (syncInProgressRef.current) return;

      syncInProgressRef.current = true;
      lastSyncRef.current = now;

      socket.emit("sync-room", room.id, (response: any) => {
        syncInProgressRef.current = false;

        if (!response.isSynced) {
          logger.warn(
            `❌ Room sync failed: ${response.error} — clearing session`
          );

          gameSession.clear();
          setRoom(null);
          toast.error("Sua sessão expirou. Retornando ao início...");
          navigate("/");
          return;
        }

        logger.info(`✅ Room sync OK: player ${playerId} in ${room.id}`);
      });
    };

    const initialTimeout = setTimeout(performSync, 2000);

    syncIntervalRef.current = setInterval(performSync, 8000);

    return () => {
      clearTimeout(initialTimeout);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      syncInProgressRef.current = false;
    };
  }, [socket, room, playerId, setRoom, navigate]);

  return {};
}
