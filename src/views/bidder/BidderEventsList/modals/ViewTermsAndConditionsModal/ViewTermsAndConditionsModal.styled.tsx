import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ViewTermsAndConditionMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const ViewTermsAndConditionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
