import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from 'lib/socket';
import { SOCKET_EVENTS } from 'constants/socketEvents';

export const useOnlineUsers = (eventId?: string, token?: string) => {
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (!eventId || !token) return;

    const socket = getSocket(token, eventId);
    socket.connect();
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.ONLINE_USERS, (users: { entityId: number }[]) => {
      setOnlineUserIds(users.map((u) => u.entityId));
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, token]);

  return onlineUserIds;
};
