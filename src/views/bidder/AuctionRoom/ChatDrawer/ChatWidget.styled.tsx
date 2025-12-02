import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const FloatingButtonWrapper = styled(Box)(() => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 1300,
}));

export const FloatingButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  minWidth: 56,
  minHeight: 56,
  padding: theme.spacing(1.5),
}));

export const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 320,
  height: 420,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1300,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

export const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const ChatBody = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  backgroundColor: '#f0f0f0',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#a8a8a8',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f0f0f0',
  },
}));

export const ChatInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
}));

export const StyledTextField = styled(TextField)(() => ({
  flexGrow: 1,
}));

export const SendIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin: boolean }>(({ isAdmin }) => ({
  backgroundColor: isAdmin ? '#fff' : '#4680ff',
  color: isAdmin ? '#000' : '#fff',
  padding: '8px 16px',
  borderRadius: isAdmin ? '12px 12px 12px 0px' : '12px 12px 0px 12px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  maxWidth: '100%',
  display: 'inline-block',
  textAlign: 'end',
}));

export const SecondaryTimestamp = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin: boolean }>(({ isAdmin }) => ({
  fontSize: '0.55rem',
  textAlign: isAdmin ? 'left' : 'right',
  opacity: 0.7,
  marginTop: 4,
}));

export const MessageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin: boolean }>(({ isAdmin }) => ({
  display: 'flex',
  justifyContent: isAdmin ? 'flex-start' : 'flex-end',
}));

export const MessageContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin: boolean }>(({ isAdmin }) => ({
  display: 'flex',
  alignItems: 'baseline',
  flexDirection: isAdmin ? 'row' : 'row-reverse',
  gap: 8,
  maxWidth: '75%',
}));

export const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin?: boolean }>(({ isAdmin, theme }) => ({
  backgroundColor: isAdmin ? '#4680ff' : theme.palette.grey[300],
  color: isAdmin ? '#fff' : '#000',
  width: 32,
  height: 32,
  fontSize: 14,
}));

export const DaySeparatorWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

export const DaySeparatorLabel = styled(Typography)(({ theme }) => ({
  backgroundColor: '#e0e0e0',
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#555',
}));

export const ChatMessageSkeletonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin?: boolean }>(({ isAdmin, theme }) => ({
  display: 'flex',
  justifyContent: isAdmin ? 'flex-start' : 'flex-end',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
}));

export const ChatMessageSkeletonContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin?: boolean }>(({ isAdmin, theme }) => ({
  display: 'flex',
  flexDirection: isAdmin ? 'row' : 'row-reverse',
  gap: theme.spacing(1),
}));

export const ChatMessageBubbleSkeleton = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})<{ isAdmin?: boolean }>(({ isAdmin }) => ({
  borderRadius: isAdmin ? '12px 12px 12px 0px' : '12px 12px 0px 12px',
  bgcolor: isAdmin ? '#fff' : 'primary.main',
}));
