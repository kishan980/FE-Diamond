import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ButtonMainBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}));

export const ConfirmationDialogMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  gap: theme.spacing(2.5),
}));
