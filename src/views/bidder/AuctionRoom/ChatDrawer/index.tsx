'use client';
import React, { KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send2, Messages1, ArrowDown2 } from 'iconsax-react';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ChatDaySeparator from './ChatDaySeparator';
import ChatMessageItem from './ChatMessageItem';
import ChatMessageSkeleton from './ChatMessageSkeleton';
import {
  ChatBody,
  ChatContainer,
  ChatHeader,
  ChatInputWrapper,
  FloatingButton,
  FloatingButtonWrapper,
  SendIconButton,
  StyledTextField,
} from './ChatWidget.styled';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { getSocket } from 'lib/socket';
import { ChatWidgetDataProps } from 'types/chat';
import { getDayLabel } from 'utils/format-date';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import { ChatMessageAPI, ChatUpdatedPayload } from 'services/bidder/auction-room/type';
import { ChatWidgetProps } from 'types/bidder';
import { SOCKET_EVENTS } from 'constants/socketEvents';

const ChatWidget = ({ userInfo, token, eventId }: ChatWidgetProps<ChatWidgetDataProps>) => {
  const { Username, EntityID, co_name } = userInfo;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessageAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStickyLabel, setCurrentStickyLabel] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const dayLabelRefs = useRef<{ [label: string]: HTMLDivElement | null }>({});

  const avatarLetter = useMemo(() => co_name?.[0]?.toUpperCase() || '?', [co_name]);
  const unreadCount = useMemo(() => chatHistory.filter((msg) => !msg.isRead && msg.senderID !== EntityID).length, [chatHistory, EntityID]);

  const markMessagesAsRead = () => {
    if (!EntityID || !socketRef.current) return;
    socketRef.current.emit(SOCKET_EVENTS.SET_READ_MESSAGE, {
      eventId,
      bidderId: EntityID,
      type: 0,
    });
    setChatHistory((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
  };

  const handleOnSend = useCallback(() => {
    if (!message.trim()) {
      openSnackbar({
        open: true,
        message: 'Message required',
        variant: 'alert',
        alert: { color: 'error' },
      } as SnackbarProps);
      return;
    }

    socketRef.current?.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      eventId,
      senderName: Username,
      messageBody: message,
      type: 1,
      bidderId: 1,
    });
    setMessage('');
  }, [Username, eventId, message]);

  const handleEnter = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') handleOnSend();
    },
    [handleOnSend]
  );

  const toggleDrawer = () => {
    setOpen((prev) => {
      const isOpening = !prev;
      markMessagesAsRead();

      return isOpening;
    });
  };

  const fetchInitialChat = useCallback(async () => {
    if (!eventId || !EntityID || !token) return;

    try {
      const response = await AuctionRoomServices.getChatHistory(eventId, EntityID, 1);
      if (typeof response !== 'string' && response.success) {
        setChatHistory(response.data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch chat history', err);
      toast.error('Failed to fetch chat history');
    } finally {
      setLoading(false);
    }
  }, [EntityID, eventId, token]);

  useEffect(() => {
    fetchInitialChat();
  }, [fetchInitialChat]);

  useEffect(() => {
    if (!token || !eventId) return;

    const socket = getSocket(token, eventId.toString());
    socketRef.current = socket;
    if (!socket.connected) socket.connect();

    const handleChatUpdated = (data: ChatUpdatedPayload) => {
      if (data.newMessage.updatedChat.length === 1) {
        setChatHistory((prev) => [...prev, data.newMessage.updatedChat[0]]);
      }
      if (open) markMessagesAsRead();
    };

    socket.on(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, eventId, open]);

  useEffect(() => {
    if (open && chatBodyRef.current) {
      const el = chatBodyRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [open]);

  useEffect(() => {
    if (chatBodyRef.current) {
      const el = chatBodyRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const chatEl = chatBodyRef.current;
    if (!chatEl) return;

    const handleScroll = () => {
      const labels = Object.entries(dayLabelRefs.current);
      for (const [label, el] of labels) {
        if (el) {
          const rect = el.getBoundingClientRect();
          const chatRect = chatEl.getBoundingClientRect();
          if (rect.top - chatRect.top <= 10) {
            setCurrentStickyLabel(label);
          }
        }
      }
    };

    chatEl.addEventListener('scroll', handleScroll);
    return () => chatEl.removeEventListener('scroll', handleScroll);
  }, [chatHistory]);

  return (
    <>
      {!open && (
        <FloatingButtonWrapper>
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <FloatingButton variant="contained" color="primary" onClick={toggleDrawer}>
              <Messages1 size={24} />
            </FloatingButton>
          </Badge>
        </FloatingButtonWrapper>
      )}

      {open && (
        <ChatContainer elevation={8}>
          <ChatHeader>
            <Typography variant="subtitle1">Chat</Typography>
            <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
              <ArrowDown2 size={20} />
            </IconButton>
          </ChatHeader>

          <ChatBody ref={chatBodyRef}>
            {currentStickyLabel && (
              <div style={{ position: 'sticky', top: '-8px', zIndex: 2, paddingBottom: 4 }}>
                <ChatDaySeparator label={currentStickyLabel} />
              </div>
            )}
            <List dense sx={{ py: 0 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ChatMessageSkeleton key={i} isAdmin={i % 2 === 0} />)
                : chatHistory.map((msg, idx) => {
                    const currentDayLabel = getDayLabel(msg.messageTime);
                    const prevDayLabel = idx > 0 ? getDayLabel(chatHistory[idx - 1].messageTime) : '';
                    const showDaySeparator = currentDayLabel && currentDayLabel !== prevDayLabel;

                    return (
                      <React.Fragment key={idx}>
                        {showDaySeparator && (
                          <div
                            ref={(el) => {
                              if (el) {
                                dayLabelRefs.current[currentDayLabel] = el;
                              }
                            }}
                          ></div>
                        )}

                        <ChatMessageItem
                          msg={msg}
                          isAdmin={msg.senderID !== Number(EntityID)}
                          avatarLetter={msg.senderName === co_name ? avatarLetter : msg.senderName?.[0]?.toUpperCase()}
                        />
                      </React.Fragment>
                    );
                  })}
              <div ref={chatEndRef} />
            </List>
          </ChatBody>

          <Divider />

          <ChatInputWrapper>
            <StyledTextField
              inputRef={textInputRef}
              fullWidth
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value.length <= 1 ? e.target.value.trim() : e.target.value)}
              size="small"
              onKeyDown={handleEnter}
            />
            <SendIconButton color="primary" onClick={handleOnSend}>
              <Send2 size={20} />
            </SendIconButton>
          </ChatInputWrapper>
        </ChatContainer>
      )}
    </>
  );
};

export default memo(ChatWidget);
