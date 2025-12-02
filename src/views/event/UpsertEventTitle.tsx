'use client';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { ArrowLeft2 } from 'iconsax-react';
import { UpsertEventDownAndBack } from './Event.styled';
import CountdownTimer from 'components/UIComponent/CountdownTimer/CountdownTimer';
import { UpsertTitle, UpsertTitleTypography } from 'views/common.styled';
import { CountDownTimerProps } from 'types/events';

const UpsertEventTitle = ({ eventId, remainingTime, loading }: CountDownTimerProps) => {
  const { back } = useRouter();

  return (
    <UpsertTitle flexDirection={{ xs: 'column', sm: 'row' }}>
      <UpsertTitleTypography width="100%" onClick={() => back()} sx={{ maxWidth: 'fit-content' }}>
        <ArrowLeft2 />
        <Typography variant="h4">{eventId ? 'Update' : 'Add'} Event</Typography>
      </UpsertTitleTypography>
      <UpsertEventDownAndBack>
        <CountdownTimer eventId={eventId} remainingTime={remainingTime} loading={loading} />
      </UpsertEventDownAndBack>
    </UpsertTitle>
  );
};

export default UpsertEventTitle;
