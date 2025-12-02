'use client';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { CloseCircle } from 'iconsax-react';
import { FC } from 'react';
import { CustomDialogProps } from 'types/dialog';

const CustomDialog: FC<CustomDialogProps> = ({ open, onClose, title, content, actions, maxWidth = 'sm', fullWidth = false }) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
    <DialogTitle>
      {title}
      <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 3 }}>
        <CloseCircle />
      </IconButton>
    </DialogTitle>
    {content && <DialogContent sx={{ p: { xs: 0, sm: 2.5 }, mt: 1 }}>{content}</DialogContent>}
    {actions && <DialogActions>{actions}</DialogActions>}
  </Dialog>
);

export default CustomDialog;
