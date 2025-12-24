import { useNavigate } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";
import { SquarePlus, Users, Zap, Radio } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout speed={0.3} direction="diagonal">
      <Header />
      <Container>
        <div className="flex flex-col items-center justify-center py-4 px-4 min-h-[calc(100vh-80px)]">
          <div className="text-center mb-8 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-4 text-white">
              Quem sou eu?
            </h1>
            <p className="text-sm md:text-xl text-gray-300 leading-relaxed">
              Um jogo multijogador em tempo real onde você descobre qual
              personagem você é. Pronto para o desafio?
            </p>
          </div>

          <div className="w-full max-w-md space-y-3 mb-8">
            <button
              onClick={() => navigate("/create")}
              className="w-full group relative overflow-hidden rounded-lg p-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-bold text-white">
                    Criar Sala
                  </h3>
                  <p className="text-xs md:text-sm text-blue-100">
                    Inicie uma nova partida
                  </p>
                </div>
                <SquarePlus size={24} className="text-white flex-shrink-0" />
              </div>
            </button>

            <button
              onClick={() => navigate("/join")}
              className="w-full group relative overflow-hidden rounded-lg p-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-bold text-white">
                    Entrar em Sala
                  </h3>
                  <p className="text-xs md:text-sm text-purple-100">
                    Junte-se a seus amigos
                  </p>
                </div>
                <Users size={24} className="text-white flex-shrink-0" />
              </div>
            </button>
          </div>

          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#1a1e2e]/40 p-4 text-center">
              <Zap size={20} className="text-blue-400 mx-auto mb-2" />
              <p className="text-xs md:text-sm text-gray-300 font-medium">
                Rápido
              </p>
              <p className="text-xs text-gray-500">Comece em segundos</p>
            </div>

            <div className="rounded-lg bg-[#1a1e2e]/40 p-4 text-center">
              <Radio size={20} className="text-purple-400 mx-auto mb-2" />
              <p className="text-xs md:text-sm text-gray-300 font-medium">
                Ao Vivo
              </p>
              <p className="text-xs text-gray-500">Em tempo real</p>
            </div>
          </div>
        </div>
      </Container>
    </BackgroundLayout>
  );
}
