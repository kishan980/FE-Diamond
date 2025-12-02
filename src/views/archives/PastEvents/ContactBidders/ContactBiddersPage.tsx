'use client';
import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Sms } from 'iconsax-react';
import Button from '@mui/material/Button';
import ContactBiddersTableBody from './ContactBiddersTableBody';
import ContactBiddersTableHeader from './ContactBiddersTableHeader';
import ContactEmailBiddersDialog from './ContactEmailBiddersDialog';
import Loader from 'components/Loader';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { PastEventsServices } from 'services/archives/pastEvents/pastEvents.services';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import {
  GetContactBiddersData,
  GetContactBiddersParams,
  UpdatePastEventsPublicisedTenderResultParams,
} from 'services/archives/pastEvents/types';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import { StyledMainCard } from 'views/archives/CommonArchives.styled';

const ContactBiddersPage = () => {
  const searchParams = useSearchParams();
  const eventId = Number(searchParams.get('eventId'));
  const eventCategoryID = Number(searchParams.get('eventCategoryID'));

  const [data, setData] = useState<GetContactBiddersData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isButtonLoading: false });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allSelectedIds = data.map((item) => item.SeqNo);

      const allEmails = data.flatMap((item) => [item.EmailID, item.emailID2].filter((email): email is string => !!email));

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

  const fetchContactBidders = useCallback(async () => {
    if (!eventId || !eventCategoryID) return;
    const params: GetContactBiddersParams = {
      eventId,
      eventCategory: eventCategoryID,
    };
    await handleFetchData<GetContactBiddersData[]>(() => PastEventsServices.getContactBidders(params), setData, setLoading);
  }, [eventId, eventCategoryID]);

  const handleSendEmailToSelectedBidders = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }
    setIsEmailDialogOpen(true);
  };

  const handleDownloadPublicisedFile = async () => {
    if (!eventId || !eventCategoryID) return;

    setLoading((prev) => ({ ...prev, isButtonLoading: true }));
    const params: UpdatePastEventsPublicisedTenderResultParams = {
      eventId,
      eventCategory: eventCategoryID,
    };

    try {
      const response = await PastEventsServices.pastEventsPublicisedTenderResult(params);
      if (!response) {
        toast.error('Failed to download report');
        return;
      }

      const disposition = response.headers['content-disposition'];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', disposition);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error occurred during export handleDownloadPublicisedFile', error);
      toast.error('Error occurred during export');
    } finally {
      setLoading((prev) => ({ ...prev, isButtonLoading: false }));
    }
  };

  useEffect(() => {
    fetchContactBidders();
    checkDownloadAccess(setIsDownloadAccess);
  }, [fetchContactBidders]);
  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <StyledMainCard
        content={false}
        title="Contact Bidders"
        secondary={
          <CardHeaderIconContainer justifyContent="end">
            <Button variant="contained" onClick={handleSendEmailToSelectedBidders} startIcon={<Sms />} disabled={loading?.isProgress}>
              Email To Selected Bidders
            </Button>
            {isDownloadAccess && data.length > 0 && (
              <DownloadCSVButton
                title="Download Publicised Tender Outcomes File"
                onClick={handleDownloadPublicisedFile}
                isLoading={loading.isButtonLoading}
              />
            )}
          </CardHeaderIconContainer>
        }
      >
        <TableContainer sx={{ maxHeight: 430 }}>
          <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
            <ContactBiddersTableHeader
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <ContactBiddersTableBody
              data={data}
              page={page}
              order={order}
              orderBy={orderBy}
              loading={loading}
              rowsPerPage={rowsPerPage}
              isSelected={isSelected}
              handleClick={handleClick}
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

      <ContactEmailBiddersDialog
        open={isEmailDialogOpen}
        handleClose={() => setIsEmailDialogOpen(false)}
        selectedEmail={selectedEmails.join(',')}
        data={data}
        loading={loading}
        selected={selected}
        isSelected={isSelected}
        setSelected={setSelected}
        handleClick={handleClick}
        isDownloadAccess={isDownloadAccess}
        handleSelectAllClick={handleSelectAllClick}
        handleDownloadPublicisedFile={handleDownloadPublicisedFile}
        setSelectedEmails={setSelectedEmails}
      />
    </>
  );
};

export default ContactBiddersPage;
