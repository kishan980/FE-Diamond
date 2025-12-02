import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import SimpleBar from 'components/third-party/SimpleBar';

export const ChatRoomContainer = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
});

export const MainContent = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' })<{ open: boolean }>(({ theme }) => ({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter,
  }),
  marginLeft: '-320px',
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0,
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: 'calc(100% - 320px)',
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.shorter,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

export const StyledGridItem = styled(Grid)(({ theme }) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.shorter + 200,
  }),
}));

export const ChatDrawerStyled = styled(Drawer)(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    height: '100%',
    width: 320,
    boxSizing: 'border-box',
    position: 'relative',
    border: 'none',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: '12px 0 0 12px',
    },
  },
}));

export const MessagesContainerStyled = styled(Box)(() => ({
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '12px',
  paddingRight: '12px',
  flexShrink: 1,
}));

export const ChatTabsStyled = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: '4px',
}));

export const MessagesChip = styled(Chip)(() => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  '& .MuiChip-label': {
    paddingLeft: 4,
    paddingRight: 4,
  },
}));

export const SimpleBarContainer = styled(SimpleBar)(({ theme }) => ({
  overflowX: 'hidden',
  height: 'calc(100vh - 378px)',
  flexShrink: 2,
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 213px)',
  },
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 203px)',
  },
}));

export const SimpleBarSubContainer = styled(Box)({
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '8px',
  paddingRight: '8px',
  flexShrink: 1,
});

export const BottomListContainer = styled(Box)({
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '8px',
  paddingRight: '8px',
  flexShrink: 1,
});

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  borderRadius: 0,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const OnlineStatusIndicator = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: '2px solid white',
}));

export const UserInfoStack = styled(Stack)({
  gap: 8,
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const StockNoTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const ChatBidderGridItem = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
}));

export const ChatAreaWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  height: '100%',
}));

export const StyledSimpleBar = styled(SimpleBar)({
  height: 'calc(100vh - 377px)',
  overflowX: 'hidden',
  '& .simplebar-content': { height: '100%' },
});

export const LoadingStack = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const ChatBidderFooter = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ChatTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root:before': { borderBottomColor: theme.palette.divider },
  '& .MuiInputBase-input': { fontSize: 14 },
}));

export const EmojiButtonStack = styled(Stack)({
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const MessageCard = styled(Card)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  backgroundColor: isCurrentUser ? '#4680ff' : theme.palette.background.paper,
  color: isCurrentUser ? theme.palette.background.default : theme.palette.text.primary,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  borderRadius: isCurrentUser ? '12px 12px 0px 12px' : '12px 12px 12px 0px',
  maxWidth: '75%',
  boxShadow: 'none',
}));

export const MessageText = styled(Typography)({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  fontSize: 14,
});

export const InfoRowContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const TimeLeftBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  textAlign: 'center',
  width: '100%',
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBox-root': {
    width: 6,
    height: 6,
  },
  '& .MuiBadge-badge': {
    top: '3%',
    right: '25%',
    padding: 0,
    minWidth: 12,
  },
  '& svg': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50%',
    ...(theme.applyStyles?.('dark', { backgroundColor: theme.palette.text.primary }) ?? {}),
  },
}));
