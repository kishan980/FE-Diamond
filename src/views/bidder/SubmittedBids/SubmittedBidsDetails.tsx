'use client';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { ReactNode, useMemo } from 'react';
import AuctionEventInfo from '../AuctionEventInfo';
import CountdownTimerAuction from '../CountdownTimerAuction';
import { StyledAuctionDetailsWrapper } from '../CommonBidder.styled';
import { StyledTotalValueWrapper, StyledTotalValueContent, StyledTotalValueRow, StyledEllipsisText } from 'views/common.styled';
import { SubmittedBidDetailsProps } from 'types/bidder';
import { GetSubmittedBidsData } from 'services/bidder/submitted-bids/type';
import { formatNumber } from 'utils/formatPercentage';

const SubmittedBidsDetails = ({
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
}: SubmittedBidDetailsProps & {
  data: GetSubmittedBidsData[];
}) => {
  const eventType = eventTenderData?.[0]?.EventType;
  const isAuctionOrMixed = eventType === 'Auction' || eventType === 'Mixed';
  const isAuctionActive =
    remainingTime === 'Tender & pre-auction submission period is closed.' ||
    remainingTime === 'Auction is ongoing' ||
    remainingTime === 'Closed';

  const hasLostStatus = useMemo(() => data.some((item) => item.LotStatus === 'Lost'), [data]);

  const totalCommitmentValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.lot_value, 0);
  }, [data]);

  const safeTotalNumberOfBids = totalNumberOfBids > 0 ? totalNumberOfBids : 0;

  const formattedNumber = (num?: number | null) =>
    `US$ ${formatNumber(num ?? 0, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;

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
          {eventType === 'Mixed' && renderSkeletonRow()}
          {renderSkeletonRow()}
          {renderSkeletonRow()}
          {showOverAllPurchaseLimit === 'Yes' && renderSkeletonRow()}
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

        {renderValueRow('Total Commitment:', formattedNumber(totalCommitment))}

        {hasLostStatus &&
          renderValueRow(
            'Total Commitment US$ :',
            `${formatNumber(totalCommitmentValue, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
          )}

        {!isAuctionActive && renderValueRow('Total Value Submitted:', formattedNumber(totalCommitment))}

        {showOverAllPurchaseLimit === 'Yes' && (
          <>
            <Divider />
            {renderValueRow('My Purchase Limit:', formattedNumber(maximumPurchaseLimit ?? 0))}
          </>
        )}
        <Divider />

        {renderValueRow('Total Number of Bids:', `${safeTotalNumberOfBids}`)}
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

export default SubmittedBidsDetails;
