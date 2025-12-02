'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import LegalDocumentTableBody from './LegalDocumentTableBody';
import LegalDocumentTableHeader from './LegalDocumentTableHeader';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { LegalDocumentServices } from 'services/parameter/legalDocument/legalDocument.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { LegalDocumentData } from 'services/parameter/legalDocument/type';

const LegalDocumentPage = () => {
  const [data, setData] = useState<LegalDocumentData[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSeqNo, setSelectedSeqNo] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isDeleteLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const fetchData = useCallback(async () => {
    await handleFetchData<LegalDocumentData[]>(() => LegalDocumentServices.legalDocumentListData(), setData, setLoading);
  }, []);

  const handleDeleteClick = useCallback((seqNo: number) => {
    setSelectedSeqNo(seqNo);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSeqNo) return;

    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await LegalDocumentServices.deleteLegalDocument(selectedSeqNo);
      if (typeof res !== 'string' && res.success) {
        toast.success('Legal document deleted successfully');
        setData((prevData) => prevData.filter((item) => item.SeqNo !== selectedSeqNo));
        setIsDeleteDialogOpen(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error deleting legal document.', e);
      toast.error('An error occurred while deleting the legal document.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  }, [selectedSeqNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showLoader = useMemo(() => loading.isLoading && !loading.isProgress, [loading.isLoading, loading.isProgress]);

  if (showLoader) return <Loader />;

  return (
    <>
      <MainCard
        content={false}
        sx={{ '& .MuiCardHeader-root': { px: { xs: 1.5, sm: 2.5 }, gap: { xs: 0.5, sm: 1 } } }}
        title="Legal Documents"
        secondary={
          <Link href="/master-setup/legal-document/upsert-legal-document">
            <AddIconButton title="Add Document" />
          </Link>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <LegalDocumentTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort, rowCount: data.length }} />
            <LegalDocumentTableBody {...{ data, page, order, orderBy, loading, rowsPerPage, onDeleteClick: handleDeleteClick }} />
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
        title="Are you sure want to delete this legal document?"
      />
    </>
  );
};

export default LegalDocumentPage;
