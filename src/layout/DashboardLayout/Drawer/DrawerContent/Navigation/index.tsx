import { useLayoutEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import NavGroup from './NavGroup';
import { getMenuItems } from 'menu-items';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useGetMenu, useGetMenuMaster } from 'api/menu';
import { NavItemType } from 'types/menu';
import { MenuOrientation } from 'types/config';

const Navigation = () => {
  const theme = useTheme();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { data: session } = useSession();

  const { menuOrientation } = useConfig();
  const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { isAccessArchives, isParameterAccess } = imageDetails?.currentUserDetails ?? {};

  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });

  useLayoutEffect(() => {
    const items = getMenuItems(isAccessArchives, isParameterAccess);
    setMenuItems(items);
    // eslint-disable-next-line
  }, [menuLoading, isAccessArchives, isParameterAccess]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  if (lastItem && lastItem < menuItems.items.length) {
    const targetItem = menuItems.items[lastItem - 1];
    lastItemId = targetItem?.id ?? '';
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem ?? 0}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      case 'item':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem ?? 0}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
