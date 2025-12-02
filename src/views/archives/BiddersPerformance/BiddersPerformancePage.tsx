'use client';
import { useState, useEffect, FC } from 'react';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import BiddersPerformanceTableBody from '../BiddersPerformance/BiddersPerformanceTableBody';
import { StyledMainCard } from '../CommonArchives.styled';
import Loader from 'components/Loader';
import GenericFilter from 'components/UIComponent/Filters/GenericFilter/GenericFilter';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { StyledBidderFilterWrapper, StyledFilterLabel, CardHeaderIconContainer } from 'views/common.styled';
import { useTableControls } from 'utils/useTableControls';
import { BidderPerformanceDetailsServices } from 'services/archives/bidder-performance-details/bidderPerformanceDetails.services';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { BidderPerformancePageProps } from 'types/bidder';
import { BidderPerformanceDetailsData, BiddersListData } from 'services/archives/bidder-performance-details/type';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import CircularLoader from 'components/CircularLoader';
import { handleExcelExport } from 'utils/exportUtils';
import { BIDDERS_PERFORMANCE_HEAD_CELLS } from 'constants/tableHeadCells';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';

const BiddersPerformancePage: FC<BidderPerformancePageProps> = ({ entityType, pageTitle }) => {
  const [data, setData] = useState<BidderPerformanceDetailsData[]>([]);
  const [eventFilterList, setEventFilterList] = useState<BiddersListData[]>([]);
  const [fromDatePicker, setFromDatePicker] = useState<Date | null>(null);
  const [toDatePicker, setToDatePicker] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isCircularLoading: false,
    isExcelButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('SeqNo');

  const fetchBidderPerformanceDetailsData = async (
    startDate: string | null = fromDatePicker ? fromDatePicker.toISOString() : null,
    endDate: string | null = toDatePicker ? toDatePicker.toISOString() : null
  ) => {
    const searchParams = `${`entityId=${selectedEventId}`}&${`entityType=${entityType}`}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
    await handleFetchData<BidderPerformanceDetailsData[]>(
      () => BidderPerformanceDetailsServices.bidderPerformanceDetailsListData(searchParams),
      setData,
      setLoading
    );
  };

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchBidderPerformanceDetailsData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const fetchPastEventsFilterData = async () => {
    try {
      const res = await BidderPerformanceDetailsServices.biddersList(entityType);
      if (typeof res !== 'string' && res.success) setEventFilterList(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching biddersList filter:', error);
      toast.error('Failed to fetch biddersList filter');
    }
  };

  const handleResetFilters = async () => {
    setFromDatePicker(null);
    setToDatePicker(null);
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchBidderPerformanceDetailsData('', '');
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleExcelClick = (entityID: number) =>
    handleExcelExport(() => BidderPerformanceDetailsServices.exportExcel(entityID), setLoading, 'isCircularLoading');

  const handleExportExcelClick = () =>
    handleExcelExport(() => BidderPerformanceDetailsServices.excelExportBidderSummary(entityType), setLoading, 'isExcelButtonLoading');

  useEffect(() => {
    handleClickSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId]);

  useEffect(() => {
    fetchBidderPerformanceDetailsData();
    fetchPastEventsFilterData();
    checkDownloadAccess(setIsDownloadAccess);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <StyledMainCard
        content={false}
        title={pageTitle}
        secondary={
          <CardHeaderIconContainer alignItems="center !important" justifyContent="end">
            <StyledBidderFilterWrapper>
              <StyledFilterLabel>Select Bidder: </StyledFilterLabel>
              <GenericFilter
                filterdata={eventFilterList}
                valueKey="entityID"
                labelKey="co_name"
                selectedEventId={selectedEventId}
                handleSelectEvent={setSelectedEventId}
              />
            </StyledBidderFilterWrapper>
            {isDownloadAccess && data.length > 0 && !loading?.isProgress && (
              <DownloadCSVButton
                title="Export Bidders Performance Summary"
                onClick={handleExportExcelClick}
                isLoading={loading?.isExcelButtonLoading}
              />
            )}
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Events"
              headCells={BIDDERS_PERFORMANCE_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
              values={{ fromDatePicker, toDatePicker }}
              setFieldValue={(field: string, value: Date | null) => {
                if (field === 'fromDatePicker') setFromDatePicker(value);
                if (field === 'toDatePicker') setToDatePicker(value);
              }}
            />
            <BiddersPerformanceTableBody
              {...{ data, page, order, orderBy, loading, rowsPerPage, isDownloadAccess, entityType, onExcelClick: handleExcelClick }}
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
      </StyledMainCard>
    </>
  );
};

export default BiddersPerformancePage;
