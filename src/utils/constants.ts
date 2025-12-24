export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const MIN_PLAYERS = 2;
export const MAX_PLAYER_NAME_LENGTH = 20;
export const MIN_PLAYER_NAME_LENGTH = 2;
export const MAX_CHARACTER_LENGTH = 50;
export const MIN_CHARACTER_LENGTH = 2;

export const PRESET_CATEGORIES = ['animals', 'celebrities', 'foods', 'movies', 'countries'] as const;
export const GAME_MODES = ['preset', 'custom'] as const;
export const GAME_STATES = ['waiting', 'assigning', 'playing', 'finished'] as const;
