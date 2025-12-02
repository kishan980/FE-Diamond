import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const EventResultsMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 125px)',
  },
  [theme.breakpoints.up('sm')]: {
    height: 'calc(100vh - 170px)',
  },
  gap: theme.spacing(4),
  justifyContent: 'center',
}));
