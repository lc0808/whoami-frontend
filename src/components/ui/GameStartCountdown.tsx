import { useEffect, useState } from "react";
import { Play } from "lucide-react";

interface GameStartCountdownProps {
  isOpen: boolean;
  onCountdownComplete?: () => void;
  startCount?: number;
}

export function GameStartCountdown({
  isOpen,
  onCountdownComplete,
  startCount = 3,
}: GameStartCountdownProps) {
  const [count, setCount] = useState<number | null>(startCount);

  useEffect(() => {
    if (!isOpen) {
      setCount(startCount);
      return;
    }

    if (count === null || count === 0) {
      onCountdownComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, count, startCount, onCountdownComplete]);

  if (!isOpen || count === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="status"
        aria-live="polite"
        aria-label="Contagem regressiva de início do jogo"
        className="relative flex flex-col items-center justify-center"
      >
        <div className="mb-6 md:mb-8 animate-pulse">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-green-600/30 to-emerald-500/20 border-2 border-green-500/50">
            <Play
              size={48}
              className="md:size-20 text-green-400 fill-green-400"
            />
          </div>
        </div>

        <p className="text-lg md:text-2xl font-bold text-white mb-6 text-center">
          O jogo vai começar em
        </p>

        <div className="mb-8">
          <div
            className={`text-8xl md:text-9xl font-bold transition-all duration-500 ${
              count <= 1 ? "text-red-400" : "text-green-400"
            }`}
            style={{
              animation: count > 0 ? "countdownPulse 1s ease-in-out" : "none",
            }}
          >
            {count > 0 ? count : "GO!"}
          </div>
        </div>

        {count > 0 ? (
          <p className="text-gray-300 text-center text-xs md:text-sm">
            Prepare-se para o jogo
          </p>
        ) : (
          <p className="text-green-300 text-center text-xs md:text-sm animate-pulse">
            Que comece o jogo!
          </p>
        )}
      </div>

      <style>{`
        @keyframes countdownPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0.95);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
