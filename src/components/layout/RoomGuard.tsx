import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRoomContext } from "../../contexts/RoomContext";
import { gameSession } from "../../utils/sessionStorage";

interface RoomGuardProps {
  children: React.ReactNode;
}

export function RoomGuard({ children }: RoomGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { room } = useRoomContext();

  useEffect(() => {
    const activeSession = gameSession.restore();
    const hasActiveRoom = room !== null || activeSession !== null;

    const entryRoutes = ["/", "/create", "/join"];
    const isEntryRoute = entryRoutes.includes(location.pathname);

    if (hasActiveRoom && isEntryRoute) {
      console.log(
        "🛡️  Proteção: Jogador em sala ativa tentou acessar rota de entrada, redirecionando..."
      );

      if (activeSession) {
        navigate(`/game/${activeSession.roomId}`, { replace: true });
      } else if (room) {
        navigate(`/game/${room.id}`, { replace: true });
      }
    }
  }, [room, location.pathname, navigate]);

  return <>{children}</>;
}
