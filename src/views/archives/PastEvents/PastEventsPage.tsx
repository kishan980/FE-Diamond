'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import PastEventsTableBody from './PastEventsTableBody';
import ExportExcelReportModel from './ExportExcelReport/ExportExcelReportModel';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import ExcelDialog from 'components/UIComponent/Dialogs/ExcelDialog/ExcelDialog';
import GenericFilter from 'components/UIComponent/Filters/GenericFilter/GenericFilter';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { StyledBidderFilterWrapper, StyledFilterLabel, CardHeaderIconContainer } from 'views/common.styled';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { PastEventsServices } from 'services/archives/pastEvents/pastEvents.services';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { LoadingState } from 'types/table';
import { PastEventSeachData, UpdatePastEventsEmergencyParams } from 'services/archives/pastEvents/types';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import CircularLoader from 'components/CircularLoader';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';
import { PAST_EVENTS_HEAD_CELLS } from 'constants/tableHeadCells';

const PastEventsPage = () => {
  const [eventList, setEventList] = useState<PastEventSeachData[]>([]);
  const [eventFilterList, setEventFilterList] = useState<PastEventSeachData[]>([]);
  const [sellerData, setSellerData] = useState<SellingData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedSellerId, setSelectedSellerId] = useState(0);
  const [fromDatePicker, setFromDatePicker] = useState<Date | null>(null);
  const [toDatePicker, setToDatePicker] = useState<Date | null>(null);

  const [excelDialogEventId, setExcelDialogEventId] = useState<number | null>(null);
  const [excelDialogCategoryId, setExcelDialogCategoryId] = useState<number | null>(null);

  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);

  const [dataGetLoader, setDataGetLoader] = useState<'dataWith' | 'dataWithout' | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isCircularLoading: false });
  const [isPastEventsInitialLoad, setIsPastEventsInitialLoad] = useState(true);

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('auTen_EvtId');

  const fetchPastEvents = useCallback(
    async (
      startDate: string | null = fromDatePicker ? fromDatePicker.toISOString() : null,
      endDate: string | null = toDatePicker ? toDatePicker.toISOString() : null,
      entityId: number | null = selectedSellerId || 0
    ) => {
      setLoading((prev) => ({ ...prev, isProgress: true }));
      try {
        const searchParams = `${entityId ? `entityId=${entityId}` : `entityId=${entityId}`}&eventId=${selectedEventId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
        const res = await PastEventsServices.pastEventSearchListData(searchParams);
        if (typeof res !== 'string' && res.success) setEventList(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching past events.', error);
        toast.error('Failed to fetch past events');
      } finally {
        setIsPastEventsInitialLoad(false);
        setLoading((prev) => ({ ...prev, isProgress: false }));
      }
    },
    [fromDatePicker, selectedEventId, selectedSellerId, toDatePicker]
  );

  const fetchEventFilters = useCallback(async () => {
    try {
      const searchParams = 'entityId=0&eventId=0';
      const res = await PastEventsServices.pastEventSearchListData(searchParams);
      if (typeof res !== 'string' && res.success) setEventFilterList(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event filters.', error);
      toast.error('An error occurred while fetching event filters');
    }
  }, []);

  const fetchSellerData = useCallback(async () => {
    await handleFetchData<SellingData[]>(SellingCompanyServices.sellingListData, setSellerData, setLoading);
  }, []);

  const handleClickSearch = async () => {
    await fetchPastEvents();
    setPage(0);
  };

  const handleResetFilters = async () => {
    setFromDatePicker(null);
    setToDatePicker(null);
    setSelectedSellerId(0);
    await fetchPastEvents('', '', 0);
  };

  const handleExcelButtonClick = async (auTen_EvtId: number, categoryId: number) => {
    setExcelDialogEventId(auTen_EvtId);
    setExcelDialogCategoryId(categoryId);
    setIsExcelDialogOpen(true);
  };

  const handleDownloadEmergency = async (actionType: number) => {
    if (!excelDialogEventId || !excelDialogCategoryId) return;

    setDataGetLoader(actionType === 2 ? 'dataWith' : 'dataWithout');
    try {
      const params: UpdatePastEventsEmergencyParams = {
        eventId: excelDialogEventId,
        eventCategory: excelDialogCategoryId,
        type: actionType,
      };

      const response = await PastEventsServices.pastEventsDownloadEmergency(params);

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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleDownloadEmergency:', error);
      toast.error(`An error occurred while ${actionType === 1 ? 'granting' : 'denying'} data`);
    } finally {
      setDataGetLoader(null);
      setIsExcelDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchEventFilters();
    checkDownloadAccess(setIsDownloadAccess);
    fetchSellerData();
  }, [fetchEventFilters, fetchSellerData]);

  useEffect(() => {
    fetchPastEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <MainCard
        content={false}
        sx={{ '& .MuiCardHeader-root': { px: { xs: 1.5, sm: 2.5 }, gap: { xs: 0.5, sm: 1 } } }}
        title="Past Events"
        secondary={
          <CardHeaderIconContainer alignItems="center !important">
            <StyledBidderFilterWrapper>
              <StyledFilterLabel>Select Event:</StyledFilterLabel>
              <GenericFilter
                filterdata={eventFilterList}
                valueKey="auTen_EvtId"
                labelKey="auTen_EvtId"
                selectedEventId={selectedEventId}
                handleSelectEvent={setSelectedEventId}
              />
            </StyledBidderFilterWrapper>
            {isDownloadAccess && eventList.length > 0 && !loading?.isProgress && (
              <DownloadCSVButton title="Export Excel" onClick={() => setIsExportDialogOpen(true)} />
            )}
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Events"
              headCells={PAST_EVENTS_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
              sellerData={sellerData}
              selectedSellerId={selectedSellerId}
              handleChangeSellerTypeSearch={setSelectedSellerId}
              values={{ fromDatePicker, toDatePicker }}
              setFieldValue={(field: string, value: Date | null) => {
                if (field === 'fromDatePicker') setFromDatePicker(value);
                if (field === 'toDatePicker') setToDatePicker(value);
              }}
            />
            <PastEventsTableBody
              data={eventList}
              page={page}
              order={order}
              orderBy={orderBy}
              loading={loading}
              rowsPerPage={rowsPerPage}
              isDownloadAccess={isDownloadAccess}
              onExcelClick={handleExcelButtonClick}
              isPastEventsInitialLoading={isPastEventsInitialLoad}
            />
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={eventList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ '& p': { m: 0 } }}
        />
      </MainCard>
      <ExportExcelReportModel
        open={isExportDialogOpen}
        handleClose={() => setIsExportDialogOpen(false)}
        isDownloadAccess={isDownloadAccess}
        startDate={fromDatePicker}
        endDate={toDatePicker}
      />
      <ExcelDialog
        open={isExcelDialogOpen}
        handleClose={() => setIsExcelDialogOpen(false)}
        handleDataWithFormula={() => handleDownloadEmergency(2)}
        handleDataWithoutFormula={() => handleDownloadEmergency(1)}
        title="Please select the type of Excel report generated:"
        dataGetLoader={dataGetLoader}
      />
    </>
  );
};

export default PastEventsPage;
