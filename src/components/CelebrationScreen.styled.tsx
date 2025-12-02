import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const CelebrationMainBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '100vw',
  height: '100vh',
  overflowX: 'hidden',
  backgroundColor: '#fef6e4',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  textAlign: 'center',
}));

export const CelebrationTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.success.main,
  fontSize: '1.8rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '3rem',
  },
}));

export const CelebrationSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  maxWidth: 600,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.4rem',
  },
}));
