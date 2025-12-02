import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const AdministratorsAccessCheckType = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
}));

export const AdministratorsAccessCheckTitle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
