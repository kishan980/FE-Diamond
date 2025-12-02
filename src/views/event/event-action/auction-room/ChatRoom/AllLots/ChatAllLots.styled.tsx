import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SimpleBar from 'components/third-party/SimpleBar';

export const StyledSkeletonLeftCard = styled(Card)(({ theme }) => ({
  borderRadius: 3,
  minWidth: 260,
  flex: 1,
  padding: theme.spacing(2),
}));

export const StyledSkeletonRightCard = styled(Card)(({ theme }) => ({
  borderRadius: 3,
  minWidth: 280,
  flex: 1,
  padding: theme.spacing(2),
}));

export const StyledInfoCard = styled(Card)(() => ({
  borderRadius: 3,
  minWidth: 260,
  flex: 1,
}));

export const StyledTimeCard = styled(Card)(({ theme }) => ({
  borderRadius: 3,
  flex: 1,
  minWidth: 280,
  backgroundColor: theme.palette.background.paper,
}));

export const StyledTimeInputBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: 2,
  boxShadow: theme.shadows[1],
  width: '100%',
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: { flexDirection: 'column' },
}));

export const StyledSubmitButton = styled(LoadingButton)(({ theme }) => ({
  whiteSpace: 'nowrap',
  height: 40,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  fontWeight: 600,
  textTransform: 'none',
  width: '100%',
  maxWidth: '180px',
}));

export const StyledSimpleBar = styled(SimpleBar)(() => ({
  overflowX: 'hidden',
  height: 'calc(100vh - 316px)',
  minHeight: 237,
  '& .simplebar-content': {
    height: '100%',
  },
}));

export const StyledScrollableContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const StyledTextInput = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root:before': { borderBottomColor: theme.palette.divider },
  '& .MuiInputBase-input': { fontSize: 14 },
}));

export const StyledBottomBar = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingInline: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledChatActions = styled(Stack)(() => ({
  justifyContent: 'space-between',
  alignItems: 'center',
}));
