import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Calendar } from 'iconsax-react';
import MainCard from 'components/MainCard';

const EventSkeleton = () => (
  <MainCard
    border={false}
    content={false}
    sx={{
      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
      borderRadius: 2,
      width: { xs: 210, sm: 265 },
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Avatar>
              <Calendar style={{ visibility: 'inherit' }} />
            </Avatar>
            <Stack sx={{ width: '100%', pl: 2.5 }}>
              <Skeleton animation={false} height={20} width="80%" />
              <Skeleton animation={false} height={20} width="40%" />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Skeleton animation={false} height={20} width={90} />
            <Skeleton animation={false} height={20} width={38} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Skeleton animation={false} height={20} />
        </Grid>
      </Grid>
    </CardContent>
  </MainCard>
);

export default EventSkeleton;
