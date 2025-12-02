import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { DRAWER_WIDTH } from 'config';

export const DrawerMainContainer = styled(Drawer)(({ theme }) => ({
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
