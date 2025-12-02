import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const UpsertDocumentDescMainContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const UpsertDocumentDesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '550px',
  gap: theme.spacing(2),
}));

export const UpsertEventTypeContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
