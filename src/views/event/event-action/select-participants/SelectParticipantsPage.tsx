'use client';
import { useState, ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import parseISO from 'date-fns/parseISO';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { SelectChangeEvent } from '@mui/material/Select';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import SelectParticipantsFilters from './SelectParticipantsFilters';
import SelectParticipantsTableBody from './SelectParticipantsTableBody';
import SelectParticipantsEventTimer from './SelectParticipantsEventTimer';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { CardHeaderIconContainer } from 'views/common.styled';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import RefreshIconButton from 'components/UIComponent/IconButtons/RefreshButton';
import { useTableControls } from 'utils/useTableControls';
import { formatDateAndTime, formatDurationFromMs } from 'utils/format-date';
import { SelectParticipantsServices } from 'services/event/event-action/select-participants/selectParticipants.services';
import { handleFetchData } from 'utils/apiHelpers';
import { EVENT_MENU_ITEMS, ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { SelectParticipantsData, UpdateInvitedSelectParticipantsParams } from 'services/event/event-action/select-participants/type';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import EmailInvitationDialog from 'components/UIComponent/Dialogs/EmailInvitationDialog/EmailInvitationDialog';
import MoreIcon from 'components/@extended/MoreIcon';
import IconButton from 'components/@extended/IconButton';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { MenuDetails } from 'types/events';
import { EventByIdData } from 'services/event/types';
import { EventServices } from 'services/event/event.services';
import { handleExcelExport } from 'utils/exportUtils';
import { SELECT_PARTICIPANT_HEAD_CELLS } from 'constants/tableHeadCells';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';

const SelectParticipantsPage = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const eventCategoryId = searchParams.get('eventCategory');
  const eventId = Number(id);

  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<SelectParticipantsData[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [remainingTime, setRemainingTime] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [participants, setParticipants] = useState<string>('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isExcelButtonLoading: false,
    isTimerLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage, setPage } =
    useTableControls('EntityID');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

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

  const fetchParticipantsData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companyName: filters.companyName }),
      ...(filters.contactPerson && { contactPerson: filters.contactPerson }),
    }).toString();
    const selectParticipantsIdParams = `id=${eventId}&eventCategory=${eventCategoryId}`;
    await handleFetchData<SelectParticipantsData[]>(
      () => SelectParticipantsServices.getEventParticipants(selectParticipantsIdParams, searchQuery),
      setData,
      setLoading
    );
  };

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchParticipantsData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((n) => n.EntityID) : []);

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

  let startformatDate = 'Invalid or missing start date';
  const startDate = searchParams.get('startDate');
  if (startDate) startformatDate = formatDateAndTime(startDate);

  let endformatDate = 'Invalid or missing end date';
  const endDate = searchParams.get('endDate');
  if (endDate) endformatDate = formatDateAndTime(endDate);

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchParticipantsData({});
  };

  const handleParticipantStatusChange = async (event: SelectChangeEvent<number | string | boolean>) => {
    const newInvited = event.target.value as string;
    setParticipants(newInvited);

    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const seqNOListArray = selected.map((id, index) => ({
        entityId: id,
        email: selectedEmails[index],
      }));

      const params: UpdateInvitedSelectParticipantsParams = {
        id: eventId,
        seqNOList: JSON.stringify(seqNOListArray),
        act: Number(newInvited),
      };
      if (selected.length > 0) {
        const res = await SelectParticipantsServices.participationInvitation(params);
        if (typeof res !== 'string' && res.success) {
          setSelected([]);
          await fetchParticipantsData();
          setParticipants('');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating participant status:', error);
      toast.error('Error updating participant status.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleExportExcelClick = () =>
    handleExcelExport(() => SelectParticipantsServices.exportExcel(Number(eventCategoryId), eventId), setLoading, 'isExcelButtonLoading');

  const handleContactParticipants = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }
    setIsEmailDialogOpen(true);
  };

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = new Date().getTime();
      const startTime = startDate ? parseISO(startDate).getTime() : null;
      const endTime = endDate ? parseISO(endDate).getTime() : null;
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      if (!startTime || !endTime) {
        setRemainingTime('');
        return;
      }

      let newRemainingTime = '';
      if (adjustedCurrentTime < startTime) {
        newRemainingTime = 'Not Open Yet';
      } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
        newRemainingTime = formatDurationFromMs(endTime - adjustedCurrentTime);
      } else {
        newRemainingTime = 'Closed';
      }
      setRemainingTime(newRemainingTime);
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchParticipantsData();
    checkDownloadAccess(setIsDownloadAccess);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFetchEventDetails = async (id: number) => {
      if (!id) return;
      setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      try {
        const res = await EventServices.getEventById(id);
        if (typeof res !== 'string' && res.success) setEventData(res.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching event details:', error);
        toast.error('Failed to fetch basic details');
      } finally {
        setLoading((prev) => ({ ...prev, isTimerLoading: false }));
      }
    };
    handleFetchEventDetails(eventId);
  }, [eventId]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <MainCard
        content={false}
        title="Select Participants"
        secondary={
          <CardHeaderIconContainer>
            {!loading?.isProgress && <RefreshIconButton title="Refresh" onClick={handleResetFilters} />}
            {isDownloadAccess && data.length > 0 && !loading?.isProgress && (
              <DownloadCSVButton
                title="Export Participants Invitation Summary"
                onClick={handleExportExcelClick}
                isLoading={loading?.isExcelButtonLoading}
              />
            )}
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
          </CardHeaderIconContainer>
        }
      >
        <SelectParticipantsEventTimer {...{ eventId, remainingTime, endformatDate, startformatDate, loading }} />

        <SelectParticipantsFilters
          {...{ data, loading, selected, participants, handleContactParticipants, handleParticipantStatusChange }}
        />

        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Bidders"
              headCells={SELECT_PARTICIPANT_HEAD_CELLS}
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
            <SelectParticipantsTableBody
              {...{ data, page, order, orderBy, loading, rowsPerPage, handleClick, isSelected, eventCategoryId: Number(eventCategoryId) }}
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

export default SelectParticipantsPage;
