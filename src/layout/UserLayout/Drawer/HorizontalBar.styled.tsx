import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import { styled, alpha } from '@mui/material/styles';
import { DRAWER_WIDTH, HEADER_HEIGHT, NAVIGATION_HEIGHT } from 'config';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: HEADER_HEIGHT,
  height: NAVIGATION_HEIGHT,
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  backdropFilter: 'blur(8px)',
  width: '100%',
  justifyContent: 'center',
  borderTop: `2px solid ${theme.palette.divider}`,
  zIndex: 1098,
  color: theme.palette.secondary.main,
}));

export const DrawerMianContainer = styled(Drawer)(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: DRAWER_WIDTH,
    backgroundImage: 'none',
    boxShadow: 'inherit',
  },
}));
