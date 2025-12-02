import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ListItemMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
  marginBottom: theme.spacing(0.5),
}));

export const EventTimeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(6),
  '& .MuiTypography-root': { lineHeight: 1 },
}));
