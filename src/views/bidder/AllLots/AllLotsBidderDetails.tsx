'use client';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { ReactNode, useMemo } from 'react';
import CountdownTimerAuction from '../CountdownTimerAuction';
import AuctionEventInfo from '../AuctionEventInfo';
import { StyledAuctionDetailsWrapper } from '../CommonBidder.styled';
import { StyledTotalValueWrapper, StyledTotalValueContent, StyledTotalValueRow, StyledEllipsisText } from 'views/common.styled';
import { AllLotsBidderDetailsProps } from 'types/bidder';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { formatNumber } from 'utils/formatPercentage';

const AllLotsBidderDetails = ({
  data,
  loading,
  eventId,
  remainingTime,
  totalCommitment,
  eventTenderData,
  basicDetailsLots,
  totalNumberOfBids,
  maximumPurchaseLimit,
  showOverAllPurchaseLimit,
}: AllLotsBidderDetailsProps & {
  data: GetAllLotsData[];
}) => {
  const eventType = eventTenderData[0]?.EventType;
  const isAuctionOrMixed = eventType === 'Auction' || eventType === 'Mixed';
  const isAuctionActive = remainingTime === 'Auction is ongoing' || remainingTime === 'Closed';
  // const totalCommitments = basicDetailsLots[0]?.Tender_Suubmitted_Bids + basicDetailsLots[0]?.Auction_Winning_BIds;

  const hasLostStatus = useMemo(() => data.some((item) => item.LotStatus === 'Lost'), [data]);

  // const auctionWinningBids = useMemo(() => {
  //   return data.reduce((sum, lot) => {
  //     return lot.LotStatus === 'Won' ? sum + (lot.lot_value || 0) : sum;
  //   }, 0);
  // }, [data]);

  // const totalCommitmentValue = useMemo(() => {
  //   return data.reduce((acc, item) => acc + item.lot_value, 0);
  // }, [data]);

  const formattedNumber = (num?: number | null) =>
    `US$ ${formatNumber(num ?? 0, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;

  const safeTotalNumberOfBids = totalNumberOfBids > 0 ? totalNumberOfBids : 0;

  const renderValueRow = (label: string, value: ReactNode) => (
    <StyledTotalValueRow>
      <StyledEllipsisText variant="h6" color="text.primary">
        {label}
      </StyledEllipsisText>
      <StyledEllipsisText variant="h5" color="primary">
        {value}
      </StyledEllipsisText>
    </StyledTotalValueRow>
  );

  const renderSkeletonRow = () => (
    <StyledTotalValueRow>
      <Skeleton variant="text" width={140} height={24} />
      <Skeleton variant="text" width={60} height={24} />
    </StyledTotalValueRow>
  );

  const renderValues = () => {
    if (loading.isProgress) {
      return (
        <>
          {isAuctionOrMixed && isAuctionActive && renderSkeletonRow()}
          {eventType === 'Mixed' && isAuctionActive && renderSkeletonRow()}
          {showOverAllPurchaseLimit === 'Yes' && renderSkeletonRow()}
          {renderSkeletonRow()}
          {hasLostStatus && renderSkeletonRow()}
          <Divider />
          {renderSkeletonRow()}
        </>
      );
    }
    return (
      <>
        {isAuctionOrMixed &&
          isAuctionActive &&
          renderValueRow('Auction Winning Bids:', formattedNumber(eventTenderData[0]?.Auction_Winning_BIds))}

        {eventType === 'Mixed' &&
          isAuctionActive &&
          renderValueRow('Tender Submitted Bids:', formattedNumber(eventTenderData[0]?.Tender_Suubmitted_Bids))}

        {showOverAllPurchaseLimit === 'Yes' && renderValueRow('My Purchase Limit:', `$${maximumPurchaseLimit?.toLocaleString() ?? '0'}`)}

        {renderValueRow('Total Commitment:', formattedNumber(totalCommitment))}

        <Divider />

        {renderValueRow('Total Number of Bids:', safeTotalNumberOfBids)}
      </>
    );
  };
  return (
    <Box>
      {isAuctionOrMixed && <AuctionEventInfo {...{ basicDetailsLots, eventTenderData, remainingTime, loading }} />}
      <StyledAuctionDetailsWrapper>
        {eventId && (
          <Box className="print-total-value-container">
            <StyledTotalValueWrapper>
              <StyledTotalValueContent>{renderValues()}</StyledTotalValueContent>
            </StyledTotalValueWrapper>
          </Box>
        )}
        <CountdownTimerAuction {...{ eventId, remainingTime, loading, eventTenderData }} />
      </StyledAuctionDetailsWrapper>
    </Box>
  );
};

export default AllLotsBidderDetails;
