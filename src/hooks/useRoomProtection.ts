import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";
import { gameSession } from "../utils/sessionStorage";
import { logger } from "../utils/logger";

export function useRoomProtection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams<{ roomId: string }>();
  const { room } = useRoomContext();

  useEffect(() => {
    if (!location.pathname.startsWith("/game")) return;

    if (!room && !gameSession.isActive()) return;

    if (room && !location.pathname.startsWith(`/game/${roomId}`)) {
      logger.info("🛡️  User tried to leave game, redirecting back");
      navigate(`/game/${roomId}`, { replace: true });
    }
  }, [location.pathname, room, roomId, navigate]);

  const safeNavigate = (path: string) => {
    gameSession.clear();
    navigate(path);
  };

  return { safeNavigate };
}
