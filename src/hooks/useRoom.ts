import { useRoomContext } from '../contexts/RoomContext';
import { useSocket } from './useSocket';
import { socketService } from '../services/socket.service';
import type { GameMode, PresetCategory } from '../types';

export function useRoom() {
  const { room, setRoom } = useRoomContext();
  const { socket } = useSocket();

  const createRoom = (playerName: string, gameMode: GameMode, presetCategory?: PresetCategory) => {
    socketService.createRoom(socket, playerName, gameMode, presetCategory);
  };

  const joinRoom = (roomId: string, playerName: string) => {
    socketService.joinRoom(socket, roomId, playerName);
  };

  const leaveRoom = (roomId: string) => {
    socketService.leaveRoom(socket, roomId);
    setRoom(null);
  };

  const startGame = (roomId: string) => {
    socketService.startGame(socket, roomId);
  };

  const endRound = (roomId: string, callback?: (response: { success?: boolean; error?: string }) => void) => {
    socketService.endRound(socket, roomId, callback);
  };

  const startNewRound = (roomId: string) => {
    socketService.startNewRound(socket, roomId);
  };

  return {
    room,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    endRound,
    startNewRound,
  };
}
