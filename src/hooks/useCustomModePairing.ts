import { useMemo } from "react";
import type { Player } from "../types";

interface UsePairingResult {
  targetPlayer: Player | null;
  pendingPlayers: Player[];
  hasAssigned: boolean;
}

export function useCustomModePairing(
  players: Player[],
  pairings: { [playerId: string]: string } | undefined,
  playerId: string | null,
  assignedPlayerIds: Set<string>
): UsePairingResult {
  const result = useMemo(() => {
    if (!playerId || !pairings || players.length === 0) {
      return {
        targetPlayer: null,
        pendingPlayers: players.filter((p) => !assignedPlayerIds.has(p.id)),
        hasAssigned: playerId ? assignedPlayerIds.has(playerId) : false,
      };
    }

    const targetPlayerId = pairings[playerId];
    const targetPlayer = players.find((p) => p.id === targetPlayerId) || null;

    const pendingPlayers = players.filter(
      (p) => !assignedPlayerIds.has(p.id) && p.id !== playerId
    );

    return {
      targetPlayer,
      pendingPlayers,
      hasAssigned: assignedPlayerIds.has(playerId),
    };
  }, [players, pairings, playerId, assignedPlayerIds]);

  return result;
}
