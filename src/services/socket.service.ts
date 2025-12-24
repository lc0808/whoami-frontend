import { Socket } from "socket.io-client";
import type { GameMode, PresetCategory } from "../types";

export const socketService = {
  createRoom: (
    socket: Socket,
    playerName: string,
    gameMode: GameMode,
    presetCategory?: PresetCategory
  ) => {
    socket.emit("create-room", playerName, gameMode, presetCategory);
  },

  joinRoom: (socket: Socket, roomId: string, playerName: string) => {
    socket.emit("join-room", roomId, playerName);
  },

  rejoinRoom: (socket: Socket, roomId: string, playerId: string) => {
    socket.emit("rejoin-room", { roomId, playerId });
  },

  leaveRoom: (socket: Socket, roomId: string) => {
    socket.emit("leave-room", roomId);
  },

  startGame: (socket: Socket, roomId: string) => {
    socket.emit("start-game", roomId);
  },

  assignCharacter: (
    socket: Socket,
    roomId: string,
    targetPlayerId: string,
    character: string
  ) => {
    socket.emit("assign-character", roomId, targetPlayerId, character);
  },

  endRound: (
    socket: Socket,
    roomId: string,
    callback?: (response: { success?: boolean; error?: string }) => void
  ) => {
    socket.emit("end-round", { roomId }, callback || (() => {}));
  },

  startNewRound: (socket: Socket, roomId: string) => {
    socket.emit("start-new-round", roomId);
  },
};
