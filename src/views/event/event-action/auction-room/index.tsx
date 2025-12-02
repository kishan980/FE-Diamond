'use client';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useParams, usePathname } from 'next/navigation';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AuctionRoomEventTimer from './AuctionRoomEventTimer';
import AuctionRoomTableHeader from './AuctionRoomTableHeader';
import AuctionRoomTableBody from './AuctionRoomTableBody';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { EVENT_MENU_ITEMS } from 'constants/event.constants';
import { EventByIdData } from 'services/event/types';
import { MenuDetails } from 'types/events';
import { LoadingState } from 'types/table';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { useTableControls } from 'utils/useTableControls';
import { AuctionRoomLotData, AuctionRoomSummary } from 'services/event/event-action/auction-room/type';
import { AuctionRoomEventServices } from 'services/event/event-action/auction-room/auctionRoom.services';
import { EventServices } from 'services/event/event.services';
import ProfileDetailsReadModal from 'views/profileDetails-Model/ProfileDetailsReadModal';
import ChatIconButton from 'components/UIComponent/IconButtons/ChatIcon';
import { CardHeaderIconContainer } from 'views/common.styled';
import { formatDurationFromMs, formatHMSDuration } from 'utils/format-date';
import { useOnlineUsers } from 'hooks/useOnlineUsers';

