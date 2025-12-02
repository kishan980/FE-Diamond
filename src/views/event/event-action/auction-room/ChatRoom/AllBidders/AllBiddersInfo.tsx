import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import { useEffect, useState } from 'react';
import { StyledInfoCard, StyledSkeletonLeftCard, StyledSkeletonRightCard } from '../AllLots/ChatAllLots.styled';
import InfoRow from '../InfoRow';
import AuctionTimeCard from '../AuctionTimeCard';
import { UpdateTimeInMinutesParams } from 'services/event/event-action/auction-room/type';
import { AuctionRoomEventServices } from 'services/event/event-action/auction-room/auctionRoom.services';
import { AllBiddersInfoProps } from 'types/events';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';

const AllBiddersInfo = ({ data, selectEventId, loading }: AllBiddersInfoProps) => {
  const theme = useTheme();
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));
  const initialValues = { extraTime: '' };
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { errors, values, touched, handleBlur, setSubmitting, handleChange, setFieldValue, handleSubmit, isSubmitting } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      extraTime: Yup.number().min(1, 'Minimum 1 minute').required('Time is required'),
    }),
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: { extraTime: string }) => {
    try {
      const params: UpdateTimeInMinutesParams = {
        eventId: Number(selectEventId),
        timeInMinutes: Number(values.extraTime),
      };
      const res = await AuctionRoomEventServices.extendAuctionDuration(params);
      if (typeof res !== 'string' && res.success) toast.success('Time extended successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the Extended Time:', error);
      toast.error('An error occurred while saving the Extended Time.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExtraTimeClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmDialogOpen(false);
    handleSubmit();
  };

  useEffect(() => {
    const fetchedTime = data[0]?.selectBidders?.[0]?.TimeEstimation;
    if (fetchedTime && !values.extraTime) {
      setFieldValue('extraTime', String(fetchedTime));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setFieldValue]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack direction={isSmallDown ? 'column' : 'row'} spacing={2} alignItems="stretch" justifyContent="space-between">
          {loading?.isProgress ? (
            <>
              {/* Skeleton for Left Info Card */}
              <StyledSkeletonLeftCard variant="outlined">
                <Stack spacing={2}>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i}>
                      <Skeleton animation="wave" height={20} width="100%" />
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </StyledSkeletonLeftCard>

              {/* Skeleton for Right Time Panel */}
              <StyledSkeletonRightCard variant="outlined">
                <Stack spacing={3}>
                  <Skeleton animation="wave" variant="text" height={126} width="100%" />
                  <Skeleton animation="wave" variant="rectangular" height={70} width="100%" />
                </Stack>
              </StyledSkeletonRightCard>
            </>
          ) : (
            <>
              {/* Left Side - Lot Info */}
              <StyledInfoCard variant="outlined">
                <CardContent>
                  <Stack spacing={0.75}>
                    <InfoRow label="Number of lots auctioned:" value={data[0]?.selectBidders[0]?.LotAuctioned} />
                    <Divider />
                    <InfoRow label="Number of bidders logged in:" value={data[0]?.selectBidders[0]?.LoginUser} />
                  </Stack>
                </CardContent>
              </StyledInfoCard>

              {/* Right Side - Time Left + Input */}
              <AuctionTimeCard
                timeLeft={data[0]?.selectBidders[0]?.TimeLeft}
                values={values}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleAddExtraTimeClick={handleAddExtraTimeClick}
                isSubmitting={isSubmitting}
                buttonLabel="Extend Auction Duration"
              />
            </>
          )}
        </Stack>
      </form>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        loading={loading}
        onConfirm={handleConfirmSubmit}
        title="Are you sure that you want to extend the auction duration on every lot?"
      />
    </>
  );
};

export default AllBiddersInfo;
