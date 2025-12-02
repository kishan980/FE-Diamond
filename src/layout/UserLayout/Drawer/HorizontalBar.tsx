import { cloneElement, ReactElement } from 'react';

// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// PROJECT IMPORTS
import Navigation from './DrawerContent/Navigation';

import { StyledAppBar } from './HorizontalBar.styled';
import useConfig from 'hooks/useConfig';

// ==============================|| HORIZONTAL MENU LIST ||============================== //

interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ?? (typeof window !== 'undefined' ? window : undefined),
  });

  theme.shadows[4] = theme.customShadows.z1;
  theme.shadows[1] = theme.customShadows.z2;

  return cloneElement(children, {
    elevation: trigger ? 4 : 1,
  });
}

// ==============================|| HORIZONTAL MENU ||============================== //

const CustomAppBar = () => {
  const { container } = useConfig();

  return (
    <ElevationScroll>
      <StyledAppBar>
        <Container maxWidth={container ? 'xl' : false}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Navigation />
          </Box>
        </Container>
      </StyledAppBar>
    </ElevationScroll>
  );
};

export default CustomAppBar;
