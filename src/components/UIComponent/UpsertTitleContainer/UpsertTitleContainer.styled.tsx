import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const UpsertTitleMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
