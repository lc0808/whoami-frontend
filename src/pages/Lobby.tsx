import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useRoomProtection } from "../hooks/useRoomProtection";
import { useRoomAccessGuard } from "../hooks/useRoomAccessGuard";
import { Button } from "../components/ui/Button";
import { RoomCode } from "../components/game/RoomCode";
import { Card } from "../components/ui/Card";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";
import { MIN_PLAYERS } from "../utils/constants";
import { Users, User, Play, AlertCircle, Crown, LogOut } from "lucide-react";

export function Lobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, startGame, leaveRoom } = useRoom();
  const { playerId } = usePlayerContext();
  const { safeNavigate } = useRoomProtection();
  const { hasAccess } = useRoomAccessGuard({
    requiredGameState: "waiting",
  });
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const currentPlayer = room?.players.find((p) => p.id === playerId);
  const isOwner = currentPlayer?.isOwner || false;
  const canStartGame = isOwner && room && room.players.length >= MIN_PLAYERS;

  useEffect(() => {
    setIsStarting(false);
  }, [room?.gameState]);

  useEffect(() => {
    if (room?.gameState === "assigning" || room?.gameState === "playing") {
      navigate(`/game/${roomId}`);
    }
  }, [room?.gameState, roomId, navigate]);

  const handleStartGame = () => {
    if (!canStartGame || !roomId || isStarting) return;

    setIsStarting(true);
    startGame(roomId);
  };

  const handleLeave = () => {
    if (roomId) {
      leaveRoom(roomId);
      safeNavigate("/");
    }
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

  if (!room) {
    return (
      <BackgroundLayout speed={0.3} direction="diagonal">
        <Header />
        <Container>
          <div className="flex items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-300">Carregando sala...</p>
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
        <div className="py-4 px-4 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-3">
                <Users size={32} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Sala de Espera
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">
                Aguardando todos os jogadores
              </p>
            </div>

            <Card className="mb-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/20">
              <div className="space-y-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mb-3">
                    Código da Sala
                  </p>
                  <p className="text-4xl md:text-5xl font-mono font-bold text-cyan-400 tracking-widest drop-shadow-lg">
                    {room.id}
                  </p>
                </div>

                {isOwner && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-medium">
                    <Crown size={14} />
                    Você é o Dono
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <RoomCode code={room.id} />
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#2d3748]">
                  <Users size={18} className="text-cyan-400" />
                  <span className="text-sm md:text-base font-bold text-white">
                    Jogadores ({room.players.length}/{Math.max(MIN_PLAYERS, 10)}
                    )
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {room.players.map((player) => (
                    <div
                      key={player.id}
                      className={`rounded-lg p-3 transition-all duration-200 transform hover:scale-105 ${
                        player.id === playerId
                          ? "bg-[#1a1e2e] border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-[#1a1e2e] border border-[#2d3748] hover:border-[#3d4758]"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            player.id === playerId
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-purple-400 bg-transparent"
                          }`}
                        >
                          <User
                            size={20}
                            className={
                              player.id === playerId
                                ? "text-blue-400"
                                : "text-purple-400"
                            }
                          />
                        </div>

                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <p
                            className={`text-xs md:text-sm font-bold truncate ${
                              player.id === playerId
                                ? "text-blue-300"
                                : "text-gray-200"
                            }`}
                          >
                            {player.name}
                          </p>
                          {player.isOwner && (
                            <Crown
                              size={12}
                              className="text-yellow-400 flex-shrink-0"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {room.players.length < MIN_PLAYERS && (
              <Card className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50">
                    <AlertCircle size={20} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-amber-100 mb-0.5">
                      Aguardando Jogadores
                    </p>
                    <p className="text-xs text-amber-200/80">
                      {MIN_PLAYERS - room.players.length} jogador
                      {MIN_PLAYERS - room.players.length !== 1 ? "es" : ""}{" "}
                      faltando
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {!isOwner && (
              <Card className="mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                    <Play size={20} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-cyan-100 mb-0.5">
                      Aguardando Início
                    </p>
                    <p className="text-xs text-cyan-200/80">
                      O dono iniciará quando estiver pronto
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div
              className={`flex flex-col gap-3 ${
                isOwner ? "md:flex-row" : "md:items-center md:justify-center"
              }`}
            >
              {isOwner && (
                <Button
                  onClick={handleStartGame}
                  disabled={!canStartGame || isStarting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-2.5 md:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                >
                  {isStarting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Iniciando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Play size={18} />
                      Iniciar Jogo
                    </span>
                  )}
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleLeave}
                className={`${
                  isOwner ? "flex-1" : "md:w-auto w-full"
                } py-2.5 md:py-3 rounded-lg text-sm md:text-base`}
              >
                <span className="flex items-center justify-center gap-2">
                  <LogOut size={18} />
                  Sair da Sala
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </BackgroundLayout>
  );
}
