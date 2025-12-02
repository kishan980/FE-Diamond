'use client';
import React, { useRef, useState, KeyboardEvent, useEffect, useCallback } from 'react';
import { EmojiHappy, Send } from '@wandersonalwes/iconsax-react';
import Grid from '@mui/material/Grid';
import EmojiPicker, { SkinTones, EmojiClickData } from 'emoji-picker-react';
import { Theme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import ChatHeader from './ChatHeader';
import MemoizedChatHistory from './MemoizedChatHistory';
import {
  ChatAreaWrapper,
  ChatBidderFooter,
  ChatBidderGridItem,
  ChatTextField,
  EmojiButtonStack,
  LoadingStack,
  StyledSimpleBar,
} from './ChatRoom.styled';
import IconButton from 'components/@extended/IconButton';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import { LostedBiddersData } from 'services/event/event-action/auction-room/type';
import MainCard from 'components/MainCard';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { getSocket } from 'lib/socket';
import { ChatBidderProps } from 'types/chat';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import { ChatMessageAPI, ChatUpdatedPayload } from 'services/bidder/auction-room/type';
import { SOCKET_EVENTS } from 'constants/socketEvents';

const ChatBidder = ({ loading, handleDrawerOpen, lostedBiddersData, setLoading }: ChatBidderProps<LostedBiddersData>) => {
  const { data: session } = useSession();
  const { id } = useParams();
  const isSmallDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { username } = imageDetails?.currentUserDetails ?? {};
  const token = imageDetails?.token;
  const bidderId = lostedBiddersData.refBuyerID_EntityMas;

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessageAPI[]>([]);
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const fetchInitialChat = useCallback(async () => {
    if (!id || !bidderId) return;
    setLoading((prev) => ({ ...prev, isChatLoading: true }));
    try {
      const response = await AuctionRoomServices.getChatHistory(Number(id), bidderId, 1);
      if (typeof response !== 'string' && response.success) {
        setChatHistory(response.data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch chat history', err);
      toast.error('Failed to fetch chat history', {});
    } finally {
      setLoading((prev) => ({ ...prev, isChatLoading: false }));
    }
  }, [bidderId, id, setLoading]);

  const handleOnSend = () => {
    if (!message.trim()) {
      openSnackbar({
        open: true,
        message: 'Message required',
        variant: 'alert',
        alert: { color: 'error' },
      } as SnackbarProps);
      return;
    }

    const newMessage = {
      eventId: Number(id),
      senderName: username,
      messageBody: message,
      type: 1,
      bidderId: bidderId,
    };

    socketRef.current?.emit(SOCKET_EVENTS.SEND_MESSAGE, newMessage);
    setMessage('');
  };

  const handleEnter = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleOnSend();
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const toggleEmojiPicker = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElEmoji((prev) => (prev ? null : event?.currentTarget || null));
  };

  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };

  useEffect(() => {
    fetchInitialChat();
  }, [fetchInitialChat]);

  useEffect(() => {
    if (!token || !id || !bidderId) return;

    const socket = getSocket(token, id as string);
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    const handleChatUpdated = (data: ChatUpdatedPayload) => {
      const newMsg = data.newMessage?.updatedChat?.[0];
      if (newMsg && (newMsg.senderID === bidderId || newMsg.recipientID === bidderId)) {
        setChatHistory((prev) => [...prev, newMsg]);
      }
    };

    socket.on(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_UPDATED, handleChatUpdated);
    };
  }, [token, id, bidderId]);

  if (!bidderId) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100%' }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Please select a user to start chatting.
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container>
      <ChatBidderGridItem item xs={12}>
        <ChatHeader loading={loading} lostedBiddersData={lostedBiddersData} handleDrawerOpen={handleDrawerOpen} />
      </ChatBidderGridItem>

      <Grid item xs={12}>
        <StyledSimpleBar>
          <ChatAreaWrapper>
            {loading?.isChatLoading ? (
              <LoadingStack>
                <CircularWithPath />
              </LoadingStack>
            ) : (
              <MemoizedChatHistory chat={chatHistory} currentUserName={username} />
            )}
          </ChatAreaWrapper>
        </StyledSimpleBar>
      </Grid>

      <ChatBidderFooter item xs={12}>
        <Stack>
          <ChatTextField
            inputRef={textInputRef}
            fullWidth
            multiline
            rows={4}
            placeholder="Your Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value.length <= 1 ? e.target.value.trim() : e.target.value)}
            onKeyDown={handleEnter}
            variant="standard"
          />
          <EmojiButtonStack direction="row">
            <Stack direction="row" spacing={0}>
              <IconButton
                aria-describedby={anchorElEmoji ? 'emoji-popper' : undefined}
                onClick={toggleEmojiPicker}
                sx={{ opacity: 0.5 }}
                size="small"
                color="secondary"
              >
                <EmojiHappy />
              </IconButton>
              <Popper
                id="emoji-popper"
                open={Boolean(anchorElEmoji)}
                anchorEl={anchorElEmoji}
                disablePortal
                style={{ zIndex: 1200 }}
                popperOptions={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: { offset: [-10, 10] },
                    },
                  ],
                }}
              >
                <ClickAwayListener onClickAway={handleCloseEmoji}>
                  <MainCard elevation={8} content={false}>
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      defaultSkinTone={SkinTones.DARK}
                      autoFocusSearch={false}
                      width={isSmallDown ? 260 : 300}
                    />
                  </MainCard>
                </ClickAwayListener>
              </Popper>
            </Stack>
            <IconButton color="primary" onClick={handleOnSend} size="medium" sx={{ mr: 1.5 }}>
              <Send />
            </IconButton>
          </EmojiButtonStack>
        </Stack>
      </ChatBidderFooter>
    </Grid>
  );
};

export default ChatBidder;
