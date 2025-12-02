'use client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Clock } from 'iconsax-react';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StyledAuctionDetailsWrapper } from '../CommonBidder.styled';
import {
  StyledCountdownLabel,
  StyledCountdownTimeRow,
  StyledCountdownDigit,
  StyledCountdownContent,
  StyledCountdownLoader,
  StyledCountdownWrapper,
  StyledEllipsisText,
  StyledTotalValueContent,
  StyledTotalValueWrapper,
  StyledTotalValueRow,
} from 'views/common.styled';
import { AuctionRoomData } from 'services/bidder/auction-room/type';
import { AuctionRoomBidsDetailsProps } from 'types/bidder';
import { formatNumber } from 'utils/formatPercentage';

const AuctionRoomBidsDetails = ({
  data,
  eventId,
  loading,
  remainingTime,
  eventTenderData,
  basicDetailsLots,
}: AuctionRoomBidsDetailsProps<AuctionRoomData>) => {
  if (!eventId) return null;
  const totalCommitment = basicDetailsLots[0]?.Tender_Suubmitted_Bids + basicDetailsLots[0]?.Auction_Winning_BIds;
  const totalWinning = data.filter((item) => item.BidStatus === 'Winning').length;

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
  return (
    <StyledAuctionDetailsWrapper>
      {eventId && (
        <Box className="print-total-value-container">
          <StyledTotalValueWrapper>
            <StyledTotalValueContent>
              {!loading.isProgress && !loading.isTimerLoading ? (
                <>
                  {(eventTenderData[0]?.EventType === 'Auction' || eventTenderData[0]?.EventType === 'Mixed') &&
                    renderValueRow(
                      'Auction Winning Bids:',
                      `US$ ${formatNumber(eventTenderData[0]?.Auction_Winning_BIds, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
                    )}

                  {eventTenderData[0]?.EventType === 'Mixed' &&
                    renderValueRow(
                      'Tender Submitted Bids:',
                      `US$ ${formatNumber(eventTenderData[0]?.Tender_Suubmitted_Bids, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
                    )}

                  {renderValueRow(
                    'Total Commitment:',
                    `US$ ${formatNumber(totalCommitment, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
                  )}

                  <Divider />
                  {renderValueRow('Winning bids/Auctioned lots:', `${totalWinning}/${data.length}`)}
                </>
              ) : (
                <>
                  {(eventTenderData[0]?.EventType === 'Auction' || eventTenderData[0]?.EventType === 'Mixed') && renderSkeletonRow()}
                  {eventTenderData[0]?.EventType === 'Mixed' && renderSkeletonRow()}
                  {renderSkeletonRow()}
                  <Divider />
                  {renderSkeletonRow()}
                </>
              )}
            </StyledTotalValueContent>
          </StyledTotalValueWrapper>
        </Box>
      )}

      <StyledCountdownWrapper className="print-timer-hidden-container">
        {remainingTime && (
          <StyledCountdownContent>
            <Stack direction="row" gap={2} alignItems="center" sx={{ top: '12px', position: 'relative' }}>
              {!loading?.isTimerLoading ? (
                <Avatar
                  sx={{
                    bgcolor: 'primary.lighter',
                  }}
                  variant="rounded"
                  component="div"
                >
                  <Clock size="30" color="#3C64D0" />
                </Avatar>
              ) : (
                <Skeleton variant="text" width={40} height={65} />
              )}
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {!loading?.isTimerLoading ? (
                <>
                  <Box>
                    <Typography variant="h4" color="primary">
                      Auction starting in
                    </Typography>
                  </Box>
                  <StyledCountdownTimeRow>
                    {remainingTime.split(' ').map((unit, index) => (
                      <StyledCountdownDigit key={index} variant="h3" color="primary">
                        {unit}
                      </StyledCountdownDigit>
                    ))}
                  </StyledCountdownTimeRow>
                  <StyledCountdownTimeRow>
                    {['DD', 'HH', 'MM', 'SS'].map((label, index) => (
                      <StyledCountdownLabel key={index} variant="body2" color="textSecondary" fontWeight={700}>
                        {label}
                      </StyledCountdownLabel>
                    ))}
                  </StyledCountdownTimeRow>
                </>
              ) : (
                <StyledCountdownLoader>
                  <Skeleton variant="text" width={178} height={65} />
                </StyledCountdownLoader>
              )}
            </Box>
          </StyledCountdownContent>
        )}
      </StyledCountdownWrapper>
    </StyledAuctionDetailsWrapper>
  );
};

export default AuctionRoomBidsDetails;
