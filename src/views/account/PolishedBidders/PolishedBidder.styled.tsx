import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const PolishedBidderStatusConatinerPoint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'start',
  },
}));
