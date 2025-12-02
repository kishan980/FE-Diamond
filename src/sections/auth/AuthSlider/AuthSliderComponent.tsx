import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Calendar } from 'iconsax-react';
import Divider from '@mui/material/Divider';
import { EventTimeBox, EventTitleBox, EventTypeBox, SliderMainBox } from './AuthSlider.styled';
import Avatar from 'components/@extended/Avatar';
import { UpcomingEvents } from 'services/homepage/type';
import { formatDateAndTime } from 'utils/format-date';

const AuthSliderComponent = ({ event }: { event: UpcomingEvents }) => (
  <SliderMainBox>
    <Avatar
      alt={Array.from(event.co_name)[0]}
      src={event.ShowSellerLogo ? event.co_logo : ''}
      variant="circular"
      size="lg"
      sx={{ fontSize: '24px', fontWeight: 600, backgroundColor: 'common.white' }}
    />
    <EventTitleBox>
      <Typography variant="h4">{event.co_name}</Typography>
      <EventTypeBox>
        <Typography variant="body1">{event.EventType}</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">{event.EventCategory}</Typography>
      </EventTypeBox>
    </EventTitleBox>
    <EventTimeBox>
      <Calendar />
      <Typography variant="body2">{formatDateAndTime(event.startDate)}</Typography>
      <Box component="img" src="/assets/icons/dot.png" />
      <Typography variant="body2">{formatDateAndTime(event.EndDate)}</Typography>
    </EventTimeBox>
    <Typography variant="body1" textAlign="center">
      {event.EventDescription}
    </Typography>
  </SliderMainBox>
);

export default AuthSliderComponent;
