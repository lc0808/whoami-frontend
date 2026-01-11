import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

const socketUrl = SOCKET_URL || `http://${window.location.hostname}:3000`;

export const socket: Socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 15000,
  reconnectionAttempts: 999,
  randomizationFactor: 0.5,
  forceNew: false,
  withCredentials: true,
  timeout: 20000,
  autoConnect: false,
  upgrade: true,
  rememberUpgrade: true,
  multiplex: true,
});

export default socket;
