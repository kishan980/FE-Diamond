'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import ChatBottomBar from '../ChatBottomBar';
import AllLotsBidderTableBody from './AllLotsTable/AllLotsBidderTableBody';
import AllLotsBidderTableHeader from './AllLotsTable/AllLotsBidderTableHeader';
import AllLotsInfo from './AllLotsInfo';
import { StyledScrollableContainer, StyledSimpleBar } from './ChatAllLots.styled';
import {
  ChatRoomAllBiddersOrLotsData,
  ChatRoomAllBiddersOrLotsParams,
  UpdateWithdrawAuctionBidParams,
} from 'services/event/event-action/auction-room/type';
import MainCard from 'components/MainCard';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import { AuctionRoomEventServices } from 'services/event/event-action/auction-room/auctionRoom.services';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import { AllLotsProps } from 'types/events';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { getSocket } from 'lib/socket';
import { SOCKET_EVENTS } from 'constants/socketEvents';

const AllLotsPage = ({ selectedBiddersData, selectEventId }: AllLotsProps) => {
  const { id } = useParams();
  const { data: session } = useSession();

  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const token = imageDetails?.token;

  const { username } = imageDetails?.currentUserDetails ?? {};
  const bidderId = selectedBiddersData.SeqNo;

  const socketRef = useRef<Socket | null>(null);

  const [data, setData] = useState<ChatRoomAllBiddersOrLotsData[]>([]);
  const [selectedSeqNo, setSelectedSeqNo] = useState<number | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
  });

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const handleOnSend = () => {
    if (!message.trim()) {
      openSnackbar({
        open: true,
        message: 'Message required',
        variant: 'alert',
        alert: { color: 'error' },
      } as SnackbarProps);
      return;
    }
    const allLostBuyerIds = data.flatMap((item) => item.lostAllBiddersAndLots?.map((bidder) => bidder.refBuyerID_EntityMas) || []);
    const newMessage = {
      eventId: Number(id),
      type: 0,
      senderName: username,
      messageBody: message,
      bidderId: [bidderId],
      selectEntityId: allLostBuyerIds,
      flagEntityId: 0,
    };

    socketRef.current?.emit(SOCKET_EVENTS.ADMIN_SEND_MESSAGE, newMessage);

    setMessage('');
  };

  const handleDeleteClick = useCallback((seqNo: number, entityId: number) => {
    setSelectedSeqNo(seqNo);
    setSelectedEntityId(entityId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const params: UpdateWithdrawAuctionBidParams = {
        eventId: Number(id),
        seqNo: selectedSeqNo,
        entityId: selectedEntityId,
      };
      const res = await AuctionRoomEventServices.withdrawAuctionBid(params);
      if (typeof res !== 'string' && res.success) {
        setData((prevData) => prevData?.filter((item) => item?.lostAllBiddersAndLots[0]?.refSeqNo_EventStock !== selectedSeqNo));
        toast.success(res.data);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting to delete Term & Condition', error);
      toast.error('Error deleting to delete Term & Condition');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true }));
    const params: ChatRoomAllBiddersOrLotsParams = {
      eventId: id as string,
      type: 0,
      seqNo: Number(selectedBiddersData?.SeqNo),
    };
    try {
      const res = await AuctionRoomEventServices.chatRoomAllBiddersOrLots(params);
      if (typeof res !== 'string' && res.success) setData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  useEffect(() => {
    if (!selectedBiddersData?.SeqNo) return;
    fetchData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_CHAT_ROOM_ALL_BIDDERS_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBiddersData?.SeqNo]);

  useEffect(() => {
    if (!token || !id) return;

    const socket = getSocket(token, id as string);

    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on(SOCKET_EVENTS.ONLINE_USERS, (userIds: { entityId: number }[]) => {
      setOnlineUserIds(userIds.map((u) => u.entityId));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, id]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <StyledSimpleBar>
            <StyledScrollableContainer>
              <AllLotsInfo data={data} selectEventId={selectEventId} selectedBiddersData={selectedBiddersData} loading={loading} />
              <MainCard content={false}>
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                    <AllLotsBidderTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <AllLotsBidderTableBody
                      data={data}
                      page={page}
                      order={order}
                      loading={loading}
                      orderBy={orderBy}
                      rowsPerPage={rowsPerPage}
                      onDeleteClick={handleDeleteClick}
                      eventId={Number(selectEventId)}
                      seqNo={Number(selectedBiddersData?.SeqNo)}
                      onlineUserIds={onlineUserIds}
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
            </StyledScrollableContainer>
          </StyledSimpleBar>
        </Grid>
        <ChatBottomBar data={data} message={message} setMessage={setMessage} handleOnSend={handleOnSend} />
      </Grid>
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        title="Are you sure that you want to remove the highest bid?"
      />
    </>
  );
};

export default AllLotsPage;
