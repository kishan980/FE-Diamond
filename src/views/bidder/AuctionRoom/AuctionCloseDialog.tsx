import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { PopupTransition } from 'components/@extended/Transitions';
import { AuctionCloseDialogProps } from 'types/dialog';

const AuctionCloseDialog = ({ open, handleClose, onConfirm }: AuctionCloseDialogProps) => (
  <Dialog
    open={open}
    TransitionComponent={PopupTransition}
    keepMounted
    onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
    }}
    aria-describedby="auction-close-description"
  >
    <Box sx={{ p: 2 }}>
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>Auction is now closed</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6, textAlign: 'center' }}>
          Thank you for your participation. <br />
          Results will be announced shortly.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pt: 2 }}>
        <Button variant="contained" onClick={onConfirm}>
          Ok
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default AuctionCloseDialog;
