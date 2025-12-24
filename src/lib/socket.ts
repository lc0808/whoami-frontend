import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

const socketUrl = SOCKET_URL || `http://${window.location.hostname}:3000`;

export const socket: Socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  forceNew: false,
  withCredentials: true,
  timeout: 10000,
  autoConnect: false,
});

export default socket;
