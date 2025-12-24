import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { AlertCircle, LogOut } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative bg-gradient-to-br from-[#1a1e2e] to-[#252d3d] rounded-xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md w-full px-6 py-8 md:px-8 md:py-10 animate-fadeIn border border-[#3d4758]"
      >
        <div className="flex justify-center mb-5 md:mb-6">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
              isDangerous
                ? "bg-gradient-to-br from-red-600/30 to-red-500/20 border border-red-500/50"
                : "bg-gradient-to-br from-cyan-600/30 to-blue-500/20 border border-cyan-500/50"
            }`}
          >
            {isDangerous ? (
              <AlertCircle size={32} className="md:size-10 text-red-400" />
            ) : (
              <LogOut size={32} className="md:size-10 text-cyan-400" />
            )}
          </div>
        </div>

        <h2
          id="confirm-dialog-title"
          className={`text-xl md:text-2xl font-bold mb-3 text-center ${
            isDangerous ? "text-red-200" : "text-cyan-100"
          }`}
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-message"
          className="text-gray-300 text-center mb-8 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
        >
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            className="flex-1 text-sm md:text-base py-3 md:py-3.5"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            className="flex-1 text-sm md:text-base py-3 md:py-3.5"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
