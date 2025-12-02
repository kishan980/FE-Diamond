'use client';
import { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import { PopupTransition } from 'components/@extended/Transitions';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { GetPopupAuctionRoomData } from 'services/bidder/all-lots/type';
import { AuctionRoomProcessDialogProps } from 'types/dialog';
import AnimateButton from 'components/@extended/AnimateButton';

const AuctionRoomProcessDialog = ({ open, handleClose, handleAuctionClick, eventId, loading }: AuctionRoomProcessDialogProps) => {
  const [data, setData] = useState<GetPopupAuctionRoomData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuctionMessage = async () => {
    setIsLoading(true);
    try {
      const res = await AllLotsServices.getPopupAuction(eventId);
      if (typeof res !== 'string' && res.success) setData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) getAuctionMessage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Dialog
      open={open}
      TransitionComponent={PopupTransition}
      keepMounted
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
      }}
      aria-describedby="bid-submission-success-description"
    >
      <Box sx={{ p: 2, minWidth: 400 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {data.map((item, index) => (
              <Fragment key={index}>
                <DialogTitle sx={{ fontWeight: 600 }}>{item?.AuctionTitle}</DialogTitle>
                <DialogContent>
                  <Typography component="div" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6, textAlign: 'center' }}>
                    <span dangerouslySetInnerHTML={{ __html: item?.AuctionMsg }} />
                  </Typography>
                </DialogContent>
              </Fragment>
            ))}
            <DialogActions sx={{ justifyContent: 'center', pt: 2 }}>
              <AnimateButton>
                <LoadingButton loading={loading.isAuctionButtonLoading} onClick={handleAuctionClick} variant="contained">
                  Ok
                </LoadingButton>
              </AnimateButton>
            </DialogActions>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default AuctionRoomProcessDialog;
