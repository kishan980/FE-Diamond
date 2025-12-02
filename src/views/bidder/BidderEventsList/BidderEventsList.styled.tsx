import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

export const HeaderTitleMainBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  alignItems: 'center',
  paddingRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
  },
}));

export const DialogTitleText = styled(DialogTitle)(() => ({
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  flex: 1,
  minWidth: 0,
}));
