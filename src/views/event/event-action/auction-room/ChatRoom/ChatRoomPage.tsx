'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import ChatDrawer from './ChatDrawer';
import ChatBidder from './ChatBidder';
import AllBiddersPage from './AllBidders/AllBiddersPage';
import AllLotsPage from './AllLots/AllLotsPage';
import { ChatRoomContainer, MainContent, StyledGridItem } from './ChatRoom.styled';
import MainCard from 'components/MainCard';
import { BiddersLotsChatAuctionData, LostedBiddersData, SelectedBiddersData } from 'services/event/event-action/auction-room/type';
import { LoadingState } from 'types/table';
import { AuctionRoomEventServices } from 'services/event/event-action/auction-room/auctionRoom.services';
import { disconnectSocket } from 'lib/socket';

const ChatRoomPage = () => {
  const { id } = useParams();
  const eventId = Number(id);

  const theme = useTheme();
  const isLargeDown = useMediaQuery(theme.breakpoints.down('lg'));

  const [activeTab, setActiveTab] = useState<'chat' | 'alllots' | 'allbidders'>('chat');
  const [openChatDrawer, setOpenChatDrawer] = useState(true);
  const [biddersLotsChatData, setBiddersLotsChatData] = useState<BiddersLotsChatAuctionData[]>([]);
  const [selectedBiddersData, setSelectedBiddersData] = useState<SelectedBiddersData>({});
  const [lostedBiddersData, setLostedBiddersData] = useState<LostedBiddersData>({});
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isUserLoading: false, isChatLoading: false });

  const isSelectBiddersEmpty = useMemo(() => !Object.keys(selectedBiddersData).length, [selectedBiddersData]);
  const isLostBiddersEmpty = useMemo(() => !Object.keys(lostedBiddersData).length, [lostedBiddersData]);

  const fetchBiddersLotsChat = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isUserLoading: true }));
    try {
      const res = await AuctionRoomEventServices.biddersLotsChat(eventId);
      if (typeof res !== 'string' && res.success) setBiddersLotsChatData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetch bidders lots chat:', error);
      toast.error('Failed to fetch bidders lots chat.');
    }
    setLoading((prev) => ({ ...prev, isUserLoading: false }));
  }, [eventId]);

  const handleDrawerToggle = useCallback(() => {
    setOpenChatDrawer((prev) => !prev);
  }, []);

  useEffect(() => {
    fetchBiddersLotsChat();
  }, [fetchBiddersLotsChat]);

  useEffect(() => {
    if (!loading.isUserLoading) {
      setSelectedBiddersData(biddersLotsChatData[0]?.selectBidders?.[0] ?? {});
      setLostedBiddersData({});
    }
  }, [biddersLotsChatData, loading.isUserLoading]);

  useEffect(() => {
    if (activeTab === 'chat') {
      setLostedBiddersData({});
    }
  }, [activeTab]);

  useEffect(() => {
    setOpenChatDrawer(!isLargeDown);
  }, [isLargeDown]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  const chatDrawer = useMemo(
    () => (
      <ChatDrawer
        openChatDrawer={openChatDrawer}
        handleDrawerOpen={handleDrawerToggle}
        setSelectedBiddersData={setSelectedBiddersData}
        setLostedBiddersData={setLostedBiddersData}
        selectedUser={isLostBiddersEmpty ? null : (lostedBiddersData.refBuyerID_EntityMas?.toString() ?? null)}
        allLotsSelectedUser={isSelectBiddersEmpty ? null : (selectedBiddersData.SeqNo?.toString() ?? null)}
        biddersLotsChatData={biddersLotsChatData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading?.isUserLoading as boolean}
      />
    ),
    [
      openChatDrawer,
      handleDrawerToggle,
      isLostBiddersEmpty,
      lostedBiddersData,
      isSelectBiddersEmpty,
      selectedBiddersData,
      biddersLotsChatData,
      activeTab,
      loading?.isUserLoading,
    ]
  );

  const content = useMemo(() => {
    if (activeTab === 'chat') {
      return (
        <ChatBidder loading={loading} setLoading={setLoading} handleDrawerOpen={handleDrawerToggle} lostedBiddersData={lostedBiddersData} />
      );
    } else if (activeTab === 'alllots') {
      return <AllLotsPage selectEventId={eventId} selectedBiddersData={selectedBiddersData} />;
    } else {
      return <AllBiddersPage selectEventId={eventId} biddersLotsChatData={biddersLotsChatData} />;
    }
  }, [activeTab, loading, lostedBiddersData, selectedBiddersData, eventId, handleDrawerToggle, biddersLotsChatData]);

  return (
    <ChatRoomContainer>
      {chatDrawer}
      <MainContent open={openChatDrawer}>
        <Grid container sx={{ flexGrow: 1, height: 1 }}>
          <StyledGridItem item xs={12}>
            <MainCard
              content={false}
              sx={(theme: Theme) => ({
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.50',
                ...theme.applyStyles('dark', { bgcolor: 'dark.main' }),
                borderRadius: 1.5,
                ...(!openChatDrawer && { borderRadius: '12px 0 0 12px' }),
                ...(openChatDrawer && { borderRadius: '0 12px 12px 0' }),
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.shorter + 200,
                }),
                [theme.breakpoints.down('md')]: { borderRadius: 1.5 },
              })}
            >
              {content}
            </MainCard>
          </StyledGridItem>
        </Grid>
      </MainContent>
    </ChatRoomContainer>
  );
};

export default ChatRoomPage;
