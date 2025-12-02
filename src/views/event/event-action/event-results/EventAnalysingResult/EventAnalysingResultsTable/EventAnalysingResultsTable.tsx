'use client';
import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { SelectChangeEvent } from '@mui/material/Select';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { EventAnalysingResultsTableMainContainer } from '../EventAnalysingResults.styled';
import SearchAndButtonContainer from './SearchAndButtonContainer';
import EventAnalysingResultsTableBody from './EventAnalysingResultsTableBody';
import EventAnalysingResultsTableHeader from './EventAnalysingResultsTableHeader';
import EventCollapsibleAnalysingTable from './EventCollapsibleAnalysing/EventCollapsibleAnalysingTable';
import MainCard from 'components/MainCard';
import { useTableControls } from 'utils/useTableControls';
import { ButtonStateValue, EventResultsTableProps } from 'types/table';
import { GetBidDetailsForWinnerData, UpdateBidMultipleConsiderParams } from 'services/event/event-action/event-results/type';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { MenuDetails } from 'types/events';
import { EventByIdData } from 'services/event/types';
import { EVENT_MENU_ITEMS } from 'constants/event.constants';
import { EventServices } from 'services/event/event.services';
import MoreIcon from 'components/@extended/MoreIcon';
import DocumentActionMenu from 'views/event/DocumentActionMenu';

const EventAnalysingResultsTable = ({
  eventId,
  loading,
  setLoading,
  sellerData,
  bidEventData,
  getBidDetails,
  onSelectData,
  fetchBidDetails,
  fetchGetBidEventData,
  handleClickExcelButton,
  handleProfileDetailsReadClick,
  isSellerLoading,
}: EventResultsTableProps<GetBidDetailsForWinnerData>) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [buttonState, setButtonState] = useState<{ [key: string]: ButtonStateValue }>({});
  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [eventData, setEventData] = useState<EventByIdData | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
  const [initialized, setInitialized] = useState(false);

  const { order, orderBy, handleRequestSort } = useTableControls('SeqNo');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleSellerChange = (event: SelectChangeEvent<number | string | boolean>) => setSelectedSellerId(event.target.value as string);
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? getBidDetails.map((item) => item.SeqNo) : []);

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const openConfirmationDialog = (action: 'accept' | 'refuse') => {
    const messages = {
      accept: 'Are you sure that you want to accept this bid?',
      refuse: 'Are you sure that you want to refuse this bid?',
    };
    setDialogTitle(messages[action]);
    setIsConfirmDialogOpen(true);
  };

  const handleDialogConfirm = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    const actionStatus = dialogTitle.includes('accept') ? 'Accepted' : 'Withdrawn';
    const actionType = actionStatus === 'Accepted' ? 'accept' : 'refuse';

    const params: UpdateBidMultipleConsiderParams = { seqNo: selected.join(','), eventId, finalStatus: actionStatus };
    try {
      const res = await EventResultsServices.bidMultipleConsider(params);

      if (typeof res !== 'string' && res.success) {
        toast.success(res.data);
        const matchedBids = getBidDetails.filter((item) => selected.includes(item.SeqNo));

        matchedBids.forEach(({ cts, Win_Rate, SeqNo, rate }) => {
          const prevState = buttonState[SeqNo];
          if (prevState === 'AcceptedReopen') {
            onSelectData({ cts, Win_Rate, rate }, 'AcceptedReopen');
          } else if (prevState === 'WithdrawReopen') {
            onSelectData({ cts, Win_Rate, rate }, 'WithdrawReopen');
          }

          onSelectData({ cts, Win_Rate, rate }, actionType);
        });

        setButtonState((prev) => {
          const updatedState = { ...prev };
          matchedBids.forEach(({ SeqNo }) => {
            updatedState[SeqNo] = actionType === 'accept' ? 'AcceptedReopen' : 'WithdrawReopen';
          });
          return updatedState;
        });

        fetchBidDetails();
        setIsConfirmDialogOpen(false);
        setSelected([]);
      } else toast.error('Something went wrong');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidMultipleConsider:', error);
      toast.error('Error in bidMultipleConsider');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogTitle, getBidDetails, onSelectData, selected, eventId, buttonState]);

  const filteredBidDetails = selectedSellerId ? getBidDetails.filter((item) => item?.SellerName === selectedSellerId) : getBidDetails;

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

  useEffect(() => {
    if (!initialized && filteredBidDetails?.length > 0) {
      setButtonState((prev) => {
        const updatedState = { ...prev };

        filteredBidDetails.forEach((row) => {
          const { cts, Win_Rate, rate, SeqNo, FinalLotStatus } = row;
          const action = FinalLotStatus === 'Accepted' ? 'accept' : FinalLotStatus === 'Withdrawn' ? 'refuse' : 'reopen';

          onSelectData({ cts, Win_Rate, rate }, action);
          updatedState[SeqNo] = action === 'accept' ? 'AcceptedReopen' : action === 'refuse' ? 'WithdrawReopen' : 'YesNo';
        });

        return updatedState;
      });

      setInitialized(true);
    }
  }, [filteredBidDetails, initialized, onSelectData, setButtonState]);

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
      <EventAnalysingResultsTableMainContainer>
        {loading.isProgress || loading.isLoading ? (
          <MainCard content={false} title="">
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2, ml: 2 }} />
            <TableContainer sx={{ mb: 2, overflowX: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableCell key={index} style={{ paddingLeft: 4, paddingRight: 4 }}>
                        <Skeleton variant="text" width="100%" height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: 6 }).map((_, colIndex) => (
                        <TableCell key={colIndex} style={{ paddingLeft: 4, paddingRight: 4 }}>
                          <Skeleton variant="rectangular" width="100%" height={32} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        ) : (
          bidEventData.length > 0 && (
            <EventCollapsibleAnalysingTable
              bidEventData={bidEventData}
              eventId={eventId}
              fetchGetBidEventData={fetchGetBidEventData}
              fetchBidDetails={fetchBidDetails}
              loading={loading}
              setLoading={setLoading}
              eventCategoryID={eventData?.refEventCategoryID_EventCategoryMas || 0}
              handleProfileDetailsReadClick={handleProfileDetailsReadClick}
            />
          )
        )}

        <MainCard
          content={false}
          title="Event Outcomes"
          secondary={
            !loading?.isProgress && (
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
            )
          }
        >
          <SearchAndButtonContainer
            selected={selected}
            loading={loading}
            selectedID={selectedSellerId}
            handleSellerChange={handleSellerChange}
            sellerData={sellerData}
            handleClickExcelButton={handleClickExcelButton}
            handleAcceptBid={openConfirmationDialog}
            isSellerLoading={isSellerLoading}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
              <EventAnalysingResultsTableHeader
                order={order}
                orderBy={orderBy}
                rowCount={getBidDetails.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                eventCategoryID={eventData?.refEventCategoryID_EventCategoryMas || 0}
              />
              <EventAnalysingResultsTableBody
                data={filteredBidDetails}
                onSelectData={onSelectData}
                eventId={eventId}
                isSelected={isSelected}
                handleClick={handleClick}
                fetchBidDetails={fetchBidDetails}
                loading={loading}
                handleProfileDetailsReadClick={handleProfileDetailsReadClick}
                buttonState={buttonState}
                setButtonState={setButtonState}
                eventCategoryID={eventData?.refEventCategoryID_EventCategoryMas || 0}
                order={order}
                orderBy={orderBy}
              />
            </Table>
          </TableContainer>
        </MainCard>
      </EventAnalysingResultsTableMainContainer>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        loading={loading}
        title={dialogTitle}
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
export default EventAnalysingResultsTable;
