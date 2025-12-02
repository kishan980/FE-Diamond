import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const UpsertEmailMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: theme.spacing(2),
}));

export const UpsertEmailBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
