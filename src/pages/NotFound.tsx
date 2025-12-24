import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Container } from "../components/layout/Container";
import { Header } from "../components/layout/Header";
import { BackgroundLayout } from "../components/layout/BackgroundLayout";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout speed={0.3} direction="diagonal">
      <Header />
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-100 mb-4">404</h1>
            <p className="text-xl text-gray-400 mb-8">Página não encontrada</p>
            <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
          </div>
        </div>
      </Container>
    </BackgroundLayout>
  );
}
