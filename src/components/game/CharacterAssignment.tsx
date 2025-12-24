import { useState } from "react";
import type { Player } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { isValidCharacter } from "../../utils/validators";
import { User, Lightbulb } from "lucide-react";

interface CharacterAssignmentProps {
  targetPlayer: Player;
  onAssign: (targetPlayerId: string, character: string) => void;
}

export function CharacterAssignment({
  targetPlayer,
  onAssign,
}: CharacterAssignmentProps) {
  const [character, setCharacter] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    if (!isValidCharacter(character)) {
      setError("Personagem inválido (2-50 caracteres)");
      return;
    }

    onAssign(targetPlayer.id, character);
    setCharacter("");
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-500 shadow-lg shadow-blue-500/20 bg-[#1a1e2e]">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full border-2 border-blue-500 bg-blue-500/10">
            <User size={24} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-gray-400 mb-1">
              Atribua um personagem para
            </p>
            <p className="text-sm md:text-base font-bold text-blue-300 truncate">
              {targetPlayer.name}
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#1a1e2e] border border-[#2d3748] hover:border-[#3d4758] transition-colors">
        <div className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-300 mb-2">
              Qual personagem ele é?
            </label>
            <Input
              value={character}
              onChange={(e) => {
                setCharacter(e.target.value);
                setError("");
              }}
              placeholder="Ex: Einstein, Pikachu, Batman..."
              error={error}
              className="text-sm md:text-base"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-2.5 md:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm md:text-base"
      >
        <span className="flex items-center justify-center gap-2">
          <Lightbulb size={18} />
          Confirmar Atribuição
        </span>
      </Button>
    </div>
  );
}
