import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Clock } from 'iconsax-react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { CountDownTimerProps } from 'types/events';
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

const UploadLotsCountDownTimer = ({ eventId, remainingTime, loading }: CountDownTimerProps) => {
  if (!eventId) return null;

  const showClosed = !loading?.isTimerLoading && !remainingTime;
  const showTimer = !loading?.isTimerLoading && remainingTime !== 'Not Open Yet';
  const showNotOpenYet = !loading?.isTimerLoading && remainingTime === 'Not Open Yet';

  return (
    <StyledCountdownWrapper className="print-timer-hidden-container">
      <StyledCountdownContent>
        {(showClosed || showTimer || showNotOpenYet) && (
          <Stack direction="row" gap={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor:
                  remainingTime === 'Not Open Yet' || remainingTime === 'Bid submission period is ongoing'
                    ? 'success.lighter'
                    : remainingTime === 'Closed'
                      ? 'error.lighter'
                      : 'primary.lighter',
              }}
              variant="rounded"
              component="div"
            >
              <Clock
                size="30"
                color={
                  remainingTime === 'Not Open Yet' || remainingTime === 'Bid submission period is ongoing'
                    ? '#00A854'
                    : remainingTime === 'Closed'
                      ? '#F04134'
                      : '#3C64D0'
                }
              />
            </Avatar>
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
              ) : remainingTime === 'Bid submission period is ongoing' ? (
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
              <CircularProgress color="primary" size={32} />
            </StyledCountdownLoader>
          )}
        </Box>
      </StyledCountdownContent>
    </StyledCountdownWrapper>
  );
};

export default UploadLotsCountDownTimer;
