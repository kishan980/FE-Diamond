import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const TextTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.25rem',
  },
  '@media (max-width: 380px)': {
    maxWidth: '230px',
  },
  '@media (max-width: 330px)': {
    maxWidth: '180px',
  },
}));
