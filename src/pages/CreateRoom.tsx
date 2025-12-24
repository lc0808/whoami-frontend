import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useSocket } from "../hooks/useSocket";
import { useToast } from "../hooks/useToast";
import { gameSession } from "../utils/sessionStorage";
import type { GameMode, PresetCategory } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Card } from "../components/ui/Card";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";
import { isValidPlayerName } from "../utils/validators";
import { Gamepad2, User, Settings, Lightbulb } from "lucide-react";
import { logger } from "../utils/logger";

const errorMessageMap: Record<string, string> = {
  "Invalid player name": "Nome do jogador inválido",
  "Failed to create room": "Erro ao criar sala",
  "Conectando ao servidor... aguarde um momento":
    "Conectando ao servidor... aguarde um momento",
};

export function CreateRoom() {
  const [playerName, setPlayerName] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>("preset");
  const [presetCategory, setPresetCategory] =
    useState<PresetCategory>("animals");
  const [isLoading, setIsLoading] = useState(false);
  const { createRoom, room } = useRoom();
  const { setPlayerData } = usePlayerContext();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (room && room.players.length > 0) {
      const player = room.players[0];
      setPlayerData(player.id, player.name);
      gameSession.save({
        roomId: room.id,
        playerId: player.id,
        playerName: player.name,
      });
      toast.success("Sala criada com sucesso!");
      navigate(`/lobby/${room.id}`);
      setIsLoading(false);
    }
  }, [room, setPlayerData, navigate, toast]);

  useEffect(() => {
    if (!socket) return;

    const handleError = (message: string) => {
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

    if (!socket || !isConnected) {
      toast.warning("Conectando ao servidor... aguarde um momento");
      logger.warn(
        "Socket is not connected. Socket:",
        socket,
        "isConnected:",
        isConnected
      );
      return;
    }

    logger.info("Criando sala com:", { playerName, gameMode, presetCategory });
    setIsLoading(true);
    createRoom(
      playerName,
      gameMode,
      gameMode === "preset" ? presetCategory : undefined
    );
  };

  return (
    <BackgroundLayout speed={0.3} direction="diagonal">
      <Header />
      <Container>
        <div className="flex items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3">
                <Gamepad2 size={28} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Criar Nova Sala
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">
                Comece sua aventura multijogador
              </p>
            </div>

            <Card className="w-full shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2d3748]">
                    <User size={16} className="text-blue-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-300">
                      Seus Dados
                    </span>
                  </div>
                  <Input
                    label="Seu Nome"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2d3748]">
                    <Settings size={16} className="text-purple-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-300">
                      Configurações
                    </span>
                  </div>
                  <Select
                    label="Modo de Jogo"
                    value={gameMode}
                    onChange={(e) => setGameMode(e.target.value as GameMode)}
                    disabled={isLoading}
                  >
                    <option value="preset">Preset (itens predefinidos)</option>
                    <option value="custom">
                      Customizado (jogadores escolhem)
                    </option>
                  </Select>

                  {gameMode === "preset" && (
                    <Select
                      label="Categoria"
                      value={presetCategory}
                      onChange={(e) =>
                        setPresetCategory(e.target.value as PresetCategory)
                      }
                      disabled={isLoading}
                    >
                      <option value="animals">Animais</option>
                      <option value="celebrities">Pessoas Famosas</option>
                      <option value="foods">Comidas</option>
                      <option value="movies">Filmes</option>
                      <option value="countries">Países</option>
                    </Select>
                  )}
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 md:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    disabled={isLoading || !isConnected}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Criando...
                      </span>
                    ) : isConnected ? (
                      <span className="flex items-center justify-center gap-2">
                        <Gamepad2 size={18} />
                        Criar Sala
                      </span>
                    ) : (
                      "⏳ Conectando..."
                    )}
                  </Button>
                </div>

                <div className="pt-3 border-t border-[#2d3748]">
                  <div className="flex items-start gap-2">
                    <Lightbulb
                      size={14}
                      className="text-yellow-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-500">
                      Convide seus amigos para jogar com você!
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
