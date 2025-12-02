import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const HomePageGridLeftCountryCode = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
}));
