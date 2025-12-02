import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { CloseCircle, Trash } from 'iconsax-react';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { DeleteDialogProps } from 'types/dialog';

const AlertDeletetPopup = ({ title, open, handleClose, onConfirm, loading }: DeleteDialogProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    TransitionComponent={PopupTransition}
    keepMounted
    maxWidth="xs"
    aria-labelledby="item-delete-title"
    aria-describedby="item-delete-description"
    PaperProps={{
      sx: {
        zIndex: 10,
      },
    }}
  >
    <DialogContent sx={{ mt: 2, my: 1 }}>
      <Stack alignItems="center" spacing={3.5}>
        <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
          <Trash style={{ width: 40, height: 40 }} />
        </Avatar>
        <Stack>
          <Typography variant="h4" align="center">
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ width: 1 }}>
          <Button
            fullWidth
            disabled={loading?.isDeleteLoading}
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            startIcon={<CloseCircle />}
          >
            Cancel
          </Button>
          <LoadingButton
            fullWidth
            loading={loading?.isDeleteLoading}
            color="error"
            variant="contained"
            onClick={onConfirm}
            startIcon={<Trash style={{ color: '#fff' }} />}
          >
            Delete
          </LoadingButton>
        </Stack>
      </Stack>
    </DialogContent>
  </Dialog>
);

export default AlertDeletetPopup;
