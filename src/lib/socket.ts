import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token: string, eventId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      autoConnect: false,
      auth: { token },
      query: { eventId },
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
