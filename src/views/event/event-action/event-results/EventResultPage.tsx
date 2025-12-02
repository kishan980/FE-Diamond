'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { Diagram, DocumentUpload } from 'iconsax-react';
import {
  EventResultChildBox,
  EventResultChildContainer,
  EventResultMainContainer,
  MainBoxContainer,
  StyledUploadButton,
  StyledEventResultsTotalValueContent,
} from './EventResult.styled';
import Loader from 'components/Loader';
import { StyledCountdownTimeRow, StyledEventOnGoingTitle, StyledTotalValueWrapper } from 'views/common.styled';
import { EventServices } from 'services/event/event.services';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { LoadingState } from 'types/table';
import { EventByIdData } from 'services/event/types';
import { GetBidderListData } from 'services/event/event-action/event-results/type';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';

const eventAnalytics = '/assets/images/maintenance/event-analytics.svg';
const eventOutcomes = '/assets/images/maintenance/event-outcomes.svg';

const EventResultsPage = () => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isConfirmLoading: false });
  const [isAnalysing, setIsAnalysing] = useState<boolean | null>(null);
  const [eventCategories, setEventCategories] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [eventData, setEventData] = useState<EventByIdData>();
  const [bidderData, setBidderData] = useState<GetBidderListData[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const fetchEventDetails = async (id: number) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));

    try {
      const res = await EventServices.getEventById(id);

      if (typeof res !== 'string' && res.success) {
        setEventCategories(res.data.refEventCategoryID_EventCategoryMas);
        setIsAnalysing(res.data.IsAnalysing);
        setEventData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event details:', error);
      toast.error('Error fetching event details.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const fetchBidderData = async (category: number | null) => {
    if (!category) return;
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const entityType = category === 1 ? 'Rough' : 'Polished';
      const res = await EventResultsServices.getBidderListData(eventId, entityType);
      if (typeof res !== 'string' && res.success) setBidderData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bidder list:', error);
      toast.error('Failed to fetch bidder list');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleRevisedStatus = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    try {
      // const res = await EventResultsServices.isValidReservePrice(Number(eventId));
      // if (typeof res !== 'string' && res.success) {
      //   if (res.data.length === 1) alert('Please enter valid reserve price in lot(s).');
      // }
      if (isAnalysing === false) await EventResultsServices.revisedStatus({ eventId });
      router.push(`/events/event-outcomes/analysing-outcome/${eventId}`);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error updating status:', error);
      toast.error('Failed to update status:', error);
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  useEffect(() => {
    if (eventId) fetchEventDetails(eventId);
  }, [eventId]);

  useEffect(() => {
    if (eventCategories) fetchBidderData(eventCategories);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventCategories]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const startTime = eventData?.startDate ? parseISO(eventData.startDate).getTime() : null;
      const endTime = eventData?.TenderEndDate ? parseISO(eventData.TenderEndDate).getTime() : null;
      const auctionStartTime = eventData?.AuctionStartDate ? parseISO(eventData?.AuctionStartDate).getTime() : null;
      const auctionEndTime = eventData?.AuctionTimerEndDate ? parseISO(eventData?.AuctionTimerEndDate).getTime() : null;
      const dubaiDate = eventData?.AuctionStartDate ? new Date(eventData?.AuctionStartDate.replace('Z', '')) : null;

      if (!startTime || !endTime || !auctionEndTime) {
        setRemainingTime('');
        return;
      }

      const currentTime = new Date().getTime();
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      let newRemainingTime = '';
      if (adjustedCurrentTime < startTime) {
        newRemainingTime = 'Event is upcoming';
      } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
        newRemainingTime = 'Bid submission period is ongoing';
      } else if (auctionStartTime !== null && adjustedCurrentTime >= endTime && adjustedCurrentTime < auctionStartTime) {
        if (dubaiDate) {
          newRemainingTime = `Auction starts on ${dubaiDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
          })} at ${dubaiDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })} (Dubai time).`;
        }
      } else if (auctionStartTime !== null && adjustedCurrentTime >= auctionStartTime && adjustedCurrentTime < auctionEndTime) {
        newRemainingTime = 'Auction is ongoing';
      }

      setRemainingTime(newRemainingTime);
    };
    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [eventData]);

  useEffect(() => {
    if (isAnalysing) router.push('/events/event-outcomes/analysing-outcome/' + eventId);
  }, [eventId, isAnalysing, router]);

  return loading.isLoading ? (
    <Loader />
  ) : loading.isProgress ? (
    <Backdrop sx={{ color: '#07bc0c', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
      <CircularProgress color="primary" />
    </Backdrop>
  ) : (
    <Box sx={{ width: '100%' }}>
      {remainingTime ? (
        <MainBoxContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Image
              src={eventOutcomes}
              alt="Event Outcomes"
              width={isSmallDown ? 350 : 396}
              height={isSmallDown ? 325 : 370}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <StyledTotalValueWrapper>
              <StyledEventResultsTotalValueContent>
                <>
                  {remainingTime === 'Bid submission period is ongoing' && (
                    <StyledEventOnGoingTitle>
                      <Typography variant="h2" color="text.primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {remainingTime}
                      </Typography>
                    </StyledEventOnGoingTitle>
                  )}
                  {remainingTime === 'Event is upcoming' && (
                    <StyledCountdownTimeRow>
                      <Typography variant="h2" color="text.primary" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                        {remainingTime}
                      </Typography>
                    </StyledCountdownTimeRow>
                  )}
                  {remainingTime.startsWith('Auction starts on') && (
                    <StyledCountdownTimeRow>
                      <Typography variant="h2" color="text.primary" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                        {remainingTime}
                      </Typography>
                    </StyledCountdownTimeRow>
                  )}
                  {remainingTime === 'Auction is ongoing' && (
                    <StyledCountdownTimeRow>
                      <Typography variant="h2" color="text.primary" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                        {remainingTime}
                      </Typography>
                    </StyledCountdownTimeRow>
                  )}
                </>
              </StyledEventResultsTotalValueContent>
            </StyledTotalValueWrapper>
          </Box>
        </MainBoxContainer>
      ) : (
        <MainBoxContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Image
              src={eventAnalytics}
              alt="Event Analytics"
              width={isSmallDown ? 350 : 396}
              height={isSmallDown ? 325 : 370}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
          <EventResultMainContainer>
            <Typography variant="h4" gutterBottom>
              Event Outcomes
            </Typography>

            <EventResultChildContainer sx={{ flexDirection: { xs: 'column', sm: 'row' }, maxWidth: bidderData?.length > 0 ? 630 : 250 }}>
              {bidderData?.length > 0 && (
                <EventResultChildBox>
                  <Link href={`/events/event-outcomes/manualBids/${eventId}?eventCategory=${eventCategories}`}>
                    <StyledUploadButton variant="contained" color="primary" size="large" startIcon={<DocumentUpload />}>
                      Manual Bids for Tendered Goods
                    </StyledUploadButton>
                  </Link>
                </EventResultChildBox>
              )}
              <EventResultChildBox>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ width: '100%' }}
                  onClick={() => setIsConfirmDialogOpen(true)}
                  startIcon={<Diagram />}
                >
                  Analysing Outcomes
                </Button>
              </EventResultChildBox>
            </EventResultChildContainer>
          </EventResultMainContainer>
        </MainBoxContainer>
      )}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleRevisedStatus}
        loading={loading}
        title={'Are you sure that you want to analyse the outcomes and that Lothere are no pending paper bids to manually encode?'}
      />
    </Box>
  );
};

export default EventResultsPage;
