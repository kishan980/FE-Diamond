import { useMemo } from 'react';

// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// PROJECT IMPORTS
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';

import { DrawerMainContainer } from './MainDrawer.styled';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

interface Props {
  window?: () => Window;
}

const MainDrawer = ({ window }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={drawerOpen} />, [drawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <DrawerMainContainer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerHeader}
          {drawerContent}
        </DrawerMainContainer>
      )}
    </Box>
  );
};

export default MainDrawer;
