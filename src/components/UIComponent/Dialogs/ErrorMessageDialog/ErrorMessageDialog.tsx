import { DialogTitle, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { PopupTransition } from 'components/@extended/Transitions';
import { ErrorMessageDialogProps } from 'types/dialog';

const ErrorMessageDialog = ({ open, handleClose, bidValue }: ErrorMessageDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={PopupTransition}
      keepMounted
      fullScreen={fullScreen}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">
        <Typography variant="h6" color="error">
          Error Message
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description" sx={{ mt: 1 }}>
          Submitted bid value should be greater than to the minimum new bid per Carat US$/ct. <strong>${bidValue?.toFixed(2)}</strong>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" color="error" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorMessageDialog;
