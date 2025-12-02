'use client';
import { memo, useEffect, useMemo, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import { MessageCard, MessageText } from './ChatRoom.styled';
import { ChatHistoryProps, ChatMessage } from 'types/chat';
import { getDayLabel } from 'utils/format-date';
import ChatDaySeparator from 'views/bidder/AuctionRoom/ChatDrawer/ChatDaySeparator';

function ChatHistory({ chat, currentUserName }: ChatHistoryProps<ChatMessage>) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [chat]);

  const messagesWithDayFlags = useMemo(() => {
    return chat.map((message, index) => {
      const currentDayLabel = getDayLabel(message.messageTime ?? '');
      const prevDayLabel = index > 0 ? getDayLabel(chat[index - 1]?.messageTime ?? '') : '';
      return {
        ...message,
        showDaySeparator: currentDayLabel && currentDayLabel !== prevDayLabel,
        currentDayLabel,
        isCurrentUser: message.senderName === currentUserName,
      };
    });
  }, [chat, currentUserName]);

  if (chat.length === 0) {
    return (
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ minHeight: '100%' }}>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            No messages yet.
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {messagesWithDayFlags.map((msg, index) => {
        return (
          <Grid item xs={12} key={`${msg.messageTime}-${index}`}>
            {msg.showDaySeparator && <ChatDaySeparator label={msg.currentDayLabel} />}

            <Stack direction="row" spacing={1} justifyContent={msg.isCurrentUser ? 'flex-end' : 'flex-start'} alignItems="flex-start">
              {!msg.isCurrentUser && (
                <UserAvatar user={{ user_name: msg.senderName, refBuyerID_EntityMas: 0 }} isCurrentUser={msg.isCurrentUser} />
              )}
              <Stack spacing={0.5} alignItems={msg.isCurrentUser ? 'flex-end' : 'flex-start'} width="100%">
                <MessageCard isCurrentUser={msg.isCurrentUser}>
                  <MessageText variant="body1">{msg.messageBody}</MessageText>
                </MessageCard>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                  {moment(msg.messageTime, 'MMM D YYYY h:mma').format('DD MMM YYYY hh:mm A')}
                </Typography>
              </Stack>
              {msg.isCurrentUser && (
                <UserAvatar user={{ user_name: msg.senderName, refBuyerID_EntityMas: 0 }} isCurrentUser={msg.isCurrentUser} />
              )}
            </Stack>
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <div ref={bottomRef} />
      </Grid>
    </Grid>
  );
}

export default memo(ChatHistory);
