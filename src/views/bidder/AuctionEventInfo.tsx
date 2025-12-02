import Typography from '@mui/material/Typography';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { AuctionEventInfoContainer, AuctionEventInfoRightContainer, StyledAuctionDetailsWrapper } from './CommonBidder.styled';
import { AuctionEventInfoProps } from 'types/bidder';

const AuctionEventInfo = ({ basicDetailsLots, eventTenderData, remainingTime, loading }: AuctionEventInfoProps) => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));
  const dubaiDate = new Date(eventTenderData[0]?.Auctionstartdate.replace('Z', ''));
  const dubaiTenderEndDate = new Date(eventTenderData[0]?.tenderenddate.replace('Z', ''));

  const isTenderClosed = remainingTime === 'Tender & pre-auction submission period is closed.' || remainingTime === 'Auction is ongoing';
  const textColor = isTenderClosed ? 'error.main' : '#1D2630';
  return (
    <StyledAuctionDetailsWrapper>
      {remainingTime !== 'Auction is ongoing' &&
        remainingTime !== 'Closed' &&
        (!loading.isTimerLoading ? (
          <AuctionEventInfoContainer>
            <Typography variant={isSmallDown ? 'body2' : 'body1'} color={textColor}>
              Auction starts on{' '}
              {dubaiDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
              })}{' '}
              at{' '}
              {dubaiDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}{' '}
              (Dubai time). Only the five highest bidders on each lot are qualified for the auction.
            </Typography>
          </AuctionEventInfoContainer>
        ) : (
          <AuctionEventInfoContainer>
            <Skeleton variant="text" width={240} height={24} />
            <Skeleton variant="text" width={220} height={24} />
            <Skeleton variant="text" width={200} height={24} />
          </AuctionEventInfoContainer>
        ))}
      <AuctionEventInfoRightContainer>
        {!isTenderClosed &&
          remainingTime !== 'Closed' &&
          (!loading.isTimerLoading ? (
            <Typography variant={isSmallDown ? 'body2' : 'body1'}>
              {(basicDetailsLots[0]?.EventType === 'Auction' || basicDetailsLots[0]?.EventType === 'Tender') &&
              basicDetailsLots[0]?.ISTender === 'Yes'
                ? 'Tender and pre-auction'
                : 'Pre-auction'}{' '}
              bid submission ends on{' '}
              {dubaiTenderEndDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
              })}{' '}
              at{' '}
              {dubaiTenderEndDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}{' '}
              (Dubai time)
            </Typography>
          ) : (
            <>
              <Skeleton variant="text" width={240} height={24} />
              <Skeleton variant="text" width={220} height={24} />
            </>
          ))}
      </AuctionEventInfoRightContainer>
    </StyledAuctionDetailsWrapper>
  );
};

export default AuctionEventInfo;
