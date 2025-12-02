'use client';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Clock } from 'iconsax-react';
import Skeleton from '@mui/lab/Skeleton';
import { AuctionRoomTimeContainer } from './AuctionRoom.styled';
import { AuctionRoomEventTimerProps } from 'types/events';
import {
  StyledCountdownLabel,
  StyledCountdownTimeRow,
  StyledCountdownDigit,
  StyledCountdownContent,
  StyledCountdownLoader,
  StyledCountdownWrapper,
  StyledEllipsisText,
  StyledEventUpcomingMessage,
  StyledTotalValueContent,
  StyledTotalValueWrapper,
  StyledTotalValueRow,
} from 'views/common.styled';

const AuctionRoomEventTimer = ({ remainingTime, loading, eventId, summary }: AuctionRoomEventTimerProps) => {
  const renderSummaryRow = (labelString?: string) => {
    if (!labelString) return null;
    const [label, value] = labelString.split(':');
    return (
      <StyledTotalValueRow gap={{ xs: 0.25, sm: 1 }}>
        <StyledEllipsisText variant="h6" color="text.primary">
          {label + ':'}
        </StyledEllipsisText>
        <StyledEllipsisText variant="h5" color="primary">
          {value?.trim()}
        </StyledEllipsisText>
      </StyledTotalValueRow>
    );
  };

  return (
    <AuctionRoomTimeContainer>
      {eventId && (
        <Box className="print-total-value-container">
          <StyledTotalValueWrapper>
            <StyledTotalValueContent>
              {loading?.isProgress ? (
                <StyledCountdownLoader>
                  <CircularProgress color="primary" size={32} />
                </StyledCountdownLoader>
              ) : (
                <>
                  {renderSummaryRow(summary?.AuctionLots)}
                  <Divider />
                  {renderSummaryRow(summary?.Biddercount)}
                </>
              )}
            </StyledTotalValueContent>
          </StyledTotalValueWrapper>
        </Box>
      )}

      <StyledCountdownWrapper className="print-timer-hidden-container">
        <StyledCountdownContent>
          {!loading?.isTimerLoading ? (
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: remainingTime === 'Maximum Time Left Closed' ? 'success.lighter' : 'primary.lighter',
                }}
                variant="rounded"
                component="div"
              >
                <Clock
                  size="30"
                  style={{
                    color: remainingTime === 'Maximum Time Left Closed' ? '#00A854' : '#3C64D0',
                  }}
                />
              </Avatar>
            </Stack>
          ) : (
            <Stack direction="row" gap={2} alignItems="center">
              <Skeleton variant="text" width={40} height={65} />
            </Stack>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loading?.isTimerLoading ? (
              <StyledCountdownLoader>
                <Skeleton variant="text" width={178} height={65} />
              </StyledCountdownLoader>
            ) : remainingTime === 'Maximum Time Left Closed' ? (
              <StyledEventUpcomingMessage>
                <Typography variant="h3" color="success.main" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {remainingTime}
                </Typography>
              </StyledEventUpcomingMessage>
            ) : (
              <>
                <StyledCountdownTimeRow>
                  {remainingTime?.split(' ').map((unit, index) => (
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
            )}
          </Box>
        </StyledCountdownContent>
      </StyledCountdownWrapper>
    </AuctionRoomTimeContainer>
  );
};

export default AuctionRoomEventTimer;
