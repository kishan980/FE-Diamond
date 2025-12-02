'use client';
import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Link from 'next/link';
import parseISO from 'date-fns/parseISO';
import EventCard from './EventList/EventCard';
import EmptyCard from './EventList/EmptyCard';
import { EventPageInnerBox, EventPageMainBox } from './Event.styled';
import Loader from 'components/Loader';
import AddIconButton from 'components/UIComponent/IconButtons/AddButton/AddIconButton';
import { EventServices } from 'services/event/event.services';
import { EventData } from 'services/event/types';
import { LoadingState } from 'types/table';
import usePagination from 'hooks/usePagination';
import { formatTimeRemaining } from 'utils/format-date';

const EventPage = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [page, setPage] = useState(1);
  const [auctionDurations, setAuctionDurations] = useState<{ [key: number]: string }>({});

  const intervalTime = (Number(process.env.NEXT_PUBLIC_EVENT_FETCH_INTERVAL) || 10) * 1000;
  const intervalId = useRef<any>(null);

  const perPage = 12;
  const count = Math.ceil(data.length / perPage);
  const { jump, currentData } = usePagination(data, perPage);

  const handleChangePage = (e: ChangeEvent<unknown>, page: number) => {
    setPage(page);
    jump(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEventData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true }));

    try {
      const res = await EventServices.eventListData();
      if (typeof res !== 'string' && res.success) setData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data. ', error);
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, []);

  const fetchEventData = useCallback(async () => {
    await getEventData(true);

    intervalId.current = setInterval(async () => await getEventData(false), intervalTime);
  }, [getEventData, intervalTime]);

  useEffect(() => {
    fetchEventData();

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [fetchEventData]);

  useEffect(() => {
    const calculateAuctionDurations = () => {
      const now = new Date().getTime();
      const durations: { [key: number]: string } = {};

      data.forEach((event) => {
        const startTime = event?.startDate ? parseISO(event.startDate).getTime() : null;
        const endTime = event?.TenderEndDate ? parseISO(event.TenderEndDate).getTime() : null;
        const startAuctionTime = event?.AuctionStartDate ? parseISO(event.AuctionStartDate).getTime() : null;
        const endAuctionTime = event?.AuctionEndDate ? parseISO(event.AuctionEndDate).getTime() : null;

        if (!startTime || !startAuctionTime || !endTime || !endAuctionTime) {
          durations[event.EventID] = '';
          return;
        }

        const adjustedCurrentTime = now + 5.5 * 60 * 60 * 1000;

        let countdown = '';

        if (adjustedCurrentTime < startTime) {
          countdown = formatTimeRemaining(startTime - adjustedCurrentTime);
        } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
          countdown = formatTimeRemaining(endTime - adjustedCurrentTime);
        } else if (adjustedCurrentTime >= startAuctionTime && adjustedCurrentTime < endAuctionTime) {
          countdown = formatTimeRemaining(endAuctionTime - adjustedCurrentTime);
        } else {
          countdown = '00d 00h 00m 00s';
        }

        durations[event.EventID] = countdown;
      });

      setAuctionDurations(durations);
    };

    calculateAuctionDurations();

    const intervalId = setInterval(calculateAuctionDurations, 1000);
    return () => clearInterval(intervalId);
  }, [data]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <EventPageMainBox>
      <EventPageInnerBox>
        <Typography variant="h4">Events</Typography>
        <Link href="/events/upsert-event">
          <AddIconButton title="Create Event" />
        </Link>
      </EventPageInnerBox>
      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {(!loading.isProgress || !loading.isLoading) && data.length > 0 ? (
          currentData().map((event: EventData, index: number) => (
            <Grid key={index} item xs={12} sm={6} lg={4}>
              <EventCard event={event} auctionDurations={auctionDurations} />
            </Grid>
          ))
        ) : (
          <EmptyCard title={loading.isProgress || loading.isLoading ? 'Loading...' : 'You have not created any event yet.'} />
        )}
      </Grid>
      {data.length > 12 && (
        <Stack sx={{ gap: 2, alignItems: 'center', p: 2 }}>
          <Pagination
            sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
            count={count}
            size="medium"
            page={page}
            showFirstButton
            showLastButton
            variant="combined"
            color="primary"
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </EventPageMainBox>
  );
};

export default EventPage;
