'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export const AuthWrapperGridMainContainer = styled(Grid)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const LoginGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: theme.spacing(1),
  padding: theme.spacing(4),
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: "url('/assets/logo/bg-login.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transform: 'scaleX(-1)',
  },
}));

export const AuthSliderGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  width: 580,
  overflow: 'hidden',
  alignSelf: 'stretch',
  position: 'relative',
  backgroundImage: "url('/assets/logo/bg-diamond.png')",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: { display: 'none' },
  [theme.breakpoints.down('lg')]: { width: 500 },
}));

export const AuthSliderBlurFilter = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 255, 0.2)',
  backdropFilter: 'blur(1px)',
  WebkitBackdropFilter: 'blur(1px)',
}));

export const MainCardStyle = styled(MainCard)(({ theme }) => ({
  maxWidth: 600,
  margin: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  padding: theme.spacing(3),
  display: 'flex',
  flexWrap: 'wrap',
  '& > *': {
    flexGrow: 1,
    flexBasis: '50%',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
    margin: theme.spacing(2.5),
  },
}));
