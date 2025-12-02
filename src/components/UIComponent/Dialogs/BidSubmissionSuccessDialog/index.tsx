import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { PopupTransition } from 'components/@extended/Transitions';
import { BidSubmissionSuccessDialogProps } from 'types/dialog';

const BidSubmissionSuccessDialog = ({ open, handleClose, auctionStartDate }: BidSubmissionSuccessDialogProps) => {
  const dubaiDate = auctionStartDate ? new Date(auctionStartDate.replace('Z', '')) : null;
  return (
    <Dialog
      open={open}
      TransitionComponent={PopupTransition}
      keepMounted
      onClose={handleClose}
      aria-describedby="bid-submission-success-description"
    >
      <Box sx={{ p: 1, py: 1.5 }}>
        <DialogTitle>Bid(s) successfully submitted.</DialogTitle>
        <DialogContent>
          <DialogContentText id="bid-submission-success-description">
            The auction will start on{' '}
            {dubaiDate ? (
              <strong>
                {dubaiDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                })}{' '}
                at{' '}
                {dubaiDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}{' '}
                (Dubai time).
              </strong>
            ) : null}
            Only the five highest bidders on each lot are qualified for the auction.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default BidSubmissionSuccessDialog;
