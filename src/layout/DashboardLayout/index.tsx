'use client';
import { useEffect, ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import { ContainerBox, MainBoxContainer } from './Footer.styled';
import Loader from 'components/Loader';
import useConfig from 'hooks/useConfig';
import { DRAWER_WIDTH } from 'config';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation } from 'types/config';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  useEffect(() => {
    if (!miniDrawer) handlerDrawerOpen(!downXL);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }} className="dashboard-layout">
      <Header />
      {!isHorizontal ? <Drawer /> : <HorizontalBar />}
      <MainBoxContainer component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
        <Toolbar sx={{ mt: isHorizontal ? 5.5 : 'inherit' }} />
        <ContainerBox
          maxWidth={container ? 'xl' : false}
          sx={{
            xs: 0,
            ...(container && { px: { xs: 0, sm: 2 } }),
          }}
        >
          {children}
          <Footer />
        </ContainerBox>
      </MainBoxContainer>
    </Box>
  );
};

export default DashboardLayout;
