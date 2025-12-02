import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const AuctionRoomTimeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'end' },
}));

export const BidderCellContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
}));
