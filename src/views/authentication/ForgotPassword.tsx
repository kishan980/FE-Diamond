import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';
import AuthWrapper3 from 'sections/auth/AuthWrapper3';

const ForgotPassword = () => {
  return (
    <AuthWrapper3>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack alignItems="center" gap={2} sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Box component="img" src="/assets/logo/logo.png" alt="Bidmystones Logo" style={{ height: '80px', width: 'auto' }} />
            <Typography variant="h4">Forgot Password</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthForgotPassword />
        </Grid>
      </Grid>
    </AuthWrapper3>
  );
};

export default ForgotPassword;
