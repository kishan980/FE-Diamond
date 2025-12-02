'use client';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { OnlineStatusIndicator, StyledListItemButton } from './ChatRoom.styled';
import UserAvatar from './UserAvatar';
import { LostBiddersData } from 'services/event/event-action/auction-room/type';
import { UserListItemProps, UserListProps } from 'types/chat';
import { StyledEllipsisText } from 'views/common.styled';
import Dot from 'components/@extended/Dot';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import { ChatMessageAPI, ChatUpdatedPayload } from 'services/bidder/auction-room/type';
import { filterUsers } from 'utils/filterUsers';
import { SOCKET_EVENTS } from 'constants/socketEvents';
import { useOnlineUsers } from 'hooks/useOnlineUsers';
import { getSocket } from 'lib/socket';

const UserListItem = memo(function UserListItem({
  eventId,
  user,
  selectedUser,
  socket,
  setLostedBiddersData,
  onlineUserIds,
  chatHistory,
  setChatHistories,
  updateUnreadCount,
}: UserListItemProps<LostBiddersData>) {
  const unreadCount = useMemo(
    () => chatHistory.filter((msg) => !msg.isRead && msg.senderID === user.refBuyerID_EntityMas).length,
    [chatHistory, user.refBuyerID_EntityMas]
  );
  const isSelected = user.refBuyerID_EntityMas?.toString() === selectedUser;
  const isOnline = onlineUserIds.includes(user.refBuyerID_EntityMas);

  const handleClick = useCallback(() => {
    setLostedBiddersData(user);

    socket?.emit(SOCKET_EVENTS.SET_READ_MESSAGE, {
      eventId,
      bidderId: user.refBuyerID_EntityMas,
      type: 1,
    });

    setChatHistories?.((prev) => ({
      ...prev,
      [user.refBuyerID_EntityMas]: (prev[user.refBuyerID_EntityMas] || []).map((msg) => ({
        ...msg,
        isRead: true,
      })),
    }));
  }, [eventId, setChatHistories, setLostedBiddersData, socket, user]);

  useEffect(() => {
    updateUnreadCount(user.refBuyerID_EntityMas, unreadCount);
  }, [chatHistory, unreadCount, user.refBuyerID_EntityMas, updateUnreadCount]);

  return (
    <StyledListItemButton onClick={handleClick} selected={isSelected}>
      <ListItemAvatar>
        <Box sx={{ position: 'relative', width: 'fit-content' }}>
          <UserAvatar user={user} />
          <OnlineStatusIndicator sx={{ bgcolor: isOnline ? 'green' : 'gray' }} />
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <StyledEllipsisText variant="subtitle1" color="text.primary">
              {user.user_name}
            </StyledEllipsisText>
            {unreadCount > 0 && <Dot />}
          </Stack>
        }
      />
    </StyledListItemButton>
  );
});

const UserList = ({
  eventId,
  selectedUser,
  search,
  setLostedBiddersData,
  selectedLostBidders,
  loading,
  updateUnreadCount,
}: UserListProps<LostBiddersData>) => {
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const token = imageDetails?.token;

  const [chatHistories, setChatHistories] = useState<Record<number, ChatMessageAPI[]>>({});
  const onlineUserIds = useOnlineUsers(eventId.toString(), token);

  const socketRef = useRef<Socket>();

  useEffect(() => {
    const fetchAllChats = async () => {
      if (!eventId) return;
      const allHistories: Record<number, ChatMessageAPI[]> = {};

      for (const user of selectedLostBidders) {
        try {
          const response = await AuctionRoomServices.getChatHistory(eventId, Number(user.refBuyerID_EntityMas), 1);
          if (typeof response !== 'string' && response.success) {
            allHistories[user.refBuyerID_EntityMas] = response.data || [];
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Chat fetch failed for user:', err);
          toast.error('Failed to fetch chat history');
        }
      }

      setChatHistories(allHistories);
    };

    fetchAllChats();
  }, [eventId, selectedLostBidders]);

  const handleChatUpdated = useCallback(
    (data: ChatUpdatedPayload) => {
      const newMsg = data.newMessage?.updatedChat?.[0];
      if (!newMsg?.senderID) return;

      setChatHistories((prev) => {
        const updatedHistory = [...(prev[newMsg?.senderID] || []), newMsg];
        return {
          ...prev,
          [newMsg?.senderID]: updatedHistory,
        };
      });

      if (newMsg?.senderID.toString() === selectedUser) {
        socketRef.current?.emit(SOCKET_EVENTS.SET_READ_MESSAGE, {
          eventId,
          bidderId: Number(selectedUser),
          type: 1,
        });

        setChatHistories((prev) => ({
          ...prev,
          [newMsg?.senderID]: (prev[newMsg.senderID] || []).map((msg) => ({
            ...msg,
            isRead: true,
          })),
        }));
      }
    },
    [eventId, selectedUser]
  );

  useEffect(() => {
    if (!token || !eventId) return;

    const socket = getSocket(token, eventId.toString());
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);
    };
  }, [eventId, handleChatUpdated, token]);

  const filteredData = useMemo(() => filterUsers(selectedLostBidders, search, ['user_name']), [selectedLostBidders, search]);

  if (loading) {
    return (
      <List>
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItem key={index} divider>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton animation="wave" height={24} />}
              secondary={<Skeleton animation="wave" height={16} width="60%" />}
            />
          </ListItem>
        ))}
      </List>
    );
  }

  if (!filteredData.length) {
    return <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No users found.</Box>;
  }

  return (
    <List component="nav">
      {filteredData.map((user) => (
        <Fragment key={user.refBuyerID_EntityMas}>
          <UserListItem
            eventId={eventId}
            user={user}
            selectedUser={selectedUser}
            setLostedBiddersData={setLostedBiddersData}
            socket={socketRef.current}
            onlineUserIds={onlineUserIds}
            chatHistory={chatHistories[user.refBuyerID_EntityMas] || []}
            setChatHistories={setChatHistories}
            updateUnreadCount={updateUnreadCount}
          />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default memo(UserList);
