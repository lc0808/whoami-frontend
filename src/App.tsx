import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SocketProvider } from './contexts/SocketContext';
import { RoomProvider } from './contexts/RoomContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SocketProvider>
          <PlayerProvider>
            <RoomProvider>
              <AppRoutes />
              <Toaster 
                position="top-right"
                richColors
                theme="dark"
                expand
                closeButton
              />
            </RoomProvider>
          </PlayerProvider>
        </SocketProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