const AuctionRoomPage = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const eventId = Number(id);

  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const token = imageDetails?.token;

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isTimerLoading: false });
  const [anchorElMore, setAnchorElMore] = useState<HTMLElement | null>(null);
  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [lots, setLots] = useState<AuctionRoomLotData[]>([]);
  const [summary, setSummary] = useState<AuctionRoomSummary>();
  const [auctionDurations, setAuctionDurations] = useState<{ [key: number]: string }>({});
  const [remainingTime, setRemainingTime] = useState('');
  const [sellerID, setSellerID] = useState<number | null>(null);
  const [isProfileDetailsDialogOpen, setIsProfileDetailsDialogOpen] = useState(false);
  const onlineUserIds = useOnlineUsers(id as string, token);

  const { order, orderBy, page, handleRequestSort, rowsPerPage } = useTableControls('EntityID');

  const filteredMenu = useMemo(() => EVENT_MENU_ITEMS.filter((item) => !pathname.includes(item.path)), [pathname]);

  const handleClickMoreMenuButton = (event: MouseEvent<HTMLElement>, details: MenuDetails) => {
    setAnchorElMore(event.currentTarget);
    setMenuDetails(details);
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
    setMenuDetails(null);
  };

  const handleProfileDetailsReadClick = (sellerID: number) => {
    setSellerID(sellerID);
    setIsProfileDetailsDialogOpen(true);
  };

  const fetchAuctionData = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true, isTimerLoading: true }));
      try {
        const res = await AuctionRoomEventServices.getAuctionRoomEvent(eventId);
        if (typeof res !== 'string' && res.success) {
          const allLots: AuctionRoomLotData[] = res.data.flatMap((auction) => auction.lots);
          setLots(allLots);
          setSummary(res.data[0].summary);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching lots data:', error);
        toast.error('Failed to fetch lots data');
      } finally {
        if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: false, isTimerLoading: false }));
      }
    },
    [eventId]
  );

  const fetchEventDetails = useCallback(async () => {
    try {
      const res = await EventServices.getEventById(eventId);
      if (typeof res !== 'string' && res.success) {
        setEventData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event details:', error);
      toast.error('Failed to fetch basic details');
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    fetchEventDetails();
  }, [eventId, fetchEventDetails]);

  useEffect(() => {
    if (!eventId) return;
    fetchAuctionData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_AUCTION_ROOM_LIST_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchAuctionData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [eventId, fetchAuctionData]);

  useEffect(() => {
    const maxAuctionTime = summary?.MaxAuctionTime;

    if (!maxAuctionTime || maxAuctionTime === 'Closed') {
      setRemainingTime('Maximum Time Left Closed');
      return;
    }

    const [h, m, s] = maxAuctionTime.split(':').map(Number);
    const endTime = Date.now() + (h * 3600 + m * 60 + s) * 1000;

    const updateTime = () => {
      const diff = endTime - Date.now();
      setRemainingTime(diff <= 0 ? 'Maximum Time Left Closed' : formatDurationFromMs(diff));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [summary]);

  useEffect(() => {
    const initializeEndTimes = () => {
      const endTimes: { [key: number]: number | 'Closed' } = {};

      lots.forEach((event) => {
        const remainingTimeStr = event?.AuctionremainingTime;
        if (!remainingTimeStr || remainingTimeStr === 'Closed') {
          endTimes[event.SeqNo] = 'Closed';
          return;
        }
        const [hoursStr, minutesStr, secondsStr] = remainingTimeStr.split(':');
        const durationMs = (Number(hoursStr) * 3600 + Number(minutesStr) * 60 + Number(secondsStr)) * 1000;

        // Set the actual end time in milliseconds
        endTimes[event.SeqNo] = Date.now() + durationMs;
      });

      return endTimes;
    };

    const endTimes = initializeEndTimes();

    const updateCountdowns = () => {
      const now = Date.now();
      const durations: { [key: number]: string } = {};

      lots.forEach((event) => {
        const endTime = endTimes[event.SeqNo];
        if (!endTime || endTime === 'Closed') {
          durations[event.SeqNo] = 'Closed';
          return;
        }

        const timeLeft = endTime - now;
        durations[event.SeqNo] = timeLeft > 0 ? formatHMSDuration(timeLeft) : '00:00:00';
      });

      setAuctionDurations(durations);
    };

    updateCountdowns();
    const intervalId = setInterval(updateCountdowns, 1000);

    return () => clearInterval(intervalId);
  }, [lots]);

  return (
    <>
      <MainCard
        content={false}
        title="Auction Room"
        secondary={
          !loading?.isProgress && (
            <CardHeaderIconContainer>
              <Link href={`/events/auction-room/${eventId}/chatroom`}>
                <ChatIconButton title="Chat Room Administration" />
              </Link>
              <IconButton
                edge="end"
                aria-label="comments"
                color="secondary"
                onClick={(e) =>
                  handleClickMoreMenuButton(e, {
                    EventID: eventData?.auTen_EvtId || 0,
                    startDate: eventData?.startDate || '',
                    endDate: eventData?.EndDate || '',
                    eventCategoryID: eventData?.refEventCategoryID_EventCategoryMas || 0,
                    isAnalysis: eventData?.IsAnalysing || false,
                    TenderEndDate: eventData?.TenderEndDate || '',
                    AuctionEndDate: eventData?.AuctionEndDate || '',
                  })
                }
              >
                <MoreIcon />
              </IconButton>
            </CardHeaderIconContainer>
          )
        }
      >
        <AuctionRoomEventTimer {...{ loading, remainingTime, eventId, summary }} />
        <Divider />

        <TableContainer
          className="print-hidden-table-container"
          component={Paper}
          sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}
        >
          <Table aria-label="sticky table" size="small" stickyHeader>
            <AuctionRoomTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort }} />
            <AuctionRoomTableBody
              {...{
                data: lots,
                loading,
                page,
                order,
                orderBy,
                rowsPerPage,
                auctionDurations,
                handleProfileDetailsReadClick,
                onlineUserIds,
              }}
            />
          </Table>
        </TableContainer>
        <Divider />
      </MainCard>
      <ProfileDetailsReadModal
        open={isProfileDetailsDialogOpen}
        handleClose={() => setIsProfileDetailsDialogOpen(false)}
        entityID={sellerID}
      />
      <DocumentActionMenu
        open={Boolean(anchorElMore)}
        anchorElMoreMenu={anchorElMore}
        moreMenuEventID={menuDetails?.EventID}
        moreMenuStartDate={menuDetails?.startDate}
        moreMenuEndDate={menuDetails?.endDate}
        eventCategories={menuDetails?.eventCategoryID}
        handleCloseMoreMenuButton={handleCloseMoreMenu}
        detailPageMoreMenuItems={filteredMenu}
        eventOutcomesUrl={menuDetails?.isAnalysis}
        moreMenuTenderEndDate={menuDetails?.TenderEndDate}
        moreMenuAuctionEndDate={menuDetails?.AuctionEndDate}
      />
    </>
  );
};

export default AuctionRoomPage;
