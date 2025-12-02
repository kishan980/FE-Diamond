'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { StyledMainCard } from '../CommonArchives.styled';
import CustomisedReportsTableBody from './CustomisedReportsTableBody';
import CustomisedReportsTableHeader from './CustomisedReportsTableHeader';
import Loader from 'components/Loader';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { useTableControls } from 'utils/useTableControls';
import { CustomisedReportsServices } from 'services/archives/customisedReports/customisedReports.services';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { CustomisedReportsData } from 'services/archives/customisedReports/types';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import CircularLoader from 'components/CircularLoader';
import { handleExcelExport } from 'utils/exportUtils';

const CustomisedReportsPage = () => {
  const [data, setData] = useState<CustomisedReportsData[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSeqNo, setSelectedSeqNo] = useState<number | null>(null);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isCircularLoading: false,
    isDeleteLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const fetchCustomisedReportsData = useCallback(async () => {
    await handleFetchData<CustomisedReportsData[]>(() => CustomisedReportsServices.customisedReportsListData(0), setData, setLoading);
  }, []);

  const handleDeleteClick = (seqNo: number) => {
    setSelectedSeqNo(seqNo);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await CustomisedReportsServices.delete(Number(selectedSeqNo));
      if (typeof res !== 'string' && res.success) {
        toast.success('Customised Reports deleted successfully');
        setData((prev) => prev.filter((item) => item.SeqNo !== selectedSeqNo));
        setIsDeleteDialogOpen(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error deleting customised Reports.', e);
      toast.error('Error deleting customised Reports.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  }, [selectedSeqNo]);

  const handleExportExcelClick = (seqNo: number) =>
    handleExcelExport(() => CustomisedReportsServices.exportExcel(seqNo), setLoading, 'isCircularLoading');

  useEffect(() => {
    fetchCustomisedReportsData();
    checkDownloadAccess(setIsDownloadAccess);
  }, [fetchCustomisedReportsData]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <StyledMainCard
        content={false}
        title="Customised Reports"
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Link href="/history/customised-reports/upsert-customised-reports">
              <AddIconButton title="Create Customised Report" />
            </Link>
          </Box>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CustomisedReportsTableHeader {...{ order, orderBy, rowCount: data.length, onRequestSort: handleRequestSort }} />
            <CustomisedReportsTableBody
              {...{
                data,
                page,
                order,
                orderBy,
                rowsPerPage,
                loading,
                isDownloadAccess,
                onDeleteClick: handleDeleteClick,
                onExcelClick: handleExportExcelClick,
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
      </StyledMainCard>
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure want to delete this customised report?"
        loading={loading}
      />
    </>
  );
};

export default CustomisedReportsPage;
