import type { PlayerView } from "../../types";
import { PlayerCard } from "./PlayerCard";
import { Card } from "../ui/Card";
import { Users } from "lucide-react";

interface GameBoardProps {
  playerView: PlayerView;
  currentPlayerId?: string | null;
}

export function GameBoard({ playerView, currentPlayerId }: GameBoardProps) {
  const otherPlayers = currentPlayerId
    ? playerView.players.filter((p) => p.id !== currentPlayerId)
    : playerView.players;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d3748]">
          <Users size={20} className="text-cyan-400" />
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Outros Jogadores
          </h3>
          <span className="ml-auto text-sm text-gray-400">
            Round {playerView.currentRound}
          </span>
        </div>
        <p className="text-sm md:text-base text-gray-400 mb-6">
          Descubra qual é o seu personagem observando os outros!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {otherPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={{
                ...player,
                assignment: player.assignedItem,
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
