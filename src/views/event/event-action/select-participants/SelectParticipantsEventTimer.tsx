'use client';
import Typography from '@mui/material/Typography';
import { Calendar } from 'iconsax-react';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SelectParticipantsTimeContainer } from './SelectParticipants.styled';
import CountdownTimer from 'components/UIComponent/CountdownTimer/CountdownTimer';
import { StyledDateColumn, StyledEventDateTimeContainer } from 'views/common.styled';
import { EventTimerProps } from 'types/events';

const SelectParticipantsEventTimer = ({ startformatDate, endformatDate, remainingTime, eventId, loading }: EventTimerProps) => {
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <SelectParticipantsTimeContainer>
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
      <CountdownTimer eventId={eventId} remainingTime={remainingTime} loading={loading} />
    </SelectParticipantsTimeContainer>
  );
};

export default SelectParticipantsEventTimer;
