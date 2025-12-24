import type { Player } from './Player';

export type GameState = 'waiting' | 'assigning' | 'playing' | 'finished';
export type GameMode = 'preset' | 'custom';
export type PresetCategory = 'animals' | 'celebrities' | 'foods' | 'movies' | 'countries';

export interface Assignment {
  targetPlayerId: string;
  item: string;
  assignedBy?: string;
}

export interface Room {
  id: string;
  ownerId: string;
  players: Player[];
  gameState: GameState;
  gameMode: GameMode;
  presetCategory?: PresetCategory;
  assignments: Record<string, Assignment>;
  currentRound: number;
}
