'use client';
import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { StyledMainCard } from '../CommonAccount.styled';
import RoughBiddersTableBody from './RoughBiddersTableBody';
import { exportToExcelXML } from './ExportDataHeaderUtils';
import RoughBiddersDocumentListDialog from './DocumentListDialog';
import UploadRoughBiddersDialog from './UploadRoughBiddersDialog';
import { IconsMainBox, MainStyleBoxConatiner } from './RoughBidder.styled';
import Loader from 'components/Loader';
import ImportButton from 'components/UIComponent/IconButtons/ImportButton';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import DownloadXMLButton from 'components/UIComponent/IconButtons/DownloadXMLButton';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import { useTableControls } from 'utils/useTableControls';
import { handleFetchData } from 'utils/apiHelpers';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import { RoughbiddersData, RoughbiddersExcelList } from 'services/account/roughBidders/type';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import SmsIconButton from 'components/UIComponent/IconButtons/SmsButton';
import EmailInvitationDialog from 'components/UIComponent/Dialogs/EmailInvitationDialog/EmailInvitationDialog';
import { handleExcelExport, handleXMLExport } from 'utils/exportUtils';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';
import { ROUGH_BIDDER_HEAD_CELLS } from 'constants/tableHeadCells';

const RoughBiddersPage = () => {
  const [data, setData] = useState<RoughbiddersData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [selectedEntityID, setSelectedEntityID] = useState(0);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [XML, setXML] = useState(false);

  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
    isExcelButtonLoading: false,
    isXlsxButtonLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('entityID');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const fetchData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companySearch: filters.companyName }),
      ...(filters.contactPerson && { contactPersonSearch: filters.contactPerson }),
    }).toString();
    await handleFetchData<RoughbiddersData[]>(() => RoughBiddersServices.roughBiddersListData(searchQuery), setData, setLoading);
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

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allSelectedIds = data.map((item) => item.entityID);

      const allEmails = data.flatMap((item) => [item.emailID1, item.emailID2].filter((email): email is string => !!email));

      setSelected(allSelectedIds);
      setSelectedEmails(allEmails);
    } else {
      setSelected([]);
      setSelectedEmails([]);
    }
  };

  const handleClick = (id: number, emailID: string, emailID2: string) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected: number[] = [...selected];
    let newSelectedEmails: string[] = [...selectedEmails];

    if (selectedIndex === -1) {
      newSelected.push(id);
      if (emailID) newSelectedEmails.push(emailID);
      if (emailID2) newSelectedEmails.push(emailID2);
    } else {
      newSelected.splice(selectedIndex, 1);
      newSelectedEmails = newSelectedEmails.filter((email) => email !== emailID && email !== emailID2);
    }

    setSelected(newSelected);
    setSelectedEmails(newSelectedEmails);
  };

  const handleDeleteClick = useCallback((entityID: number) => {
    setSelectedEntityID(entityID);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedEntityID) return;

    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await RoughBiddersServices.delete(selectedEntityID);
      if (typeof res !== 'string' && res.success) {
        toast.success('Rough bidders deleted successfully');
        setData((prevData) => prevData.filter((item) => item.entityID !== selectedEntityID));
        setIsDeleteDialogOpen(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error deleting rough bidder.', e);
      toast.error('An error occurred while deleting the rough bidder.');
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
    handleXMLExport<RoughbiddersExcelList[]>(RoughBiddersServices.exportXml, 'RoughBidders.xml', exportToExcelXML, setLoading);

  const handleExportExcelClick = () => handleExcelExport(() => RoughBiddersServices.exportExcel(), setLoading, 'isExcelButtonLoading');

  const handleSendMail = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one rough bidder');
      return;
    }
    setIsEmailDialogOpen(true);
  };

  useEffect(() => {
    fetchData();
    checkDownloadAccess(setIsDownloadAccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (XML) handleExportXMLClick();
  }, [XML]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <StyledMainCard
        content={false}
        title="Manage Rough Bidders"
        secondary={
          <CardHeaderIconContainer ml="-8px !important">
            <MainStyleBoxConatiner>
              <IconsMainBox>
                {!loading?.isProgress && <ImportButton title="Import Bidders" onClick={() => setIsUploadFileDialogOpen(true)} />}
                {isDownloadAccess && data.length > 0 && !loading?.isProgress && (
                  <CardHeaderIconContainer>
                    <DownloadCSVButton
                      title="Export Rough Bidders List CSV"
                      onClick={handleExportExcelClick}
                      isLoading={loading?.isExcelButtonLoading}
                    />
                    <DownloadXMLButton
                      title="Export Rough Bidders List XML"
                      onClick={() => setXML(true)}
                      isLoading={loading?.isXlsxButtonLoading}
                    />
                  </CardHeaderIconContainer>
                )}
              </IconsMainBox>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SmsIconButton title="Send Mail" onClick={handleSendMail} disabled={loading?.isProgress} />
                <Link href={'/account/rough-bidders/upsert-rough-bidders'}>
                  <AddIconButton title="Create Rough Bidder" />
                </Link>
              </Box>
            </MainStyleBoxConatiner>
          </CardHeaderIconContainer>
        }
      >
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Bidders"
              headCells={ROUGH_BIDDER_HEAD_CELLS}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              searchFields={['companyName', 'contactPerson']}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              handleClickSearch={handleClickSearch}
              handleResetFilters={handleResetFilters}
              showCheckbox
            />
            <RoughBiddersTableBody
              {...{
                data,
                page,
                order,
                orderBy,
                loading,
                rowsPerPage,
                isSelected,
                handleClick,
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
      <UploadRoughBiddersDialog open={isUploadFileDialogOpen} handleClose={() => setIsUploadFileDialogOpen(false)} />
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure want to delete this rough bidder?"
        loading={loading}
      />
      {selectedCompanyName && (
        <RoughBiddersDocumentListDialog
          open={isDocumentDialogOpen}
          handleClose={() => setIsDocumentDialogOpen(false)}
          entityID={selectedEntityID}
          co_name={selectedCompanyName}
        />
      )}
      <EmailInvitationDialog
        open={isEmailDialogOpen}
        handleClose={() => setIsEmailDialogOpen(false)}
        selectedEmail={selectedEmails.join(',')}
        setSelected={setSelected}
        setSelectedEmails={setSelectedEmails}
      />
    </>
  );
};

export default RoughBiddersPage;
