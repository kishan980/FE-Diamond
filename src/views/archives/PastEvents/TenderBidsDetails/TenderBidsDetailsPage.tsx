'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TenderBidsDetailsDialog from './Dialog/TenderBidsDetailsDialog';
import TenderBidsDetailsTableBody from './TenderBidsDetailsTableBody';
import TenderBidsDetailsTableHeader from './TenderBidsDetailsTableHeader';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LoginDialog from 'components/UIComponent/Dialogs/LoginDialog/LoginDialog';
import PerformanceDetails from 'views/archives/BiddersPerformance/BiddersPerformanceDetails/PerformanceDetails';
import { LoadingState } from 'types/table';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { PastEventsServices } from 'services/archives/pastEvents/pastEvents.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import {
  GetCancelBiddingData,
  GetTenderHistoryData,
  GetTenderHistoryParams,
  TenderBidsDetailsData,
} from 'services/archives/pastEvents/types';
import CircularLoader from 'components/CircularLoader';

const TenderBidsDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = Number(searchParams.get('eventId'));
  const eventCategoryID = Number(searchParams.get('eventCategoryID'));

  const [data, setData] = useState<TenderBidsDetailsData[]>([]);
  const [cancelBiddingData, setCancelBiddingData] = useState<GetCancelBiddingData[]>([]);
  const [tenderHistoryData, setTenderHistoryData] = useState<GetTenderHistoryData[]>([]);
  const [selectedSeqId, setSelectedSeqId] = useState<number | null>(null);

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isTenderHistoryDialogOpen, setIsTenderHistoryDialogOpen] = useState(false);

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isCircularLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const totalAmount = useMemo(() => data.reduce((sum, row) => sum + (row.cts * row.rate || 0), 0), [data]);
  const totalLotsValue = useMemo(() => data.reduce((sum, row) => sum + Number(row.valuesold || 0), 0), [data]);

  const summaryDetails = useMemo(
    () => [
      { label: 'Total Grand:', value: totalAmount },
      { label: 'Total Value Sold:', value: totalLotsValue },
    ],
    [totalAmount, totalLotsValue]
  );

  const fetchTenderBidsDetailsData = useCallback(async () => {
    await handleFetchData<TenderBidsDetailsData[]>(() => PastEventsServices.tenderBidsDetailsListData(eventId), setData, setLoading);
  }, [eventId]);

  const handleDetailsClick = async (seqNo: number) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    try {
      const params: GetTenderHistoryParams = {
        eventId,
        seqNo,
      };

      const [historyRes, cancelRes] = await Promise.all([
        PastEventsServices.getTenderHistory(params),
        PastEventsServices.GetCancelBiddingData(params),
      ]);

      if (typeof historyRes !== 'string' && historyRes.success) {
        setTenderHistoryData(historyRes.data);
      }
      if (typeof cancelRes !== 'string' && cancelRes.success) {
        setCancelBiddingData(cancelRes.data);
      }
      setIsTenderHistoryDialogOpen(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching tender history data:', error);
      toast.error('Error fetching tender history data.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handleModifyClick = (seqNo: number) => {
    setSelectedSeqId(seqNo);
    setIsLoginDialogOpen(true);
  };

  const handleLoginModalCilck = async (password: string, setSubmitting: (isSubmitting: boolean) => void, onSuccess: () => void) => {
    try {
      const res = await PastEventsServices.modifyBidAccess({ password });

      if (typeof res !== 'string' && res.success && res.data.length > 0) {
        onSuccess();
        router.push(`/history/past-events/cancel-winning-bid?eventId=${eventId}&eventCategoryID=${eventCategoryID}&seqId=${selectedSeqId}`);
      } else {
        toast.error('Invalid password. Please try again.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error logging in handleLoginModalCilck:', error);
      toast.error('An error occurred while logging in.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTenderBidsDetailsData();
  }, [fetchTenderBidsDetailsData]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <MainCard content={false} title="Tender Bids Details">
        {data.length > 0 && <PerformanceDetails data={summaryDetails} />}
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <TenderBidsDetailsTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort, eventCategoryID }} />
            <TenderBidsDetailsTableBody
              data={data}
              page={page}
              order={order}
              orderBy={orderBy}
              loading={loading}
              rowsPerPage={rowsPerPage}
              eventCategoryID={eventCategoryID}
              onDetailsClick={handleDetailsClick}
              onModifyClick={handleModifyClick}
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
      <TenderBidsDetailsDialog
        open={isTenderHistoryDialogOpen}
        handleClose={() => setIsTenderHistoryDialogOpen(false)}
        cancelBiddingData={cancelBiddingData}
        tenderHistoryData={tenderHistoryData}
        eventCategoryID={eventCategoryID}
      />
      <LoginDialog open={isLoginDialogOpen} handleClose={() => setIsLoginDialogOpen(false)} handleLoginModalCilck={handleLoginModalCilck} />
    </>
  );
};

export default TenderBidsDetailsPage;
