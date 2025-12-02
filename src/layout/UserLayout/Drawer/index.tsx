import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import { DrawerMianContainer } from './HorizontalBar.styled';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

interface Props {
  window?: () => Window;
}

const MainDrawer = ({ window }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const container = window !== undefined ? () => window().document.body : undefined;

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
        <DrawerMianContainer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerHeader}
          {drawerContent}
        </DrawerMianContainer>
      )}
    </Box>
  );
};

export default MainDrawer;
