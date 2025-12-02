'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import PerformanceDetails from './PerformanceDetails';
import BiddersPerformanceDetailsTableBody from './BiddersPerformanceDetailsTableBody';
import BiddersPerformanceDetailsTableHeader from './BiddersPerformanceDetailsTableHeader';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { BidderPerformanceDetailsServices } from 'services/archives/bidder-performance-details/bidderPerformanceDetails.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { BidderPerformanceData } from 'services/archives/bidder-performance-details/type';

const BiddersPerformanceDetailsPage = () => {
  const searchParams = useSearchParams();

  const eventId = Number(searchParams.get('eventId'));
  const entityType = searchParams.get('entityType');

  const [data, setData] = useState<BidderPerformanceData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const summaryDetails = useMemo(() => {
    const totalCts = data.reduce((sum, row) => sum + Number(row.cts || 0), 0);
    const totalValue = data.reduce((sum, row) => {
      const cleanValue = row.pvale?.replace(/,/g, '');
      const value = cleanValue !== undefined ? Number(cleanValue) : 0;
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return [
      { label: 'Total Weight (Carats):', value: totalCts },
      { label: 'Value Bought (US$):', value: totalValue },
    ];
  }, [data]);

  const fetchTenderBidsDetailsData = useCallback(async () => {
    await handleFetchData<BidderPerformanceData[]>(
      () => BidderPerformanceDetailsServices.getBidderPerformanceById(eventId),
      setData,
      setLoading
    );
  }, [eventId]);

  useEffect(() => {
    fetchTenderBidsDetailsData();
  }, [fetchTenderBidsDetailsData]);
  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <MainCard content={false} title={`${entityType} Bidder Performance Details`}>
      {data.length > 0 && <PerformanceDetails data={summaryDetails} />}
      <TableContainer sx={{ maxHeight: 430 }}>
        <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
          <BiddersPerformanceDetailsTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort, entityType }} />
          <BiddersPerformanceDetailsTableBody {...{ data, page, order, orderBy, loading, rowsPerPage, entityType }} />
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
  );
};

export default BiddersPerformanceDetailsPage;
