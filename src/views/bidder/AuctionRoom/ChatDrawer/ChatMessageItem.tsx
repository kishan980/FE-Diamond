import { memo } from 'react';
import ListItemText from '@mui/material/ListItemText';
import { MessageBubble, MessageContent, MessageWrapper, SecondaryTimestamp, StyledAvatar } from './ChatWidget.styled';
import { ChatMessageItemProps } from 'types/chat';
import { ChatMessageAPI } from 'services/bidder/auction-room/type';

const ChatMessageItem = ({ msg, isAdmin, avatarLetter }: ChatMessageItemProps<ChatMessageAPI>) => {
  // const time = useMemo(() => formatMessageTime(msg.messageTime), [msg.messageTime]);

  return (
    <MessageWrapper isAdmin={isAdmin}>
      <MessageContent isAdmin={isAdmin}>
        <StyledAvatar isAdmin={!isAdmin}>{avatarLetter}</StyledAvatar>
        <ListItemText
          sx={{ textAlign: isAdmin ? 'start' : 'end' }}
          primary={<MessageBubble isAdmin={isAdmin}>{msg.messageBody}</MessageBubble>}
          secondary={<SecondaryTimestamp isAdmin={isAdmin}>{msg.messageTime}</SecondaryTimestamp>}
        />
      </MessageContent>
    </MessageWrapper>
  );
};

export default memo(ChatMessageItem);
