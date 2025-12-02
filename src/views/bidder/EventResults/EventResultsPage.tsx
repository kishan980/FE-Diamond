'use client';
import { useState, useEffect, useCallback } from 'react';
import parseISO from 'date-fns/parseISO';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import EventResultsTableBody from './EventResultsTableBody';
import EventResultsTableHeader from './EventResultsTableHeader';
import { EventResultsMainBox } from './EventResults.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import RefreshIconButton from 'components/UIComponent/IconButtons/RefreshButton';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { useTableControls } from 'utils/useTableControls';
import { EventResultsServices } from 'services/bidder/event-results/eventResults.services';
import { LoadingState } from 'types/table';
import { GetBidderLotsParams, GetWinnerAllLotsDetailsParams, GetWinnerAllLotsDetailsResponse } from 'services/bidder/all-lots/type';
import PrintLogo from 'components/logo/PrintLogo';
import CircularLoader from 'components/CircularLoader';
import { handleExcelExport } from 'utils/exportUtils';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import CelebrationScreen from 'components/CelebrationScreen';

const eventOutcomes = '/assets/images/maintenance/event-outcomes.svg';

const EventResultsPage = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID, entityTypeID, isDownloadAccess, companyID } = imageDetails?.currentUserDetails ?? {};

  const [winnerLots, setWinnerLots] = useState<GetWinnerAllLotsDetailsResponse[]>([]);
  const [bidderLots, setBidderLots] = useState<GetBidderLotsParams[]>([]);
  const [remainingTime, setRemainingTime] = useState('');
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [showCelebrationScreen, setShowCelebrationScreen] = useState(false);
  const [isShowResultsToBidder, setIsShowResultsToBidder] = useState(false);
  const [isWinnerLotsLoaded, setIsWinnerLotsLoaded] = useState(false);

  const [isEventTenderDetailsLoaded, setIsEventTenderDetailsLoaded] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isTimerLoading: false,
    isExcelButtonLoading: false,
    isCircularLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort } = useTableControls('SeqNo');

  const processFetchedData = (fatchedData: any) => {
    if (entityTypeID === 4) {
      if (fatchedData?.[0][0].data1?.toString().toLowerCase() === 'true') {
        setWinnerLots(fatchedData?.[1]);
      }
    } else if (entityTypeID === 1 || entityTypeID === 5) {
      if (fatchedData?.[0][0].data1?.toString().toLowerCase() === 'true') {
        if (fatchedData?.[3][0]?.ShowResultsToBidder?.toLowerCase() === 'yes') {
          if (fatchedData?.[1][0]?.data2 > 0) {
            setWinnerLots(fatchedData?.[2]);
            setBidderLots(fatchedData?.[5]);
            const myWinningLots = fatchedData?.[5]?.filter((lot: any) => lot?.FinalLotStatus === 'Accepted');
            if (myWinningLots?.length > 0) {
              setShowCelebrationScreen(true);
              setTimeout(() => setShowCelebrationScreen(false), 5000);
            }
          }
        } else if (fatchedData?.[3][0]?.ShowResultsToBidder?.toLowerCase() === 'no') {
          setIsShowResultsToBidder(true);
        }
      }
    }
  };

  const fetchWinnerLots = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    setIsWinnerLotsLoaded(false);

    try {
      const params: GetWinnerAllLotsDetailsParams = { eventId, entityId: entityID, entityTypeId: entityTypeID };
      const getBidderLotsData = await AllLotsServices.getWinnerBidderDetail(params);

      if (typeof getBidderLotsData !== 'string' && getBidderLotsData.success) {
        processFetchedData(getBidderLotsData.data.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetchWinnerLots.', error);
      toast.error('An error occurred while fetching bidder lots data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
      setIsWinnerLotsLoaded(true);
    }
  };

  const handleExportExcelClick = () =>
    handleExcelExport(
      () => EventResultsServices.exportExcel(eventId, entityID as number, entityTypeID),
      setLoading,
      'isExcelButtonLoading'
    );

  const handleRefreshClick = () => fetchWinnerLots();

  const fetchParticipateData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      const params = { entityId: Number(entityID), companyId: companyID, eventId };
      const res = await MyProfileServices.getOngoingTenders(params);
      if (typeof res !== 'string' && res.success) {
        setEventTenderData(res.data);
        if (isInitialLoad && !isEventTenderDetailsLoaded) setIsEventTenderDetailsLoaded(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching basic details:', error);
      toast.error('Failed to fetch basic details');
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: false }));
    }
  };

  useEffect(() => {
    if (!eventId) return;
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_GET_ONGOING_TENDER_FETCH_INTERVAL) || 5) * 1000).toString(), 10);

    fetchParticipateData(true);

    const intervalId = setInterval(() => {
      fetchParticipateData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    fetchParticipateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateRemainingTime = useCallback(async () => {
    const data = eventTenderData?.[0];
    const startTime = parseISO(data?.startDate).getTime();
    const endTime = parseISO(data?.tenderenddate).getTime();
    const auctionStartTime = parseISO(data?.Auctionstartdate).getTime();
    const auctionEndTime = parseISO(data?.Auctionenddate).getTime();
    const dubaiDate = data?.Auctionstartdate ? new Date(data?.Auctionstartdate.replace('Z', '')) : null;

    if (!startTime || !endTime || !auctionStartTime || !auctionEndTime) {
      setRemainingTime('');
      return;
    }

    const currentTime = new Date().getTime();
    const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

    const eventType = data?.EventType;

    let newRemainingTime = '';
    if (adjustedCurrentTime < startTime) {
      newRemainingTime = 'Event is upcoming.';
    } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
      newRemainingTime = 'Bid submission period is ongoing.';
    } else if (adjustedCurrentTime >= endTime && adjustedCurrentTime < auctionStartTime) {
      if (eventType === 'Auction' || eventType === 'Mixed') {
        if (dubaiDate) {
          newRemainingTime = `${
            eventType === 'Auction'
              ? 'Pre-auction submission period is now closed'
              : 'Results of the tendered lots will be announced after the closure of the auction'
          }. Auction starts on ${dubaiDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
          })} at ${dubaiDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}  (Dubai time).`;
        }
      } else {
        newRemainingTime = 'Event results will be announced in a short time.';
      }
    } else if (adjustedCurrentTime >= auctionStartTime && adjustedCurrentTime < auctionEndTime) {
      if (eventType === 'Auction') {
        newRemainingTime = 'Auction is ongoing.';
      } else if (eventType === 'Mixed') {
        newRemainingTime = 'Results of the tendered lots will be announced after the closure of the auction. Auction is ongoing.';
      } else {
        newRemainingTime = 'Event results will be announced in a short time.';
      }
    } else if (adjustedCurrentTime >= auctionEndTime) {
      newRemainingTime = 'Event results will be announced in a short time.';
    }

    setRemainingTime(newRemainingTime);
  }, [eventTenderData]);

  useEffect(() => {
    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [calculateRemainingTime]);

  useEffect(() => {
    fetchWinnerLots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isWinnerLotsLoaded) {
    return <Loader />;
  }

  if (showCelebrationScreen) {
    return <CelebrationScreen />;
  }

  if (winnerLots.length === 0) {
    if (isShowResultsToBidder) {
      return (
        <EventResultsMainBox>
          {loading.isTimerLoading ? (
            <>
              {/* Image Skeleton */}
              <Skeleton
                variant="rectangular"
                width={isSmallDown ? 350 : 396}
                height={isSmallDown ? 325 : 370}
                sx={{ maxWidth: '100%', mx: 'auto', borderRadius: 2 }}
              />

              {/* Timer Skeleton */}
              <Skeleton variant="text" width={220} height={48} sx={{ mx: 'auto', mt: 2 }} />
            </>
          ) : (
            <>
              <Image
                src={eventOutcomes}
                alt="Event Outcomes"
                width={isSmallDown ? 350 : 396}
                height={isSmallDown ? 325 : 370}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />

              <Typography variant="h3" color="text.primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                The highest bid for each lot tendered shall be communicated only to the winner of that particular lot.
              </Typography>
            </>
          )}
        </EventResultsMainBox>
      );
    }
    return (
      <EventResultsMainBox>
        {loading.isTimerLoading ? (
          <>
            {/* Image Skeleton */}
            <Skeleton
              variant="rectangular"
              width={isSmallDown ? 350 : 396}
              height={isSmallDown ? 325 : 370}
              sx={{ maxWidth: '100%', mx: 'auto', borderRadius: 2 }}
            />

            {/* Timer Skeleton */}
            <Skeleton variant="text" width={220} height={48} sx={{ mx: 'auto', mt: 2 }} />
          </>
        ) : (
          <>
            <Image
              src={eventOutcomes}
              alt="Event Outcomes"
              width={isSmallDown ? 350 : 396}
              height={isSmallDown ? 325 : 370}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />

            <Typography variant="h3" color="text.primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {remainingTime}
            </Typography>
          </>
        )}
      </EventResultsMainBox>
    );
  }

  return (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <PrintLogo />
      <MainCard
        content={false}
        title="Event Outcomes"
        secondary={
          winnerLots?.length > 0 ? (
            <CardHeaderIconContainer>
              {isDownloadAccess && (
                <DownloadCSVButton
                  title="Export Event Result List Excel"
                  onClick={handleExportExcelClick}
                  isLoading={loading?.isExcelButtonLoading}
                />
              )}
              <PrintIconButton title="Print" onClick={() => window.print()} />
              <RefreshIconButton title="Refresh" onClick={handleRefreshClick} />
            </CardHeaderIconContainer>
          ) : null
        }
        headerClassName="print-card-hidden-title"
      >
        <TableContainer sx={{ maxHeight: 430 }} className="print-table-container">
          <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
            <EventResultsTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort }} />
            <EventResultsTableBody {...{ data: winnerLots, bidderLots, order, orderBy, page, loading, rowsPerPage }} />
          </Table>
        </TableContainer>
        <Divider />
      </MainCard>
    </>
  );
};

export default EventResultsPage;
