import { User } from "lucide-react";
import type { Player } from "../../types";

interface PlayerCardProps {
  player: Player & { assignment?: string };
  isCurrentPlayer?: boolean;
  showAssignment?: boolean;
}

export function PlayerCard({
  player,
  isCurrentPlayer = false,
  showAssignment = false,
}: PlayerCardProps) {
  return (
    <div
      className={`rounded-lg p-4 transition-all duration-200 transform hover:scale-105 ${
        isCurrentPlayer
          ? "bg-[#1a1e2e] border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          : "bg-[#1a1e2e] border border-[#2d3748] hover:border-[#3d4758]"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 ${
            isCurrentPlayer
              ? "border-blue-500 bg-blue-500/10"
              : "border-purple-400 bg-transparent"
          }`}
        >
          <User
            size={24}
            className={isCurrentPlayer ? "text-blue-400" : "text-purple-400"}
          />
        </div>

        <p
          className={`text-sm md:text-base font-bold ${
            isCurrentPlayer ? "text-blue-300" : "text-gray-200"
          } mb-2`}
        >
          {player.name}
        </p>

        {showAssignment && player.assignment && (
          <div
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              isCurrentPlayer
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                : "bg-purple-900/40 text-purple-300"
            }`}
          >
            {player.assignment}
          </div>
        )}
      </div>
    </div>
  );
}
