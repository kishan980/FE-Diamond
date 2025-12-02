'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import MainCard from 'components/MainCard';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import RoughBidderDocumentModel from 'views/account/RoughBidders/RoughBidderDocumentModel';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, RoughBiddersDocumentProps } from 'types/table';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import { DocumentEntityWiseData } from 'services/account/roughBidders/type';
import DocumentTableHeader from 'views/account/DocumentListDialog/DocumentTableHeader';
import DocumentTableBody from 'views/account/DocumentListDialog/DocumentTableBody';

const RoughBiddersDocumentListDialog = ({ open, handleClose, entityID, co_name }: RoughBiddersDocumentProps) => {
  const [data, setData] = useState<DocumentEntityWiseData[]>([]);
  const [selectedSeqNo, setSelectedSeqNo] = useState<string>('');
  const [selectedDocPath, setSelectedDocPath] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openSingleFileDialog, setOpenSingleFileDialog] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isDeleteLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const selectedDoc = data.find((doc) => doc.SeqNo === selectedSeqNo);
  const docName = selectedDoc ? selectedDoc.Docname : '';
  const refSeqNo = selectedDoc ? selectedDoc.refSeqNo_DocTypeCheckList : '';

  const handleSingleFileClick = (seqNo: string, docPath: string) => {
    setSelectedSeqNo(seqNo);
    setSelectedDocPath(docPath);
    setOpenSingleFileDialog(true);
  };

  const handleDeleteClick = (seqNo: string) => {
    setSelectedSeqNo(seqNo);
    setIsDeleteDialogOpen(true);
  };

  const handleMoreMenuClick = async (docPath: string) => {
    if (docPath?.trim()) window.open(docPath, '_blank');
  };

  const handleDeleteDialog = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const deletePolishedbiddersData = await RoughBiddersServices.deleteDocumentByEntity(entityID, Number(selectedSeqNo));
      if (typeof deletePolishedbiddersData !== 'string' && deletePolishedbiddersData.success) {
        toast.success('Document deleted successfully');
        setData((prevData) => prevData.filter((item) => item.SeqNo !== selectedSeqNo));
        setIsDeleteDialogOpen(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error deleting document.', e);
      toast.error('Error deleting document.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const fetchDocumentListData = async () =>
    await handleFetchData<DocumentEntityWiseData[]>(() => RoughBiddersServices.getDocumentsByEntityId(entityID), setData, setLoading);

  useEffect(() => {
    fetchDocumentListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityID]);

  return loading.isLoading && !loading.isProgress ? (
    <CircularLoader isProgress={loading.isProgress || loading.isLoading} />
  ) : (
    <>
      <CustomDialog
        open={open}
        onClose={handleClose}
        content={
          <Box sx={{ mt: 2 }}>
            <MainCard content={false} title="Manage Legal Document">
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                  <DocumentTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} companyNameSearch={co_name} />
                  <DocumentTableBody
                    data={data}
                    page={page}
                    order={order}
                    orderBy={orderBy}
                    loading={loading}
                    rowsPerPage={rowsPerPage}
                    onMoreMenuClick={handleMoreMenuClick}
                    onSingleFileClick={handleSingleFileClick}
                    onDeleteClick={handleDeleteClick}
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
          </Box>
        }
      />

      {/* Dialogs */}
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDialog}
        title="Are you sure want to delete this document?"
        loading={loading}
      />
      <RoughBidderDocumentModel
        open={openSingleFileDialog}
        handleClose={() => setOpenSingleFileDialog(false)}
        entityID={entityID}
        selectedSeqNo={selectedSeqNo}
        docName={docName}
        selectedDocPath={selectedDocPath}
        refSeqNo={refSeqNo}
        fetchData={fetchDocumentListData}
      />
    </>
  );
};

export default RoughBiddersDocumentListDialog;
