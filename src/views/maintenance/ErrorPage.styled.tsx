import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

export const ErrorPage404Container = styled(Grid)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  overflow: 'hidden',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ErrorPage500Container = styled(Grid)(() => ({
  minHeight: '100vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));
