import type { Player } from '../../types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string | null;
  showAssignments?: boolean;
}

export function PlayerList({ players, currentPlayerId, showAssignments }: PlayerListProps) {
  return (
    <div className="space-y-3">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayerId}
          showAssignment={showAssignments}
        />
      ))}
    </div>
  );
}
