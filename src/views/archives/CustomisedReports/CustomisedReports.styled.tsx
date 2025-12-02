import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const UpsertCustomisedReportsMainContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const UpsertCustomisedReportsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '550px',
  gap: theme.spacing(2),
}));

export const CustomisedReportsDatePicker = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
