import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import socket from "../lib/socket";
import { logger } from "../utils/logger";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      logger.info("✅ Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      logger.warn("❌ Socket disconnected");
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      logger.error("Socket error:", error?.message || error);
    };

    const handleConnectError = (err: any) => {
      logger.error("Socket connect_error:", err?.message || err);
    };

    const handleReconnectAttempt = (attempt: number) => {
      logger.warn(`Socket reconnect attempt #${attempt}`);
    };

    if (!socket.connected) {
      try {
        socket.connect();
      } catch (e) {
        logger.warn("Socket connect attempt threw:", e);
      }
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketContext must be used within SocketProvider");
  return context;
}
