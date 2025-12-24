import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "../ui/Button";

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateLink = () => {
    const joinLink = `${window.location.origin}/join?code=${code}`;
    navigator.clipboard.writeText(joinLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="contents">
      <Button
        onClick={handleCopy}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
      >
        {copied ? (
          <>
            <Check size={14} className="sm:w-5 sm:h-5" />
            <span>Copiado!</span>
          </>
        ) : (
          <>
            <Copy size={14} className="sm:w-5 sm:h-5" />
            <span>Copiar Código</span>
          </>
        )}
      </Button>

      <Button
        onClick={handleGenerateLink}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
      >
        {linkCopied ? (
          <>
            <Check size={14} className="sm:w-5 sm:h-5" />
            <span>Link Copiado!</span>
          </>
        ) : (
          <>
            <Share2 size={14} className="sm:w-5 sm:h-5" />
            <span>Gerar Link</span>
          </>
        )}
      </Button>
    </div>
  );
}
