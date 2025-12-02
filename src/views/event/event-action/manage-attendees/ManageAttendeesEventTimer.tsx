'use client';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Calendar } from 'iconsax-react';
import Box from '@mui/material/Box';
import { StyledEventTimerWrapper } from './ManageAttendees.styled';
import CountdownTimer from 'components/UIComponent/CountdownTimer/CountdownTimer';
import { StyledDateColumn, StyledEventDateTimeContainer } from 'views/common.styled';
import { EventTimerProps } from 'types/events';

const ManageAttendeesEventTimer = ({ startformatDate, endformatDate, remainingTime, eventId, loading }: EventTimerProps) => {
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <StyledEventTimerWrapper>
      <Box className="print-total-value-container">
        <StyledEventDateTimeContainer>
          {isSmallUp && (
            <Avatar sx={{ bgcolor: 'primary.lighter', width: 50, height: 50 }} variant="rounded" component="div">
              <Calendar size="35" color="#3C64D0" />
            </Avatar>
          )}
          <StyledDateColumn>
            <Typography variant="h5" color="primary">
              {startformatDate}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={700}>
              Start Date
            </Typography>
          </StyledDateColumn>
          <Divider orientation="vertical" flexItem />
          <StyledDateColumn>
            <Typography variant="h5" color="primary">
              {endformatDate}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={700}>
              End Date
            </Typography>
          </StyledDateColumn>
        </StyledEventDateTimeContainer>
      </Box>
      <CountdownTimer eventId={eventId} remainingTime={remainingTime} loading={loading} />
    </StyledEventTimerWrapper>
  );
};

export default ManageAttendeesEventTimer;
