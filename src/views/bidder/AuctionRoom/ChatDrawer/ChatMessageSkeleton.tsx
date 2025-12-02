import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { ChatMessageBubbleSkeleton, ChatMessageSkeletonContainer, ChatMessageSkeletonContentWrapper } from './ChatWidget.styled';

const ChatMessageSkeleton = ({ isAdmin }: { isAdmin: boolean }) => (
  <ChatMessageSkeletonContainer isAdmin={isAdmin}>
    <ChatMessageSkeletonContentWrapper>
      <Skeleton variant="circular" width={32} height={32} />
      <Box>
        <ChatMessageBubbleSkeleton variant="rectangular" width={180} height={32} />
        <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
      </Box>
    </ChatMessageSkeletonContentWrapper>
  </ChatMessageSkeletonContainer>
);

export default ChatMessageSkeleton;
