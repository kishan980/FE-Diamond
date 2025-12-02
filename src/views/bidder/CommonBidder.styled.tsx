import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const CountryCodeGridColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
}));

export const BidderSubmitBtn = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  height: '100%',
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
}));

export const BidderBasicDetailsStackSelectContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
}));

export const BidderStackSelectMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', gap: theme.spacing(1) },
}));

export const AuctionEventInfoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: { maxWidth: '294px', textAlign: 'justify' },
}));

export const AuctionEventInfoRightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  width: '100%',
  [theme.breakpoints.up('sm')]: { maxWidth: '242px', textAlign: 'justify' },
}));

export const StyledAuctionDetailsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'end' },
}));
