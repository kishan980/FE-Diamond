import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { DRAWER_WIDTH, HEADER_HEIGHT } from 'config';
import useConfig from 'hooks/useConfig';
import { MenuOrientation } from 'types/config';

interface Props {
  open: boolean;
}

const DrawerHeader = ({ open }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0,
      }}
    >
      <Box component="img" src="/assets/logo/logo.png" alt="Bidmystones Logo" style={{ height: '58px', width: 'auto' }} />
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
