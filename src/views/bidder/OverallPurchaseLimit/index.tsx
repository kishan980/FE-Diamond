'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingButton } from '@mui/lab';
import parseISO from 'date-fns/parseISO';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import {
  OverallPurchaseBoxContainer,
  OverallPurchaseLimitFieldContainer,
  OverallPurchaseLimitFilterContainer,
  OverallPurchaseLimitMinAndMaxContainer,
} from './OverallPurchaseLimit.styled';
import OverallPurchaseLimitEventTimer from './OverallPurchaseLimitEventTimer';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import AnimateButton from 'components/@extended/AnimateButton';
import { LoadingState } from 'types/table';
import { AddOverallPurchaseLimitParams, GetOverallPurchaseLimitParams } from 'services/bidder/overall-purchase-limit/type';
import { EventServices } from 'services/event/event.services';
import { EventByIdData } from 'services/event/types';
import { OverallPurchaseLimitServices } from 'services/parameter/overallPurchaseLimit/overallPurchaseLimit.services';
import { OverallPurchaseLimitBidderServices } from 'services/bidder/overall-purchase-limit/overallPurchaseLimit.services';
import CircularLoader from 'components/CircularLoader';
import { formatDurationFromMs } from 'utils/format-date';

const OverallPurchaseLimitPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID } = imageDetails?.currentUserDetails ?? {};

  const [remainingTime, setRemainingTime] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isTimerLoading: false });
  const [eventData, setEventData] = useState<EventByIdData>();
  const [originalValues, setOriginalValues] = useState({ upperText: '', explanationText: '' });
  const [formValues, setFormValues] = useState<AddOverallPurchaseLimitParams>({ overallResult: 0, overallDesc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    setFormValues((prev) => ({ ...prev, overallResult: value }));
  };

  const handleSliderChange = (_: Event, val: number | number[]) => {
    setFormValues((prev) => ({ ...prev, overallResult: val as number }));
  };

  const handleSubmit = async (e: FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!remainingTime) {
      toast.error('Your Purchase Limit cannot be defined or modified as the bid submission period is now closed.');
      setIsSubmitting(false);
      return;
    }
    const maxLimit = eventData?.MaximumPurchaseLimit ?? 0;
    if (formValues.overallResult > maxLimit) {
      toast.error(`Purchase limit cannot exceed US$ ${maxLimit.toLocaleString()}`);
      setIsSubmitting(false);
      return;
    }
    const params = { eventId, bidderId: entityID, purchaseLimit: formValues.overallResult };
    try {
      const res = await OverallPurchaseLimitBidderServices.updateOverAllPuchaseLimit(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Purchase limit updated successfully');
        router.push(`/bidder/${eventId}/all-lots`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating overall purchase limit:', error);
      toast.error('Failed to update overall purchase limit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPurchaseLimit = async () => {
    try {
      const params: GetOverallPurchaseLimitParams = { eventId, bidderId: entityID };
      const res = await OverallPurchaseLimitBidderServices.getOverAllPuchaseLimit(params);
      if (typeof res !== 'string' && res.success) {
        setFormValues((prev) => ({
          ...prev,
          overallResult: res.data.maximumPurchaseLimit ?? Number(process.env.NEXT_PUBLIC_DEFAULT_PURCHASE_LIMIT),
        }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching overall purchase limit data:', error);
      toast.error('Failed to fetch overall purchase details');
    }
  };

  const fetchEventDetails = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isCircularLoading: true, isTimerLoading: true }));

      const res = await EventServices.getEventById(eventId);
      if (typeof res !== 'string' && res.success) setEventData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event details:', error);
      toast.error('Failed to fetch basic details');
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isCircularLoading: false, isTimerLoading: false }));
    }
  };

  const stripHtmlTags = (html: string) =>
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

  const fetchOverallPurchaseLimit = async () => {
    try {
      const overallPurchaseData = await OverallPurchaseLimitServices.overallPurchaseLimitData();
      if (typeof overallPurchaseData !== 'string' && (overallPurchaseData as any).success) {
        const { upperText, explanationText } = (overallPurchaseData as any).data;

        setOriginalValues({ upperText, explanationText });
        setFormValues((prev) => ({ ...prev, overallDesc: stripHtmlTags(explanationText) }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching overall purchase limit data:', error);
      toast.error('Error fetching overall purchase limit data.');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading((prev) => ({ ...prev, isCircularLoading: true }));
      await Promise.all([fetchPurchaseLimit(), fetchOverallPurchaseLimit()]);
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!eventId) return;
    fetchEventDetails(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_EVENT_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchEventDetails(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const startTime = eventData?.startDate ? parseISO(eventData.startDate).getTime() : null;
      const endTime = eventData?.TenderEndDate ? parseISO(eventData.TenderEndDate).getTime() : null;
      const auctionStartTime = eventData?.AuctionStartDate ? parseISO(eventData.AuctionStartDate).getTime() : null;

      if (!startTime || !endTime) {
        setRemainingTime('');
        return;
      }

      const currentTime = new Date().getTime();
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      let newRemainingTime = '';
      if (adjustedCurrentTime < startTime) newRemainingTime = 'Not Open Yet';
      else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime)
        newRemainingTime = formatDurationFromMs(endTime - adjustedCurrentTime);
      else if (auctionStartTime !== null && auctionStartTime && adjustedCurrentTime >= endTime && adjustedCurrentTime < auctionStartTime) {
        newRemainingTime = formatDurationFromMs(auctionStartTime - adjustedCurrentTime);
      } else {
        newRemainingTime = 'Closed';
      }

      setRemainingTime(newRemainingTime);
    };
    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [eventData]);
  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <MainCard content={false} title="Purchase Limit">
          <OverallPurchaseLimitEventTimer eventData={eventData} eventId={eventId} remainingTime={remainingTime} loading={loading} />
          <Divider />
          <Box sx={{ px: 1.5 }}>
            <Typography variant="body1" color="text.secondary" dangerouslySetInnerHTML={{ __html: originalValues.upperText }} />
          </Box>
          <Divider />
          <OverallPurchaseLimitFilterContainer>
            <Box>
              <OverallPurchaseLimitMinAndMaxContainer>
                <Typography variant="subtitle2" color="text.secondary">
                  US$ {(Number(process.env.NEXT_PUBLIC_DEFAULT_PURCHASE_LIMIT) || 0).toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  US$ {(eventData?.MaximumPurchaseLimit || 0).toLocaleString()}
                </Typography>
              </OverallPurchaseLimitMinAndMaxContainer>
              <Slider
                name="overallResult"
                aria-label="Purchase Limit"
                min={Number(process.env.NEXT_PUBLIC_DEFAULT_PURCHASE_LIMIT) || 0}
                max={eventData?.MaximumPurchaseLimit}
                value={formValues.overallResult}
                onChange={handleSliderChange}
                valueLabelDisplay="on"
                sx={{ mt: 2.5 }}
                step={1}
              />
            </Box>
            <OverallPurchaseLimitFieldContainer>
              <FormInput
                id="overallResult"
                name="overallResult"
                label="Purchase Limit (US$)"
                value={formValues.overallResult}
                onChange={handleInputChange}
                sx={{ width: '100%', maxWidth: { xs: '100%', sm: '220px' } }}
              />
              <AnimateButton>
                <LoadingButton sx={{ width: { xs: '100%', sm: 'auto' } }} loading={isSubmitting} type="submit" variant="contained">
                  Define Purchase Limit
                </LoadingButton>
              </AnimateButton>
            </OverallPurchaseLimitFieldContainer>
          </OverallPurchaseLimitFilterContainer>
          <Divider />
          <Box sx={{ padding: 1.5 }}>
            <OverallPurchaseBoxContainer>{formValues.overallDesc}</OverallPurchaseBoxContainer>
          </Box>
        </MainCard>
      </form>
    </>
  );
};

export default OverallPurchaseLimitPage;
