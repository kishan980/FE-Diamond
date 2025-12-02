import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EmptyEventMainContainer } from '../Event.styled';
import EventSkeleton from './EventSkeleton';

const EmptyCard = ({ title }: { title: string }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <EmptyEventMainContainer>
        <Grid container direction="column" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid>
            <Box sx={{ ml: -7, mb: { xs: -8, sm: -5 } }}>
              <Box sx={{ position: 'relative' }}>
                <EventSkeleton />
              </Box>
              <Box sx={{ position: 'relative', top: -90, left: 72 }}>
                <EventSkeleton />
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Stack sx={{ gap: 1 }}>
              <Typography align="center" variant="h4">
                {title}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </EmptyEventMainContainer>
    </Grid>
  </Grid>
);

export default EmptyCard;
