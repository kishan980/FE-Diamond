'use client';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import SellingCompanyTableBody from './SellingCompanyTableBody';
import { StyledMainCard } from './SellingCompany.styled';
import Loader from 'components/Loader';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import { handleExcelExport } from 'utils/exportUtils';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';
import { SELLING_COMPANY_HEAD_CELLS } from 'constants/tableHeadCells';

const SellingCompanyPage = () => {
  const [data, setData] = useState<SellingData[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedEntityID, setSelectedEntityID] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isConfirmLoading: false,
    isExcelButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('entityID');

  const fetchSellingCompanyData = async () =>
    await handleFetchData<SellingData[]>(() => SellingCompanyServices.sellingListData(searchFilters?.companyName), setData, setLoading);

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchSellingCompanyData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleExportExcelClick = () => handleExcelExport(() => SellingCompanyServices.exportExcel(), setLoading, 'isExcelButtonLoading');

  const handleDialogConfirm = async () => {
    if (!selectedEntityID) return;

    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));

    try {
      const updated = await SellingCompanyServices.updateStatus(selectedEntityID);
      if (typeof updated !== 'string' && updated.success) {
        setData((prev) =>
          prev.map((item) =>
            item.entityID === selectedEntityID ? { ...item, IsActive: item.IsActive === 'Active' ? 'Deactive' : 'Active' } : item
          )
        );
        setIsConfirmDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating status.', error);
      toast.error('Error updating status.');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleWebsiteClick = async (url: string) => {
    if (!url?.trim()) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  const openConfirmDialog = (entityID: number) => {
    setIsConfirmDialogOpen(true);
    setSelectedEntityID(entityID);
  };

  useEffect(() => {
    fetchSellingCompanyData();
    checkDownloadAccess(setIsDownloadAccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLoader = useMemo(() => loading.isLoading && !loading.isProgress, [loading]);

  if (showLoader) return <Loader />;

  return (
    <>
      <StyledMainCard
        content={false}
        title="Selling Company"
        secondary={
          <CardHeaderIconContainer justifyContent="end">
            {isDownloadAccess && data.length > 0 && !loading?.isProgress && (
              <DownloadCSVButton
                title="Export Selling Company List"
                onClick={handleExportExcelClick}
                isLoading={loading?.isExcelButtonLoading}
              />
            )}
            <Link href="/master-setup/selling-Company/upsert-selling-comapny">
              <AddIconButton title="Create Selling Company" />
            </Link>
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Sellers"
              headCells={SELLING_COMPANY_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              searchFields={['companyName']}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              handleClickSearch={handleClickSearch}
            />
            <SellingCompanyTableBody
              {...{
                data,
                page,
                order,
                orderBy,
                loading,
                rowsPerPage,
                onStatusToggle: openConfirmDialog,
                onWebsiteLinkClick: handleWebsiteClick,
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
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        loading={loading}
        title={'Are you sure you want to change selling company Status?'}
      />
    </>
  );
};

export default SellingCompanyPage;
