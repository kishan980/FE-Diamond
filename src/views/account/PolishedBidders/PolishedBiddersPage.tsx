'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { StyledMainCard } from '../CommonAccount.styled';
import PolishedBiddersTableBody from './PolishedBiddersTableBody';
import { exportToExcelXML } from './ExportDataHeaderUtils';
import PolishedBiddersDocumentListDialog from './DocumentListDialog';
import { PolishedbiddersData, PolishedBiddersExcelList } from 'services/account/polishedBidders/type';
import Loader from 'components/Loader';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import DownloadXMLButton from 'components/UIComponent/IconButtons/DownloadXMLButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { useTableControls } from 'utils/useTableControls';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { PolishedBiddersServices } from 'services/account/polishedBidders/polishedBidders.services';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import { handleExcelExport, handleXMLExport } from 'utils/exportUtils';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';
import { POLISHED_BIDDER_HEAD_CELLS } from 'constants/tableHeadCells';

const PolishedBiddersPage = () => {
  const [data, setData] = useState<PolishedbiddersData[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [selectedEntityID, setSelectedEntityID] = useState<number | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
    isExcelButtonLoading: false,
    isXlsxButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('entityID');

  const fetchData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companySearch: filters.companyName }),
      ...(filters.contactPerson && { contactPersonSearch: filters.contactPerson }),
    }).toString();
    await handleFetchData<PolishedbiddersData[]>(() => PolishedBiddersServices.getList(searchQuery), setData, setLoading);
  };

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
    setSelectedEntityID(entityID);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await PolishedBiddersServices.delete(selectedEntityID);
      if (typeof res !== 'string' && res.success) {
        toast.success('Polished bidders deleted successfully');
        setData((prevData) => prevData.filter((item) => item.entityID !== selectedEntityID));
        setIsDeleteDialogOpen(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error deleting polished bidders.', e);
      toast.error('An error occurred while deleting the polished bidders.');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleOpenDocuments = (entityID: number, co_name: string) => {
    setSelectedEntityID(entityID);
    setSelectedCompanyName(co_name);
    setIsDocumentDialogOpen(true);
  };

  const handleExportXMLClick = () =>
    handleXMLExport<PolishedBiddersExcelList[]>(PolishedBiddersServices.exportXml, 'PolishedBidders.xml', exportToExcelXML, setLoading);

  const handleExportExcelClick = () => handleExcelExport(() => PolishedBiddersServices.exportExcel(), setLoading, 'isExcelButtonLoading');

  useEffect(() => {
    fetchData();
    checkDownloadAccess(setIsDownloadAccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <StyledMainCard
        content={false}
        title="Manage Polished Bidders"
        secondary={
          <CardHeaderIconContainer sx={{ justifyContent: 'end' }}>
            {isDownloadAccess && !loading?.isProgress && data.length > 0 && (
              <CardHeaderIconContainer>
                <DownloadCSVButton
                  title="Export Polished Bidders List Excel"
                  onClick={handleExportExcelClick}
                  isLoading={loading?.isExcelButtonLoading}
                />
                <DownloadXMLButton
                  title="Export Polished Bidders List XML"
                  onClick={handleExportXMLClick}
                  isLoading={loading?.isXlsxButtonLoading}
                />
              </CardHeaderIconContainer>
            )}
            <Link href={'/account/polished-bidders/upsert-polished-bidders'}>
              <AddIconButton title="Create Polished Bidder" />
            </Link>
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Bidders"
              headCells={POLISHED_BIDDER_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              searchFields={['companyName', 'contactPerson']}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
            />
            <PolishedBiddersTableBody
              {...{
                data,
                page,
                order,
                orderBy,
                loading,
                rowsPerPage,
                onDocumentClick: handleOpenDocuments,
                onDeleteClick: handleDeleteClick,
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
        title="Are you sure want to delete this polished bidder?"
        loading={loading}
      />
      {selectedEntityID && selectedCompanyName && (
        <PolishedBiddersDocumentListDialog
          open={isDocumentDialogOpen}
          handleClose={() => setIsDocumentDialogOpen(false)}
          entityID={selectedEntityID}
          co_name={selectedCompanyName}
        />
      )}
    </>
  );
};

export default PolishedBiddersPage;
