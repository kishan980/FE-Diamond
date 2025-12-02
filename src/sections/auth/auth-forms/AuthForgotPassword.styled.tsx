import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ForgotPasswordMainBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));
