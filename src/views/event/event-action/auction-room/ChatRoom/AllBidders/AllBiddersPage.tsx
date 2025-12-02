'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import ChatBottomBar from '../ChatBottomBar';
import AllBiddersInfo from './AllBiddersInfo';
import { StyledAllBidderSimpleBar } from './AllBidders.styled';
import {
  BiddersLotsChatAuctionData,
  ChatRoomAllBiddersOrLotsData,
  ChatRoomAllBiddersOrLotsParams,
} from 'services/event/event-action/auction-room/type';
import { LoadingState } from 'types/table';
import { AuctionRoomEventServices } from 'services/event/event-action/auction-room/auctionRoom.services';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { getSocket } from 'lib/socket';
import { SOCKET_EVENTS } from 'constants/socketEvents';

const AllBiddersPage = ({
  selectEventId,
  biddersLotsChatData,
}: {
  selectEventId: number;
  biddersLotsChatData: BiddersLotsChatAuctionData[];
}) => {
  const { id } = useParams();
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const token = imageDetails?.token;

  const socketRef = useRef<Socket | null>(null);

  const { username } = imageDetails?.currentUserDetails ?? {};

  const [data, setData] = useState<ChatRoomAllBiddersOrLotsData[]>([]);
  const [message, setMessage] = useState('Message to all bidders: ');
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
  });

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
    const bidderIds = [...biddersLotsChatData[0].lostBidders.map((bidder) => bidder.refBuyerID_EntityMas)];
    const newMessage = {
      eventId: Number(id),
      senderName: username,
      messageBody: message,
      type: 1,
      bidderId: bidderIds,
      flagEntityId: 1,
    };

    socketRef.current?.emit(SOCKET_EVENTS.ADMIN_SEND_MESSAGE, newMessage);

    setMessage('');
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true }));
    const params: ChatRoomAllBiddersOrLotsParams = {
      eventId: id as string,
      type: 2,
      seqNo: 0,
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
    fetchData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_CHAT_ROOM_ALL_BIDDERS_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    const socket = getSocket(token, id as string);

    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, id]);

  return (
    <Grid>
      <Grid item xs={12}>
        <StyledAllBidderSimpleBar>
          <Box sx={{ p: 3 }}>
            <AllBiddersInfo {...{ data, selectEventId, loading }} />
          </Box>
        </StyledAllBidderSimpleBar>
      </Grid>

      <ChatBottomBar {...{ data, message, setMessage, handleOnSend }} />
    </Grid>
  );
};

export default AllBiddersPage;
