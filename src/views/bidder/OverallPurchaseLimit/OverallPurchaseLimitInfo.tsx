'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { OverallPurchaseLimitDetailsLoadingContainer } from './OverallPurchaseLimit.styled';
import { OverallPurchaseLimitInfoProps } from 'types/bidder';

const OverallPurchaseLimitInfo = ({ show, loading, maximumPurchaseLimit, eventId }: OverallPurchaseLimitInfoProps) => {
  if (!show) return null;

  return loading.isProgress || loading.isLoading ? (
    <OverallPurchaseLimitDetailsLoadingContainer>
      <CircularProgress color="primary" size={24} />
    </OverallPurchaseLimitDetailsLoadingContainer>
  ) : (
    <Box sx={{ m: 1 }}>
      <Typography>
        Please note that your Purchase Limit is of US${' '}
        <span style={{ color: '#3c64d0' }}>{(maximumPurchaseLimit ?? 0).toLocaleString()}</span>.
      </Typography>
      <Typography>You are entitled to bid without any overall limit.</Typography>
      <Typography>
        However, in the case that you have submitted several successful bids and the total amount of the lots won exceeds your Purchase
        Limit, the Seller will reduce your total purchase to an amount that is below US${' '}
        <span style={{ color: '#3c64d0' }}>{(maximumPurchaseLimit ?? 0).toLocaleString()}</span>.
      </Typography>
      <Typography>
        You can <Link href={`/bidder/${eventId}/purchase-limit`}>modify</Link> your Purchase Limit at any time before the end of the tender
        period.
      </Typography>
    </Box>
  );
};

export default OverallPurchaseLimitInfo;
