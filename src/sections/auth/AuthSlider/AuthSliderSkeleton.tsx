import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { SliderMainBox, EventTitleBox, EventTypeBox, EventTimeBox } from './AuthSlider.styled';

const AuthSliderSkeleton = () => (
  <SliderMainBox>
    <Skeleton variant="circular" width={52} height={52} />
    <EventTitleBox>
      <Typography variant="h4">
        <Skeleton width={100} />
      </Typography>
      <EventTypeBox>
        <Typography variant="body1">
          <Skeleton width={150} />
        </Typography>
      </EventTypeBox>
    </EventTitleBox>
    <EventTimeBox>
      <Typography variant="body2">
        <Skeleton width={300} />
      </Typography>
    </EventTimeBox>
    <Typography variant="body1" textAlign="center" width="100%">
      <Skeleton />
    </Typography>
  </SliderMainBox>
);

export default AuthSliderSkeleton;
