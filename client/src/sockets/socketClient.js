/**
 * Shared Socket.IO client instance.
 * autoConnect is set to false so connections are explicitly managed on-demand
 * only on pages/views that require real-time functionality (e.g., Event/Host rooms).
 */

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (socket.disconnected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
