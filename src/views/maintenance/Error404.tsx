'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from 'iconsax-react';
import { ErrorPage404Container } from './ErrorPage.styled';
import { APP_DEFAULT_PATH } from 'config';

const error404 = '/assets/images/maintenance/img-error-404.svg';

// ==============================|| ERROR 404 ||============================== //

function Error404Page() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ErrorPage404Container container spacing={10}>
      <Grid item xs={12}>
        <Stack direction="row">
          <Grid item>
            <Box sx={{ width: 300 }}>
              <Image
                src={error404}
                alt="mantis"
                width={matchDownSM ? 350 : 396}
                height={matchDownSM ? 325 : 370}
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography variant="h1">Page Not Found</Typography>
          <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
            The page you are looking was moved, removed, renamed, or might never exist!
          </Typography>
          <Button component={Link} href={APP_DEFAULT_PATH} variant="contained" startIcon={<ArrowLeft />}>
            Back To Home
          </Button>
        </Stack>
      </Grid>
    </ErrorPage404Container>
  );
}

export default Error404Page;
