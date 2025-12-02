'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import EventAnalysingResultsTable from './EventAnalysingResultsTable/EventAnalysingResultsTable';
import EventAnalysingResultsChildTable from './EventAnalysingResultsChildTable/EventAnalysingResultsChildTable';
import EventAnalysingResultsDetailsTable from './EventAnalysingResultsDetails/EventAnalysingResultsDetailsTable';
import ExcelDialog from 'components/UIComponent/Dialogs/ExcelDialog/ExcelDialog';
import { EventServices } from 'services/event/event.services';
import { handleFetchData } from 'utils/apiHelpers';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { BidData } from 'types/events';
import { LoadingState } from 'types/table';
import { EventByIdData } from 'services/event/types';
import {
  AvgNumOfBidsPerBidderData,
  DeclareWinnerParams,
  GetBidDetailsForWinnerData,
  GetBidResultSummaryData,
  GetSameBidEventData,
  UpdateEmergencyParams,
} from 'services/event/event-action/event-results/type';
import ProfileDetailsReadModal from 'views/profileDetails-Model/ProfileDetailsReadModal';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { useSellerData } from 'hooks/useSellerData';

const EventAnalysingResultsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventId = Number(id);

  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isConfirmLoading: false,
    isButtonLoading: false,
  });
  const [dataGetLoader, setDataGetLoader] = useState<'dataWith' | 'dataWithout' | null>(null);
  const [getBidDetails, setGetBidDetails] = useState<GetBidDetailsForWinnerData[]>([]);
  const [getBidResultsSummary, setGetBidResultsSummary] = useState<GetBidResultSummaryData[]>([]);
  const [eventData, setEventData] = useState<EventByIdData>();
  const [bidEventData, setBidEventData] = useState<GetSameBidEventData[]>([]);
  const [sellerID, setSellerID] = useState<number | null>(null);
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isProfileDetailsDialogOpen, setIsProfileDetailsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [totals, setTotals] = useState({
    totalLots: 0,
    totalCarats: 0,
    totalWinRate: 0,
    totalReserveValue: 0,
    totalHighestReserveValue: 0,
    totalHighestAverage: 0,
    totalReservePriceAverage: 0,
    soldDataCount: 0,
    soldTotalCarats: 0,
    soldTotalWinRate: 0,
    soldTotalReserve: 0,
    soldHighestReserveValue: 0,
    soldHighestAverage: 0,
    soldReservePriceAverage: 0,
    withdrawnDataCount: 0,
    withdrawnTotalCarats: 0,
    withdrawnTotalWinRate: 0,
    withdrawnTotalReserve: 0,
    withdrawnHighestReserveValue: 0,
    withdrawnHighestAverage: 0,
    withdrawnReservePriceAverage: 0,
    noBidDataCount: 0,
    noBidTotalCarats: 0,
    noBidTotalWinRate: 0,
    noBidTotalReserve: 0,
    noBidHighestReserveValue: 0,
    noBidHighestAverage: 0,
    noBidReservePriceAverage: 0,
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState<'Yes' | 'No'>('No');
  const { sellerData, isSellerLoading, fetchSellerData } = useSellerData();

  const fetchEventById = useCallback(async (id: number) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await EventServices.getEventById(id);
      if (typeof res !== 'string' && res.success) setEventData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event data.', error);
      toast.error('Error fetching event data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, []);

  const calculateTotals = (data: GetBidDetailsForWinnerData[]) => {
    const totalLotsCount = data.length;
    const totalCaratsCount = data.reduce((acc, item) => acc + item.cts, 0);
    const totalWinRateCount = data.reduce((acc, item) => acc + item.Win_Rate, 0);
    const totalReserveValueCount = data.reduce((acc, item) => acc + item.cts * item.rate, 0);
    const totalHighestReserveValueCount = totalWinRateCount / totalCaratsCount;

    const noBidDataCount = data.filter((item) => item.Win_Rate === null).length;
    const noBidTotalCarats = data.filter((item) => item.Win_Rate === null).reduce((acc, item) => acc + item.cts, 0);
    const noBidTotalReserve = data.filter((item) => item.Win_Rate === null).reduce((acc, item) => acc + item.cts * item.rate, 0);

    setTotals((prevTotals) => ({
      ...prevTotals,
      totalLots: totalLotsCount,
      totalCarats: totalCaratsCount,
      totalWinRate: totalWinRateCount,
      totalReserveValue: totalReserveValueCount,
      totalHighestReserveValue: 0,
      totalHighestAverage: totalHighestReserveValueCount,
      totalReservePriceAverage: 0,
      noBidDataCount: noBidDataCount,
      noBidTotalCarats: noBidTotalCarats,
      noBidTotalWinRate: 0,
      noBidTotalReserve: noBidTotalReserve,
      noBidHighestReserveValue: 0,
      noBidHighestAverage: 0,
      noBidReservePriceAverage: 0,
    }));
  };

  const fetchBidDetails = useCallback(async () => {
    try {
      const res = await EventResultsServices.getBidDetailsForWinnerData(eventId);
      if (typeof res !== 'string' && res.success) {
        setGetBidDetails(res.data);
        calculateTotals(res.data);
      } else toast.error('Failed to fetch bid details.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bid details:', error);
      toast.error('Error fetching bid details.');
    }
  }, [eventId]);

  const fetchBidResultSummary = useCallback(() => {
    handleFetchData<GetBidResultSummaryData[]>(
      () => EventResultsServices.getBidResultSummary(eventId),
      setGetBidResultsSummary,
      setLoading
    );
  }, [eventId]);

  const handleSelectData = (data: BidData, actionType: string) => {
    setTotals((prevTotals) => {
      const updates = {
        soldDataCount: prevTotals.soldDataCount,
        soldTotalCarats: prevTotals.soldTotalCarats,
        soldTotalWinRate: prevTotals.soldTotalWinRate,
        soldTotalReserve: prevTotals.soldTotalReserve,
        soldHighestReserveValue: prevTotals.soldHighestReserveValue,
        soldHighestAverage: prevTotals.soldHighestAverage,
        soldReservePriceAverage: prevTotals.soldReservePriceAverage,
        withdrawnDataCount: prevTotals.withdrawnDataCount,
        withdrawnTotalCarats: prevTotals.withdrawnTotalCarats,
        withdrawnTotalWinRate: prevTotals.withdrawnTotalWinRate,
        withdrawnTotalReserve: prevTotals.withdrawnTotalReserve,
        withdrawnHighestReserveValue: prevTotals.withdrawnHighestReserveValue,
        withdrawnHighestAverage: prevTotals.withdrawnHighestAverage,
        withdrawnReservePriceAverage: prevTotals.withdrawnReservePriceAverage,
      };

      const reserveValue = data.cts * data.rate;

      switch (actionType) {
        case 'accept':
          updates.soldDataCount += 1;
          updates.soldTotalCarats += data.cts;
          updates.soldTotalWinRate += data.Win_Rate;
          updates.soldTotalReserve += reserveValue;
          break;

        case 'refuse':
          updates.withdrawnDataCount += 1;
          updates.withdrawnTotalCarats += data.cts;
          updates.withdrawnTotalWinRate += data.Win_Rate;
          updates.withdrawnTotalReserve += reserveValue;
          break;

        case 'AcceptedReopen':
          updates.soldDataCount -= 1;
          updates.soldTotalCarats -= data.cts;
          updates.soldTotalWinRate -= data.Win_Rate;
          updates.soldTotalReserve -= reserveValue;
          break;

        case 'WithdrawReopen':
          updates.withdrawnDataCount -= 1;
          updates.withdrawnTotalCarats -= data.cts;
          updates.withdrawnTotalWinRate -= data.Win_Rate;
          updates.withdrawnTotalReserve -= reserveValue;
          break;

        default:
          break;
      }

      // 🟢 Recalculate averages properly
      updates.soldHighestAverage = updates.soldTotalCarats ? updates.soldTotalWinRate / updates.soldTotalCarats : 0;

      updates.soldReservePriceAverage = updates.soldTotalCarats ? updates.soldTotalReserve / updates.soldTotalCarats : 0;

      updates.soldHighestReserveValue =
        updates.soldTotalReserve > 0 ? (updates.soldTotalWinRate / updates.soldTotalReserve) * 100 - 100 : 0;

      updates.withdrawnHighestAverage = updates.withdrawnTotalCarats ? updates.withdrawnTotalWinRate / updates.withdrawnTotalCarats : 0;

      updates.withdrawnReservePriceAverage = updates.withdrawnTotalCarats
        ? updates.withdrawnTotalReserve / updates.withdrawnTotalCarats
        : 0;

      updates.withdrawnHighestReserveValue =
        updates.withdrawnTotalReserve > 0 ? (updates.withdrawnTotalWinRate / updates.withdrawnTotalReserve) * 100 - 100 : 0;

      return { ...prevTotals, ...updates };
    });
  };

  const handleDownloadEmergency = async (actionType: number) => {
    setDataGetLoader(actionType === 2 ? 'dataWith' : 'dataWithout');
    try {
      const params: UpdateEmergencyParams = {
        id: eventId,
        type: actionType,
        eventCategory: Number(eventData?.refEventCategoryID_EventCategoryMas),
        snapShotFirstRowData: [
          { sold: totals.soldDataCount },
          { withdrawn: totals.withdrawnDataCount },
          { offeredParcel: totals.totalLots },
          { noBids: 0 },
        ],
        caratsDetails: [
          { sold: totals.soldTotalCarats },
          { withdrawn: totals.withdrawnTotalCarats },
          { offeredParcel: totals.totalCarats },
          { noBids: 0 },
        ],
        highestBidDetails: [
          { sold: totals.soldTotalWinRate },
          { withdrawn: totals.withdrawnTotalWinRate },
          { offeredParcel: totals.totalWinRate },
          { noBids: 0 },
        ],
        reservePriceVal: [
          { sold: totals.soldTotalReserve },
          { withdrawn: totals.withdrawnTotalReserve },
          { offeredParcel: totals.totalReserveValue },
          { noBids: 0 },
        ],
        variancePerReserveVal: [
          { sold: totals.soldHighestReserveValue },
          { withdrawn: totals.withdrawnHighestReserveValue },
          { offeredParcel: totals.totalHighestReserveValue },
          { noBids: totals.noBidHighestReserveValue },
        ],
        highestBidAvg: [
          { sold: totals.soldHighestAverage },
          { withdrawn: totals.withdrawnHighestAverage },
          { offeredParcel: totals.totalHighestAverage },
          { noBids: totals.noBidHighestAverage },
        ],
        reservePriceAvg: [
          { sold: totals.soldReservePriceAverage },
          { withdrawn: totals.withdrawnReservePriceAverage },
          { offeredParcel: totals.totalReservePriceAverage },
          { noBids: totals.noBidReservePriceAverage },
        ],
      };

      const response = await EventResultsServices.downloadEmergency(params);

      if (!response) {
        toast.error('Failed to download report');
        return;
      }

      const disposition = response.headers['content-disposition'];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', disposition);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Data ${actionType === 1 ? 'With Formula' : 'Without Formula'} successfully`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleDownloadEmergency:', error);
      toast.error(`An error occurred while ${actionType === 1 ? 'granting' : 'denying'} data`);
    } finally {
      setIsExcelDialogOpen(false);
      setDataGetLoader(null);
    }
  };

  const handleDeclareWinner = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));

    try {
      const params: DeclareWinnerParams = { eventId, showResultToBidder: alertAction };
      setIsConfirmDialogOpen(false);
      const res = await EventResultsServices.declareWinner(params);
      if (typeof res !== 'string' && res.success) {
        toast.success(
          `${alertAction === 'Yes' ? 'Outcomes has been announced to bidders and viewers' : 'Event has been closed. Outcomes have NOT been publicised.'} successfully`
        );
        setIsConfirmDialogOpen(false);
        router.push('/events');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleEventResultBidders:', error);
      toast.error('An error occurred while');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleProfileDetailsReadClick = (sellerID: number) => {
    setSellerID(sellerID);
    setIsProfileDetailsDialogOpen(true);
  };

  const fetchGetBidEventData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await EventResultsServices.getSameBidEvent(eventId);
      if (typeof res !== 'string' && res.success) setBidEventData(res.data);
      else toast.error('Failed to fetch bid event data.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bid event data:', err);
      toast.error('An error occurred while fetching bid event data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, [eventId]);

  const handleActionClick = (action: 'Yes' | 'No', message: string) => {
    const hasInvalidStatus = getBidDetails.some((item) => item.FinalLotStatus === 'Consider' || item.FinalLotStatus === null);
    const avgNumOfBidsPerBidder = getBidResultsSummary.find(
      (item): item is AvgNumOfBidsPerBidderData => 'AvgNumOfBidsPerBidder' in item
    )?.AvgNumOfBidsPerBidder;

    const isOutcomeDataInvalid = hasInvalidStatus || avgNumOfBidsPerBidder !== getBidDetails.length;

    if (isOutcomeDataInvalid) {
      toast.error("To be able to publicise outcomes, all lot's status should be Accepted, Unsold or Withdrawn.");
      return;
    }
    setAlertMessage(message);
    setAlertAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleClickExcelButton = () => setIsExcelDialogOpen(true);

  useEffect(() => {
    fetchBidDetails();
    fetchBidResultSummary();
    fetchSellerData('Selected');
    fetchGetBidEventData();
  }, [fetchBidDetails, fetchBidResultSummary, fetchSellerData, fetchGetBidEventData]);

  useEffect(() => {
    if (eventId) fetchEventById(eventId);
  }, [eventId, fetchEventById]);

  return loading.isLoading ? (
    <CircularLoader isProgress={loading.isProgress || loading.isLoading} />
  ) : (
    <>
      <EventAnalysingResultsTable
        eventId={eventId}
        loading={loading}
        setLoading={setLoading}
        sellerData={sellerData}
        bidEventData={bidEventData}
        getBidDetails={getBidDetails}
        onSelectData={handleSelectData}
        fetchBidDetails={fetchBidDetails}
        fetchGetBidEventData={fetchGetBidEventData}
        handleClickExcelButton={handleClickExcelButton}
        handleProfileDetailsReadClick={handleProfileDetailsReadClick}
        isSellerLoading={isSellerLoading}
      />
      <EventAnalysingResultsDetailsTable totals={totals} loading={loading} />
      <EventAnalysingResultsChildTable
        loading={loading}
        getBidResultsSummary={getBidResultsSummary}
        isPubliciseResults={eventData?.ISPubliciseResultsToBidders}
        showOverAllPurchaseLimit={eventData?.showOverAllPurchaseLimit}
        handleProfileDetailsReadClick={handleProfileDetailsReadClick}
        handleActionClick={handleActionClick}
      />
      <ExcelDialog
        open={isExcelDialogOpen}
        handleClose={() => setIsExcelDialogOpen(false)}
        handleDataWithFormula={() => handleDownloadEmergency(2)}
        handleDataWithoutFormula={() => handleDownloadEmergency(1)}
        title="Please select the type of Excel report generated:"
        dataGetLoader={dataGetLoader}
      />
      <ProfileDetailsReadModal
        open={isProfileDetailsDialogOpen}
        handleClose={() => setIsProfileDetailsDialogOpen(false)}
        entityID={sellerID}
      />
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeclareWinner}
        loading={loading}
        title={alertMessage}
      />
    </>
  );
};

export default EventAnalysingResultsPage;
