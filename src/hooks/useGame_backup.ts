import { useEffect, useMemo } from 'react';
import { useSocket } from './useSocket';
import { useRoomContext } from '../contexts/RoomContext';
import type { PlayerView, GameState } from '../types';

export function useGame() {
  const { socket } = useSocket();
  const { playerView, setPlayerView } = useRoomContext();

  useEffect(() => {
    if (!socket) return;

    const onGameStarted = (view: PlayerView) => {
      setPlayerView(view);
    };

    const onRoundEnded = (room: { gameState?: GameState }) => {
      if (playerView) {
        setPlayerView({ ...playerView, gameState: room.gameState ?? 'finished' });
      }
    };

    socket.on('game-started', onGameStarted);
    socket.on('round-ended', onRoundEnded);

    return () => {
      socket.off('game-started', onGameStarted);
      socket.off('round-ended', onRoundEnded);
    };
  }, [socket, setPlayerView]);

  const assignCharacter = (roomId: string, targetPlayerId: string, character: string) => {
    if (!socket) return;
    socket.emit('assign-character', roomId, targetPlayerId, character);
  };

  const isGameActive = useMemo(() => playerView?.gameState === 'playing', [playerView?.gameState]);

  return {
    playerView,
    isGameActive,
    assignCharacter,
  };
}
