import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Trash } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const DeleteIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton color="error" onClick={onClick} sx={{ padding: '4px' }}>
      <Trash size={20} style={{ marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default DeleteIconButton;
