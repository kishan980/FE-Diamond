import React from 'react';
import { DocumentText, ImportSquare } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BidderSubmitBtn } from './CommonBidder.styled';
import { BidderActionButtonsProps } from 'types/bidder';
import { StyledLoadingButton } from 'views/common.styled';

const CommonBidderActionButton = ({ isSubmitting, handleWithdraw, remainingTime, withdrawBidLoading }: BidderActionButtonsProps) => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    remainingTime !== 'Not Open Yet' &&
    remainingTime !== 'Tender & pre-auction submission period is closed.' &&
    remainingTime !== 'Auction is ongoing' &&
    remainingTime !== 'Closed' &&
    remainingTime && (
      <BidderSubmitBtn>
        <StyledLoadingButton
          variant="outlined"
          type="submit"
          startIcon={<ImportSquare style={{ width: isSmallDown ? 16 : 22, height: isSmallDown ? 16 : 22 }} />}
          disabled={withdrawBidLoading}
          loading={isSubmitting}
        >
          Submit Bid(s)
        </StyledLoadingButton>
        <StyledLoadingButton
          variant="outlined"
          startIcon={
            <DocumentText
              style={{
                opacity: isSubmitting ? 0.5 : 1,
                width: isSmallDown ? 16 : 22,
                height: isSmallDown ? 16 : 22,
              }}
            />
          }
          onClick={handleWithdraw}
          disabled={isSubmitting}
          loading={withdrawBidLoading}
        >
          Withdraw Bid(s)
        </StyledLoadingButton>
      </BidderSubmitBtn>
    )
  );
};

export default CommonBidderActionButton;
