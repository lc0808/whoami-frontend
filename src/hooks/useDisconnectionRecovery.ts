import { useEffect, useRef, useState } from "react";
import { useSocket } from "./useSocket";
import { useRoomContext } from "../contexts/RoomContext";
import { usePlayerContext } from "../contexts/PlayerContext";
import { gameSession } from "../utils/sessionStorage";
import { socketService } from "../services/socket.service";
import { logger } from "../utils/logger";
import { toast } from "sonner";

interface DisconnectionState {
  isDisconnected: boolean;
  attemptCount: number;
  nextRetryIn: number;
  isRecovering: boolean;
}

export function useDisconnectionRecovery() {
  const { socket } = useSocket();
  const { room } = useRoomContext();
  const { playerId } = usePlayerContext();
  const [disconnectionState, setDisconnectionState] = useState<DisconnectionState>({
    isDisconnected: false,
    attemptCount: 0,
    nextRetryIn: 0,
    isRecovering: false,
  });

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasConnectedRef = useRef(false);

  const getBackoffDelay = (attemptCount: number): number => {
    const baseDelay = 2000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, attemptCount), maxDelay);
    const jitter = delay * 0.2 * (Math.random() - 0.5);
    return Math.round(delay + jitter);
  };

  const attemptRecovery = async () => {
    if (!socket || !playerId) {
      logger.warn("❌ Cannot recover: missing socket or playerId");
      return;
    }

    const session = gameSession.restore();
    if (!session) {
      logger.warn("❌ Cannot recover: no session found");
      setDisconnectionState((s) => ({
        ...s,
        isRecovering: false,
      }));
      return;
    }

    setDisconnectionState((s) => ({
      ...s,
      isRecovering: true,
    }));

    logger.info(`🔄 Attempting recovery #${disconnectionState.attemptCount + 1}`);

    try {
      const recoveryPromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 10000);

        socketService.rejoinRoom(socket, session.roomId, playerId);

        const handleRoomUpdate = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        socket.once("room-updated", handleRoomUpdate);

        setTimeout(() => {
          socket.off("room-updated", handleRoomUpdate);
        }, 10000);
      });

      const recovered = await recoveryPromise;

      if (recovered) {
        logger.info("✅ Recovery successful!");
        toast.success("Reconectado com sucesso");
        setDisconnectionState({
          isDisconnected: false,
          attemptCount: 0,
          nextRetryIn: 0,
          isRecovering: false,
        });
      } else {
        throw new Error("Recovery timeout");
      }
    } catch (error) {
      logger.warn(`❌ Recovery failed:`, error);

      const nextAttempt = disconnectionState.attemptCount + 1;
      const nextDelay = getBackoffDelay(nextAttempt);

      setDisconnectionState((s) => ({
        ...s,
        attemptCount: nextAttempt,
        nextRetryIn: Math.round(nextDelay / 1000),
        isRecovering: false,
      }));

      if (nextAttempt >= 5) {
        toast.error(
          "Falha persistente na reconexão. Tente recarregar a página."
        );
      } else {
        toast.warning(
          `Reconexão falhou. Tentando novamente em ${Math.round(
            nextDelay / 1000
          )}s...`
        );
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        attemptRecovery();
      }, nextDelay);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleDisconnect = (reason: string) => {
      wasConnectedRef.current = false;
      logger.error(`❌ Socket disconnected: ${reason}`);

      if (room) {
        gameSession.updateRoom(room);
      }

      setDisconnectionState({
        isDisconnected: true,
        attemptCount: 0,
        nextRetryIn: getBackoffDelay(0) / 1000,
        isRecovering: false,
      });

      if (reason === "io client disconnect") {
        logger.info("ℹ️ Intentional disconnect");
      } else {
        toast.error("Conexão perdida. Tentando reconectar...");
        const delay = getBackoffDelay(0);
        reconnectTimeoutRef.current = setTimeout(() => {
          attemptRecovery();
        }, delay);
      }
    };

    const handleConnect = () => {
      wasConnectedRef.current = true;
      logger.info("✅ Socket connected/reconnected");

      if (disconnectionState.isDisconnected) {
        logger.info("🔄 Socket reconectado, iniciando recovery...");
        attemptRecovery();
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };

    const handleConnectError = (error: any) => {
      logger.error("🔴 Socket connect error:", error?.message || error);
    };

    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [socket, room, disconnectionState.isDisconnected]);

  useEffect(() => {
    if (disconnectionState.nextRetryIn > 0 && !disconnectionState.isRecovering) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = setInterval(() => {
        setDisconnectionState((s) => ({
          ...s,
          nextRetryIn: Math.max(0, s.nextRetryIn - 1),
        }));
      }, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [disconnectionState.nextRetryIn, disconnectionState.isRecovering]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return {
    ...disconnectionState,
    attemptRecoveryManually: attemptRecovery,
  };
}
