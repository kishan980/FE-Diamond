'use client';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { StyledMainCard } from '../CommonAccount.styled';
import AdministratorsTableBody from './AdministratorsTableBody';
import Loader from 'components/Loader';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { useTableControls } from 'utils/useTableControls';
import { AdministratorServices } from 'services/account/administrators/administrators.services';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { AdministratorsData } from 'services/account/administrators/type';
import { HeadCell, LoadingState, SearchFilters } from 'types/table';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import { handleExcelExport } from 'utils/exportUtils';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';
import { ADMINISTRATORS_HEAD_CELLS, ADMINISTRATORS_STATUS_HEAD_CELLS } from 'constants/tableHeadCells';

const AdministratorsPage = () => {
  const [data, setData] = useState<AdministratorsData[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedEntityNo, setSelectedEntityNo] = useState(0);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
    isExcelButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('seqno');

  const fetchData = async (filters: SearchFilters = searchFilters) =>
    await handleFetchData<AdministratorsData[]>(() => AdministratorServices.getList(filters?.contactPerson), setData, setLoading);

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchData({});
  };

  const handleDeleteClick = (entityID: number) => {
    setSelectedEntityNo(entityID);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await AdministratorServices.delete(selectedEntityNo);
      if (typeof res !== 'string' && res.success) {
        toast.success('Administrators deleted successfully');
        setData((prevData) =>
          prevData.map((row) =>
            row.entityID === selectedEntityNo ? { ...row, IsActive: row.IsActive === 'Active' ? 'Deactive' : 'Active' } : row
          )
        );
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting administrator.', error);
      toast.error('An error occurred while deleting the administrator.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleExportExcelClick = () => handleExcelExport(() => AdministratorServices.exportExcel(), setLoading, 'isExcelButtonLoading');

  useEffect(() => {
    fetchData();
    checkDownloadAccess(setIsDownloadAccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headCells: HeadCell[] = useMemo(() => {
    return isDownloadAccess
      ? [...ADMINISTRATORS_HEAD_CELLS.slice(0, 5), ADMINISTRATORS_STATUS_HEAD_CELLS, ADMINISTRATORS_HEAD_CELLS[5]]
      : ADMINISTRATORS_HEAD_CELLS;
  }, [isDownloadAccess]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <StyledMainCard
        content={false}
        title="Manage Administrators"
        secondary={
          <CardHeaderIconContainer sx={{ justifyContent: 'end' }}>
            {isDownloadAccess && !loading?.isProgress && data.length > 0 && (
              <DownloadCSVButton
                title="Export Administrators List Excel"
                onClick={handleExportExcelClick}
                isLoading={loading.isExcelButtonLoading}
              />
            )}
            <Link href="/account/administrators/upsert-administrators">
              <AddIconButton title="Create Administrator" />
            </Link>
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Administrators"
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              searchFields={['contactPerson']}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
            />
            <AdministratorsTableBody
              {...{ data, page, order, orderBy, loading, rowsPerPage, isDownloadAccess, onDeleteClick: handleDeleteClick }}
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
        title="Are you sure want to delete this administrator?"
        loading={loading}
      />
    </>
  );
};

export default AdministratorsPage;
