import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { Room, PlayerView } from "../types";
import { useSocketContext } from "./SocketContext";
import { gameSession } from "../utils/sessionStorage";
import { socketService } from "../services/socket.service";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { logger } from "../utils/logger";

interface RoomContextType {
  room: Room | null;
  setRoom: (room: Room | null) => void;
  playerView: PlayerView | null;
  setPlayerView: (view: PlayerView | null) => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [playerView, setPlayerView] = useState<PlayerView | null>(null);
  const { socket, isConnected } = useSocketContext();
  const navigate = useNavigate();
  const attemptingRejoinRef = useRef(false);

  const normalizeRoom = (incoming: Room): Room => {
    if (!incoming) return incoming;

    const currentRound =
      (incoming as any).currentRound ??
      (incoming as any).roundNumber ??
      incoming.currentRound ??
      1;

    return {
      ...incoming,
      currentRound,
      gameState: incoming.gameState ?? "waiting",
      players: (incoming.players ?? []).map((player) => ({
        ...player,
        isOwner: player.id === incoming.ownerId,
      })),
    };
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    const session = gameSession.restore();
    if (session && !room) {
      logger.info("🔄 Auto-rejoining room:", session.roomId);
      attemptingRejoinRef.current = true;
      socketService.rejoinRoom(socket, session.roomId, session.playerId);
      const fallback = setTimeout(() => {
        if (attemptingRejoinRef.current && !room) {
          logger.warn(
            "⚠️ Rejoin timed out — clearing session and returning to home"
          );
          gameSession.clear();
          setRoom(null);
          setPlayerView(null);
          attemptingRejoinRef.current = false;
          navigate("/");
        }
      }, 12000);
      return () => clearTimeout(fallback);
    }
  }, [socket, isConnected, room]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (newRoom: Room) => {
      const normalized = normalizeRoom(newRoom);
      setRoom(normalized);
      const session = gameSession.restore();
      if (session) {
        gameSession.save({ ...session, roomId: normalized.id });
      }
      gameSession.updateRoom(normalized);
    };

    const handleRoomUpdated = (updatedRoom: Room) => {
      const normalized = normalizeRoom(updatedRoom);
      setRoom(normalized);
      gameSession.updateRoom(normalized);
    };

    const handlePlayerJoined = (updatedRoom: Room) => {
      const normalizedRoom = normalizeRoom(updatedRoom);
      setRoom(normalizedRoom);
      gameSession.updateRoom(normalizedRoom);

      const session = gameSession.restore();
      const lastPlayer =
        normalizedRoom.players[normalizedRoom.players.length - 1];
      if (lastPlayer && session?.playerId !== lastPlayer.id) {
        toast.custom(
          () => (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-950/80 to-emerald-950/80 border border-green-700/50 text-green-100 text-sm font-medium">
              <LogIn className="w-5 h-5 flex-shrink-0" />
              <span>{lastPlayer.name} entrou na sala</span>
            </div>
          ),
          {
            duration: 2000,
          }
        );
      }
    };

    const handlePlayerLeft = (updatedRoom: Room) => {
      const session = gameSession.restore();
      const previousRoom = room;

      let leftPlayer = null;
      if (previousRoom) {
        leftPlayer = previousRoom.players.find(
          (p) => !updatedRoom.players.find((np) => np.id === p.id)
        );
      }

      logger.info(
        `👤 Player left: ${leftPlayer?.name || "unknown"}, room state: ${
          updatedRoom.gameState
        }, players: ${updatedRoom.players.length}`
      );

      if (
        session &&
        updatedRoom.players.every((p) => p.id !== session.playerId)
      ) {
        gameSession.clear();
        setRoom(null);
        setPlayerView(null);
      } else {
        const normalizedRoom = normalizeRoom(updatedRoom);
        setRoom(normalizedRoom);
        gameSession.updateRoom(normalizedRoom);

        if (leftPlayer && session?.playerId !== leftPlayer.id) {
          toast.custom(
            () => (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-950/80 to-red-950/80 border border-orange-700/50 text-orange-100 text-sm font-medium">
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>{leftPlayer.name} saiu da sala</span>
              </div>
            ),
            {
              duration: 2000,
            }
          );
        }
      }
    };

    const handleRoundEnded = (updatedRoom: Room) => {
      const normalized = normalizeRoom(updatedRoom);
      setRoom(normalized);
      gameSession.updateRoom(normalized);
      setPlayerView((prev) =>
        prev ? { ...prev, gameState: "finished" } : null
      );
    };

    const handleServerInfo = (data: { message: string; reason?: string }) => {
      logger.info("ℹ️ Server info:", data.message);

      if (
        data.reason === "player-disconnected-during-assignment" ||
        data.reason === "player-left-during-assignment"
      ) {
        toast.custom(
          () => (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-950/80 to-orange-950/80 border border-red-700/50 text-red-100 text-sm font-medium">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>{data.message}</span>
            </div>
          ),
          {
            duration: 3000,
          }
        );
      }
    };

    const handleGameStarted = (view: PlayerView) => {
      logger.info("🎮 Game started event received:", view);
      setPlayerView(view);
      gameSession.updatePlayerView(view);
      setRoom((prevRoom) => {
        if (!prevRoom) return null;

        const updatedPlayers = prevRoom.players.map((player) => {
          const fromView = view.players?.find((p) => p.id === player.id);
          return {
            ...player,
            assignedItem: fromView?.assignedItem ?? player.assignedItem,
            isOwner: player.id === prevRoom.ownerId,
          };
        });

        const updatedRoom = normalizeRoom({
          ...prevRoom,
          gameState: view.gameState ?? prevRoom.gameState,
          currentRound: view.currentRound ?? prevRoom.currentRound,
          players: updatedPlayers,
        });
        gameSession.updateRoom(updatedRoom);
        return updatedRoom;
      });
    };

    const handleError = (message: string) => {
      if (
        attemptingRejoinRef.current &&
        (message === "Player not found in room" || message === "Room not found")
      ) {
        logger.warn("❌ Rejoin failed:", message);
        gameSession.clear();
        setRoom(null);
        setPlayerView(null);
        attemptingRejoinRef.current = false;
        navigate("/");
        return;
      }
    };

    socket.on("room-created", handleRoomCreated);
    socket.on("room-updated", handleRoomUpdated);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);
    socket.on("round-ended", handleRoundEnded);
    socket.on("game-started", handleGameStarted);
    socket.on("info", handleServerInfo);
    socket.on("error", handleError);

    return () => {
      socket.off("room-created", handleRoomCreated);
      socket.off("room-updated", handleRoomUpdated);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
      socket.off("round-ended", handleRoundEnded);
      socket.off("game-started", handleGameStarted);
      socket.off("info", handleServerInfo);
      socket.off("error", handleError);
    };
  }, [socket]);

  return (
    <RoomContext.Provider value={{ room, setRoom, playerView, setPlayerView }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context)
    throw new Error("useRoomContext must be used within RoomProvider");
  return context;
}
