import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Details from './Details';
import Profile from './Profile';
import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/DashboardLayout/Drawer/DrawerHeader';
import { MenuOrientation } from 'types/config';

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <Box display="flex" alignItems="center" justifyContent={downLG ? 'end' : 'space-between'} width="100%">
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open />}
      <Box display="flex">
        {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
        <Details />
        <Profile />
      </Box>
    </Box>
  );
};

export default HeaderContent;
