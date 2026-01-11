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
  const failedSyncCountRef = useRef(0);
  const toastShownRef = useRef(false);

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

        if (!response?.isSynced) {
          failedSyncCountRef.current++;
          const errorMsg = response?.error || "Unknown error";
          
          logger.warn(
            `❌ Room sync failed (#${failedSyncCountRef.current}): ${errorMsg}`
          );

          if (failedSyncCountRef.current >= 3) {
            logger.error("❌ Session expired - sync failed multiple times");
            gameSession.clear();
            setRoom(null);
            
            if (!toastShownRef.current) {
              toastShownRef.current = true;
              toast.error("Sua sessão expirou. Retornando ao início...");
              setTimeout(() => navigate("/"), 1500);
            }
          } else {
            toast.warning("Falha na sincronização da sala. Tentando novamente...");
          }
          return;
        }

        failedSyncCountRef.current = 0;
        logger.debug(`✅ Room sync OK: player ${playerId} in ${room.id}`);
      });

      setTimeout(() => {
        if (syncInProgressRef.current) {
          syncInProgressRef.current = false;
          logger.warn("⚠️ Sync timeout - server not responding");
          failedSyncCountRef.current++;
        }
      }, 8000);
    };

    const initialTimeout = setTimeout(performSync, 3000);

    syncIntervalRef.current = setInterval(performSync, 10000);

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
