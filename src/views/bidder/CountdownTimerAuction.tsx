import Typography from '@mui/material/Typography';
import { Clock } from 'iconsax-react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { EventTitleProps } from 'types/events';
import {
  StyledCountdownWrapper,
  StyledCountdownDigit,
  StyledCountdownLabel,
  StyledEventClosedMessage,
  StyledEventUpcomingMessage,
  StyledCountdownTimeRow,
  StyledCountdownContent,
  StyledCountdownLoader,
} from 'views/common.styled';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import { StyledCountdownMessageLine } from 'components/UIComponent/ImageAndVideoModel/ImageAndVideoMediaGridContainer.styled';

const CountdownTimerAuction = ({
  eventId,
  remainingTime,
  loading,
  eventTenderData,
}: EventTitleProps & {
  eventTenderData: GetViewParticipateData[];
}) => {
  if (!eventId) return null;

  const showClosed = !loading?.isTimerLoading && remainingTime === 'Closed';
  const showNotOpenYet = !loading?.isTimerLoading && remainingTime === 'Not Open Yet';
  const showTenderClosed = !loading?.isTimerLoading && remainingTime === 'Tender & pre-auction submission period is closed.';
  const isTenderAuction = eventTenderData[0]?.EventType === 'Auction' && eventTenderData[0]?.EventRound === 'Tender';
  const displayText = isTenderAuction ? 'Pre-auction submission period is closed.' : 'Tender & pre-auction submission period is closed.';

  return (
    <StyledCountdownWrapper className="print-timer-hidden-container">
      <StyledCountdownContent>
        {!loading?.isTimerLoading ? (
          (showClosed || showNotOpenYet || showTenderClosed || displayText) && (
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor:
                    remainingTime === 'Not Open Yet' || remainingTime === 'Auction is ongoing'
                      ? 'success.lighter'
                      : remainingTime === 'Closed' || remainingTime === 'Tender & pre-auction submission period is closed.'
                        ? 'error.lighter'
                        : remainingTime && 'primary.lighter',
                }}
                variant="rounded"
                component="div"
              >
                <Clock
                  size="30"
                  color={
                    remainingTime === 'Not Open Yet' || remainingTime === 'Auction is ongoing'
                      ? '#00A854'
                      : remainingTime === 'Closed' || remainingTime === 'Tender & pre-auction submission period is closed.'
                        ? '#F04134'
                        : remainingTime && '#3C64D0'
                  }
                />
              </Avatar>
            </Stack>
          )
        ) : (
          <Stack direction="row" gap={2} alignItems="center">
            <Skeleton variant="text" width={40} height={65} />
          </Stack>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!loading?.isTimerLoading ? (
            <>
              {remainingTime === 'Not Open Yet' ? (
                <StyledEventUpcomingMessage>
                  <Typography variant="h3" color="success.main" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {remainingTime}
                  </Typography>
                </StyledEventUpcomingMessage>
              ) : remainingTime === 'Tender & pre-auction submission period is closed.' ? (
                <StyledEventUpcomingMessage>
                  <Box textAlign="center">
                    {displayText.split('submission period is').map((line, index) => (
                      <StyledCountdownMessageLine key={index} variant="h4" sx={{ color: '#d32f2f' }}>
                        {index === 1 ? 'submission period is' + line : line.trim()}
                      </StyledCountdownMessageLine>
                    ))}
                  </Box>
                </StyledEventUpcomingMessage>
              ) : remainingTime === 'Auction is ongoing' ? (
                <StyledEventUpcomingMessage>
                  <Typography variant="h3" color="success.main" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {remainingTime}
                  </Typography>
                </StyledEventUpcomingMessage>
              ) : remainingTime === 'Closed' ? (
                <StyledEventClosedMessage>
                  <Typography variant="h3" color={'error.main'}>
                    Closed
                  </Typography>
                </StyledEventClosedMessage>
              ) : (
                remainingTime !== 'Not Open Yet' && (
                  <>
                    <StyledCountdownTimeRow>
                      {remainingTime &&
                        remainingTime.split(' ').map((unit, index) => (
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
                )
              )}
            </>
          ) : (
            <StyledCountdownLoader>
              <Skeleton variant="text" width={200} height={65} />
            </StyledCountdownLoader>
          )}
        </Box>
      </StyledCountdownContent>
    </StyledCountdownWrapper>
  );
};

export default CountdownTimerAuction;
