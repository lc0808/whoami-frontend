import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useSocket } from "../hooks/useSocket";
import { useToast } from "../hooks/useToast";
import { gameSession } from "../utils/sessionStorage";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";
import { isValidPlayerName, isValidRoomId } from "../utils/validators";
import { LogIn, Lock, User, Info } from "lucide-react";
import { logger } from "../utils/logger";

const errorMessageMap: Record<string, string> = {
  "Room not found": "Sala não encontrada",
  "Game already started": "O jogo já foi iniciado nesta sala",
  "Invalid room code format": "Código da sala inválido",
  "Invalid player name": "Nome do jogador inválido",
  "Player not found in room": "Jogador não encontrado na sala",
  "Failed to join room": "Erro ao entrar na sala",
};

export function JoinRoom() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { joinRoom, room } = useRoom();
  const { setPlayerData } = usePlayerContext();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl && isValidRoomId(codeFromUrl)) {
      setRoomId(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (room && room.players.length > 0) {
      const player = room.players.find((p) => p.name === playerName);
      if (player) {
        setPlayerData(player.id, player.name);
        gameSession.save({
          roomId: room.id,
          playerId: player.id,
          playerName: player.name,
        });
        toast.success("Entrou na sala com sucesso!");
        navigate(`/lobby/${room.id}`);
        setIsLoading(false);
      }
    }
  }, [room, playerName, setPlayerData, navigate, toast]);

  useEffect(() => {
    if (!socket) return;

    const handleError = (message: string) => {
      logger.error("❌ Socket error:", message);
      const translatedError = errorMessageMap[message] || message;
      toast.error(translatedError);
      setIsLoading(false);
    };

    socket.on("error", handleError);
    return () => {
      socket.off("error", handleError);
    };
  }, [socket, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPlayerName(playerName)) {
      toast.error("Nome deve ter entre 2 e 20 caracteres");
      return;
    }

    if (!isValidRoomId(roomId)) {
      toast.error("Código da sala deve ter 6 caracteres alfanuméricos");
      return;
    }

    setIsLoading(true);
    joinRoom(roomId.toUpperCase(), playerName);
  };

  return (
    <BackgroundLayout speed={0.3} direction="diagonal">
      <Header />
      <Container>
        <div className="flex items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-3">
                <LogIn size={28} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Entrar em Sala
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">
                Junte-se ao jogo de seus amigos
              </p>
            </div>

            <Card className="w-full shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2d3748]">
                    <Lock size={16} className="text-purple-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-300">
                      Código da Sala
                    </span>
                  </div>
                  <Input
                    label="Código"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC123"
                    required
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Peça o código ao criador da sala
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2d3748]">
                    <User size={16} className="text-purple-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-300">
                      Seu Nome
                    </span>
                  </div>
                  <Input
                    label="Nome do Jogador"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-2.5 md:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Entrando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <LogIn size={18} />
                        Entrar na Sala
                      </span>
                    )}
                  </Button>
                </div>

                <div className="pt-3 border-t border-[#2d3748]">
                  <div className="flex items-start gap-2">
                    <Info
                      size={14}
                      className="text-blue-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-500">
                      Certifique-se de que o código está correto e que a sala
                      ainda está ativa
                    </p>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </BackgroundLayout>
  );
}
