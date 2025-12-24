import { useNavigate, useLocation } from "react-router-dom";
import { useRoomContext } from "../../contexts/RoomContext";
import { useRoom } from "../../hooks/useRoom";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
import { gameSession } from "../../utils/sessionStorage";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Button } from "../ui/Button";
import Shuffle from "../ui/Shuffle";
import { Container } from "./Container";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { room } = useRoomContext();
  const { leaveRoom } = useRoom();
  const { isOpen, options, open, close, confirm } = useConfirmDialog();

  const isHome = location.pathname === "/";

  const handleHomeClick = async () => {
    if (room && !isHome) {
      const confirmed = await open({
        title: "⚠️  Sair da Sala?",
        message:
          "Você está em uma sala ativa.\n\n" +
          'Use o botão "Sair" na sala para sair corretamente.\n\n' +
          "Tem certeza que deseja sair sem confirmar na sala?",
        confirmText: "Sair Mesmo Assim",
        cancelText: "Voltar à Sala",
        isDangerous: true,
      });

      if (!confirmed) return;

      leaveRoom(room.id);
      gameSession.clear();
    }

    navigate("/");
  };

  return (
    <>
      <header className="bg-gradient-to-r from-[#010409]/60 to-[#1a1e2e]/40 border-b border-[#2d3748]/30 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between h-14 md:h-16 px-2 md:px-0">
            <div
              onClick={handleHomeClick}
              title={
                room
                  ? "⚠️  Clique para sair da sala"
                  : "Clique para ir ao início"
              }
              className="cursor-pointer flex-1"
            >
              <Shuffle
                text="Quem sou eu?"
                tag="h1"
                className="text-lg md:text-2xl lg:text-3xl font-bold text-white hover:text-gray-200 transition-colors truncate"
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={false}
                triggerOnHover={true}
                respectReducedMotion={true}
              />
            </div>
            {!isHome && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleHomeClick}
                className="ml-2 md:ml-4 text-xs md:text-sm whitespace-nowrap"
              >
                Voltar
              </Button>
            )}
          </div>
        </Container>
      </header>

      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        isDangerous={options.isDangerous}
        onConfirm={confirm}
        onCancel={close}
      />
    </>
  );
}
