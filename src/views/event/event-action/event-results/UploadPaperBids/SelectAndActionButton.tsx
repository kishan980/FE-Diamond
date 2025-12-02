'use client';
import { DocumentText, ImportSquare } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EventResultSubmitBtn } from './UploadPaperBids.styled';
import { EventResultActionButtonsProps } from 'types/bidder';
import { StyledLoadingButton } from 'views/common.styled';

const SelectAndActionButton = ({ isSubmitting, handleWithdraw, withdrawBidLoading }: EventResultActionButtonsProps) => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <EventResultSubmitBtn>
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
    </EventResultSubmitBtn>
  );
};

export default SelectAndActionButton;
