import Divider from '@mui/material/Divider';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Calendar } from 'iconsax-react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { OverallPurchaseLimitMainContainer } from './OverallPurchaseLimit.styled';
import CountdownTimer from 'components/UIComponent/CountdownTimer/CountdownTimer';
import { EventByIdData } from 'services/event/types';
import { formatDateAndTime } from 'utils/format-date';
import { StyledDateColumn, StyledEventDateTimeContainer } from 'views/common.styled';
import { OverallPurchaseLimitEventTimerProps } from 'types/bidder';

const OverallPurchaseLimitEventTimer = ({
  eventData,
  eventId,
  remainingTime,
  loading,
}: OverallPurchaseLimitEventTimerProps<EventByIdData>) => {
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <OverallPurchaseLimitMainContainer>
      <StyledEventDateTimeContainer>
        {isSmallUp && (
          <Avatar sx={{ bgcolor: 'primary.lighter', width: 50, height: 50 }} variant="rounded" component="div">
            <Calendar size="35" color="#3C64D0" />
          </Avatar>
        )}
        <StyledDateColumn>
          <Typography variant="h5" color="primary">
            {formatDateAndTime(eventData?.startDate)}
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={700}>
            Start Date:
          </Typography>
        </StyledDateColumn>
        <Divider orientation="vertical" flexItem />
        <StyledDateColumn>
          <Typography variant="h5" color="primary">
            {formatDateAndTime(eventData?.EndDate)}
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={700}>
            End Date:
          </Typography>
        </StyledDateColumn>
      </StyledEventDateTimeContainer>
      <CountdownTimer eventId={eventId} remainingTime={remainingTime} loading={loading} />
    </OverallPurchaseLimitMainContainer>
  );
};

export default OverallPurchaseLimitEventTimer;
