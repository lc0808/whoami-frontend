import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useGame } from "../hooks/useGame";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useRoomProtection } from "../hooks/useRoomProtection";
import { useRoomAccessGuard } from "../hooks/useRoomAccessGuard";
import { useRoomSync } from "../hooks/useRoomSync";
import { useCustomModePairing } from "../hooks/useCustomModePairing";
import { GameBoard } from "../components/game/GameBoard";
import { CharacterAssignment } from "../components/game/CharacterAssignment";
import { Button } from "../components/ui/Button";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";
import { Card } from "../components/ui/Card";
import { GameStartCountdown } from "../components/ui/GameStartCountdown";
import { Play, LogOut, Check, Zap } from "lucide-react";
import { logger } from "../utils/logger";

export function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, leaveRoom, startNewRound, endRound } = useRoom();
  const { playerView, assignCharacter } = useGame();
  const { playerId } = usePlayerContext();
  const { safeNavigate } = useRoomProtection();
  const { hasAccess } = useRoomAccessGuard({
    requiredGameState: ["assigning", "playing", "finished"],
  });
  const navigate = useNavigate();
  const [isEndingRound, setIsEndingRound] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const countdownShownRef = useRef(false);

  useRoomSync();

  const assignedPlayerIds = useMemo(() => {
    if (!room?.assignments) return new Set<string>();
    return new Set(
      Object.values(room.assignments).map((a) => a.assignedBy || "")
    );
  }, [room?.assignments]);

  const { targetPlayer, hasAssigned } = useCustomModePairing(
    room?.players || [],
    playerView?.pairings,
    playerId,
    assignedPlayerIds
  );

  const currentPlayer = room?.players.find((p) => p.id === playerId);
  const isOwner = currentPlayer?.isOwner || false;

  const isLoading = !room || (!playerView && room?.gameState === "waiting");

  useEffect(() => {
    if (room?.gameState === "waiting") {
      navigate(`/lobby/${roomId}`);
    }
  }, [room?.gameState, roomId, navigate]);

  useEffect(() => {
    if (room?.gameState === "playing" && !countdownShownRef.current) {
      setShowCountdown(true);
      countdownShownRef.current = true;
    }
  }, [room?.gameState]);

  const handleLeave = () => {
    if (roomId) {
      leaveRoom(roomId);
      safeNavigate("/");
    }
  };

  const handleEndRound = () => {
    if (!roomId || isEndingRound) return;

    setIsEndingRound(true);
    endRound(roomId, (response) => {
      setIsEndingRound(false);
      if (response.error) {
        logger.error("Erro ao encerrar round:", response.error);
      }
    });
  };

  if (!hasAccess) {
    return (
      <BackgroundLayout speed={0.3} direction="diagonal">
        <Header />
        <Container>
          <div className="flex items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-300">
                Acesso inválido. Redirecionando...
              </p>
            </div>
          </div>
        </Container>
      </BackgroundLayout>
    );
  }

  if (isLoading) {
    return (
      <BackgroundLayout speed={0.3} direction="diagonal">
        <Header />
        <Container>
          <div className="flex items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-300">Carregando jogo...</p>
            </div>
          </div>
        </Container>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout speed={0.3} direction="diagonal">
      <Header />
      <Container>
        <GameStartCountdown
          isOpen={showCountdown}
          onCountdownComplete={() => setShowCountdown(false)}
          startCount={3}
        />
        <div className="py-4 px-4 min-h-[calc(100vh-80px)]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Round {room.currentRound}
              </h2>
            </div>
            {!isOwner && (
              <div className="hidden md:flex gap-4">
                <Button
                  variant="danger"
                  onClick={handleLeave}
                  className="text-xs md:text-sm py-2.5 md:py-3"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut size={16} />
                    Sair
                  </span>
                </Button>
              </div>
            )}
          </div>

          {room.gameMode === "custom" && room.gameState === "assigning" && (
            <>
              <Card className="mb-6 bg-blue-900/20 border border-blue-700/50">
                <div className="flex items-start gap-3">
                  <Zap size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-200 mb-1">
                      Modo Customizado
                    </p>
                    <p className="text-xs text-blue-300 mb-2">
                      Cada jogador atribui um personagem para outro jogador
                      específico.
                    </p>
                    <p className="text-xs text-blue-300">
                      <strong>Progresso:</strong>{" "}
                      {Object.values(room.assignments)?.length || 0}/
                      {room.players.length}
                    </p>
                  </div>
                </div>
              </Card>

              {hasAssigned ? (
                <Card className="bg-green-900/20 border border-green-700/50 mb-6">
                  <div className="text-center py-6 md:py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-3">
                      <Check size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-green-200 mb-2">
                      Concluído!
                    </h3>
                    <p className="text-xs md:text-sm text-green-300">
                      Aguarde os demais jogadores...
                    </p>
                  </div>
                </Card>
              ) : targetPlayer ? (
                <div className="mb-6">
                  <CharacterAssignment
                    targetPlayer={targetPlayer}
                    onAssign={(_, character) => {
                      if (roomId && targetPlayer?.id) {
                        assignCharacter(roomId, targetPlayer.id, character);
                      }
                    }}
                  />
                </div>
              ) : (
                <Card className="bg-blue-900/20 border border-blue-700/50 mb-6">
                  <div className="text-center py-8">
                    <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
                    <p className="text-blue-200 text-sm md:text-base">
                      Gerando pareamentos...
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}

          {room.gameState === "playing" &&
            (playerView ? (
              <>
                <GameBoard playerView={playerView} currentPlayerId={playerId} />

                <div
                  className={`mt-6 flex flex-col ${
                    !isOwner ? "md:hidden" : "sm:flex-row"
                  } gap-3 sm:gap-4 ${
                    !isOwner && isOwner ? "sm:justify-center" : ""
                  }`}
                >
                  {isOwner && (
                    <Button
                      variant="secondary"
                      onClick={handleEndRound}
                      disabled={isEndingRound}
                      className="flex-1 text-xs md:text-sm py-2.5 md:py-3"
                    >
                      {isEndingRound ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Encerrando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Check size={16} />
                          Encerrar Round
                        </span>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={handleLeave}
                    className={`${
                      isOwner ? "flex-1" : "w-full"
                    } text-xs md:text-sm py-2.5 md:py-3`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LogOut size={16} />
                      Sair
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <Card className="bg-blue-900/20 border border-blue-700/50">
                <div className="text-center py-8">
                  <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
                  <p className="text-blue-200 text-sm md:text-base">
                    Carregando estado do jogo...
                  </p>
                </div>
              </Card>
            ))}

          {room.gameState === "finished" && (
            <Card className="bg-gradient-to-r from-cyan-900/25 to-blue-900/25 border border-cyan-700/50">
              <div className="text-center py-6 md:py-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-cyan-300">
                  Round Finalizado!
                </h3>
                {isOwner ? (
                  <>
                    <p className="text-xs md:text-sm text-gray-400 mb-6">
                      Todos os pontos foram contabilizados. Pronto para a
                      próxima rodada?
                    </p>
                    <Button
                      onClick={() => {
                        if (roomId) startNewRound(roomId);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Play size={18} />
                        Novo Round
                      </span>
                    </Button>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-gray-300">
                    Aguardando o dono da sala iniciar o próximo round...
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </Container>
    </BackgroundLayout>
  );
}
