import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ManageAttendSelectMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingInline: theme.spacing(3),
  marginBlock: theme.spacing(1),
  [theme.breakpoints.down('md')]: { flexDirection: 'column' },
}));

export const ManageAttendSelectSubContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'end',
  gap: theme.spacing(1.5),
  '& .MuiOutlinedInput-input': { width: '160px' },
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  [theme.breakpoints.down('md')]: { justifyContent: 'start', width: '100%' },
}));

export const StyledEventTimerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'end' },
}));
