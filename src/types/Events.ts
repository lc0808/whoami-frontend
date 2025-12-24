import type { Room, GameState } from "./Room";

export type PlayerView = {
  roomId: string;
  gameState: GameState;
  currentRound: number;
  pairings?: { [playerId: string]: string };
  players: Array<{
    id: string;
    name: string;
    isOwner: boolean;
    assignedItem?: string;
  }>;
};

export interface ClientToServerEvents {
  "create-room": (
    playerName: string,
    gameMode: "preset" | "custom",
    presetCategory?: string
  ) => void;
  "join-room": (roomId: string, playerName: string) => void;
  "leave-room": (roomId: string) => void;
  "start-game": (roomId: string) => void;
  "assign-character": (
    roomId: string,
    targetPlayerId: string,
    character: string
  ) => void;
  "start-new-round": (roomId: string) => void;
}

export interface ServerToClientEvents {
  "room-created": (room: Room) => void;
  "room-updated": (room: Room) => void;
  "player-joined": (room: Room) => void;
  "player-left": (room: Room) => void;
  "game-started": (playerView: PlayerView) => void;
  "round-ended": (room: Room) => void;
  error: (message: string) => void;
}
