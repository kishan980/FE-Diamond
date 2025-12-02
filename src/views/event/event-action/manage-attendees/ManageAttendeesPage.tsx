'use client';
import { useState, ChangeEvent, useEffect, Dispatch, SetStateAction, MouseEvent, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import parseISO from 'date-fns/parseISO';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ManageAttendFilters from './ManageAttendFilters';
import ManageAttendeesTableBody from './ManageAttendeesTableBody';
import ManageAttendeesEventTimer from './ManageAttendeesEventTimer';
import PrintSheetTableBody from './PrintSheetTableBody';
import PrintSheetTableHeader from './PrintSheetTableHeader';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import RefreshIconButton from 'components/UIComponent/IconButtons/RefreshButton';
import { handleFetchData } from 'utils/apiHelpers';
import { useTableControls } from 'utils/useTableControls';
import { formatDateAndTime, formatDurationFromMs } from 'utils/format-date';
import { ManageAttendeesServices } from 'services/event/event-action/manage-attendees/manageAttendees.services';
import { EVENT_MENU_ITEMS, ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState, SearchFilters } from 'types/table';
import { ManageAttendData, UpdateInvitedManageAttendeesParams } from 'services/event/event-action/manage-attendees/type';
import PrintLogo from 'components/logo/PrintLogo';
import { GetAllLotsData, GetAllLotsParams } from 'services/bidder/all-lots/type';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { MenuDetails } from 'types/events';
import { EventByIdData } from 'services/event/types';
import { EventServices } from 'services/event/event.services';
import MoreIcon from 'components/@extended/MoreIcon';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { MANAGE_ATTENDEES_HEAD_CELLS } from 'constants/tableHeadCells';
import CommonTableHeader from 'components/UIComponent/CommonTableHeader';

const ManageAttendeesPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const eventCategoryId = searchParams.get('eventCategory');
  const eventId = Number(id);

  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [data, setData] = useState<ManageAttendData[]>([]);
  const [printBidderLotsData, setPrintBidderLotsData] = useState<GetAllLotsData[]>([]);
  const [entityID, setEntityID] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [attended, setAttended] = useState<string>('');
  const [loginEnabled, setLoginEnabled] = useState<string>('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isTimerLoading: false });

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

  const pathname = usePathname();
  const filteredMenu = useMemo(() => EVENT_MENU_ITEMS.filter((item) => !pathname.includes(item.path)), [pathname]);

  const fetchManageAttendeesData = async (filters: SearchFilters = searchFilters) => {
    const searchQuery = new URLSearchParams({
      ...(filters.companyName && { companyName: filters.companyName }),
      ...(filters.contactPerson && { contactPerson: filters.contactPerson }),
    }).toString();
    const manageAttendIdParams = `id=${eventId}&eventCategory=${eventCategoryId}`;
    await handleFetchData<ManageAttendData[]>(
      () => ManageAttendeesServices.manageAttendeedListData(manageAttendIdParams, searchQuery),
      setData,
      setLoading
    );
  };

  const handleClickSearch = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    await fetchManageAttendeesData();
    setPage(0);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((n) => n.EntityID) : []);

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  let startformatDate = '';
  const startDate = searchParams.get('startDate');
  if (startDate) startformatDate = formatDateAndTime(startDate);
  else startformatDate = 'Invalid or missing start date';

  let endformatDate = '';
  const endDate = searchParams.get('endDate');
  if (endDate) endformatDate = formatDateAndTime(endDate);
  else endformatDate = 'Invalid or missing end date';

  const handleResetFilters = async () => {
    setSearchFilters({});
    await fetchManageAttendeesData({});
  };

  const handleStatusChange = async (
    event: SelectChangeEvent<number | string | boolean>,
    serviceFunction: (params: { id: number; seqNOList: string; act: number }) => Promise<any>,
    setState: Dispatch<SetStateAction<string>>
  ) => {
    const newValue = event.target.value as string;
    setState(newValue);

    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const params: UpdateInvitedManageAttendeesParams = {
        id: eventId,
        seqNOList: selected.join(','),
        act: Number(newValue),
      };
      if (selected.length > 0) {
        const res = await serviceFunction(params);
        if (typeof res !== 'string' && res.success) {
          setSelected([]);
          await fetchManageAttendeesData();
          setState('');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during update process:', error);
      toast.error('Error during update process');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleChangeAttended = (event: SelectChangeEvent<number | string | boolean>) =>
    handleStatusChange(event, ManageAttendeesServices.invitedManageAttendeed, setAttended);

  const handleChangeLoginEnabled = (event: SelectChangeEvent<number | string | boolean>) =>
    handleStatusChange(event, ManageAttendeesServices.loginEnabledViewer, setLoginEnabled);

  const fetchPrintLotsData = async (entityID: string) => {
    setEntityID(Number(entityID));
    try {
      const params: GetAllLotsParams = { eventId, entityId: entityID as string, mineId: 0 };
      const getBidderLotsData = await AllLotsServices.getLots(params);

      if (typeof getBidderLotsData !== 'string' && getBidderLotsData.success) {
        const fetchedData = getBidderLotsData.data;
        setPrintBidderLotsData(fetchedData);

        setTimeout(() => {
          setEntityID(0);
          window.print();
        }, 3000);
      }
    } catch (error) {
      setEntityID(0);
      // eslint-disable-next-line no-console
      console.error('An error occurred while printing data:', error);
      toast.error('An error occurred while printing data');
    }
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
      if (adjustedCurrentTime < startTime) newRemainingTime = 'Not Open Yet';
      else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
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
    fetchManageAttendeesData();
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
      <PrintLogo />
      <MainCard
        content={false}
        title="Manage Attendees"
        secondary={
          !loading?.isProgress && (
            <>
              <RefreshIconButton title="Refresh" onClick={handleResetFilters} />
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
            </>
          )
        }
      >
        <ManageAttendeesEventTimer {...{ eventId, remainingTime, endformatDate, startformatDate, loading }} />
        <ManageAttendFilters
          {...{ data, attended, selected, loginEnabled, remainingTime, handleChangeAttended, handleChangeLoginEnabled }}
        />
        <TableContainer sx={{ maxHeight: 430, display: 'none' }} className="print-table-container">
          <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
            <PrintSheetTableHeader
              {...{
                order,
                orderBy,
                rowCount: data.length,
                numSelected: selected.length,
                onRequestSort: handleRequestSort,
                onSelectAllClick: handleSelectAllClick,
                eventCategoryId: Number(eventCategoryId),
              }}
            />
            <PrintSheetTableBody eventCategoryID={Number(eventCategoryId)} data={printBidderLotsData} />
          </Table>
        </TableContainer>
        <TableContainer
          className="print-hidden-table-container"
          component={Paper}
          sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}
        >
          <Table aria-label="sticky table" size="small" stickyHeader>
            <CommonTableHeader
              title="Bidders"
              headCells={MANAGE_ATTENDEES_HEAD_CELLS}
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
            <ManageAttendeesTableBody
              {...{
                data,
                page,
                order,
                orderBy,
                loading,
                rowsPerPage,
                entityID,
                handleClick,
                isSelected,
                fetchPrintLotsData,
                eventCategoryId: Number(eventCategoryId),
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
      </MainCard>
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

export default ManageAttendeesPage;
