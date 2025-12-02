'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import EmailTemplatesTableHeader from './EmailTemplatesTableHeader';
import EmailTemplatesTableBody from './EmailTemplatesTableBody';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { EmailTemplateServices } from 'services/parameter/emailTemplate/emailTemplate.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { EmailTemplateData } from 'services/parameter/emailTemplate/type';

const EmailTemplatesPage = () => {
  const [data, setData] = useState<EmailTemplateData[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSeqNo, setSelectedSeqNo] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isDeleteLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const fetchData = async () =>
    await handleFetchData<EmailTemplateData[]>(() => EmailTemplateServices.emailTemplateListData(), setData, setLoading);

  const handleDeleteClick = useCallback((seqNo: number) => {
    setSelectedSeqNo(seqNo);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSeqNo) return;

    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await EmailTemplateServices.deleteEmailTemplate(selectedSeqNo);
      if (typeof res !== 'string' && res.success) {
        toast.success('Email template deleted successfully');
        setData((prevData) => prevData.filter((item) => item.SeqNo !== selectedSeqNo));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting email template', error);
      toast.error('An error occurred while deleting the email template.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  }, [selectedSeqNo]);

  useEffect(() => {
    fetchData();
  }, []);

  const showLoader = useMemo(() => loading.isLoading && !loading.isProgress, [loading.isLoading, loading.isProgress]);

  if (showLoader) return <Loader />;

  return (
    <>
      <MainCard
        content={false}
        title="Email Templates"
        secondary={
          <Link href="/master-setup/email-templates/upsert-email-templates">
            <AddIconButton title="Add Template" />
          </Link>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <EmailTemplatesTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort }} />
            <EmailTemplatesTableBody {...{ data, page, order, orderBy, loading, rowsPerPage, onDeleteClick: handleDeleteClick }} />
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
        title="Are you sure want to delete this email template?"
      />
    </>
  );
};

export default EmailTemplatesPage;
