import { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AuthBackground from '../../../public/assets/images/auth/AuthBackground';
import AuthSlider from './AuthSlider';
import AuthCard from './AuthCard';
import { AuthSliderBlurFilter, AuthSliderGridItem, AuthWrapperGridMainContainer, LoginGridItem } from './AuthWrapper3.styled';

interface Props {
  children: ReactElement;
}

const AuthWrapper2 = ({ children }: Props) => (
  <Box sx={{ minHeight: '100vh' }}>
    <AuthBackground />
    <AuthWrapperGridMainContainer container>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
        >
          <LoginGridItem item container>
            <AuthCard>{children}</AuthCard>
          </LoginGridItem>
          <AuthSliderGridItem item>
            <AuthSliderBlurFilter />
            <AuthSlider />
          </AuthSliderGridItem>
        </Grid>
      </Grid>
    </AuthWrapperGridMainContainer>
  </Box>
);

export default AuthWrapper2;
