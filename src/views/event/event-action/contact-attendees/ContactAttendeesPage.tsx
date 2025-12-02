'use client';
import React, { useState, ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import { Sms } from 'iconsax-react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContactAttendeesTableHeader from './ContactAttendeesTableHeader';
import ContactAttendeesTableBody from './ContactAttendeesTableBody';
import { StyledMainCard } from './ContactAttendeesPage.styled';
import Loader from 'components/Loader';
import { useTableControls } from 'utils/useTableControls';
import { EVENT_MENU_ITEMS, ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { ContactAttendeesServices } from 'services/event/event-action/contact-attendees/contactAttendees.services';
import { ContactAttendeesData } from 'services/event/event-action/contact-attendees/type';
import EmailInvitationDialog from 'components/UIComponent/Dialogs/EmailInvitationDialog/EmailInvitationDialog';
import { MenuDetails } from 'types/events';
import { EventByIdData } from 'services/event/types';
import MoreIcon from 'components/@extended/MoreIcon';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { EventServices } from 'services/event/event.services';
import { CardHeaderIconContainer } from 'views/common.styled';

const ContactAttendeesPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const eventId = Number(id);
  const eventCategoryId = Number(searchParams.get('eventCategory'));

  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);

  const [data, setData] = useState<ContactAttendeesData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } =
    useTableControls('CompanyName');

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

  const fetchAttendees = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await ContactAttendeesServices.getContactAttendeesList(eventId, eventCategoryId);
      if (typeof res !== 'string' && res.success) setData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetching access data:', error);
      toast.error('Error fetching access data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleEmailAttendees = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }
    setIsEmailDialogOpen(true);
  };

  const handleClickMoreMenuButton = (
    event: MouseEvent<HTMLElement>,
    eventID: number,
    startDate: string,
    endDate: string,
    eventCategoryID: number,
    isAnalysis: boolean,
    TenderEndDate: string,
    AuctionEndDate: string,
    ISAuction: string
  ) => {
    setAnchorElMore(event.currentTarget);
    setMenuDetails({ EventID: eventID, startDate, endDate, eventCategoryID, isAnalysis, TenderEndDate, AuctionEndDate, ISAuction });
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
    setMenuDetails(null);
  };

  const filteredMenu = useMemo(() => EVENT_MENU_ITEMS.filter((item) => !pathname.includes(item.path)), [pathname]);

  useEffect(() => {
    fetchAttendees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFetchEventDetails = async (id: number) => {
      if (!id) return;
      try {
        const res = await EventServices.getEventById(id);
        if (typeof res !== 'string' && res.success) setEventData(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching event details:', error);
        toast.error('Failed to fetch basic details');
      }
    };
    handleFetchEventDetails(eventId);
  }, [eventId]);

  return (
    <>
      {loading.isLoading && !loading.isProgress ? (
        <Loader />
      ) : (
        <StyledMainCard
          content={false}
          title={
            isSmallDown ? (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                Contact Attendees
                {!loading?.isProgress && (
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    color="secondary"
                    onClick={(e) =>
                      handleClickMoreMenuButton(
                        e,
                        eventData?.auTen_EvtId || 0,
                        eventData?.startDate || '',
                        eventData?.EndDate || '',
                        eventData?.refEventCategoryID_EventCategoryMas || 0,
                        eventData?.IsAnalysing || false,
                        eventData?.TenderEndDate || '',
                        eventData?.AuctionEndDate || '',
                        eventData?.ISAuction || ''
                      )
                    }
                  >
                    <MoreIcon />
                  </IconButton>
                )}
              </Box>
            ) : (
              'Contact Attendees'
            )
          }
          secondary={
            <CardHeaderIconContainer>
              <Button variant="contained" onClick={handleEmailAttendees} startIcon={<Sms />} disabled={loading.isProgress}>
                Email To Selected Attendees
              </Button>
              {!isSmallDown && !loading?.isProgress && (
                <IconButton
                  edge="end"
                  aria-label="comments"
                  color="secondary"
                  onClick={(e) =>
                    handleClickMoreMenuButton(
                      e,
                      eventData?.auTen_EvtId || 0,
                      eventData?.startDate || '',
                      eventData?.EndDate || '',
                      eventData?.refEventCategoryID_EventCategoryMas || 0,
                      eventData?.IsAnalysing || false,
                      eventData?.TenderEndDate || '',
                      eventData?.AuctionEndDate || '',
                      eventData?.ISAuction || ''
                    )
                  }
                >
                  <MoreIcon />
                </IconButton>
              )}
            </CardHeaderIconContainer>
          }
        >
          <TableContainer sx={{ maxHeight: 430 }}>
            <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
              <ContactAttendeesTableHeader
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <ContactAttendeesTableBody
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
      )}
      <EmailInvitationDialog
        open={isEmailDialogOpen}
        handleClose={() => setIsEmailDialogOpen(false)}
        selectedEmail={selectedEmails.join(',')}
        setSelected={setSelected}
        setSelectedEmails={setSelectedEmails}
      />
      <DocumentActionMenu
        open={Boolean(anchorElMore)}
        anchorElMoreMenu={anchorElMore}
        moreMenuEventID={menuDetails?.EventID}
        moreMenuStartDate={menuDetails?.startDate}
        moreMenuEndDate={menuDetails?.endDate}
        eventCategories={menuDetails?.eventCategoryID}
        handleCloseMoreMenuButton={handleCloseMoreMenu}
        detailPageMoreMenuItems={filteredMenu}
        eventOutcomesUrl={menuDetails?.isAnalysis}
        moreMenuTenderEndDate={menuDetails?.TenderEndDate}
        moreMenuAuctionEndDate={menuDetails?.AuctionEndDate}
        moreMenuIsAuction={menuDetails?.ISAuction}
      />
    </>
  );
};

export default ContactAttendeesPage;
