import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ViewMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const EventConatinerPoint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('lg')]: { flexDirection: 'column', alignItems: 'start', gap: theme.spacing(0.5) },
}));

export const EventDatePicker = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const EventMainConatiner = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const UpsertEventDownAndBack = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  width: '100%',
}));

export const UpsertEventRevisedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

export const EmptyEventMainContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 250px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'transparent',
  [theme.breakpoints.up('xs')]: { padding: theme.spacing(2.5) },
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(6) },
}));

export const EventCardList = styled(Box)(({ theme }) => ({
  padding: 0,
  overflow: 'hidden',
  '& .MuiListItem-root': { paddingInline: 0, paddingBlock: theme.spacing(0.5) },
  '& .MuiListItemIcon-root': { minWidth: 28 },
}));

export const EventCardListItemTextBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const EventPageMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const EventPageInnerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
