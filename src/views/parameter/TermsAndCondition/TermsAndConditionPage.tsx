'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import TermsAndConditionTableBody from './TermsAndConditionTableBody';
import TermsAndConditionTableHeader from './TermsAndConditionTableHeader';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { TermsAndConditionServices } from 'services/parameter/termsAndCondition/termsAndCondition.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { TermsAndConditionData } from 'services/parameter/termsAndCondition/type';

const TermsAndConditionPage = () => {
  const [data, setData] = useState<TermsAndConditionData[]>([]);
  const [selectedSeqNo, setSelectedSeqNo] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const fetchData = useCallback(async () => {
    await handleFetchData<TermsAndConditionData[]>(() => TermsAndConditionServices.termsAndConditionData(), setData, setLoading);
  }, []);

  const handleDeleteClick = useCallback((seqNo: number) => {
    setSelectedSeqNo(seqNo);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSeqNo) return;

    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await TermsAndConditionServices.deleteTermsAndCondition(selectedSeqNo);
      if (typeof res !== 'string' && res.success) {
        toast.success('Term & Condition deleted successfully');
        setData((prevData) => prevData.filter((item) => item.SeqNo !== selectedSeqNo));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting Term & Condition', error);
      toast.error('An error occurred while deleting the Term & Condition.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  }, [selectedSeqNo]);

  const handleViewPDFClick = async (description: string) => {
    if (description?.trim()) window.open(description, '_blank');
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showLoader = useMemo(() => loading.isLoading && !loading.isProgress, [loading.isLoading, loading.isProgress]);

  if (showLoader) return <Loader />;

  return (
    <>
      <MainCard
        content={false}
        title="Term & Condition"
        sx={{ '& .MuiCardHeader-root': { px: { xs: 1.5, sm: 2.5 }, gap: { xs: 0.5, sm: 1 } } }}
        secondary={
          <Link href="/master-setup/term-and-condition/upsert-term-and-condition">
            <AddIconButton title="Create Term & Condition" />
          </Link>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <TermsAndConditionTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort }} />
            <TermsAndConditionTableBody
              {...{
                data,
                page,
                order,
                loading,
                orderBy,
                rowsPerPage,
                onDeleteClick: handleDeleteClick,
                onViewPDFClick: handleViewPDFClick,
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
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        title="Are you sure want to delete this term & condition?"
      />
    </>
  );
};

export default TermsAndConditionPage;
