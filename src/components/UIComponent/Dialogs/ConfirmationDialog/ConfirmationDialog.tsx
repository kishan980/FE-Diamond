'use client';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import { CloseCircle, TickCircle } from 'iconsax-react';
import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonMainBoxContainer, ConfirmationDialogMainBox } from './ConfirmationDialog.styled';
import { ConfirmationDialogProps } from 'types/dialog';

const ConfirmationDialog = ({ open, title, onConfirm, onCancel, loading }: ConfirmationDialogProps) => (
  <Dialog
    open={open}
    onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') onCancel();
    }}
  >
    <ConfirmationDialogMainBox>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 500, padding: 0 }}>{title}</DialogTitle>
      <ButtonMainBoxContainer>
        <LoadingButton
          size="small"
          variant="contained"
          type="submit"
          onClick={onConfirm}
          startIcon={<TickCircle style={{ color: 'white' }} />}
          loading={loading?.isConfirmLoading}
        >
          Yes
        </LoadingButton>
        <Button
          disabled={loading?.isConfirmLoading}
          onClick={onCancel}
          color="secondary"
          size="small"
          variant="outlined"
          startIcon={<CloseCircle />}
        >
          Cancel
        </Button>
      </ButtonMainBoxContainer>
    </ConfirmationDialogMainBox>
  </Dialog>
);

export default ConfirmationDialog;
