import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const EmailInvitationMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
}));

export const EmailInvitationLoader = styled(Box)(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
