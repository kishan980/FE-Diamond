'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import ViewersTableBody from './ViewersTableBody';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { ViewersServices } from 'services/account/viewers/viewers.services';
import { useTableControls } from 'utils/useTableControls';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { ViewersData } from 'services/account/viewers/type';
import { LoadingState, SearchFilters } from 'types/table';
import { CardHeaderIconContainer } from 'views/common.styled';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import { handleExcelExport } from 'utils/exportUtils';
import { VIEWER_HEAD_CELLS } from 'constants/tableHeadCells';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';

const ViewersPage = () => {
  const [data, setData] = useState<ViewersData[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntityNo, setSelectedEntityNo] = useState<number | null>(null);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
    isExcelButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('entityID');

  const fetchViewerData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companySearch: filters.companyName }),
      ...(filters.contactPerson && { contactPersonSearch: filters.contactPerson }),
    }).toString();
    await handleFetchData<ViewersData[]>(() => ViewersServices.getList(searchQuery), setData, setLoading);
  };

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchViewerData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchViewerData({});
  };

  const handleDeleteClick = (entityID: number) => {
    setSelectedEntityNo(entityID);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const deleteViewersData = await ViewersServices.updateStatus(Number(selectedEntityNo));
      if (typeof deleteViewersData !== 'string' && deleteViewersData.success) {
        toast.success('Viewers deleted successfully');
        setData((prevData) =>
          prevData.map((row) =>
            row.entityID === selectedEntityNo ? { ...row, IsActive: row.IsActive === 'Active' ? 'Deactive' : 'Active' } : row
          )
        );
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting viewer.', error);
      toast.error('Error deleting viewer.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleExportExcelClick = () => handleExcelExport(() => ViewersServices.exportExcel(), setLoading, 'isExcelButtonLoading');

  useEffect(() => {
    fetchViewerData();
    checkDownloadAccess(setIsDownloadAccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <MainCard
        content={false}
        title="Manage Viewers"
        secondary={
          <CardHeaderIconContainer>
            {isDownloadAccess && data.length > 0 && (
              <DownloadCSVButton
                title="Export Viewer List Excel"
                onClick={handleExportExcelClick}
                isLoading={loading.isExcelButtonLoading}
              />
            )}
            <Link href="/account/viewers/upsert-viewers">
              <AddIconButton title="Create Viewer" />
            </Link>
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Viewers"
              headCells={VIEWER_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              searchFields={['companyName', 'contactPerson']}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
            />
            <ViewersTableBody
              data={data}
              page={page}
              order={order}
              orderBy={orderBy}
              loading={loading}
              rowsPerPage={rowsPerPage}
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
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure want to delete this viewer?"
        loading={loading}
      />
    </>
  );
};

export default ViewersPage;
