import { useEffect, useRef } from "react";
import { useSocket } from "./useSocket";
import { logger } from "../utils/logger";

interface HeartbeatConfig {
  enabled?: boolean;
  interval?: number; // em ms
  timeout?: number; // em ms
}

export function useSocketHeartbeat(config?: HeartbeatConfig) {
  const { socket, isConnected } = useSocket();
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const heartbeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastHeartbeatRef = useRef<number>(Date.now());
  const missedHeartbeatsRef = useRef(0);

  const { enabled = true, interval = 15000, timeout = 5000 } = config || {};

  useEffect(() => {
    if (!socket || !isConnected || !enabled) {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      return;
    }

    const sendHeartbeat = () => {
      lastHeartbeatRef.current = Date.now();

      socket.emit("ping", () => {
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }
        missedHeartbeatsRef.current = 0;
        logger.debug("💗 Heartbeat OK");
      });

      heartbeatTimeoutRef.current = setTimeout(() => {
        missedHeartbeatsRef.current += 1;
        logger.warn(
          `⚠️  Heartbeat timeout #${missedHeartbeatsRef.current} - server may be unresponsive`
        );

        if (missedHeartbeatsRef.current >= 3) {
          logger.error(
            "❌ Server unresponsive after 3 heartbeats, forcing reconnection"
          );
          socket.disconnect();
          setTimeout(() => {
            socket.connect();
          }, 1000);
        }
      }, timeout);
    };

    const initialTimeout = setTimeout(sendHeartbeat, 5000);

    heartbeatIntervalRef.current = setInterval(sendHeartbeat, interval);

    return () => {
      clearTimeout(initialTimeout);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
    };
  }, [socket, isConnected, enabled, interval, timeout]);

  return {
    lastHeartbeat: lastHeartbeatRef.current,
    missedHeartbeats: missedHeartbeatsRef.current,
    isHealthy: missedHeartbeatsRef.current < 3,
  };
}
