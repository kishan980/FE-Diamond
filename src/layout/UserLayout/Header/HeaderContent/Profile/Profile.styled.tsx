import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const ProfileStylePaper = styled(Paper)(({ theme }) => ({
  width: 290,
  minWidth: 240,
  maxWidth: 290,
  borderRadius: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    maxWidth: 260,
  },
}));
