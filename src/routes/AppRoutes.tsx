import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { CreateRoom } from "../pages/CreateRoom";
import { JoinRoom } from "../pages/JoinRoom";
import { Lobby } from "../pages/Lobby";
import { Game } from "../pages/Game";
import { NotFound } from "../pages/NotFound";
import { RoomGuard } from "../components/layout/RoomGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RoomGuard>
            <Home />
          </RoomGuard>
        }
      />
      <Route
        path="/create"
        element={
          <RoomGuard>
            <CreateRoom />
          </RoomGuard>
        }
      />
      <Route
        path="/join"
        element={
          <RoomGuard>
            <JoinRoom />
          </RoomGuard>
        }
      />

      <Route path="/lobby/:roomId" element={<Lobby />} />
      <Route path="/game/:roomId" element={<Game />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}
