import { useSocket } from "../../hooks/useSocket";
import { Button } from "./Button";
import { AlertCircle, WifiOff } from "lucide-react";
import { useDisconnectionRecovery } from "../../hooks/useDisconnectionRecovery";
import { useSocketHeartbeat } from "../../hooks/useSocketHeartbeat";

export function ConnectionStatus() {
  const { isConnected } = useSocket();
  const { isDisconnected, isRecovering, nextRetryIn, attemptRecoveryManually } =
    useDisconnectionRecovery();
  const { isHealthy } = useSocketHeartbeat({
    enabled: isConnected,
    interval: 15000,
    timeout: 5000,
  });

  if (isConnected && isHealthy && !isDisconnected) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 max-w-sm animate-in fade-in slide-in-from-bottom-3 z-50"
      role="status"
      aria-label="Connection status"
    >
      <div className="bg-white dark:bg-slate-900 border rounded-lg shadow-lg p-4">
        {isDisconnected ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Desconectado
                </p>
                {isRecovering && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Tentando reconectar...
                  </p>
                )}
                {!isRecovering && nextRetryIn > 0 && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Próxima tentativa em {nextRetryIn}s
                  </p>
                )}
              </div>
            </div>

            {!isRecovering && (
              <Button
                size="sm"
                variant="secondary"
                onClick={attemptRecoveryManually}
                className="w-full text-xs"
              >
                Reconectar Agora
              </Button>
            )}
          </div>
        ) : !isHealthy ? (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Conexão Instável
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Servidor não está respondendo. Tentando reconectar...
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
