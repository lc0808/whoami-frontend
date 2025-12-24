import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";
import { usePlayerContext } from "../contexts/PlayerContext";
import { toast } from "sonner";
import { logger } from "../utils/logger";

interface UseRoomAccessGuardOptions {
  requiredGameState?: string | string[];
}

export function useRoomAccessGuard(options?: UseRoomAccessGuardOptions) {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { room } = useRoomContext();
  const { playerId } = usePlayerContext();
  const [hasAccess, setHasAccess] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!playerId) {
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        logger.warn("❌ Acesso negado: Nenhum playerId disponível");
        toast.error("Sessão expirada. Redirecionando para início...");
        setTimeout(() => navigate("/"), 500);
      }
      setHasAccess(false);
      return;
    }

    if (!room) {
      logger.debug("⏳ Aguardando carregamento da sala...");
      setHasAccess(true);
      return;
    }

    if (room.id !== roomId) {
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        logger.warn(
          `❌ Acesso negado: roomId inválido (${roomId} !== ${room.id})`
        );
        toast.error("Sala não encontrada. Redirecionando...");
        setTimeout(() => navigate("/"), 500);
      }
      setHasAccess(false);
      return;
    }

    const playerInRoom = room.players.some((p) => p.id === playerId);
    if (!playerInRoom) {
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        logger.warn(`❌ Acesso negado: Jogador ${playerId} não está na sala`);
        toast.error("Você não está nesta sala. Redirecionando...");
        setTimeout(() => navigate("/"), 500);
      }
      setHasAccess(false);
      return;
    }

    if (options?.requiredGameState) {
      const requiredStates = Array.isArray(options.requiredGameState)
        ? options.requiredGameState
        : [options.requiredGameState];

      if (!requiredStates.includes(room.gameState)) {
        logger.debug(
          `⚠️  Estado do jogo não permitido: ${
            room.gameState
          } (esperado: ${requiredStates.join(", ")})`
        );
        setHasAccess(true);
        return;
      }
    }

    logger.debug("✅ Acesso validado");
    setHasAccess(true);
  }, [playerId, room, roomId, navigate, options?.requiredGameState]);

  return { hasAccess };
}
