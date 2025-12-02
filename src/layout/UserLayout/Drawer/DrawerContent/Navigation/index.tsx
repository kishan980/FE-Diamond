import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import parseISO from 'date-fns/parseISO';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import NavGroup from './NavGroup';
import getBiddersMenuItems from 'bidders-menu-items';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useGetMenu, useGetMenuMaster } from 'api/menu';
import { NavItemType } from 'types/menu';
import { MenuOrientation } from 'types/config';
import AuctionRoomProcessDialog from 'views/bidder/AllLots/AuctionRoomProcessDialog';
import { LoadingState } from 'types/table';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import AuctionCloseDialog from 'views/bidder/AuctionRoom/AuctionCloseDialog';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const router = useRouter();
  const { id: bidderId } = useParams();
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID, companyID } = imageDetails?.currentUserDetails ?? {};

  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [showAuctionRoom, setShowAuctionRoom] = useState(false);
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);
  const [isAuctionCloseDialogOpen, setIsAuctionCloseDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isAuctionButtonLoading: false,
  });

  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const hasOpenedAuctionDialog = useRef<'none' | 'process' | 'close'>('none');

  const fetchData = useCallback(async () => {
    if (!bidderId || !entityID || !companyID) return;
    const numericId = Number(bidderId);

    if (isNaN(numericId)) return;
    const params = { entityId: Number(entityID), companyId: companyID, eventId: numericId };
    const res = await MyProfileServices.getOngoingTenders(params);
    if (typeof res !== 'string' && res.success) setEventTenderData(res.data);
  }, [bidderId, companyID, entityID]);

  const handleAuctionClick = async () => {
    setLoading((prev) => ({ ...prev, isAuctionButtonLoading: true }));
    try {
      const res = await AllLotsServices.updateBidderPopupStatus(Number(bidderId));
      if (typeof res !== 'string' && res.success) {
        setIsAuctionDialogOpen(false);
        router.push(`/bidder/${bidderId}/auction-room`);
        toast.success(res.data);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in Auction close button', e);
      toast.error('Error in Auction close button.');
    } finally {
      setLoading((prev) => ({ ...prev, isAuctionButtonLoading: true }));
    }
  };

  const handleAuctionCloseClick = () => {
    setIsAuctionCloseDialogOpen(false);
    router.replace(`/bidder/${bidderId}/all-lots`);
  };

  useEffect(() => {
    const isValid = bidderId && !isNaN(Number(bidderId)) && companyID && entityID;
    if (!isValid) return;

    fetchData();

    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_EVENT_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchData();
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [fetchData, bidderId, companyID, entityID]);

  useLayoutEffect(() => {
    if (!bidderId) return;

    setMenuItems({ items: [...getBiddersMenuItems(bidderId as string, eventTenderData, showAuctionRoom).items] });
  }, [menuLoading, bidderId, eventTenderData, showAuctionRoom]);

  useEffect(() => {
    if (!eventTenderData) return;
    const [event] = eventTenderData;

    const updateAuctionRoomVisibility = () => {
      const tenderEnd = event?.tenderenddate ? parseISO(event?.tenderenddate).getTime() : null;
      const auctionEnd = event?.Auctionenddate ? parseISO(event?.Auctionenddate).getTime() : null;
      const currentTime = new Date().getTime() + 5.5 * 60 * 60 * 1000;

      if (!tenderEnd || !auctionEnd) {
        setShowAuctionRoom(false);
        return;
      }

      const shouldShow = Boolean(
        (event?.EventType === 'Auction' || event?.EventType === 'Mixed') &&
          tenderEnd &&
          auctionEnd &&
          currentTime > tenderEnd &&
          currentTime < auctionEnd
      );
      setShowAuctionRoom(shouldShow);
      if (shouldShow && !event?.IsconfirmPopup && hasOpenedAuctionDialog.current === 'none') {
        setIsAuctionDialogOpen(true);
        hasOpenedAuctionDialog.current = 'process';
      }
      if (
        (event?.EventType === 'Auction' || event?.EventType === 'Mixed') &&
        currentTime > auctionEnd &&
        hasOpenedAuctionDialog.current === 'none'
      ) {
        setIsAuctionCloseDialogOpen(true);
        hasOpenedAuctionDialog.current = 'close';
      }
    };

    updateAuctionRoomVisibility();

    const timer = setInterval(updateAuctionRoomVisibility, 1000);

    return () => clearInterval(timer);
  }, [eventTenderData]);
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
    <>
      <Box
        sx={{
          pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
          '& > ul:first-of-type': { mt: 0 },
          display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
        }}
      >
        {navGroups}
      </Box>
      <AuctionRoomProcessDialog
        open={isAuctionDialogOpen}
        handleClose={() => setIsAuctionDialogOpen(false)}
        handleAuctionClick={handleAuctionClick}
        eventId={Number(bidderId)}
        loading={loading}
      />
      <AuctionCloseDialog
        open={isAuctionCloseDialogOpen}
        handleClose={() => setIsAuctionCloseDialogOpen(false)}
        onConfirm={handleAuctionCloseClick}
      />
    </>
  );
};

export default Navigation;
