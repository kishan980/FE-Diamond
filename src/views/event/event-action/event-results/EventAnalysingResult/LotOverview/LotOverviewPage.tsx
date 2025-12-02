'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Divider from '@mui/material/Divider';
import { LotOverviewMainContainer } from '../EventAnalysingResults.styled';
import LotOverviewTableBody from './LotOverviewTableBody';
import LotOverviewTableHeader from './LotOverviewTableHeader';
import LotOverviewSubTable from './LotOverviewSubTable/LotOverviewSubTable';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { LoadingState } from 'types/table';
import { GetLotsOverviewTable1, GetLotsOverviewTable2, UpdateRefuseParams } from 'services/event/event-action/event-results/type';
import PrintLogo from 'components/logo/PrintLogo';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';

const LotOverviewPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventId = Number(id);
  const searchParams = useSearchParams();
  const seqNo = searchParams.get('seqNo');
  const eventCategoryID = searchParams.get('eventCategoryID');

  const [summaryData, setSummaryData] = useState<GetLotsOverviewTable1[]>([]);
  const [detailsData, setDetailsData] = useState<GetLotsOverviewTable2[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isConfirmLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('stockNo');

  const matchedLotSummary = summaryData.find((summary) => summary.SeqNo);

  const showFinalStatusCell =
    matchedLotSummary?.FinalLotStatus1 === null ||
    matchedLotSummary?.FinalLotStatus1 === '' ||
    matchedLotSummary?.FinalLotStatus1 === 'Consider';

  const fetchLotOverviewData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await EventResultsServices.getLotsOverviewData(eventId, Number(seqNo));
      if (typeof res !== 'string' && res.success) {
        setSummaryData(res.data[1]);
        setDetailsData(res.data[0]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching lot overview data:', error);
      toast.error('Error fetching lot overview data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, [eventId, seqNo]);

  const handleRefuseClick = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    try {
      const params: UpdateRefuseParams = { eventId, entityId: selectedEntityId, seqNo: Number(seqNo) };
      const res = await EventResultsServices.refuseBid(params);
      if (typeof res !== 'string' && res.success) {
        router.push(`/events/event-outcomes/analysing-outcome/${eventId}`);
        setIsConfirmDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error refusing bid:', error);
      toast.error('Error refusing bid.');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleOpenConfirmModal = (entityId: number) => {
    setSelectedEntityId(entityId);
    setIsConfirmDialogOpen(true);
  };

  useEffect(() => {
    fetchLotOverviewData();
  }, [fetchLotOverviewData]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      <LotOverviewMainContainer>
        <PrintLogo />
        <MainCard
          content={false}
          title="Lot Overview"
          headerClassName="print-card-hidden-title"
          secondary={<PrintIconButton title="Print" onClick={() => window.print()} />}
        >
          <TableContainer sx={{ mb: 2 }} className="print-table-container">
            <Table aria-label="collapsible table">
              <LotOverviewTableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                eventCategoryID={Number(eventCategoryID)}
              />
              <LotOverviewTableBody
                data={summaryData}
                loading={loading}
                page={page}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                eventCategoryID={Number(eventCategoryID)}
              />
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={summaryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ '& p': { m: 0 } }}
          />
        </MainCard>
        <LotOverviewSubTable {...{ detailsData, showFinalStatusCell, handleOpenConfirmModal, loading }} />
      </LotOverviewMainContainer>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleRefuseClick}
        loading={loading}
        title={'Are you sure you want to refuse the highest bid and consider an alternative one?'}
      />
    </>
  );
};

export default LotOverviewPage;
