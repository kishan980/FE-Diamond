'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TablePagination from '@mui/material/TablePagination';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import parseISO from 'date-fns/parseISO';
import ChatWidget from './ChatDrawer/index';
import AuctionRoomBidderTableHeader from './AuctionRoomTableHeader';
import AuctionRoomBidderTableBody from './AuctionRoomTableBody';
import AuctionRoomBidsDetails from './AuctionRoomBidsDetails';
import Loader from 'components/Loader';
import { LoadingState } from 'types/table';
import PrintLogo from 'components/logo/PrintLogo';
import MainCard from 'components/MainCard';
import { CardHeaderIconContainer } from 'views/common.styled';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { useTableControls } from 'utils/useTableControls';
import { AuctionRoomData } from 'services/bidder/auction-room/type';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import { GetAllLotsTotalLotsData, GetAllLotsTotalLotsParams } from 'services/bidder/all-lots/type';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { formatDurationFromMs, formatTimeRemaining } from 'utils/format-date';
import { disconnectSocket } from 'lib/socket';

const AuctionRoomPage = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const token = imageDetails?.token;
  const { companyID, entityID, eventCategory } = imageDetails?.currentUserDetails ?? {};

  const [data, setData] = useState<AuctionRoomData[]>([]);
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [basicDetailsLots, setBasicDetailsLots] = useState<GetAllLotsTotalLotsData[]>([]);
  const [remainingTime, setRemainingTime] = useState('');
  const [auctionDurations, setAuctionDurations] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isTimerLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const userInfo = useMemo(() => {
    const first = eventTenderData[0] || {};

    return {
      Username: first.co_name as string,
      EntityID: Number(first.EntityID),
      co_name: first.co_name as string,
    };
  }, [eventTenderData]);

  const fetchParticipateData = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      try {
        const params = { entityId: Number(entityID), companyId: companyID, eventId };
        const res = await MyProfileServices.getOngoingTenders(params);
        if (typeof res !== 'string' && res.success) setEventTenderData(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching basic details:', error);
        toast.error('Failed to fetch basic details');
      } finally {
        if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: false }));
      }
    },
    [companyID, entityID, eventId]
  );

  const fetchData = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true }));
      try {
        const res = await AuctionRoomServices.getAuctionRoom(eventId);
        if (typeof res !== 'string' && res.success) setData(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching auction room data:', error);
        toast.error('Failed to fetch auction data');
      } finally {
        if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: false }));
      }
    },
    [eventId]
  );

  const fetchBasicDetails = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      try {
        const params: GetAllLotsTotalLotsParams = {
          eventId,
          entityId: entityID,
          eventCategory,
        };

        const basicDetailsData = await AllLotsServices.getBasicDetails(params);
        if (typeof basicDetailsData !== 'string' && basicDetailsData.success) {
          setBasicDetailsLots(basicDetailsData.data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching basic details:', error);
        toast.error('Failed to fetch basic details');
      } finally {
        if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: false }));
      }
    },
    [entityID, eventCategory, eventId]
  );

  useEffect(() => {
    fetchParticipateData();
  }, [fetchParticipateData]);

  useEffect(() => {
    if (!eventId) return;

    fetchBasicDetails(true);
    fetchParticipateData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_GET_BASIC_DETAILS_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchBasicDetails(false);
      fetchParticipateData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [eventId, fetchBasicDetails, fetchParticipateData]);

  useEffect(() => {
    if (!eventId) return;
    fetchData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_AUCTION_ROOM_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [eventId, fetchData]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const [firstElement] = basicDetailsLots;
      const auctionstartdate = firstElement?.EndDate ? parseISO(firstElement?.auctionstartdate).getTime() : null;
      const auctionEndDate = eventTenderData[0]?.Auctionenddate ? parseISO(eventTenderData[0]?.Auctionenddate).getTime() : null;
      const adjustedCurrentTime = new Date().getTime() + 5.5 * 60 * 60 * 1000;

      if (!auctionstartdate || !auctionEndDate) {
        setRemainingTime('');
        return;
      }

      let newRemainingTime = '';
      if (adjustedCurrentTime < auctionstartdate) {
        newRemainingTime = formatDurationFromMs(auctionstartdate - adjustedCurrentTime);
      }

      setRemainingTime(newRemainingTime);
    };
    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [basicDetailsLots, eventTenderData]);

  useEffect(() => {
    const calculateAuctionDurations = () => {
      const now = new Date().getTime();
      const durations: { [key: number]: string } = {};

      data.forEach((event) => {
        const [firstElement] = basicDetailsLots;
        const startTime = firstElement?.auctionstartdate ? parseISO(firstElement.auctionstartdate).getTime() : null;
        const endTime = event?.LotsEndDate ? parseISO(event.LotsEndDate).getTime() : null;

        if (!startTime || !endTime) {
          durations[event.SeqNo] = '';
          return;
        }

        const adjustedCurrentTime = now + 5.5 * 60 * 60 * 1000;

        if (!startTime || !endTime) {
          durations[event.SeqNo] = '';
        } else if (adjustedCurrentTime < startTime) {
          durations[event.SeqNo] = 'Upcoming';
        } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
          durations[event.SeqNo] = formatTimeRemaining(endTime - adjustedCurrentTime);
        } else {
          durations[event.SeqNo] = 'Closed';
        }
      });

      setAuctionDurations(durations);
    };

    calculateAuctionDurations();

    const intervalId = setInterval(calculateAuctionDurations, 1000);
    return () => clearInterval(intervalId);
  }, [basicDetailsLots, data]);

  useEffect(() => disconnectSocket, []);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <PrintLogo />
      <form>
        <MainCard
          content={false}
          title="Auction Room"
          secondary={
            <CardHeaderIconContainer>
              <PrintIconButton title="Print" onClick={() => window.print()} />
            </CardHeaderIconContainer>
          }
          headerClassName="print-card-hidden-title"
        >
          <AuctionRoomBidsDetails {...{ data, eventId, loading, remainingTime, eventTenderData, basicDetailsLots }} />
          <TableContainer className="print-table-container">
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
              <AuctionRoomBidderTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort, eventCategory }} />
              <AuctionRoomBidderTableBody
                {...{
                  data,
                  order,
                  orderBy,
                  page,
                  rowsPerPage,
                  loading,
                  eventCategory,
                  entityID,
                  remainingTime,
                  eventId,
                  auctionDurations,
                  onUpdateRow: (seqNo, updatedValues) => {
                    setData((prev) => prev.map((row) => (row.SeqNo === seqNo ? { ...row, ...updatedValues } : row)));
                  },
                }}
              />
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ '& p': { m: 0 } }}
          />
        </MainCard>
        <ChatWidget {...{ userInfo, token, eventId }} />
      </form>
    </>
  );
};

export default AuctionRoomPage;
